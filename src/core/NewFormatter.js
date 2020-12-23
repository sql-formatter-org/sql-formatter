import includes from "lodash/includes";
import trimEnd from "lodash/trimEnd";
import tokenTypes from "./tokenTypes";
import Indentation from "./Indentation";
import InlineBlock from "./InlineBlock";
import Params from "./Params";
import repeat from "lodash/repeat";
import SqlFormatter from "../languages/SqlFormatter";

const indent = "    ";

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
        this.indentation = new Indentation(this.cfg.indent);
        this.inlineBlock = new InlineBlock();
        this.params = new Params(this.cfg.params);
        this.tokenizer = tokenizer;
        this.previousReservedWord = {};
        this.tokens = [];
        this.index = 0;
        this.reservedWords = reservedWords;
        this.withoutSpaces = [".", "%", "(", ")"];
        this.alignList = [];
        this.lines = [""];
        this.openParens = openParens;
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

            // console.log("value : " + token.value + " indent : " + this.indentCount);

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
                //new line token = start sql query
                i = this.formatSqlQuery(i);
                this.previousReservedWord = token;
            } else 
            // if (token.type === tokenTypes.RESERVED) {
            //     this.formatWithSpacesArray(token);
            //     this.previousReservedWord = token;
            // } else
            if (token.type === tokenTypes.OPEN_PAREN) {
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
        this.lines[this.lastIndex()] =trimEnd(this.getLastString()) + token.value;
        this.addNewLine(this.indentCount);
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
        if (this.openParens.includes(first.toUpperCase())){
            this.decrementIndent();
        } else if (this.getLastString().endsWith(")")){
            let countOpenBkt = 0;
            let countCloseBkt = 0;
            let substring = "";
            for (let i = this.lastIndex(); i >= 0; i--){
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
                if (countCloseBkt == countOpenBkt){
                    break;
                }
            }
            console.log(substring);
            first = this.getFirstWord(substring);
            if (this.openParens.includes(first.toUpperCase())){
                this.decrementIndent();
            }
        }

        this.lines[this.lastIndex()] += token.value;
        this.addNewLine(this.indentCount);
    }

    getFirstWord(string){
        var wordSeparator = / |\(|\)/;
        return string.trim().split(wordSeparator)[0];
    }

    formatWithSpaces(token){
        this.lines[this.lastIndex()] += token.value + " ";
    }  

    formatWithoutSpaces(token){
        this.lines[this.lastIndex()] = trimEnd(this.getLastString()) + token.value;
    }

    formatOpeningParentheses(token, index){
        let next = this.getNextValidWord(index);
        if (next == ";"){
            this.lines[this.lastIndex()] += token.word;
            return;
        }
        if (token.value != "("){
            this.addNewLine(this.indentCount);
        } else {
            // let first = this.getLastString().trim().split(" ")[0];
            // if (!this.openParens.includes(first.toUpperCase())){
            //     this.indentCount++;
            // }
            this.lines[this.lastIndex()] = trimEnd(this.getLastString());    
        }
        this.indentCount++;
        this.lines[this.lastIndex()] += token.value;
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
        this.decrementIndent();
        if (token.value != ")"){
            this.addNewLine(this.indentCount);
        } else {
            this.lines[this.lastIndex()] = trimEnd(this.getLastString());       
        }
        this.lines[this.lastIndex()] += token.value;
    }

    formatSqlQuery(startIndex){
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
        for (let i = 0; i < sqlArray.length; i++){
            this.addNewLine(this.indentCount);
            this.lines[this.lastIndex()] += sqlArray[i];
        }
        return index;
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
        this.addNewLine(this.indentCount);
        this.lines[this.lastIndex()] += token.value;
        if (token.value == "as"){
            this.addNewLine(this.indentCount);
        }
    }

    formatLineComment(token){
        this.lines[this.lastIndex()] += token.value;
        this.addNewLine(this.indentCount);
    }   

    formatBlockComment(token){
        this.addNewLine(0);
        let comment = "";
        let comLines = token.value.split("\n")
        for (let i = 0; i < comLines.length; i++){
            comment += comLines[i].trim() + "\n";
        }
        this.lines[this.lastIndex()] = comment.replace(/\n/g, "\n");
    }

    addNewLine(count){
        this.lines[this.lastIndex()] = trimEnd(this.getLastString());
        this.lines.push(repeat(indent, count));
    }

    lastIndex(){
        return this.lines.length - 1;
    }

    getLastString(){
        return this.lines[this.lastIndex()];
    }
}
