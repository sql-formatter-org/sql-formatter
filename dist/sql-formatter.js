(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["sqlFormatter"] = factory();
	else
		root["sqlFormatter"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _SqlFormatter = __webpack_require__(13);

	var _SqlFormatter2 = _interopRequireDefault(_SqlFormatter);

	var _PlSqlFormatter = __webpack_require__(35);

	var _PlSqlFormatter2 = _interopRequireDefault(_PlSqlFormatter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	exports["default"] = {
	    /**
	     * Format whitespaces in a query to make it easier to read.
	     *
	     * @param {String} query
	     * @param {Object} cfg
	     *  @param {String} cfg.language Query language, default is Standard SQL
	     *  @param {String} cfg.indent Characters used for indentation, default is "  " (2 spaces)
	     *  @param {Object} cfg.params Collection of params for placeholder replacement
	     * @return {String}
	     */
	    format: function format(query, cfg) {
	        return new _PlSqlFormatter2["default"](cfg).format(query);
	        // cfg = cfg || {};

	        // switch (cfg.language) {
	        //     case "db2":
	        //         return new Db2Formatter(cfg).format(query);
	        //     case "n1ql":
	        //         return new N1qlFormatter(cfg).format(query);
	        //     case "pl/sql":
	        //         return 
	        //     case "sql":
	        //     case undefined:
	        //         return new StandardSqlFormatter(cfg).format(query);
	        //     default:
	        //         throw Error(`Unsupported SQL dialect: ${cfg.language}`);
	        // }
	    }
	};
	module.exports = exports["default"];

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var freeGlobal = __webpack_require__(18);

	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();

	module.exports = root;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(9),
	    getRawTag = __webpack_require__(56),
	    objectToString = __webpack_require__(64);

	/** `Object#toString` result references. */
	var nullTag = '[object Null]',
	    undefinedTag = '[object Undefined]';

	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

	/**
	 * The base implementation of `getTag` without fallbacks for buggy environments.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag(value) {
	  if (value == null) {
	    return value === undefined ? undefinedTag : nullTag;
	  }
	  return (symToStringTag && symToStringTag in Object(value))
	    ? getRawTag(value)
	    : objectToString(value);
	}

	module.exports = baseGetTag;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	var baseIsNative = __webpack_require__(46),
	    getValue = __webpack_require__(58);

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = getValue(object, key);
	  return baseIsNative(value) ? value : undefined;
	}

	module.exports = getNative;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return value != null && typeof value == 'object';
	}

	module.exports = isObjectLike;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;

	module.exports = isArray;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(25),
	    isLength = __webpack_require__(26);

	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength(value.length) && !isFunction(value);
	}

	module.exports = isArrayLike;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return value != null && (type == 'object' || type == 'function');
	}

	module.exports = isObject;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	"use strict";

	exports.__esModule = true;
	/**
	 * Constants for token types
	 */
	exports["default"] = {
	    WHITESPACE: "whitespace", //1
	    WORD: "word", //
	    STRING: "string", //
	    RESERVED: "reserved", //6
	    RESERVED_TOPLEVEL: "reserved-toplevel", //4
	    RESERVED_NEWLINE: "reserved-newline", //5
	    OPERATOR: "operator",
	    OPEN_PAREN: "open-paren", //7
	    CLOSE_PAREN: "close-paren", //8
	    LINE_COMMENT: "line-comment", //2
	    BLOCK_COMMENT: "block-comment", //3
	    NUMBER: "number", //
	    PLACEHOLDER: "placeholder" //9
	};
	module.exports = exports["default"];

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	var root = __webpack_require__(1);

	/** Built-in value references. */
	var Symbol = root.Symbol;

	module.exports = Symbol;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(17);

	/**
	 * Converts `value` to a string. An empty string is returned for `null`
	 * and `undefined` values. The sign of `-0` is preserved.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 * @example
	 *
	 * _.toString(null);
	 * // => ''
	 *
	 * _.toString(-0);
	 * // => '-0'
	 *
	 * _.toString([1, 2, 3]);
	 * // => '1,2,3'
	 */
	function toString(value) {
	  return value == null ? '' : baseToString(value);
	}

	module.exports = toString;


/***/ }),
/* 11 */
/***/ (function(module, exports) {

	"use strict";

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Handles placeholder replacement with given params.
	 */
	var Params = function () {
	    /**
	     * @param {Object} params
	     */
	    function Params(params) {
	        _classCallCheck(this, Params);

	        this.params = params;
	        this.index = 0;
	    }

	    /**
	     * Returns param value that matches given placeholder with param key.
	     * @param {Object} token
	     *   @param {String} token.key Placeholder key
	     *   @param {String} token.value Placeholder value
	     * @return {String} param or token.value when params are missing
	     */


	    Params.prototype.get = function get(_ref) {
	        var key = _ref.key,
	            value = _ref.value;

	        if (!this.params) {
	            return value;
	        }
	        if (key) {
	            return this.params[key];
	        }
	        return this.params[this.index++];
	    };

	    return Params;
	}();

	exports["default"] = Params;
	module.exports = exports["default"];

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _isEmpty = __webpack_require__(71);

	var _isEmpty2 = _interopRequireDefault(_isEmpty);

	var _escapeRegExp = __webpack_require__(70);

	var _escapeRegExp2 = _interopRequireDefault(_escapeRegExp);

	var _tokenTypes = __webpack_require__(8);

	var _tokenTypes2 = _interopRequireDefault(_tokenTypes);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
	        _classCallCheck(this, Tokenizer);

	        this.WHITESPACE_REGEX = /^(\s+)/;
	        this.NUMBER_REGEX = /^((-\s*)?[0-9]+(\.[0-9]+)?|0x[0-9a-fA-F]+|0b[01]+)\b/;
	        this.OPERATOR_REGEX = /^(!=|<>|==|<=|>=|!<|!>|\|\||::|->>|->|~~\*|~~|!~~\*|!~~|~\*|!~\*|!~|:=|.)/;

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
	        var _this = this;

	        return new RegExp("^(" + parens.map(function (p) {
	            return _this.escapeParen(p);
	        }).join("|") + ")", "i");
	    };

	    Tokenizer.prototype.escapeParen = function escapeParen(paren) {
	        if (paren.length === 1) {
	            // A single punctuation character
	            return (0, _escapeRegExp2["default"])(paren);
	        } else {
	            // longer word
	            return "\\b" + paren + "\\b";
	        }
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
	        var _this2 = this;

	        return this.getPlaceholderTokenWithKey({
	            input: input,
	            regex: this.STRING_NAMED_PLACEHOLDER_REGEX,
	            parseKey: function parseKey(v) {
	                return _this2.getEscapedPlaceholderKey({ key: v.slice(2, -1), quoteChar: v.slice(-1) });
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

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _Formatter = __webpack_require__(33);

	var _Formatter2 = _interopRequireDefault(_Formatter);

	var _Tokenizer = __webpack_require__(12);

	var _Tokenizer2 = _interopRequireDefault(_Tokenizer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var reservedWords = ["A", "ACCESSIBLE", "AGENT", "AGGREGATE", "ALL", "ALTER", "ANY", "ARRAY", "AS", "ASC", "AT", "ATTRIBUTE", "AUTHID", "AVG", "BETWEEN", "BFILE_BASE", "BINARY_INTEGER", "BINARY", "BLOB_BASE", "BLOCK", "BODY", "BOOLEAN", "BOTH", "BOUND", "BULK", "BY", "BYTE", "C", "CALL", "CALLING", "CASCADE", "CASE", "CHAR_BASE", "CHAR", "CHARACTER", "CHARSET", "CHARSETFORM", "CHARSETID", "CHECK", "CLOB_BASE", "CLONE", "CLOSE", "CLUSTER", "CLUSTERS", "COALESCE", "COLAUTH", "COLLECT", "COLUMNS", "COMMENT", "COMMIT", "COMMITTED", "COMPILED", "COMPRESS", "CONNECT", "CONSTANT", "CONSTRUCTOR", "CONTEXT", "CONTINUE", "CONVERT", "COUNT", "CRASH", "CREATE", "CREDENTIAL", "CURRENT", "CURRVAL", "CURSOR", "CUSTOMDATUM", "DANGLING", "DATA", "DATE_BASE", "DATE", "DAY", "DECIMAL", "DEFAULT", "DEFINE", "DELETE", "DESC", "DETERMINISTIC", "DIRECTORY", "DISTINCT", "DO", "DOUBLE", "DROP", "DURATION", "ELEMENT", "ELSIF", "EMPTY", "ESCAPE", "EXCEPTIONS", "EXCLUSIVE", "EXECUTE", "EXISTS", "EXIT", "EXTENDS", "EXTERNAL", "EXTRACT", "FALSE", "FETCH", "FINAL", "FIRST", "FIXED", "FLOAT", "FOR", "FORALL", "FORCE", "FROM", "FUNCTION", "GENERAL", "GOTO", "GRANT", "GROUP", "HASH", "HEAP", "HIDDEN", "HOUR", "IDENTIFIED", "IF", "IMMEDIATE", "IN", "INCLUDING", "INDEX", "INDEXES", "INDICATOR", "INDICES", "INFINITE", "INSTANTIABLE", "INT", "INTEGER", "INTERFACE", "INTERVAL", "INTO", "INVALIDATE", "IS", "ISOLATION", "JAVA", "LANGUAGE", "LARGE", "LEADING", "LENGTH", "LEVEL", "LIBRARY", "LIKE", "LIKE2", "LIKE4", "LIKEC", "LIMITED", "LOCAL", "LOCK", "LONG", "MAP", "MAX", "MAXLEN", "MEMBER", "MERGE", "MIN", "MINUS", "MINUTE", "MLSLABEL", "MOD", "MODE", "MONTH", "MULTISET", "NAME", "NAN", "NATIONAL", "NATIVE", "NATURAL", "NATURALN", "NCHAR", "NEW", "NEXTVAL", "NOCOMPRESS", "NOCOPY", "NOT", "NOWAIT", "NULL", "NULLIF", "NUMBER_BASE", "NUMBER", "OBJECT", "OCICOLL", "OCIDATE", "OCIDATETIME", "OCIDURATION", "OCIINTERVAL", "OCILOBLOCATOR", "OCINUMBER", "OCIRAW", "OCIREF", "OCIREFCURSOR", "OCIROWID", "OCISTRING", "OCITYPE", "OF", "OLD", "ON", "ONLY", "OPAQUE", "OPEN", "OPERATOR", "OPTION", "ORACLE", "ORADATA", "ORDER", "ORGANIZATION", "ORLANY", "ORLVARY", "OTHERS", "OUT", "OVERLAPS", "OVERRIDING", "PACKAGE", "PARALLEL_ENABLE", "PARAMETER", "PARAMETERS", "PARENT", "PARTITION", "PASCAL", "PCTFREE", "PIPE", "PIPELINED", "PLS_INTEGER", "PLUGGABLE", "POSITIVE", "POSITIVEN", "PRAGMA", "PRECISION", "PRIOR", "PRIVATE", "PROCEDURE", "PUBLIC", "RAISE", "RANGE", "RAW", "READ", "REAL", "RECORD", "REF", "REFERENCE", "RELEASE", "RELIES_ON", "REM", "REMAINDER", "RENAME", "RESOURCE", "RESULT_CACHE", "RESULT", "RETURN", "RETURNING", "REVERSE", "REVOKE", "ROLLBACK", "ROW", "ROWID", "ROWNUM", "ROWTYPE", "SAMPLE", "SAVE", "SAVEPOINT", "SB1", "SB2", "SB4", "SECOND", "SEGMENT", "SELF", "SEPARATE", "SEQUENCE", "SERIALIZABLE", "SHARE", "SHORT", "SIZE_T", "SIZE", "SMALLINT", "SOME", "SPACE", "SPARSE", "SQL", "SQLCODE", "SQLDATA", "SQLERRM", "SQLNAME", "SQLSTATE", "STANDARD", "START", "STATIC", "STDDEV", "STORED", "STRING", "STRUCT", "STYLE", "SUBMULTISET", "SUBPARTITION", "SUBSTITUTABLE", "SUBTYPE", "SUCCESSFUL", "SUM", "SYNONYM", "SYSDATE", "TABAUTH", "TABLE", "TDO", "THE", "THEN", "TIME", "TIMESTAMP", "TIMEZONE_ABBR", "TIMEZONE_HOUR", "TIMEZONE_MINUTE", "TIMEZONE_REGION", "TO", "TRAILING", "TRANSACTION", "TRANSACTIONAL", "TRIGGER", "TRUE", "TRUSTED", "TYPE", "UB1", "UB2", "UB4", "UID", "UNDER", "UNIQUE", "UNPLUG", "UNSIGNED", "UNTRUSTED", "USE", "USER", "USING", "VALIDATE", "VALIST", "VALUE", "VARCHAR", "VARCHAR2", "VARIABLE", "VARIANCE", "VARRAY", "VARYING", "VIEW", "VIEWS", "VOID", "WHENEVER", "WHILE", "WITH", "WORK", "WRAPPED", "WRITE", "YEAR", "SELECT", "ZONE", "AND", "OR"];

	var reservedToplevelWords = ["ADD", "ALTER COLUMN", "ALTER TABLE",
	// "BEGIN",
	"CONNECT BY", "USING", "DECLARE", "DELETE FROM", "DELETE",
	// "END",
	"MERGE", "EXCEPT", "EXCEPTION", "FETCH FIRST", "FROM", "GROUP BY", "HAVING", "INSERT INTO", "INSERT", "INTERSECT", "LIMIT", "LOOP", "MODIFY", "CROSS JOIN", "OUTER JOIN", "RIGHT JOIN", "RIGHT OUTER JOIN", "INNER JOIN", "LEFT JOIN", "LEFT OUTER JOIN", "ORDER BY",
	// "ORDER",
	"SELECT", "SET CURRENT SCHEMA", "SET SCHEMA",
	// "SET", 
	"START WITH", "UNION ALL", "UNION",
	// "UPDATE",
	"VALUES", "WHERE"];

	var reservedNewlineWords = [
	// "AND",
	"CROSS APPLY",
	// "CROSS JOIN", "OUTER JOIN","RIGHT JOIN", "RIGHT OUTER JOIN", "INNER JOIN", "LEFT JOIN", "LEFT OUTER JOIN",
	"ELSE", "END",
	// "INNER JOIN", "LEFT JOIN", "LEFT OUTER JOIN",
	"JOIN",
	// "LEFT JOIN", "LEFT OUTER JOIN",
	// "OR", 
	"OUTER APPLY",
	// "OUTER JOIN","RIGHT JOIN", "RIGHT OUTER JOIN", "INNER JOIN", "LEFT JOIN", "LEFT OUTER JOIN",
	"WHEN", "UNION"];

	var tokenizer = void 0;

	var PlSqlFormatter = function () {
	    /**
	     * @param {Object} cfg Different set of configurations
	     */
	    function PlSqlFormatter(cfg) {
	        _classCallCheck(this, PlSqlFormatter);

	        this.cfg = cfg;
	    }

	    /**
	     * Format the whitespace in a PL/SQL string to make it easier to read
	     *
	     * @param {String} query The PL/SQL string
	     * @return {String} formatted string
	     */


	    PlSqlFormatter.prototype.format = function format(query) {
	        if (!tokenizer) {
	            tokenizer = new _Tokenizer2["default"]({
	                reservedWords: reservedWords,
	                reservedToplevelWords: reservedToplevelWords,
	                reservedNewlineWords: reservedNewlineWords,
	                stringTypes: ["\"\"", "N''", "''", "``"],
	                openParens: ["(", "CASE", "BEGIN"],
	                closeParens: [")", "END"],
	                indexedPlaceholderTypes: ["?"],
	                namedPlaceholderTypes: [":"],
	                lineCommentTypes: ["--"],
	                specialWordChars: ["_", "$", "#", ".", "@"]
	            });
	        }
	        return new _Formatter2["default"](this.cfg, tokenizer, reservedWords).format(query);
	    };

	    PlSqlFormatter.prototype.getFormatArray = function getFormatArray(query) {
	        if (!tokenizer) {
	            tokenizer = new _Tokenizer2["default"]({
	                reservedWords: reservedWords,
	                reservedToplevelWords: reservedToplevelWords,
	                reservedNewlineWords: reservedNewlineWords,
	                stringTypes: ["\"\"", "N''", "''", "``"],
	                openParens: ["(", "CASE", "BEGIN"],
	                closeParens: [")", "END"],
	                indexedPlaceholderTypes: ["?"],
	                namedPlaceholderTypes: [":"],
	                lineCommentTypes: ["--"],
	                specialWordChars: ["_", "$", "#", ".", "@"]
	            });
	        }
	        return new _Formatter2["default"](this.cfg, tokenizer, reservedWords).getFormatArray(query);
	    };

	    return PlSqlFormatter;
	}();

	exports["default"] = PlSqlFormatter;
	module.exports = exports["default"];

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	/**
	 * A specialized version of `_.map` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 */
	function arrayMap(array, iteratee) {
	  var index = -1,
	      length = array == null ? 0 : array.length,
	      result = Array(length);

	  while (++index < length) {
	    result[index] = iteratee(array[index], index, array);
	  }
	  return result;
	}

	module.exports = arrayMap;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	var baseFindIndex = __webpack_require__(43),
	    baseIsNaN = __webpack_require__(45),
	    strictIndexOf = __webpack_require__(66);

	/**
	 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseIndexOf(array, value, fromIndex) {
	  return value === value
	    ? strictIndexOf(array, value, fromIndex)
	    : baseFindIndex(array, baseIsNaN, fromIndex);
	}

	module.exports = baseIndexOf;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	var isPrototype = __webpack_require__(20),
	    nativeKeys = __webpack_require__(62);

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeys(object) {
	  if (!isPrototype(object)) {
	    return nativeKeys(object);
	  }
	  var result = [];
	  for (var key in Object(object)) {
	    if (hasOwnProperty.call(object, key) && key != 'constructor') {
	      result.push(key);
	    }
	  }
	  return result;
	}

	module.exports = baseKeys;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(9),
	    arrayMap = __webpack_require__(14),
	    isArray = __webpack_require__(5),
	    isSymbol = __webpack_require__(27);

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolToString = symbolProto ? symbolProto.toString : undefined;

	/**
	 * The base implementation of `_.toString` which doesn't convert nullish
	 * values to empty strings.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  // Exit early for strings to avoid a performance hit in some environments.
	  if (typeof value == 'string') {
	    return value;
	  }
	  if (isArray(value)) {
	    // Recursively convert values (susceptible to call stack limits).
	    return arrayMap(value, baseToString) + '';
	  }
	  if (isSymbol(value)) {
	    return symbolToString ? symbolToString.call(value) : '';
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}

	module.exports = baseToString;


/***/ }),
/* 18 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

	module.exports = freeGlobal;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  var type = typeof value;
	  length = length == null ? MAX_SAFE_INTEGER : length;

	  return !!length &&
	    (type == 'number' ||
	      (type != 'symbol' && reIsUint.test(value))) &&
	        (value > -1 && value % 1 == 0 && value < length);
	}

	module.exports = isIndex;


/***/ }),
/* 20 */
/***/ (function(module, exports) {

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Checks if `value` is likely a prototype object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	 */
	function isPrototype(value) {
	  var Ctor = value && value.constructor,
	      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

	  return value === proto;
	}

	module.exports = isPrototype;


/***/ }),
/* 21 */
/***/ (function(module, exports) {

	/** Used for built-in method references. */
	var funcProto = Function.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to convert.
	 * @returns {string} Returns the source code.
	 */
	function toSource(func) {
	  if (func != null) {
	    try {
	      return funcToString.call(func);
	    } catch (e) {}
	    try {
	      return (func + '');
	    } catch (e) {}
	  }
	  return '';
	}

	module.exports = toSource;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	var baseIndexOf = __webpack_require__(15),
	    isArrayLike = __webpack_require__(6),
	    isString = __webpack_require__(72),
	    toInteger = __webpack_require__(30),
	    values = __webpack_require__(77);

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;

	/**
	 * Checks if `value` is in `collection`. If `collection` is a string, it's
	 * checked for a substring of `value`, otherwise
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * is used for equality comparisons. If `fromIndex` is negative, it's used as
	 * the offset from the end of `collection`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Collection
	 * @param {Array|Object|string} collection The collection to inspect.
	 * @param {*} value The value to search for.
	 * @param {number} [fromIndex=0] The index to search from.
	 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
	 * @returns {boolean} Returns `true` if `value` is found, else `false`.
	 * @example
	 *
	 * _.includes([1, 2, 3], 1);
	 * // => true
	 *
	 * _.includes([1, 2, 3], 1, 2);
	 * // => false
	 *
	 * _.includes({ 'a': 1, 'b': 2 }, 1);
	 * // => true
	 *
	 * _.includes('abcd', 'bc');
	 * // => true
	 */
	function includes(collection, value, fromIndex, guard) {
	  collection = isArrayLike(collection) ? collection : values(collection);
	  fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

	  var length = collection.length;
	  if (fromIndex < 0) {
	    fromIndex = nativeMax(length + fromIndex, 0);
	  }
	  return isString(collection)
	    ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
	    : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
	}

	module.exports = includes;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	var baseIsArguments = __webpack_require__(44),
	    isObjectLike = __webpack_require__(4);

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Built-in value references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;

	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
	  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
	    !propertyIsEnumerable.call(value, 'callee');
	};

	module.exports = isArguments;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(1),
	    stubFalse = __webpack_require__(74);

	/** Detect free variable `exports`. */
	var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Built-in value references. */
	var Buffer = moduleExports ? root.Buffer : undefined;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

	/**
	 * Checks if `value` is a buffer.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.3.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
	 * @example
	 *
	 * _.isBuffer(new Buffer(2));
	 * // => true
	 *
	 * _.isBuffer(new Uint8Array(2));
	 * // => false
	 */
	var isBuffer = nativeIsBuffer || stubFalse;

	module.exports = isBuffer;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(32)(module)))

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(2),
	    isObject = __webpack_require__(7);

	/** `Object#toString` result references. */
	var asyncTag = '[object AsyncFunction]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    proxyTag = '[object Proxy]';

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  if (!isObject(value)) {
	    return false;
	  }
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 9 which returns 'object' for typed arrays and other constructors.
	  var tag = baseGetTag(value);
	  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
	}

	module.exports = isFunction;


/***/ }),
/* 26 */
/***/ (function(module, exports) {

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	module.exports = isLength;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(2),
	    isObjectLike = __webpack_require__(4);

	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';

	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike(value) && baseGetTag(value) == symbolTag);
	}

	module.exports = isSymbol;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	var baseIsTypedArray = __webpack_require__(47),
	    baseUnary = __webpack_require__(51),
	    nodeUtil = __webpack_require__(63);

	/* Node.js helper references. */
	var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

	module.exports = isTypedArray;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	var baseRepeat = __webpack_require__(48),
	    isIterateeCall = __webpack_require__(60),
	    toInteger = __webpack_require__(30),
	    toString = __webpack_require__(10);

	/**
	 * Repeats the given string `n` times.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category String
	 * @param {string} [string=''] The string to repeat.
	 * @param {number} [n=1] The number of times to repeat the string.
	 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
	 * @returns {string} Returns the repeated string.
	 * @example
	 *
	 * _.repeat('*', 3);
	 * // => '***'
	 *
	 * _.repeat('abc', 2);
	 * // => 'abcabc'
	 *
	 * _.repeat('abc', 0);
	 * // => ''
	 */
	function repeat(string, n, guard) {
	  if ((guard ? isIterateeCall(string, n, guard) : n === undefined)) {
	    n = 1;
	  } else {
	    n = toInteger(n);
	  }
	  return baseRepeat(toString(string), n);
	}

	module.exports = repeat;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	var toFinite = __webpack_require__(75);

	/**
	 * Converts `value` to an integer.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {number} Returns the converted integer.
	 * @example
	 *
	 * _.toInteger(3.2);
	 * // => 3
	 *
	 * _.toInteger(Number.MIN_VALUE);
	 * // => 0
	 *
	 * _.toInteger(Infinity);
	 * // => 1.7976931348623157e+308
	 *
	 * _.toInteger('3.2');
	 * // => 3
	 */
	function toInteger(value) {
	  var result = toFinite(value),
	      remainder = result % 1;

	  return result === result ? (remainder ? result - remainder : result) : 0;
	}

	module.exports = toInteger;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(17),
	    castSlice = __webpack_require__(53),
	    charsEndIndex = __webpack_require__(54),
	    stringToArray = __webpack_require__(67),
	    toString = __webpack_require__(10);

	/** Used to match leading and trailing whitespace. */
	var reTrimEnd = /\s+$/;

	/**
	 * Removes trailing whitespace or specified characters from `string`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category String
	 * @param {string} [string=''] The string to trim.
	 * @param {string} [chars=whitespace] The characters to trim.
	 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
	 * @returns {string} Returns the trimmed string.
	 * @example
	 *
	 * _.trimEnd('  abc  ');
	 * // => '  abc'
	 *
	 * _.trimEnd('-_-abc-_-', '_-');
	 * // => '-_-abc'
	 */
	function trimEnd(string, chars, guard) {
	  string = toString(string);
	  if (string && (guard || chars === undefined)) {
	    return string.replace(reTrimEnd, '');
	  }
	  if (!string || !(chars = baseToString(chars))) {
	    return string;
	  }
	  var strSymbols = stringToArray(string),
	      end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;

	  return castSlice(strSymbols, 0, end).join('');
	}

	module.exports = trimEnd;


