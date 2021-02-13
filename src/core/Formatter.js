// import includes from "lodash/includes";
import trimEnd from "lodash/trimEnd";
import tokenTypes from "./tokenTypes";
import Params from "./Params";
import repeat from "lodash/repeat";

export default class Formatter {
    constructor(cfg, tokenizer, reservedWords) {
        this.cfg = cfg || {};
        this.params = new Params(this.cfg.params);
        this.tokenizer = tokenizer;
        this.previousReservedWord = {};
        this.tokens = [];
        this.index = 0;
        this.reservedWords = reservedWords;
        this.inlineReservedWord = ["order", "group"];
        this.indents = [];
        this.lines = [""];
        this.startBlock = ["select", "begin", "create", "alter", "insert", "update", "drop", "merge"];
        this.logicalOperators = ["or", "xor", "and"];
    }

    format(query) {
        this.query = query;
        this.tokens = this.tokenizer.tokenize(query);
        this.formatQuery();
        return this.lines.join("\n").trim();
    }

    getFormatArray(query) {
        this.query = query;
        this.tokens = this.tokenizer.tokenize(query);
        this.formatQuery();
        return this.lines.join("\n").split("\n");
    }

    formatQuery() {
        const originalQuery = this.query;
        for (let i = 0; i < this.tokens.length; i++) {
            const token = this.tokens[i];
            token.value = this.formatTextCase(token);
            if (token.value.startsWith(".") && token.value != ".." ) {
                this.lines[this.lastIndex()] = trimEnd(this.getLastString());
            }
            if (token.type == tokenTypes.WHITESPACE) {
                if (!this.getLastString().endsWith(" ") && !this.getLastString().endsWith("(")) {
                    this.lines[this.lastIndex()] += " ";
                }
            }
            else if (token.type == tokenTypes.LINE_COMMENT) {
                this.formatLineComment(token);
            }
            else if (token.type == tokenTypes.BLOCK_COMMENT) {
                this.formatBlockComment(token);
            }
            else if (token.type == tokenTypes.RESERVED_TOPLEVEL) {
                this.formatTopLeveleReservedWord(token);
                this.previousReservedWord = token;
            }
            else if (token.type == tokenTypes.RESERVED_NEWLINE) {
                this.formatNewlineReservedWord(token);
                this.previousReservedWord = token;
            }
            else if (this.logicalOperators.includes(token.value)) {
                this.formatLogicalOperators(token);
            }
            else if (token.value == "into") {
                this.formatInto(token);
            }
            else if (token.type == tokenTypes.RESERVED) {
                this.formatWithSpaces(token);
                this.previousReservedWord = token;
            }
            else if (token.type == tokenTypes.OPEN_PAREN) {
                this.formatOpeningParentheses(token);
            }
            else if (token.type == tokenTypes.CLOSE_PAREN) {
                this.formatClosingParentheses(token);
            }
            else if (token.type == tokenTypes.PLACEHOLDER) {
                this.formatPlaceholder(token);
            }
            else if (token.value == ",") {
                this.formatComma(token);
            }
            else if (token.value == ":") {
                this.formatWithSpaceAfter(token);
            }
            else if (token.value == "." || token.value == "%") {
                this.formatWithoutSpaces(token);
            }
            else if (token.value == ";") {
                this.formatQuerySeparator(token);
            }
            else {
                this.formatWithSpaces(token);
            }
        }

        this.query = originalQuery;
        for (let i = 0; i < this.lines.length; i++) {
            this.lines[i] = this.formatLineByLength(this.lines[i]);
        }
        const length = this.lines.length - 1;
        if (this.lines[length].trim() == ")" || this.lines[length].trim() == ");" || this.lines[length].trim() == ";") {
            if (length != 0) {
                this.lines[length - 1] += this.lines[length].trim();
                this.lines.pop();
            }
        }
    }

    formatInto(token) {
        if (this.getLastString().includes("insert") || this.getLastString().includes("returning") ||
            this.getLastString().includes("merge")) {
            this.lines[this.lastIndex()] += token.value;
        }
        else {
            this.formatTopLeveleReservedWord(token);
        }
    }

