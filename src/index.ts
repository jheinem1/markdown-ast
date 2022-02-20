import { Text, Image, MarkdownNode, ListItem, CodeLine } from "types";

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
        let altCharPos: number;
        for (altCharPos = 0; altCharPos < strArray.size(); altCharPos++) {
            const currentChar = strArray[altCharPos];
            if (currentChar !== altChar) {
                return false;
            }
            return altCharPos >= 2;
        }
        return false;
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

function parseText(text: string, bold = "", italic = "", strikethrough = "", code = "", url = "") {
    const textTable = text.split("");
    const textNodes = new Array<Text | Image>();
    let previousChar = "";
    for (let i = 0; i < textTable.size(); i++) {
        let currentChar = textTable[i];
        if (currentChar === "\\" && !isEscaped(text.sub(i))) {
            // ignore unescaped backslashes
            currentChar = "";
        } else if (currentChar === "*" && previousChar === "*" && !isEscaped(text.sub(i - 2))) {
            textNodes.pop();
            bold = bold !== "**" ? "**" : "";
        } else if (currentChar === "_" && textTable[i + 1] !== "_" && !isEscaped(text.sub(i - 1))) {
            textNodes.pop();
            italic = italic !== "_" ? "_" : "";
        } else if (currentChar === "*" && textTable[i + 1] !== "*" && !isEscaped(text.sub(i - 1))) {
            italic = italic !== "*" ? "*" : "";
        } else if (currentChar === "`" && !isEscaped(text.sub(i - 1))) {
            code = code !== "`" ? "`" : "";
            // } else if (currentChar === "[" && !isEscaped(text.sub(i - 1))) {
            //     let text
        }
        if (currentChar)
            textNodes.push({
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
    // const urlEnd = -1;
    // for (let i = 0; i < textTable.size(); i++) {
    //     const char = textTable[i];
    // switch (char) {
    //     // bold
    //     case "*":
    //         if (previousChar === "*") bold = !bold;
    //         break;
    //     // italic
    //     case "_":
    //         if (previousChar === "_") italic = !italic;
    //         break;
    //     // strikethrough
    //     case "~":
    //         if (previousChar === "~") strikethrough = !strikethrough;
    //         break;
    //     // code
    //     case "`":
    //         code = !code;
    //         break;
    //     // url
    //     case "[":
    //         const urlTextTable = new Array<string>();
    //         for (let j = i + 1; j < textTable.size(); j++) {
    //             const urlChar = textTable[j];
    //             if (urlChar === "]") {
    //                 urlEnd = j;
    //                 break;
    //             }
    //             urlTextTable.push(urlChar);
    //         }
    //         if (textTable[i + 2 + urlTextTable.size()] === "(") {
    //             const urlTable = new Array<string>();
    //             for (let j = i + 1 + urlTextTable.size(); j < textTable.size(); j++) {
    //                 const urlChar = textTable[j];
    //                 if (urlChar === ")") {
    //                     urlEnd = j;
    //                     break;
    //                 }
    //                 urlTable.push(urlChar);
    //             }
    //             textNodes.push(
    //                 ...parseText(
    //                     urlTextTable.size() ? urlTextTable.join("") : urlTable.join(""),
    //                     bold,
    //                     italic,
    //                     strikethrough,
    //                     code,
    //                     url,
    //                 ),
    //             );
    //             i += urlTextTable.size() + urlTable.size() + 4;
    //             continue;
    //         }
    //         break;
    //     // image
    //     case "!":
    //         if (textTable[i + 1] === "[") {
    //             const imageTextTable = new Array<string>();
    //             for (let j = i + 2; j < textTable.size(); j++) {
    //                 const imageChar = textTable[j];
    //                 if (imageChar === "]") {
    //                     urlEnd = j;
    //                     break;
    //                 }
    //                 imageTextTable.push(imageChar);
    //             }
    //             if (textTable[i + 3 + imageTextTable.size()] === "(") {
    //                 const imageTable = new Array<string>();
    //                 for (let j = i + 2 + imageTextTable.size(); j < textTable.size(); j++) {
    //                     const imageChar = textTable[j];
    //                     if (imageChar === ")") {
    //                         urlEnd = j;
    //                         break;
    //                     }
    //                     imageTable.push(imageChar);
    //                 }
    //                 textNodes.push({
    //                     type: "image",
    //                     url: imageTextTable.size() ? imageTextTable.join("") : imageTable.join(""),
    //                     alt: imageTextTable.join(""),
    //                 });
    //                 i += imageTextTable.size() + imageTable.size() + 4;
    //                 continue;
    //             }
    //         }
    //         break;
    // }
    // let previousNode = textNodes[textNodes.size() - 1] as Text | Image | undefined;
    // while (previousNode?.type === "image") {
    //     previousNode = textNodes[textNodes.size() - 2] as Text | Image | undefined;
    // }
    // // url
    // if (i <= urlEnd) url = previousNode?.url ?? "";
    // else if (char === "h" && textTable[i + 1] === "t" && textTable[i + 2] === "t" && textTable[i + 3] === "p") {
    //     urlEnd = (text.sub(i).find("^https?://[^ ]*")[1] ?? 0) - 1;
    //     url = text.sub(i, urlEnd);
    // }
    // if (
    //     previousNode &&
    //     previousNode.bold === bold &&
    //     previousNode.italic === italic &&
    //     previousNode.strikethrough === strikethrough &&
    //     previousNode.code === code
    // )
    //     // this can be optimized- table concatenation is faster
    //     previousNode.text += char;
    // else textNodes.push({ type: "text", text: char, bold, italic, strikethrough, code, url });
    // previousChar = char;
    // }
    return textNodes;
}

export function parse(markdown: string): MarkdownNode[] {
    const lines = markdown.split("\n");
    const nodes = new Array<MarkdownNode>();
    let previousNode: MarkdownNode | undefined;
    for (let i = 0; i < lines.size(); i++) {
        let line = lines[i];
        let indent = getIndentation(line);
        let trimmedLine = trim(line);
        if (trimmedLine.size() === 0) {
            if (previousNode?.type === "break") previousNode.size++;
            else nodes.push({ type: "break", size: 1 });
        } else if (startsWith(trimmedLine, "#")) {
            const level = getHeaderLevel(trimmedLine);
            const text = parseText(trimmedLine.sub(level + 1));
            nodes.push({ type: "header", level, text });
        } else if (isHeaderAlt(trimmedLine) && previousNode?.type === "paragraph") {
            const level = trimmedLine.sub(1, 1) === "=" ? 1 : 2;
            const text = previousNode.text;
            nodes.pop();
            nodes.push({ type: "header", level, text });
        } else if (startsWith(trimmedLine, "> ")) {
            if (previousNode?.type === "blockquote") previousNode.text = parse(trimmedLine.sub(2));
            else {
                const text = parseText(trimmedLine.sub(2));
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
                    text: parseText(trimmedLine.sub(2)),
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
            const language = trimmedLine.sub(3);
            const code = new Array<CodeLine>();
            while (trimmedLine !== "```") {
                code.push({ type: "code-line", text: trimmedLine, indent });
                line = lines[++i];
                indent = getIndentation(line);
                trimmedLine = trim(line);
            }
            nodes.push({ type: "code-block", language, code });
        }
    }
    return nodes;
}
