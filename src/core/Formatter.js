import trimEnd from "lodash/trimEnd";
import tokenTypes from "./tokenTypes";
import Indentation from "./Indentation";
import InlineBlock from "./InlineBlock";
import Params from "./Params";

export default class Formatter {
    /**
     * @param {Object} cfg
     *   @param {Object} cfg.indent
     *   @param {Object} cfg.params
     * @param {Tokenizer} tokenizer
     */
    constructor(cfg, tokenizer) {
        this.cfg = cfg || {};
        this.indentation = new Indentation(this.cfg.indent);
        this.inlineBlock = new InlineBlock();
        this.params = new Params(this.cfg.params);
        this.tokenizer = tokenizer;
        this.previousReservedWord = {};
    }

    /**
     * Formats whitespaces in a SQL string to make it easier to read.
     *
     * @param {String} query The SQL query string
     * @return {String} formatted query
     */
    format(query) {
        const tokens = this.tokenizer.tokenize(query);
        const formattedQuery = this.getFormattedQueryFromTokens(tokens);

        return formattedQuery.trim();
    }

    getFormattedQueryFromTokens(tokens) {
        let formattedQuery = "";

        tokens.forEach((token, index) => {
            if (token.type === tokenTypes.WHITESPACE) {
                return;
            }
            else if (token.type === tokenTypes.LINE_COMMENT) {
                formattedQuery = this.formatLineComment(token, formattedQuery);
            }
            else if (token.type === tokenTypes.BLOCK_COMMENT) {
                formattedQuery = this.formatBlockComment(token, formattedQuery);
            }
            else if (token.type === tokenTypes.RESERVED_TOPLEVEL) {
                formattedQuery = this.formatToplevelReservedWord(token, formattedQuery);
                this.previousReservedWord = token;
            }
            else if (token.type === tokenTypes.RESERVED_NEWLINE) {
                formattedQuery = this.formatNewlineReservedWord(token, formattedQuery);
                this.previousReservedWord = token;
            }
            else if (token.type === tokenTypes.RESERVED) {
                formattedQuery = this.formatWithSpaces(token, formattedQuery);
                this.previousReservedWord = token;
            }
            else if (token.type === tokenTypes.OPEN_PAREN) {
                formattedQuery = this.formatOpeningParentheses(tokens, index, formattedQuery);
            }
            else if (token.type === tokenTypes.CLOSE_PAREN) {
                formattedQuery = this.formatClosingParentheses(token, formattedQuery);
            }
            else if (token.type === tokenTypes.PLACEHOLDER) {
                formattedQuery = this.formatPlaceholder(token, formattedQuery);
            }
            else if (token.value === ",") {
                formattedQuery = this.formatComma(token, formattedQuery);
            }
            else if (token.value === ":") {
                formattedQuery = this.formatWithSpaceAfter(token, formattedQuery);
            }
            else if (token.value === "." || token.value === ";") {
                formattedQuery = this.formatWithoutSpaces(token, formattedQuery);
            }
            else {
                formattedQuery = this.formatWithSpaces(token, formattedQuery);
            }
        });
        return formattedQuery;
    }

    formatLineComment(token, query) {
        return this.addNewline(query + token.value);
    }

    formatBlockComment(token, query) {
        return this.addNewline(this.addNewline(query) + this.indentComment(token.value));
    }

    indentComment(comment) {
        return comment.replace(/\n/g, "\n" + this.indentation.getIndent());
    }

    formatToplevelReservedWord(token, query) {
        this.indentation.decreaseTopLevel();

        query = this.addNewline(query);

        this.indentation.increaseToplevel();

        query += this.equalizeWhitespace(token.value);
        return this.addNewline(query);
    }

    formatNewlineReservedWord(token, query) {
        return this.addNewline(query) + this.equalizeWhitespace(token.value) + " ";
    }

    // Replace any sequence of whitespace characters with single space
    equalizeWhitespace(string) {
        return string.replace(/\s+/g, " ");
    }

    // Opening parentheses increase the block indent level and start a new line
    formatOpeningParentheses(tokens, index, query) {
        // Take out the preceding space unless there was whitespace there in the original query or another opening parens
        const previousToken = tokens[index - 1];
        if (previousToken && previousToken.type !== tokenTypes.WHITESPACE && previousToken.type !== tokenTypes.OPEN_PAREN) {
            query = trimEnd(query);
        }
        query += tokens[index].value;

        this.inlineBlock.beginIfPossible(tokens, index);

        if (!this.inlineBlock.isActive()) {
            this.indentation.increaseBlockLevel();
            query = this.addNewline(query);
        }
        return query;
    }

    // Closing parentheses decrease the block indent level
    formatClosingParentheses(token, query) {
        if (this.inlineBlock.isActive()) {
            this.inlineBlock.end();
            return this.formatWithSpaceAfter(token, query);
        }
        else {
            this.indentation.decreaseBlockLevel();
            return this.formatWithSpaces(token, this.addNewline(query));
        }
    }

    formatPlaceholder(token, query) {
        return query + this.params.get(token) + " ";
    }

    // Commas start a new line (unless within inline parentheses or SQL "LIMIT" clause)
    formatComma(token, query) {
        query = trimEnd(query) + token.value + " ";

        if (this.inlineBlock.isActive()) {
            return query;
        }
        else if (/^LIMIT$/i.test(this.previousReservedWord.value)) {
            return query;
        }
        else {
            return this.addNewline(query);
        }
    }

    formatWithSpaceAfter(token, query) {
        return trimEnd(query) + token.value + " ";
    }

    formatWithoutSpaces(token, query) {
        return trimEnd(query) + token.value;
    }

    formatWithSpaces(token, query) {
        return query + token.value + " ";
    }

    addNewline(query) {
        return trimEnd(query) + "\n" + this.indentation.getIndent();
    }
}
