import trimEnd from "lodash/trimEnd";
import tokenTypes from "./tokenTypes";
import repeat from "lodash/repeat";
import SqlFormatter from "../languages/SqlFormatter";
import SqlUtils from "./SqlUtils";

export default class PlSqlFormatter {

    constructor(cfg, tokenizer, reservedWords, openParens) {
        this.indentCount = 0;
        this.tokenizer = tokenizer;
        this.tokens = [];
        this.reservedWords = reservedWords;
        this.withoutSpaces = [".", "%", "(",];
        this.lines = [""];
        this.indent = "    ";
        this.openParens = openParens;
        this.indentsKeyWords = [];
        this.lastIndentKey = {
            key: "",
            name: "",
            indent: 0
        };
        this.lineSize = 80;
        this.booleanOperators = ["and", "or", "xor"];
        this.cQuery = "";
        this.hasError = false;
    }

    format(query) {
        if (query.trim() == "") {
            return query;
        }
        this.query = query;
        this.tokens = this.tokenizer.tokenize(query);
        const formattedQuery = this.formatQuery();
        return this.hasError ? query : formattedQuery.trim();
    }

    formatQuery() {
        this.cQuery = this.query;
        const originQuery = this.query;
        for (let i = 0; i < this.tokens.length; i++) {
            const token = this.tokens[i];
            token.value = SqlUtils.formatTextCase(token);
            if (token.value.startsWith(".") && token.value != ".." ) {
                this.lines[this.lastIndex()] = trimEnd(this.getLastString());
            }
            if (token.type == tokenTypes.WHITESPACE) {
                if (!this.getLastString().endsWith(" ") &&
                    !this.getLastString().endsWith("(") &&
                     this.getLastString().trim() != "") {
                    this.lines[this.lastIndex()] += " ";
                }
            }
            else if (token.type == tokenTypes.LINE_COMMENT) {
                this.formatLineComment(token);
            }
            else if (token.type == tokenTypes.BLOCK_COMMENT) {
                this.formatBlockComment(token);
            }
            else if (token.type == tokenTypes.RESERVED_NEWLINE) {
                //new line token = start sql query
                i = this.formatSqlQuery(i);
            }
            else if (token.type == tokenTypes.OPEN_PAREN) {
                this.formatOpeningParentheses(token, i);
            }
            else if (token.type == tokenTypes.CLOSE_PAREN) {
                this.formatClosingParentheses(token, i);
            }
            else if (token.value.startsWith(":") && token.value != ":="){
                this.formatWithSpaces(token);
            }
            else if (token.type == tokenTypes.PLACEHOLDER) {
                this.formatPlaceholder();
            }
            else if (token.value == ")") {
                this.formatCloseBkt(token);
            }
            else if (token.value == "begin") {
                this.formatBegin(token);
            }
            else if (token.value == "then") {
                this.formatThen(token);
            }
            else if (token.value == "loop") {
                this.formatLoop(token, i);
            }
            else if (token.value == ",") {
                this.formatComma(token);
            }
            else if (token.value == ":") {
                this.formatWithSpaceAfter(token);
            }
            else if (this.withoutSpaces.includes(token.value)) {
                this.formatWithoutSpaces(token);
            }
            else if (token.value == ";") {
                this.formatQuerySeparator(token);
            }
            else if (token.value == "exception" || token.value == "exceptions") {
                this.formatException(token, i);
            }
            else if (token.value == "else") {
                this.formatElse(token);
            }
            else if (token.value == "elsif") {
                this.lines[this.lastIndex()] = repeat(this.indent, this.indentCount - 1) + token.value;
            }
            else if (token.value == "when") {
                this.formatWhen(token);
            }
            else if (token.value == "as" || token.value == "is") {
                this.formatAsIs(token);
            }
            else if (token.value == "return") {
                this.formatReturn(token);
            }
            else {
                this.formatWithSpaces(token);
            }
            if (this.hasError) {
                return originQuery;
            }
        }
        return this.addDevelopEmptyLines(originQuery, this.lines.join("\n").trim());
    }

    formatElse(token) {
        const last = this.indentsKeyWords[this.indentsKeyWords.length - 1];
        if (last != undefined && last.key == "case") {
            this.lines[this.lastIndex()] = repeat(this.indent, this.indentCount - 1) + " " + token.value;
            this.addNewLine(this.indentCount);
            this.lines[this.lastIndex()] += " ";
        }
        else {
            this.lines[this.lastIndex()] = repeat(this.indent, this.indentCount - 1) + token.value;
            this.addNewLine(this.indentCount);
        }
    }

