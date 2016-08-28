import _ from "xr/_";
import sqlTokenTypes from "xr/sqlFormatter/sqlTokenTypes";
import SqlTokenizer from "xr/sqlFormatter/SqlTokenizer";

const INDENT_TYPE_TOPLEVEL = "toplevel-indent";
const INDENT_TYPE_BLOCK = "block-indent";

const INLINE_PARENTHESES_SEARCH_RANGE = 250;
const INLINE_MAX_LENGTH = 35;

export default class SqlFormatter {
    /**
     * @param {Object} cfg
     *  @param {Array} cfg.reservedWords Reserved words in SQL
     *  @param {Array} cfg.reservedToplevelWords Words that are set to new line and on first indent level
     *  @param {Array} cfg.reservedNewlineWords Words that are set to newline
     *  @param {Array} cfg.functionWords Words that are treated as functions
     */
    constructor({reservedWords, reservedToplevelWords, reservedNewlineWords, functionWords}) {
        this.tokenizer = new SqlTokenizer({
            boundaries: "(,|;|\\:|\\)|\\(|\\.|\\=|\\<|\\>|\\+|\\-|\\*|\\/|\\!|\\^|%|\\||&|#)",
            reservedToplevel: `(${reservedToplevelWords.join("|")})`,
            reservedNewline: `(${reservedNewlineWords.join("|")})`,
            reserved: `(${reservedWords.join("|")})`,
            function: `(${functionWords.join("|")})`
        });
        this.indent = "\t";
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

        _(tokens).forEach((token, key) => {
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
            else if (token.value === "(") {
                formattedQuery = this.formatOpeningParentheses(tokens, key, formattedQuery);
            }
            else if (token.value === ")") {
                formattedQuery = this.formatClosingParentheses(token, formattedQuery);
            }
            else if (token.value === ",") {
                formattedQuery = this.formatComma(token, formattedQuery);
            }
            else if (token.value === "." || token.value === ";") {
                formattedQuery = this.formatDot(token, formattedQuery);
            }
            else if (token.value === "|") {
                formattedQuery = this.formatStringConcat(tokens, key, formattedQuery);
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
        if (this.indentTypes[0] === INDENT_TYPE_TOPLEVEL) {
            this.indentLevel --;
            this.indentTypes.shift();
        }
        // if SQL "LIMIT" clause, start variable to reset newline
        if (token.value === "LIMIT" && !this.inlineParentheses) {
            this.limitClause = true;
        }
        query = this.addNewline(query);

        this.increaseToplevelIndent();

        query = this.addValueToQuery(query, token.value);
        return this.addNewline(query);
    }

    formatNewlineReservedWord(token, query) {
        query = this.addNewline(query);
        return this.addValueToQuery(query, token.value + " ");
    }

    // Opening parentheses increase the block indent level and start a new line
    formatOpeningParentheses(tokens, key, query) {
        // Take out the preceding space unless there was whitespace there in the original query
        if (tokens[key - 1] && tokens[key - 1].type !== sqlTokenTypes.WHITESPACE) {
            query = this.trimFromRight(query);
        }
        query = this.addValueToQuery(query, tokens[key].value);

        // Check if this should be an inline parentheses block
        // Examples are "NOW()", "COUNT(*)", "int(10)", key(`somecolumn`), DECIMAL(7,2)
        const parenthesesBlockLength = this.considerInlineParenthesesBlock(tokens, key);

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

    considerInlineParenthesesBlock(tokens, key) {
        let length = 0;

        for (let i = 1; i <= INLINE_PARENTHESES_SEARCH_RANGE; i ++) {
            // Reached end of string
            if (!tokens[key + i]) {
                break;
            }
            const next = tokens[key + i];

            // Reached closing parentheses, able to inline it
            if (next.value === ")") {
                this.inlineParentheses = true;
                this.inlineIndented = false;
                this.inlineLength = 0;
                break;
            }
            // Reached an invalid token value for inline parentheses
            if (next.value === ";" || next.value === "(") {
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

        query = this.trimFromRight(query);

        if (this.inlineIndented) {
            this.indentTypes.shift();
            this.indentLevel --;

            query = this.addNewline(query);
        }
        return this.addValueToQuery(query, token.value + " ");
    }

    formatClosingNewlineParentheses(token, query) {
        this.indentLevel --;

        // Reset indent level
        while (this.indentTypes.length) {
            const type = this.indentTypes.shift();

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
        query = this.trimFromRight(query);
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
        query = this.trimFromRight(query);
        return this.addValueToQuery(query, token.value);
    }

    formatStringConcat(tokens, key, query) {
        const token = tokens[key];

        if (token.value === "|" && tokens[key + 1] && tokens[key + 1].value === "|") {
            return this.addValueToQuery(query, token.value);
        }
        return this.addValueToQuery(query, token.value + " ");
    }

    formatLeftOver(token, query) {
        if (this.inlineParentheses) {
            this.inlineLength += token.value.length;
        }
        return this.addValueToQuery(query, token.value + " ");
    }

    increaseToplevelIndent() {
        this.indentLevel ++;
        this.indentTypes.unshift(INDENT_TYPE_TOPLEVEL);
    }

    increaseBlockIndent() {
        this.indentLevel ++;
        this.indentTypes.unshift(INDENT_TYPE_BLOCK);
    }

    addNewline(query) {
        query = this.trimFromRight(query);
        return query + "\n" + this.indent.repeat(this.indentLevel);
    }

    trimFromRight(query) {
        return query.replace(/\s+$/, "");
    }

    addValueToQuery(query, value) {
        return query + value;
    }

    getRefinedResult(formattedQuery) {
        return formattedQuery.replace(new RegExp(this.indent, "g"), "  ").trim() + "\n";
    }
}
