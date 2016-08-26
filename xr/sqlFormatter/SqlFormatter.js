import _ from "xr/_";
import sqlTokenTypes from "xr/sqlFormatter/sqlTokenTypes";
import SqlTokenizer from "xr/sqlFormatter/SqlTokenizer";

const INDENT_TYPE_TOPLEVEL = "toplevel-indent";
const INDENT_TYPE_BLOCK = "block-indent";

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
        this.tokensWithWhitespaces = this.tokenizer.tokenize(query);
        this.tokens = this.getTokensWithoutWhitespaces();

        const formattedQuery = this.formatQuery();

        return this.getRefinedResult(formattedQuery);
    }

    getTokensWithoutWhitespaces() {
        const tokensWithoutWhitespaces = [];

        _(this.tokensWithWhitespaces).forEach((token, key) => {
            if (token.type !== sqlTokenTypes.WHITESPACE) {
                token.originalKey = key;
                tokensWithoutWhitespaces.push(token);
            }
        });
        return tokensWithoutWhitespaces;
    }

    formatQuery() {
        let formattedQuery = "";

        _(this.tokens).forEach((token, key) => {
            if (token.type === sqlTokenTypes.COMMENT || token.type === sqlTokenTypes.BLOCK_COMMENT) {
                formattedQuery = this.formatComment(token, formattedQuery);
            }
            else if (this.inlineParentheses) {
                formattedQuery = this.formatInlineParentheses(token, formattedQuery);
            }
            else if (token.value === "(") {
                formattedQuery = this.formatOpeningParentheses(token, key, formattedQuery);
            }
            else if (token.value === ")") {
                formattedQuery = this.formatClosingParentheses(formattedQuery);
            }
            else if (token.type === sqlTokenTypes.RESERVED_TOPLEVEL) {
                formattedQuery = this.formatToplevelReservedWord(token, formattedQuery);
            }
            else if (token.type === sqlTokenTypes.RESERVED_NEWLINE) {
                formattedQuery = this.formatNewlineReservedWord(token, formattedQuery);
            }
            else if (token.value === "," && !this.inlineParentheses) {
                this.formatComma();
            }
            else if (this.hasLimitClauseEnded(token)) {
                this.limitClause = false;
            }
            formattedQuery = this.addTokenValueToQuery(token, key, formattedQuery);

            this.increaseToplevelIndentOnNeed();
            this.increaseBlockIndentOnNeed();

            formattedQuery = this.addNewlineOnNeed(formattedQuery);
        });
        return formattedQuery;
    }

    increaseToplevelIndentOnNeed() {
        if (this.needToIncreaseToplevelIndent) {
            this.indentLevel ++;
            this.indentTypes.unshift(INDENT_TYPE_TOPLEVEL);
            this.needToIncreaseToplevelIndent = false;
        }
    }

    increaseBlockIndentOnNeed() {
        if (this.needToIncreaseBlockIndent) {
            this.indentLevel ++;
            this.indentTypes.unshift(INDENT_TYPE_BLOCK);
            this.needToIncreaseBlockIndent = false;
        }
    }

    addNewlineOnNeed(query) {
        if (this.needToAddNewline) {
            query = this.addNewline(query);

            this.addedNewline = true;
            this.needToAddNewline = false;
        }
        else {
            this.addedNewline = false;
        }
        return query;
    }

    // Display comments directly where they appear in the source
    formatComment(token, query) {
        if (token.type === sqlTokenTypes.BLOCK_COMMENT) {
            query = this.addNewline(query);

            token.value = token.value.replace("\n", "\n" + this.indent.repeat(this.indentLevel));
        }
        this.needToAddNewline = true;

        return query;
    }

    formatInlineParentheses(token, query) {
        if (token.value === ")") {
            query = this.formatClosingInlineParentheses(query);
        }
        else if (token.value === ",") {
            if (this.inlineLength >= 30) {
                this.inlineLength = 0;
                this.needToAddNewline = true;
            }
        }
        this.inlineLength += token.value.length;

        return query;
    }

    formatClosingInlineParentheses(query) {
        this.inlineParentheses = false;

        query = this.trimFromRight(query);

        if (this.inlineIndented) {
            this.indentTypes.shift();
            this.indentLevel --;

            query = this.addNewline(query);
        }
        return query;
    }

    // Opening parentheses increase the block indent level and start a new line
    formatOpeningParentheses(token, key, query) {
        // First check if this should be an inline parentheses block
        // Examples are "NOW()", "COUNT(*)", "int(10)", key(`somecolumn`), DECIMAL(7,2)
        // Allow up to 30 non-whitespace inside inline parentheses
        let length = 0;

        for (let i = 1; i <= 250; i ++) {
            // Reached end of string
            if (!this.tokens[key + i]) {
                break;
            }
            const next = this.tokens[key + i];

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

        if (this.inlineParentheses && length > 30) {
            this.needToIncreaseBlockIndent = true;
            this.inlineIndented = true;
            this.needToAddNewline = true;
        }
        else if (!this.inlineParentheses) {
            this.needToIncreaseBlockIndent = true;
            this.needToAddNewline = true;
        }

        // Take out the preceding space unless there was whitespace there in the original query
        if (this.tokensWithWhitespaces[token.originalKey - 1] &&
            this.tokensWithWhitespaces[token.originalKey - 1].type !== sqlTokenTypes.WHITESPACE) {
            query = this.trimFromRight(query);
        }
        return query;
    }

    // Closing parentheses decrease the block indent level
    formatClosingParentheses(query) {
        this.indentLevel --;

        // Reset indent level
        while (this.indentTypes.length) {
            const type = this.indentTypes.shift();

            if (type !== INDENT_TYPE_TOPLEVEL) {
                break;
            }
            this.indentLevel --;
        }
        // Remove whitespace before the closing parentheses
        query = this.trimFromRight(query);

        // Add a newline before the closing parentheses (if not already added)
        if (!this.addedNewline) {
            return this.addNewline(query);
        }
        return query;
    }

    // Top level reserved words start a new line and increase the toplevel indent level
    formatToplevelReservedWord(token, query) {
        this.needToIncreaseToplevelIndent = true;

        // If the last indent type was INDENT_TYPE_TOPLEVEL, decrease the toplevel indent for this round
        if (this.indentTypes[0] === INDENT_TYPE_TOPLEVEL) {
            this.indentLevel --;
            this.indentTypes.shift();
        }

        // Add a newline after the top level reserved word
        this.needToAddNewline = true;

        // Add a newline before the top level reserved word (if not already added)
        if (!this.addedNewline) {
            query = this.addNewline(query);
        }
        // If we already added a newline, redo the indentation since it may be different now
        else {
            query = query.replace(/\t+$/, "") + this.indent.repeat(this.indentLevel);
        }
        this.removeExtraWhitespacesFromToken(token);

        // if SQL "LIMIT" clause, start variable to reset newline
        if (token.value === "LIMIT" && !this.inlineParentheses) {
            this.limitClause = true;
        }
        return query;
    }

    // Newline reserved words start a new line
    formatNewlineReservedWord(token, query) {
        // Add a newline before the reserved word (if not already added)
        if (!this.addedNewline) {
            query = this.addNewline(query);
        }
        this.removeExtraWhitespacesFromToken(token);

        return query;
    }

    // Commas start a new line (unless within inline parentheses or SQL "LIMIT" clause)
    formatComma() {
        // If the previous TOKEN_VALUE is "LIMIT", resets new line
        if (this.limitClause === true) {
            this.needToAddNewline = false;
            this.limitClause = false;
        }
        else {
            this.needToAddNewline = true;
        }
    }

    hasLimitClauseEnded(token) {
        return this.limitClause && token.value !== "," && token.type !== sqlTokenTypes.NUMBER && token.type !== sqlTokenTypes.WHITESPACE;
    }

    addTokenValueToQuery(token, key, query) {
        // If the token shouldn't have a space before it
        if (token.value === "." || token.value === "," || token.value === ";") {
            query = this.trimFromRight(query);
        }

        query += token.value + " ";

        // If the token shouldn't have a space after it
        if (token.value === "(" || token.value === ".") {
            query = this.trimFromRight(query);
        }

        // If this is the "-" of a negative number, it shouldn't have a space after it
        if (token.value === "-" && this.tokens[key + 1] && this.tokens[key + 1].type === sqlTokenTypes.NUMBER && this.tokens[key - 1]) {
            const previousTokenType = this.tokens[key - 1].type;

            if (previousTokenType !== sqlTokenTypes.QUOTE && previousTokenType !== sqlTokenTypes.BACKTICK_QUOTE &&
                previousTokenType !== sqlTokenTypes.WORD && previousTokenType !== sqlTokenTypes.NUMBER) {
                query = this.trimFromRight(query);
            }
        }
        return query;
    }

    addNewline(query) {
        query = this.trimFromRight(query);
        return query + "\n" + this.indent.repeat(this.indentLevel);
    }

    trimFromRight(query) {
        return query.replace(/\s+$/, "");
    }

    removeExtraWhitespacesFromToken(token) {
        if (_.includes(token.value, " ") || _.includes(token.value, "\n") || _.includes(token.value, "\t")) {
            token.value = token.value.replace(/\s+/, " ", token.value);
        }
    }

    getRefinedResult(formattedQuery) {
        return formattedQuery.replace(new RegExp(this.indent, "g"), "  ").trim() + "\n";
    }
}
