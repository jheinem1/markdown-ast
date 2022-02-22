export type MarkdownNode =
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

export type Break = {
    type: "break";
    size: number;
};

export type Text = {
    type: "text";
    text: string;
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    code: boolean;
    url: string;
};

export type Paragraph = {
    type: "paragraph";
    text: Array<Text | Image>;
};

export type Header = {
    type: "header";
    level: number;
    text: Array<Text | Image>;
};

export type Blockquote = {
    type: "blockquote";
    text: Array<MarkdownNode>;
    indent: number;
};

export type ListItem = {
    type: "list-item";
    text: Array<Text | Image>;
    children: ListItem[];
    indent: number;
    completed?: boolean;
};

export type List = {
    type: "list";
    items: ListItem[];
};

export type OrderedList = {
    type: "ordered-list";
    items: ListItem[];
};

export type TaskItem = ListItem & {
    type: "task-item";
    completed: boolean;
};

export type TaskList = {
    type: "task-list";
    items: TaskItem[];
};

export type CodeLine = {
    type: "code-line";
    text: string;
    indent: number;
};

export type CodeBlock = {
    type: "code-block";
    code: CodeLine[];
    language: string;
};

export type Image = {
    type: "image";
    url: string;
    alt: string;
};

export type HorizontalRule = {
    type: "horizontal-rule";
};

export type XMLNode = {
    type: "xml";
    name: string;
    attributes: {
        [key: string]: string;
    };
    children: XMLNode[];
};

export type Table = {
    type: "table";
    header: Array<Text | Image>;
    rows: Array<Text | Image>[];
};
