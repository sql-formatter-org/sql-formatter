import _ from "xr/_";
import sqlTokenTypes from "xr/sqlFormatter/sqlTokenTypes";

const INDENT_TYPE_TOPLEVEL = "toplevel-indent";
const INDENT_TYPE_BLOCK = "block-indent";

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
        this.inlineParenthesesLevel = 0;
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
        if (token.value === "LIMIT" && this.inlineParenthesesLevel === 0) {
            this.limitClause = true;
        }
        query = this.addNewline(query);

        this.increaseToplevelIndent();

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
        if (tokens[index - 1] && tokens[index - 1].type !== sqlTokenTypes.WHITESPACE) {
            query = _.trimEnd(query);
        }
        query += tokens[index].value;

        if (this.inlineParenthesesLevel === 0 && this.isInlineParenthesesBlock(tokens, index)) {
            this.inlineParenthesesLevel = 1;
        }
        else if (this.inlineParenthesesLevel > 0) {
            this.inlineParenthesesLevel++;
        }
        else {
            this.inlineParenthesesLevel = 0;
            this.increaseBlockIndent();
            query = this.addNewline(query);
        }
        return query;
    }

    // Check if this should be an inline parentheses block
    // Examples are "NOW()", "COUNT(*)", "int(10)", key(`somecolumn`), DECIMAL(7,2)
    isInlineParenthesesBlock(tokens, index) {
        let length = 0;
        let level = 0;

        for (let i = index; i < tokens.length; i++) {
            const token = tokens[i];
            length += token.value.length;

            // Overran max length
            if (length > INLINE_MAX_LENGTH) {
                return false;
            }

            if (token.type === sqlTokenTypes.OPEN_PAREN) {
                level++;
            }
            else if (token.type === sqlTokenTypes.CLOSE_PAREN) {
                level--;
                if (level === 0) {
                    return true;
                }
            }

            // Reached an invalid token value for inline parentheses
            if (token.value === ";") {
                return false;
            }
            // Reached an invalid token type for inline parentheses
            if (token.type === sqlTokenTypes.RESERVED_TOPLEVEL || token.type === sqlTokenTypes.RESERVED_NEWLINE ||
                token.type === sqlTokenTypes.COMMENT || token.type === sqlTokenTypes.BLOCK_COMMENT) {
                return false;
            }
        }
        return false;
    }

    // Closing parentheses decrease the block indent level
    formatClosingParentheses(token, query) {
        if (this.inlineParenthesesLevel > 0) {
            return this.formatClosingInlineParentheses(token, query);
        }
        return this.formatClosingNewlineParentheses(token, query);
    }

    formatClosingInlineParentheses(token, query) {
        this.inlineParenthesesLevel--;

        return _.trimEnd(query) + token.value + " ";
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

        return this.addNewline(query) + token.value + " ";
    }

    // Commas start a new line (unless within inline parentheses or SQL "LIMIT" clause)
    formatComma(token, query) {
        query = _.trimEnd(query) + token.value + " ";

        if (this.inlineParenthesesLevel > 0) {
            return query;
        }
        return this.formatNewlineComma(token, query);
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

    formatWithSpaceAfter(token, query) {
        return _.trimEnd(query) + token.value + " ";
    }

    formatWithoutSpaces(token, query) {
        return _.trimEnd(query) + token.value;
    }

    formatWithSpaces(token, query) {
        return query + token.value + " ";
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

    getRefinedResult(formattedQuery) {
        return formattedQuery.trim() + "\n";
    }
}
