import _ from "lodash";
import sqlTokenTypes from "./tokenTypes";
import Indentation from "./Indentation";
import InlineBlock from "./InlineBlock";

export default class Formatter {
    /**
     * @param {Object} cfg
     *  @param {Object} cfg.indent
     * @param {Tokenizer} tokenizer
     */
    constructor(cfg, tokenizer) {
        this.cfg = cfg || {};
        this.indentation = new Indentation(this.cfg.indent);
        this.inlineBlock = new InlineBlock();
        this.tokenizer = tokenizer;
        this.previousReservedWord = {};
    }

    /**
     * Format the whitespace in a SQL string to make it easier to read.
     *
     * @param {String} query The SQL query string
     * @return {String} formatted query
     */
    format(query) {
        const tokens = this.tokenizer.tokenize(query);
        const formattedQuery = this.getFormattedQueryFromTokens(tokens);

        return formattedQuery.trim() + "\n";
    }

    getFormattedQueryFromTokens(tokens) {
        let formattedQuery = "";

        tokens.forEach((token, index) => {
            if (token.type === sqlTokenTypes.WHITESPACE) {
                return;
            }
            else if (token.type === sqlTokenTypes.LINE_COMMENT) {
                formattedQuery = this.formatLineComment(token, formattedQuery);
            }
            else if (token.type === sqlTokenTypes.BLOCK_COMMENT) {
                formattedQuery = this.formatBlockComment(token, formattedQuery);
            }
            else if (token.type === sqlTokenTypes.RESERVED_TOPLEVEL) {
                formattedQuery = this.formatToplevelReservedWord(token, formattedQuery);
                this.previousReservedWord = token;
            }
            else if (token.type === sqlTokenTypes.RESERVED_NEWLINE) {
                formattedQuery = this.formatNewlineReservedWord(token, formattedQuery);
                this.previousReservedWord = token;
            }
            else if (token.type === sqlTokenTypes.RESERVED) {
                formattedQuery = this.formatWithSpaces(token, formattedQuery);
                this.previousReservedWord = token;
            }
            else if (token.type === sqlTokenTypes.OPEN_PAREN) {
                formattedQuery = this.formatOpeningParentheses(tokens, index, formattedQuery);
            }
            else if (token.type === sqlTokenTypes.CLOSE_PAREN) {
                formattedQuery = this.formatClosingParentheses(token, formattedQuery);
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
        // Take out the preceding space unless there was whitespace there in the original query
        const previousToken = tokens[index - 1];
        if (previousToken && previousToken.type !== sqlTokenTypes.WHITESPACE) {
            query = _.trimEnd(query);
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

    // Commas start a new line (unless within inline parentheses or SQL "LIMIT" clause)
    formatComma(token, query) {
        query = _.trimEnd(query) + token.value + " ";

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
        return _.trimEnd(query) + token.value + " ";
    }

    formatWithoutSpaces(token, query) {
        return _.trimEnd(query) + token.value;
    }

    formatWithSpaces(token, query) {
        return query + token.value + " ";
    }

    addNewline(query) {
        return _.trimEnd(query) + "\n" + this.indentation.getIndent();
    }
}
