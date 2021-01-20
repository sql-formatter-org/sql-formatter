import includes from "lodash/includes";
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
        this.startBlock = ["select", "begin", "create", "alter", "insert", //"update", 
                                    "drop", "merge"];
        this.logicalOperators = ["or", "xor", "and"];
            }

    format(query) {
        this.query = query;
        this.tokens = this.tokenizer.tokenize(query);
        const formattedQuery = this.formatQuery();

        return this.lines.join("\n").trim();
    }

    getFormatArray(query){
        this.query = query;
        this.tokens = this.tokenizer.tokenize(query);
        this.formatQuery();
        return this.lines;
    }

    formatQuery(){

        for (let i = 0; i < this.tokens.length; i++){
            var token = this.tokens[i];
            token.value = this.formatTextCase(token);
            if (token.type === tokenTypes.WHITESPACE) {
                if (!this.getLastString().endsWith(" ") && !this.getLastString().endsWith("(")){
                    this.lines[this.lastIndex()] += " ";
                }
            } else if (token.type === tokenTypes.LINE_COMMENT) {
                this.formatLineComment(token);
            } else if (token.type === tokenTypes.BLOCK_COMMENT) {
                this.formatBlockComment(token);
            } else if (token.type === tokenTypes.RESERVED_TOPLEVEL) {
                this.formatTopLeveleReservedWord(token);
                this.previousReservedWord = token;
            } else if (token.type === tokenTypes.RESERVED_NEWLINE) {
                this.formatNewlineReservedWord(token);
                this.previousReservedWord = token;
            } else if (this.logicalOperators.includes(token.value)){
                this.formatLogicalOperators(token);
            } else if (token.type === tokenTypes.RESERVED) {
                this.formatWithSpaces(token);
                this.previousReservedWord = token;
            } else if (token.type === tokenTypes.OPEN_PAREN) {
                this.formatOpeningParentheses(token);
            } else if (token.type === tokenTypes.CLOSE_PAREN) {
                this.formatClosingParentheses(token);
            } else if (token.type === tokenTypes.PLACEHOLDER) {
                this.formatPlaceholder(token);
            } else if (token.value === ",") {
                this.formatComma(token);
            } else if (token.value === ":") {
                this.formatWithSpaceAfter(token);
            } else if (token.value === "." || token.value === "%") {
                this.formatWithoutSpaces(token);
            } else if (token.value === ";") {
                this.formatQuerySeparator(token);
            } else {
                this.formatWithSpaces(token);
            };
        }
    }

    formatLogicalOperators(token){
        this.trimEndLastString();
        var last = this.getLastString();
        let words = last.trim().split(" ");
        let indent = this.getLogicalIndent(token.value, words[0]);
        if (this.logicalOperators.includes(words[0]) && words[1].startsWith("(") && !words[words.length - 1].endsWith(")")){
            this.lines[this.lastIndex()] += " ";
        } else if(last.includes(" on ") && !last.includes(" join ")){
            let boolExps = last.split(/ and | or | xor /);
            if (boolExps.length > 3){
                let indent = last.indexOf("on ") + 4;
                this.lines[this.lastIndex()] = boolExps[0];
                last = last.substring(last.indexOf(boolExps[0]) + boolExps[0].length);
                for (let i = 1; i < boolExps.length; i++){
                    this.lines.push(repeat(" ", indent));
                    let bool = last.trim().split(" ")[0];
                    if (bool.length < 3){
                        this.lines[this.lastIndex()] += repeat(" ", 3 - bool.length);
                    }
                    this.lines[this.lastIndex()] += bool + " " + boolExps[i];
                    last = last.substring(last.indexOf(boolExps[i]) + boolExps[i].length);
                }
                this.lines.push(repeat(" ", indent));
            } else {
                this.lines[this.lastIndex()] += " ";
            }
        } else if (last.trim() != "" && indent > 0){
            this.lines.push(repeat(" ", indent));
        }
        this.lines[this.lastIndex()] += token.value;
    }

    getLogicalIndent(operator, first){
        let indent = 0;
        if (this.logicalOperators.includes(first)){
            indent = this.getLastString().length - this.getLastString().trim().length;
            return indent + first.length - operator.length;
        } else if (this.getLastString().includes(" when ")){
            return this.getLastString().indexOf("when") + 4 - operator.length;
        } else if (this.getLastString().includes(" on(") || this.getLastString().includes(" on ")){
            indent = this.getLastString().indexOf(" on(");
            if (indent == -1){
                indent = this.getLastString().indexOf(" on ");
            }
            return indent + 3 - operator.length;
        } else {
            this.addNewLine("right", operator);
            return -1;
        }
    }

    formatComma(token){
        let last = this.getLastString();
        if (this.inlineReservedWord.includes(last.trim().split(" ")[0])){
            this.formatCommaInlineReservedWord(last, token);
        }else{
            this.trimEndLastString();
            this.lines[this.lastIndex()] += token.value;
            this.addNewLine("left", token.value);
        }
    }

    formatCommaInlineReservedWord(last, token){
        let subLines = last.split(",");
        if (last.split(",").length > 2){
            this.lines[this.lastIndex()] = trimEnd(subLines[0]) + ",";
            this.indents[this.indents.length - 1].indent += 1;
            this.indents[this.indents.length - 1].token.value = "order by";
            this.addNewLine("left", ",");
            for (let i = 1; i < subLines.length; i++){
                this.lines[this.lastIndex()] += subLines[i].trim() + ",";
                this.addNewLine("left", ",");
            }
        } else {
            this.trimEndLastString();
            this.lines[this.lastIndex()] += token.value;
        }
    }

    formatTopLeveleReservedWord(token){
        if (this.startBlock.includes(token.value.split(" ")[0])){
            if (this.getLastString().includes("union")){
                this.indents.pop;
                this.addNewLine("right", token.value);
            }else if (this.getLastString().trim() != "" && this.getLastString().trim().endsWith(")")){
                this.addNewLine("right", token.value);
            }
            this.indents.push({token: token, indent: this.getLastString().length});
        } else {
            this.addNewLine("right", token.value);
        }
        this.lines[this.lastIndex()] += token.value;
    }

    formatTextCase(token){
        if (token.value.match("^'.*'$|^util.*|^pkg_.*") != null || 
            token.type === tokenTypes.BLOCK_COMMENT ||
            token.type === tokenTypes.LINE_COMMENT){
            return token.value;
        } else {
            return token.value.toLowerCase();
        }
    }

    addNewLine(align, word){
        if (this.getLastString().trim() == ")"){
            this.lines.pop();
            this.lines[this.lastIndex()] += ")";
        } else {
            this.trimEndLastString();
        }
        let indent = this.getCurrentIndent(align, word);
        if (this.getLastString().trim() == ""){
            this.lines[this.lastIndex()] = repeat(" ", indent);
        }else {
            this.lines.push(repeat(" ", indent));
        }
        // this.checkLineLength();
    }

    checkLineLength(){
        let maxCleanLineLength = 60;
        let last = this.lines[this.lastIndex() - 1].trim();
        if (last.trim().length < maxCleanLineLength){
            return;
        }
        let firstChar = this.getLastString().trim()[0];
        if (firstChar == "("){
            last = last.substring(1).trim();
        }
        let first = last.split(/\(\) ,/)[0];
        let index = this.query.indexOf(first);
        this.query = this.query.substring(index);
        let lastWithoutSpace = last.replace(/\s*\n*/, " ");
        while(index != this.query.replace(/\s*\n*/, " ").indexOf(lastWithoutSpace)){
            let index = this.query.indexOf(first);
            this.query = this.query.substring(index);
        }
        let substring = "";
        if (firstChar == "("){
            substring += firstChar;
        }


    }

    getCurrentIndent(align, word){
        let last = this.indents[this.indents.length - 1];
        if (last == undefined){
            this.lines.push("");
            return;
        }
        let indent = last.indent;
        if (align == "right"){
            let dif = last.token.value.split(" ")[0].trim().length 
                            - word.split(" ")[0].trim().length;
            if (dif < 0){
                dif = 0;
            }
            if (word == ")"){
                dif = -1;
            }
            indent += dif;
        }else {
            indent += last.token.value.length + 1;
        }
        return indent;
    }

    formatBlockComment(token){
        this.resolveAddLineInCommentsBlock(token);
        let indent = this.getLastString().length + 2;
        let comment = token.value;
        let commentsLine = comment.split("\n");
        comment = commentsLine[0];
        for (let i = 1; i < commentsLine.length; i++){
            if (commentsLine[i].trim().startsWith("*")){
                comment += "\n" + repeat(" ", indent + 1);    
            } else {
                comment += "\n" + repeat(" ", indent);
            }
            comment += commentsLine[i];
        }
        this.lines[this.lastIndex()] +=  comment;
        this.addNewLine("left", token.value);
    }

    resolveAddLineInCommentsBlock(token){
        let substing = this.getLastString().trim();
        let words = substing.split(/\(|\)| /);
        let last = words[words.length - 1];
        if (!this.reservedWords.includes(last.toUpperCase()) || last.endsWith(";")){
            this.addNewLine("left", token.value);
        }
    }

    formatLineComment(token){
        let qLines = this.query.split("\n");
        let isNewLine = false;
        for (let i = 0; i < qLines.length; i++){
            if (qLines[i].includes(token.value.trim()) && qLines[i].trim() == token.value.trim()){
                isNewLine = true;
                break;
            }
        }
        this.query = this.query.substring(this.query.indexOf(token.value) + token.value.length);
        if (isNewLine){
            let indent = this.getCurrentIndent("right", "");
            this.lines.push(repeat(" ", indent + 1) + token.value);
            this.addNewLine("left", "");
        } else {
            let before = this.getLastString();
            this.lines[this.lastIndex()] += token.value;
            this.addNewLine("right", "");
            if (before.trim().endsWith("then")){
                this.lines[this.lastIndex()] += repeat(" ", 6);
            }
        }
    }

    formatNewlineReservedWord(token){
        let last = this.getLastString();
        if (last.trim().split(" ").length > 1 || last.trim() == ")" && !(last.includes("case") && !last.includes("when"))) {
            this.addNewLine("left", token.value);
        }
        this.lines[this.lastIndex()] += token.value;
    }

    formatOpeningParentheses(token){
        let words = this.getLastString().trim().split(" ");
        let last = this.getLastString().trim().toUpperCase();
        if (token.value != "(" && (token.value != "case" && !this.reservedWords.includes(last))){
            this.addNewLine("left", token.value);
        }else if (this.reservedWords.includes(words[words.length - 1].trim().toUpperCase())){
            if (!this.getLastString().endsWith(" ")){
                this.lines[this.lastIndex()] += " ";
            }
        }else if (this.getLastString().trim() != ""){
            this.trimEndLastString();
        }
        this.indents.push({token: token, indent: this.getLastString().length})
        this.lines[this.lastIndex()] += token.value;
    }

    formatClosingParentheses(token){
        if (token.value == ")"){
            this.trimEndLastString();
            if (this.getLastString().match(/\)/) != null){
                this.addNewLine("right", token.value);    
            }
            this.checkCloseBkt();
        } else {
            this.addNewLine("right", token.value);
        }
        this.indents.pop();
        this.lines[this.lastIndex()] += token.value;
    }

    checkCloseBkt(){
        let bktCount = 1;
        let substring = "";
        let startIndex = 0;
        let start = 0;
        for (let i = this.lastIndex(); i >= 0; i--){
            let line = this.lines[i];
            for (let j = line.length - 1; j >= 0; j--){
                if (line[j] == ")"){
                    bktCount++;
                } else if (line[j] == "("){
                    bktCount--;
                }
                if (bktCount == 0){
                    start = j;
                    substring = line.substring(start);
                    for (let k = i + 1; k < this.lines.length; k++){
                        substring += " " + this.lines[k].trim();
                    }
                    startIndex = i;
                    break;
                }
            }
            if (bktCount == 0){
                break;
            }
        }
        let first = substring.trim().split(" ")[0].replace(/\(/, "").trim();
        if (this.startBlock.includes(first)){
            this.indents.pop();
        } else if (first == "with") {
            let match = substring.match(/(\s|\n)union(\s|\n)/);
            let popCount = 1;
            if (match != undefined){
                popCount += match.length
            }
            for (let i = 0; i < popCount; i++){
                this.indents.pop();
            }
        } else {
            if (!this.reservedWords.includes(first) && substring.match(/.* (and|or|xor|not) .*/) == null){
                let subLines = substring.split("\n");
                substring = "";
                for (let i = 0; i< subLines.length; i++){
                    substring += subLines[i].trim() + " ";
                }
                this.lines[startIndex] = trimEnd(this.lines[startIndex].substring(0, start) + substring);
                let length = this.lines.length;
                for (let i = startIndex + 1; i < length; i++){
                    this.lines.pop();
                }
            }
        }
    }


    formatPlaceholder(token){
        this.lines[this.lastIndex()] += this.params.get(token) + " ";
    }

    formatWithSpaceAfter(token){
        this.trimTrailingWhitespace();
        this.lines[this.lastIndex()] += token.value + " ";
    }

    formatWithoutSpaces(token){
        this.trimTrailingWhitespace();
        this.lines[this.lastIndex()] += token.value;
    }

    formatWithSpaces(token){
        // if (token.value == "on" && !this.getLastString().includes(" join ")){
        //     this.addNewLine("right", token.value);
        // }
        if (!token.value.endsWith(".")){
            this.lines[this.lastIndex()] += token.value + " ";
        } else {
            this.lines[this.lastIndex()] += token.value;
        }
    }

    formatQuerySeparator(token){
        this.indents.pop();
        this.trimTrailingWhitespace();
        this.lines[this.lastIndex()] += token.value;
        this.addNewLine("left", token.value);
    }

    trimTrailingWhitespace(){
        this.trimEndLastString();
        if (this.previousNonWhitespaceToken.type === tokenTypes.LINE_COMMENT){
            this.addNewLine("left", "");
        } 
    }

    trimEndLastString(){
        this.lines[this.lastIndex()] = trimEnd(this.getLastString());
    }

    previousNonWhitespaceToken() {
        let n = 1;
        while (this.previousToken(n).type === tokenTypes.WHITESPACE) {
            n++;
        }
        return this.previousToken(n);
    }

    previousToken(offset = 1) {
        return this.tokens[this.index - offset] || {};
    }

    lastIndex(){
        return this.lines.length - 1;
    }

    getLastString(){
        return this.lines[this.lastIndex()];
    }
}