    formatLikeDevelopWrite(token) {
        const cInfo = this.getFormattingString(token);
        const searchString = cInfo.substring;
        const first = SqlUtils.getFirstWord(searchString);
        const info = SqlUtils.findSubstring(first, SqlUtils.getStringInOneStyle(searchString + " " + token.value).trim(),
                                                this.query, this.tokenizer);
        if (info.hasError) {
            this.hasError = true;
            return;
        }
        this.query = info.query;
        if (searchString.trim().length < 65) {
            return;
        }
        this.popLine(cInfo.popCount);
        this.lines[this.lastIndex()] = SqlUtils.formatOriginSubstringWithIndent(cInfo.indent, info.indent, info.substring) + " ";
    }

    popLine(popCount) {
        for (let i = 0; i < popCount; i++) {
            this.lines.pop();
        }
    }

    getFormattingString() {
        let lastIdx = this.lastIndex();
        const startBlocks = ["if", "elsif", "while", "case", "when"];
        if (lastIdx == 0) {
            return this.getLastString();
        }
        let first = SqlUtils.getFirstWord(this.getLastString().trim());
        let substring = this.getLastString();
        while (!startBlocks.includes(first)) {
            lastIdx--;
            if (lastIdx < 0) {
                break;
            }
            substring = this.lines[lastIdx] + " " + substring.trim();
            first = SqlUtils.getFirstWord(substring);
        }
        if (lastIdx < 0) {
            lastIdx = 0;
        }
        const indent = SqlUtils.getLineIndent(this.lines[lastIdx]);
        const popCount = this.lines.length - lastIdx - 1;
        return {
            indent: indent,
            substring: substring,
            popCount: popCount
        };
    }

    formatReturn(token) {
        const first = SqlUtils.getFirstWord(this.getLastString());
        const last = this.indentsKeyWords[this.indentsKeyWords.length - 1];
        if ((this.openParens.includes(first) && this.getLastString().split(",").length > 1) || (last != undefined)) {
            if (this.getLastString().trim() != "") {
                this.addNewLine(this.indentCount);
            }
        }
        this.lines[this.lastIndex()] += token.value;
    }

    addDevelopEmptyLines(origin, query) {
        let format = "";
        const split = origin.split("\n");
        for (let i = 0; i < split.length; i++) {
            if (split[i].trim() == "") {
                let spaceCount = 1;
                while (i < split.length && split[i].trim() == "") {
                    spaceCount++;
                    i++;
                }
                if (this.isEmptyLineAllowed(spaceCount, query)) {
                    if (format.endsWith("\n")) {
                        format += "\n";
                    }
                    else {
                        format += "\n" + repeat(" ", SqlUtils.getLineIndent(split[i]));
                    }
                }
                i--;
            }
            else {
                for (let j = 0; j < split[i].length; j++) {
                    let char = split[i][j];
                    if (char != " ") {
                        let index = query.indexOf(char);
                        let idx1 = query.indexOf(char.toLowerCase());
                        if (index < 0) {
                            index = idx1;
                        }
                        else if (index > idx1 && idx1 != -1) {
                            index = idx1;
                        }
                        format += query.substring(0, index + 1);
                        query = query.substring(index + 1);
                    }
                 }
            }
        }
        return this.removeDupticateEmptyLine(format);
    }

