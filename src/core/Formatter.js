import includes from "lodash/includes";
import trimEnd from "lodash/trimEnd";
import tokenTypes from "./tokenTypes";
import Params from "./Params";
import repeat from "lodash/repeat";

export default class Formatter {
    /**
     * @param {Object} cfg
     *   @param {Object} cfg.indent
     *   @param {Object} cfg.params
     * @param {Tokenizer} tokenizer
     */
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
        this.startBlock = ["select", "begin", "create", "alter", "insert", "update", "drop"];
        this.rightAlignWords = ["or", "and"];
    }

    /**
     * Formats whitespaces in a SQL string to make it easier to read.
     *
     * @param {String} query The SQL query string
     * @return {String} formatted query
     */
    format(query) {
        this.tokens = this.tokenizer.tokenize(query);
        const formattedQuery = this.formatQuery();

        return this.lines.join("\n").trim();
    }

    getFormatArray(query){
        this.tokens = this.tokenizer.tokenize(query);
        this.formatQuery();
        return this.lines;
    }

    formatQuery(){
        for (let i = 0; i < this.tokens.length; i++){
            var token = this.tokens[i];
            token.value = this.formatTextCase(token);
            // console.log(token.value);
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
                this.formatComma(token, i);
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

    formatComma(token, index){
        let last = this.getLastString();
        if (this.inlineReservedWord.includes(last.trim().split(" ")[0])){
            if (last.length > 100){
                let subLines = last.split(",");
                this.lines[this.lastIndex()] = subLines[0].trim() + ",";
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
        }else{
            this.trimEndLastString();
            this.lines[this.lastIndex()] += token.value;
            this.addNewLine("left", token.value);
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
        this.trimEndLastString();
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
            indent += dif;
        }else {
            indent += last.token.value.length + 1;
        }
        if (this.getLastString().trim() == ""){
            this.lines[this.lastIndex()] = repeat(" ", indent);
        }else {
            this.lines.push(repeat(" ", indent));
        }
    } 

    formatBlockComment(token){
        this.addNewLine("left", token.value);
        let indent = this.getLastString().length + 2;
        let comment = token.value;
        let commentsLine = comment.split("\n");
        comment = commentsLine[0];
        for (let i = 1; i < commentsLine.length; i++){
            comment += "\n" + repeat(" ", indent) + commentsLine[i];
        }
        this.lines[this.lastIndex()] +=  comment;
        this.addNewLine("left", token.value);
    }

    formatLineComment(token){
        this.lines[this.lastIndex()] += token.value;
        this.addNewLine("right", "");
    }

    formatNewlineReservedWord(token){
        if (this.getLastString().trim().split(" ").length > 1){
            if (this.rightAlignWords.includes(token.value)){
                this.addNewLine("right", token.value);
            }else{
                this.addNewLine("left", token.value);
            }
        }
        this.lines[this.lastIndex()] += token.value;
    }

    formatOpeningParentheses(token){
        if (token.value == "("){
            if (this.getLastString().trim() != ""){
                this.trimEndLastString();  
            }
        } else {
            this.addNewLine("left", token.value);
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
