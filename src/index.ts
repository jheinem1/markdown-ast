import {
    Text,
    Image,
    MarkdownNode,
    ListItem,
    CodeLine,
    Blockquote,
    Break,
    CodeBlock,
    Header,
    HorizontalRule,
    List,
    OrderedList,
    Paragraph,
    Table,
    TaskItem,
    TaskList,
    XMLNode,
    CSSUnit,
    CSSUnitType,
} from "types";

export {
    MarkdownNode,
    Break,
    Text,
    Paragraph,
    Header,
    Blockquote,
    ListItem,
    List,
    OrderedList,
    TaskItem,
    TaskList,
    CodeBlock,
    Image,
    HorizontalRule,
    XMLNode,
    Table,
    CSSUnit,
    CSSUnitType,
};

export function parse(markdown: string): MarkdownNode[] {
    const lines = markdown.split("\n");
    const nodes = new Array<MarkdownNode>();
    let previousNode: MarkdownNode | undefined;
    for (let i = 0; i < lines.size(); i++) {
        let line = lines[i];
        let indent = getIndentation(line);
        let trimmedLine = trim(line);
        previousNode = nodes[nodes.size() - 1];
        if (trimmedLine.size() === 0) {
            if (previousNode?.type === "break") previousNode.size++;
            else nodes.push({ type: "break", size: 1 });
        } else if (startsWith(trimmedLine, "#")) {
            const level = getHeaderLevel(trimmedLine);
            const text = parseText(trimmedLine.sub(level + 2));
            nodes.push({ type: "header", level, text });
        } else if (isHeaderAlt(trimmedLine) && previousNode?.type === "paragraph") {
            const level = trimmedLine.sub(1, 1) === "=" ? 1 : 2;
            const text = previousNode.text;
            nodes.pop();
            nodes.push({ type: "header", level, text });
        } else if (startsWith(trimmedLine, "> ")) {
            if (previousNode?.type === "blockquote") previousNode.text = parse(trimmedLine.sub(3));
            else {
                const text = parseText(trimmedLine.sub(3));
                nodes.push({ type: "blockquote", text, indent });
            }
        } else if (startsWith(trimmedLine, "- ") || startsWith(trimmedLine, "* ") || startsWith(trimmedLine, "+ ")) {
            if (previousNode?.type === "list") {
                let previousItem: ListItem | undefined;
                let item = previousNode.items[previousNode.items.size() - 1] as ListItem | undefined;
                while (indent > (item?.indent ?? 0)) {
                    previousItem = item;
                    item = previousItem?.children[previousItem.children.size() - 1] as ListItem | undefined;
                }
                (previousItem?.children ?? previousNode.items).push({
                    type: "list-item",
                    text: parseText(trimmedLine.sub(3)),
                    children: [],
                    indent,
                });
            }
        } else if (isOrderedListItem(trimmedLine)) {
            const text = parseText(trimOrderedListItemNumber(trimmedLine));
            if (previousNode?.type === "ordered-list") {
                let previousItem: ListItem | undefined;
                let item = previousNode.items[previousNode.items.size() - 1] as ListItem | undefined;
                while (indent > (item?.indent ?? 0)) {
                    previousItem = item;
                    item = previousItem?.children[previousItem.children.size() - 1] as ListItem | undefined;
                }
                (previousItem?.children ?? previousNode.items).push({
                    type: "list-item",
                    text,
                    children: [],
                    indent,
                });
            } else {
                nodes.push({
                    type: "ordered-list",
                    items: [
                        {
                            type: "list-item",
                            text,
                            children: [],
                            indent,
                        },
                    ],
                });
            }
        } else if (isHorizontalRule(trimmedLine)) {
            nodes.push({ type: "horizontal-rule" });
        } else if (startsWith(trimmedLine, "```")) {
            const language = trimmedLine.sub(4);
            const code = new Array<CodeLine>();
            while (trimmedLine !== "```") {
                code.push({ type: "code-line", text: trimmedLine, indent });
                line = lines[++i];
                indent = getIndentation(line);
                trimmedLine = trim(line);
            }
            nodes.push({ type: "code-block", language, code });
        } else {
            nodes.push({ type: "paragraph", text: parseText(trimmedLine) });
        }
    }
    return nodes;
}

function trim(str: string) {
    const strArray = string.split(str, "");
    let trimStart = 0;
    {
        let trimChar = strArray[0];
        while (trimChar === " " || trimChar === "\t") {
            trimStart++;
            trimChar = strArray[trimStart];
        }
    }
    let trimEnd = strArray.size() - 1;
    {
        let trimChar = strArray[trimEnd];
        while (trimChar === " " || trimChar === "\t") {
            trimEnd--;
            trimChar = strArray[trimEnd];
        }
    }
    return string.sub(str, trimStart + 1, trimEnd + 1);
}

