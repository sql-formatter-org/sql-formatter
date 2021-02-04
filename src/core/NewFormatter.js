import includes from "lodash/includes";
import trimEnd from "lodash/trimEnd";
import tokenTypes from "./tokenTypes";
import Params from "./Params";
import repeat from "lodash/repeat";
import SqlFormatter from "../languages/SqlFormatter";
import Tokenizer from "./Tokenizer";

export default class NewFormatter {
    constructor(cfg, tokenizer, reservedWords, openParens) {
        this.indentCount = 0;
        this.tokenizer = tokenizer;
        this.tokens = [];
        this.reservedWords = reservedWords;
        this.withoutSpaces = [".", "%", 
        "(", //")"
        ];
        this.lines = [""];
        this.indent = "    ";
        this.openParens = openParens;
        this.indentsKeyWords = [];
        this.lastIndentKey = {key: "", name: "", indent: 0};
        this.lineSize = 80;
        this.booleanOperators = ["and", "or", "xor"];
        this.cQuery = "";
    }

    format(query) {
        this.query = query;
        this.tokens = this.tokenizer.tokenize(query);
        const formattedQuery = this.formatQuery();
        return formattedQuery.trim();
    }

    formatQuery(){
        this.cQuery = this.query;
        let originQuery = this.query;
        for (let i = 0; i < this.tokens.length; i++){
            var token = this.tokens[i];
            token.value = this.formatTextCase(token);
            if (token.value.startsWith(".") && token.value != ".." && this.getLastString().endsWith(") ")){
                this.lines[this.lastIndex()] = trimEnd(this.getLastString());
            }
            if (token.type === tokenTypes.WHITESPACE) {
                if (!this.getLastString().endsWith(" ") && !this.getLastString().endsWith("(")
                 && this.getLastString().trim() != ""){
                    this.lines[this.lastIndex()] += " ";
                }
            } 
            else if (token.type === tokenTypes.LINE_COMMENT) {
                this.formatLineComment(token);
            } 
            else if (token.type === tokenTypes.BLOCK_COMMENT) {
                this.formatBlockComment(token);
            }
            // else if (token.type === tokenTypes.RESERVED_TOPLEVEL) {
            //     this.formatTopLeveleReservedWord(token);
            // } 
            else if (token.type === tokenTypes.RESERVED_NEWLINE) {
                //new line token = start sql query
                i = this.formatSqlQuery(i);
            } 
            else if (token.type === tokenTypes.OPEN_PAREN) {
                this.formatOpeningParentheses(token, i);
            } 
            else if (token.type === tokenTypes.CLOSE_PAREN) {
                this.formatClosingParentheses(token, i);
            } 
            else if (token.type === tokenTypes.PLACEHOLDER) {
                this.formatPlaceholder(token);
            } 
            // else if (this.booleanOperators.includes(token.value)){
            //     this.formatBooleanExpressions(token);
            // }
            else if (token.value === ")"){
                this.formatCloseBkt(token);
            }
            else if (token.value === "begin"){
                this.formatBegin(token);
            }
            else if (token.value == "then") {
                this.formatThen(token);
            }
            else if (token.value === "loop"){
                this.formatLoop(token, i);
            }
            else if (token.value === ",") {
                this.formatComma(token);
            } 
            else if (token.value === ":") {
                this.formatWithSpaceAfter(token);
            } 
            else if (this.withoutSpaces.includes(token.value)) {
                this.formatWithoutSpaces(token);
            } 
            else if (token.value === ";") {
                this.formatQuerySeparator(token);
            } 
            else if (token.value == "exception" || token.value == "exceptions"){
                this.formatException(token, i);
            } 
            else if (token.value == "else"){
                this.lines[this.lastIndex()] = repeat(this.indent, this.indentCount - 1) + token.value;
                this.addNewLine(this.indentCount);
            }
            else if (token.value == "elsif"){
                this.lines[this.lastIndex()] = repeat(this.indent, this.indentCount - 1) + token.value;
            }
            else if (token.value == "when"){
                this.formatWhen(token);
            }
            else if (token.value =="as" || token.value == "is"){
                this.formatAsIs(token);
            } 
            else if (token.value == "return"){
                this.formatReturn(token);
            }
            else {
                this.formatWithSpaces(token);
            };
        }
        return this.addDevelopEmptyLines(originQuery, this.lines.join("\n").trim());
        // return this.lines.join("\n").trim();
    }