    isEmptyLineAllowed(spaceCount, formattedQueryEnd) {
        let isLoopConditionEnd = /^\)\s*loop\b/.test(formattedQueryEnd);
        return spaceCount > 1 && !isLoopConditionEnd;
    }

    removeDupticateEmptyLine(query) {
        const split = query.split("\n");
        for (let i = split.length - 1; i >= 1; i--) {
            if (split[i].trim() == "" && split[i - 1].trim() == "") {
                for (let j = i; j < split.length - 1; j++) {
                    split[j] = split[j + 1];
                }
                split.pop();
            }
        }
        return split.join("\n");
    }

    formatWhen(token) {
        const lastKey = this.indentsKeyWords[this.indentsKeyWords.length - 1];
        if (lastKey != undefined && lastKey.key == "case" && !this.getLastString().trim().startsWith("case")) {
            this.indentCount--;
            this.lines[this.lastIndex()] = repeat(this.indent, this.indentCount) + " ";
        }
        this.lines[this.lastIndex()] += token.value;
    }

    formatThen(token) {
        this.formatLikeDevelopWrite(token);
        if (!this.getLastString().includes(token.value)) {
            this.lines[this.lastIndex()] += token.value;
        }
        if (this.getLastString().includes(" when ")) {
            this.indentCount++;
        }
        this.addNewLine(this.indentCount);
        const last = this.indentsKeyWords[this.indentsKeyWords.length - 1];
        if (last != undefined && last.key == "case") {
            this.lines[this.lastIndex()] += " ";
        }
    }

    formatLoop(token, index) {
        const next = this.getNextValidWord(index);
        if (next !== ";") {
            let lastKW = this.indentsKeyWords[this.indentsKeyWords.length - 1];
            if (lastKW.key == "while") {
                this.formatLikeDevelopWrite(token);
            }
            if (lastKW.key == "while" || lastKW.key == "for") {
                this.indentsKeyWords[this.indentsKeyWords.length - 1].key = "loop";
            }
            else {
                this.incrementIndent(token.value, "");
            }
            if (!this.getLastString().includes(token.value)) {
                this.lines[this.lastIndex()] += token.value;
            }
            this.addNewLine(this.indentCount);
        }
        else {
            this.lines[this.lastIndex()] += token.value;
        }
    }

    formatBegin(token) {
        const lastIndent = this.indentsKeyWords[this.indentsKeyWords.length - 1];
        const startBlock = ["cursor", "procedure", "function", "pragma", "declare"];
        if (lastIndent != undefined) {
            if (startBlock.includes(lastIndent.key)) {
                if (this.getLastString().trim() != "") {
                    this.addNewLine(this.indentCount - 1);
                }
                else {
                    this.lines[this.lastIndex()] = repeat(this.indent, this.indentCount - 1);
                }
                if (lastIndent.key != "procedure" && lastIndent.key != "function") {
                    this.indentsKeyWords.push({key: token.value, name: "", indent: this.indentCount - 1});
                }
                else {
                    this.indentsKeyWords[this.indentsKeyWords.length - 1].key = token.value;
                }
            }
            else {
                this.incrementIndent(token.value, "");
            }
        }
        else {
            if (this.getLastString().trim() != "" && !this.prevLineIsComment()) {
                this.addNewLine(this.indentCount);
            }
            this.incrementIndent(token.value, "");
        }
        this.lines[this.lastIndex()] += token.value;
        this.addNewLine(this.indentCount);
    }

    formatCloseBkt(token) {
        this.lines[this.lastIndex()] = trimEnd(this.getLastString()) + token.value + " ";
        const lastString =  this.getLastString();
        const openMatch = lastString.match(/\(/);
        const closeMatch = lastString.match(/\)/);
        if (openMatch != undefined && closeMatch != undefined) {
            const first = SqlUtils.getFirstWord(lastString);
            if (lastString.length > this.lineSize && openMatch.length == closeMatch.length) {
                if (this.openParens.includes(first.toUpperCase()) && first != "if") {
                    this.lines[this.lastIndex()] = lastString.substring(0, lastString.indexOf("(") + 1);
                    const subLines = lastString.substring(lastString.indexOf("(") + 1).split(", ");
                    this.lines.push(repeat(this.indent, this.indentCount) + subLines[0]);
                    for (let i = 1; i < subLines.length; i++) {
                        this.lines[this.lastIndex()] += ",";
                        this.lines.push(repeat(this.indent, this.indentCount) + subLines[i]);
                    }
                }
            }
        }
    }

    formatException(token, index) {
        const next = this.getNextValidWord(index);
        if (next == ";") {
            this.lines[this.lastIndex()] += token.value;
            return;
        }
        if (this.getLastString().trim().match(/^return.*;$/) != null) {
            this.indentsKeyWords.push(this.lastIndentKey);
        }
        const last = this.indentsKeyWords[this.indentsKeyWords.length - 1];
        const lastIndent = last.indent;
        this.indentCount = last.indent + 1;
        if (this.getLastString().trim() == "") {
            this.lines[this.lastIndex()] = repeat(this.indent, lastIndent);
        }
        else {
            this.addNewLine(lastIndent);
        }
        this.lines[this.lastIndex()] += token.value;
        this.indentCount = last.indent + 1;
        this.addNewLine(this.indentCount);
    }

    formatComma(token) {
        if (this.getLastString().trim() == "") {
            const indent = this.getLastString().length;
            this.lines.pop();
            this.lines[this.lastIndex()] += token.value;
            this.lines.push(repeat(" ", indent));
        }
        else {
            this.lines[this.lastIndex()] = trimEnd(this.getLastString()) + token.value + " ";
        }
    }

    formatPlaceholder() {
        this.lines[this.lastIndex()] += " ";
    }

    formatWithSpaceAfter(token) {
        this.lines[this.lastIndex()] = trimEnd(this.getLastString()) + token.value + " ";
    }

    formatAsIs(token) {
        let startComment = false;
        let substring = "";
        for (let i = this.lastIndex(); i >= 0; i--) {
            const line = this.lines[i];
            if (startComment) {
                if (line.includes("/*")) {
                    startComment = false;
                }
            }
            else {
                if (line.includes("*/")) {
                    startComment = true;
                    continue;
                }
                if (line.trim() == "") {
                    continue;
                }
                if (line.includes(")")) {
                    substring = this.getBktSubstring(i).substring + substring;
                    break;
                }
                else {
                    substring = line + substring;
                    break;
                }
            }
        }
        const ignore = ["if", "elsif", "while", "for"];
        const first = SqlUtils.getFirstWord(substring);
        if (first == "create") {
            if (!this.prevLineIsComment() && this.getLastString().trim() != "") {
                this.addNewLine(this.indentCount - 1);
            }
            else {
                this.lines[this.lastIndex()] = repeat(this.indent, this.indentCount - 1);
            }
            this.lines[this.lastIndex()] += token.value;
            this.addNewLine(this.indentCount);
        }
        else if (first == "cursor") {
            this.lines[this.lastIndex()] += token.value;
            this.addNewLine(this.indentCount);
        }
        else if (
            (this.openParens.includes(first.toUpperCase()) && !ignore.includes(first)) ||
            (this.getLastString().includes("return") && !this.getLastString().endsWith(";"))) {
            if (!this.prevLineIsComment() && this.getLastString().trim() != "") {
                this.addNewLine(this.indentCount - 1);
            }
            else {
                if (this.getLastString().trim() == "") {
                    this.lines[this.lastIndex()] = repeat(this.indent, this.indentCount - 1);
                }
                else {
                    this.addNewLine(this.indentCount - 1);
                }
            }
            this.lines[this.lastIndex()] += token.value;
            this.addNewLine(this.indentCount);
        }
        else {
            this.lines[this.lastIndex()] += token.value;
        }
    }

    formatQuerySeparator(token) {
        this.lines[this.lastIndex()] = trimEnd(this.getLastString());
        /**
         * if first word is start block, and line end for ; then decrement indent
         * example:
         * procedure name(val);
        */
        const startBlock = ["cursor", "procedure", "function", "forall", "for", "while"];
        let first = SqlUtils.getFirstWord(this.getLastString());
        const lIndent = this.indentsKeyWords[this.indentsKeyWords.length - 1];
        if (lIndent != undefined && lIndent.key == "forall") {
            this.decrementIndent();
        }
        else if ((this.openParens.includes(first.toUpperCase()) &&
                  first != "if") || this.getLastString().includes("return")) {
            if (lIndent != undefined && startBlock.includes(lIndent.key)) {
                this.decrementIndent();
            }
        }
        else if (this.getLastString().endsWith(")")) {
            const ssInfo = this.getBktSubstring(this.lastIndex());
            const substring = ssInfo.substring;
            first = SqlUtils.getFirstWord(substring);
            if (this.openParens.includes(first.toUpperCase()) && first != "if") {
                this.decrementIndent();
            }
        }
        const last = this.getLastString();
        if ((last.includes(" or ") || last.includes(" and ") || last.includes(" xor ")) && last.trim().length > 60) {
            const searchString = last;
            const firstWord = SqlUtils.getFirstWord(searchString);
            const info = SqlUtils.findSubstring(firstWord, SqlUtils.getStringInOneStyle(searchString).trim(), this.query, this.tokenizer);
            if (info.hasError) {
                this.hasError = true;
                return;
            }
            this.query = info.query;
            this.lines[this.lastIndex()] = SqlUtils.formatOriginSubstringWithIndent(
                                                    SqlUtils.getLineIndent(this.getLastString()), info.indent, info.substring);
        }
        if (this.getLastString().trim() == "") {
            this.lines.pop();
        }
        this.lines[this.lastIndex()] += token.value;
        this.addNewLine(this.indentCount);
    }

    getBktSubstring(from) {
        let countOpenBkt = 0;
        let countCloseBkt = 0;
        let substring = "";
        let index = 0;
        const subLines = [];
        for (let i = from; i >= 0; i--) {
            subLines.unshift(this.lines[i]);
            let line = this.lines[i].replace(/--.*/, "");
            if (line.startsWith("*") || line.startsWith("/*")) {
                line = "";
            }
            let match = line.match(/\(/g);
            if (match != null) {
                countOpenBkt += match.length;
            }
            match = line.match(/\)/g);
            if (match != null) {
                countCloseBkt += match.length;
            }
            substring = line + substring;
            if (countCloseBkt <= countOpenBkt) {
                 index = i;
                break;
            }
        }
        return {substring:substring, startIndex: index, subLines: subLines};
    }

    formatWithSpaces(token) {
        this.lines[this.lastIndex()] += token.value + " ";
    }

    formatWithoutSpaces(token) {
        const words = this.getLastString().trim().split(" ");
        if (token.value == "(" && this.reservedWords.includes(words[words.length - 1].trim().toUpperCase())) {
            this.lines[this.lastIndex()] = this.getLastString() + token.value;
        }
        else {
            this.lines[this.lastIndex()] = trimEnd(this.getLastString()) + token.value;
        }
    }

    formatOpeningParentheses(token, index) {
        const next = this.getNextValidWord(index);
        if (next != ";") {
            if (!this.prevLineIsComment()) {
                if (this.getLastString().trim() != "") {
                    this.addNewLine(this.indentCount);
                }
                this.addNewLine(this.indentCount);
            }
            if (token.value == "if" || token.value.startsWith("for") || token.value == "while" || token.value == "case") {
                while (this.getLastString() && this.getLastString().trim() == "") {
                    this.lines.pop();
                }
                this.addNewLine(this.indentCount);
            }
            this.incrementIndent(token.value, next);
            this.lines[this.lastIndex()] += token.value;
            if (token.value == "declare"){
                this.addNewLine(this.indentCount);
            }
        }
        else {
            this.lines[this.lastIndex()] += token.value;
        }
    }

    getNextValidWord(index) {
        let token = this.tokens[index + 1];
        if (token != undefined) {
            if (token.value.trim() != "") {
                return token.value;
            }
            token = this.tokens[index + 2];
            if (token != undefined) {
                return token.value;
            }
        }
        return "";
    }

    decrementIndent() {
        this.lastIndentKey = this.indentsKeyWords.pop();
        this.indentCount = this.lastIndentKey ? this.lastIndentKey.indent : 0;
    }

    incrementIndent(key, name) {
        this.indentsKeyWords.push({key: key, name: name, indent: this.indentCount});
        this.indentCount++;
    }

    formatClosingParentheses(token, index) {
        const next = this.getNextValidWord(index);
        const prevIndent = this.indentCount;
        if (next == ";" || this.reservedWords.includes(next.toUpperCase())) {
            this.decrementIndent();
        }
        else {
            for (let i = this.indentsKeyWords.length - 1; i >= 0; i--) {
                const current = this.indentsKeyWords[i];
                if (current.name == next) {
                    this.indentCount = current.indent;
                    break;
                }
                else {
                    this.decrementIndent();
                }
            }
        }
        if (this.getLastString().trim() != "") {
            this.addNewLine(this.indentCount);
        }
        if (prevIndent == this.indentCount) {
            this.lines[this.lastIndex()] = repeat(this.indent, this.indentCount - 1) + token.value;
        }
        else {
            this.lines[this.lastIndex()] = repeat(this.indent, this.indentCount) + token.value;
        }
    }

    formatSqlQuery(startIndex) {
        const startIndent = this.indentCount;
        let sql = "";
        let index = startIndex;
        const prev = this.getPrevValidTokenValue(startIndex);
        if (prev == "(") {
            let bktCount = 0;
            for (index; index < this.tokens.length; index++) {
                const word = this.tokens[index].value;
                if (word == "(") {
                    bktCount++;
                    sql += word;
                }
                else if (word == ")") {
                    if (bktCount == 0) {
                        break;
                    }
                    sql += word;
                    bktCount--;
                }
                else {
                    sql += word;
                }
            }
        }
        else {
            for (index; index < this.tokens.length; index++) {
                const word = this.tokens[index].value;
                if (word == ";") {
                    break;
                }
                else {
                    sql += word;
                }
            }
        }
        index--;
        const sqlArray = new SqlFormatter(this.cfg).getFormatArray(sql);
        if (this.getLastString().trim().endsWith("(")) {
            while (sqlArray[sqlArray.length - 1].trim() == '' && sqlArray.length > 1) {
                sqlArray.pop();
            }
            sqlArray[sqlArray.length - 1] = sqlArray[sqlArray.length - 1].replace(/\s+$/g, '');

            this.insertSqlInThisLine(sqlArray);
            this.lines[this.lastIndex()] += ")";
            this.indentCount--;
            this.addNewLine(this.indentCount);
            index++;
        } else {
            this.insertSqlInNewLine(sqlArray);
        }
        this.indentCount = startIndent;
        const next = this.getNextValidWord(index);
        if (next == ";" && this.indentsKeyWords.length != 0 &&
                 this.indentsKeyWords[this.indentsKeyWords.length - 1].key == "cursor") {
            this.decrementIndent();
        }
        return index;
    }

    insertSqlInThisLine(sqlArray) {
        const indent = this.getLastString().length;
        this.lines[this.lastIndex()] += sqlArray[0];
        for (let i = 1; i < sqlArray.length; i++) {
            this.lines.push(repeat(" ", indent) + sqlArray[i]);
        }
    }

    insertSqlInNewLine(sqlArray) {
        while (this.getLastString().trim() == "" && this.lines.length != 1) {
            this.lines.pop();
        }
        for (let i = 0; i < sqlArray.length; i++) {
            if (this.getLastString().trim() == "") {
                this.lines.pop();
            }
            this.lines.push(repeat(this.indent, this.indentCount) + sqlArray[i]);
        }
    }

    getPrevValidTokenValue(index) {
        let token = this.tokens[index - 1];
        if (token != undefined) {
            if (token.value.trim() == "") {
                token = this.tokens[index - 2];
                if (token != undefined) {
                    return token.value;
                }
            }
            else {
                return token.value;
            }
        }
        return "";
    }

    formatLineComment(token) {
        const qLines = this.cQuery.split("\n");
        let isNewLine = false;
        for (let i = 0; i < qLines.length; i++) {
            if (qLines[i].includes(token.value.trim()) && qLines[i].trim() == token.value.trim()) {
                isNewLine = true;
                break;
            }
        }
        this.cQuery = this.cQuery.substring(this.cQuery.indexOf(token.value) + token.value.length);
        if (isNewLine) {
            if (this.getLastString().trim() != "") {
                this.addNewLine(this.indentCount);
            }
        }
        else {
            if (this.getLastString().trim() == "") {
                this.lines.pop();
            }
        }
        if (!this.getLastString().endsWith(" ")) {
            this.lines[this.lastIndex()] += " ";
        }
        this.lines[this.lastIndex()] += token.value;
        this.addNewLine(this.indentCount);

    }

    formatBlockComment(token) {
        let removeLastLine = false;
        if (this.prevLineIsComment()) {
            this.lines.push("");
        }
        if (!SqlUtils.originalBlockCommentInNewLine(token, this.query)) {
            while (this.getLastString() && this.getLastString().trim() == "") {
                this.lines.pop();
            }
            removeLastLine = !this.getLastString().endsWith(";");
        }
        else {
            this.addNewLine(this.indentCount);
        }
        const comLines = token.value.split("\n");
        for (let i = 0; i < comLines.length; i++) {
            if (comLines[i].trim().startsWith("*")) {
                this.lines[this.lastIndex()] += " ";
            }
            this.lines[this.lastIndex()] += comLines[i].trim();
            this.addNewLine(this.indentCount);
        }
        if (removeLastLine) {
            this.lines.pop();
        }
    }

    prevLineIsComment() {
        return this.lastIndex() != 0 &&
            (this.lines[this.lastIndex() - 1].endsWith("*/") || this.lines[this.lastIndex() - 1].trim().startsWith("--"));
    }

    addNewLine(count) {
        this.lines[this.lastIndex()] = trimEnd(this.getLastString());
        if (count > 0) {
            this.lines.push(repeat(this.indent, count));
        }
        else {
            this.lines.push("");
        }
    }

    lastIndex() {
        return this.lines.length - 1;
    }

    getLastString() {
        return this.lines[this.lastIndex()];
    }
}
