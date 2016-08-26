import sqlTokenTypes from "xr/sqlFormatter/sqlTokenTypes";

export default class SqlTokenizer {
    /**
     * @param {Object} regex
     *  @param {String} regex.boundaries
     *  @param {String} regex.reservedToplevel
     *  @param {String} regex.reservedNewline
     *  @param {String} regex.reserved
     *  @param {String} regex.function
     */
    constructor(regex) {
        this.regex = regex;
    }

    /**
     * Takes a SQL string and breaks it into tokens.
     * Each token is an object with type and value.
     *
     * @param {String} input The SQL string
     * @return {Object[]} tokens An array of tokens.
     *  @return {String} token.type
     *  @return {String} token.value
     */
    tokenize(input) {
        const tokens = [];
        let token;

        // Keep processing the string until it is empty
        while (input.length) {
            // Get the next token and the token type
            token = this.getNextToken(input, token);
            // Advance the string
            input = input.substring(token.value.length);

            tokens.push(token);
        }
        return tokens;
    }

    getNextToken(input, previousToken) {
        const whitespaceToken = this.getWhitespaceToken(input);
        if (whitespaceToken) {
            return whitespaceToken;
        }

        const commentToken = this.getCommentToken(input);
        if (commentToken) {
            return commentToken;
        }

        const quotedStringToken = this.getQuotedStringToken(input);
        if (quotedStringToken) {
            return quotedStringToken;
        }

        const variableToken = this.getVariableToken(input);
        if (variableToken) {
            return variableToken;
        }

        const numberToken = this.getNumberToken(input);
        if (numberToken) {
            return numberToken;
        }

        const boundaryCharacterToken = this.getBoundaryCharacterToken(input);
        if (boundaryCharacterToken) {
            return boundaryCharacterToken;
        }

        const reservedWordToken = this.getReservedWordToken(input.toUpperCase(), previousToken);
        if (reservedWordToken) {
            return reservedWordToken;
        }

        const functionWordToken = this.getFunctionWordToken(input.toUpperCase());
        if (functionWordToken) {
            return functionWordToken;
        }

        return this.getNonReservedWordToken(input);
    }

    getWhitespaceToken(input) {
        const matches = input.match(/^\s+/);

        if (matches) {
            return {
                type: sqlTokenTypes.WHITESPACE,
                value: matches[0]
            };
        }
    }

    getCommentToken(input) {
        const firstChar = input.charAt(0);
        const secondChar = input.charAt(1);

        if (firstChar === "#" || (firstChar === "-" && secondChar === "-") || (firstChar === "/" && secondChar === "*")) {
            let type;
            let commentEnd;

            // Comment until end of line
            if (firstChar === "-" || firstChar === "#") {
                type = sqlTokenTypes.COMMENT;
                commentEnd = input.indexOf("\n");
            }
            // Comment until closing comment tag
            else {
                type = sqlTokenTypes.BLOCK_COMMENT;
                commentEnd = input.indexOf("*/") !== -1 && input.indexOf("*/") + 2;
            }
            // Query ends with unclosed comment
            if (commentEnd === -1) {
                commentEnd = input.length;
            }

            return {
                type,
                value: input.substring(0, commentEnd)
            };
        }
    }

    getQuotedStringToken(input) {
        const firstChar = input.charAt(0);

        if (firstChar === "\"" || firstChar === "'" || firstChar === "`" || firstChar === "[") {
            return {
                type: (firstChar === "`" || firstChar === "[") ? sqlTokenTypes.BACKTICK_QUOTE : sqlTokenTypes.QUOTE,
                value: this.getQuotedString(input)
            };
        }
    }

