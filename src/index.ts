import { t } from "@rbxts/t";

type MarkdownNode =
    | Break
    | Text
    | Paragraph
    | Header
    | Blockquote
    | ListItem
    | List
    | OrderedList
    | TaskItem
    | TaskList
    | CodeBlock
    | Image
    | HorizontalRule
    | XMLNode
    | Table;

type Break = {
    type: "break";
    size: number;
};

type Text = {
    type: "text";
    text: string;
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    code: boolean;
    url: string;
};

type Paragraph = {
    type: "paragraph";
    text: Array<Text | Image>;
};

type Header = {
    type: "header";
    level: number;
    text: Array<Text | Image>;
};

type Blockquote = {
    type: "blockquote";
    text: Array<MarkdownNode>;
    indent: number;
};

type ListItem = {
    type: "list-item";
    text: Array<Text | Image>;
    children: ListItem[];
    indent: number;
    completed?: boolean;
};

type List = {
    type: "list";
    items: ListItem[];
};

type OrderedList = {
    type: "ordered-list";
    items: ListItem[];
};

type TaskItem = ListItem & {
    type: "task-item";
    completed: boolean;
};

type TaskList = {
    type: "task-list";
    items: TaskItem[];
};

type CodeBlock = {
    type: "codeblock";
    code: string;
    language: string;
};

type Image = {
    type: "image";
    url: string;
    alt: string;
};

type HorizontalRule = {
    type: "horizontal-rule";
};

type XMLNode = {
    type: "xml";
    name: string;
    attributes: {
        [key: string]: string;
    };
    children: XMLNode[];
};

type Table = {
    type: "table";
    header: Array<Text | Image>;
    rows: Array<Text | Image>[];
};

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

function parseText(text: string, bold = false, italic = false, strikethrough = false, code = false, url = "") {
    const textTable = text.split("");
    const textNodes = new Array<Text | Image>();
    let previousChar = "";
    let urlEnd = -1;
    for (let i = 0; i < textTable.size(); i++) {
        const char = textTable[i];
        switch (char) {
            // bold
            case "*":
                if (previousChar === "*") bold = !bold;
                break;
            // italic
            case "_":
                if (previousChar === "_") italic = !italic;
                break;
            // strikethrough
            case "~":
                if (previousChar === "~") strikethrough = !strikethrough;
                break;
            // code
            case "`":
                code = !code;
                break;
            // url
            case "[":
                const urlTextTable = new Array<string>();
                for (let j = i + 1; j < textTable.size(); j++) {
                    const urlChar = textTable[j];
                    if (urlChar === "]") {
                        urlEnd = j;
                        break;
                    }
                    urlTextTable.push(urlChar);
                }
                if (textTable[i + 2 + urlTextTable.size()] === "(") {
                    const urlTable = new Array<string>();
                    for (let j = i + 1 + urlTextTable.size(); j < textTable.size(); j++) {
                        const urlChar = textTable[j];
                        if (urlChar === ")") {
                            urlEnd = j;
                            break;
                        }
                        urlTable.push(urlChar);
                    }
                    textNodes.push(
                        ...parseText(
                            urlTextTable.size() ? urlTextTable.join("") : urlTable.join(""),
                            bold,
                            italic,
                            strikethrough,
                            code,
                            url,
                        ),
                    );
                    i += urlTextTable.size() + urlTable.size() + 4;
                    continue;
                }
                break;
            // image
            case "!":
                if (textTable[i + 1] === "[") {
                    const imageTextTable = new Array<string>();
                    for (let j = i + 2; j < textTable.size(); j++) {
                        const imageChar = textTable[j];
                        if (imageChar === "]") {
                            urlEnd = j;
                            break;
                        }
                        imageTextTable.push(imageChar);
                    }
                    if (textTable[i + 3 + imageTextTable.size()] === "(") {
                        const imageTable = new Array<string>();
                        for (let j = i + 2 + imageTextTable.size(); j < textTable.size(); j++) {
                            const imageChar = textTable[j];
                            if (imageChar === ")") {
                                urlEnd = j;
                                break;
                            }
                            imageTable.push(imageChar);
                        }
                        textNodes.push({
                            type: "image",
                            url: imageTextTable.size() ? imageTextTable.join("") : imageTable.join(""),
                            alt: imageTextTable.join(""),
                        });
                        i += imageTextTable.size() + imageTable.size() + 4;
                        continue;
                    }
                }
                break;
        }
        let previousNode = textNodes[textNodes.size() - 1] as Text | Image | undefined;
        while (previousNode?.type === "image") {
            previousNode = textNodes[textNodes.size() - 2] as Text | Image | undefined;
        }
        // url
        if (i <= urlEnd) url = previousNode?.url ?? "";
        else if (char === "h" && textTable[i + 1] === "t" && textTable[i + 2] === "t" && textTable[i + 3] === "p") {
            urlEnd = (text.sub(i).find("^https?://[^ ]*")[1] ?? 0) - 1;
            url = text.sub(i, urlEnd);
        }
        if (
            previousNode &&
            previousNode.bold === bold &&
            previousNode.italic === italic &&
            previousNode.strikethrough === strikethrough &&
            previousNode.code === code
        )
            // this can be optimized- table concatenation is faster
            previousNode.text += char;
        else textNodes.push({ type: "text", text: char, bold, italic, strikethrough, code, url });
        previousChar = char;
    }
    return textNodes;
}