function startsWith(str: string, prefix: string) {
    return str.sub(1, prefix.size()) === prefix;
}

function getIndentation(indentStr: string) {
    const strArray = indentStr.split("");
    let indent = 0;
    let indentChar = strArray[0];
    while (indentChar === " " || indentChar === "\t") {
        switch (indentChar) {
            case " ":
                indent++;
                break;
            case "\t":
                indent += 4;
                break;
        }
        indentChar = strArray[indent];
    }
    return indent;
}

function getHeaderLevel(headerStr: string) {
    const strArray = headerStr.split("");
    let headerLevel = 0;
    let headerChar = strArray[0];
    while (headerChar === "#") {
        headerLevel++;
        headerChar = strArray[headerLevel];
    }
    return headerLevel;
}

function isOrderedListItem(listItemStr: string) {
    const strArray = listItemStr.split("");
    const digits = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    let digit = tonumber(strArray[0]);
    let digitPos = 0;
    while (digits.has(digit ?? -1)) {
        digit = tonumber(strArray[digitPos]);
        digitPos++;
    }
    return digit && strArray[digitPos + 1] === ".";
}

function trimOrderedListItemNumber(listItemStr: string) {
    const strArray = listItemStr.split("");
    const digits = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    let digit = tonumber(strArray[0]);
    let digitPos = 0;
    while (digits.has(digit ?? -1)) {
        digit = tonumber(strArray[digitPos]);
        digitPos++;
    }
    return listItemStr.sub(digitPos + 3);
}

function isHorizontalRule(hrStr: string) {
    const strArray = hrStr.split("");
    const hrChars = new Set(["-", "*", "_"]);
    const hrChar = strArray[0];
    if (hrChars.has(hrChar)) {
        let hrCharPos: number;
        for (hrCharPos = 0; hrCharPos < strArray.size(); hrCharPos++) {
            const currentChar = strArray[hrCharPos];
            if (currentChar !== hrChar) {
                return false;
            }
            return hrCharPos >= 3;
        }
        return false;
    }
    return false;
}

function isHeaderAlt(altStr: string) {
    const strArray = altStr.split("");
    const altChars = new Set(["=", "-"]);
    const altChar = strArray[0];
    if (altChars.has(altChar)) {
        for (const char of strArray) if (char !== altChar) return false;
        return true;
    }
    return false;
}

function isEscaped(str: string) {
    const strArray = str.split("");
    let escapes = 0;
    for (let i = strArray.size() - 1; i >= 0; i--) {
        if (strArray[i] === "\\") escapes++;
        else break;
    }
    return escapes % 2 === 1;
}

function isValidURL(urlStr: string) {
    const strArray = urlStr.split("");
    if (strArray[0] === "[" && strArray.size() >= 3) {
        let currentChar = strArray[1];
        let i = 1;
        while (currentChar !== "]" && i < strArray.size()) currentChar = strArray[++i];
        if (strArray[++i] === "(") {
            currentChar = strArray[++i];
            while (currentChar !== ")" && i < strArray.size()) currentChar = strArray[++i];
            return currentChar === ")";
        }
    }
    return false;
}

function getURLText(urlStr: string) {
    const strArray = urlStr.split("");
    const urlText = new Array<string>();
    let i = 1;
    if (strArray[0] === "[" && strArray.size() >= 3) {
        while (strArray[i] !== "]" && i < strArray.size()) {
            urlText.push(strArray[i]);
            i++;
        }
        return urlText.join("");
    }
}

function getURL(urlStr: string) {
    const strArray = urlStr.split("");
    if (strArray[0] === "[" && strArray.size() >= 3) {
        let currentChar = strArray[1];
        let i = 1;
        while (currentChar !== "]" && !isEscaped(urlStr.sub(1, i)) && i < strArray.size()) currentChar = strArray[++i];
        if (strArray[++i] === "(") {
            currentChar = strArray[i++];
            const url = new Array<string>();
            while (currentChar !== ")" && i < strArray.size()) {
                currentChar = strArray[i++];
                url.push(currentChar);
            }
            url.pop();
            return url.join("");
        }
    }
}

