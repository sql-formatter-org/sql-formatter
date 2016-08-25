import _ from "xr/_";
import sqlTokenTypes from "xr/sqlFormatter/sqlTokenTypes";
import SqlTokenizer from "xr/sqlFormatter/SqlTokenizer";

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
    }

    /**
     * Format the whitespace in a SQL string to make it easier to read.
     *
     * @param {String} query The SQL input query
     * @return {String} formatted string
     */
    format(query) {
        const tokensWithWhitespaces = this.tokenizer.tokenize(query);
        const tokens = this.getTokensWithoutWhitespaces(tokensWithWhitespaces);
        const result = this.formatTokens(tokens, tokensWithWhitespaces);

        return this.getRefinedResult(result);
    }

    getTokensWithoutWhitespaces(tokens) {
        const result = [];

        _(tokens).forEach((token, key) => {
            if (token.type !== sqlTokenTypes.WHITESPACE) {
                token.key = key;
                result.push(token);
            }
        });
        return result;
    }

    formatTokens(tokens, tokensWithWhitespaces) {
        let result = "";

        _(tokens).forEach((token, key) => {
            this.increaseSpecialIndentOnNeed();
            this.increaseBlockIndentOnNeed();

            result = this.addNewlineOnNeed(result);

            // Display comments directly where they appear in the source
            if (token.type === sqlTokenTypes.COMMENT || token.type === sqlTokenTypes.BLOCK_COMMENT) {
                result = this.formatComment(token, result);
                return;
            }
            // TODO explain what does this do
            else if (this.inlineParentheses && token.value === ")") {
                result = this.formatClosingInlineParentheses(token, result);
                return;
            }
            // Opening parentheses increase the block indent level and start a new line
            else if (token.value === "(") {
                result = this.formatOpeningParentheses(token, key, tokens, tokensWithWhitespaces, result);
            }
            // Closing parentheses decrease the block indent level
            else if (token.value === ")") {
                result = this.formatClosingParentheses(result);
            }
            // Top level reserved words start a new line and increase the special indent level
            else if (token.type === sqlTokenTypes.RESERVED_TOPLEVEL) {
                result = this.formatToplevelReservedWord(token, result);
            }
            // Newline reserved words start a new line
            else if (token.type === sqlTokenTypes.RESERVED_NEWLINE) {
                result = this.formatNewlineReservedWord(token, result);
            }
            // Commas start a new line (unless within inline parentheses or SQL "LIMIT" clause)
            else if (token.value === "," && !this.inlineParentheses) {
                this.formatComma();
            }
            // Checks if we are out of the limit clause
            else if (this.limitClause && token.value !== "," && token.type !== sqlTokenTypes.NUMBER &&
                token.type !== sqlTokenTypes.WHITESPACE) {
                this.limitClause = false;
            }
            result = this.manageWhitespaces(token, key, tokens, result);
        });
        return result;
    }

    increaseSpecialIndentOnNeed() {
        if (this.needToIncreaseSpecialIndent) {
            this.indentLevel ++;
            this.indentTypes.unshift("special");
            this.needToIncreaseSpecialIndent = false;
        }
    }

    increaseBlockIndentOnNeed() {
        if (this.needToIncreaseBlockIndent) {
            this.indentLevel ++;
            this.indentTypes.unshift("block");
            this.needToIncreaseBlockIndent = false;
        }
    }

    addNewlineOnNeed(result) {
        if (this.needToAddNewline) {
            result = this.addNewline(result);

            this.addedNewline = true;
            this.needToAddNewline = false;
        }
        else {
            this.addedNewline = false;
        }
        return result;
    }

    formatComment(token, result) {
        if (token.type === sqlTokenTypes.BLOCK_COMMENT) {
            const indent = this.indent.repeat(this.indentLevel);
            result = result.replace(/\s+$/, "");
            result += "\n" + indent;
            token.value = token.value.replace("\n", "\n" + indent);
        }
        result += token.value;
        this.needToAddNewline = true;

        return result;
    }

    formatClosingInlineParentheses(token, result) {
        result = result.replace(/\s+$/, "");

        if (this.inlineIndented) {
            this.indentTypes.shift();
            this.indentLevel --;

            result = this.addNewline(result);
        }
        this.inlineParentheses = false;

        result += token.value + " ";

        return result;
    }

    formatOpeningParentheses(token, key, tokens, tokensWithWhitespaces, result) {
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
                this.inlineParentheses = true;
                this.inlineIndented = false;
                break;
            }
            // Reached an invalid token for inline parentheses
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

        // Take out the preceding space unless there was whitespace there in the original query
        if (tokensWithWhitespaces[token.key - 1] &&
            tokensWithWhitespaces[token.key - 1].type !== sqlTokenTypes.WHITESPACE) {
            result = result.replace(/\s+$/, "");
        }

        if (!this.inlineParentheses) {
            this.needToIncreaseBlockIndent = true;
            // Add a this.needToAddNewline after the parentheses
            this.needToAddNewline = true;
        }
        return result;
    }

    formatClosingParentheses(result) {
        // Remove whitespace before the closing parentheses
        result = result.replace(/\s+$/, "");

        this.indentLevel --;

        // Reset indent level
        while (this.indentTypes.length) {
            const type = this.indentTypes.shift();

            if (type === "special") {
                this.indentLevel --;
            }
            else {
                break;
            }
        }

        // Add a this.needToAddNewline before the closing parentheses (if not already added)
        if (!this.addedNewline) {
            result = result.replace(/\s+$/, "");
            result += "\n" + this.indent.repeat(this.indentLevel);
        }
        return result;
    }

    formatToplevelReservedWord(token, result) {
        this.needToIncreaseSpecialIndent = true;

        // If the last indent type was "special", decrease the special indent for this round
        if (this.indentTypes[0] === "special") {
            this.indentLevel --;
            this.indentTypes.shift();
        }

        // Add a this.needToAddNewline after the top level reserved word
        this.needToAddNewline = true;

        // Add a this.needToAddNewline before the top level reserved word (if not already added)
        if (!this.addedNewline) {
            result = result.replace(/\s+$/, "");
            result += "\n" + this.indent.repeat(this.indentLevel);
        }

        // If we already added a this.needToAddNewline, redo the indentation since it may be different now
        else {
            result = result.replace(/\t+$/, "") + this.indent.repeat(this.indentLevel);
        }

        // If the token may have extra whitespace
        if (token.value.indexOf(" ") !== -1 || token.value.indexOf("\n") !== -1 ||
            token.value.indexOf("\t") !== -1) {
            token.value = token.value.replace(/\s+/, " ", token.value);
        }

        // if SQL "LIMIT" clause, start variable to reset this.needToAddNewline
        if (token.value === "LIMIT" && !this.inlineParentheses) {
            this.limitClause = true;
        }
        return result;
    }

    formatNewlineReservedWord(token, result) {
        // Add a newline before the reserved word (if not already added)
        if (!this.addedNewline) {
            result = result.replace(/\s+$/, "");
            result += "\n" + this.indent.repeat(this.indentLevel);
        }

        // If the token may have extra whitespace
        if (token.value.indexOf(" ") !== -1 || token.value.indexOf("\n") !== -1 ||
            token.value.indexOf("\t") !== -1) {
            token.value = token.value.replace(/\s+/, " ");
        }
        return result;
    }

    formatComma() {
        // If the previous TOKEN_VALUE is "LIMIT", resets new line
        if (this.limitClause === true) {
            this.needToAddNewline = false;
            this.limitClause = false;
        }
        // All other cases of commas
        else {
            this.needToAddNewline = true;
        }
    }

    manageWhitespaces(token, key, tokens, result) {
        // If the token shouldn"t have a space before it
        if (token.value === "." || token.value === "," || token.value === ";") {
            result = result.replace(/\s+$/, "");
        }
        result += token.value + " ";

        // If the token shouldn"t have a space after it
        if (token.value === "(" || token.value === ".") {
            result = result.replace(/\s+$/, "");
        }

        // If this is the "-" of a negative number, it shouldn"t have a space after it
        if (token.value === "-" && tokens[key + 1] && tokens[key + 1].type === sqlTokenTypes.NUMBER && tokens[key - 1]) {
            const prev = tokens[key - 1].type;

            if (prev !== sqlTokenTypes.QUOTE && prev !== sqlTokenTypes.BACKTICK_QUOTE &&
                prev !== sqlTokenTypes.WORD && prev !== sqlTokenTypes.NUMBER) {
                result = result.replace(/\s+$/, "");
            }
        }
        return result;
    }

    addNewline(result) {
        result = result.replace(/\s+$/, "");
        result += "\n" + this.indent.repeat(this.indentLevel);

        return result;
    }

    getRefinedResult(result) {
        return result.replace(new RegExp(this.indent, "g"), "  ").trim() + "\n";
    }
}
