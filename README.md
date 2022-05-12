# @rbxts/markdown-ast

![](https://d33wubrfki0l68.cloudfront.net/f1f475a6fda1c2c4be4cac04033db5c3293032b4/513a4/assets/images/markdown-mark-white.svg)

A simple module that converts Markdown text to an AST without patterns or RegEx.

## Purpose

This is designed to parse Markdown syntax into an AST, or Abstract Syntax Tree. This makes the syntax easily traversable for parsing later. One of the biggest advantages of this is that Markdown is extremely close to plain text in terms of formatting and paired with a renderer, can create useful multimedia documents without messing around with Roblox GUI directly (and saving memory too!).

I personally plan on using this to create another module that parses this AST into a Roact tree for all types of situations (release TBD).

This implementation **does not** use string patterns or regex, and has no dependencies other than `roblox-ts` and `@rbxts/types`.

## Implementation

**NOTE:** As this is build completely from scratch, this does **not** have parody with other markdown implementations and may treat whitespace differently. Any text fed to this should probably be specifically written for this implementation otherwise some parsing errors may occur (though this should be compatible with most well-written markdown).

In terms of supported features, this supports the [base syntax](https://www.markdownguide.org/basic-syntax/), as well as some extra features, including...

- [Strikethrough](https://www.markdownguide.org/extended-syntax/strikethrough/)
- [Image dimensions](https://garrettgman.github.io/rmarkdown/authoring_pandoc_markdown.html#images)

This does **not** support XML right now, and if it does, it will only support Roact elements.

## Usage

```typescript
const markdown = `
# Big Heading

- Item 1
- Item 2
- Item 3

1. Item 1
2. Item 2
3. Item 3

**bold text**
`

parse(markdown); // Markdown AST
```

All nodes in the AST have a relatively simple structure (See [types.ts](https://github.com/jheinem1/markdown-ast/blob/98387f13cbf80dc57f3abcabc3fac5c102769b96/src/types.ts) for definitions)

### Credits

Inspired by the original [markdown-ast](https://github.com/aleclarson/markdown-ast) written in JavaScript.