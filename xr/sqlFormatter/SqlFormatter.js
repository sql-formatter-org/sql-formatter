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
     * @param {String} input The SQL input string
     * @return {String} formatted string
     */
    format(input) {
        // Tokenize String
        this.tokensWithWhitespaces = this.tokenizer.tokenize(input);
        this.tokens = this.getTokensWithoutWhitespaces();

        const result = this.formatTokens();

        return this.getRefinedResult(result);
    }

    formatTokens() {
        let result = "";

        _(this.tokens).forEach((token, key) => {
            // If we are increasing the special indent level now
            if (this.increaseSpecialIndent) {
                this.indentLevel ++;
                this.indentTypes.unshift("special");
                this.increaseSpecialIndent = false;
            }
            // If we are increasing the block indent level now
            if (this.increaseBlockIndent) {
                this.indentLevel ++;
                this.indentTypes.unshift("block");
                this.increaseBlockIndent = false;
            }
            // If we need a new line before the token
            if (this.newline) {
                result = result.replace(/\s+$/, "");
                result += "\n" + this.indent.repeat(this.indentLevel);
                this.addedNewline = true;
                this.newline = false;
            }
            else {
                this.addedNewline = false;
            }
            // Display comments directly where they appear in the source
            if (token.type === sqlTokenTypes.COMMENT || token.type === sqlTokenTypes.BLOCK_COMMENT) {
                if (token.type === sqlTokenTypes.BLOCK_COMMENT) {
                    const indent = this.indent.repeat(this.indentLevel);
                    result = result.replace(/\s+$/, "");
                    result += "\n" + indent;
                    token.value = token.value.replace("\n", "\n" + indent);
                }
                result += token.value;
                this.newline = true;

                return result;
            }

            if (this.inlineParentheses) {
                // End of inline parentheses
                if (token.value === ")") {
                    result = result.replace(/\s+$/, "");

                    if (this.inlineIndented) {
                        this.indentTypes.shift();
                        this.indentLevel --;
                        result = result.replace(/\s+$/, "");
                        result += "\n" + this.indent.repeat(this.indentLevel);
                    }

                    this.inlineParentheses = false;

                    result += token.value + " ";
                    return result;
                }
            }

            // Opening parentheses increase the block indent level and start a new line
            if (token.value === "(") {
                // First check if this should be an inline parentheses block
                // Examples are "NOW()", "COUNT(*)", "int(10)", key(`somecolumn`), DECIMAL(7,2)
                // Allow up to 3 non-whitespace this.tokens inside inline parentheses
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
                    this.increaseBlockIndent = true;
                    this.inlineIndented = true;
                    this.newline = true;
                }

                // Take out the preceding space unless there was whitespace there in the original query
                if (this.tokensWithWhitespaces[token.key - 1] &&
                    this.tokensWithWhitespaces[token.key - 1].type !== sqlTokenTypes.WHITESPACE) {
                    result = result.replace(/\s+$/, "");
                }

                if (!this.inlineParentheses) {
                    this.increaseBlockIndent = true;
                    // Add a this.newline after the parentheses
                    this.newline = true;
                }
            }
            // Closing parentheses decrease the block indent level
            else if (token.value === ")") {
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

                // Add a this.newline before the closing parentheses (if not already added)
                if (!this.addedNewline) {
                    result = result.replace(/\s+$/, "");
                    result += "\n" + this.indent.repeat(this.indentLevel);
                }
            }
            // Top level reserved words start a new line and increase the special indent level
            else if (token.type === sqlTokenTypes.RESERVED_TOPLEVEL) {
                this.increaseSpecialIndent = true;

                // If the last indent type was "special", decrease the special indent for this round
                if (this.indentTypes[0] === "special") {
                    this.indentLevel --;
                    this.indentTypes.shift();
                }

                // Add a this.newline after the top level reserved word
                this.newline = true;

                // Add a this.newline before the top level reserved word (if not already added)
                if (!this.addedNewline) {
                    result = result.replace(/\s+$/, "");
                    result += "\n" + this.indent.repeat(this.indentLevel);
                }

                // If we already added a this.newline, redo the indentation since it may be different now
                else {
                    result = result.replace(/\t+$/, "") + this.indent.repeat(this.indentLevel);
                }

                // If the token may have extra whitespace
                if (token.value.indexOf(" ") !== -1 || token.value.indexOf("\n") !== -1 ||
                    token.value.indexOf("\t") !== -1) {
                    token.value = token.value.replace(/\s+/, " ", token.value);
                }

                // if SQL "LIMIT" clause, start variable to reset this.newline
                if (token.value === "LIMIT" && !this.inlineParentheses) {
                    this.clauseLimit = true;
                }
            }
            // Checks if we are out of the limit clause
            else if (this.clauseLimit && token.value !== "," && token.type !== sqlTokenTypes.NUMBER &&
                token.type !== sqlTokenTypes.WHITESPACE) {
                this.clauseLimit = false;
            }
            // Commas start a new line (unless within inline parentheses or SQL "LIMIT" clause)
            else if (token.value === "," && !this.inlineParentheses) {
                // If the previous TOKEN_VALUE is "LIMIT", resets new line
                if (this.clauseLimit === true) {
                    this.newline = false;
                    this.clauseLimit = false;
                }
                // All other cases of commas
                else {
                    this.newline = true;
                }
            }
            // Newline reserved words start a new line
            else if (token.type === sqlTokenTypes.RESERVED_NEWLINE) {
                // Add a this.newline before the reserved word (if not already added)
                if (!this.addedNewline) {
                    result = result.replace(/\s+$/, "");
                    result += "\n" + this.indent.repeat(this.indentLevel);
                }

                // If the token may have extra whitespace
                if (token.value.indexOf(" ") !== -1 || token.value.indexOf("\n") !== -1 ||
                    token.value.indexOf("\t") !== -1) {
                    token.value = token.value.replace(/\s+/, " ");
                }
            }

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
            if (token.value === "-" && this.tokens[key + 1] && this.tokens[key + 1].type === sqlTokenTypes.NUMBER && this.tokens[key - 1]) {
                const prev = this.tokens[key - 1].type;

                if (prev !== sqlTokenTypes.QUOTE && prev !== sqlTokenTypes.BACKTICK_QUOTE &&
                    prev !== sqlTokenTypes.WORD && prev !== sqlTokenTypes.NUMBER) {
                    result = result.replace(/\s+$/, "");
                }
            }
        });
        return result;
    }

    getTokensWithoutWhitespaces() {
        const result = [];

        _(this.tokensWithWhitespaces).forEach((token, key) => {
            if (token.type !== sqlTokenTypes.WHITESPACE) {
                token.key = key;
                result.push(token);
            }
        });
        return result;
    }

    getRefinedResult(result) {
        return result.replace(new RegExp(this.indent, "g"), "  ").trim() + "\n";
    }
}
