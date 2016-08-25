import _ from "xr/_";

// Constants for token types
const TOKEN_TYPE_WHITESPACE = "whitespace";
const TOKEN_TYPE_WORD = "word";
const TOKEN_TYPE_QUOTE = "quote";
const TOKEN_TYPE_BACKTICK_QUOTE = "backtick-quote";
const TOKEN_TYPE_RESERVED = "reserved";
const TOKEN_TYPE_RESERVED_TOPLEVEL = "reserved-toplevel";
const TOKEN_TYPE_RESERVED_NEWLINE = "reserved-newline";
const TOKEN_TYPE_BOUNDARY = "boundary";
const TOKEN_TYPE_COMMENT = "comment";
const TOKEN_TYPE_BLOCK_COMMENT = "block-comment";
const TOKEN_TYPE_NUMBER = "number";
const TOKEN_TYPE_VARIABLE = "variable";

export default class SqlFormatter {
    /**
     * Builds regular expressions.
     *
     * @param {Object} cfg
     *  @param {Array} cfg.reservedWords Reserved words in SQL
     *  @param {Array} cfg.reservedToplevelWords Words that are set to new line and on first indent level
     *  @param {Array} cfg.reservedNewlineWords Words that are set to newline
     *  @param {Array} cfg.functionWords Words that are treated as functions
     */
    constructor({reservedWords, reservedToplevelWords, reservedNewlineWords, functionWords}) {
        // Regular expressions for tokenizing
        this.regexBoundaries = "(,|;|\\:|\\)|\\(|\\.|\\=|\\<|\\>|\\+|\\-|\\*|\\/|\\!|\\^|%|\\||&|#)";
        this.regexReserved = `(${reservedWords.join("|")})`;
        this.regexReservedToplevel = `(${reservedToplevelWords.join("|")})`;
        this.regexReservedNewline = `(${reservedNewlineWords.join("|")})`;
        this.regexFunction = `(${functionWords.join("|")})`;
    }

