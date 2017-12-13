"use strict";

exports.__esModule = true;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _isEmpty = require("lodash/isEmpty");

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _escapeRegExp = require("lodash/escapeRegExp");

var _escapeRegExp2 = _interopRequireDefault(_escapeRegExp);

var _tokenTypes = require("./tokenTypes");

var _tokenTypes2 = _interopRequireDefault(_tokenTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Tokenizer = function () {
    /**
     * @param {Object} cfg
     *  @param {String[]} cfg.reservedWords Reserved words in SQL
     *  @param {String[]} cfg.reservedToplevelWords Words that are set to new line separately
     *  @param {String[]} cfg.reservedNewlineWords Words that are set to newline
     *  @param {String[]} cfg.stringTypes String types to enable: "", '', ``, [], N''
     *  @param {String[]} cfg.openParens Opening parentheses to enable, like (, [
     *  @param {String[]} cfg.closeParens Closing parentheses to enable, like ), ]
     *  @param {String[]} cfg.indexedPlaceholderTypes Prefixes for indexed placeholders, like ?
     *  @param {String[]} cfg.namedPlaceholderTypes Prefixes for named placeholders, like @ and :
     *  @param {String[]} cfg.lineCommentTypes Line comments to enable, like # and --
     *  @param {String[]} cfg.specialWordChars Special chars that can be found inside of words, like @ and #
     */
    function Tokenizer(cfg) {
        (0, _classCallCheck3["default"])(this, Tokenizer);

        this.WHITESPACE_REGEX = /^(\s+)/;
        this.NUMBER_REGEX = /^((-\s*)?[0-9]+(\.[0-9]+)?|0x[0-9a-fA-F]+|0b[01]+)\b/;
        this.OPERATOR_REGEX = /^(!=|<>|==|<=|>=|!<|!>|\|\||::|->>|->|\{\{\{|\}\}\}|\{\{|\}\}|.)/;

        this.BLOCK_COMMENT_REGEX = /^(\/\*[^]*?(?:\*\/|$))/;
        this.LINE_COMMENT_REGEX = this.createLineCommentRegex(cfg.lineCommentTypes);

        this.RESERVED_TOPLEVEL_REGEX = this.createReservedWordRegex(cfg.reservedToplevelWords);
        this.RESERVED_NEWLINE_REGEX = this.createReservedWordRegex(cfg.reservedNewlineWords);
        this.RESERVED_PLAIN_REGEX = this.createReservedWordRegex(cfg.reservedWords);

        this.WORD_REGEX = this.createWordRegex(cfg.specialWordChars);
        this.STRING_REGEX = this.createStringRegex(cfg.stringTypes);

        this.OPEN_PAREN_REGEX = this.createParenRegex(cfg.openParens);
        this.CLOSE_PAREN_REGEX = this.createParenRegex(cfg.closeParens);

        this.INDEXED_PLACEHOLDER_REGEX = this.createPlaceholderRegex(cfg.indexedPlaceholderTypes, "[0-9]*");
        this.IDENT_NAMED_PLACEHOLDER_REGEX = this.createPlaceholderRegex(cfg.namedPlaceholderTypes, "[a-zA-Z0-9._$]+");
        this.STRING_NAMED_PLACEHOLDER_REGEX = this.createPlaceholderRegex(cfg.namedPlaceholderTypes, this.createStringPattern(cfg.stringTypes));
    }

    Tokenizer.prototype.createLineCommentRegex = function createLineCommentRegex(lineCommentTypes) {
        return new RegExp("^((?:" + lineCommentTypes.map(function (c) {
            return (0, _escapeRegExp2["default"])(c);
        }).join("|") + ").*?(?:\n|$))");
    };

    Tokenizer.prototype.createReservedWordRegex = function createReservedWordRegex(reservedWords) {
        var reservedWordsPattern = reservedWords.join("|").replace(/ /g, "\\s+");
        return new RegExp("^(" + reservedWordsPattern + ")\\b", "i");
    };

    Tokenizer.prototype.createWordRegex = function createWordRegex() {
        var specialChars = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        return new RegExp("^([\\w" + specialChars.join("") + "]+)");
    };

    Tokenizer.prototype.createStringRegex = function createStringRegex(stringTypes) {
        return new RegExp("^(" + this.createStringPattern(stringTypes) + ")");
    };

    // This enables the following string patterns:
    // 1. backtick quoted string using `` to escape
    // 2. square bracket quoted string (SQL Server) using ]] to escape
    // 3. double quoted string using "" or \" to escape
    // 4. single quoted string using '' or \' to escape
    // 5. national character quoted string using N'' or N\' to escape


    Tokenizer.prototype.createStringPattern = function createStringPattern(stringTypes) {
        var patterns = {
            "``": "((`[^`]*($|`))+)",
            "[]": "((\\[[^\\]]*($|\\]))(\\][^\\]]*($|\\]))*)",
            "\"\"": "((\"[^\"\\\\]*(?:\\\\.[^\"\\\\]*)*(\"|$))+)",
            "''": "(('[^'\\\\]*(?:\\\\.[^'\\\\]*)*('|$))+)",
            "N''": "((N'[^N'\\\\]*(?:\\\\.[^N'\\\\]*)*('|$))+)"
        };

        return stringTypes.map(function (t) {
            return patterns[t];
        }).join("|");
    };

    Tokenizer.prototype.createParenRegex = function createParenRegex(parens) {
        return new RegExp("^(" + parens.map(function (p) {
            return (0, _escapeRegExp2["default"])(p);
        }).join("|") + ")");
    };

    Tokenizer.prototype.createPlaceholderRegex = function createPlaceholderRegex(types, pattern) {
        if ((0, _isEmpty2["default"])(types)) {
            return false;
        }
        var typesRegex = types.map(_escapeRegExp2["default"]).join("|");

        return new RegExp("^((?:" + typesRegex + ")(?:" + pattern + "))");
    };

    /**
     * Takes a SQL string and breaks it into tokens.
     * Each token is an object with type and value.
     *
     * @param {String} input The SQL string
     * @return {Object[]} tokens An array of tokens.
     *  @return {String} token.type
     *  @return {String} token.value
     */


    Tokenizer.prototype.tokenize = function tokenize(input) {
        var tokens = [];
        var token = void 0;

        // Keep processing the string until it is empty
        while (input.length) {
            // Get the next token and the token type
            token = this.getNextToken(input, token);
            // Advance the string
            input = input.substring(token.value.length);

            tokens.push(token);
        }
        return tokens;
    };

    Tokenizer.prototype.getNextToken = function getNextToken(input, previousToken) {
        return this.getWhitespaceToken(input) || this.getCommentToken(input) || this.getStringToken(input) || this.getOpenParenToken(input) || this.getCloseParenToken(input) || this.getPlaceholderToken(input) || this.getNumberToken(input) || this.getReservedWordToken(input, previousToken) || this.getWordToken(input) || this.getOperatorToken(input);
    };

    Tokenizer.prototype.getWhitespaceToken = function getWhitespaceToken(input) {
        return this.getTokenOnFirstMatch({
            input: input,
            type: _tokenTypes2["default"].WHITESPACE,
            regex: this.WHITESPACE_REGEX
        });
    };

    Tokenizer.prototype.getCommentToken = function getCommentToken(input) {
        return this.getLineCommentToken(input) || this.getBlockCommentToken(input);
    };

    Tokenizer.prototype.getLineCommentToken = function getLineCommentToken(input) {
        return this.getTokenOnFirstMatch({
            input: input,
            type: _tokenTypes2["default"].LINE_COMMENT,
            regex: this.LINE_COMMENT_REGEX
        });
    };

    Tokenizer.prototype.getBlockCommentToken = function getBlockCommentToken(input) {
        return this.getTokenOnFirstMatch({
            input: input,
            type: _tokenTypes2["default"].BLOCK_COMMENT,
            regex: this.BLOCK_COMMENT_REGEX
        });
    };

    Tokenizer.prototype.getStringToken = function getStringToken(input) {
        return this.getTokenOnFirstMatch({
            input: input,
            type: _tokenTypes2["default"].STRING,
            regex: this.STRING_REGEX
        });
    };

    Tokenizer.prototype.getOpenParenToken = function getOpenParenToken(input) {
        return this.getTokenOnFirstMatch({
            input: input,
            type: _tokenTypes2["default"].OPEN_PAREN,
            regex: this.OPEN_PAREN_REGEX
        });
    };

    Tokenizer.prototype.getCloseParenToken = function getCloseParenToken(input) {
        return this.getTokenOnFirstMatch({
            input: input,
            type: _tokenTypes2["default"].CLOSE_PAREN,
            regex: this.CLOSE_PAREN_REGEX
        });
    };

    Tokenizer.prototype.getPlaceholderToken = function getPlaceholderToken(input) {
        return this.getIdentNamedPlaceholderToken(input) || this.getStringNamedPlaceholderToken(input) || this.getIndexedPlaceholderToken(input);
    };

    Tokenizer.prototype.getIdentNamedPlaceholderToken = function getIdentNamedPlaceholderToken(input) {
        return this.getPlaceholderTokenWithKey({
            input: input,
            regex: this.IDENT_NAMED_PLACEHOLDER_REGEX,
            parseKey: function parseKey(v) {
                return v.slice(1);
            }
        });
    };

    Tokenizer.prototype.getStringNamedPlaceholderToken = function getStringNamedPlaceholderToken(input) {
        var _this = this;

        return this.getPlaceholderTokenWithKey({
            input: input,
            regex: this.STRING_NAMED_PLACEHOLDER_REGEX,
            parseKey: function parseKey(v) {
                return _this.getEscapedPlaceholderKey({ key: v.slice(2, -1), quoteChar: v.slice(-1) });
            }
        });
    };

    Tokenizer.prototype.getIndexedPlaceholderToken = function getIndexedPlaceholderToken(input) {
        return this.getPlaceholderTokenWithKey({
            input: input,
            regex: this.INDEXED_PLACEHOLDER_REGEX,
            parseKey: function parseKey(v) {
                return v.slice(1);
            }
        });
    };

    Tokenizer.prototype.getPlaceholderTokenWithKey = function getPlaceholderTokenWithKey(_ref) {
        var input = _ref.input,
            regex = _ref.regex,
            parseKey = _ref.parseKey;

        var token = this.getTokenOnFirstMatch({ input: input, regex: regex, type: _tokenTypes2["default"].PLACEHOLDER });
        if (token) {
            token.key = parseKey(token.value);
        }
        return token;
    };

    Tokenizer.prototype.getEscapedPlaceholderKey = function getEscapedPlaceholderKey(_ref2) {
        var key = _ref2.key,
            quoteChar = _ref2.quoteChar;

        return key.replace(new RegExp((0, _escapeRegExp2["default"])("\\") + quoteChar, "g"), quoteChar);
    };

    // Decimal, binary, or hex numbers


    Tokenizer.prototype.getNumberToken = function getNumberToken(input) {
        return this.getTokenOnFirstMatch({
            input: input,
            type: _tokenTypes2["default"].NUMBER,
            regex: this.NUMBER_REGEX
        });
    };

    // Punctuation and symbols


    Tokenizer.prototype.getOperatorToken = function getOperatorToken(input) {
        return this.getTokenOnFirstMatch({
            input: input,
            type: _tokenTypes2["default"].OPERATOR,
            regex: this.OPERATOR_REGEX
        });
    };

    Tokenizer.prototype.getReservedWordToken = function getReservedWordToken(input, previousToken) {
        // A reserved word cannot be preceded by a "."
        // this makes it so in "mytable.from", "from" is not considered a reserved word
        if (previousToken && previousToken.value && previousToken.value === ".") {
            return;
        }
        return this.getToplevelReservedToken(input) || this.getNewlineReservedToken(input) || this.getPlainReservedToken(input);
    };

    Tokenizer.prototype.getToplevelReservedToken = function getToplevelReservedToken(input) {
        return this.getTokenOnFirstMatch({
            input: input,
            type: _tokenTypes2["default"].RESERVED_TOPLEVEL,
            regex: this.RESERVED_TOPLEVEL_REGEX
        });
    };

    Tokenizer.prototype.getNewlineReservedToken = function getNewlineReservedToken(input) {
        return this.getTokenOnFirstMatch({
            input: input,
            type: _tokenTypes2["default"].RESERVED_NEWLINE,
            regex: this.RESERVED_NEWLINE_REGEX
        });
    };

    Tokenizer.prototype.getPlainReservedToken = function getPlainReservedToken(input) {
        return this.getTokenOnFirstMatch({
            input: input,
            type: _tokenTypes2["default"].RESERVED,
            regex: this.RESERVED_PLAIN_REGEX
        });
    };

    Tokenizer.prototype.getWordToken = function getWordToken(input) {
        return this.getTokenOnFirstMatch({
            input: input,
            type: _tokenTypes2["default"].WORD,
            regex: this.WORD_REGEX
        });
    };

    Tokenizer.prototype.getTokenOnFirstMatch = function getTokenOnFirstMatch(_ref3) {
        var input = _ref3.input,
            type = _ref3.type,
            regex = _ref3.regex;

        var matches = input.match(regex);

        if (matches) {
            return { type: type, value: matches[1] };
        }
    };

    return Tokenizer;
}();

exports["default"] = Tokenizer;
module.exports = exports["default"];