    trimStart(line){
        while (line[0] == " "){
            line = line.substring(1);
        }
        return line;
    }

    formatLikeDevelopWrite(token){
        let cInfo = this.getFormattingString(token);
        let searchString = cInfo.substring;
        let first = searchString.trim().split(" ")[0].trim().replace("(", "");
        let info = this.findSubstring(first, token.value, this.getStringInOneStyle(searchString).trim());
        if (searchString.trim().length < 65){
            return;
        }
        this.popLine(cInfo.popCount);
        let newLine = this.formatOriginSubstringWithIndent(cInfo.indent, info.indent, info.substring) + " ";
        this.lines[this.lastIndex()] = newLine;

    }

    formatOriginSubstringWithIndent(indent, originIndent, substring){
        let split = substring.split("\n");
        if (split[0].match(/'/g) == undefined || split[0].match(/'/g).length % 2 == 0){
            split[0] = repeat(" ", indent) + split[0].trim();
        } else {
            split[0] = repeat(" ", indent) + this.trimStart(split[0]);
        }
        let inQuotes = (split[0].match(/'/g) != undefined && split[0].match(/'/g) % 2 == 1);
        for (let i = 1; i < split.length; i++){
            let match = split[i].match(/'/g);
            let cIndent = this.getLineIndent(split[i]) + 1;
            if (inQuotes){
                split[i] = split[i];
                if (match != undefined && match.length % 2 == 1){
                    inQuotes = false;
                }
            }else {
                if (match == undefined){
                    split[i] = repeat(" ", indent - originIndent + cIndent) + split[i].trim();
                } else {
                    if (match.length % 2 == 1){
                        inQuotes = true;
                    }
                    split[i] = repeat(" ", indent - originIndent + cIndent) + this.trimStart(split[i]);
                }
            }
        }
        return split.join("\n");
    }

    getLineIndent(line){
        let indent = 0;
        for (indent; indent < line.length; indent++){
            if (line[indent] != " "){
                return indent;
            }
        }
        return indent;
    }

    popLine(popCount){
        for (let i = 0; i < popCount; i++){
            let line = this.lines.pop();
        }
    }

    findSubstring(first, last, searchString){
        let substring = "";
        let indent = 0;
        let startIdx = 0;
        while (this.getStringInOneStyle(substring).trim().toLowerCase() != searchString.trim().toLowerCase()){
            substring = "";
            startIdx = this.query.toLowerCase().indexOf(first);
            while(searchString.trim().toLowerCase().startsWith(this.getStringInOneStyle(substring).trim().toLowerCase()) && this.getStringInOneStyle(substring.trim()).trim().length != searchString.trim().length){
                substring += this.query[startIdx];
                startIdx++;
            }
            if (searchString.trim().toLowerCase() != this.getStringInOneStyle(substring).trim().toLowerCase()){
                this.query = this.query.substring(this.query.toLowerCase().indexOf(first) + first.length);
            }
        }
        let from = this.query.indexOf(substring);
        for (let i = from; i >=0; i--){
            if (this.query[i] == "\n"){
                break;
            } else {
                indent++;
            }
        }
        this.query = this.query.substring(this.query.indexOf(substring) + substring.length - 1);
        substring = this.formatSubstringCase(substring);
        return {substring: substring, indent: indent};
    }

    formatSubstringCase(string){
        let cfg = this.openParens;
        let toks = this.tokenizer.tokenize(string);
        let prev = toks[0];
        prev.value = this.formatTextCase(prev);
        let substring = "";
        let lowCase = string.toLowerCase();
        for (let i = 1; i < toks.length; i++){
            let token = toks[i];
            token.value = this.formatTextCase(token);
            if (token.type != tokenTypes.WHITESPACE){
                console.log("token : " + token.value);
                console.log("prev : " + prev.value);
                let start = lowCase.indexOf(prev.value.toLowerCase()) + prev.value.length;
                let end = lowCase.indexOf(token.value.toLowerCase());
                let current = lowCase.substring(0, end)+ token.value; 
                substring += current;
                console.log("current : " + current);
                lowCase = lowCase.substring(lowCase.indexOf(current.toLowerCase()) + current.length);
                console.log("lowCase : " + lowCase);
                // lowCase = lowCase.indexOf(current.toLowerCase() + current.length);
                prev = token;
            }
        }
        return substring;
    }

    getStringInOneStyle(word){
        return word.replaceAll("(", " ( ").replaceAll(")", " ) ")
                   .replaceAll(",", " , ").replaceAll("=", " = ")
                   .replaceAll("--", " -- ")
                   .replaceAll("-", " - ").replaceAll(/(\s|\n)+/g, " ");
    }

    getFormattingString(token){
        let lastIdx = this.lastIndex();
        let startBlocks = ["if", "elsif", "while", "case", "when"];
        if (lastIdx == 0){
            return this.getLastString();
        }
        let first = this.getLastString().trim().replaceAll(/\(|\(/g, "").split(" ")[0];
        let substring = this.getLastString();
        while (!startBlocks.includes(first)){
            lastIdx--;
            if (lastIdx < 0){
                break;
            }
            substring = this.lines[lastIdx] + " " + substring.trim();
            first = substring.trim().replaceAll(/\(|\(/g, "").split(" ")[0];
        }
        if (lastIdx < 0){
            lastIdx = 0;
        }
        let indent = this.getLineIndent(this.lines[lastIdx])
        let popCount = this.lines.length - lastIdx - 1;
        return {indent: indent, substring: substring, popCount: popCount};

    }

    formatReturn(token){
        let first = this.getFirstWord(this.getLastString());
        let last = this.indentsKeyWords[this.indentsKeyWords.length - 1];
        if ((this.openParens.includes(first) && this.getLastString().split(",").length > 1) ||
            (last != undefined)){
            this.addNewLine(this.indentCount);
        }
        this.lines[this.lastIndex()] += token.value;
    }

    formatBooleanExpressions(token){
        let last = this.indentsKeyWords[this.indentsKeyWords.length - 1];
        if (last.key == "case" || last.key == "if"){
            this.addNewLine(this.indentCount);
        }
        this.lines[this.lastIndex()] += token.value;
    }

    addDevelopEmptyLines(origin, query){
        let format = "";
        let split = origin.split("\n");
        for (let i = 0; i < split.length; i++){
            if (split[i].trim() == ""){
                let spaceCount = 1;
                while(i < split.length && split[i].trim() == ""){
                    spaceCount++;
                    i++;
                }
                if (spaceCount > 1){
                    format += "\n";
                }
                i--;
            } else {
                 for (let j = 0; j < split[i].length; j++){
                    let char = split[i][j];
                    if (char != " "){
                        let index = query.indexOf(char);
                        let idx1 = query.indexOf(char.toLowerCase());
                        if (index < 0) {
                            index = idx1;
                        } else if (index > idx1 && idx1 != -1){
                            index = idx1;
                        }
                        let ss = query.substring(0, index + 1);
                        format += ss;
                        query = query.substring(index + 1);
                    }
                 }
            }
        }
        return this.removeDupticateEmptyLine(format);
    }

    removeDupticateEmptyLine(query){
        let split = query.split("\n");
        for (let i = split.length - 1; i >= 1; i--){
            if (split[i].trim() == "" && split[i - 1].trim() == ""){
                for (let j = i; j < split.length - 1; j++){
                    split[j] = split[j + 1];
                }
                split.pop();
            }
        }
        return split.join("\n");
    }

    formatWhen(token){
        let lastKey = this.indentsKeyWords[this.indentsKeyWords.length - 1];
        if (lastKey != undefined && lastKey.key == "case" && !this.getLastString().trim().startsWith("case")){
            this.indentCount--;
            this.lines[this.lastIndex()] = repeat(this.indent, this.indentCount) + " ";
        }
        this.lines[this.lastIndex()] += token.value;
    }

    formatThen(token){
        this.formatLikeDevelopWrite(token);
        this.lines[this.lastIndex()] += token.value;
        if (this.getLastString().includes(" when ")){
            this.indentCount++;
        }
        this.addNewLine(this.indentCount);
    }

    formatLoop(token, index){
        let next = this.getNextValidWord(index);
        if (next != ";"){
            this.formatLikeDevelopWrite(token);
            this.lines[this.lastIndex()] += token.value;
            this.indentsKeyWords[this.indentsKeyWords.length - 1].key = "loop";
            this.addNewLine(this.indentCount);
        } else {
            this.lines[this.lastIndex()] += token.value;
        }
    }

    formatBegin(token){
        let lastIndent = this.indentsKeyWords[this.indentsKeyWords.length - 1];
        let startBlock = ["cursor", "procedure", "function", "pragma"];
        if (lastIndent != undefined){
            if (startBlock.includes(lastIndent.key)){
                if (this.getLastString().trim() != ""){
                    this.addNewLine(this.indentCount - 1);
                } else {
                    this.lines[this.lastIndex()] = repeat(this.indent, this.indentCount - 1);
                }
                if (lastIndent.key != "procedure" && lastIndent.key != "function"){
                    this.indentsKeyWords.push({key: token.value, name: "", indent: this.indentCount});  
                } else {
                    this.indentsKeyWords[this.indentsKeyWords.length - 1].key = token.value;
                }
            } else {
                this.incrementIndent(token.value, "");
            }
        } else {
            if (this.getLastString().trim() != "" && !this.prevLineIsComment()){
                this.addNewLine(this.indentCount);
            }
            this.incrementIndent(token.value, "");
        }
        this.lines[this.lastIndex()] += token.value;
        this.addNewLine(this.indentCount);
    }

    formatCloseBkt(token){
        this.lines[this.lastIndex()] = trimEnd(this.getLastString()) + token.value + " ";    
        let lastString =  this.getLastString();
        let openMatch = lastString.match(/\(/);
        let closeMatch = lastString.match(/\)/);
        if (openMatch != undefined && closeMatch != undefined){
            let first = this.getFirstWord(lastString);
            if (lastString.length > this.lineSize && openMatch.length == closeMatch.length){
                if (this.openParens.includes(first.toUpperCase()) && first != "if"){
                    this.lines[this.lastIndex()] = lastString.substring(0, lastString.indexOf("(") + 1);
                    let subLines = lastString.substring(lastString.indexOf("(") + 1).split(", ");
                    this.lines.push(repeat(this.indent, this.indentCount) + subLines[0]);
                    for (let i = 1; i < subLines.length; i++){
                        this.lines[this.lastIndex()] += ",";
                        this.lines.push(repeat(this.indent, this.indentCount) + subLines[i]);
                    }
                } else {
                    // let idx = this.getStartBktIndex();
                    // this.lines[this.lastIndex()] = lastString.substring(0, idx + 1);
                    // let subLines = lastString.substring(idx + 1).split(", ");
                    // let bktIndent = this.lines[this.lastIndex()].length;
                    // let sbstr = subLines[0];
                    // let start = 0;
                    // while (bktIndent + sbstr.length < this.lineSize){
                    //     start++;
                    //     sbstr += ", " + subLines[start];
                    // }
                    // this.lines[this.lastIndex()] += sbstr;
                    // sbstr = subLines[start + 1];
                    // if (start + 1 == subLines.length - 1){
                    //     this.lines[this.lastIndex()] = lastString.substring(0, idx + 1);
                    //     let center = (subLines.length - (subLines.length % 2) ) / 2;
                    //     for (let i = 0; i < subLines.length; i++){
                    //         if (i == center){
                    //             this.lines.push(repeat(" ", bktIndent));
                    //         }
                    //         this.lines[this.lastIndex()] += subLines[i];
                    //         if (i != subLines.length - 1){
                    //             this.lines[this.lastIndex()] += ", ";
                    //         }
                    //     }
                    // } else {
                    //     for (let i = start + 2; i < subLines.length; i++){
                    //         sbstr +=  ", ";
                    //         if (sbstr.length + bktIndent > this.lineSize){
                    //             this.lines.push(repeat(" ", bktIndent) + sbstr);
                    //             sbstr = subLines[i];
                    //             if (i == subLines.length - 1){
                    //                 this.lines.push(repeat(" ", bktIndent) + sbstr);
                    //            }
                    //         } else {
                    //             sbstr += subLines[i];
                    //             if (i == subLines.length - 1){
                    //                 this.lines.push(repeat(" ", bktIndent) + sbstr);
                    //            }
                    //         }
                    //     }
                    // }
                    
                }
            } 
        }
    }

    getStartBktIndex(){
        let lastStr = trimEnd(this.getLastString());
        let openBkt = 0;
        let closeBkt = 0;
        for (let i = lastStr.length - 1; i >= 0; i--){
            if (lastStr[i] == "("){
                openBkt++;
            } else if (lastStr[i] == ")"){
                closeBkt++;
            }
            if (closeBkt == openBkt){
                return i;
            }
        }
        return 0;
    }

    formatException(token, index){
        let next = this.getNextValidWord(index);
        if (next == ";"){
            this.lines[this.lastIndex()] += token.value;
            return;
        }
        if (this.getLastString().trim().match(/^return.*;$/) != null){
            this.indentsKeyWords.push(this.lastIndentKey);
        }
        let last = this.indentsKeyWords[this.indentsKeyWords.length - 1];
        let lastIndent = last.indent;
        this.indentCount = last.indent + 1;
        if (this.getLastString().trim() == ""){
            this.lines[this.lastIndex()] = repeat(this.indent, lastIndent);
        } else {
            this.addNewLine(lastIndent);
        }
        this.lines[this.lastIndex()] += token.value;
        this.indentCount = last.indent + 1;
        this.addNewLine(this.indentCount);
    }

    formatComma(token){
        this.lines[this.lastIndex()] = trimEnd(this.getLastString()) + token.value + " ";
    }

    formatPlaceholder(token){
        this.lines[this.lastIndex()] += " ";
    }

    formatWithSpaceAfter(token){
        this.lines[this.lastIndex()] = trimEnd(this.getLastString()) + token.value + " ";
    }

    formatAsIs(token){
        let startComment = false;
        let bktCount = 0;
        let substring = "";
        for (let i = this.lastIndex(); i >= 0; i--){
            let line = this.lines[i];
            if (startComment){
                if (line.includes("/*")){
                    startComment = false;
                }else {
                    continue;
                }
            }
            else {
                if (line.includes("*/")){
                    startComment = true;
                    continue;
                }
                if (line.trim() == ""){
                    continue;
                }
                if (line.includes(")")){
                    substring = this.getBktSubstring(i).substring + substring;
                    break;
                }else {
                    substring = line + substring;
                    break;
                }
            }
        }
        let ignore = ["if", "elsif", "while", "for"];
        let first = this.getFirstWord(substring);
        if (first == "create"){
            if (!this.prevLineIsComment() && this.getLastString().trim() != ""){
                this.addNewLine(this.indentCount - 1);
            } else {
                this.lines[this.lastIndex()] = repeat(this.indent, this.indentCount - 1);
            }
            this.lines[this.lastIndex()] += token.value;
            this.addNewLine(this.indentCount);
        } else if (first == "cursor"){
            this.lines[this.lastIndex()] += token.value;
            this.addNewLine(this.indentCount);
        } else if (
            (this.openParens.includes(first.toUpperCase()) && !ignore.includes(first)) || 
            (this.getLastString().includes("return") && !this.getLastString().endsWith(";"))
            ){
            if (!this.prevLineIsComment() && this.getLastString().trim() != ""){
                this.addNewLine(this.indentCount - 1);
            } 
            else {
                if (this.getLastString().trim() == ""){
                    this.lines[this.lastIndex()] = repeat(this.indent, this.indentCount - 1);
                } else {
                    this.addNewLine(this.indentCount - 1);      
                }
            }
            // this.addNewLine(this.indentCount - 1);
            this.lines[this.lastIndex()] += token.value;
            this.addNewLine(this.indentCount);
        } else {
            this.lines[this.lastIndex()] += token.value;
        }
    }

    formatQuerySeparator(token){
        
        this.lines[this.lastIndex()] = trimEnd(this.getLastString());
        /**if first word is start block, and line end for ; then decrement indent
        example:
        procedure name(val);
        */
        let startBlock = ["cursor", "procedure", "function", "forall", "for", "while"];
        let first = this.getFirstWord(this.getLastString());
        let lIndent = this.indentsKeyWords[this.indentsKeyWords.length - 1];
        if (lIndent != undefined && lIndent.key == "forall"){
            this.decrementIndent(); 
        } else if ((this.openParens.includes(first.toUpperCase()) 
            && first != "if") || this.getLastString().includes("return")){
            if (lIndent != undefined && startBlock.includes(lIndent.key)){
                this.decrementIndent(); 
            }
        } else if (this.getLastString().endsWith(")")){
            let ssInfo = this.getBktSubstring(this.lastIndex());
            let substring = ssInfo.substring;
            first = this.getFirstWord(substring);
            if (this.openParens.includes(first.toUpperCase()) && first != "if"){
                this.decrementIndent();
            }
        } 
        this.lines[this.lastIndex()] += token.value;
        this.addNewLine(this.indentCount);
    }

    getBktSubstring(from){
        let countOpenBkt = 0;
        let countCloseBkt = 0;
        let substring = "";
        let index = 0;
        let subLines = [];
        for (let i = from; i >= 0; i--){
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
        return string.trim().split(wordSeparator)[0].trim();
    }

    formatWithSpaces(token){
        this.lines[this.lastIndex()] += token.value + " ";
    }  

    formatWithoutSpaces(token){
        let words = this.getLastString().trim().split(" ");
        if (token.value == "(" && this.reservedWords.includes(words[words.length - 1].trim().toUpperCase())){
            this.lines[this.lastIndex()] = this.getLastString() + token.value;
        } else {
            this.lines[this.lastIndex()] = trimEnd(this.getLastString()) + token.value;
        }
    }

    formatOpeningParentheses(token, index){
        let next = this.getNextValidWord(index);
        let startBlock = ["cursor", "procedure", "function", "forall", "for", "while"];
        if (next != ";"){
            let lastIndent = this.indentsKeyWords[this.indentsKeyWords.length - 1];
            if (!this.prevLineIsComment()){
                if (this.getLastString().trim() != ""){
                    this.addNewLine(this.indentCount);    
                }
                this.addNewLine(this.indentCount);
            }
            if (token.value == "if" || token.value.startsWith("for") || token.value == "while"){
                while(this.getLastString().trim() == ""){
                    this.lines.pop();
                }
                this.addNewLine(this.indentCount);
            }
            this.incrementIndent(token.value, next);
            this.lines[this.lastIndex()] += token.value;
        } else {
            this.lines[this.lastIndex()] += token.value;
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
        this.lastIndentKey = this.indentsKeyWords.pop();
        this.indentCount = this.lastIndentKey.indent
    }

    incrementIndent(key, name){
        this.indentsKeyWords.push({key: key, name: name, indent: this.indentCount});  
        this.indentCount++;
    }

    formatClosingParentheses(token, index){
        let next = this.getNextValidWord(index);
        let prevIndent = this.indentCount;
        if (next == ";" || this.reservedWords.includes(next.toUpperCase())){
            this.decrementIndent();
        } else {
            for (let i = this.indentsKeyWords.length - 1; i >= 0; i--){
                let current = this.indentsKeyWords[i];
                if (current.name == next){
                    this.indentCount = current.indent;
                    break;
                } else {
                    this.decrementIndent();
                }
            }
        }
        if (this.getLastString().trim() != ""){
            this.addNewLine(this.indentCount);
        }
        if (prevIndent == this.indentCount){
            this.lines[this.lastIndex()] = repeat(this.indent, this.indentCount - 1) + token.value;    
        } else {
            this.lines[this.lastIndex()] = repeat(this.indent, this.indentCount) + token.value;
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
        let next = this.getNextValidWord(index);
        if (next == ";" && this.indentsKeyWords.length !=0 &&
                 this.indentsKeyWords[this.indentsKeyWords.length - 1].key == "cursor"){
            this.decrementIndent();
        }
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
        while (this.getLastString().trim() == "" && this.lines.length != 1){
            this.lines.pop();
        }
        for (let i = 0; i < sqlArray.length; i++){
            if (this.getLastString().trim() == ""){
                this.lines.pop();
            }
            this.addNewLine(this.indentCount);
            this.lines[this.lastIndex()] += sqlArray[i];
        }
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
        if (this.addNewLinePreviewReservedWord(token)){
            this.addNewLine(this.indentCount);
        }
        if (token.value == "elsif" && this.lines[this.lastIndex() - 1].includes("return")){
            this.indentCount++;
        }
        this.lines[this.lastIndex()] += token.value;
        if (token.value == "is" || token.value == "as"){
            let idx = this.lastIndex() - 1;
            let first = this.getFirstWord(this.lines[idx]);
            if (first == "return"){
                this.indentCount++;
                this.lines[idx] = this.indent + this.lines[idx];
                this.addNewLine(this.indentCount);
            }
        }
    }

    addNewLinePreviewReservedWord(token){
        return this.getLastString().trim() != "end" && this.getLastString().trim() != "is" 
                            && token.value != "then" && this.getLastString().trim() != "" 
                            && !(token.value == "as" && this.getLastString().includes(" with "))
    }

    formatLineComment(token){
        let qLines = this.cQuery.split("\n");
        let isNewLine = false;
        for (let i = 0; i < qLines.length; i++){
            if (qLines[i].includes(token.value.trim()) && qLines[i].trim() == token.value.trim()){
                isNewLine = true;
                break;
            }
        }
        this.cQuery = this.cQuery.substring(this.cQuery.indexOf(token.value) + token.value.length);
        if (isNewLine){
            if (!this.getLastString().trim() == ""){
                this.addNewLine(this.indentCount);
            }
        } else {
            if (this.getLastString().trim() == ""){
                this.lines.pop();
            }
        }
        if (!this.getLastString().endsWith(" ")){
            this.lines[this.lastIndex()] += " ";
        }
        this.lines[this.lastIndex()] += token.value;
        this.addNewLine(this.indentCount);
        
    }   

    formatBlockComment(token){
        if (this.prevLineIsComment()){
            this.lines.push("");
        }
        this.addNewLine(this.indentCount);
        let comment = "";
        let comLines = token.value.split("\n")
        for (let i = 0; i < comLines.length; i++){
            if (comLines[i].trim().startsWith("*")){
                this.lines[this.lastIndex()] +=" ";
            }
            this.lines[this.lastIndex()] += comLines[i].trim();
            this.addNewLine(this.indentCount);
        }
    }

    prevLineIsComment(){
        return this.lastIndex() != 0 && 
                this.lines[this.lastIndex() - 1].endsWith("*/");
    }

    addNewLine(count){
        this.lines[this.lastIndex()] = trimEnd(this.getLastString());
        if (count > 0){
            this.lines.push(repeat(this.indent, count));
        } else {
            this.lines.push("");
        }
    }

    lastIndex(){
        return this.lines.length - 1;
    }

    getLastString(){
        return this.lines[this.lastIndex()];
    }

    formatTextCase(token){
        if (token.value.match("^'.*'$|^util.*|^pkg_.*") != null || 
            token.type === tokenTypes.BLOCK_COMMENT ||
            token.type === tokenTypes.LINE_COMMENT ||
            token.value.startsWith("'")){
            return token.value;
        } else {
            return token.value.toLowerCase();
        }

    }
}