/***/ }),
/* 32 */
/***/ (function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _includes = __webpack_require__(22);

	var _includes2 = _interopRequireDefault(_includes);

	var _trimEnd = __webpack_require__(31);

	var _trimEnd2 = _interopRequireDefault(_trimEnd);

	var _tokenTypes = __webpack_require__(8);

	var _tokenTypes2 = _interopRequireDefault(_tokenTypes);

	var _Params = __webpack_require__(11);

	var _Params2 = _interopRequireDefault(_Params);

	var _repeat = __webpack_require__(29);

	var _repeat2 = _interopRequireDefault(_repeat);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Formatter = function () {
	    function Formatter(cfg, tokenizer, reservedWords) {
	        _classCallCheck(this, Formatter);

	        this.cfg = cfg || {};
	        this.params = new _Params2["default"](this.cfg.params);
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

	    Formatter.prototype.format = function format(query) {
	        this.tokens = this.tokenizer.tokenize(query);
	        var formattedQuery = this.formatQuery();

	        return this.lines.join("\n").trim();
	    };

	    Formatter.prototype.getFormatArray = function getFormatArray(query) {
	        this.tokens = this.tokenizer.tokenize(query);
	        this.formatQuery();
	        return this.lines;
	    };

	    Formatter.prototype.formatQuery = function formatQuery() {
	        for (var i = 0; i < this.tokens.length; i++) {
	            var token = this.tokens[i];
	            token.value = this.formatTextCase(token);
	            if (token.type === _tokenTypes2["default"].WHITESPACE) {
	                if (!this.getLastString().endsWith(" ") && !this.getLastString().endsWith("(")) {
	                    this.lines[this.lastIndex()] += " ";
	                }
	            } else if (token.type === _tokenTypes2["default"].LINE_COMMENT) {
	                this.formatLineComment(token);
	            } else if (token.type === _tokenTypes2["default"].BLOCK_COMMENT) {
	                this.formatBlockComment(token);
	            } else if (token.type === _tokenTypes2["default"].RESERVED_TOPLEVEL) {
	                this.formatTopLeveleReservedWord(token);
	                this.previousReservedWord = token;
	            } else if (token.type === _tokenTypes2["default"].RESERVED_NEWLINE) {
	                this.formatNewlineReservedWord(token);
	                this.previousReservedWord = token;
	            } else if (this.logicalOperators.includes(token.value)) {
	                this.formatLogicalOperators(token);
	            } else if (token.type === _tokenTypes2["default"].RESERVED) {
	                this.formatWithSpaces(token);
	                this.previousReservedWord = token;
	            } else if (token.type === _tokenTypes2["default"].OPEN_PAREN) {
	                this.formatOpeningParentheses(token);
	            } else if (token.type === _tokenTypes2["default"].CLOSE_PAREN) {
	                this.formatClosingParentheses(token);
	            } else if (token.type === _tokenTypes2["default"].PLACEHOLDER) {
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
	    };

	    Formatter.prototype.formatLogicalOperators = function formatLogicalOperators(token) {
	        this.trimEndLastString();
	        var last = this.getLastString();
	        var words = last.trim().split(" ");
	        var indent = this.getLogicalIndent(token.value, words[0]);
	        if (this.logicalOperators.includes(words[0]) && words[1].startsWith("(") && !words[words.length - 1].endsWith(")")) {
	            this.lines[this.lastIndex()] += " ";
	        } else if (last.includes(" on ") && !last.includes(" join ")) {
	            var boolExps = last.split(/ and | or | xor /);
	            if (boolExps.length > 3) {
	                var _indent = last.indexOf("on ") + 4;
	                this.lines[this.lastIndex()] = boolExps[0];
	                last = last.substring(last.indexOf(boolExps[0]) + boolExps[0].length);
	                for (var i = 1; i < boolExps.length; i++) {
	                    this.lines.push((0, _repeat2["default"])(" ", _indent));
	                    var bool = last.trim().split(" ")[0];
	                    if (bool.length < 3) {
	                        this.lines[this.lastIndex()] += (0, _repeat2["default"])(" ", 3 - bool.length);
	                    }
	                    this.lines[this.lastIndex()] += bool + " " + boolExps[i];
	                    last = last.substring(last.indexOf(boolExps[i]) + boolExps[i].length);
	                }
	                this.lines.push((0, _repeat2["default"])(" ", _indent));
	            } else {
	                this.lines[this.lastIndex()] += " ";
	            }
	        } else if (last.trim() != "" && indent > 0) {
	            this.lines.push((0, _repeat2["default"])(" ", indent));
	        }
	        this.lines[this.lastIndex()] += token.value;
	    };

	    Formatter.prototype.getLogicalIndent = function getLogicalIndent(operator, first) {
	        var indent = 0;
	        if (this.logicalOperators.includes(first)) {
	            indent = this.getLastString().length - this.getLastString().trim().length;
	            return indent + first.length - operator.length;
	        } else if (this.getLastString().includes(" when ")) {
	            return this.getLastString().indexOf("when") + 4 - operator.length;
	        } else if (this.getLastString().includes(" on(") || this.getLastString().includes(" on ")) {
	            indent = this.getLastString().indexOf(" on(");
	            if (indent == -1) {
	                indent = this.getLastString().indexOf(" on ");
	            }
	            return indent + 3 - operator.length;
	        } else {
	            this.addNewLine("right", operator);
	            return -1;
	        }
	    };

	    Formatter.prototype.formatComma = function formatComma(token) {
	        var last = this.getLastString();
	        if (this.inlineReservedWord.includes(last.trim().split(" ")[0])) {
	            this.formatCommaInlineReservedWord(last, token);
	        } else {
	            this.trimEndLastString();
	            this.lines[this.lastIndex()] += token.value;
	            this.addNewLine("left", token.value);
	        }
	    };

	    Formatter.prototype.formatCommaInlineReservedWord = function formatCommaInlineReservedWord(last, token) {
	        var subLines = last.split(",");
	        if (last.split(",").length > 2) {
	            this.lines[this.lastIndex()] = (0, _trimEnd2["default"])(subLines[0]) + ",";
	            this.indents[this.indents.length - 1].indent += 1;
	            this.indents[this.indents.length - 1].token.value = "order by";
	            this.addNewLine("left", ",");
	            for (var i = 1; i < subLines.length; i++) {
	                this.lines[this.lastIndex()] += subLines[i].trim() + ",";
	                this.addNewLine("left", ",");
	            }
	        } else {
	            this.trimEndLastString();
	            this.lines[this.lastIndex()] += token.value;
	        }
	    };

	    Formatter.prototype.formatTopLeveleReservedWord = function formatTopLeveleReservedWord(token) {
	        if (this.startBlock.includes(token.value.split(" ")[0])) {
	            if (this.getLastString().includes("union")) {
	                this.indents.pop;
	                this.addNewLine("right", token.value);
	            } else if (this.getLastString().trim() != "" && this.getLastString().trim().endsWith(")")) {
	                this.addNewLine("right", token.value);
	            }
	            this.indents.push({ token: token, indent: this.getLastString().length });
	        } else {
	            this.addNewLine("right", token.value);
	        }
	        this.lines[this.lastIndex()] += token.value;
	    };

	    Formatter.prototype.formatTextCase = function formatTextCase(token) {
	        if (token.value.match("^'.*'$|^util.*|^pkg_.*") != null || token.type === _tokenTypes2["default"].BLOCK_COMMENT || token.type === _tokenTypes2["default"].LINE_COMMENT) {
	            return token.value;
	        } else {
	            return token.value.toLowerCase();
	        }
	    };

	    Formatter.prototype.addNewLine = function addNewLine(align, word) {
	        if (this.getLastString().trim() == ")") {
	            this.lines.pop();
	            this.lines[this.lastIndex()] += ")";
	        } else {
	            this.trimEndLastString();
	        }
	        var last = this.indents[this.indents.length - 1];
	        if (last == undefined) {
	            this.lines.push("");
	            return;
	        }
	        var indent = last.indent;
	        if (align == "right") {
	            var dif = last.token.value.split(" ")[0].trim().length - word.split(" ")[0].trim().length;
	            if (dif < 0) {
	                dif = 0;
	            }
	            if (word == ")") {
	                dif = -1;
	            }
	            indent += dif;
	        } else {
	            indent += last.token.value.length + 1;
	        }
	        if (this.getLastString().trim() == "") {
	            this.lines[this.lastIndex()] = (0, _repeat2["default"])(" ", indent);
	        } else {
	            this.lines.push((0, _repeat2["default"])(" ", indent));
	        }
	    };

	    Formatter.prototype.formatBlockComment = function formatBlockComment(token) {
	        this.resolveAddLineInCommentsBlock(token);
	        var indent = this.getLastString().length + 2;
	        var comment = token.value;
	        var commentsLine = comment.split("\n");
	        comment = commentsLine[0];
	        for (var i = 1; i < commentsLine.length; i++) {
	            comment += "\n" + (0, _repeat2["default"])(" ", indent) + commentsLine[i];
	        }
	        this.lines[this.lastIndex()] += comment;
	        this.addNewLine("left", token.value);
	    };

	    Formatter.prototype.resolveAddLineInCommentsBlock = function resolveAddLineInCommentsBlock(token) {
	        var substing = this.getLastString().trim();
	        var words = substing.split(/\(|\)| /);
	        var last = words[words.length - 1];
	        if (!this.reservedWords.includes(last.toUpperCase()) || last.endsWith(";")) {
	            this.addNewLine("left", token.value);
	        }
	    };

	    Formatter.prototype.formatLineComment = function formatLineComment(token) {
	        var before = this.getLastString();
	        this.lines[this.lastIndex()] += token.value;
	        this.addNewLine("right", "");
	        if (before.trim().endsWith("then")) {
	            this.lines[this.lastIndex()] += (0, _repeat2["default"])(" ", 6);
	        }
	    };

	    Formatter.prototype.formatNewlineReservedWord = function formatNewlineReservedWord(token) {
	        if (this.getLastString().trim().split(" ").length > 1 || this.getLastString().trim() == ")") {
	            this.addNewLine("left", token.value);
	        }
	        this.lines[this.lastIndex()] += token.value;
	    };

	    Formatter.prototype.formatOpeningParentheses = function formatOpeningParentheses(token) {
	        if (token.value != "(") {
	            this.addNewLine("left", token.value);
	        } else if (!this.getLastString().endsWith(" ")) {
	            this.lines[this.lastIndex()] += " ";
	        }
	        this.indents.push({ token: token, indent: this.getLastString().length });
	        this.lines[this.lastIndex()] += token.value;
	    };

	    Formatter.prototype.formatClosingParentheses = function formatClosingParentheses(token) {
	        if (token.value == ")") {
	            this.trimEndLastString();
	            if (this.getLastString().match(/\)/) != null) {
	                this.addNewLine("right", token.value);
	            }
	            this.checkCloseBkt();
	        } else {
	            this.addNewLine("right", token.value);
	        }
	        this.indents.pop();
	        this.lines[this.lastIndex()] += token.value;
	    };

	    Formatter.prototype.checkCloseBkt = function checkCloseBkt() {
	        var bktCount = 1;
	        var substring = "";
	        var startIndex = 0;
	        var start = 0;
	        for (var i = this.lastIndex(); i >= 0; i--) {
	            var line = this.lines[i];
	            for (var j = line.length - 1; j >= 0; j--) {
	                if (line[j] == ")") {
	                    bktCount++;
	                } else if (line[j] == "(") {
	                    bktCount--;
	                }
	                if (bktCount == 0) {
	                    start = j;
	                    substring = line.substring(start);
	                    for (var k = i + 1; k < this.lines.length; k++) {
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
	        var first = substring.trim().split(" ")[0].replace(/\(/, "").trim();
	        if (this.startBlock.includes(first)) {
	            this.indents.pop();
	        } else {
	            if (!this.reservedWords.includes(first) && substring.match(/.* (and|or|xor|not) .*/) == null) {
	                var subLines = substring.split("\n");
	                substring = "";
	                for (var _i = 0; _i < subLines.length; _i++) {
	                    substring += subLines[_i].trim() + " ";
	                }
	                this.lines[startIndex] = (0, _trimEnd2["default"])(this.lines[startIndex].substring(0, start) + substring);
	                var length = this.lines.length;
	                for (var _i2 = startIndex + 1; _i2 < length; _i2++) {
	                    this.lines.pop();
	                }
	            }
	        }
	    };

	    Formatter.prototype.formatPlaceholder = function formatPlaceholder(token) {
	        this.lines[this.lastIndex()] += this.params.get(token) + " ";
	    };

	    Formatter.prototype.formatWithSpaceAfter = function formatWithSpaceAfter(token) {
	        this.trimTrailingWhitespace();
	        this.lines[this.lastIndex()] += token.value + " ";
	    };

	    Formatter.prototype.formatWithoutSpaces = function formatWithoutSpaces(token) {
	        this.trimTrailingWhitespace();
	        this.lines[this.lastIndex()] += token.value;
	    };

	    Formatter.prototype.formatWithSpaces = function formatWithSpaces(token) {
	        if (token.value == "on" && !this.getLastString().includes(" join ")) {
	            this.addNewLine("right", token.value);
	        }
	        if (!token.value.endsWith(".")) {
	            this.lines[this.lastIndex()] += token.value + " ";
	        } else {
	            this.lines[this.lastIndex()] += token.value;
	        }
	    };

	    Formatter.prototype.formatQuerySeparator = function formatQuerySeparator(token) {
	        this.indents.pop();
	        this.trimTrailingWhitespace();
	        this.lines[this.lastIndex()] += token.value;
	        this.addNewLine("left", token.value);
	    };

	    Formatter.prototype.trimTrailingWhitespace = function trimTrailingWhitespace() {
	        this.trimEndLastString();
	        if (this.previousNonWhitespaceToken.type === _tokenTypes2["default"].LINE_COMMENT) {
	            this.addNewLine("left", "");
	        }
	    };

	    Formatter.prototype.trimEndLastString = function trimEndLastString() {
	        this.lines[this.lastIndex()] = (0, _trimEnd2["default"])(this.getLastString());
	    };

	    Formatter.prototype.previousNonWhitespaceToken = function previousNonWhitespaceToken() {
	        var n = 1;
	        while (this.previousToken(n).type === _tokenTypes2["default"].WHITESPACE) {
	            n++;
	        }
	        return this.previousToken(n);
	    };

	    Formatter.prototype.previousToken = function previousToken() {
	        var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

	        return this.tokens[this.index - offset] || {};
	    };

	    Formatter.prototype.lastIndex = function lastIndex() {
	        return this.lines.length - 1;
	    };

	    Formatter.prototype.getLastString = function getLastString() {
	        return this.lines[this.lastIndex()];
	    };

	    return Formatter;
	}();

	exports["default"] = Formatter;
	module.exports = exports["default"];

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _includes = __webpack_require__(22);

	var _includes2 = _interopRequireDefault(_includes);

	var _trimEnd = __webpack_require__(31);

	var _trimEnd2 = _interopRequireDefault(_trimEnd);

	var _tokenTypes = __webpack_require__(8);

	var _tokenTypes2 = _interopRequireDefault(_tokenTypes);

	var _Params = __webpack_require__(11);

	var _Params2 = _interopRequireDefault(_Params);

	var _repeat = __webpack_require__(29);

	var _repeat2 = _interopRequireDefault(_repeat);

	var _SqlFormatter = __webpack_require__(13);

	var _SqlFormatter2 = _interopRequireDefault(_SqlFormatter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var NewFormatter = function () {
	    function NewFormatter(cfg, tokenizer, reservedWords, openParens) {
	        _classCallCheck(this, NewFormatter);

	        this.indentCount = 0;
	        this.cfg = cfg || {};
	        this.params = new _Params2["default"](this.cfg.params);
	        this.tokenizer = tokenizer;
	        this.tokens = [];
	        this.reservedWords = reservedWords;
	        this.withoutSpaces = [".", "%", "(", ")"];
	        this.lines = [""];
	        this.indent = "    ";
	        this.openParens = openParens;
	        this.indentStartBlock = -1;
	    }

	    NewFormatter.prototype.format = function format(query) {
	        this.tokens = this.tokenizer.tokenize(query);
	        var formattedQuery = this.formatQuery();

	        return formattedQuery.trim();
	    };

	    NewFormatter.prototype.formatQuery = function formatQuery() {
	        for (var i = 0; i < this.tokens.length; i++) {
	            var token = this.tokens[i];
	            token.value = this.formatTextCase(token);
	            if (token.type === _tokenTypes2["default"].WHITESPACE) {
	                if (!this.getLastString().endsWith(" ") && !this.getLastString().endsWith("(")) {
	                    this.lines[this.lastIndex()] += " ";
	                }
	            } else if (token.type === _tokenTypes2["default"].LINE_COMMENT) {
	                this.formatLineComment(token);
	            } else if (token.type === _tokenTypes2["default"].BLOCK_COMMENT) {
	                this.formatBlockComment(token);
	            } else if (token.type === _tokenTypes2["default"].RESERVED_TOPLEVEL) {
	                this.formatTopLeveleReservedWord(token);
	            } else if (token.type === _tokenTypes2["default"].RESERVED_NEWLINE) {
	                //new line token = start sql query
	                i = this.formatSqlQuery(i);
	            } else if (token.type === _tokenTypes2["default"].OPEN_PAREN) {
	                this.formatOpeningParentheses(token, i);
	            } else if (token.type === _tokenTypes2["default"].CLOSE_PAREN) {
	                this.formatClosingParentheses(token, i);
	            } else if (token.type === _tokenTypes2["default"].PLACEHOLDER) {
	                this.formatPlaceholder(token);
	            } else if (token.value === ",") {
	                this.formatComma(token);
	            } else if (token.value === ":") {
	                this.formatWithSpaceAfter(token);
	            } else if (this.withoutSpaces.includes(token.value)) {
	                this.formatWithoutSpaces(token);
	            } else if (token.value === ";") {
	                this.formatQuerySeparator(token);
	            } else if (token.value == "exception") {
	                this.formatException(token);
	            } else if (token.value == "as" || token.value == "is") {
	                this.formatAsIs(token);
	            } else {
	                this.formatWithSpaces(token);
	            };
	        }
	        return this.lines.join("\n").trim();
	    };

	    NewFormatter.prototype.formatException = function formatException(token) {
	        var idx = this.lastIndex() - 1;
	        if (this.lines[idx].trim().endsWith(";")) {
	            if (this.getLastString().trim() != "") {
	                this.lines[this.lastIndex()] += token.value;
	            } else {
	                this.lines.pop();
	                this.addNewLine(this.indentCount - 1);
	                this.lines[this.lastIndex()] += token.value;
	            }
	        } else {
	            this.lines[this.lastIndex()] += token.value;
	        }
	    };

	    NewFormatter.prototype.formatTextCase = function formatTextCase(token) {
	        if (token.value.match("^'.*'$|^util.*|^pkg_.*") != null || token.type === _tokenTypes2["default"].BLOCK_COMMENT || token.type === _tokenTypes2["default"].LINE_COMMENT) {
	            return token.value;
	        } else {
	            return token.value.toLowerCase();
	        }
	    };

	    NewFormatter.prototype.formatComma = function formatComma(token) {
	        var line = this.getLastString();
	        var startBkt = line.indexOf("(");
	        var indent = this.indentCount + 1;
	        if (line.length > 100) {
	            this.lines[this.lastIndex()] = line.substring(0, startBkt + 1);
	            line = line.substring(startBkt + 1);
	            var subLines = line.split(",");
	            this.addNewLine(indent);
	            for (var i = 0; i < subLines.length; i++) {
	                var subLine = subLines[i].trim();
	                if (subLines[i].includes("'")) {
	                    var match = subLines[i].match(/\'/);
	                    subLine = "";
	                    while (match.length % 2 != 0 && i < subLines.length) {
	                        subLine += subLines[i] + ",";
	                        i++;
	                    }
	                    if (subLine == "") {
	                        subLine = subLines[i];
	                    }
	                }
	                if (subLine.includes("(") && !subLine.includes(")")) {
	                    while (i < subLines.length - 1 && !subLines.includes(")")) {
	                        i++;
	                        subLine += ", " + subLines[i];
	                    }
	                }
	                this.lines[this.lastIndex()] += (0, _trimEnd2["default"])(subLine) + ",";
	                this.addNewLine(indent);
	            }
	        } else if (startBkt < 0) {
	            this.lines[this.lastIndex()] = (0, _trimEnd2["default"])(this.getLastString()) + token.value;
	            this.addNewLine(indent);
	        } else {
	            this.lines[this.lastIndex()] = (0, _trimEnd2["default"])(this.getLastString()) + token.value;
	        }
	    };

	    NewFormatter.prototype.formatPlaceholder = function formatPlaceholder(token) {
	        this.lines[this.lastIndex()] += " ";
	    };

	    NewFormatter.prototype.formatWithSpaceAfter = function formatWithSpaceAfter(token) {
	        this.lines[this.lastIndex()] = (0, _trimEnd2["default"])(this.getLastString()) + token.value + " ";
	    };

	    NewFormatter.prototype.formatAsIs = function formatAsIs(token) {
	        var startComment = false;
	        var bktCount = 0;
	        var substring = "";
	        for (var i = this.lastIndex(); i >= 0; i--) {
	            var line = this.lines[i];
	            if (startComment) {
	                if (line.includes("/*")) {
	                    startComment = false;
	                } else {
	                    continue;
	                }
	            } else {
	                if (line.includes("*/")) {
	                    startComment = true;
	                    continue;
	                }
	                if (line.trim() == "") {
	                    continue;
	                }
	                if (line.includes(")")) {
	                    substring = this.getBktSubstring(i) + substring;
	                    break;
	                } else {
	                    substring = line + substring;
	                    break;
	                }
	            }
	        }
	        var first = this.getFirstWord(substring);
	        if (first == "create") {
	            console.log(this.getLastString());
	            this.addNewLine(this.indentCount - 1);
	            console.log(this.getLastString());
	            this.lines[this.lastIndex()] += token.value;
	            console.log(this.getLastString());
	            this.addNewLine(this.indentCount);
	        } else if (first == "cursor") {
	            this.lines[this.lastIndex] += token.value;
	            this.addNewLine(this.indentCount);
	        } else if (this.openParens.includes(first.toUpperCase()) || this.getLastString().includes("return") && !this.getLastString().endsWith(";")) {
	            if (this.getLastString().includes("return") && !this.getLastString().endsWith(";")) {
	                this.indentCount++;
	            }
	            this.addNewLine(this.indentCount - 1);
	            this.lines[this.lastIndex()] += token.value;
	            this.addNewLine(this.indentCount);
	        } else {
	            this.lines[this.lastIndex()] += token.value;
	        }
	    };

	    NewFormatter.prototype.formatQuerySeparator = function formatQuerySeparator(token) {

	        this.lines[this.lastIndex()] = (0, _trimEnd2["default"])(this.getLastString());
	        /**if first word is start block, and line end for ; then decrement indent
	        example:
	        procedure name(val);
	        */
	        var first = this.getFirstWord(this.getLastString());
	        if (this.openParens.includes(first.toUpperCase()) && first != "if") {
	            this.decrementIndent();
	        } else if (this.getLastString().endsWith(")")) {
	            var ssInfo = this.getBktSubstring(this.lastIndex());
	            var substring = ssInfo.substring;
	            first = this.getFirstWord(substring);
	            if (this.openParens.includes(first.toUpperCase() && first != "if")) {
	                this.decrementIndent();
	            }
	        }
	        this.lines[this.lastIndex()] += token.value;
	        this.addNewLine(this.indentCount);
	    };

	    NewFormatter.prototype.getBktSubstring = function getBktSubstring(from) {
	        var countOpenBkt = 0;
	        var countCloseBkt = 0;
	        var substring = "";
	        var index = 0;
	        var subLines = [];
	        for (var i = from; i >= 0; i--) {
	            subLines.unshift(this.lines[i]);
	            var line = this.lines[i].replace(/--.*/, "");
	            if (line.startsWith("*") || line.startsWith("/*")) {
	                line = "";
	            }
	            var match = line.match(/\(/);
	            if (match != null) {
	                countOpenBkt += match.length;
	            }
	            match = line.match(/\)/);
	            if (match != null) {
	                countCloseBkt += match.length;
	            }
	            substring = line + substring;
	            if (countCloseBkt <= countOpenBkt) {
	                index = i;
	                break;
	            }
	        }
	        return { substring: substring, startIndex: index, subLines: subLines };
	    };

	    NewFormatter.prototype.getFirstWord = function getFirstWord(string) {
	        var wordSeparator = / |\(|\)/;
	        return string.trim().split(wordSeparator)[0].trim();
	    };

	    NewFormatter.prototype.formatWithSpaces = function formatWithSpaces(token) {
	        this.lines[this.lastIndex()] += token.value + " ";
	    };

	    NewFormatter.prototype.formatWithoutSpaces = function formatWithoutSpaces(token) {
	        if (token.value != "(") {
	            this.lines[this.lastIndex()] = (0, _trimEnd2["default"])(this.getLastString()) + token.value;
	        } else {
	            this.lines[this.lastIndex()] = this.getLastString() + token.value;
	        }
	    };

	    NewFormatter.prototype.formatOpeningParentheses = function formatOpeningParentheses(token, index) {
	        var next = this.getNextValidWord(index);
	        var startBlock = ["cursor", "procedure", "function"];
	        if (next == ";") {
	            this.lines[this.lastIndex()] += token.value;
	            return;
	        }
	        if (startBlock.includes(token.value)) {
	            if (this.indentStartBlock < 0) {
	                this.indentStartBlock = this.indentCount;
	            } else {
	                if (this.lines[this.lastIndex() - 1].trim() == "") {
	                    this.lines.pop();
	                }
	                this.indentCount = this.indentStartBlock;
	            }
	        }

	        this.addNewLine(this.indentCount);
	        if (token.value == "begin" && this.lines[this.lastIndex() - 1].trim() == "") {
	            this.lines.pop();
	            this.lines[this.lastIndex()] = (0, _repeat2["default"])(this.indent, this.indentCount);
	        }
	        this.indentCount++;
	        this.lines[this.lastIndex()] += token.value;
	        if (token.value == "begin") {
	            this.addNewLine(this.indentCount);
	        }
	    };

	    NewFormatter.prototype.getNextValidWord = function getNextValidWord(index) {
	        var token = this.tokens[index + 1];
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
	    };

	    NewFormatter.prototype.decrementIndent = function decrementIndent() {
	        if (this.indentCount != 0) this.indentCount--;
	    };

	    NewFormatter.prototype.formatClosingParentheses = function formatClosingParentheses(token, index) {
	        if (token.value == "end") {
	            this.decrementIndent();
	            this.lines.pop();
	            this.addNewLine(this.indentCount);
	            this.lines[this.lastIndex()] += token.value;
	        } else {
	            if (this.getLastString().trim() != "") {
	                this.addNewLine(this.indentCount);
	            }
	            this.lines[this.lastIndex()] += token.value;
	            this.decrementIndent();
	        }
	    };

	    NewFormatter.prototype.formatSqlQuery = function formatSqlQuery(startIndex) {
	        var startIndent = this.indentCount;
	        var sql = "";
	        var index = startIndex;
	        var prev = this.getPrevValidTokenValue(startIndex);
	        if (prev == "(") {
	            var bktCount = 0;
	            for (index; index < this.tokens.length; index++) {
	                var word = this.tokens[index].value;
	                if (word == "(") {
	                    bktCount++;
	                    sql += word;
	                } else if (word == ")") {
	                    if (bktCount == 0) {
	                        break;
	                    }
	                    sql += word;
	                    bktCount--;
	                } else {
	                    sql += word;
	                }
	            }
	        } else {
	            for (index; index < this.tokens.length; index++) {
	                var _word = this.tokens[index].value;
	                if (_word == ";") {
	                    break;
	                } else {
	                    sql += _word;
	                }
	            }
	        }
	        index--;
	        var sqlArray = new _SqlFormatter2["default"](this.cfg).getFormatArray(sql);
	        if (this.getLastString().trim().endsWith("(")) {
	            this.insertSqlInThisLine(sqlArray);
	        } else {
	            this.insertSqlInNewLine(sqlArray);
	        }
	        this.indentCount = startIndent;
	        return index;
	    };

	    NewFormatter.prototype.insertSqlInThisLine = function insertSqlInThisLine(sqlArray) {
	        var indent = this.getLastString().length;
	        this.lines[this.lastIndex()] += sqlArray[0];
	        for (var i = 1; i < sqlArray.length; i++) {
	            this.lines.push((0, _repeat2["default"])(" ", indent) + sqlArray[i]);
	        }
	    };

	    NewFormatter.prototype.insertSqlInNewLine = function insertSqlInNewLine(sqlArray) {
	        while (this.getLastString().trim() == "" && this.lines.length != 1) {
	            this.lines.pop();
	        }
	        for (var i = 0; i < sqlArray.length; i++) {
	            if (this.getLastString().trim() == "") {
	                this.lines.pop();
	            }
	            this.addNewLine(this.indentCount);
	            this.lines[this.lastIndex()] += sqlArray[i];
	        }
	    };

	    NewFormatter.prototype.getPrevValidTokenValue = function getPrevValidTokenValue(index) {
	        var token = this.tokens[index - 1];
	        if (token != undefined) {
	            if (token.value.trim() == "") {
	                token = this.tokens[index - 2];
	                if (token != undefined) {
	                    return token.value;
	                }
	            } else {
	                return token.value;
	            }
	        }
	        return "";
	    };

	    NewFormatter.prototype.formatTopLeveleReservedWord = function formatTopLeveleReservedWord(token) {
	        if (this.addNewLinePreviewReservedWord(token)) {
	            this.addNewLine(this.indentCount);
	        }
	        if (token.value == "elsif" && this.lines[this.lastIndex() - 1].includes("return")) {
	            this.indentCount++;
	        }
	        this.lines[this.lastIndex()] += token.value;
	        if (token.value == "is" || token.value == "as") {
	            var idx = this.lastIndex() - 1;
	            var first = this.getFirstWord(this.lines[idx]);
	            if (first == "return") {
	                this.indentCount++;
	                this.lines[idx] = this.indent + this.lines[idx];
	                this.addNewLine(this.indentCount);
	            }
	        }
	    };

	    NewFormatter.prototype.addNewLinePreviewReservedWord = function addNewLinePreviewReservedWord(token) {
	        return this.getLastString().trim() != "end" && this.getLastString().trim() != "is" && token.value != "then" && this.getLastString().trim() != "" && !(token.value == "as" && this.getLastString().includes(" with "));
	    };

	    NewFormatter.prototype.formatLineComment = function formatLineComment(token) {
	        if (this.getLastString().trim() == "") {
	            this.lines.pop();
	        }
	        if (!this.getLastString().endsWith(" ")) {
	            this.lines[this.lastIndex()] += " ";
	        }
	        this.lines[this.lastIndex()] += token.value;
	        this.addNewLine(this.indentCount);
	    };

	    NewFormatter.prototype.formatBlockComment = function formatBlockComment(token) {
	        this.addNewLine(this.indentCount);
	        var comment = "";
	        var comLines = token.value.split("\n");
	        for (var i = 0; i < comLines.length; i++) {
	            this.lines[this.lastIndex()] += comLines[i].trim();
	            this.addNewLine(this.indentCount);
	        }
	        this.lines.pop();
	    };

	    NewFormatter.prototype.addNewLine = function addNewLine(count) {
	        this.lines[this.lastIndex()] = (0, _trimEnd2["default"])(this.getLastString());
	        this.lines.push((0, _repeat2["default"])(this.indent, count));
	    };

	    NewFormatter.prototype.lastIndex = function lastIndex() {
	        return this.lines.length - 1;
	    };

	    NewFormatter.prototype.getLastString = function getLastString() {
	        return this.lines[this.lastIndex()];
	    };

	    return NewFormatter;
	}();

	exports["default"] = NewFormatter;
	module.exports = exports["default"];

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _Tokenizer = __webpack_require__(12);

	var _Tokenizer2 = _interopRequireDefault(_Tokenizer);

	var _NewFormatter = __webpack_require__(34);

	var _NewFormatter2 = _interopRequireDefault(_NewFormatter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var reservedWords = ["A", "ACCESSIBLE", "AGENT", "AGGREGATE", "ALL", "ALTER", "ANY", "ARRAY", "AS", "ASC", "AT", "ATTRIBUTE", "AUTHID", "AVG", "BETWEEN", "BFILE_BASE", "BINARY_INTEGER", "BINARY", "BLOB_BASE", "BLOCK", "BODY", "BOOLEAN", "BOTH", "BOUND", "BULK", "BY", "BYTE", "C", "CALL", "CALLING", "CASCADE", "CASE", "CHAR_BASE", "CHAR", "CHARACTER", "CHARSET", "CHARSETFORM", "CHARSETID", "CHECK", "CLOB_BASE", "CLONE", "CLOSE", "CLUSTER", "CLUSTERS", "COALESCE", "COLAUTH", "COLLECT", "COLUMNS", "COMMENT", "COMMIT", "COMMITTED", "COMPILED", "COMPRESS", "CONNECT", "CONSTANT", "CONSTRUCTOR", "CONTEXT", "CONTINUE", "CONVERT", "COUNT", "CRASH", "CREATE", "CREDENTIAL", "CURRENT", "CURRVAL", "CURSOR", "CUSTOMDATUM", "DANGLING", "DATA", "DATE_BASE", "DATE", "DAY", "DECIMAL", "DEFAULT", "DEFINE", "DELETE", "DESC", "DETERMINISTIC", "DIRECTORY", "DISTINCT", "DO", "DOUBLE", "DROP", "DURATION", "ELEMENT", "ELSIF", "EMPTY", "ESCAPE", "EXCEPTIONS", "EXCLUSIVE", "EXECUTE", "EXISTS", "EXIT", "EXTENDS", "EXTERNAL", "EXTRACT", "FALSE", "FETCH", "FINAL", "FIRST", "FIXED", "FLOAT", "FOR", "FORALL", "FORCE", "FROM", "FUNCTION", "GENERAL", "GOTO", "GRANT", "GROUP", "HASH", "HEAP", "HIDDEN", "HOUR", "IDENTIFIED", "IF", "IMMEDIATE", "IN", "INCLUDING", "INDEX", "INDEXES", "INDICATOR", "INDICES", "INFINITE", "INSTANTIABLE", "INT", "INTEGER", "INTERFACE", "INTERVAL", "INTO", "INVALIDATE", "IS", "ISOLATION", "JAVA", "LANGUAGE", "LARGE", "LEADING", "LENGTH", "LEVEL", "LIBRARY", "LIKE", "LIKE2", "LIKE4", "LIKEC", "LIMITED", "LOCAL", "LOCK", "LONG", "MAP", "MAX", "MAXLEN", "MEMBER", "MERGE INTO", "MIN", "MINUS", "MINUTE", "MLSLABEL", "MOD", "MODE", "MONTH", "MULTISET", "NAME", "NAN", "NATIONAL", "NATIVE", "NATURAL", "NATURALN", "NCHAR", "NEW", "NEXTVAL", "NOCOMPRESS", "NOCOPY", "NOT", "NOWAIT", "NULL", "NULLIF", "NUMBER_BASE", "NUMBER", "OBJECT", "OCICOLL", "OCIDATE", "OCIDATETIME", "OCIDURATION", "OCIINTERVAL", "OCILOBLOCATOR", "OCINUMBER", "OCIRAW", "OCIREF", "OCIREFCURSOR", "OCIROWID", "OCISTRING", "OCITYPE", "OF", "OLD", "ON", "ONLY", "OPAQUE", "OPEN", "OPERATOR", "OPTION", "ORACLE", "ORADATA", "ORDER", "ORGANIZATION", "ORLANY", "ORLVARY", "OTHERS", "OUT", "OVERLAPS", "OVERRIDING", "PACKAGE", "PARALLEL_ENABLE", "PARAMETER", "PARAMETERS", "PARENT", "PARTITION", "PASCAL", "PCTFREE", "PIPE", "PIPELINED", "PLS_INTEGER", "PLUGGABLE", "POSITIVE", "POSITIVEN", "PRAGMA", "PRECISION", "PRIOR", "PRIVATE", "PROCEDURE", "PUBLIC", "RAISE", "RANGE", "RAW", "READ", "REAL", "RECORD", "REF", "REFERENCE", "RELEASE", "RELIES_ON", "REM", "REMAINDER", "RENAME", "RESOURCE", "RESULT_CACHE", "RESULT", "RETURN", "RETURNING", "REVERSE", "REVOKE", "ROLLBACK", "ROW", "ROWID", "ROWNUM", "ROWTYPE", "SAMPLE", "SAVE", "SAVEPOINT", "SB1", "SB2", "SB4", "SECOND", "SEGMENT", "SELF", "SEPARATE", "SEQUENCE", "SERIALIZABLE", "SHARE", "SHORT", "SIZE_T", "SIZE", "SMALLINT", "SOME", "SPACE", "SPARSE", "SQL", "SQLCODE", "SQLDATA", "SQLERRM", "SQLNAME", "SQLSTATE", "STANDARD", "START", "STATIC", "STDDEV", "STORED", "STRING", "STRUCT", "STYLE", "SUBMULTISET", "SUBPARTITION", "SUBSTITUTABLE", "SUBTYPE", "SUCCESSFUL", "SUM", "SYNONYM", "SYSDATE", "TABAUTH", "TABLE", "TDO", "THE", "THEN", "TIME", "TIMESTAMP", "TIMEZONE_ABBR", "TIMEZONE_HOUR", "TIMEZONE_MINUTE", "TIMEZONE_REGION", "TO", "TRAILING", "TRANSACTION", "TRANSACTIONAL", "TRIGGER", "TRUE", "TRUSTED", "TYPE", "UB1", "UB2", "UB4", "UID", "UNDER", "UNIQUE", "UNPLUG", "UNSIGNED", "UNTRUSTED", "USE", "USER", "USING", "VALIDATE", "VALIST", "VALUE", "VARCHAR", "VARCHAR2", "VARIABLE", "VARIANCE", "VARRAY", "VARYING", "VIEW", "VIEWS", "VOID", "WHENEVER", "WHILE", "WITH", "WORK", "WRAPPED", "WRITE", "YEAR", "SELECT", "UNION", "INSERT", "EXCEPTION", "ZONE", "AND", "OR"];

	var reservedToplevelWords = ["LOOP", "TYPE", "WITH", "UNION", "USING", "ELSE", "WHEN", "THEN", "ELSIF"];

	var reservedNewlineWords = ["ALTER", "SELECT", "INSERT", "UPDATE", "DROP", "MERGE INTO"];

	var openParens = ["CREATE", "BEGIN", "FUNCTION", "CURSOR", "IF", "FOR", "PROCEDURE", "WHILE"];

	var tokenizer = void 0;

	var SqlFormatter = function () {
	    function SqlFormatter(cfg) {
	        _classCallCheck(this, SqlFormatter);

	        this.cfg = cfg;
	    }

	    SqlFormatter.prototype.format = function format(query) {
	        if (!tokenizer) {
	            tokenizer = new _Tokenizer2["default"]({
	                reservedWords: reservedWords,
	                reservedToplevelWords: reservedToplevelWords,
	                reservedNewlineWords: reservedNewlineWords,
	                stringTypes: ["\"\"", "N''", "''", "``"],
	                openParens: openParens,
	                closeParens: ["END", "RETURN"],
	                indexedPlaceholderTypes: ["?"],
	                namedPlaceholderTypes: [":"],
	                lineCommentTypes: ["--"],
	                specialWordChars: ["_", "$", "#", ".", "@", "%"]
	            });
	        }
	        return new _NewFormatter2["default"](this.cfg, tokenizer, reservedWords, openParens).format(query);
	    };

	    return SqlFormatter;
	}();

	exports["default"] = SqlFormatter;
	module.exports = exports["default"];

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(3),
	    root = __webpack_require__(1);

	/* Built-in method references that are verified to be native. */
	var DataView = getNative(root, 'DataView');

	module.exports = DataView;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(3),
	    root = __webpack_require__(1);

	/* Built-in method references that are verified to be native. */
	var Map = getNative(root, 'Map');

	module.exports = Map;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(3),
	    root = __webpack_require__(1);

	/* Built-in method references that are verified to be native. */
	var Promise = getNative(root, 'Promise');

	module.exports = Promise;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(3),
	    root = __webpack_require__(1);

	/* Built-in method references that are verified to be native. */
	var Set = getNative(root, 'Set');

	module.exports = Set;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(3),
	    root = __webpack_require__(1);

	/* Built-in method references that are verified to be native. */
	var WeakMap = getNative(root, 'WeakMap');

	module.exports = WeakMap;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	var baseTimes = __webpack_require__(50),
	    isArguments = __webpack_require__(23),
	    isArray = __webpack_require__(5),
	    isBuffer = __webpack_require__(24),
	    isIndex = __webpack_require__(19),
	    isTypedArray = __webpack_require__(28);

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Creates an array of the enumerable property names of the array-like `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @param {boolean} inherited Specify returning inherited property names.
	 * @returns {Array} Returns the array of property names.
	 */
	function arrayLikeKeys(value, inherited) {
	  var isArr = isArray(value),
	      isArg = !isArr && isArguments(value),
	      isBuff = !isArr && !isArg && isBuffer(value),
	      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
	      skipIndexes = isArr || isArg || isBuff || isType,
	      result = skipIndexes ? baseTimes(value.length, String) : [],
	      length = result.length;

	  for (var key in value) {
	    if ((inherited || hasOwnProperty.call(value, key)) &&
	        !(skipIndexes && (
	           // Safari 9 has enumerable `arguments.length` in strict mode.
	           key == 'length' ||
	           // Node.js 0.10 has enumerable non-index properties on buffers.
	           (isBuff && (key == 'offset' || key == 'parent')) ||
	           // PhantomJS 2 has enumerable non-index properties on typed arrays.
	           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
	           // Skip index properties.
	           isIndex(key, length)
	        ))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	module.exports = arrayLikeKeys;


/***/ }),
/* 42 */
/***/ (function(module, exports) {

	/**
	 * Converts an ASCII `string` to an array.
	 *
	 * @private
	 * @param {string} string The string to convert.
	 * @returns {Array} Returns the converted array.
	 */
	function asciiToArray(string) {
	  return string.split('');
	}

	module.exports = asciiToArray;


/***/ }),
/* 43 */
/***/ (function(module, exports) {

	/**
	 * The base implementation of `_.findIndex` and `_.findLastIndex` without
	 * support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {Function} predicate The function invoked per iteration.
	 * @param {number} fromIndex The index to search from.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseFindIndex(array, predicate, fromIndex, fromRight) {
	  var length = array.length,
	      index = fromIndex + (fromRight ? 1 : -1);

	  while ((fromRight ? index-- : ++index < length)) {
	    if (predicate(array[index], index, array)) {
	      return index;
	    }
	  }
	  return -1;
	}

	module.exports = baseFindIndex;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(2),
	    isObjectLike = __webpack_require__(4);

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]';

	/**
	 * The base implementation of `_.isArguments`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 */
	function baseIsArguments(value) {
	  return isObjectLike(value) && baseGetTag(value) == argsTag;
	}

	module.exports = baseIsArguments;


/***/ }),
/* 45 */
/***/ (function(module, exports) {

	/**
	 * The base implementation of `_.isNaN` without support for number objects.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
	 */
	function baseIsNaN(value) {
	  return value !== value;
	}

	module.exports = baseIsNaN;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(25),
	    isMasked = __webpack_require__(61),
	    isObject = __webpack_require__(7),
	    toSource = __webpack_require__(21);

	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used for built-in method references. */
	var funcProto = Function.prototype,
	    objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * The base implementation of `_.isNative` without bad shim checks.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 */
	function baseIsNative(value) {
	  if (!isObject(value) || isMasked(value)) {
	    return false;
	  }
	  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
	  return pattern.test(toSource(value));
	}

	module.exports = baseIsNative;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(2),
	    isLength = __webpack_require__(26),
	    isObjectLike = __webpack_require__(4);

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    weakMapTag = '[object WeakMap]';

	var arrayBufferTag = '[object ArrayBuffer]',
	    dataViewTag = '[object DataView]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';

	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
	typedArrayTags[errorTag] = typedArrayTags[funcTag] =
	typedArrayTags[mapTag] = typedArrayTags[numberTag] =
	typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
	typedArrayTags[setTag] = typedArrayTags[stringTag] =
	typedArrayTags[weakMapTag] = false;

	/**
	 * The base implementation of `_.isTypedArray` without Node.js optimizations.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 */
	function baseIsTypedArray(value) {
	  return isObjectLike(value) &&
	    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
	}

	module.exports = baseIsTypedArray;


/***/ }),
/* 48 */
/***/ (function(module, exports) {

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeFloor = Math.floor;

	/**
	 * The base implementation of `_.repeat` which doesn't coerce arguments.
	 *
	 * @private
	 * @param {string} string The string to repeat.
	 * @param {number} n The number of times to repeat the string.
	 * @returns {string} Returns the repeated string.
	 */
	function baseRepeat(string, n) {
	  var result = '';
	  if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
	    return result;
	  }
	  // Leverage the exponentiation by squaring algorithm for a faster repeat.
	  // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
	  do {
	    if (n % 2) {
	      result += string;
	    }
	    n = nativeFloor(n / 2);
	    if (n) {
	      string += string;
	    }
	  } while (n);

	  return result;
	}

	module.exports = baseRepeat;


/***/ }),
/* 49 */
/***/ (function(module, exports) {

	/**
	 * The base implementation of `_.slice` without an iteratee call guard.
	 *
	 * @private
	 * @param {Array} array The array to slice.
	 * @param {number} [start=0] The start position.
	 * @param {number} [end=array.length] The end position.
	 * @returns {Array} Returns the slice of `array`.
	 */
	function baseSlice(array, start, end) {
	  var index = -1,
	      length = array.length;

	  if (start < 0) {
	    start = -start > length ? 0 : (length + start);
	  }
	  end = end > length ? length : end;
	  if (end < 0) {
	    end += length;
	  }
	  length = start > end ? 0 : ((end - start) >>> 0);
	  start >>>= 0;

	  var result = Array(length);
	  while (++index < length) {
	    result[index] = array[index + start];
	  }
	  return result;
	}

	module.exports = baseSlice;


/***/ }),
/* 50 */
/***/ (function(module, exports) {

	/**
	 * The base implementation of `_.times` without support for iteratee shorthands
	 * or max array length checks.
	 *
	 * @private
	 * @param {number} n The number of times to invoke `iteratee`.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the array of results.
	 */
	function baseTimes(n, iteratee) {
	  var index = -1,
	      result = Array(n);

	  while (++index < n) {
	    result[index] = iteratee(index);
	  }
	  return result;
	}

	module.exports = baseTimes;


/***/ }),
/* 51 */
/***/ (function(module, exports) {

	/**
	 * The base implementation of `_.unary` without support for storing metadata.
	 *
	 * @private
	 * @param {Function} func The function to cap arguments for.
	 * @returns {Function} Returns the new capped function.
	 */
	function baseUnary(func) {
	  return function(value) {
	    return func(value);
	  };
	}

	module.exports = baseUnary;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	var arrayMap = __webpack_require__(14);

	/**
	 * The base implementation of `_.values` and `_.valuesIn` which creates an
	 * array of `object` property values corresponding to the property names
	 * of `props`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array} props The property names to get values for.
	 * @returns {Object} Returns the array of property values.
	 */
	function baseValues(object, props) {
	  return arrayMap(props, function(key) {
	    return object[key];
	  });
	}

	module.exports = baseValues;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	var baseSlice = __webpack_require__(49);

	/**
	 * Casts `array` to a slice if it's needed.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {number} start The start position.
	 * @param {number} [end=array.length] The end position.
	 * @returns {Array} Returns the cast slice.
	 */
	function castSlice(array, start, end) {
	  var length = array.length;
	  end = end === undefined ? length : end;
	  return (!start && end >= length) ? array : baseSlice(array, start, end);
	}

	module.exports = castSlice;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	var baseIndexOf = __webpack_require__(15);

	/**
	 * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
	 * that is not found in the character symbols.
	 *
	 * @private
	 * @param {Array} strSymbols The string symbols to inspect.
	 * @param {Array} chrSymbols The character symbols to find.
	 * @returns {number} Returns the index of the last unmatched string symbol.
	 */
	function charsEndIndex(strSymbols, chrSymbols) {
	  var index = strSymbols.length;

	  while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
	  return index;
	}

	module.exports = charsEndIndex;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	var root = __webpack_require__(1);

	/** Used to detect overreaching core-js shims. */
	var coreJsData = root['__core-js_shared__'];

	module.exports = coreJsData;


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(9);

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;

	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

	/**
	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the raw `toStringTag`.
	 */
	function getRawTag(value) {
	  var isOwn = hasOwnProperty.call(value, symToStringTag),
	      tag = value[symToStringTag];

	  try {
	    value[symToStringTag] = undefined;
	    var unmasked = true;
	  } catch (e) {}

	  var result = nativeObjectToString.call(value);
	  if (unmasked) {
	    if (isOwn) {
	      value[symToStringTag] = tag;
	    } else {
	      delete value[symToStringTag];
	    }
	  }
	  return result;
	}

	module.exports = getRawTag;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	var DataView = __webpack_require__(36),
	    Map = __webpack_require__(37),
	    Promise = __webpack_require__(38),
	    Set = __webpack_require__(39),
	    WeakMap = __webpack_require__(40),
	    baseGetTag = __webpack_require__(2),
	    toSource = __webpack_require__(21);

	/** `Object#toString` result references. */
	var mapTag = '[object Map]',
	    objectTag = '[object Object]',
	    promiseTag = '[object Promise]',
	    setTag = '[object Set]',
	    weakMapTag = '[object WeakMap]';

	var dataViewTag = '[object DataView]';

	/** Used to detect maps, sets, and weakmaps. */
	var dataViewCtorString = toSource(DataView),
	    mapCtorString = toSource(Map),
	    promiseCtorString = toSource(Promise),
	    setCtorString = toSource(Set),
	    weakMapCtorString = toSource(WeakMap);

	/**
	 * Gets the `toStringTag` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	var getTag = baseGetTag;

	// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
	if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
	    (Map && getTag(new Map) != mapTag) ||
	    (Promise && getTag(Promise.resolve()) != promiseTag) ||
	    (Set && getTag(new Set) != setTag) ||
	    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
	  getTag = function(value) {
	    var result = baseGetTag(value),
	        Ctor = result == objectTag ? value.constructor : undefined,
	        ctorString = Ctor ? toSource(Ctor) : '';

	    if (ctorString) {
	      switch (ctorString) {
	        case dataViewCtorString: return dataViewTag;
	        case mapCtorString: return mapTag;
	        case promiseCtorString: return promiseTag;
	        case setCtorString: return setTag;
	        case weakMapCtorString: return weakMapTag;
	      }
	    }
	    return result;
	  };
	}

	module.exports = getTag;


/***/ }),
/* 58 */
/***/ (function(module, exports) {

	/**
	 * Gets the value at `key` of `object`.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */
	function getValue(object, key) {
	  return object == null ? undefined : object[key];
	}

	module.exports = getValue;


/***/ }),
/* 59 */
/***/ (function(module, exports) {

	/** Used to compose unicode character classes. */
	var rsAstralRange = '\\ud800-\\udfff',
	    rsComboMarksRange = '\\u0300-\\u036f',
	    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
	    rsComboSymbolsRange = '\\u20d0-\\u20ff',
	    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
	    rsVarRange = '\\ufe0e\\ufe0f';

	/** Used to compose unicode capture groups. */
	var rsZWJ = '\\u200d';

	/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
	var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

	/**
	 * Checks if `string` contains Unicode symbols.
	 *
	 * @private
	 * @param {string} string The string to inspect.
	 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
	 */
	function hasUnicode(string) {
	  return reHasUnicode.test(string);
	}

	module.exports = hasUnicode;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	var eq = __webpack_require__(69),
	    isArrayLike = __webpack_require__(6),
	    isIndex = __webpack_require__(19),
	    isObject = __webpack_require__(7);

	/**
	 * Checks if the given arguments are from an iteratee call.
	 *
	 * @private
	 * @param {*} value The potential iteratee value argument.
	 * @param {*} index The potential iteratee index or key argument.
	 * @param {*} object The potential iteratee object argument.
	 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
	 *  else `false`.
	 */
	function isIterateeCall(value, index, object) {
	  if (!isObject(object)) {
	    return false;
	  }
	  var type = typeof index;
	  if (type == 'number'
	        ? (isArrayLike(object) && isIndex(index, object.length))
	        : (type == 'string' && index in object)
	      ) {
	    return eq(object[index], value);
	  }
	  return false;
	}

	module.exports = isIterateeCall;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	var coreJsData = __webpack_require__(55);

	/** Used to detect methods masquerading as native. */
	var maskSrcKey = (function() {
	  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
	  return uid ? ('Symbol(src)_1.' + uid) : '';
	}());

	/**
	 * Checks if `func` has its source masked.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
	 */
	function isMasked(func) {
	  return !!maskSrcKey && (maskSrcKey in func);
	}

	module.exports = isMasked;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	var overArg = __webpack_require__(65);

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeKeys = overArg(Object.keys, Object);

	module.exports = nativeKeys;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var freeGlobal = __webpack_require__(18);

	/** Detect free variable `exports`. */
	var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Detect free variable `process` from Node.js. */
	var freeProcess = moduleExports && freeGlobal.process;

	/** Used to access faster Node.js helpers. */
	var nodeUtil = (function() {
	  try {
	    // Use `util.types` for Node.js 10+.
	    var types = freeModule && freeModule.require && freeModule.require('util').types;

	    if (types) {
	      return types;
	    }

	    // Legacy `process.binding('util')` for Node.js < 10.
	    return freeProcess && freeProcess.binding && freeProcess.binding('util');
	  } catch (e) {}
	}());

	module.exports = nodeUtil;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(32)(module)))

/***/ }),
/* 64 */
/***/ (function(module, exports) {

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;

	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */
	function objectToString(value) {
	  return nativeObjectToString.call(value);
	}

	module.exports = objectToString;


/***/ }),
/* 65 */
/***/ (function(module, exports) {

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}

	module.exports = overArg;


/***/ }),
/* 66 */
/***/ (function(module, exports) {

	/**
	 * A specialized version of `_.indexOf` which performs strict equality
	 * comparisons of values, i.e. `===`.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function strictIndexOf(array, value, fromIndex) {
	  var index = fromIndex - 1,
	      length = array.length;

	  while (++index < length) {
	    if (array[index] === value) {
	      return index;
	    }
	  }
	  return -1;
	}

	module.exports = strictIndexOf;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

	var asciiToArray = __webpack_require__(42),
	    hasUnicode = __webpack_require__(59),
	    unicodeToArray = __webpack_require__(68);

	/**
	 * Converts `string` to an array.
	 *
	 * @private
	 * @param {string} string The string to convert.
	 * @returns {Array} Returns the converted array.
	 */
	function stringToArray(string) {
	  return hasUnicode(string)
	    ? unicodeToArray(string)
	    : asciiToArray(string);
	}

	module.exports = stringToArray;


/***/ }),
/* 68 */
/***/ (function(module, exports) {

	/** Used to compose unicode character classes. */
	var rsAstralRange = '\\ud800-\\udfff',
	    rsComboMarksRange = '\\u0300-\\u036f',
	    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
	    rsComboSymbolsRange = '\\u20d0-\\u20ff',
	    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
	    rsVarRange = '\\ufe0e\\ufe0f';

	/** Used to compose unicode capture groups. */
	var rsAstral = '[' + rsAstralRange + ']',
	    rsCombo = '[' + rsComboRange + ']',
	    rsFitz = '\\ud83c[\\udffb-\\udfff]',
	    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
	    rsNonAstral = '[^' + rsAstralRange + ']',
	    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
	    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
	    rsZWJ = '\\u200d';

	/** Used to compose unicode regexes. */
	var reOptMod = rsModifier + '?',
	    rsOptVar = '[' + rsVarRange + ']?',
	    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
	    rsSeq = rsOptVar + reOptMod + rsOptJoin,
	    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

	/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
	var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

	/**
	 * Converts a Unicode `string` to an array.
	 *
	 * @private
	 * @param {string} string The string to convert.
	 * @returns {Array} Returns the converted array.
	 */
	function unicodeToArray(string) {
	  return string.match(reUnicode) || [];
	}

	module.exports = unicodeToArray;


/***/ }),
/* 69 */
/***/ (function(module, exports) {

	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 * var other = { 'a': 1 };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}

	module.exports = eq;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	var toString = __webpack_require__(10);

	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
	    reHasRegExpChar = RegExp(reRegExpChar.source);

	/**
	 * Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
	 * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category String
	 * @param {string} [string=''] The string to escape.
	 * @returns {string} Returns the escaped string.
	 * @example
	 *
	 * _.escapeRegExp('[lodash](https://lodash.com/)');
	 * // => '\[lodash\]\(https://lodash\.com/\)'
	 */
	function escapeRegExp(string) {
	  string = toString(string);
	  return (string && reHasRegExpChar.test(string))
	    ? string.replace(reRegExpChar, '\\$&')
	    : string;
	}

	module.exports = escapeRegExp;


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	var baseKeys = __webpack_require__(16),
	    getTag = __webpack_require__(57),
	    isArguments = __webpack_require__(23),
	    isArray = __webpack_require__(5),
	    isArrayLike = __webpack_require__(6),
	    isBuffer = __webpack_require__(24),
	    isPrototype = __webpack_require__(20),
	    isTypedArray = __webpack_require__(28);

	/** `Object#toString` result references. */
	var mapTag = '[object Map]',
	    setTag = '[object Set]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Checks if `value` is an empty object, collection, map, or set.
	 *
	 * Objects are considered empty if they have no own enumerable string keyed
	 * properties.
	 *
	 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
	 * jQuery-like collections are considered empty if they have a `length` of `0`.
	 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
	 * @example
	 *
	 * _.isEmpty(null);
	 * // => true
	 *
	 * _.isEmpty(true);
	 * // => true
	 *
	 * _.isEmpty(1);
	 * // => true
	 *
	 * _.isEmpty([1, 2, 3]);
	 * // => false
	 *
	 * _.isEmpty({ 'a': 1 });
	 * // => false
	 */
	function isEmpty(value) {
	  if (value == null) {
	    return true;
	  }
	  if (isArrayLike(value) &&
	      (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
	        isBuffer(value) || isTypedArray(value) || isArguments(value))) {
	    return !value.length;
	  }
	  var tag = getTag(value);
	  if (tag == mapTag || tag == setTag) {
	    return !value.size;
	  }
	  if (isPrototype(value)) {
	    return !baseKeys(value).length;
	  }
	  for (var key in value) {
	    if (hasOwnProperty.call(value, key)) {
	      return false;
	    }
	  }
	  return true;
	}

	module.exports = isEmpty;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(2),
	    isArray = __webpack_require__(5),
	    isObjectLike = __webpack_require__(4);

	/** `Object#toString` result references. */
	var stringTag = '[object String]';

	/**
	 * Checks if `value` is classified as a `String` primitive or object.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
	 * @example
	 *
	 * _.isString('abc');
	 * // => true
	 *
	 * _.isString(1);
	 * // => false
	 */
	function isString(value) {
	  return typeof value == 'string' ||
	    (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
	}

	module.exports = isString;


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

	var arrayLikeKeys = __webpack_require__(41),
	    baseKeys = __webpack_require__(16),
	    isArrayLike = __webpack_require__(6);

	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	function keys(object) {
	  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
	}

	module.exports = keys;


/***/ }),
/* 74 */
/***/ (function(module, exports) {

	/**
	 * This method returns `false`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {boolean} Returns `false`.
	 * @example
	 *
	 * _.times(2, _.stubFalse);
	 * // => [false, false]
	 */
	function stubFalse() {
	  return false;
	}

	module.exports = stubFalse;


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	var toNumber = __webpack_require__(76);

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0,
	    MAX_INTEGER = 1.7976931348623157e+308;

	/**
	 * Converts `value` to a finite number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.12.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {number} Returns the converted number.
	 * @example
	 *
	 * _.toFinite(3.2);
	 * // => 3.2
	 *
	 * _.toFinite(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toFinite(Infinity);
	 * // => 1.7976931348623157e+308
	 *
	 * _.toFinite('3.2');
	 * // => 3.2
	 */
	function toFinite(value) {
	  if (!value) {
	    return value === 0 ? value : 0;
	  }
	  value = toNumber(value);
	  if (value === INFINITY || value === -INFINITY) {
	    var sign = (value < 0 ? -1 : 1);
	    return sign * MAX_INTEGER;
	  }
	  return value === value ? value : 0;
	}

	module.exports = toFinite;


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(7),
	    isSymbol = __webpack_require__(27);

	/** Used as references for various `Number` constants. */
	var NAN = 0 / 0;

	/** Used to match leading and trailing whitespace. */
	var reTrim = /^\s+|\s+$/g;

	/** Used to detect bad signed hexadecimal string values. */
	var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

	/** Used to detect binary string values. */
	var reIsBinary = /^0b[01]+$/i;

	/** Used to detect octal string values. */
	var reIsOctal = /^0o[0-7]+$/i;

	/** Built-in method references without a dependency on `root`. */
	var freeParseInt = parseInt;

	/**
	 * Converts `value` to a number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {number} Returns the number.
	 * @example
	 *
	 * _.toNumber(3.2);
	 * // => 3.2
	 *
	 * _.toNumber(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toNumber(Infinity);
	 * // => Infinity
	 *
	 * _.toNumber('3.2');
	 * // => 3.2
	 */
	function toNumber(value) {
	  if (typeof value == 'number') {
	    return value;
	  }
	  if (isSymbol(value)) {
	    return NAN;
	  }
	  if (isObject(value)) {
	    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
	    value = isObject(other) ? (other + '') : other;
	  }
	  if (typeof value != 'string') {
	    return value === 0 ? value : +value;
	  }
	  value = value.replace(reTrim, '');
	  var isBinary = reIsBinary.test(value);
	  return (isBinary || reIsOctal.test(value))
	    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
	    : (reIsBadHex.test(value) ? NAN : +value);
	}

	module.exports = toNumber;


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

	var baseValues = __webpack_require__(52),
	    keys = __webpack_require__(73);

	/**
	 * Creates an array of the own enumerable string keyed property values of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property values.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.values(new Foo);
	 * // => [1, 2] (iteration order is not guaranteed)
	 *
	 * _.values('hi');
	 * // => ['h', 'i']
	 */
	function values(object) {
	  return object == null ? [] : baseValues(object, keys(object));
	}

	module.exports = values;


/***/ })
/******/ ])
});
;