    /**
     * Format the whitespace in a SQL string to make it easier to read.
     *
     * @param {String} input The SQL input string
     * @return {String} formatted string
     */
    format(input) {
        let result = "";

        // Use an actual tab while formatting and then switch out spaces
        const tab = "\t";

        let indentLevel = 0;
        let newline = false;
        let inlineParentheses = false;
        let increaseSpecialIndent = false;
        let increaseBlockIndent = false;
        const indentTypes = [];
        let addedNewline = false;
        let inlineCount = 0;
        let inlineIndented = false;
        let clauseLimit = false;

        // Tokenize String
        const originalTokens = this.tokenize(input);

        // Remove existing whitespace
        const tokens = [];

        _(originalTokens).forEach((token, key) => {
            if (token.type !== TOKEN_TYPE_WHITESPACE) {
                token.key = key;
                tokens.push(token);
            }
        });

        // Format token by token
        _(tokens).forEach((token, key) => {
            let tokenValue = token.value;

            // If we are increasing the special indent level now
            if (increaseSpecialIndent) {
                indentLevel ++;
                indentTypes.unshift("special");
                increaseSpecialIndent = false;
            }
            // If we are increasing the block indent level now
            if (increaseBlockIndent) {
                indentLevel ++;
                indentTypes.unshift("block");
                increaseBlockIndent = false;
            }
            // If we need a new line before the token
            if (newline) {
                result = result.replace(/\s+$/, "");
                result += "\n" + tab.repeat(indentLevel);
                addedNewline = true;
                newline = false;
            }
            else {
                addedNewline = false;
            }
            // Display comments directly where they appear in the source
            if (token.type === TOKEN_TYPE_COMMENT || token.type === TOKEN_TYPE_BLOCK_COMMENT) {
                if (token.type === TOKEN_TYPE_BLOCK_COMMENT) {
                    const indent = tab.repeat(indentLevel);
                    result = result.replace(/\s+$/, "");
                    result += "\n" + indent;
                    tokenValue = tokenValue.replace("\n", "\n" + indent);
                }
                result += tokenValue;
                newline = true;

                return result;
            }

            if (inlineParentheses) {
                // End of inline parentheses
                if (token.value === ")") {
                    result = result.replace(/\s+$/, "");

                    if (inlineIndented) {
                        indentTypes.shift();
                        indentLevel --;
                        result = result.replace(/\s+$/, "");
                        result += "\n" + tab.repeat(indentLevel);
                    }

                    inlineParentheses = false;

                    result += tokenValue + " ";
                    return result;
                }

                if (token.value === ",") {
                    if (inlineCount >= 30) {
                        inlineCount = 0;
                        newline = true;
                    }
                }
                inlineCount += token.value.length;
            }

            // Opening parentheses increase the block indent level and start a new line
            if (token.value === "(") {
                // First check if this should be an inline parentheses block
                // Examples are "NOW()", "COUNT(*)", "int(10)", key(`somecolumn`), DECIMAL(7,2)
                // Allow up to 3 non-whitespace tokens inside inline parentheses
                let length = 0;

                for (let i = 1; i <= 250; i ++) {
                    // Reached end of string
                    if (!tokens[key + i]) {
                        break;
                    }
                    const next = tokens[key + i];

                    // Reached closing parentheses, able to inline it
                    if (next.value === ")") {
                        inlineParentheses = true;
                        inlineCount = 0;
                        inlineIndented = false;
                        break;
                    }
                    // Reached an invalid token for inline parentheses
                    if (next.value === ";" || next.value === "(") {
                        break;
                    }
                    // Reached an invalid token type for inline parentheses
                    if (next.type === TOKEN_TYPE_RESERVED_TOPLEVEL || next.type === TOKEN_TYPE_RESERVED_NEWLINE ||
                        next.type === TOKEN_TYPE_COMMENT || next.type === TOKEN_TYPE_BLOCK_COMMENT) {
                        break;
                    }
                    length += next.value.length;
                }

                if (inlineParentheses && length > 30) {
                    increaseBlockIndent = true;
                    inlineIndented = true;
                    newline = true;
                }

                // Take out the preceding space unless there was whitespace there in the original query
                if (originalTokens[token.key - 1] && originalTokens[token.key - 1].type !== TOKEN_TYPE_WHITESPACE) {
                    result = result.replace(/\s+$/, "");
                }

                if (!inlineParentheses) {
                    increaseBlockIndent = true;
                    // Add a newline after the parentheses
                    newline = true;
                }
            }
            // Closing parentheses decrease the block indent level
            else if (token.value === ")") {
                // Remove whitespace before the closing parentheses
                result = result.replace(/\s+$/, "");

                indentLevel --;

                // Reset indent level
                while (indentTypes.length) {
                    const type = indentTypes.shift();

                    if (type === "special") {
                        indentLevel --;
                    }
                    else {
                        break;
                    }
                }

                // Add a newline before the closing parentheses (if not already added)
                if (!addedNewline) {
                    result = result.replace(/\s+$/, "");
                    result += "\n" + tab.repeat(indentLevel);
                }
            }
            // Top level reserved words start a new line and increase the special indent level
            else if (token.type === TOKEN_TYPE_RESERVED_TOPLEVEL) {
                increaseSpecialIndent = true;

                // If the last indent type was "special", decrease the special indent for this round
                if (indentTypes[0] === "special") {
                    indentLevel --;
                    indentTypes.shift();
                }

                // Add a newline after the top level reserved word
                newline = true;

                // Add a newline before the top level reserved word (if not already added)
                if (!addedNewline) {
                    result = result.replace(/\s+$/, "");
                    result += "\n" + tab.repeat(indentLevel);
                }

                // If we already added a newline, redo the indentation since it may be different now
                else {
                    result = result.replace(/\t+$/, "") + tab.repeat(indentLevel);
                }

                // If the token may have extra whitespace
                if (token.value.indexOf(" ") !== -1 || token.value.indexOf("\n") !== -1 ||
                    token.value.indexOf("\t") !== -1) {
                    tokenValue = tokenValue.replace(/\s+/, " ", tokenValue);
                }

                // if SQL "LIMIT" clause, start variable to reset newline
                if (token.value === "LIMIT" && !inlineParentheses) {
                    clauseLimit = true;
                }
            }
            // Checks if we are out of the limit clause
            else if (clauseLimit && token.value !== "," && token.type !== TOKEN_TYPE_NUMBER &&
                token.type !== TOKEN_TYPE_WHITESPACE) {
                clauseLimit = false;
            }
            // Commas start a new line (unless within inline parentheses or SQL "LIMIT" clause)
            else if (token.value === "," && !inlineParentheses) {
                // If the previous TOKEN_VALUE is "LIMIT", resets new line
                if (clauseLimit === true) {
                    newline = false;
                    clauseLimit = false;
                }
                // All other cases of commas
                else {
                    newline = true;
                }
            }
            // Newline reserved words start a new line
            else if (token.type === TOKEN_TYPE_RESERVED_NEWLINE) {
                // Add a newline before the reserved word (if not already added)
                if (!addedNewline) {
                    result = result.replace(/\s+$/, "");
                    result += "\n" + tab.repeat(indentLevel);
                }

                // If the token may have extra whitespace
                if (token.value.indexOf(" ") !== -1 || token.value.indexOf("\n") !== -1 ||
                    token.value.indexOf("\t") !== -1) {
                    tokenValue = tokenValue.replace(/\s+/, " ");
                }
            }

            // If the token shouldn"t have a space before it
            if (token.value === "." || token.value === "," || token.value === ";") {
                result = result.replace(/\s+$/, "");
            }

            result += tokenValue + " ";

            // If the token shouldn"t have a space after it
            if (token.value === "(" || token.value === ".") {
                result = result.replace(/\s+$/, "");
            }

            // If this is the "-" of a negative number, it shouldn"t have a space after it
            if (token.value === "-" && tokens[key + 1] && tokens[key + 1].type === TOKEN_TYPE_NUMBER && tokens[key - 1]) {
                const prev = tokens[key - 1].type;

                if (prev !== TOKEN_TYPE_QUOTE && prev !== TOKEN_TYPE_BACKTICK_QUOTE &&
                    prev !== TOKEN_TYPE_WORD && prev !== TOKEN_TYPE_NUMBER) {
                    result = result.replace(/\s+$/, "");
                }
            }
        });
        return result.replace(/\t/g, "  ").trim() + "\n";
    }

