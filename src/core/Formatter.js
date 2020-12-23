import includes from "lodash/includes";
import trimEnd from "lodash/trimEnd";
import tokenTypes from "./tokenTypes";
import Indentation from "./Indentation";
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
        this.indentation = new Indentation(this.cfg.indent);
        this.params = new Params(this.cfg.params);
        this.tokenizer = tokenizer;
        this.previousReservedWord = {};
        this.tokens = [];
        this.index = 0;
        this.reservedWords = reservedWords;
        this.inlineReservedWord = ["order", "group", "values"];
        this.alignList = [];
        this.lines = [""];
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

            // console.log(token.value);

            token.value = this.formatTextCase(token);
            if (token.type === tokenTypes.WHITESPACE) {
                if (!this.getLastString().endsWith(" ") && !this.getLastString().endsWith("(")){
                    this.lines[this.lastIndex()] += " ";
                }
            } else if (token.type === tokenTypes.LINE_COMMENT) {
                this.formatLineCommentArray(token);
            } else if (token.type === tokenTypes.BLOCK_COMMENT) {
                this.formatBlockCommentArray(token);
            } else if (token.type === tokenTypes.RESERVED_TOPLEVEL) {
                this.formatTopLeveleReservedWordArray(token);
                this.previousReservedWord = token;
            } else if (token.type === tokenTypes.RESERVED_NEWLINE) {
                this.formatNewlineReservedWordArray(token);
                this.previousReservedWord = token;
            } else if (token.type === tokenTypes.RESERVED) {
                this.formatWithSpacesArray(token);
                this.previousReservedWord = token;
            } else if (token.type === tokenTypes.OPEN_PAREN) {
                this.formatOpeningParenthesesArray(token);
            } else if (token.type === tokenTypes.CLOSE_PAREN) {
                this.formatClosingParenthesesArray(token);
            } else if (token.type === tokenTypes.PLACEHOLDER) {
                this.formatPlaceholderArray(token);
            } else if (token.value === ",") {
                this.fromatCommaArray(token, i);
            } else if (token.value === ":") {
                this.formatWithSpaceAfterArray(token);
            } else if (token.value === "." || token.value === "%") {
                this.formatWithoutSpacesArray(token);
            } else if (token.value === ";") {
                this.formatQuerySeparatorArray(token);
            } else {
                this.formatWithSpacesArray(token);
            };
        }
        // return this.lines.join("\n").trim();
    }

    fromatCommaArray(token, index){
        this.lines[this.lastIndex()] = trimEnd(this.getLastString()) + token.value;
        var re = / |\(/;
        let first = this.getLastString().trim().split(re)[0];
        if (!this.inlineReservedWord.includes(first)){
            let block = this.getFirstWordInBlock();
            if (block == "select"){
                this.addNewLineArray("left", token.value);
            } else {
                let lastString = this.getLastString().trim();
                let count = lastString.split(",")[0].split(re).length;
                //check previous value
                if (count < 3){
                    this.addNewLineArray("left", token.value);
                }
                //check next value
                for (let i = index + 1; i < index + 5; i++){
                    if (i > this.tokens.length){
                        break;
                    }
                    let tok = this.tokens[i];
                    if (tok != undefined && tok.type === tokenTypes.RESERVED_TOPLEVEL){
                        this.addNewLineArray("left", token.value);
                        break;
                    }
                }
            }
        }
    }

    getFirstWordInBlock(){
        let line = this.getLastString();
        let open = line.lastIndexOf("(");
        if (open < 0){
            return line.trim().split(" ")[0];
        } else{
            if (line.lastIndexOf(")") > open){
                return line.trim().split(" ")[0];
            }
            let substring = line.substring(open + 1);
            return substring.split(" ")[0];
        }
    }

    formatTopLeveleReservedWordArray(token){
        let word = token.value;
        let startBlock = ["select", "begin", "create", "alter", "insert", "update"];
        if (startBlock.includes(word.split(" ")[0])){
            let lineIndex = this.lastIndex();
            // if (this.getLastString().endsWith("(")){
                this.alignList.pop()
            // };
            this.alignList.push({word: word.split(" ")[0], 
                                 count: this.getLastString().length,
                                 token: word});
            this.lines[lineIndex] += word;
        } else {
            this.addNewLineArray("right", token.value);
            this.lines[this.lastIndex()] += token.value;
        }
    }

    formatTextCase(token){
        if (token.value.match("^'.*'$|^util.*|^pkg_.*") != null){
            return token.value;
        } else {
            return token.value.toLowerCase();
        }

    }

    formatLineCommentArray(token){
        this.lines[this.lastIndex()] += token.value;
        this.addNewLineArray("right", "");
    }   

    addNewLineArray(align, word){
        if (this.getLastString().trim() != ""){
            this.lines[this.lastIndex()] = trimEnd(this.getLastString());
            let last = this.alignList[this.alignList.length  - 1];
            let shift = 0;
            if (last != undefined){
                shift = last.count;
                if (align == "left"){
                    shift += last.token.length + 1;
                } else {
                    let dif = last.word.length - word.split(" ")[0].length;
                    if (dif > 0) {
                        shift += dif;
                    }
                }
            }
            this.lines.push(repeat(" ", shift));
        } 
    } 

    formatBlockCommentArray(token){
        this.addNewLineArray("right", token.value);
        this.lines[this.lastIndex()] = this.indentComment(token.value);
    }


    indentComment(comment) {
        return comment.replace(/\n/g, "\n" + this.indentation.getIndent());
    }

    formatNewlineReservedWordArray(token){
        let index = this.lastIndex();
        let words = this.getLastString().trim().split(" ");
        if (words[0] == "case" && words.length == 1){
            this.lines[index] += token.value;
        } else {
            this.addNewLineArray("left", token.value);
            this.lines[index + 1] += token.value;
        }
    }

    formatOpeningParenthesesArray(token){
        if (token.value != "("){
            this.addNewLineArray("left", token.value);
        }else if (this.getLastString().trim() != ""){
            this.lines[this.lastIndex()] = trimEnd(this.getLastString());
        }
        this.alignList.push({word: token.value.split(" ")[0], count: this.getLastString().length, token: token.value});
        this.lines[this.lastIndex()] += token.value;
    }

    formatClosingParenthesesArray(token){
        let word = token.value;
        if (word != ")"){
            this.addNewLineArray("right", token.value);
            this.lines[this.lastIndex()] += word;
            this.alignList.pop();
        } else {
            this.alignList.pop();
            let openIdx = -2;
            let closeIdx = -2;
            for (let i = this.lastIndex(); i >= 0; i--){
                let line = this.lines[i];
                if (openIdx < 0){
                    openIdx = line.lastIndexOf("(");
                    if (closeIdx < 0){
                        closeIdx = line.lastIndexOf(")");
                    } else {
                        this.addNewLineArray("left", token.value);
                        this.lines[this.lastIndex()] += word;
                        break;
                    }
                    if (openIdx > closeIdx){
                        let substring = trimEnd(line) + " ";
                        for (let j = i + 1; j < this.lines.length; j++){
                            substring += this.lines[j].trim() + " ";
                        }
                        let first = substring.replace(/\(|\)|,/i, " ").trim().split(" ")[0].toUpperCase();
                        if (this.reservedWords.includes(first)){
                            this.lines[this.lastIndex()] = trimEnd(this.getLastString()) + word;
                        } else {
                            let count = substring.split(",").length;
                            if (count > 4){
                                this.addNewLineArray("left", token.value);
                                this.lines[this.lastIndex()] += word;
                            } else  if (count > 1) {
                                this.lines[i] = trimEnd(substring) + word;
                                for (let j = i; j < this.lastIndex(); j++){
                                    this.lines.pop();
                                }
                            } else {
                                this.lines[this.lastIndex()] += word;
                                // this.addNewLineArray("left", token.value);
                            }
                        }
                        break;
                    }
                } else {
                    this.addNewLineArray("left", token.value);
                    this.lines[this.lastIndex()] += word;
                    break;
                }
            }
        }
    }


    formatPlaceholderArray(token){
        this.lines[this.lastIndex()] += this.params.get(token) + " ";
    }

    formatPlaceholder(token, query) {
        return query + this.params.get(token) + " ";
    }

    formatWithSpaceAfter(token, query) {
        return this.trimTrailingWhitespace(query) + token.value + " ";
    }

    formatWithSpaceAfterArray(token){
        this.trimTrailingWhitespaceArray();
        this.lines[this.lastIndex()] += token.value + " ";
    }

    formatWithoutSpaces(token, query) {
        return this.trimTrailingWhitespace(query) + token.value;
    }

    formatWithoutSpacesArray(token){
        this.trimTrailingWhitespaceArray();
        this.lines[this.lastIndex()] += token.value;
    }

    formatWithSpaces(token, query) {
        return query + token.value + " ";
    }

    formatWithSpacesArray(token){
        if (!token.value.endsWith(".")){
            this.lines[this.lastIndex()] += token.value + " ";
        } else {
            this.lines[this.lastIndex()] += token.value;
        }
    }

    formatQuerySeparator(token, query) {
        return this.trimTrailingWhitespace(query) + token.value + "\n";
    }

    formatQuerySeparatorArray(token){
        this.trimTrailingWhitespaceArray();
        this.lines[this.lastIndex()] += token.value;
        this.addNewLineArray("left", token.value);
    }


    trimTrailingWhitespace(query) {
        if (this.previousNonWhitespaceToken().type === tokenTypes.LINE_COMMENT) {
            return trimEnd(query) + "\n";
        }
        else {
            return trimEnd(query);
        }
    }

    trimTrailingWhitespaceArray(){
        this.lines[this.lastIndex()] = trimEnd(this.getLastString());
        if (this.previousNonWhitespaceToken.type === tokenTypes.LINE_COMMENT){
            this.addNewLineArray("left", "");
        } 
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