    formatLogicalOperators(token) {
        this.trimEndLastString();
        let last = this.getLastString();
        if (last.trim() == ")") {
            this.lines[this.lastIndex() - 1] += ")";
            this.lines.pop();
            last = this.getLastString();
        }
        const words = last.trim().split(" ");
        const indent = this.getLogicalIndent(token.value, words[0]);
        if (this.logicalOperators.includes(words[0]) && words[1].startsWith("(") && !words[words.length - 1].endsWith(")")) {
            this.lines[this.lastIndex()] += " ";
        }
        else if (last.includes(" on ") && !last.includes(" join ")) {
            const boolExps = last.split(/ and | or | xor /);
            if (boolExps.length > 3) {
                const indent = last.indexOf("on ") + 4;
                this.lines[this.lastIndex()] = boolExps[0];
                last = last.substring(last.indexOf(boolExps[0]) + boolExps[0].length);
                for (let i = 1; i < boolExps.length; i++) {
                    this.lines.push(repeat(" ", indent));
                    const bool = last.trim().split(" ")[0];
                    if (bool.length < 3) {
                        this.lines[this.lastIndex()] += repeat(" ", 3 - bool.length);
                    }
                    this.lines[this.lastIndex()] += bool + " " + boolExps[i];
                    last = last.substring(last.indexOf(boolExps[i]) + boolExps[i].length);
                }
                this.lines.push(repeat(" ", indent));
            }
            else {
                this.lines[this.lastIndex()] += " ";
            }
        }
        else if (last.trim() != "" && indent > 0) {
            this.lines.push(repeat(" ", indent));
        }
        this.lines[this.lastIndex()] += token.value;
    }

    getLogicalIndent(operator, first) {
        let indent = 0;
        if (this.logicalOperators.includes(first)) {
            indent = this.getLastString().length - this.getLastString().trim().length;
            return indent + first.length - operator.length;
        }
        else if (this.getLastString().includes(" when ")) {
            return this.getLastString().indexOf("when") + 4 - operator.length;
        }
        else if (this.getLastString().includes(" on(") || this.getLastString().includes(" on ")) {
            indent = this.getLastString().indexOf(" on(");
            if (indent == -1) {
                indent = this.getLastString().indexOf(" on ");
            }
            return indent + 3 - operator.length;
        }
        else {
            this.addNewLine("right", operator);
            return -1;
        }
    }

    formatComma(token) {
        const last = this.getLastString();
        if (this.inlineReservedWord.includes(last.trim().split(" ")[0])) {
            this.formatCommaInlineReservedWord(last, token);
        }
        else {
            this.trimEndLastString();
            this.lines[this.lastIndex()] += token.value;
            this.addNewLine("left", token.value);
        }
    }

    formatCommaInlineReservedWord(last, token) {
        const subLines = last.split(",");
        if (last.split(",").length > 2) {
            this.lines[this.lastIndex()] = trimEnd(subLines[0]) + ",";
            this.indents[this.indents.length - 1].indent += 1;
            this.indents[this.indents.length - 1].token.value = "order by";
            this.addNewLine("left", ",");
            for (let i = 1; i < subLines.length; i++) {
                this.lines[this.lastIndex()] += subLines[i].trim() + ",";
                this.addNewLine("left", ",");
            }
        }
        else {
            this.trimEndLastString();
            this.lines[this.lastIndex()] += token.value;
        }
    }

    formatTopLeveleReservedWord(token) {
        if (this.startBlock.includes(token.value.split(" ")[0])) {
            if (this.getLastString().includes("union")) {
                this.indents.pop;
                this.addNewLine("right", token.value);
            }
            else if (this.getLastString().trim() != "" && this.getLastString().trim().endsWith(")")) {
                this.addNewLine("right", token.value);
            }
            this.indents.push({token: token, indent: this.getLastString().length});
        }
        else {
            this.addNewLine("right", token.value);
        }
        this.lines[this.lastIndex()] += token.value;
    }

    formatTextCase(token) {
        if (token.value.match("^'.*'$|^util.*|^pkg_.*") != null ||
            token.type == tokenTypes.BLOCK_COMMENT ||
            token.type == tokenTypes.LINE_COMMENT || token.value.includes("'")) {
            return token.value;
        }
        else {
            return token.value.toLowerCase();
        }
    }

    addNewLine(align, word) {
        if (this.getLastString().trim() == ")") {
            this.lines.pop();
            this.lines[this.lastIndex()] += ")";
        }
        else {
            this.trimEndLastString();
        }
        const indent = this.getCurrentIndent(align, word);
        if (this.getLastString().trim() == "") {
            this.lines[this.lastIndex()] = repeat(" ", indent);
        }
        else {
            this.lines.push(repeat(" ", indent));
        }
    }