    getVariableToken(input) {
        if ((input.charAt(0) === "@" || input.charAt(0) === ":") && input.charAt(1)) {
            // Quoted variable name
            if (input.charAt(1) === "\"" || input.charAt(1) === "'" || input.charAt(1) === "`") {
                return {
                    type: sqlTokenTypes.VARIABLE,
                    value: input.charAt(0) + this.getQuotedString(input.substring(1))
                };
            }
            // Non-quoted variable name
            else {
                return this.getTokenOnFirstMatch({
                    input,
                    type: sqlTokenTypes.VARIABLE,
                    regex: new RegExp(`^(${input.charAt(0)}[a-zA-Z0-9\\._\\$]+)`)
                });
            }
        }
    }

    // Decimal, binary, or hex numbers
    getNumberToken(input) {
        return this.getTokenOnFirstMatch({
            input,
            type: sqlTokenTypes.NUMBER,
            regex: new RegExp(`^([0-9]+(\\.[0-9]+)?|0x[0-9a-fA-F]+|0b[01]+)($|\\s|"'\`|${this.regex.boundaries})`)
        });
    }

    // Punctuation and symbols
    getBoundaryCharacterToken(input) {
        return this.getTokenOnFirstMatch({
            input,
            type: sqlTokenTypes.BOUNDARY,
            regex: new RegExp(`^(${this.regex.boundaries})`)
        });
    }

    getReservedWordToken(input, previousToken) {
        // A reserved word cannot be preceded by a "."
        // this makes it so in "mytable.from", "from" is not considered a reserved word
        if (previousToken && previousToken.value && previousToken.value === ".") {
            return;
        }
        const toplevelReservedWordToken = this.getSpecificReservedWordToken({
            input,
            type: sqlTokenTypes.RESERVED_TOPLEVEL,
            regex: this.regex.reservedToplevel
        });

        if (toplevelReservedWordToken) {
            return toplevelReservedWordToken;
        }

        const newlineReservedWordToken = this.getSpecificReservedWordToken({
            input,
            type: sqlTokenTypes.RESERVED_NEWLINE,
            regex: this.regex.reservedNewline
        });

        if (newlineReservedWordToken) {
            return newlineReservedWordToken;
        }

        return this.getSpecificReservedWordToken({
            input,
            type: sqlTokenTypes.RESERVED,
            regex: this.regex.reserved
        });
    }

    getSpecificReservedWordToken({input, type, regex}) {
        const matches = input.match(new RegExp(`^(${regex})($|\\s|${this.regex.boundaries})`));

        if (matches) {
            return {
                type,
                value: input.substring(0, matches[1].length)
            };
        }
    }

    getFunctionWordToken(input) {
        // A function must be suceeded by "("
        // this makes it so "count(" is considered a function, but "count" alone is not
        const matches = input.match(new RegExp(`^(${this.regex.function}[(]|\\s|[)])`));

        if (matches) {
            return {
                type: sqlTokenTypes.RESERVED,
                value: input.substring(0, matches[1].length - 1)
            };
        }
    }

    getNonReservedWordToken(input) {
        return this.getTokenOnFirstMatch({
            input,
            type: sqlTokenTypes.WORD,
            regex: new RegExp(`^(.*?)($|\\s|["'\`]|${this.regex.boundaries})`)
        });
    }

    getTokenOnFirstMatch({input, type, regex}) {
        const matches = input.match(regex);

        if (matches) {
            return {type, value: matches[1]};
        }
    }

    getQuotedString(input) {
        // This checks for the following patterns:
        // 1. backtick quoted string using `` to escape
        // 2. square bracket quoted string (SQL Server) using ]] to escape
        // 3. double quoted string using "" or \" to escape
        // 4. single quoted string using "" or \" to escape
        const matches = input.match(new RegExp(
            "^(((`[^`]*($|`))+)|" +
            "((\\[[^\\]]*($|\\]))(\\][^\\]]*($|\\]))*)|" +
            "((\"[^\"\\\\]*(?:\\\\.[^\"\\\\]*)*(\"|$))+)|" +
            "(('[^'\\\\]*(?:\\\\.[^'\\\\]*)*('|$))+))"
        ));
        if (matches) {
            return matches[1];
        }
    }
}
