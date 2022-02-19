import { t } from "@rbxts/t";

type MarkdownNode =
    | Break
    | Text
    | Paragraph
    | Heading
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

type Heading = {
    type: "heading";
    level: number;
    text: Array<Text | Image>;
};

type Blockquote = {
    type: "blockquote";
    text: Array<Text | Image | Break | Blockquote | Heading | List>;
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
    const trimmed = string.match(str, "^[ \t]*(.*)[ \t]*$")[0];
    return t.string(trimmed) ? trimmed : "";
}

function startsWith(str: string, prefix: string) {
    return string.match(str, "^" + prefix) !== undefined;
}

function getIndentation(indentStr: string) {
    let indent = 0;
    indentStr.split("").forEach((char) => {
        switch (char) {
            case " ":
                indent++;
                break;
            case "\t":
                indent += 4;
                break;
        }
    });
    return indent;
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
            urlEnd = (string.sub(text, i).find("^https?://[^ ]*")[1] ?? 0) - 1;
            url = string.sub(text, i, urlEnd);
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

export function parse(markdown: string) {
    const lines = string.split(markdown, "\n");
    const nodes = new Array<MarkdownNode>();
    let currentNode: MarkdownNode | undefined;
    let previousNode: MarkdownNode | undefined;
    for (const line of lines) {
        const trimmedLine = trim(line);
        if (string.match(trimmedLine, "^#+[ \t]*.*$")[0]) {
            const level = (string.match(trimmedLine, "^#+")[0] as string).size();
            const text = parseText((string.match(trimmedLine, "^#+[ \t]*(.*)$")[0] as string | undefined) ?? "");
            currentNode = { type: "heading", level, text };
        } else if (startsWith(trimmedLine, "> ")) {
            if (previousNode?.type === "blockquote") {
                previousNode.text.push(...parseText(string.sub(trimmedLine, 2)));
            } else {
                currentNode = {
                    type: "blockquote",
                    text: parseText(string.sub(trimmedLine, 2)),
                    indent: getIndentation(tostring(string.match(line, "^([ \t])*>")[0] ?? "")),
                };
            }
        } else if (startsWith(trimmedLine, "[%-%*%+] ")) {
            const indent = getIndentation(tostring(string.match(line, "^([ \t])*[-*]")[0] ?? ""));
            const text = parseText(string.sub(trimmedLine, 3));
            if (previousNode?.type === "list") {
                let previousItem: ListItem | undefined;
                let item = previousNode.items[previousNode.items.size() - 1];
                while (indent > item.indent) {
                    previousItem = item;
                    item = item.children[item.children.size() - 1];
                }
                if (previousItem) previousItem.children.push({ type: "list-item", text, children: [], indent });
                else previousNode.items.push({ type: "list-item", text: [], children: [], indent });
            } else
                currentNode = {
                    type: "list",
                    items: [{ type: "list-item", text, children: [], indent }],
                };
        } else if (startsWith(trimmedLine, "%d+%. ")) {
            const indent = getIndentation(tostring(string.match(line, "^([ \t])*%d+%")[0] ?? ""));
            const text = parseText(string.sub(trimmedLine, 4));
            if (previousNode?.type === "ordered-list") {
                let previousItem: ListItem | undefined;
                let item = previousNode.items[previousNode.items.size() - 1];
                while (indent > item.indent) {
                    previousItem = item;
                    item = item.children[item.children.size() - 1];
                }
                if (previousItem) previousItem.children.push({ type: "list-item", text, children: [], indent });
                else previousNode.items.push({ type: "list-item", text: [], children: [], indent });
            } else
                currentNode = {
                    type: "table",
                    header: text,
                    rows: [],
                };
        } else if (startsWith(trimmedLine, "```")) {
            const language = string.match(trimmedLine, "^");
        }
    }
    return nodes;
}
