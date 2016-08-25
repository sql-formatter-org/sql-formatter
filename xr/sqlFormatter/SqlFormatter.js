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
        const originalTokens = this.tokenizer.tokenize(input);

        // Remove existing whitespace
        const tokens = [];

        _(originalTokens).forEach((token, key) => {
            if (token.type !== sqlTokenTypes.WHITESPACE) {
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
            if (token.type === sqlTokenTypes.COMMENT || token.type === sqlTokenTypes.BLOCK_COMMENT) {
                if (token.type === sqlTokenTypes.BLOCK_COMMENT) {
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
                    if (next.type === sqlTokenTypes.RESERVED_TOPLEVEL || next.type === sqlTokenTypes.RESERVED_NEWLINE ||
                        next.type === sqlTokenTypes.COMMENT || next.type === sqlTokenTypes.BLOCK_COMMENT) {
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
                if (originalTokens[token.key - 1] && originalTokens[token.key - 1].type !== sqlTokenTypes.WHITESPACE) {
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
            else if (token.type === sqlTokenTypes.RESERVED_TOPLEVEL) {
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
            else if (clauseLimit && token.value !== "," && token.type !== sqlTokenTypes.NUMBER &&
                token.type !== sqlTokenTypes.WHITESPACE) {
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
            else if (token.type === sqlTokenTypes.RESERVED_NEWLINE) {
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
            if (token.value === "-" && tokens[key + 1] && tokens[key + 1].type === sqlTokenTypes.NUMBER && tokens[key - 1]) {
                const prev = tokens[key - 1].type;

                if (prev !== sqlTokenTypes.QUOTE && prev !== sqlTokenTypes.BACKTICK_QUOTE &&
                    prev !== sqlTokenTypes.WORD && prev !== sqlTokenTypes.NUMBER) {
                    result = result.replace(/\s+$/, "");
                }
            }
        });
        return result.replace(/\t/g, "  ").trim() + "\n";
    }
}
