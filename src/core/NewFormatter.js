import includes from "lodash/includes";
import trimEnd from "lodash/trimEnd";
import tokenTypes from "./tokenTypes";
import Params from "./Params";
import repeat from "lodash/repeat";
import SqlFormatter from "../languages/SqlFormatter";

// const indent = "    ";

export default class NewFormatter {
    /**
     * @param {Object} cfg
     *   @param {Object} cfg.indent
     *   @param {Object} cfg.params
     * @param {Tokenizer} tokenizer
     */
    constructor(cfg, tokenizer, reservedWords, openParens) {
        this.indentCount = 0;
        this.cfg = cfg || {};
        this.params = new Params(this.cfg.params);
        this.tokenizer = tokenizer;
        this.tokens = [];
        this.reservedWords = reservedWords;
        this.withoutSpaces = [".", "%", "(", ")"];
        this.lines = [""];
        this.indent = "    ";
        this.openParens = openParens;
        this.indentStartBlock = -1;
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

        return formattedQuery.trim();
    }

    formatQuery(){
        for (let i = 0; i < this.tokens.length; i++){
            var token = this.tokens[i];
            console.log(token.value + " : " + this.indentCount);
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
            } else if (token.type === tokenTypes.RESERVED_NEWLINE) {
                //new line token = start sql query
                i = this.formatSqlQuery(i);
            } else if (token.type === tokenTypes.OPEN_PAREN) {
                this.formatOpeningParentheses(token, i);
            } else if (token.type === tokenTypes.CLOSE_PAREN) {
                this.formatClosingParentheses(token, i);
            } else if (token.type === tokenTypes.PLACEHOLDER) {
                this.formatPlaceholder(token);
            } else if (token.value === ",") {
                this.formatComma(token);
            } else if (token.value === ":") {
                this.formatWithSpaceAfter(token);
            } else if (this.withoutSpaces.includes(token.value)) {
                this.formatWithoutSpaces(token);
            } else if (token.value === ";") {
                this.formatQuerySeparator(token);
            } else {
                this.formatWithSpaces(token);
            };
        }
        return this.lines.join("\n").trim();
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

    formatComma(token){
        let line = this.getLastString();
        let startBkt = line.indexOf("(");
        if (line.length > 100){
            this.lines[this.lastIndex()] = line.substring(0, startBkt + 1);
            line = line.substring(startBkt + 1);
            let subLines = line.split(",");
            this.addNewLine(this.indentCount);
            for (let i = 0; i < subLines.length; i++){
                let subLine = subLines[i].trim();
                if (subLine.includes("(") && !subLine.includes(")")){
                    while(i < subLines.length - 1 && !subLines.includes(")")){
                        i++;
                        subLine += ", " + subLines[i];
                    }
                }
                this.lines[this.lastIndex()] += trimEnd(subLine) + ",";
                this.addNewLine(this.indentCount);
            }
        } else if (startBkt < 0){
            this.lines[this.lastIndex()] = trimEnd(this.getLastString()) + token.value;
            this.addNewLine(this.indentCount);
        } else {
            this.lines[this.lastIndex()] = trimEnd(this.getLastString()) + token.value;
        }
    }

    formatPlaceholder(token){
        this.lines[this.lastIndex()] += " ";
    }

    formatWithSpaceAfter(token){
        this.lines[this.lastIndex()] = trimEnd(this.getLastString()) + token.value + " ";
    }

    formatQuerySeparator(token){
        
        this.lines[this.lastIndex()] = trimEnd(this.getLastString());
        /**if first word is start block, and line end for ; then decrement indent
        example:
        procedure name(val);
        */
        let first = this.getFirstWord(this.getLastString());
        if (this.openParens.includes(first.toUpperCase() && first != "if")){
            this.decrementIndent();
        } else if (this.getLastString().endsWith(")")){
            let ssInfo = this.getBktSubstring();
            let substring = ssInfo.substring;
            first = this.getFirstWord(substring);
            if (this.openParens.includes(first.toUpperCase() && first != "if")){
                this.decrementIndent();
            }
        }

        this.lines[this.lastIndex()] += token.value;
        this.addNewLine(this.indentCount);
    }

    getBktSubstring(){
        let countOpenBkt = 0;
        let countCloseBkt = 0;
        let substring = "";
        let index = 0;
        let subLines = [];
        for (let i = this.lastIndex(); i >= 0; i--){
            subLines.unshift(this.lines[i]);
            let line = this.lines[i].replace(/--.*/, "");
            if (line.startsWith("*") || line.startsWith("/*")){
                line = "";
            }
            let match = line.match(/\(/);
            if (match != null){
                countOpenBkt += match.length;
            }
            match = line.match(/\)/);
            if (match != null){
                countCloseBkt += match.length;
            }
            substring = line + substring;
            if (countCloseBkt <= countOpenBkt){
                 index = i;
                break;
            }
        }
        return {substring:substring, startIndex: index, subLines: subLines};
    }

    getFirstWord(string){
        var wordSeparator = / |\(|\)/;
        return string.trim().split(wordSeparator)[0];
    }

    formatWithSpaces(token){
        this.lines[this.lastIndex()] += token.value + " ";
    }  

