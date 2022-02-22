The entire README.md converted to an AST (serialized with [this](https://github.com/jheinem1/Lua-Serializer)).
```lua
local readme = {
    [1] = {
        ["type"] = "header",
        ["text"] = {
            [1] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = false,
                ["bold"] = false,
                ["text"] = "@rbxts/markdown-ast",
                ["strikethrough"] = false,
                ["italic"] = false
            }
        },
        ["level"] = 1
    },
    [2] = {
        ["size"] = 1,
        ["type"] = "break"
    },
    [3] = {
        ["text"] = {
            [1] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = false,
                ["bold"] = false,
                ["text"] = "A simple module that converts Markdown text to a Roact tree.",
                ["strikethrough"] = false,
                ["italic"] = false
            }
        },
        ["type"] = "paragraph"
    },
    [4] = {
        ["size"] = 1,
        ["type"] = "break"
    },
    [5] = {
        ["type"] = "header",
        ["text"] = {
            [1] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = false,
                ["bold"] = false,
                ["text"] = "Purpose",
                ["strikethrough"] = false,
                ["italic"] = false
            }
        },
        ["level"] = 2
    },
    [6] = {
        ["size"] = 1,
        ["type"] = "break"
    },
    [7] = {
        ["text"] = {
            [1] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = false,
                ["bold"] = false,
                ["text"] = "This is designed to parse Markdown syntax into an AST, or Abstract Syntax Tree. This makes the syntax easily traversable for parsing later. One of the biggest advantages of this is that Markdown is extremely close to plain text in terms of formatting and paired with a renderer, can create useful multimedia documents without messing around with Roblox GUI directly (and saving memory too!).",
                ["strikethrough"] = false,
                ["italic"] = false
            }
        },
        ["type"] = "paragraph"
    },
    [8] = {
        ["size"] = 1,
        ["type"] = "break"
    },
    [9] = {
        ["text"] = {
            [1] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = false,
                ["bold"] = false,
                ["text"] = "I personally plan on using this to create another module that parses this AST into a Roact tree for all types of situations (release TBD).",
                ["strikethrough"] = false,
                ["italic"] = false
            }
        },
        ["type"] = "paragraph"
    },
    [10] = {
        ["size"] = 1,
        ["type"] = "break"
    },
    [11] = {
        ["text"] = {
            [1] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = false,
                ["bold"] = false,
                ["text"] = "This implementation ",
                ["strikethrough"] = false,
                ["italic"] = false
            },
            [2] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = false,
                ["bold"] = true,
                ["text"] = "does not",
                ["strikethrough"] = false,
                ["italic"] = false
            },
            [3] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = false,
                ["bold"] = false,
                ["text"] = " use string patterns or regex, and has no dependencies other than ",
                ["strikethrough"] = false,
                ["italic"] = false
            },
            [4] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = true,
                ["bold"] = false,
                ["text"] = "roblox-ts",
                ["strikethrough"] = false,
                ["italic"] = false
            },
            [5] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = false,
                ["bold"] = false,
                ["text"] = " and ",
                ["strikethrough"] = false,
                ["italic"] = false
            },
            [6] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = true,
                ["bold"] = false,
                ["text"] = "@rbxts/types",
                ["strikethrough"] = false,
                ["italic"] = false
            },
            [7] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = false,
                ["bold"] = false,
                ["text"] = ".",
                ["strikethrough"] = false,
                ["italic"] = false
            }
        },
        ["type"] = "paragraph"
    },
    [12] = {
        ["size"] = 1,
        ["type"] = "break"
    },
    [13] = {
        ["type"] = "header",
        ["text"] = {
            [1] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = false,
                ["bold"] = false,
                ["text"] = "Implementation",
                ["strikethrough"] = false,
                ["italic"] = false
            }
        },
        ["level"] = 2
    },
    [14] = {
        ["size"] = 1,
        ["type"] = "break"
    },
    [15] = {
        ["text"] = {
            [1] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = false,
                ["bold"] = true,
                ["text"] = "NOTE:",
                ["strikethrough"] = false,
                ["italic"] = false
            },
            [2] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = false,
                ["bold"] = false,
                ["text"] = " As this is build completely from scratch, this does ",
                ["strikethrough"] = false,
                ["italic"] = false
            },
            [3] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = false,
                ["bold"] = true,
                ["text"] = "not",
                ["strikethrough"] = false,
                ["italic"] = false
            },
            [4] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = false,
                ["bold"] = false,
                ["text"] = " have parody with other markdown implementations and may treat whitespace differently. Any text fed to this should probably be specifically written for this implementation otherwise some parsing errors may occur (though this should be compatible with most well-written markdown).",
                ["strikethrough"] = false,
                ["italic"] = false
            }
        },
        ["type"] = "paragraph"
    },
    [16] = {
        ["size"] = 1,
        ["type"] = "break"
    },
    [17] = {
        ["text"] = {
            [1] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = false,
                ["bold"] = false,
                ["text"] = "In terms of supported features, this supports the ",
                ["strikethrough"] = false,
                ["italic"] = false
            },
            [2] = {
                ["type"] = "text",
                ["url"] = "https://www.markdownguide.org/basic-syntax/",
                ["code"] = false,
                ["bold"] = false,
                ["text"] = "base syntax",
                ["strikethrough"] = false,
                ["italic"] = false
            },
            [3] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = false,
                ["bold"] = false,
                ["text"] = ", as well as some extra features, including...",
                ["strikethrough"] = false,
                ["italic"] = false
            }
        },
        ["type"] = "paragraph"
    },
    [18] = {
        ["size"] = 2,
        ["type"] = "break"
    },
    [19] = {
        ["text"] = {
            [1] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = false,
                ["bold"] = false,
                ["text"] = "...that are common in other implementations.",
                ["strikethrough"] = false,
                ["italic"] = false
            }
        },
        ["type"] = "paragraph"
    },
    [20] = {
        ["size"] = 1,
        ["type"] = "break"
    },
    [21] = {
        ["text"] = {
            [1] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = false,
                ["bold"] = false,
                ["text"] = "This does ",
                ["strikethrough"] = false,
                ["italic"] = false
            },
            [2] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = false,
                ["bold"] = true,
                ["text"] = "not",
                ["strikethrough"] = false,
                ["italic"] = false
            },
            [3] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = false,
                ["bold"] = false,
                ["text"] = " support XML right now, and if it does, it will only support Roact elements.",
                ["strikethrough"] = false,
                ["italic"] = false
            }
        },
        ["type"] = "paragraph"
    },
    [22] = {
        ["size"] = 1,
        ["type"] = "break"
    },
    [23] = {
        ["type"] = "header",
        ["text"] = {
            [1] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = false,
                ["bold"] = false,
                ["text"] = "Usage",
                ["strikethrough"] = false,
                ["italic"] = false
            }
        },
        ["level"] = 2
    },
    [24] = {
        ["size"] = 1,
        ["type"] = "break"
    },
    [25] = {
        ["type"] = "code-block",
        ["language"] = "typescript",
        ["code"] = {
            [1] = {
                ["indent"] = 0,
                ["type"] = "code-line",
                ["text"] = "```typescript"
            },
            [2] = {
                ["indent"] = 0,
                ["type"] = "code-line",
                ["text"] = "const markdown = `# Big Heading"
            },
            [3] = {
                ["indent"] = 0,
                ["type"] = "code-line",
                ["text"] = ""
            },
            [4] = {
                ["indent"] = 0,
                ["type"] = "code-line",
                ["text"] = "- Item 1"
            },
            [5] = {
                ["indent"] = 0,
                ["type"] = "code-line",
                ["text"] = "- Item 2"
            },
            [6] = {
                ["indent"] = 0,
                ["type"] = "code-line",
                ["text"] = "- Item 3"
            },
            [7] = {
                ["indent"] = 0,
                ["type"] = "code-line",
                ["text"] = ""
            },
            [8] = {
                ["indent"] = 0,
                ["type"] = "code-line",
                ["text"] = "1. Item 1"
            },
            [9] = {
                ["indent"] = 0,
                ["type"] = "code-line",
                ["text"] = "2. Item 2"
            },
            [10] = {
                ["indent"] = 0,
                ["type"] = "code-line",
                ["text"] = "3. Item 3"
            },
            [11] = {
                ["indent"] = 0,
                ["type"] = "code-line",
                ["text"] = ""
            },
            [12] = {
                ["indent"] = 0,
                ["type"] = "code-line",
                ["text"] = "**bold text**"
            },
            [13] = {
                ["indent"] = 0,
                ["type"] = "code-line",
                ["text"] = "`"
            },
            [14] = {
                ["indent"] = 0,
                ["type"] = "code-line",
                ["text"] = "parse(markdown); // Markdown AST"
            }
        }
    },
    [26] = {
        ["text"] = {
            [1] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = false,
                ["bold"] = false,
                ["text"] = "All nodes in the AST have a relatively simple structure (See ",
                ["strikethrough"] = false,
                ["italic"] = false
            },
            [2] = {
                ["type"] = "text",
                ["url"] = "https://github.com/jheinem1/markdown-ast/blob/98387f13cbf80dc57f3abcabc3fac5c102769b96/src/types.ts",
                ["code"] = false,
                ["bold"] = false,
                ["text"] = "types.ts",
                ["strikethrough"] = false,
                ["italic"] = false
            },
            [3] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = false,
                ["bold"] = false,
                ["text"] = " for definitions)",
                ["strikethrough"] = false,
                ["italic"] = false
            }
        },
        ["type"] = "paragraph"
    },
    [27] = {
        ["size"] = 1,
        ["type"] = "break"
    },
    [28] = {
        ["type"] = "header",
        ["text"] = {
            [1] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = false,
                ["bold"] = false,
                ["text"] = "Credits",
                ["strikethrough"] = false,
                ["italic"] = false
            }
        },
        ["level"] = 3
    },
    [29] = {
        ["size"] = 1,
        ["type"] = "break"
    },
    [30] = {
        ["text"] = {
            [1] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = false,
                ["bold"] = false,
                ["text"] = "Inspired by the original ",
                ["strikethrough"] = false,
                ["italic"] = false
            },
            [2] = {
                ["type"] = "text",
                ["url"] = "https://github.com/aleclarson/markdown-ast",
                ["code"] = false,
                ["bold"] = false,
                ["text"] = "markdown-ast",
                ["strikethrough"] = false,
                ["italic"] = false
            },
            [3] = {
                ["type"] = "text",
                ["url"] = "",
                ["code"] = false,
                ["bold"] = false,
                ["text"] = " written in JavaScript.",
                ["strikethrough"] = false,
                ["italic"] = false
            }
        },
        ["type"] = "paragraph"
    },
    [31] = {
        ["size"] = 1,
        ["type"] = "break"
    }
}
```