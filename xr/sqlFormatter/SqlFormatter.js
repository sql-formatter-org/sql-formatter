import _ from "xr/_";
import sqlTokenTypes from "xr/sqlFormatter/sqlTokenTypes";

const INDENT_TYPE_TOPLEVEL = "toplevel-indent";
const INDENT_TYPE_BLOCK = "block-indent";

const INLINE_PARENTHESES_SEARCH_RANGE = 250;
const INLINE_MAX_LENGTH = 35;

export default class SqlFormatter {
    /**
     * @param {SqlTokenizer} tokenizer
     */
    constructor(tokenizer) {
        this.tokenizer = tokenizer;
        this.indent = "  ";
        this.indentLevel = 0;
        this.indentTypes = [];
        this.inlineLength = 0;
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

        return this.getRefinedResult(formattedQuery);
    }

    getFormattedQueryFromTokens(tokens) {
        let formattedQuery = "";

        tokens.forEach((token, index) => {
            if (this.hasLimitClauseEnded(token)) {
                this.limitClause = false;
            }

            if (token.type === sqlTokenTypes.WHITESPACE) {
                return;
            }
            else if (token.type === sqlTokenTypes.COMMENT || token.type === sqlTokenTypes.BLOCK_COMMENT) {
                formattedQuery = this.formatComment(token, formattedQuery);
            }
            else if (token.type === sqlTokenTypes.RESERVED_TOPLEVEL) {
                formattedQuery = this.formatToplevelReservedWord(token, formattedQuery);
            }
            else if (token.type === sqlTokenTypes.RESERVED_NEWLINE) {
                formattedQuery = this.formatNewlineReservedWord(token, formattedQuery);
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
            else if (token.value === "." || token.value === ";") {
                formattedQuery = this.formatDot(token, formattedQuery);
            }
            else {
                formattedQuery = this.formatLeftOver(token, formattedQuery);
            }
        });
        return formattedQuery;
    }

    hasLimitClauseEnded(token) {
        return this.limitClause && token.value !== "," && token.type !== sqlTokenTypes.NUMBER && token.type !== sqlTokenTypes.WHITESPACE;
    }

    formatComment(token, query) {
        if (token.type === sqlTokenTypes.BLOCK_COMMENT) {
            query = this.addNewline(query);

            token.value = token.value.replace("\n", "\n" + this.indent.repeat(this.indentLevel));
        }
        query += token.value;
        query = this.addNewline(query);

        return query;
    }

    formatToplevelReservedWord(token, query) {
        // If the last indent type was INDENT_TYPE_TOPLEVEL, decrease the toplevel indent for this round
        if (_.last(this.indentTypes) === INDENT_TYPE_TOPLEVEL) {
            this.indentLevel --;
            this.indentTypes.pop();
        }
        // if SQL "LIMIT" clause, start variable to reset newline
        if (token.value === "LIMIT" && !this.inlineParentheses) {
            this.limitClause = true;
        }
        query = this.addNewline(query);

        this.increaseToplevelIndent();

        query = this.addValueToQuery(query, this.equalizeWhitespace(token.value));
        return this.addNewline(query);
    }

    formatNewlineReservedWord(token, query) {
        query = this.addNewline(query);
        return this.addValueToQuery(query, this.equalizeWhitespace(token.value) + " ");
    }

    // Replace any sequence of whitespace characters with single space
    equalizeWhitespace(string) {
        return string.replace(/\s+/g, " ");
    }

    // Opening parentheses increase the block indent level and start a new line
    formatOpeningParentheses(tokens, index, query) {
        // Take out the preceding space unless there was whitespace there in the original query
        if (tokens[index - 1] && tokens[index - 1].type !== sqlTokenTypes.WHITESPACE) {
            query = _.trimEnd(query);
        }
        query = this.addValueToQuery(query, tokens[index].value);

        // Check if this should be an inline parentheses block
        // Examples are "NOW()", "COUNT(*)", "int(10)", key(`somecolumn`), DECIMAL(7,2)
        const parenthesesBlockLength = this.measureInlineParenthesesBlock(tokens, index);

        if (this.inlineParentheses && parenthesesBlockLength > INLINE_MAX_LENGTH) {
            this.inlineIndented = true;

            this.increaseBlockIndent();
            query = this.addNewline(query);
        }
        else if (!this.inlineParentheses) {
            this.increaseBlockIndent();
            query = this.addNewline(query);
        }
        return query;
    }

    measureInlineParenthesesBlock(tokens, index) {
        let length = 0;

        for (let i = 1; i <= INLINE_PARENTHESES_SEARCH_RANGE; i ++) {
            // Reached end of string
            if (!tokens[index + i]) {
                break;
            }
            const next = tokens[index + i];

            // Reached closing parentheses, able to inline it
            if (next.type === sqlTokenTypes.CLOSE_PAREN) {
                this.inlineParentheses = true;
                this.inlineIndented = false;
                this.inlineLength = 0;
                break;
            }
            // Reached an invalid token value for inline parentheses
            if (next.value === ";" || next.type === sqlTokenTypes.OPEN_PAREN) {
                break;
            }
            // Reached an invalid token type for inline parentheses
            if (next.type === sqlTokenTypes.RESERVED_TOPLEVEL || next.type === sqlTokenTypes.RESERVED_NEWLINE ||
                next.type === sqlTokenTypes.COMMENT || next.type === sqlTokenTypes.BLOCK_COMMENT) {
                break;
            }
            length += next.value.length;
        }
        return length;
    }

    // Closing parentheses decrease the block indent level
    formatClosingParentheses(token, query) {
        if (this.inlineParentheses) {
            return this.formatClosingInlineParentheses(token, query);
        }
        return this.formatClosingNewlineParentheses(token, query);
    }

    formatClosingInlineParentheses(token, query) {
        this.inlineParentheses = false;

        query = _.trimEnd(query);

        if (this.inlineIndented) {
            this.indentTypes.pop();
            this.indentLevel --;

            query = this.addNewline(query);
        }
        return this.addValueToQuery(query, token.value + " ");
    }

    formatClosingNewlineParentheses(token, query) {
        this.indentLevel --;

        // Reset indent level
        while (this.indentTypes.length) {
            const type = this.indentTypes.pop();

            if (type !== INDENT_TYPE_TOPLEVEL) {
                break;
            }
            this.indentLevel --;
        }
        query = this.addNewline(query);

        return this.addValueToQuery(query, token.value + " ");
    }

    // Commas start a new line (unless within inline parentheses or SQL "LIMIT" clause)
    formatComma(token, query) {
        query = _.trimEnd(query);
        query = this.addValueToQuery(query, token.value + " ");

        if (this.inlineParentheses) {
            return this.formatInlineComma(token, query);
        }
        return this.formatNewlineComma(token, query);
    }

    formatInlineComma(token, query) {
        if (this.inlineLength >= 30) {
            this.inlineLength = 0;
            return this.addNewline(query);
        }
        return query;
    }

    formatNewlineComma(token, query) {
        // If the previous TOKEN_VALUE is "LIMIT", resets new line
        if (this.limitClause === true) {
            this.limitClause = false;
        }
        else {
            return this.addNewline(query);
        }
        return query;
    }

    formatDot(token, query) {
        query = _.trimEnd(query);
        return this.addValueToQuery(query, token.value);
    }

    formatLeftOver(token, query) {
        if (this.inlineParentheses) {
            this.inlineLength += token.value.length;
        }
        return this.addValueToQuery(query, token.value + " ");
    }

    increaseToplevelIndent() {
        this.indentLevel ++;
        this.indentTypes.push(INDENT_TYPE_TOPLEVEL);
    }

    increaseBlockIndent() {
        this.indentLevel ++;
        this.indentTypes.push(INDENT_TYPE_BLOCK);
    }

    addNewline(query) {
        query = _.trimEnd(query);
        return query + "\n" + this.indent.repeat(this.indentLevel);
    }

    addValueToQuery(query, value) {
        return query + value;
    }

    getRefinedResult(formattedQuery) {
        return formattedQuery.trim() + "\n";
    }
}