    formatWithoutSpaces(token){
        // if (this.getLastString().trim() != )
        this.lines[this.lastIndex()] = trimEnd(this.getLastString()) + token.value;
    }

    formatOpeningParentheses(token, index){
        let next = this.getNextValidWord(index);
        let startBlock = ["cursor", "procedure", "function"];
        if (next == ";"){
            this.lines[this.lastIndex()] += token.value;
            return;
        }
        if (startBlock.includes(token.value)){
            console.log(this.indentStartBlock);
            if (this.indentStartBlock < 0){
                this.indentStartBlock = this.indentCount;
            } else {
                this.indentCount = this.indentStartBlock;
            }
        }

        this.addNewLine(this.indentCount);
        this.indentCount++;
        this.lines[this.lastIndex()] += token.value;
        if (token.value == "begin"){
            this.addNewLine(this.indentCount);
        }
    }

    getNextValidWord(index){
        let token = this.tokens[index + 1];
        if (token != undefined){
            if (token.value.trim() != ""){
                return token.value;
            } 
            token = this.tokens[index + 2];
            if (token != undefined){
                return token.value;
            }
        }
        return "";
    }

    decrementIndent(){
        if (this.indentCount != 0)
            this.indentCount--;
    }

    formatClosingParentheses(token, index){
        if (token.value == "end"){
            this.decrementIndent();
            this.lines.pop();
            this.addNewLine(this.indentCount);
            this.lines[this.lastIndex()] += token.value;
        }else {
            this.addNewLine(this.indentCount);
            this.lines[this.lastIndex()] += token.value;
            this.decrementIndent();
        }
    }

    formatSqlQuery(startIndex){
        let startIndent = this.indentCount;
        let sql = "";
        let index = startIndex
        let prev = this.getPrevValidTokenValue(startIndex);
        if (prev == "("){
            let bktCount = 0;
            for (index; index < this.tokens.length; index++){
                let word = this.tokens[index].value;
                if (word == "("){
                    bktCount++;
                    sql += word;
                } else if (word == ")"){
                    if (bktCount == 0) {
                        break;
                    } 
                    sql += word;
                    bktCount--;
                } else {
                    sql += word;
                }
            }
        }else{
            for (index; index < this.tokens.length; index++){
                let word = this.tokens[index].value;
                if (word == ";"){
                    break;
                } else {
                    sql += word;
                }
            }
        }
        index--;
        let sqlArray = new SqlFormatter(this.cfg).getFormatArray(sql);
        if (this.getLastString().trim().endsWith("(")){
            this.insertSqlInThisLine(sqlArray);
        }else{
            this.insertSqlInNewLine(sqlArray);
        }
        this.indentCount = startIndent;
        return index;
    }

    insertSqlInThisLine(sqlArray){
        let indent = this.getLastString().length;
        this.lines[this.lastIndex()] += sqlArray[0];
        for (let i = 1; i < sqlArray.length; i++){
            this.lines.push(repeat(" ", indent) + sqlArray[i]);
        }
    }

    insertSqlInNewLine(sqlArray){
        for (let i = 0; i < sqlArray.length; i++){
            this.addNewLine(this.indentCount);
            this.lines[this.lastIndex()] += sqlArray[i];
        }
    }

    insertFormatSql(indent, sqlArray){
        for (let i = 0; i < sqlArray.length; i++){
            this.addNewLine(this.indentCount);
            this.lines[this.lastIndex()] += sqlArray[i];
        }
        return true;
    }

    getPrevValidTokenValue(index){
        let token = this.tokens[index - 1];
        if (token != undefined){
            if (token.value.trim() == ""){
                token = this.tokens[index - 2];
                if (token != undefined){
                    return token.value;
                }
            }else {
                return token.value;
            }
        }
        return "";
    }

    formatTopLeveleReservedWord(token){
        if (this.getLastString().trim() != "end" 
            && this.getLastString().trim() != "is" && token.value != "then"){
            this.addNewLine(this.indentCount);
        }
        this.lines[this.lastIndex()] += token.value;
        if (token.value == "as"){
            // this.addNewLine(this.indentCount);
        }
        if (token.value == "is"){
            let idx = this.lastIndex() - 1;
            let first = this.getFirstWord(this.lines[idx]);
            if (first == "return"){
                this.indentCount++;
                this.lines[idx] = this.indent + this.lines[idx];
                this.addNewLine(this.indentCount);
            }
        }
    }

    formatLineComment(token){
        this.lines[this.lastIndex()] += token.value;
        this.addNewLine(this.indentCount);
    }   

    formatBlockComment(token){
        this.addNewLine(this.indentCount);
        let comment = "";
        let comLines = token.value.split("\n")
        for (let i = 0; i < comLines.length; i++){
            this.lines[this.lastIndex()] += comLines[i].trim();
            this.addNewLine(this.indentCount);
        }
    }

    addNewLine(count){
        this.lines[this.lastIndex()] = trimEnd(this.getLastString());
        this.lines.push(repeat(this.indent, count));
    }

    lastIndex(){
        return this.lines.length - 1;
    }

    getLastString(){
        return this.lines[this.lastIndex()];
    }
}