    formatLineByLength(line) {
        const maxCleanLineLength = 60;
        let last = line.trim();
        if (last.trim().length < maxCleanLineLength) {
            return line;
        }
        const firstChar = last[0];
        if (firstChar == "(" || firstChar == ")") {
            last = last.substring(1).trim();
        }
        const split = last.split(/\(|\)| |,/);
        const first = split[0];
        const lastWithoutSpace = this.getStringInOneStyle(last);
        const info = this.findSubstring(first.toLowerCase(), lastWithoutSpace.toLowerCase());
        let substring = info.substring;
        if (firstChar == "(" || firstChar == ")") {
            substring = firstChar + substring;
        }
        const indent = this.getLineIndent(line);
        if (this.reservedWords.includes(first)){
            return this.formatOriginSubstringWithIndent(indent + first.length + 1, info.indent, substring);
        }
        return this.formatOriginSubstringWithIndent(indent, info.indent, substring);
    }

    getLineIndent(line) {
        let indent = 0;
        for (indent; indent < line.length; indent++) {
            if (line[indent] != " ") {
                return indent;
            }
        }
        return indent;
    }

    formatOriginSubstringWithIndent(indent, originIndent, substring) {
        const split = substring.split("\n");
        if (split[0].match(/'/g) == undefined || split[0].match(/'/g).length % 2 == 0) {
            split[0] = repeat(" ", indent) + this.trimStart(split[0]);
        }
        else {
            split[0] = repeat(" ", indent) + split[0].trim();
        }
        let inQuotes = (split[0].match(/'/g) != undefined && split[0].match(/'/g) % 2 == 1);
        for (let i = 1; i < split.length; i++) {
            const match = split[i].match(/'/g);
            const cIndent = this.getLineIndent(split[i]);
            if (inQuotes) {
                split[i] = split[i];
                if (match != undefined && match.length % 2 == 1) {
                    inQuotes = false;
                }
            }
            else {
                if (match != undefined) {
                    if (match.length % 2 == 1) {
                        inQuotes = true;
                    }
                    split[i] = repeat(" ", cIndent - originIndent + indent ) + this.trimStart(split[i]);
                }
                else {
                    split[i] = repeat(" ", cIndent - originIndent + indent) + split[i].trim();
                }
            }
        }
        return split.join("\n");
    }

    trimStart(line) {
        while (line[0] == " ") {
            line = line.substring(1);
        }
        return line;
    }

    findSubstring(first, searchString) {
        let substring = "";
        let indent = 0;
        let startIdx = 0;
        while (this.getStringInOneStyle(substring).trim().toLowerCase() != searchString.trim().toLowerCase()) {
            substring = "";
            startIdx = this.query.toLowerCase().indexOf(first);
            while (searchString.trim().toLowerCase().startsWith(this.getStringInOneStyle(substring).trim().toLowerCase()) &&
            this.getStringInOneStyle(substring.trim()).trim().length != searchString.trim().length &&
                    startIdx != this.query.length) {
                substring += this.query[startIdx];
                startIdx++;
            }
            if (searchString.trim().toLowerCase() != this.getStringInOneStyle(substring).trim().toLowerCase()) {
                this.query = this.query.substring(this.query.toLowerCase().indexOf(first) + first.length);
            }
        }
        const from = this.query.indexOf(substring);
        for (let i = from; i >= 0; i--) {
            if (this.query[i] == "\n") {
                break;
            }
            else {
                indent++;
            }
        }
        this.query = this.query.substring(this.query.indexOf(substring) + substring.length - 1);
        substring = this.formatSubstringCase(substring);
        return {
            substring: substring,
            indent: indent
        };
    }

    getStringInOneStyle(word) {
        return word.replaceAll("(", " ( ").replaceAll(")", " ) ")
            .replaceAll(".", " . ").replaceAll("\"", " \" ")
            .replaceAll("*", " * ").replaceAll("/", " / ")
            .replaceAll("%", " % ").replaceAll(":", " : ")
            .replaceAll(",", " , ").replaceAll("=", " = ")
            .replaceAll("-", " - ").replaceAll("|", " | ")
            .replaceAll("'", " ' ").replaceAll("+", " + ")
            .replaceAll("\\", " \\ ").replaceAll(";", " ; ")
            .replaceAll("?", " ? ").replaceAll("@", " @ ")
            .replaceAll("#", " # ").replaceAll(/(\s|\n)+/g, " ");
    }

    formatSubstringCase(string) {
        const toks = this.tokenizer.tokenize(string);
        let prev = toks[0];
        prev.value = this.formatTextCase(prev);
        let substring = "";
        let lowCase = string.toLowerCase();
        for (let i = 1; i < toks.length; i++) {
            const token = toks[i];
            token.value = this.formatTextCase(token);
            if (token.type != tokenTypes.WHITESPACE) {
                const end = lowCase.indexOf(token.value.toLowerCase());
                const current = lowCase.substring(0, end) + token.value;
                substring += current;
                lowCase = lowCase.substring(lowCase.indexOf(current.toLowerCase()) + current.length);
                prev = token;
            }
        }
        return substring;
    }

    getCurrentIndent(align, word) {
        const last = this.indents[this.indents.length - 1];
        if (last == undefined) {
            this.lines.push("");
            return;
        }
        let indent = last.indent;
        if (align == "right") {
            let dif = last.token.value.split(" ")[0].trim().length
                            - word.split(" ")[0].trim().length;
            if (dif < 0) {
                dif = 0;
            }
            if (word == ")") {
                dif = -1;
            }
            indent += dif;
        }
        else {
            indent += last.token.value.length + 1;
        }
        return indent;
    }

    formatBlockComment(token) {
        this.resolveAddLineInCommentsBlock(token);
        const indent = this.getLastString().length + 2;
        let comment = token.value;
        const commentsLine = comment.split("\n");
        comment = commentsLine[0];
        for (let i = 1; i < commentsLine.length; i++) {
            if (commentsLine[i].trim().startsWith("*")) {
                comment += "\n" + repeat(" ", indent + 1);
            }
            else {
                comment += "\n" + repeat(" ", indent);
            }
            comment += commentsLine[i];
        }
        this.lines[this.lastIndex()] += comment;
        this.addNewLine("left", token.value);
    }

    resolveAddLineInCommentsBlock(token) {
        const substing = this.getLastString().trim();
        const words = substing.split(/\(|\)| /);
        const last = words[words.length - 1];
        if (!this.reservedWords.includes(last.toUpperCase()) || last.endsWith(";")) {
            this.addNewLine("left", token.value);
        }
    }

    formatLineComment(token) {
        const qLines = this.query.split("\n");
        let isNewLine = false;
        for (let i = 0; i < qLines.length; i++) {
            if (qLines[i].includes(token.value.trim()) && qLines[i].trim() == token.value.trim()) {
                isNewLine = true;
                break;
            }
        }
        this.query = this.query.substring(this.query.indexOf(token.value) + token.value.length);
        if (isNewLine) {
            const indent = this.getCurrentIndent("right", "");
            this.lines.push(repeat(" ", indent + 1) + token.value);
            this.addNewLine("left", "");
        }
        else {
            const before = this.getLastString();
            this.lines[this.lastIndex()] += token.value;
            this.addNewLine("right", "");
            if (before.trim().endsWith("then")) {
                this.lines[this.lastIndex()] += repeat(" ", 6);
            }
        }
    }

    formatNewlineReservedWord(token) {
        const last = this.getLastString();
        if (last.includes("case") && !last.includes("when")) {
        }
        else if (last.trim().split(" ").length > 1 || last.trim() == ")" &&
         !(last.includes("case") && !last.includes("when"))) {
            this.addNewLine("left", token.value);
        }
        this.lines[this.lastIndex()] += token.value;
    }

    formatOpeningParentheses(token) {
        const words = this.getLastString().trim().split(" ");
        const last = this.getLastString().trim().toUpperCase();
        if (token.value == "case" && this.getLastString().trim().endsWith("select")) {
        }
        else if (token.value != "(" && (token.value != "case" && !this.reservedWords.includes(last))) {
            this.addNewLine("left", token.value);
        }
        else if (this.reservedWords.includes(words[words.length - 1].trim().toUpperCase())) {
            if (!this.getLastString().endsWith(" ")) {
                this.lines[this.lastIndex()] += " ";
            }
        }
        this.indents.push({token: token, indent: this.getLastString().length})
        this.lines[this.lastIndex()] += token.value;
    }

    formatClosingParentheses(token) {
        if (token.value == ")") {
            if (this.getLastString().trim() != "") {
                this.trimEndLastString();
            }
            else {
                const indent = this.indents[this.indents.length - 1];
                this.lines[this.lastIndex()] = repeat(" ", indent.indent);
            }
            if (this.getLastString().match(/\)/) != null) {
                this.addNewLine("right", token.value);
            }
            this.checkCloseBkt();
        }
        else {
            this.addNewLine("right", token.value);
        }
        this.indents.pop();
        this.lines[this.lastIndex()] += token.value;
    }