function getImageDimensions(textTable: readonly string[], dimensionStart: number) {
    let dimensionEnd = dimensionStart;
    let width: CSSUnit | undefined;
    let height: CSSUnit | undefined;
    if (textTable[dimensionStart] === "{") {
        do {} while (textTable[++dimensionEnd] !== "}" && dimensionEnd < textTable.size());
        for (let i = dimensionStart + 1; i < dimensionEnd; i++) {
            switch (textTable[i]) {
                case "w":
                    const propName = ["w"];
                    for (let _ = 0; _ < 4; _++) propName.push(textTable[++i]);
                    if (propName.join("") === "width") {
                        const num = new Array<string>();
                        i++;
                        while ((textTable[++i].byte()[0] <= 57 && textTable[i].byte()[0] >= 48) || textTable[i] === ".")
                            num.push(textTable[i]);
                        const value = tonumber(num.join(""));
                        if (value)
                            if (textTable[i] === "p" && textTable[i + 1] === "x")
                                width = { unit: CSSUnitType.PIXEL, value };
                            else if (textTable[i] === "%") width = { unit: CSSUnitType.PERCENT, value };
                    }
                    break;
                case "h":
                    const propName2 = ["h"];
                    for (let _ = 0; _ < 5; _++) propName2.push(textTable[i]);
                    if (propName2.join("") === "height") {
                        const num = new Array<string>();
                        i++;
                        while ((textTable[++i].byte()[0] <= 57 && textTable[i].byte()[0] >= 48) || textTable[i] === ".")
                            num.push(textTable[i]);
                        const value = tonumber(num.join(""));
                        if (value)
                            if (textTable[i] === "p" && textTable[i + 1] === "x")
                                height = { unit: CSSUnitType.PIXEL, value };
                            else if (textTable[i] === "%") height = { unit: CSSUnitType.PERCENT, value };
                    }
                    break;
            }
        }
    }
    return { width, height, extraSize: width || height ? dimensionStart - dimensionEnd : 0 };
}

function parseText(text: string, bold = "", italic = "", strikethrough = "", code = "", url = "") {
    const textTable: readonly string[] = text.split("");
    const roughTextNodes = new Array<Text | Image>();
    let previousChar = "";
    for (let i = 0; i < textTable.size(); i++) {
        let currentChar = textTable[i];
        if (currentChar === "\\" && !isEscaped(text.sub(i))) {
            // ignore unescaped backslashes
            currentChar = "";
        } else if (currentChar === "*" && previousChar === "*" && !isEscaped(text.sub(1, i - 2))) {
            roughTextNodes.pop();
            currentChar = "";
            bold = bold !== "**" ? "**" : "";
        } else if (currentChar === "_" && textTable[i + 1] !== "_" && !isEscaped(text.sub(1, i - 1))) {
            currentChar = "";
            roughTextNodes.pop();
            italic = italic !== "_" ? "_" : "";
        } else if (currentChar === "*" && textTable[i + 1] !== "*" && !isEscaped(text.sub(1, i - 1))) {
            currentChar = "";
            italic = italic !== "*" ? "*" : "";
        } else if (currentChar === "`" && !isEscaped(text.sub(1, i))) {
            currentChar = "";
            code = code !== "`" ? "`" : "";
        } else if (currentChar === "[" && !isEscaped(text.sub(i - 1)) && isValidURL(text.sub(i + 1))) {
            const urlText = getURLText(text.sub(i + 1)) ?? "";
            const urlLink = getURL(text.sub(i + 1)) ?? "";
            const urlNodes = parseText(urlText, bold, italic, strikethrough, code, urlLink);
            i += urlText.size() + urlLink.size() + 3;
            urlNodes.forEach((node) => roughTextNodes.push(node));
            previousChar = "";
            continue;
        } else if (currentChar === "!" && !isEscaped(text.sub(i - 1)) && isValidURL(text.sub(i + 2))) {
            const imageAlt = getURLText(text.sub(i + 2)) ?? "";
            const imageURL = getURL(text.sub(i + 2)) ?? "";
            i += imageAlt.size() + imageURL.size() + 4;
            const { width, height, extraSize } = getImageDimensions(textTable, i + 1);
            i += extraSize;
            roughTextNodes.push({ type: "image", alt: imageAlt, url: imageURL, width: width, height: height });
            previousChar = "";
            continue;
        }
        if (currentChar)
            roughTextNodes.push({
                type: "text",
                text: currentChar,
                bold: !!bold,
                italic: !!italic,
                strikethrough: !!strikethrough,
                code: !!code,
                url,
            });
        previousChar = currentChar;
    }
    let previousText: Text | undefined;
    const textNodes = roughTextNodes.filter((node) => {
        if (node.type === "text") {
            if (
                previousText &&
                previousText.bold === node.bold &&
                previousText.italic === node.italic &&
                previousText.strikethrough === node.strikethrough &&
                previousText.code === node.code &&
                previousText.url === node.url
            ) {
                previousText.text += node.text;
                return false;
            }
            previousText = node;
        }
        return true;
    });
    return textNodes;
}
