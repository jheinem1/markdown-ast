# @rbxts/markdown-ast

A simple module that converts Markdown text to a Roact tree.

## Purpose

This is designed to parse Markdown syntax into an AST, or Abstract Syntax Tree. This makes the syntax easily traversable for parsing later. One of the biggest advantages of this is that Markdown is extremely close to plain text in terms of formatting and paired with a renderer, can create useful multimedia documents without messing around with Roblox GUI directly (and saving memory too!).

I personally plan on using this to create another module that parses this AST into a Roact tree for all types of situations (release TBD).

## Implementation

**NOTE:** As this is build completely from scratch, this does **not** have parody with other markdown implementations and may treat whitespace differently. Any text fed to this should probably be specifically written for this implementation otherwise some parsing errors may occur (though this should be compatible with most well-written markdown).

In terms of supported features, this supports the [base syntax](https://www.markdownguide.org/basic-syntax/), as well as some extra features, including...

- Tables
- Strikethrough
- Task Lists
- Automatic URL Linking

...that are common in other implementations.

This does **not** support XML right now, and if it does, it will only support Roact elements.

## Usage

```typescript
const markdown = ```
# Big Heading

- Item 1
- Item 2
- Item 3

1. Item 1
2. Item 2
3. Item 3

**bold text**
\```
```

### Credits

Using @rbxts/t.

Inspired by the original [markdown-ast](https://github.com/aleclarson/markdown-ast) written in JavaScript.