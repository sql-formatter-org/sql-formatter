import _ from "xr/_";
import sqlTokenTypes from "xr/sqlFormatter/sqlTokenTypes";

export default class SqlTokenizer {
    /**
     * @param {Object} cfg
     *  @param {String[]} cfg.reservedWords Reserved words in SQL
     *  @param {String[]} cfg.reservedToplevelWords Words that are set to new line and on first indent level
     *  @param {String[]} cfg.reservedNewlineWords Words that are set to newline
     *  @param {String[]} cfg.stringTypes String types to enable: "", '', ``, []
     *  @param {String[]} cfg.openParens Opening parentheses to enable, like (, [
     *  @param {String[]} cfg.closeParens Closing parentheses to enable, like ), ]
     *  @param {String[]} cfg.variableTypes Prefixes for variables, like @ and :
     */
    constructor(cfg) {
        this.WORD_REGEX = /^(\w+)/;
        this.WHITESPACE_REGEX = /^(\s+)/;
        this.LINE_COMMENT_REGEX = /^((?:#|--).*?(?:\n|$))/;
        this.BLOCK_COMMENT_REGEX = /^(\/\*[^]*?(?:\*\/|$))/;
        this.NUMBER_REGEX = /^((-\s*)?[0-9]+(\.[0-9]+)?|0x[0-9a-fA-F]+|0b[01]+)\b/;
        this.OPERATOR_REGEX = /^(!=|<>|==|<=|>=|!<|!>|\|\||.)/;

        this.RESERVED_TOPLEVEL_REGEX = this.createReservedWordRegex(cfg.reservedToplevelWords);
        this.RESERVED_NEWLINE_REGEX = this.createReservedWordRegex(cfg.reservedNewlineWords);
        this.RESERVED_PLAIN_REGEX = this.createReservedWordRegex(cfg.reservedWords);

        this.STRING_REGEX = this.createStringRegex(cfg.stringTypes);

        this.OPEN_PAREN_REGEX = this.createParenRegex(cfg.openParens);
        this.CLOSE_PAREN_REGEX = this.createParenRegex(cfg.closeParens);

        this.VARIABLE_REGEX = this.createVariableRegex(cfg.variableTypes);
    }

    createReservedWordRegex(reservedWords) {
        const reservedWordsPattern = reservedWords.join("|").replace(/ /g, "\\s+");
        return new RegExp(`^(${reservedWordsPattern})\\b`, "i");
    }

    // This enables the following string patterns:
    // 1. backtick quoted string using `` to escape
    // 2. square bracket quoted string (SQL Server) using ]] to escape
    // 3. double quoted string using "" or \" to escape
    // 4. single quoted string using '' or \' to escape
    createStringRegex(stringTypes) {
        const patterns = {
            "\"\"": "((\"[^\"\\\\]*(?:\\\\.[^\"\\\\]*)*(\"|$))+)",
            "''": "(('[^'\\\\]*(?:\\\\.[^'\\\\]*)*('|$))+)",
            "``": "((`[^`]*($|`))+)",
            "[]": "((\\[[^\\]]*($|\\]))(\\][^\\]]*($|\\]))*)",
        };

        return new RegExp(
            "^(" + stringTypes.map(t => patterns[t]).join("|") + ")"
        );
    }

    createParenRegex(parens) {
        return new RegExp(
            "^(" + parens.map(p => _.escapeRegExp(p)).join("|") + ")"
        );
    }

    createVariableRegex(variableTypes) {
        if (variableTypes.length === 0) {
            return false;
        }
        return new RegExp(
            "^(" + variableTypes.map(_.escapeRegExp).join("|") + ")\\S"
        );
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
        return this.getWhitespaceToken(input) ||
            this.getCommentToken(input) ||
            this.getStringToken(input) ||
            this.getOpenParenToken(input) ||
            this.getCloseParenToken(input) ||
            this.getVariableToken(input) ||
            this.getNumberToken(input) ||
            this.getReservedWordToken(input, previousToken) ||
            this.getWordToken(input) ||
            this.getOperatorToken(input);
    }

    getWhitespaceToken(input) {
        return this.getTokenOnFirstMatch({
            input,
            type: sqlTokenTypes.WHITESPACE,
            regex: this.WHITESPACE_REGEX
        });
    }

    getCommentToken(input) {
        return this.getLineCommentToken(input) || this.getBlockCommentToken(input);
    }

    getLineCommentToken(input) {
        return this.getTokenOnFirstMatch({
            input,
            type: sqlTokenTypes.COMMENT,
            regex: this.LINE_COMMENT_REGEX
        });
    }

    getBlockCommentToken(input) {
        return this.getTokenOnFirstMatch({
            input,
            type: sqlTokenTypes.BLOCK_COMMENT,
            regex: this.BLOCK_COMMENT_REGEX
        });
    }

    getStringToken(input) {
        return this.getTokenOnFirstMatch({
            input,
            type: sqlTokenTypes.STRING,
            regex: this.STRING_REGEX
        });
    }

    getOpenParenToken(input) {
        return this.getTokenOnFirstMatch({
            input,
            type: sqlTokenTypes.OPEN_PAREN,
            regex: this.OPEN_PAREN_REGEX
        });
    }

    getCloseParenToken(input) {
        return this.getTokenOnFirstMatch({
            input,
            type: sqlTokenTypes.CLOSE_PAREN,
            regex: this.CLOSE_PAREN_REGEX
        });
    }

    getVariableToken(input) {
        if (this.VARIABLE_REGEX && this.VARIABLE_REGEX.test(input)) {
            // Quoted variable name
            if (this.STRING_REGEX.test(input.substring(1))) {
                return {
                    type: sqlTokenTypes.VARIABLE,
                    value: input.charAt(0) + input.substring(1).match(this.STRING_REGEX)[1]
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
            regex: this.NUMBER_REGEX
        });
    }

    // Punctuation and symbols
    getOperatorToken(input) {
        return this.getTokenOnFirstMatch({
            input,
            type: sqlTokenTypes.OPERATOR,
            regex: this.OPERATOR_REGEX
        });
    }

    getReservedWordToken(input, previousToken) {
        // A reserved word cannot be preceded by a "."
        // this makes it so in "mytable.from", "from" is not considered a reserved word
        if (previousToken && previousToken.value && previousToken.value === ".") {
            return;
        }
        return this.getToplevelReservedToken(input) || this.getNewlineReservedToken(input) || this.getPlainReservedToken(input);
    }

    getToplevelReservedToken(input) {
        return this.getTokenOnFirstMatch({
            input,
            type: sqlTokenTypes.RESERVED_TOPLEVEL,
            regex: this.RESERVED_TOPLEVEL_REGEX
        });
    }

    getNewlineReservedToken(input) {
        return this.getTokenOnFirstMatch({
            input,
            type: sqlTokenTypes.RESERVED_NEWLINE,
            regex: this.RESERVED_NEWLINE_REGEX
        });
    }

    getPlainReservedToken(input) {
        return this.getTokenOnFirstMatch({
            input,
            type: sqlTokenTypes.RESERVED,
            regex: this.RESERVED_PLAIN_REGEX
        });
    }

    getWordToken(input) {
        return this.getTokenOnFirstMatch({
            input,
            type: sqlTokenTypes.WORD,
            regex: this.WORD_REGEX
        });
    }

    getTokenOnFirstMatch({input, type, regex}) {
        const matches = input.match(regex);

        if (matches) {
            return {type, value: matches[1]};
        }
    }
}