    /**
     * Takes a SQL string and breaks it into tokens.
     * Each token is an associative array with type and value.
     *
     * @param {String} input The SQL string
     * @return {Array} An array of tokens.
     */
    tokenize(input) {
        const tokens = [];

        // Used to make sure the string keeps shrinking on each iteration
        let currentLength = input.length;
        let token;
        let tokenLength;

        // Keep processing the string until it is empty
        while (currentLength) {
            // Get the next token and the token type
            token = this.getNextToken(input, token);
            tokenLength = token.value.length;

            tokens.push(token);

            // Advance the string
            input = input.substring(tokenLength);

            currentLength -= tokenLength;
        }
        return tokens;
    }

    /**
     * Return the next token value and type in a SQL string.
     *
     * @param {String} input The SQL string
     * @param {Array} previousToken The result of the previous getNextToken() call
     * @return {Array} An associative array containing the type and value of the token.
     */
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
                type: TOKEN_TYPE_WHITESPACE,
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
                type = TOKEN_TYPE_COMMENT;
                commentEnd = input.indexOf("\n");
            }
            // Comment until closing comment tag
            else {
                type = TOKEN_TYPE_BLOCK_COMMENT;
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
                type: (firstChar === "`" || firstChar === "[") ? TOKEN_TYPE_BACKTICK_QUOTE : TOKEN_TYPE_QUOTE,
                value: this.getQuotedString(input)
            };
        }
    }

    getVariableToken(input) {
        if ((input.charAt(0) === "@" || input.charAt(0) === ":") && input.charAt(1)) {
            // Quoted variable name
            if (input.charAt(1) === "\"" || input.charAt(1) === "'" || input.charAt(1) === "`") {
                return {
                    type: TOKEN_TYPE_VARIABLE,
                    value: input.charAt(0) + this.getQuotedString(input.substring(1))
                };
            }
            // Non-quoted variable name
            else {
                const matches = input.match(new RegExp(`^(${input.charAt(0)}[a-zA-Z0-9\\._\\$]+)`));

                if (matches) {
                    return {
                        type: TOKEN_TYPE_VARIABLE,
                        value: matches[1]
                    };
                }
            }
        }
    }

    // Decimal, binary, or hex numbers
    getNumberToken(input) {
        const matches = input.match(new RegExp(`^([0-9]+(\\.[0-9]+)?|0x[0-9a-fA-F]+|0b[01]+)($|\\s|"'\`|${this.regexBoundaries})`));

        if (matches) {
            return {
                type: TOKEN_TYPE_NUMBER,
                value: matches[1]
            };
        }
    }

    // Punctuation and symbols
    getBoundaryCharacterToken(input) {
        const matches = input.match(new RegExp(`^(${this.regexBoundaries})`));

        if (matches) {
            return {
                type: TOKEN_TYPE_BOUNDARY,
                value: matches[1]
            };
        }
    }

    getReservedWordToken(input, previousToken) {
        // A reserved word cannot be preceded by a "."
        // this makes it so in "mytable.from", "from" is not considered a reserved word
        if (previousToken && previousToken.value && previousToken.value === ".") {
            return;
        }
        const uppercasedInput = input.toUpperCase();

        const toplevelReservedWordToken = this.getSpecificReservedWordToken({
            input: uppercasedInput,
            type: TOKEN_TYPE_RESERVED_TOPLEVEL,
            regex: this.regexReservedToplevel
        });

        if (toplevelReservedWordToken) {
            return toplevelReservedWordToken;
        }

        const newlineReservedWordToken = this.getSpecificReservedWordToken({
            input: uppercasedInput,
            type: TOKEN_TYPE_RESERVED_TOPLEVEL,
            regex: this.regexReservedNewline
        });

        if (newlineReservedWordToken) {
            return newlineReservedWordToken;
        }

        return this.getSpecificReservedWordToken({
            input: uppercasedInput,
            type: TOKEN_TYPE_RESERVED,
            regex: this.regexReserved
        });
    }

    getSpecificReservedWordToken({input, type, regex}) {
        const matches = input.match(new RegExp(`^(${regex})($|\\s|${this.regexBoundaries})`));

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
        const matches = input.match(new RegExp(`^(${this.regexFunction}[(]|\\s|[)])`));

        if (matches) {
            return {
                // TODO should be type_function?
                type: TOKEN_TYPE_RESERVED,
                value: input.substring(0, matches[1].length - 1)
            };
        }
    }

    getNonReservedWordToken(input) {
        const matches = input.match(new RegExp(`^(.*?)($|\\s|["'\`]|${this.regexBoundaries})`));

        if (matches) {
            return {
                type: TOKEN_TYPE_WORD,
                value: matches[1]
            };
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