export function parse(markdown: string): MarkdownNode[] {
    const lines = markdown.split("\n");
    const nodes = new Array<MarkdownNode>();
    let previousNode: MarkdownNode | undefined;
    for (let i = 0; i < lines.size(); i++) {
        const line = lines[i];
        const indent = getIndentation(line);
        const trimmedLine = trim(line);
        if (trimmedLine.size() === 0) {
            if (previousNode?.type === "break") previousNode.size++;
            else nodes.push({ type: "break", size: 1 });
        } else if (startsWith(trimmedLine, "#")) {
            const level = getHeaderLevel(trimmedLine);
            const text = parseText(trimmedLine.sub(level + 1));
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
        }
    }
    // for (const line of lines) {
    //     const trimmedLine = trim(line);
    //     if (string.match(trimmedLine, "^#+[ \t]*.*$")[0]) {
    //         const level = (string.match(trimmedLine, "^#+")[0] as string).size();
    //         const text = parseText((string.match(trimmedLine, "^#+[ \t]*(.*)$")[0] as string | undefined) ?? "");
    //         currentNode = { type: "heading", level, text };
    //     } else if (startsWith(trimmedLine, "> ")) {
    //         if (previousNode?.type === "blockquote") {
    //             previousNode.text.push(...parseText(string.sub(trimmedLine, 2)));
    //         } else {
    //             currentNode = {
    //                 type: "blockquote",
    //                 text: parseText(string.sub(trimmedLine, 2)),
    //                 indent: getIndentation(tostring(string.match(line, "^([ \t])*>")[0] ?? "")),
    //             };
    //         }
    //     } else if (startsWith(trimmedLine, "[%-%*%+] ")) {
    //         const indent = getIndentation(tostring(string.match(line, "^([ \t])*[-*]")[0] ?? ""));
    //         const text = parseText(string.sub(trimmedLine, 3));
    //         if (previousNode?.type === "list") {
    //             let previousItem: ListItem | undefined;
    //             let item = previousNode.items[previousNode.items.size() - 1];
    //             while (indent > item.indent) {
    //                 previousItem = item;
    //                 item = item.children[item.children.size() - 1];
    //             }
    //             if (previousItem) previousItem.children.push({ type: "list-item", text, children: [], indent });
    //             else previousNode.items.push({ type: "list-item", text: [], children: [], indent });
    //         } else
    //             currentNode = {
    //                 type: "list",
    //                 items: [{ type: "list-item", text, children: [], indent }],
    //             };
    //     } else if (startsWith(trimmedLine, "%d+%. ")) {
    //         const indent = getIndentation(tostring(string.match(line, "^([ \t])*%d+%")[0] ?? ""));
    //         const text = parseText(string.sub(trimmedLine, 4));
    //         if (previousNode?.type === "ordered-list") {
    //             let previousItem: ListItem | undefined;
    //             let item = previousNode.items[previousNode.items.size() - 1];
    //             while (indent > item.indent) {
    //                 previousItem = item;
    //                 item = item.children[item.children.size() - 1];
    //             }
    //             if (previousItem) previousItem.children.push({ type: "list-item", text, children: [], indent });
    //             else previousNode.items.push({ type: "list-item", text: [], children: [], indent });
    //         } else
    //             currentNode = {
    //                 type: "table",
    //                 header: text,
    //                 rows: [],
    //             };
    //     } else if (startsWith(trimmedLine, "```")) {
    //         const language = string.match(trimmedLine, "^");
    //     }
    // }
    return nodes;
}