    checkCloseBkt() {
        let bktCount = 1;
        let substring = "";
        let startIndex = 0;
        let start = 0;
        for (let i = this.lastIndex(); i >= 0; i--) {
            const line = this.lines[i];
            for (let j = line.length - 1; j >= 0; j--) {
                if (line[j] == ")") {
                    bktCount++;
                }
                else if (line[j] == "(") {
                    bktCount--;
                }
                if (bktCount == 0) {
                    start = j;
                    substring = line.substring(start);
                    for (let k = i + 1; k < this.lines.length; k++) {
                        substring += " " + this.lines[k].trim();
                    }
                    startIndex = i;
                    break;
                }
            }
            if (bktCount == 0) {
                break;
            }
        }
        const firstInStartLine = this.lines[startIndex].replaceAll(/\(|\)/g, " ").trim().split(" ")[0].trim();
        const first = substring.trim().split(" ")[0].replace(/\(/, "").trim();
        if (this.startBlock.includes(first)) {
            this.indents.pop();
        }
        else if (first == "with") {
            const match = substring.match(/(\s|\n)union(\s|\n)/);
            let popCount = 1;
            if (match != undefined) {
                popCount += match.length;
            }
            for (let i = 0; i < popCount; i++) {
                this.indents.pop();
            }
        }
        else {
            if (firstInStartLine == "insert" || firstInStartLine == "values") {
                if (firstInStartLine == "values") {
                    this.lines[startIndex] = this.lines[startIndex].replace("values(", "values (");
                }
                if (substring.split(",").length > 3 || substring.length > 30) {
                    this.removeLines(startIndex);
                    if (firstInStartLine == "values") {
                        const ll = this.lines[this.lastIndex() - 1];
                        this.lines[this.lastIndex() - 1] = ll.substring(0, ll.length - 1);
                        this.lines[startIndex] = this.lines[startIndex].replace("values", ") values");
                    }
                    const fromIdx = this.lines[this.lastIndex()].indexOf(firstInStartLine);
                    this.lines[startIndex] = this.lines[startIndex].substring(0,
                                                                        this.lines[startIndex].indexOf("(", fromIdx + 1) + 1);
                    const split = substring.split(", ");
                    split[0] = split[0].substring(1);
                    const indent = this.indents[this.indents.length - 2].indent;
                    this.lines.push(repeat(" ", indent + 4) + split[0].trim());
                    for (let i = 1; i < split.length; i++) {
                        this.lines[this.lastIndex()] += ",";
                        this.lines.push(repeat(" ", indent + 4) + split[i].trim());
                    }
                }
                else {
                    this.addSubstringInLine(start, startIndex, substring);
                }
            }
            else if (!this.reservedWords.includes(first) &&
                substring.match(/.* (and|or|xor|not) .*/) == null) {
                this.addSubstringInLine(start, startIndex, substring);
            }
        }
    }

    addSubstringInLine(start, startIndex, substring) {
        const subLines = substring.split("\n");
        substring = "";
        for (let i = 0; i < subLines.length; i++) {
            substring += subLines[i].trim() + " ";
        }
        this.lines[startIndex] = trimEnd(this.lines[startIndex].substring(0, start) + substring);
        this.removeLines(startIndex);
    }

    removeLines(startIndex) {
        const length = this.lines.length;
        for (let i = startIndex + 1; i < length; i++) {
            this.lines.pop();
        }
    }

    formatPlaceholder(token) {
        this.lines[this.lastIndex()] += this.params.get(token) + " ";
    }

    formatWithSpaceAfter(token) {
        this.trimTrailingWhitespace();
        this.lines[this.lastIndex()] += token.value + " ";
    }

    formatWithoutSpaces(token) {
        this.trimTrailingWhitespace();
        this.lines[this.lastIndex()] += token.value;
    }

    formatWithSpaces(token) {
        if (!token.value.endsWith(".")) {
            this.lines[this.lastIndex()] += token.value + " ";
        }
        else {
            this.lines[this.lastIndex()] += token.value;
        }
    }

    formatQuerySeparator(token) {
        this.indents.pop();
        this.trimTrailingWhitespace();
        this.lines[this.lastIndex()] += token.value;
        this.addNewLine("left", token.value);
    }

    trimTrailingWhitespace() {
        this.trimEndLastString();
        if (this.previousNonWhitespaceToken.type == tokenTypes.LINE_COMMENT) {
            this.addNewLine("left", "");
        }
    }

    trimEndLastString() {
        if (this.getLastString().trim() != "") {
            this.lines[this.lastIndex()] = trimEnd(this.getLastString());
        }
    }

    previousNonWhitespaceToken() {
        let n = 1;
        while (this.previousToken(n).type == tokenTypes.WHITESPACE) {
            n++;
        }
        return this.previousToken(n);
    }

    previousToken(offset = 1) {
        return this.tokens[this.index - offset] || {};
    }

    lastIndex() {
        return this.lines.length - 1;
    }

    getLastString() {
        return this.lines[this.lastIndex()];
    }
}
