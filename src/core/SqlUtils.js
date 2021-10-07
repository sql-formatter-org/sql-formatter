import tokenTypes from "./tokenTypes";
import repeat from "lodash/repeat";

export default class SqlUtils {

    static getFirstWord(string) {
        if (string.trim() == "") {
            return "";
        }
        const split = string.trim().split(/,|\.|\(|\)| |%/);
        let idx = 0;
        while (idx < split.length && split[idx].trim() == "") {
            idx++;
        }
        if (idx == split.length) {
            return split[idx - 1].trim();
        }
        return split[idx].trim();
    }

    static getStringInOneStyle(word) {
        return word.replaceAll("(", " ( ").replaceAll(")", " ) ")
            .replaceAll(".", " . ").replaceAll("\"", " \" ")
            .replaceAll("*", " * ").replaceAll("/", " / ")
            .replaceAll("%", " % ").replaceAll(":", " : ")
            .replaceAll(",", " , ").replaceAll("=", " = ")
            .replaceAll("-", " - ").replaceAll("|", " | ")
            .replaceAll("'", " ' ").replaceAll("+", " + ")
            .replaceAll("<", " < ").replaceAll(">", " > ")
            .replaceAll("\\", " \\ ").replaceAll(";", " ; ")
            .replaceAll("?", " ? ").replaceAll("@", " @ ")
            .replaceAll("#", " # ").replaceAll(/(\s|\n)+/g, " ");
    }

    static trimStart(line) {
        while (line[0] == " ") {
            line = line.substring(1);
        }
        return line;
    }

    static getLineIndent(line) {
        let indent = 0;
        for (indent; indent < line.length; indent++) {
            if (line[indent] != " ") {
                return indent;
            }
        }
        return indent;
    }

    static formatTextCase(token) {
        if (token.value.match("^'.*'$|^util.*|^pkg_.*") != null ||
            token.type == tokenTypes.BLOCK_COMMENT ||
            token.type == tokenTypes.LINE_COMMENT || token.value.includes("'")) {
            return token.value;
        }
        else {
            return token.value.toLowerCase();
        }
    }

    static formatSubstringCase(string, tokenizer) {
        const toks = tokenizer.tokenize(string);
        let substring = "";
        let lowCase = string.toLowerCase();
        for (let token of toks) {
            if (token.type != tokenTypes.WHITESPACE) {
                token.value = SqlUtils.formatTextCase(token);
                const end = lowCase.indexOf(token.value.toLowerCase());
                const current = lowCase.substring(0, end) + token.value;
                substring += current;
                lowCase = lowCase.substring(lowCase.indexOf(current.toLowerCase()) + current.length);
            }
        }
        return substring;
    }

    static formatOriginSubstringWithIndent(indent, originIndent, substring) {
        const split = substring.split("\n");
        split[0] = repeat(" ", indent) + this.trimStart(split[0]);
        let inQuotes = this.inQuotes(split[0]);
        for (let i = 1; i < split.length; i++) {
            const cIndent = this.getLineIndent(split[i]);
            if (inQuotes) {
                if (this.inQuotes(split[i])) {
                    inQuotes = false;
                }
            }
            else {
                const lineIndent = cIndent > originIndent ? cIndent - originIndent + indent + 1 : indent;
                split[i] = repeat(" ", lineIndent ) + this.trimStart(split[i]);
                if (this.inQuotes(split[i])) {
                    inQuotes = true;
                }
            }
        }
        return split.join("\n");
    }

    static inQuotes(string) {
        const match = string.match(/'/g);
        return match != undefined && match.length % 2 == 1;
    }

    static findSubstring(first, searchString, query, tokenizer) {
        let substring = "";
        let indent = 0;
        let startIdx = 0;
        let hasError = false;
        while (this.getStringInOneStyle(substring).trim().toLowerCase() != searchString.trim().toLowerCase()) {
            substring = "";
            startIdx = query.toLowerCase().indexOf(first);
            while (searchString.trim().toLowerCase().startsWith(SqlUtils.getStringInOneStyle(substring).trim().toLowerCase()) &&
                    this.getStringInOneStyle(substring.trim()).trim().length != searchString.trim().length &&
                    startIdx != query.length) {
                substring += query[startIdx];
                startIdx++;
            }
            if (searchString.trim().toLowerCase() != this.getStringInOneStyle(substring).trim().toLowerCase()) {
                query = query.substring(query.toLowerCase().indexOf(first) + first.length);
            }
            if (query == "" && substring == "undefined"){
                hasError = true;
                break;
            }
        }
        const from = query.indexOf(substring);
        for (let i = from; i >= 0; i--) {
            if (query[i] == "\n") {
                break;
            }
            else {
                indent++;
            }
        }
        query = query.substring(query.indexOf(substring) + substring.length - 1);
        substring = this.formatSubstringCase(substring, tokenizer);
        return {
            substring: substring,
            indent: indent,
            query: query,
            hasError: hasError
        };
    }

    static originalBlockCommentInNewLine(token, query) {
        let idx = query.indexOf(token.value) - 1;
        while (idx >= 0 && query[idx] == " ") {
            idx--;
        }
        return query[idx] == "\n";
    }
}
