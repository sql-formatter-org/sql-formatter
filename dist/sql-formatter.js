(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["sqlFormatter"] = factory();
	else
		root["sqlFormatter"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/sqlFormatter.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/core/Formatter.js":
/*!*******************************!*\
  !*** ./src/core/Formatter.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Formatter; });
/* harmony import */ var _tokenTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tokenTypes */ "./src/core/tokenTypes.js");
/* harmony import */ var _Indentation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Indentation */ "./src/core/Indentation.js");
/* harmony import */ var _InlineBlock__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./InlineBlock */ "./src/core/InlineBlock.js");
/* harmony import */ var _Params__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Params */ "./src/core/Params.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils */ "./src/utils.js");
/* harmony import */ var _token__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./token */ "./src/core/token.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }








var Formatter = /*#__PURE__*/function () {
  /**
   * @param {Object} cfg
   *  @param {String} cfg.language
   *  @param {String} cfg.indent
   *  @param {Boolean} cfg.uppercase
   *  @param {Integer} cfg.linesBetweenQueries
   *  @param {Object} cfg.params
   */
  function Formatter(cfg) {
    _classCallCheck(this, Formatter);

    this.cfg = cfg;
    this.indentation = new _Indentation__WEBPACK_IMPORTED_MODULE_1__["default"](this.cfg.indent);
    this.inlineBlock = new _InlineBlock__WEBPACK_IMPORTED_MODULE_2__["default"]();
    this.params = new _Params__WEBPACK_IMPORTED_MODULE_3__["default"](this.cfg.params);
    this.previousReservedToken = {};
    this.tokens = [];
    this.index = 0;
  }
  /**
   * SQL Tokenizer for this formatter, provided by subclasses.
   */


  _createClass(Formatter, [{
    key: "tokenizer",
    value: function tokenizer() {
      throw new Error('tokenizer() not implemented by subclass');
    }
    /**
     * Reprocess and modify a token based on parsed context.
     *
     * @param {Object} token The token to modify
     *  @param {String} token.type
     *  @param {String} token.value
     * @return {Object} new token or the original
     *  @return {String} token.type
     *  @return {String} token.value
     */

  }, {
    key: "tokenOverride",
    value: function tokenOverride(token) {
      // subclasses can override this to modify tokens during formatting
      return token;
    }
    /**
     * Formats whitespace in a SQL string to make it easier to read.
     *
     * @param {String} query The SQL query string
     * @return {String} formatted query
     */

  }, {
    key: "format",
    value: function format(query) {
      this.tokens = this.tokenizer().tokenize(query);
      var formattedQuery = this.getFormattedQueryFromTokens();
      return formattedQuery.trim();
    }
  }, {
    key: "getFormattedQueryFromTokens",
    value: function getFormattedQueryFromTokens() {
      var _this = this;

      var formattedQuery = '';
      this.tokens.forEach(function (token, index) {
        _this.index = index;
        token = _this.tokenOverride(token);

        if (token.type === _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].LINE_COMMENT) {
          formattedQuery = _this.formatLineComment(token, formattedQuery);
        } else if (token.type === _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].BLOCK_COMMENT) {
          formattedQuery = _this.formatBlockComment(token, formattedQuery);
        } else if (token.type === _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].RESERVED_TOP_LEVEL) {
          formattedQuery = _this.formatTopLevelReservedWord(token, formattedQuery);
          _this.previousReservedToken = token;
        } else if (token.type === _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].RESERVED_TOP_LEVEL_NO_INDENT) {
          formattedQuery = _this.formatTopLevelReservedWordNoIndent(token, formattedQuery);
          _this.previousReservedToken = token;
        } else if (token.type === _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].RESERVED_NEWLINE) {
          formattedQuery = _this.formatNewlineReservedWord(token, formattedQuery);
          _this.previousReservedToken = token;
        } else if (token.type === _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].RESERVED) {
          formattedQuery = _this.formatWithSpaces(token, formattedQuery);
          _this.previousReservedToken = token;
        } else if (token.type === _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].OPEN_PAREN) {
          formattedQuery = _this.formatOpeningParentheses(token, formattedQuery);
        } else if (token.type === _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].CLOSE_PAREN) {
          formattedQuery = _this.formatClosingParentheses(token, formattedQuery);
        } else if (token.type === _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].PLACEHOLDER) {
          formattedQuery = _this.formatPlaceholder(token, formattedQuery);
        } else if (token.value === ',') {
          formattedQuery = _this.formatComma(token, formattedQuery);
        } else if (token.value === ':') {
          formattedQuery = _this.formatWithSpaceAfter(token, formattedQuery);
        } else if (token.value === '.') {
          formattedQuery = _this.formatWithoutSpaces(token, formattedQuery);
        } else if (token.value === ';') {
          formattedQuery = _this.formatQuerySeparator(token, formattedQuery);
        } else {
          formattedQuery = _this.formatWithSpaces(token, formattedQuery);
        }
      });
      return formattedQuery;
    }
  }, {
    key: "formatLineComment",
    value: function formatLineComment(token, query) {
      return this.addNewline(query + this.show(token));
    }
  }, {
    key: "formatBlockComment",
    value: function formatBlockComment(token, query) {
      return this.addNewline(this.addNewline(query) + this.indentComment(token.value));
    }
  }, {
    key: "indentComment",
    value: function indentComment(comment) {
      return comment.replace(/\n[\t ]*/g, '\n' + this.indentation.getIndent() + ' ');
    }
  }, {
    key: "formatTopLevelReservedWordNoIndent",
    value: function formatTopLevelReservedWordNoIndent(token, query) {
      this.indentation.decreaseTopLevel();
      query = this.addNewline(query) + this.equalizeWhitespace(this.show(token));
      return this.addNewline(query);
    }
  }, {
    key: "formatTopLevelReservedWord",
    value: function formatTopLevelReservedWord(token, query) {
      this.indentation.decreaseTopLevel();
      query = this.addNewline(query);
      this.indentation.increaseTopLevel();
      query += this.equalizeWhitespace(this.show(token));
      return this.addNewline(query);
    }
  }, {
    key: "formatNewlineReservedWord",
    value: function formatNewlineReservedWord(token, query) {
      if (Object(_token__WEBPACK_IMPORTED_MODULE_5__["isAnd"])(token) && Object(_token__WEBPACK_IMPORTED_MODULE_5__["isBetween"])(this.tokenLookBehind(2))) {
        return this.formatWithSpaces(token, query);
      }

      return this.addNewline(query) + this.equalizeWhitespace(this.show(token)) + ' ';
    } // Replace any sequence of whitespace characters with single space

  }, {
    key: "equalizeWhitespace",
    value: function equalizeWhitespace(string) {
      return string.replace(/[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+/g, ' ');
    } // Opening parentheses increase the block indent level and start a new line

  }, {
    key: "formatOpeningParentheses",
    value: function formatOpeningParentheses(token, query) {
      var _preserveWhitespaceFo, _this$tokenLookBehind;

      // Take out the preceding space unless there was whitespace there in the original query
      // or another opening parens or line comment
      var preserveWhitespaceFor = (_preserveWhitespaceFo = {}, _defineProperty(_preserveWhitespaceFo, _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].OPEN_PAREN, true), _defineProperty(_preserveWhitespaceFo, _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].LINE_COMMENT, true), _defineProperty(_preserveWhitespaceFo, _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].OPERATOR, true), _preserveWhitespaceFo);

      if (token.whitespaceBefore.length === 0 && !preserveWhitespaceFor[(_this$tokenLookBehind = this.tokenLookBehind()) === null || _this$tokenLookBehind === void 0 ? void 0 : _this$tokenLookBehind.type]) {
        query = Object(_utils__WEBPACK_IMPORTED_MODULE_4__["trimSpacesEnd"])(query);
      }

      query += this.show(token);
      this.inlineBlock.beginIfPossible(this.tokens, this.index);

      if (!this.inlineBlock.isActive()) {
        this.indentation.increaseBlockLevel();
        query = this.addNewline(query);
      }

      return query;
    } // Closing parentheses decrease the block indent level

  }, {
    key: "formatClosingParentheses",
    value: function formatClosingParentheses(token, query) {
      if (this.inlineBlock.isActive()) {
        this.inlineBlock.end();
        return this.formatWithSpaceAfter(token, query);
      } else {
        this.indentation.decreaseBlockLevel();
        return this.formatWithSpaces(token, this.addNewline(query));
      }
    }
  }, {
    key: "formatPlaceholder",
    value: function formatPlaceholder(token, query) {
      return query + this.params.get(token) + ' ';
    } // Commas start a new line (unless within inline parentheses or SQL "LIMIT" clause)

  }, {
    key: "formatComma",
    value: function formatComma(token, query) {
      query = Object(_utils__WEBPACK_IMPORTED_MODULE_4__["trimSpacesEnd"])(query) + this.show(token) + ' ';

      if (this.inlineBlock.isActive()) {
        return query;
      } else if (Object(_token__WEBPACK_IMPORTED_MODULE_5__["isLimit"])(this.previousReservedToken)) {
        return query;
      } else {
        return this.addNewline(query);
      }
    }
  }, {
    key: "formatWithSpaceAfter",
    value: function formatWithSpaceAfter(token, query) {
      return Object(_utils__WEBPACK_IMPORTED_MODULE_4__["trimSpacesEnd"])(query) + this.show(token) + ' ';
    }
  }, {
    key: "formatWithoutSpaces",
    value: function formatWithoutSpaces(token, query) {
      return Object(_utils__WEBPACK_IMPORTED_MODULE_4__["trimSpacesEnd"])(query) + this.show(token);
    }
  }, {
    key: "formatWithSpaces",
    value: function formatWithSpaces(token, query) {
      return query + this.show(token) + ' ';
    }
  }, {
    key: "formatQuerySeparator",
    value: function formatQuerySeparator(token, query) {
      this.indentation.resetIndentation();
      return Object(_utils__WEBPACK_IMPORTED_MODULE_4__["trimSpacesEnd"])(query) + this.show(token) + '\n'.repeat(this.cfg.linesBetweenQueries || 1);
    } // Converts token to string (uppercasing it if needed)

  }, {
    key: "show",
    value: function show(_ref) {
      var type = _ref.type,
          value = _ref.value;

      if (this.cfg.uppercase && (type === _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].RESERVED || type === _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].RESERVED_TOP_LEVEL || type === _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].RESERVED_TOP_LEVEL_NO_INDENT || type === _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].RESERVED_NEWLINE || type === _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].OPEN_PAREN || type === _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].CLOSE_PAREN)) {
        return value.toUpperCase();
      } else {
        return value;
      }
    }
  }, {
    key: "addNewline",
    value: function addNewline(query) {
      query = Object(_utils__WEBPACK_IMPORTED_MODULE_4__["trimSpacesEnd"])(query);

      if (!query.endsWith('\n')) {
        query += '\n';
      }

      return query + this.indentation.getIndent();
    }
  }, {
    key: "tokenLookBehind",
    value: function tokenLookBehind() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return this.tokens[this.index - n];
    }
  }, {
    key: "tokenLookAhead",
    value: function tokenLookAhead() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return this.tokens[this.index + n];
    }
  }]);

  return Formatter;
}();



/***/ }),

/***/ "./src/core/Indentation.js":
/*!*********************************!*\
  !*** ./src/core/Indentation.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Indentation; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/utils.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


var INDENT_TYPE_TOP_LEVEL = 'top-level';
var INDENT_TYPE_BLOCK_LEVEL = 'block-level';
/**
 * Manages indentation levels.
 *
 * There are two types of indentation levels:
 *
 * - BLOCK_LEVEL : increased by open-parenthesis
 * - TOP_LEVEL : increased by RESERVED_TOP_LEVEL words
 */

var Indentation = /*#__PURE__*/function () {
  /**
   * @param {String} indent Indent value, default is "  " (2 spaces)
   */
  function Indentation(indent) {
    _classCallCheck(this, Indentation);

    this.indent = indent || '  ';
    this.indentTypes = [];
  }
  /**
   * Returns current indentation string.
   * @return {String}
   */


  _createClass(Indentation, [{
    key: "getIndent",
    value: function getIndent() {
      return this.indent.repeat(this.indentTypes.length);
    }
    /**
     * Increases indentation by one top-level indent.
     */

  }, {
    key: "increaseTopLevel",
    value: function increaseTopLevel() {
      this.indentTypes.push(INDENT_TYPE_TOP_LEVEL);
    }
    /**
     * Increases indentation by one block-level indent.
     */

  }, {
    key: "increaseBlockLevel",
    value: function increaseBlockLevel() {
      this.indentTypes.push(INDENT_TYPE_BLOCK_LEVEL);
    }
    /**
     * Decreases indentation by one top-level indent.
     * Does nothing when the previous indent is not top-level.
     */

  }, {
    key: "decreaseTopLevel",
    value: function decreaseTopLevel() {
      if (this.indentTypes.length > 0 && Object(_utils__WEBPACK_IMPORTED_MODULE_0__["last"])(this.indentTypes) === INDENT_TYPE_TOP_LEVEL) {
        this.indentTypes.pop();
      }
    }
    /**
     * Decreases indentation by one block-level indent.
     * If there are top-level indents within the block-level indent,
     * throws away these as well.
     */

  }, {
    key: "decreaseBlockLevel",
    value: function decreaseBlockLevel() {
      while (this.indentTypes.length > 0) {
        var type = this.indentTypes.pop();

        if (type !== INDENT_TYPE_TOP_LEVEL) {
          break;
        }
      }
    }
  }, {
    key: "resetIndentation",
    value: function resetIndentation() {
      this.indentTypes = [];
    }
  }]);

  return Indentation;
}();



/***/ }),

/***/ "./src/core/InlineBlock.js":
/*!*********************************!*\
  !*** ./src/core/InlineBlock.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return InlineBlock; });
/* harmony import */ var _tokenTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tokenTypes */ "./src/core/tokenTypes.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


var INLINE_MAX_LENGTH = 50;
/**
 * Bookkeeper for inline blocks.
 *
 * Inline blocks are parenthized expressions that are shorter than INLINE_MAX_LENGTH.
 * These blocks are formatted on a single line, unlike longer parenthized
 * expressions where open-parenthesis causes newline and increase of indentation.
 */

var InlineBlock = /*#__PURE__*/function () {
  function InlineBlock() {
    _classCallCheck(this, InlineBlock);

    this.level = 0;
  }
  /**
   * Begins inline block when lookahead through upcoming tokens determines
   * that the block would be smaller than INLINE_MAX_LENGTH.
   * @param  {Object[]} tokens Array of all tokens
   * @param  {Number} index Current token position
   */


  _createClass(InlineBlock, [{
    key: "beginIfPossible",
    value: function beginIfPossible(tokens, index) {
      if (this.level === 0 && this.isInlineBlock(tokens, index)) {
        this.level = 1;
      } else if (this.level > 0) {
        this.level++;
      } else {
        this.level = 0;
      }
    }
    /**
     * Finishes current inline block.
     * There might be several nested ones.
     */

  }, {
    key: "end",
    value: function end() {
      this.level--;
    }
    /**
     * True when inside an inline block
     * @return {Boolean}
     */

  }, {
    key: "isActive",
    value: function isActive() {
      return this.level > 0;
    } // Check if this should be an inline parentheses block
    // Examples are "NOW()", "COUNT(*)", "int(10)", key(`somecolumn`), DECIMAL(7,2)

  }, {
    key: "isInlineBlock",
    value: function isInlineBlock(tokens, index) {
      var length = 0;
      var level = 0;

      for (var i = index; i < tokens.length; i++) {
        var token = tokens[i];
        length += token.value.length; // Overran max length

        if (length > INLINE_MAX_LENGTH) {
          return false;
        }

        if (token.type === _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].OPEN_PAREN) {
          level++;
        } else if (token.type === _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].CLOSE_PAREN) {
          level--;

          if (level === 0) {
            return true;
          }
        }

        if (this.isForbiddenToken(token)) {
          return false;
        }
      }

      return false;
    } // Reserved words that cause newlines, comments and semicolons
    // are not allowed inside inline parentheses block

  }, {
    key: "isForbiddenToken",
    value: function isForbiddenToken(_ref) {
      var type = _ref.type,
          value = _ref.value;
      return type === _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].RESERVED_TOP_LEVEL || type === _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].RESERVED_NEWLINE || type === _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].COMMENT || type === _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].BLOCK_COMMENT || value === ';';
    }
  }]);

  return InlineBlock;
}();



/***/ }),

/***/ "./src/core/Params.js":
/*!****************************!*\
  !*** ./src/core/Params.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Params; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Handles placeholder replacement with given params.
 */
var Params = /*#__PURE__*/function () {
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


  _createClass(Params, [{
    key: "get",
    value: function get(_ref) {
      var key = _ref.key,
          value = _ref.value;

      if (!this.params) {
        return value;
      }

      if (key) {
        return this.params[key];
      }

      return this.params[this.index++];
    }
  }]);

  return Params;
}();



/***/ }),

/***/ "./src/core/Tokenizer.js":
/*!*******************************!*\
  !*** ./src/core/Tokenizer.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Tokenizer; });
/* harmony import */ var _tokenTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tokenTypes */ "./src/core/tokenTypes.js");
/* harmony import */ var _regexFactory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./regexFactory */ "./src/core/regexFactory.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/utils.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }





var Tokenizer = /*#__PURE__*/function () {
  /**
   * @param {Object} cfg
   *  @param {String[]} cfg.reservedWords Reserved words in SQL
   *  @param {String[]} cfg.reservedTopLevelWords Words that are set to new line separately
   *  @param {String[]} cfg.reservedNewlineWords Words that are set to newline
   *  @param {String[]} cfg.reservedTopLevelWordsNoIndent Words that are top level but have no indentation
   *  @param {String[]} cfg.stringTypes String types to enable: "", '', ``, [], N''
   *  @param {String[]} cfg.openParens Opening parentheses to enable, like (, [
   *  @param {String[]} cfg.closeParens Closing parentheses to enable, like ), ]
   *  @param {String[]} cfg.indexedPlaceholderTypes Prefixes for indexed placeholders, like ?
   *  @param {String[]} cfg.namedPlaceholderTypes Prefixes for named placeholders, like @ and :
   *  @param {String[]} cfg.lineCommentTypes Line comments to enable, like # and --
   *  @param {String[]} cfg.specialWordChars Special chars that can be found inside of words, like @ and #
   *  @param {String[]} [cfg.operator] Additional operators to recognize
   */
  function Tokenizer(cfg) {
    _classCallCheck(this, Tokenizer);

    this.WHITESPACE_REGEX = /^([\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+)/;
    this.NUMBER_REGEX = /^((\x2D[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*)?[0-9]+(\.[0-9]+)?([Ee]\x2D?[0-9]+(\.[0-9]+)?)?|0x[0-9A-Fa-f]+|0b[01]+)\b/;
    this.OPERATOR_REGEX = _regexFactory__WEBPACK_IMPORTED_MODULE_1__["createOperatorRegex"](['<>', '<=', '>='].concat(_toConsumableArray(cfg.operators || [])));
    this.BLOCK_COMMENT_REGEX = /^(\/\*(?:(?![])[\s\S])*?(?:\*\/|$))/;
    this.LINE_COMMENT_REGEX = _regexFactory__WEBPACK_IMPORTED_MODULE_1__["createLineCommentRegex"](cfg.lineCommentTypes);
    this.RESERVED_TOP_LEVEL_REGEX = _regexFactory__WEBPACK_IMPORTED_MODULE_1__["createReservedWordRegex"](cfg.reservedTopLevelWords);
    this.RESERVED_TOP_LEVEL_NO_INDENT_REGEX = _regexFactory__WEBPACK_IMPORTED_MODULE_1__["createReservedWordRegex"](cfg.reservedTopLevelWordsNoIndent);
    this.RESERVED_NEWLINE_REGEX = _regexFactory__WEBPACK_IMPORTED_MODULE_1__["createReservedWordRegex"](cfg.reservedNewlineWords);
    this.RESERVED_PLAIN_REGEX = _regexFactory__WEBPACK_IMPORTED_MODULE_1__["createReservedWordRegex"](cfg.reservedWords);
    this.WORD_REGEX = _regexFactory__WEBPACK_IMPORTED_MODULE_1__["createWordRegex"](cfg.specialWordChars);
    this.STRING_REGEX = _regexFactory__WEBPACK_IMPORTED_MODULE_1__["createStringRegex"](cfg.stringTypes);
    this.OPEN_PAREN_REGEX = _regexFactory__WEBPACK_IMPORTED_MODULE_1__["createParenRegex"](cfg.openParens);
    this.CLOSE_PAREN_REGEX = _regexFactory__WEBPACK_IMPORTED_MODULE_1__["createParenRegex"](cfg.closeParens);
    this.INDEXED_PLACEHOLDER_REGEX = _regexFactory__WEBPACK_IMPORTED_MODULE_1__["createPlaceholderRegex"](cfg.indexedPlaceholderTypes, '[0-9]*');
    this.IDENT_NAMED_PLACEHOLDER_REGEX = _regexFactory__WEBPACK_IMPORTED_MODULE_1__["createPlaceholderRegex"](cfg.namedPlaceholderTypes, '[a-zA-Z0-9._$]+');
    this.STRING_NAMED_PLACEHOLDER_REGEX = _regexFactory__WEBPACK_IMPORTED_MODULE_1__["createPlaceholderRegex"](cfg.namedPlaceholderTypes, _regexFactory__WEBPACK_IMPORTED_MODULE_1__["createStringPattern"](cfg.stringTypes));
  }
  /**
   * Takes a SQL string and breaks it into tokens.
   * Each token is an object with type and value.
   *
   * @param {String} input The SQL string
   * @return {Object[]} tokens An array of tokens.
   *  @return {String} token.type
   *  @return {String} token.value
   *  @return {String} token.whitespaceBefore Preceding whitespace
   */


  _createClass(Tokenizer, [{
    key: "tokenize",
    value: function tokenize(input) {
      var tokens = [];
      var token; // Keep processing the string until it is empty

      while (input.length) {
        // grab any preceding whitespace
        var whitespaceBefore = this.getWhitespace(input);
        input = input.substring(whitespaceBefore.length);

        if (input.length) {
          // Get the next token and the token type
          token = this.getNextToken(input, token); // Advance the string

          input = input.substring(token.value.length);
          tokens.push(_objectSpread(_objectSpread({}, token), {}, {
            whitespaceBefore: whitespaceBefore
          }));
        }
      }

      return tokens;
    }
  }, {
    key: "getWhitespace",
    value: function getWhitespace(input) {
      var matches = input.match(this.WHITESPACE_REGEX);
      return matches ? matches[1] : '';
    }
  }, {
    key: "getNextToken",
    value: function getNextToken(input, previousToken) {
      return this.getCommentToken(input) || this.getStringToken(input) || this.getOpenParenToken(input) || this.getCloseParenToken(input) || this.getPlaceholderToken(input) || this.getNumberToken(input) || this.getReservedWordToken(input, previousToken) || this.getWordToken(input) || this.getOperatorToken(input);
    }
  }, {
    key: "getCommentToken",
    value: function getCommentToken(input) {
      return this.getLineCommentToken(input) || this.getBlockCommentToken(input);
    }
  }, {
    key: "getLineCommentToken",
    value: function getLineCommentToken(input) {
      return this.getTokenOnFirstMatch({
        input: input,
        type: _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].LINE_COMMENT,
        regex: this.LINE_COMMENT_REGEX
      });
    }
  }, {
    key: "getBlockCommentToken",
    value: function getBlockCommentToken(input) {
      return this.getTokenOnFirstMatch({
        input: input,
        type: _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].BLOCK_COMMENT,
        regex: this.BLOCK_COMMENT_REGEX
      });
    }
  }, {
    key: "getStringToken",
    value: function getStringToken(input) {
      return this.getTokenOnFirstMatch({
        input: input,
        type: _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].STRING,
        regex: this.STRING_REGEX
      });
    }
  }, {
    key: "getOpenParenToken",
    value: function getOpenParenToken(input) {
      return this.getTokenOnFirstMatch({
        input: input,
        type: _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].OPEN_PAREN,
        regex: this.OPEN_PAREN_REGEX
      });
    }
  }, {
    key: "getCloseParenToken",
    value: function getCloseParenToken(input) {
      return this.getTokenOnFirstMatch({
        input: input,
        type: _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].CLOSE_PAREN,
        regex: this.CLOSE_PAREN_REGEX
      });
    }
  }, {
    key: "getPlaceholderToken",
    value: function getPlaceholderToken(input) {
      return this.getIdentNamedPlaceholderToken(input) || this.getStringNamedPlaceholderToken(input) || this.getIndexedPlaceholderToken(input);
    }
  }, {
    key: "getIdentNamedPlaceholderToken",
    value: function getIdentNamedPlaceholderToken(input) {
      return this.getPlaceholderTokenWithKey({
        input: input,
        regex: this.IDENT_NAMED_PLACEHOLDER_REGEX,
        parseKey: function parseKey(v) {
          return v.slice(1);
        }
      });
    }
  }, {
    key: "getStringNamedPlaceholderToken",
    value: function getStringNamedPlaceholderToken(input) {
      var _this = this;

      return this.getPlaceholderTokenWithKey({
        input: input,
        regex: this.STRING_NAMED_PLACEHOLDER_REGEX,
        parseKey: function parseKey(v) {
          return _this.getEscapedPlaceholderKey({
            key: v.slice(2, -1),
            quoteChar: v.slice(-1)
          });
        }
      });
    }
  }, {
    key: "getIndexedPlaceholderToken",
    value: function getIndexedPlaceholderToken(input) {
      return this.getPlaceholderTokenWithKey({
        input: input,
        regex: this.INDEXED_PLACEHOLDER_REGEX,
        parseKey: function parseKey(v) {
          return v.slice(1);
        }
      });
    }
  }, {
    key: "getPlaceholderTokenWithKey",
    value: function getPlaceholderTokenWithKey(_ref) {
      var input = _ref.input,
          regex = _ref.regex,
          parseKey = _ref.parseKey;
      var token = this.getTokenOnFirstMatch({
        input: input,
        regex: regex,
        type: _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].PLACEHOLDER
      });

      if (token) {
        token.key = parseKey(token.value);
      }

      return token;
    }
  }, {
    key: "getEscapedPlaceholderKey",
    value: function getEscapedPlaceholderKey(_ref2) {
      var key = _ref2.key,
          quoteChar = _ref2.quoteChar;
      return key.replace(new RegExp(Object(_utils__WEBPACK_IMPORTED_MODULE_2__["escapeRegExp"])('\\' + quoteChar), 'gu'), quoteChar);
    } // Decimal, binary, or hex numbers

  }, {
    key: "getNumberToken",
    value: function getNumberToken(input) {
      return this.getTokenOnFirstMatch({
        input: input,
        type: _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].NUMBER,
        regex: this.NUMBER_REGEX
      });
    } // Punctuation and symbols

  }, {
    key: "getOperatorToken",
    value: function getOperatorToken(input) {
      return this.getTokenOnFirstMatch({
        input: input,
        type: _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].OPERATOR,
        regex: this.OPERATOR_REGEX
      });
    }
  }, {
    key: "getReservedWordToken",
    value: function getReservedWordToken(input, previousToken) {
      // A reserved word cannot be preceded by a "."
      // this makes it so in "mytable.from", "from" is not considered a reserved word
      if (previousToken && previousToken.value && previousToken.value === '.') {
        return undefined;
      }

      return this.getTopLevelReservedToken(input) || this.getNewlineReservedToken(input) || this.getTopLevelReservedTokenNoIndent(input) || this.getPlainReservedToken(input);
    }
  }, {
    key: "getTopLevelReservedToken",
    value: function getTopLevelReservedToken(input) {
      return this.getTokenOnFirstMatch({
        input: input,
        type: _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].RESERVED_TOP_LEVEL,
        regex: this.RESERVED_TOP_LEVEL_REGEX
      });
    }
  }, {
    key: "getNewlineReservedToken",
    value: function getNewlineReservedToken(input) {
      return this.getTokenOnFirstMatch({
        input: input,
        type: _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].RESERVED_NEWLINE,
        regex: this.RESERVED_NEWLINE_REGEX
      });
    }
  }, {
    key: "getTopLevelReservedTokenNoIndent",
    value: function getTopLevelReservedTokenNoIndent(input) {
      return this.getTokenOnFirstMatch({
        input: input,
        type: _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].RESERVED_TOP_LEVEL_NO_INDENT,
        regex: this.RESERVED_TOP_LEVEL_NO_INDENT_REGEX
      });
    }
  }, {
    key: "getPlainReservedToken",
    value: function getPlainReservedToken(input) {
      return this.getTokenOnFirstMatch({
        input: input,
        type: _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].RESERVED,
        regex: this.RESERVED_PLAIN_REGEX
      });
    }
  }, {
    key: "getWordToken",
    value: function getWordToken(input) {
      return this.getTokenOnFirstMatch({
        input: input,
        type: _tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].WORD,
        regex: this.WORD_REGEX
      });
    }
  }, {
    key: "getTokenOnFirstMatch",
    value: function getTokenOnFirstMatch(_ref3) {
      var input = _ref3.input,
          type = _ref3.type,
          regex = _ref3.regex;
      var matches = input.match(regex);
      return matches ? {
        type: type,
        value: matches[1]
      } : undefined;
    }
  }]);

  return Tokenizer;
}();



/***/ }),

/***/ "./src/core/regexFactory.js":
/*!**********************************!*\
  !*** ./src/core/regexFactory.js ***!
  \**********************************/
/*! exports provided: createOperatorRegex, createLineCommentRegex, createReservedWordRegex, createWordRegex, createStringRegex, createStringPattern, createParenRegex, createPlaceholderRegex */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createOperatorRegex", function() { return createOperatorRegex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createLineCommentRegex", function() { return createLineCommentRegex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createReservedWordRegex", function() { return createReservedWordRegex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createWordRegex", function() { return createWordRegex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createStringRegex", function() { return createStringRegex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createStringPattern", function() { return createStringPattern; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createParenRegex", function() { return createParenRegex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createPlaceholderRegex", function() { return createPlaceholderRegex; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/utils.js");

function createOperatorRegex(multiLetterOperators) {
  return new RegExp("^(".concat(Object(_utils__WEBPACK_IMPORTED_MODULE_0__["sortByLengthDesc"])(multiLetterOperators).map(_utils__WEBPACK_IMPORTED_MODULE_0__["escapeRegExp"]).join('|'), "|.)"), 'u');
}
function createLineCommentRegex(lineCommentTypes) {
  return new RegExp("^((?:".concat(lineCommentTypes.map(function (c) {
    return Object(_utils__WEBPACK_IMPORTED_MODULE_0__["escapeRegExp"])(c);
  }).join('|'), ").*?)(?:\r\n|\r|\n|$)"), 'u');
}
function createReservedWordRegex(reservedWords) {
  if (reservedWords.length === 0) {
    return new RegExp("^\b$", 'u');
  }

  var reservedWordsPattern = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["sortByLengthDesc"])(reservedWords).join('|').replace(/ /g, '\\s+');
  return new RegExp("^(".concat(reservedWordsPattern, ")\\b"), 'iu');
}
function createWordRegex() {
  var specialChars = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return new RegExp("^([\\p{Alphabetic}\\p{Mark}\\p{Decimal_Number}\\p{Connector_Punctuation}\\p{Join_Control}".concat(specialChars.join(''), "]+)"), 'u');
}
function createStringRegex(stringTypes) {
  return new RegExp('^(' + createStringPattern(stringTypes) + ')', 'u');
} // This enables the following string patterns:
// 1. backtick quoted string using `` to escape
// 2. square bracket quoted string (SQL Server) using ]] to escape
// 3. double quoted string using "" or \" to escape
// 4. single quoted string using '' or \' to escape
// 5. national character quoted string using N'' or N\' to escape
// 6. Unicode single-quoted string using \' to escape
// 7. Unicode double-quoted string using \" to escape
// 8. PostgreSQL dollar-quoted strings

function createStringPattern(stringTypes) {
  var patterns = {
    '``': '((`[^`]*($|`))+)',
    '{}': '((\\{[^\\}]*($|\\}))+)',
    '[]': '((\\[[^\\]]*($|\\]))(\\][^\\]]*($|\\]))*)',
    '""': '(("[^"\\\\]*(?:\\\\.[^"\\\\]*)*("|$))+)',
    "''": "(('[^'\\\\]*(?:\\\\.[^'\\\\]*)*('|$))+)",
    "N''": "((N'[^'\\\\]*(?:\\\\.[^'\\\\]*)*('|$))+)",
    "U&''": "((U&'[^'\\\\]*(?:\\\\.[^'\\\\]*)*('|$))+)",
    'U&""': '((U&"[^"\\\\]*(?:\\\\.[^"\\\\]*)*("|$))+)',
    $$: '((?<tag>\\$\\w*\\$)[\\s\\S]*?(?:\\k<tag>|$))'
  };
  return stringTypes.map(function (t) {
    return patterns[t];
  }).join('|');
}
function createParenRegex(parens) {
  return new RegExp('^(' + parens.map(escapeParen).join('|') + ')', 'iu');
}

function escapeParen(paren) {
  if (paren.length === 1) {
    // A single punctuation character
    return Object(_utils__WEBPACK_IMPORTED_MODULE_0__["escapeRegExp"])(paren);
  } else {
    // longer word
    return '\\b' + paren + '\\b';
  }
}

function createPlaceholderRegex(types, pattern) {
  if (Object(_utils__WEBPACK_IMPORTED_MODULE_0__["isEmpty"])(types)) {
    return false;
  }

  var typesRegex = types.map(_utils__WEBPACK_IMPORTED_MODULE_0__["escapeRegExp"]).join('|');
  return new RegExp("^((?:".concat(typesRegex, ")(?:").concat(pattern, "))"), 'u');
}

/***/ }),

/***/ "./src/core/token.js":
/*!***************************!*\
  !*** ./src/core/token.js ***!
  \***************************/
/*! exports provided: isAnd, isBetween, isLimit, isSet, isBy, isWindow, isEnd */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isAnd", function() { return isAnd; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isBetween", function() { return isBetween; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isLimit", function() { return isLimit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isSet", function() { return isSet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isBy", function() { return isBy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isWindow", function() { return isWindow; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isEnd", function() { return isEnd; });
/* harmony import */ var _tokenTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tokenTypes */ "./src/core/tokenTypes.js");


var isToken = function isToken(type, regex) {
  return function (token) {
    return (token === null || token === void 0 ? void 0 : token.type) === type && regex.test(token === null || token === void 0 ? void 0 : token.value);
  };
};

var isAnd = isToken(_tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].RESERVED_NEWLINE, /^AND$/i);
var isBetween = isToken(_tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].RESERVED, /^BETWEEN$/i);
var isLimit = isToken(_tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].RESERVED_TOP_LEVEL, /^LIMIT$/i);
var isSet = isToken(_tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].RESERVED_TOP_LEVEL, /^[S\u017F]ET$/i);
var isBy = isToken(_tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].RESERVED, /^BY$/i);
var isWindow = isToken(_tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].RESERVED_TOP_LEVEL, /^WINDOW$/i);
var isEnd = isToken(_tokenTypes__WEBPACK_IMPORTED_MODULE_0__["default"].CLOSE_PAREN, /^END$/i);

/***/ }),

/***/ "./src/core/tokenTypes.js":
/*!********************************!*\
  !*** ./src/core/tokenTypes.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Constants for token types
 */
/* harmony default export */ __webpack_exports__["default"] = ({
  WORD: 'word',
  STRING: 'string',
  RESERVED: 'reserved',
  RESERVED_TOP_LEVEL: 'reserved-top-level',
  RESERVED_TOP_LEVEL_NO_INDENT: 'reserved-top-level-no-indent',
  RESERVED_NEWLINE: 'reserved-newline',
  OPERATOR: 'operator',
  OPEN_PAREN: 'open-paren',
  CLOSE_PAREN: 'close-paren',
  LINE_COMMENT: 'line-comment',
  BLOCK_COMMENT: 'block-comment',
  NUMBER: 'number',
  PLACEHOLDER: 'placeholder'
});

/***/ }),

/***/ "./src/languages/Db2Formatter.js":
/*!***************************************!*\
  !*** ./src/languages/Db2Formatter.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Db2Formatter; });
/* harmony import */ var _core_Formatter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/Formatter */ "./src/core/Formatter.js");
/* harmony import */ var _core_Tokenizer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/Tokenizer */ "./src/core/Tokenizer.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var reservedWords = ['ABS', 'ACTIVATE', 'ALIAS', 'ALL', 'ALLOCATE', 'ALLOW', 'ALTER', 'ANY', 'ARE', 'ARRAY', 'AS', 'ASC', 'ASENSITIVE', 'ASSOCIATE', 'ASUTIME', 'ASYMMETRIC', 'AT', 'ATOMIC', 'ATTRIBUTES', 'AUDIT', 'AUTHORIZATION', 'AUX', 'AUXILIARY', 'AVG', 'BEFORE', 'BEGIN', 'BETWEEN', 'BIGINT', 'BINARY', 'BLOB', 'BOOLEAN', 'BOTH', 'BUFFERPOOL', 'BY', 'CACHE', 'CALL', 'CALLED', 'CAPTURE', 'CARDINALITY', 'CASCADED', 'CASE', 'CAST', 'CCSID', 'CEIL', 'CEILING', 'CHAR', 'CHARACTER', 'CHARACTER_LENGTH', 'CHAR_LENGTH', 'CHECK', 'CLOB', 'CLONE', 'CLOSE', 'CLUSTER', 'COALESCE', 'COLLATE', 'COLLECT', 'COLLECTION', 'COLLID', 'COLUMN', 'COMMENT', 'COMMIT', 'CONCAT', 'CONDITION', 'CONNECT', 'CONNECTION', 'CONSTRAINT', 'CONTAINS', 'CONTINUE', 'CONVERT', 'CORR', 'CORRESPONDING', 'COUNT', 'COUNT_BIG', 'COVAR_POP', 'COVAR_SAMP', 'CREATE', 'CROSS', 'CUBE', 'CUME_DIST', 'CURRENT', 'CURRENT_DATE', 'CURRENT_DEFAULT_TRANSFORM_GROUP', 'CURRENT_LC_CTYPE', 'CURRENT_PATH', 'CURRENT_ROLE', 'CURRENT_SCHEMA', 'CURRENT_SERVER', 'CURRENT_TIME', 'CURRENT_TIMESTAMP', 'CURRENT_TIMEZONE', 'CURRENT_TRANSFORM_GROUP_FOR_TYPE', 'CURRENT_USER', 'CURSOR', 'CYCLE', 'DATA', 'DATABASE', 'DATAPARTITIONNAME', 'DATAPARTITIONNUM', 'DATE', 'DAY', 'DAYS', 'DB2GENERAL', 'DB2GENRL', 'DB2SQL', 'DBINFO', 'DBPARTITIONNAME', 'DBPARTITIONNUM', 'DEALLOCATE', 'DEC', 'DECIMAL', 'DECLARE', 'DEFAULT', 'DEFAULTS', 'DEFINITION', 'DELETE', 'DENSERANK', 'DENSE_RANK', 'DEREF', 'DESCRIBE', 'DESCRIPTOR', 'DETERMINISTIC', 'DIAGNOSTICS', 'DISABLE', 'DISALLOW', 'DISCONNECT', 'DISTINCT', 'DO', 'DOCUMENT', 'DOUBLE', 'DROP', 'DSSIZE', 'DYNAMIC', 'EACH', 'EDITPROC', 'ELEMENT', 'ELSE', 'ELSEIF', 'ENABLE', 'ENCODING', 'ENCRYPTION', 'END', 'END-EXEC', 'ENDING', 'ERASE', 'ESCAPE', 'EVERY', 'EXCEPTION', 'EXCLUDING', 'EXCLUSIVE', 'EXEC', 'EXECUTE', 'EXISTS', 'EXIT', 'EXP', 'EXPLAIN', 'EXTENDED', 'EXTERNAL', 'EXTRACT', 'FALSE', 'FENCED', 'FETCH', 'FIELDPROC', 'FILE', 'FILTER', 'FINAL', 'FIRST', 'FLOAT', 'FLOOR', 'FOR', 'FOREIGN', 'FREE', 'FULL', 'FUNCTION', 'FUSION', 'GENERAL', 'GENERATED', 'GET', 'GLOBAL', 'GOTO', 'GRANT', 'GRAPHIC', 'GROUP', 'GROUPING', 'HANDLER', 'HASH', 'HASHED_VALUE', 'HINT', 'HOLD', 'HOUR', 'HOURS', 'IDENTITY', 'IF', 'IMMEDIATE', 'IN', 'INCLUDING', 'INCLUSIVE', 'INCREMENT', 'INDEX', 'INDICATOR', 'INDICATORS', 'INF', 'INFINITY', 'INHERIT', 'INNER', 'INOUT', 'INSENSITIVE', 'INSERT', 'INT', 'INTEGER', 'INTEGRITY', 'INTERSECTION', 'INTERVAL', 'INTO', 'IS', 'ISOBID', 'ISOLATION', 'ITERATE', 'JAR', 'JAVA', 'KEEP', 'KEY', 'LABEL', 'LANGUAGE', 'LARGE', 'LATERAL', 'LC_CTYPE', 'LEADING', 'LEAVE', 'LEFT', 'LIKE', 'LINKTYPE', 'LN', 'LOCAL', 'LOCALDATE', 'LOCALE', 'LOCALTIME', 'LOCALTIMESTAMP', 'LOCATOR', 'LOCATORS', 'LOCK', 'LOCKMAX', 'LOCKSIZE', 'LONG', 'LOOP', 'LOWER', 'MAINTAINED', 'MATCH', 'MATERIALIZED', 'MAX', 'MAXVALUE', 'MEMBER', 'MERGE', 'METHOD', 'MICROSECOND', 'MICROSECONDS', 'MIN', 'MINUTE', 'MINUTES', 'MINVALUE', 'MOD', 'MODE', 'MODIFIES', 'MODULE', 'MONTH', 'MONTHS', 'MULTISET', 'NAN', 'NATIONAL', 'NATURAL', 'NCHAR', 'NCLOB', 'NEW', 'NEW_TABLE', 'NEXTVAL', 'NO', 'NOCACHE', 'NOCYCLE', 'NODENAME', 'NODENUMBER', 'NOMAXVALUE', 'NOMINVALUE', 'NONE', 'NOORDER', 'NORMALIZE', 'NORMALIZED', 'NOT', 'NULL', 'NULLIF', 'NULLS', 'NUMERIC', 'NUMPARTS', 'OBID', 'OCTET_LENGTH', 'OF', 'OFFSET', 'OLD', 'OLD_TABLE', 'ON', 'ONLY', 'OPEN', 'OPTIMIZATION', 'OPTIMIZE', 'OPTION', 'ORDER', 'OUT', 'OUTER', 'OVER', 'OVERLAPS', 'OVERLAY', 'OVERRIDING', 'PACKAGE', 'PADDED', 'PAGESIZE', 'PARAMETER', 'PART', 'PARTITION', 'PARTITIONED', 'PARTITIONING', 'PARTITIONS', 'PASSWORD', 'PATH', 'PERCENTILE_CONT', 'PERCENTILE_DISC', 'PERCENT_RANK', 'PIECESIZE', 'PLAN', 'POSITION', 'POWER', 'PRECISION', 'PREPARE', 'PREVVAL', 'PRIMARY', 'PRIQTY', 'PRIVILEGES', 'PROCEDURE', 'PROGRAM', 'PSID', 'PUBLIC', 'QUERY', 'QUERYNO', 'RANGE', 'RANK', 'READ', 'READS', 'REAL', 'RECOVERY', 'RECURSIVE', 'REF', 'REFERENCES', 'REFERENCING', 'REFRESH', 'REGR_AVGX', 'REGR_AVGY', 'REGR_COUNT', 'REGR_INTERCEPT', 'REGR_R2', 'REGR_SLOPE', 'REGR_SXX', 'REGR_SXY', 'REGR_SYY', 'RELEASE', 'RENAME', 'REPEAT', 'RESET', 'RESIGNAL', 'RESTART', 'RESTRICT', 'RESULT', 'RESULT_SET_LOCATOR', 'RETURN', 'RETURNS', 'REVOKE', 'RIGHT', 'ROLE', 'ROLLBACK', 'ROLLUP', 'ROUND_CEILING', 'ROUND_DOWN', 'ROUND_FLOOR', 'ROUND_HALF_DOWN', 'ROUND_HALF_EVEN', 'ROUND_HALF_UP', 'ROUND_UP', 'ROUTINE', 'ROW', 'ROWNUMBER', 'ROWS', 'ROWSET', 'ROW_NUMBER', 'RRN', 'RUN', 'SAVEPOINT', 'SCHEMA', 'SCOPE', 'SCRATCHPAD', 'SCROLL', 'SEARCH', 'SECOND', 'SECONDS', 'SECQTY', 'SECURITY', 'SENSITIVE', 'SEQUENCE', 'SESSION', 'SESSION_USER', 'SIGNAL', 'SIMILAR', 'SIMPLE', 'SMALLINT', 'SNAN', 'SOME', 'SOURCE', 'SPECIFIC', 'SPECIFICTYPE', 'SQL', 'SQLEXCEPTION', 'SQLID', 'SQLSTATE', 'SQLWARNING', 'SQRT', 'STACKED', 'STANDARD', 'START', 'STARTING', 'STATEMENT', 'STATIC', 'STATMENT', 'STAY', 'STDDEV_POP', 'STDDEV_SAMP', 'STOGROUP', 'STORES', 'STYLE', 'SUBMULTISET', 'SUBSTRING', 'SUM', 'SUMMARY', 'SYMMETRIC', 'SYNONYM', 'SYSFUN', 'SYSIBM', 'SYSPROC', 'SYSTEM', 'SYSTEM_USER', 'TABLE', 'TABLESAMPLE', 'TABLESPACE', 'THEN', 'TIME', 'TIMESTAMP', 'TIMEZONE_HOUR', 'TIMEZONE_MINUTE', 'TO', 'TRAILING', 'TRANSACTION', 'TRANSLATE', 'TRANSLATION', 'TREAT', 'TRIGGER', 'TRIM', 'TRUE', 'TRUNCATE', 'TYPE', 'UESCAPE', 'UNDO', 'UNIQUE', 'UNKNOWN', 'UNNEST', 'UNTIL', 'UPPER', 'USAGE', 'USER', 'USING', 'VALIDPROC', 'VALUE', 'VARCHAR', 'VARIABLE', 'VARIANT', 'VARYING', 'VAR_POP', 'VAR_SAMP', 'VCAT', 'VERSION', 'VIEW', 'VOLATILE', 'VOLUMES', 'WHEN', 'WHENEVER', 'WHILE', 'WIDTH_BUCKET', 'WINDOW', 'WITH', 'WITHIN', 'WITHOUT', 'WLM', 'WRITE', 'XMLELEMENT', 'XMLEXISTS', 'XMLNAMESPACES', 'YEAR', 'YEARS'];
var reservedTopLevelWords = ['ADD', 'AFTER', 'ALTER COLUMN', 'ALTER TABLE', 'DELETE FROM', 'EXCEPT', 'FETCH FIRST', 'FROM', 'GROUP BY', 'GO', 'HAVING', 'INSERT INTO', 'INTERSECT', 'LIMIT', 'ORDER BY', 'SELECT', 'SET CURRENT SCHEMA', 'SET SCHEMA', 'SET', 'UPDATE', 'VALUES', 'WHERE'];
var reservedTopLevelWordsNoIndent = ['INTERSECT', 'INTERSECT ALL', 'MINUS', 'UNION', 'UNION ALL'];
var reservedNewlineWords = ['AND', 'OR', // joins
'JOIN', 'INNER JOIN', 'LEFT JOIN', 'LEFT OUTER JOIN', 'RIGHT JOIN', 'RIGHT OUTER JOIN', 'FULL JOIN', 'FULL OUTER JOIN', 'CROSS JOIN', 'NATURAL JOIN']; // For reference: https://www.ibm.com/support/knowledgecenter/en/ssw_ibm_i_72/db2/rbafzintro.htm

var Db2Formatter = /*#__PURE__*/function (_Formatter) {
  _inherits(Db2Formatter, _Formatter);

  var _super = _createSuper(Db2Formatter);

  function Db2Formatter() {
    _classCallCheck(this, Db2Formatter);

    return _super.apply(this, arguments);
  }

  _createClass(Db2Formatter, [{
    key: "tokenizer",
    value: function tokenizer() {
      return new _core_Tokenizer__WEBPACK_IMPORTED_MODULE_1__["default"]({
        reservedWords: reservedWords,
        reservedTopLevelWords: reservedTopLevelWords,
        reservedNewlineWords: reservedNewlineWords,
        reservedTopLevelWordsNoIndent: reservedTopLevelWordsNoIndent,
        stringTypes: ["\"\"", "''", '``', '[]'],
        openParens: ['('],
        closeParens: [')'],
        indexedPlaceholderTypes: ['?'],
        namedPlaceholderTypes: [':'],
        lineCommentTypes: ['--'],
        specialWordChars: ['#', '@', "x'"],
        operators: ['**', '!=', '!>', '!>', '||']
      });
    }
  }]);

  return Db2Formatter;
}(_core_Formatter__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),

/***/ "./src/languages/MariaDbFormatter.js":
/*!*******************************************!*\
  !*** ./src/languages/MariaDbFormatter.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MariaDbFormatter; });
/* harmony import */ var _core_Formatter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/Formatter */ "./src/core/Formatter.js");
/* harmony import */ var _core_Tokenizer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/Tokenizer */ "./src/core/Tokenizer.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var reservedWords = ['ACCESSIBLE', 'ADD', 'ALL', 'ALTER', 'ANALYZE', 'AND', 'AS', 'ASC', 'ASENSITIVE', 'BEFORE', 'BETWEEN', 'BIGINT', 'BINARY', 'BLOB', 'BOTH', 'BY', 'CALL', 'CASCADE', 'CASE', 'CHANGE', 'CHAR', 'CHARACTER', 'CHECK', 'COLLATE', 'COLUMN', 'CONDITION', 'CONSTRAINT', 'CONTINUE', 'CONVERT', 'CREATE', 'CROSS', 'CURRENT_DATE', 'CURRENT_ROLE', 'CURRENT_TIME', 'CURRENT_TIMESTAMP', 'CURRENT_USER', 'CURSOR', 'DATABASE', 'DATABASES', 'DAY_HOUR', 'DAY_MICROSECOND', 'DAY_MINUTE', 'DAY_SECOND', 'DEC', 'DECIMAL', 'DECLARE', 'DEFAULT', 'DELAYED', 'DELETE', 'DESC', 'DESCRIBE', 'DETERMINISTIC', 'DISTINCT', 'DISTINCTROW', 'DIV', 'DO_DOMAIN_IDS', 'DOUBLE', 'DROP', 'DUAL', 'EACH', 'ELSE', 'ELSEIF', 'ENCLOSED', 'ESCAPED', 'EXCEPT', 'EXISTS', 'EXIT', 'EXPLAIN', 'FALSE', 'FETCH', 'FLOAT', 'FLOAT4', 'FLOAT8', 'FOR', 'FORCE', 'FOREIGN', 'FROM', 'FULLTEXT', 'GENERAL', 'GRANT', 'GROUP', 'HAVING', 'HIGH_PRIORITY', 'HOUR_MICROSECOND', 'HOUR_MINUTE', 'HOUR_SECOND', 'IF', 'IGNORE', 'IGNORE_DOMAIN_IDS', 'IGNORE_SERVER_IDS', 'IN', 'INDEX', 'INFILE', 'INNER', 'INOUT', 'INSENSITIVE', 'INSERT', 'INT', 'INT1', 'INT2', 'INT3', 'INT4', 'INT8', 'INTEGER', 'INTERSECT', 'INTERVAL', 'INTO', 'IS', 'ITERATE', 'JOIN', 'KEY', 'KEYS', 'KILL', 'LEADING', 'LEAVE', 'LEFT', 'LIKE', 'LIMIT', 'LINEAR', 'LINES', 'LOAD', 'LOCALTIME', 'LOCALTIMESTAMP', 'LOCK', 'LONG', 'LONGBLOB', 'LONGTEXT', 'LOOP', 'LOW_PRIORITY', 'MASTER_HEARTBEAT_PERIOD', 'MASTER_SSL_VERIFY_SERVER_CERT', 'MATCH', 'MAXVALUE', 'MEDIUMBLOB', 'MEDIUMINT', 'MEDIUMTEXT', 'MIDDLEINT', 'MINUTE_MICROSECOND', 'MINUTE_SECOND', 'MOD', 'MODIFIES', 'NATURAL', 'NOT', 'NO_WRITE_TO_BINLOG', 'NULL', 'NUMERIC', 'ON', 'OPTIMIZE', 'OPTION', 'OPTIONALLY', 'OR', 'ORDER', 'OUT', 'OUTER', 'OUTFILE', 'OVER', 'PAGE_CHECKSUM', 'PARSE_VCOL_EXPR', 'PARTITION', 'POSITION', 'PRECISION', 'PRIMARY', 'PROCEDURE', 'PURGE', 'RANGE', 'READ', 'READS', 'READ_WRITE', 'REAL', 'RECURSIVE', 'REF_SYSTEM_ID', 'REFERENCES', 'REGEXP', 'RELEASE', 'RENAME', 'REPEAT', 'REPLACE', 'REQUIRE', 'RESIGNAL', 'RESTRICT', 'RETURN', 'RETURNING', 'REVOKE', 'RIGHT', 'RLIKE', 'ROWS', 'SCHEMA', 'SCHEMAS', 'SECOND_MICROSECOND', 'SELECT', 'SENSITIVE', 'SEPARATOR', 'SET', 'SHOW', 'SIGNAL', 'SLOW', 'SMALLINT', 'SPATIAL', 'SPECIFIC', 'SQL', 'SQLEXCEPTION', 'SQLSTATE', 'SQLWARNING', 'SQL_BIG_RESULT', 'SQL_CALC_FOUND_ROWS', 'SQL_SMALL_RESULT', 'SSL', 'STARTING', 'STATS_AUTO_RECALC', 'STATS_PERSISTENT', 'STATS_SAMPLE_PAGES', 'STRAIGHT_JOIN', 'TABLE', 'TERMINATED', 'THEN', 'TINYBLOB', 'TINYINT', 'TINYTEXT', 'TO', 'TRAILING', 'TRIGGER', 'TRUE', 'UNDO', 'UNION', 'UNIQUE', 'UNLOCK', 'UNSIGNED', 'UPDATE', 'USAGE', 'USE', 'USING', 'UTC_DATE', 'UTC_TIME', 'UTC_TIMESTAMP', 'VALUES', 'VARBINARY', 'VARCHAR', 'VARCHARACTER', 'VARYING', 'WHEN', 'WHERE', 'WHILE', 'WINDOW', 'WITH', 'WRITE', 'XOR', 'YEAR_MONTH', 'ZEROFILL'];
var reservedTopLevelWords = ['ADD', 'ALTER COLUMN', 'ALTER TABLE', 'DELETE FROM', 'EXCEPT', 'FROM', 'GROUP BY', 'HAVING', 'INSERT INTO', 'INSERT', 'LIMIT', 'ORDER BY', 'SELECT', 'SET', 'UPDATE', 'VALUES', 'WHERE'];
var reservedTopLevelWordsNoIndent = ['INTERSECT', 'INTERSECT ALL', 'UNION', 'UNION ALL'];
var reservedNewlineWords = ['AND', 'ELSE', 'OR', 'WHEN', // joins
'JOIN', 'INNER JOIN', 'LEFT JOIN', 'LEFT OUTER JOIN', 'RIGHT JOIN', 'RIGHT OUTER JOIN', 'CROSS JOIN', 'NATURAL JOIN', // non-standard joins
'STRAIGHT_JOIN', 'NATURAL LEFT JOIN', 'NATURAL LEFT OUTER JOIN', 'NATURAL RIGHT JOIN', 'NATURAL RIGHT OUTER JOIN']; // For reference: https://mariadb.com/kb/en/sql-statements-structure/

var MariaDbFormatter = /*#__PURE__*/function (_Formatter) {
  _inherits(MariaDbFormatter, _Formatter);

  var _super = _createSuper(MariaDbFormatter);

  function MariaDbFormatter() {
    _classCallCheck(this, MariaDbFormatter);

    return _super.apply(this, arguments);
  }

  _createClass(MariaDbFormatter, [{
    key: "tokenizer",
    value: function tokenizer() {
      return new _core_Tokenizer__WEBPACK_IMPORTED_MODULE_1__["default"]({
        reservedWords: reservedWords,
        reservedTopLevelWords: reservedTopLevelWords,
        reservedNewlineWords: reservedNewlineWords,
        reservedTopLevelWordsNoIndent: reservedTopLevelWordsNoIndent,
        stringTypes: ['``', "''", '""'],
        openParens: ['(', 'CASE'],
        closeParens: [')', 'END'],
        indexedPlaceholderTypes: ['?'],
        namedPlaceholderTypes: [],
        lineCommentTypes: ['--', '#'],
        specialWordChars: ['@'],
        operators: [':=', '<<', '>>', '!=', '<>', '<=>', '&&', '||']
      });
    }
  }]);

  return MariaDbFormatter;
}(_core_Formatter__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),

/***/ "./src/languages/MySqlFormatter.js":
/*!*****************************************!*\
  !*** ./src/languages/MySqlFormatter.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MySqlFormatter; });
/* harmony import */ var _core_Formatter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/Formatter */ "./src/core/Formatter.js");
/* harmony import */ var _core_Tokenizer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/Tokenizer */ "./src/core/Tokenizer.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var reservedWords = ['ACCESSIBLE', 'ADD', 'ALL', 'ALTER', 'ANALYZE', 'AND', 'AS', 'ASC', 'ASENSITIVE', 'BEFORE', 'BETWEEN', 'BIGINT', 'BINARY', 'BLOB', 'BOTH', 'BY', 'CALL', 'CASCADE', 'CASE', 'CHANGE', 'CHAR', 'CHARACTER', 'CHECK', 'COLLATE', 'COLUMN', 'CONDITION', 'CONSTRAINT', 'CONTINUE', 'CONVERT', 'CREATE', 'CROSS', 'CUBE', 'CUME_DIST', 'CURRENT_DATE', 'CURRENT_TIME', 'CURRENT_TIMESTAMP', 'CURRENT_USER', 'CURSOR', 'DATABASE', 'DATABASES', 'DAY_HOUR', 'DAY_MICROSECOND', 'DAY_MINUTE', 'DAY_SECOND', 'DEC', 'DECIMAL', 'DECLARE', 'DEFAULT', 'DELAYED', 'DELETE', 'DENSE_RANK', 'DESC', 'DESCRIBE', 'DETERMINISTIC', 'DISTINCT', 'DISTINCTROW', 'DIV', 'DOUBLE', 'DROP', 'DUAL', 'EACH', 'ELSE', 'ELSEIF', 'EMPTY', 'ENCLOSED', 'ESCAPED', 'EXCEPT', 'EXISTS', 'EXIT', 'EXPLAIN', 'FALSE', 'FETCH', 'FIRST_VALUE', 'FLOAT', 'FLOAT4', 'FLOAT8', 'FOR', 'FORCE', 'FOREIGN', 'FROM', 'FULLTEXT', 'FUNCTION', 'GENERATED', 'GET', 'GRANT', 'GROUP', 'GROUPING', 'GROUPS', 'HAVING', 'HIGH_PRIORITY', 'HOUR_MICROSECOND', 'HOUR_MINUTE', 'HOUR_SECOND', 'IF', 'IGNORE', 'IN', 'INDEX', 'INFILE', 'INNER', 'INOUT', 'INSENSITIVE', 'INSERT', 'INT', 'INT1', 'INT2', 'INT3', 'INT4', 'INT8', 'INTEGER', 'INTERVAL', 'INTO', 'IO_AFTER_GTIDS', 'IO_BEFORE_GTIDS', 'IS', 'ITERATE', 'JOIN', 'JSON_TABLE', 'KEY', 'KEYS', 'KILL', 'LAG', 'LAST_VALUE', 'LATERAL', 'LEAD', 'LEADING', 'LEAVE', 'LEFT', 'LIKE', 'LIMIT', 'LINEAR', 'LINES', 'LOAD', 'LOCALTIME', 'LOCALTIMESTAMP', 'LOCK', 'LONG', 'LONGBLOB', 'LONGTEXT', 'LOOP', 'LOW_PRIORITY', 'MASTER_BIND', 'MASTER_SSL_VERIFY_SERVER_CERT', 'MATCH', 'MAXVALUE', 'MEDIUMBLOB', 'MEDIUMINT', 'MEDIUMTEXT', 'MIDDLEINT', 'MINUTE_MICROSECOND', 'MINUTE_SECOND', 'MOD', 'MODIFIES', 'NATURAL', 'NOT', 'NO_WRITE_TO_BINLOG', 'NTH_VALUE', 'NTILE', 'NULL', 'NUMERIC', 'OF', 'ON', 'OPTIMIZE', 'OPTIMIZER_COSTS', 'OPTION', 'OPTIONALLY', 'OR', 'ORDER', 'OUT', 'OUTER', 'OUTFILE', 'OVER', 'PARTITION', 'PERCENT_RANK', 'PRECISION', 'PRIMARY', 'PROCEDURE', 'PURGE', 'RANGE', 'RANK', 'READ', 'READS', 'READ_WRITE', 'REAL', 'RECURSIVE', 'REFERENCES', 'REGEXP', 'RELEASE', 'RENAME', 'REPEAT', 'REPLACE', 'REQUIRE', 'RESIGNAL', 'RESTRICT', 'RETURN', 'REVOKE', 'RIGHT', 'RLIKE', 'ROW', 'ROWS', 'ROW_NUMBER', 'SCHEMA', 'SCHEMAS', 'SECOND_MICROSECOND', 'SELECT', 'SENSITIVE', 'SEPARATOR', 'SET', 'SHOW', 'SIGNAL', 'SMALLINT', 'SPATIAL', 'SPECIFIC', 'SQL', 'SQLEXCEPTION', 'SQLSTATE', 'SQLWARNING', 'SQL_BIG_RESULT', 'SQL_CALC_FOUND_ROWS', 'SQL_SMALL_RESULT', 'SSL', 'STARTING', 'STORED', 'STRAIGHT_JOIN', 'SYSTEM', 'TABLE', 'TERMINATED', 'THEN', 'TINYBLOB', 'TINYINT', 'TINYTEXT', 'TO', 'TRAILING', 'TRIGGER', 'TRUE', 'UNDO', 'UNION', 'UNIQUE', 'UNLOCK', 'UNSIGNED', 'UPDATE', 'USAGE', 'USE', 'USING', 'UTC_DATE', 'UTC_TIME', 'UTC_TIMESTAMP', 'VALUES', 'VARBINARY', 'VARCHAR', 'VARCHARACTER', 'VARYING', 'VIRTUAL', 'WHEN', 'WHERE', 'WHILE', 'WINDOW', 'WITH', 'WRITE', 'XOR', 'YEAR_MONTH', 'ZEROFILL'];
var reservedTopLevelWords = ['ADD', 'ALTER COLUMN', 'ALTER TABLE', 'DELETE FROM', 'EXCEPT', 'FROM', 'GROUP BY', 'HAVING', 'INSERT INTO', 'INSERT', 'LIMIT', 'ORDER BY', 'SELECT', 'SET', 'UPDATE', 'VALUES', 'WHERE'];
var reservedTopLevelWordsNoIndent = ['INTERSECT', 'INTERSECT ALL', 'UNION', 'UNION ALL'];
var reservedNewlineWords = ['AND', 'ELSE', 'OR', 'WHEN', // joins
'JOIN', 'INNER JOIN', 'LEFT JOIN', 'LEFT OUTER JOIN', 'RIGHT JOIN', 'RIGHT OUTER JOIN', 'CROSS JOIN', 'NATURAL JOIN', // non-standard joins
'STRAIGHT_JOIN', 'NATURAL LEFT JOIN', 'NATURAL LEFT OUTER JOIN', 'NATURAL RIGHT JOIN', 'NATURAL RIGHT OUTER JOIN'];

var MySqlFormatter = /*#__PURE__*/function (_Formatter) {
  _inherits(MySqlFormatter, _Formatter);

  var _super = _createSuper(MySqlFormatter);

  function MySqlFormatter() {
    _classCallCheck(this, MySqlFormatter);

    return _super.apply(this, arguments);
  }

  _createClass(MySqlFormatter, [{
    key: "tokenizer",
    value: function tokenizer() {
      return new _core_Tokenizer__WEBPACK_IMPORTED_MODULE_1__["default"]({
        reservedWords: reservedWords,
        reservedTopLevelWords: reservedTopLevelWords,
        reservedNewlineWords: reservedNewlineWords,
        reservedTopLevelWordsNoIndent: reservedTopLevelWordsNoIndent,
        stringTypes: ['``', "''", '""'],
        openParens: ['(', 'CASE'],
        closeParens: [')', 'END'],
        indexedPlaceholderTypes: ['?'],
        namedPlaceholderTypes: [],
        lineCommentTypes: ['--', '#'],
        specialWordChars: ['@'],
        operators: [':=', '<<', '>>', '!=', '<>', '<=>', '&&', '||', '->', '->>']
      });
    }
  }]);

  return MySqlFormatter;
}(_core_Formatter__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),

/***/ "./src/languages/N1qlFormatter.js":
/*!****************************************!*\
  !*** ./src/languages/N1qlFormatter.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return N1qlFormatter; });
/* harmony import */ var _core_Formatter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/Formatter */ "./src/core/Formatter.js");
/* harmony import */ var _core_Tokenizer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/Tokenizer */ "./src/core/Tokenizer.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var reservedWords = ['ALL', 'ALTER', 'ANALYZE', 'AND', 'ANY', 'ARRAY', 'AS', 'ASC', 'BEGIN', 'BETWEEN', 'BINARY', 'BOOLEAN', 'BREAK', 'BUCKET', 'BUILD', 'BY', 'CALL', 'CASE', 'CAST', 'CLUSTER', 'COLLATE', 'COLLECTION', 'COMMIT', 'CONNECT', 'CONTINUE', 'CORRELATE', 'COVER', 'CREATE', 'DATABASE', 'DATASET', 'DATASTORE', 'DECLARE', 'DECREMENT', 'DELETE', 'DERIVED', 'DESC', 'DESCRIBE', 'DISTINCT', 'DO', 'DROP', 'EACH', 'ELEMENT', 'ELSE', 'END', 'EVERY', 'EXCEPT', 'EXCLUDE', 'EXECUTE', 'EXISTS', 'EXPLAIN', 'FALSE', 'FETCH', 'FIRST', 'FLATTEN', 'FOR', 'FORCE', 'FROM', 'FUNCTION', 'GRANT', 'GROUP', 'GSI', 'HAVING', 'IF', 'IGNORE', 'ILIKE', 'IN', 'INCLUDE', 'INCREMENT', 'INDEX', 'INFER', 'INLINE', 'INNER', 'INSERT', 'INTERSECT', 'INTO', 'IS', 'JOIN', 'KEY', 'KEYS', 'KEYSPACE', 'KNOWN', 'LAST', 'LEFT', 'LET', 'LETTING', 'LIKE', 'LIMIT', 'LSM', 'MAP', 'MAPPING', 'MATCHED', 'MATERIALIZED', 'MERGE', 'MISSING', 'NAMESPACE', 'NEST', 'NOT', 'NULL', 'NUMBER', 'OBJECT', 'OFFSET', 'ON', 'OPTION', 'OR', 'ORDER', 'OUTER', 'OVER', 'PARSE', 'PARTITION', 'PASSWORD', 'PATH', 'POOL', 'PREPARE', 'PRIMARY', 'PRIVATE', 'PRIVILEGE', 'PROCEDURE', 'PUBLIC', 'RAW', 'REALM', 'REDUCE', 'RENAME', 'RETURN', 'RETURNING', 'REVOKE', 'RIGHT', 'ROLE', 'ROLLBACK', 'SATISFIES', 'SCHEMA', 'SELECT', 'SELF', 'SEMI', 'SET', 'SHOW', 'SOME', 'START', 'STATISTICS', 'STRING', 'SYSTEM', 'THEN', 'TO', 'TRANSACTION', 'TRIGGER', 'TRUE', 'TRUNCATE', 'UNDER', 'UNION', 'UNIQUE', 'UNKNOWN', 'UNNEST', 'UNSET', 'UPDATE', 'UPSERT', 'USE', 'USER', 'USING', 'VALIDATE', 'VALUE', 'VALUED', 'VALUES', 'VIA', 'VIEW', 'WHEN', 'WHERE', 'WHILE', 'WITH', 'WITHIN', 'WORK', 'XOR'];
var reservedTopLevelWords = ['DELETE FROM', 'EXCEPT ALL', 'EXCEPT', 'EXPLAIN DELETE FROM', 'EXPLAIN UPDATE', 'EXPLAIN UPSERT', 'FROM', 'GROUP BY', 'HAVING', 'INFER', 'INSERT INTO', 'LET', 'LIMIT', 'MERGE', 'NEST', 'ORDER BY', 'PREPARE', 'SELECT', 'SET CURRENT SCHEMA', 'SET SCHEMA', 'SET', 'UNNEST', 'UPDATE', 'UPSERT', 'USE KEYS', 'VALUES', 'WHERE'];
var reservedTopLevelWordsNoIndent = ['INTERSECT', 'INTERSECT ALL', 'MINUS', 'UNION', 'UNION ALL'];
var reservedNewlineWords = ['AND', 'OR', 'XOR', // joins
'JOIN', 'INNER JOIN', 'LEFT JOIN', 'LEFT OUTER JOIN', 'RIGHT JOIN', 'RIGHT OUTER JOIN']; // For reference: http://docs.couchbase.com.s3-website-us-west-1.amazonaws.com/server/6.0/n1ql/n1ql-language-reference/index.html

var N1qlFormatter = /*#__PURE__*/function (_Formatter) {
  _inherits(N1qlFormatter, _Formatter);

  var _super = _createSuper(N1qlFormatter);

  function N1qlFormatter() {
    _classCallCheck(this, N1qlFormatter);

    return _super.apply(this, arguments);
  }

  _createClass(N1qlFormatter, [{
    key: "tokenizer",
    value: function tokenizer() {
      return new _core_Tokenizer__WEBPACK_IMPORTED_MODULE_1__["default"]({
        reservedWords: reservedWords,
        reservedTopLevelWords: reservedTopLevelWords,
        reservedNewlineWords: reservedNewlineWords,
        reservedTopLevelWordsNoIndent: reservedTopLevelWordsNoIndent,
        stringTypes: ["\"\"", "''", '``'],
        openParens: ['(', '[', '{'],
        closeParens: [')', ']', '}'],
        namedPlaceholderTypes: ['$'],
        lineCommentTypes: ['#', '--'],
        operators: ['==', '!=']
      });
    }
  }]);

  return N1qlFormatter;
}(_core_Formatter__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),

/***/ "./src/languages/PlSqlFormatter.js":
/*!*****************************************!*\
  !*** ./src/languages/PlSqlFormatter.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return PlSqlFormatter; });
/* harmony import */ var _core_Formatter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/Formatter */ "./src/core/Formatter.js");
/* harmony import */ var _core_token__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/token */ "./src/core/token.js");
/* harmony import */ var _core_Tokenizer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/Tokenizer */ "./src/core/Tokenizer.js");
/* harmony import */ var _core_tokenTypes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/tokenTypes */ "./src/core/tokenTypes.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }





var reservedWords = ['A', 'ACCESSIBLE', 'AGENT', 'AGGREGATE', 'ALL', 'ALTER', 'ANY', 'ARRAY', 'AS', 'ASC', 'AT', 'ATTRIBUTE', 'AUTHID', 'AVG', 'BETWEEN', 'BFILE_BASE', 'BINARY_INTEGER', 'BINARY', 'BLOB_BASE', 'BLOCK', 'BODY', 'BOOLEAN', 'BOTH', 'BOUND', 'BREADTH', 'BULK', 'BY', 'BYTE', 'C', 'CALL', 'CALLING', 'CASCADE', 'CASE', 'CHAR_BASE', 'CHAR', 'CHARACTER', 'CHARSET', 'CHARSETFORM', 'CHARSETID', 'CHECK', 'CLOB_BASE', 'CLONE', 'CLOSE', 'CLUSTER', 'CLUSTERS', 'COALESCE', 'COLAUTH', 'COLLECT', 'COLUMNS', 'COMMENT', 'COMMIT', 'COMMITTED', 'COMPILED', 'COMPRESS', 'CONNECT', 'CONSTANT', 'CONSTRUCTOR', 'CONTEXT', 'CONTINUE', 'CONVERT', 'COUNT', 'CRASH', 'CREATE', 'CREDENTIAL', 'CURRENT', 'CURRVAL', 'CURSOR', 'CUSTOMDATUM', 'DANGLING', 'DATA', 'DATE_BASE', 'DATE', 'DAY', 'DECIMAL', 'DEFAULT', 'DEFINE', 'DELETE', 'DEPTH', 'DESC', 'DETERMINISTIC', 'DIRECTORY', 'DISTINCT', 'DO', 'DOUBLE', 'DROP', 'DURATION', 'ELEMENT', 'ELSIF', 'EMPTY', 'END', 'ESCAPE', 'EXCEPTIONS', 'EXCLUSIVE', 'EXECUTE', 'EXISTS', 'EXIT', 'EXTENDS', 'EXTERNAL', 'EXTRACT', 'FALSE', 'FETCH', 'FINAL', 'FIRST', 'FIXED', 'FLOAT', 'FOR', 'FORALL', 'FORCE', 'FROM', 'FUNCTION', 'GENERAL', 'GOTO', 'GRANT', 'GROUP', 'HASH', 'HEAP', 'HIDDEN', 'HOUR', 'IDENTIFIED', 'IF', 'IMMEDIATE', 'IN', 'INCLUDING', 'INDEX', 'INDEXES', 'INDICATOR', 'INDICES', 'INFINITE', 'INSTANTIABLE', 'INT', 'INTEGER', 'INTERFACE', 'INTERVAL', 'INTO', 'INVALIDATE', 'IS', 'ISOLATION', 'JAVA', 'LANGUAGE', 'LARGE', 'LEADING', 'LENGTH', 'LEVEL', 'LIBRARY', 'LIKE', 'LIKE2', 'LIKE4', 'LIKEC', 'LIMITED', 'LOCAL', 'LOCK', 'LONG', 'MAP', 'MAX', 'MAXLEN', 'MEMBER', 'MERGE', 'MIN', 'MINUTE', 'MLSLABEL', 'MOD', 'MODE', 'MONTH', 'MULTISET', 'NAME', 'NAN', 'NATIONAL', 'NATIVE', 'NATURAL', 'NATURALN', 'NCHAR', 'NEW', 'NEXTVAL', 'NOCOMPRESS', 'NOCOPY', 'NOT', 'NOWAIT', 'NULL', 'NULLIF', 'NUMBER_BASE', 'NUMBER', 'OBJECT', 'OCICOLL', 'OCIDATE', 'OCIDATETIME', 'OCIDURATION', 'OCIINTERVAL', 'OCILOBLOCATOR', 'OCINUMBER', 'OCIRAW', 'OCIREF', 'OCIREFCURSOR', 'OCIROWID', 'OCISTRING', 'OCITYPE', 'OF', 'OLD', 'ON', 'ONLY', 'OPAQUE', 'OPEN', 'OPERATOR', 'OPTION', 'ORACLE', 'ORADATA', 'ORDER', 'ORGANIZATION', 'ORLANY', 'ORLVARY', 'OTHERS', 'OUT', 'OVERLAPS', 'OVERRIDING', 'PACKAGE', 'PARALLEL_ENABLE', 'PARAMETER', 'PARAMETERS', 'PARENT', 'PARTITION', 'PASCAL', 'PCTFREE', 'PIPE', 'PIPELINED', 'PLS_INTEGER', 'PLUGGABLE', 'POSITIVE', 'POSITIVEN', 'PRAGMA', 'PRECISION', 'PRIOR', 'PRIVATE', 'PROCEDURE', 'PUBLIC', 'RAISE', 'RANGE', 'RAW', 'READ', 'REAL', 'RECORD', 'REF', 'REFERENCE', 'RELEASE', 'RELIES_ON', 'REM', 'REMAINDER', 'RENAME', 'RESOURCE', 'RESULT_CACHE', 'RESULT', 'RETURN', 'RETURNING', 'REVERSE', 'REVOKE', 'ROLLBACK', 'ROW', 'ROWID', 'ROWNUM', 'ROWTYPE', 'SAMPLE', 'SAVE', 'SAVEPOINT', 'SB1', 'SB2', 'SB4', 'SEARCH', 'SECOND', 'SEGMENT', 'SELF', 'SEPARATE', 'SEQUENCE', 'SERIALIZABLE', 'SHARE', 'SHORT', 'SIZE_T', 'SIZE', 'SMALLINT', 'SOME', 'SPACE', 'SPARSE', 'SQL', 'SQLCODE', 'SQLDATA', 'SQLERRM', 'SQLNAME', 'SQLSTATE', 'STANDARD', 'START', 'STATIC', 'STDDEV', 'STORED', 'STRING', 'STRUCT', 'STYLE', 'SUBMULTISET', 'SUBPARTITION', 'SUBSTITUTABLE', 'SUBTYPE', 'SUCCESSFUL', 'SUM', 'SYNONYM', 'SYSDATE', 'TABAUTH', 'TABLE', 'TDO', 'THE', 'THEN', 'TIME', 'TIMESTAMP', 'TIMEZONE_ABBR', 'TIMEZONE_HOUR', 'TIMEZONE_MINUTE', 'TIMEZONE_REGION', 'TO', 'TRAILING', 'TRANSACTION', 'TRANSACTIONAL', 'TRIGGER', 'TRUE', 'TRUSTED', 'TYPE', 'UB1', 'UB2', 'UB4', 'UID', 'UNDER', 'UNIQUE', 'UNPLUG', 'UNSIGNED', 'UNTRUSTED', 'USE', 'USER', 'USING', 'VALIDATE', 'VALIST', 'VALUE', 'VARCHAR', 'VARCHAR2', 'VARIABLE', 'VARIANCE', 'VARRAY', 'VARYING', 'VIEW', 'VIEWS', 'VOID', 'WHENEVER', 'WHILE', 'WITH', 'WORK', 'WRAPPED', 'WRITE', 'YEAR', 'ZONE'];
var reservedTopLevelWords = ['ADD', 'ALTER COLUMN', 'ALTER TABLE', 'BEGIN', 'CONNECT BY', 'DECLARE', 'DELETE FROM', 'DELETE', 'END', 'EXCEPT', 'EXCEPTION', 'FETCH FIRST', 'FROM', 'GROUP BY', 'HAVING', 'INSERT INTO', 'INSERT', 'LIMIT', 'LOOP', 'MODIFY', 'ORDER BY', 'SELECT', 'SET CURRENT SCHEMA', 'SET SCHEMA', 'SET', 'START WITH', 'UPDATE', 'VALUES', 'WHERE'];
var reservedTopLevelWordsNoIndent = ['INTERSECT', 'INTERSECT ALL', 'MINUS', 'UNION', 'UNION ALL'];
var reservedNewlineWords = ['AND', 'CROSS APPLY', 'ELSE', 'END', 'OR', 'OUTER APPLY', 'WHEN', 'XOR', // joins
'JOIN', 'INNER JOIN', 'LEFT JOIN', 'LEFT OUTER JOIN', 'RIGHT JOIN', 'RIGHT OUTER JOIN', 'FULL JOIN', 'FULL OUTER JOIN', 'CROSS JOIN', 'NATURAL JOIN'];

var PlSqlFormatter = /*#__PURE__*/function (_Formatter) {
  _inherits(PlSqlFormatter, _Formatter);

  var _super = _createSuper(PlSqlFormatter);

  function PlSqlFormatter() {
    _classCallCheck(this, PlSqlFormatter);

    return _super.apply(this, arguments);
  }

  _createClass(PlSqlFormatter, [{
    key: "tokenizer",
    value: function tokenizer() {
      return new _core_Tokenizer__WEBPACK_IMPORTED_MODULE_2__["default"]({
        reservedWords: reservedWords,
        reservedTopLevelWords: reservedTopLevelWords,
        reservedNewlineWords: reservedNewlineWords,
        reservedTopLevelWordsNoIndent: reservedTopLevelWordsNoIndent,
        stringTypes: ["\"\"", "N''", "''", '``'],
        openParens: ['(', 'CASE'],
        closeParens: [')', 'END'],
        indexedPlaceholderTypes: ['?'],
        namedPlaceholderTypes: [':'],
        lineCommentTypes: ['--'],
        specialWordChars: ['_', '$', '#', '.', '@'],
        operators: ['||', '**', '!=', ':=']
      });
    }
  }, {
    key: "tokenOverride",
    value: function tokenOverride(token) {
      if (Object(_core_token__WEBPACK_IMPORTED_MODULE_1__["isSet"])(token) && Object(_core_token__WEBPACK_IMPORTED_MODULE_1__["isBy"])(this.previousReservedToken)) {
        return {
          type: _core_tokenTypes__WEBPACK_IMPORTED_MODULE_3__["default"].RESERVED,
          value: token.value
        };
      }

      return token;
    }
  }]);

  return PlSqlFormatter;
}(_core_Formatter__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),

/***/ "./src/languages/PostgreSqlFormatter.js":
/*!**********************************************!*\
  !*** ./src/languages/PostgreSqlFormatter.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return PostgreSqlFormatter; });
/* harmony import */ var _core_Formatter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/Formatter */ "./src/core/Formatter.js");
/* harmony import */ var _core_Tokenizer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/Tokenizer */ "./src/core/Tokenizer.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var reservedWords = ['ABORT', 'ABSOLUTE', 'ACCESS', 'ACTION', 'ADD', 'ADMIN', 'AFTER', 'AGGREGATE', 'ALL', 'ALSO', 'ALTER', 'ALWAYS', 'ANALYSE', 'ANALYZE', 'AND', 'ANY', 'ARRAY', 'AS', 'ASC', 'ASSERTION', 'ASSIGNMENT', 'ASYMMETRIC', 'AT', 'ATTACH', 'ATTRIBUTE', 'AUTHORIZATION', 'BACKWARD', 'BEFORE', 'BEGIN', 'BETWEEN', 'BIGINT', 'BINARY', 'BIT', 'BOOLEAN', 'BOTH', 'BY', 'CACHE', 'CALL', 'CALLED', 'CASCADE', 'CASCADED', 'CASE', 'CAST', 'CATALOG', 'CHAIN', 'CHAR', 'CHARACTER', 'CHARACTERISTICS', 'CHECK', 'CHECKPOINT', 'CLASS', 'CLOSE', 'CLUSTER', 'COALESCE', 'COLLATE', 'COLLATION', 'COLUMN', 'COLUMNS', 'COMMENT', 'COMMENTS', 'COMMIT', 'COMMITTED', 'CONCURRENTLY', 'CONFIGURATION', 'CONFLICT', 'CONNECTION', 'CONSTRAINT', 'CONSTRAINTS', 'CONTENT', 'CONTINUE', 'CONVERSION', 'COPY', 'COST', 'CREATE', 'CROSS', 'CSV', 'CUBE', 'CURRENT', 'CURRENT_CATALOG', 'CURRENT_DATE', 'CURRENT_ROLE', 'CURRENT_SCHEMA', 'CURRENT_TIME', 'CURRENT_TIMESTAMP', 'CURRENT_USER', 'CURSOR', 'CYCLE', 'DATA', 'DATABASE', 'DAY', 'DEALLOCATE', 'DEC', 'DECIMAL', 'DECLARE', 'DEFAULT', 'DEFAULTS', 'DEFERRABLE', 'DEFERRED', 'DEFINER', 'DELETE', 'DELIMITER', 'DELIMITERS', 'DEPENDS', 'DESC', 'DETACH', 'DICTIONARY', 'DISABLE', 'DISCARD', 'DISTINCT', 'DO', 'DOCUMENT', 'DOMAIN', 'DOUBLE', 'DROP', 'EACH', 'ELSE', 'ENABLE', 'ENCODING', 'ENCRYPTED', 'END', 'ENUM', 'ESCAPE', 'EVENT', 'EXCEPT', 'EXCLUDE', 'EXCLUDING', 'EXCLUSIVE', 'EXECUTE', 'EXISTS', 'EXPLAIN', 'EXPRESSION', 'EXTENSION', 'EXTERNAL', 'EXTRACT', 'FALSE', 'FAMILY', 'FETCH', 'FILTER', 'FIRST', 'FLOAT', 'FOLLOWING', 'FOR', 'FORCE', 'FOREIGN', 'FORWARD', 'FREEZE', 'FROM', 'FULL', 'FUNCTION', 'FUNCTIONS', 'GENERATED', 'GLOBAL', 'GRANT', 'GRANTED', 'GREATEST', 'GROUP', 'GROUPING', 'GROUPS', 'HANDLER', 'HAVING', 'HEADER', 'HOLD', 'HOUR', 'IDENTITY', 'IF', 'ILIKE', 'IMMEDIATE', 'IMMUTABLE', 'IMPLICIT', 'IMPORT', 'IN', 'INCLUDE', 'INCLUDING', 'INCREMENT', 'INDEX', 'INDEXES', 'INHERIT', 'INHERITS', 'INITIALLY', 'INLINE', 'INNER', 'INOUT', 'INPUT', 'INSENSITIVE', 'INSERT', 'INSTEAD', 'INT', 'INTEGER', 'INTERSECT', 'INTERVAL', 'INTO', 'INVOKER', 'IS', 'ISNULL', 'ISOLATION', 'JOIN', 'KEY', 'LABEL', 'LANGUAGE', 'LARGE', 'LAST', 'LATERAL', 'LEADING', 'LEAKPROOF', 'LEAST', 'LEFT', 'LEVEL', 'LIKE', 'LIMIT', 'LISTEN', 'LOAD', 'LOCAL', 'LOCALTIME', 'LOCALTIMESTAMP', 'LOCATION', 'LOCK', 'LOCKED', 'LOGGED', 'MAPPING', 'MATCH', 'MATERIALIZED', 'MAXVALUE', 'METHOD', 'MINUTE', 'MINVALUE', 'MODE', 'MONTH', 'MOVE', 'NAME', 'NAMES', 'NATIONAL', 'NATURAL', 'NCHAR', 'NEW', 'NEXT', 'NFC', 'NFD', 'NFKC', 'NFKD', 'NO', 'NONE', 'NORMALIZE', 'NORMALIZED', 'NOT', 'NOTHING', 'NOTIFY', 'NOTNULL', 'NOWAIT', 'NULL', 'NULLIF', 'NULLS', 'NUMERIC', 'OBJECT', 'OF', 'OFF', 'OFFSET', 'OIDS', 'OLD', 'ON', 'ONLY', 'OPERATOR', 'OPTION', 'OPTIONS', 'OR', 'ORDER', 'ORDINALITY', 'OTHERS', 'OUT', 'OUTER', 'OVER', 'OVERLAPS', 'OVERLAY', 'OVERRIDING', 'OWNED', 'OWNER', 'PARALLEL', 'PARSER', 'PARTIAL', 'PARTITION', 'PASSING', 'PASSWORD', 'PLACING', 'PLANS', 'POLICY', 'POSITION', 'PRECEDING', 'PRECISION', 'PREPARE', 'PREPARED', 'PRESERVE', 'PRIMARY', 'PRIOR', 'PRIVILEGES', 'PROCEDURAL', 'PROCEDURE', 'PROCEDURES', 'PROGRAM', 'PUBLICATION', 'QUOTE', 'RANGE', 'READ', 'REAL', 'REASSIGN', 'RECHECK', 'RECURSIVE', 'REF', 'REFERENCES', 'REFERENCING', 'REFRESH', 'REINDEX', 'RELATIVE', 'RELEASE', 'RENAME', 'REPEATABLE', 'REPLACE', 'REPLICA', 'RESET', 'RESTART', 'RESTRICT', 'RETURNING', 'RETURNS', 'REVOKE', 'RIGHT', 'ROLE', 'ROLLBACK', 'ROLLUP', 'ROUTINE', 'ROUTINES', 'ROW', 'ROWS', 'RULE', 'SAVEPOINT', 'SCHEMA', 'SCHEMAS', 'SCROLL', 'SEARCH', 'SECOND', 'SECURITY', 'SELECT', 'SEQUENCE', 'SEQUENCES', 'SERIALIZABLE', 'SERVER', 'SESSION', 'SESSION_USER', 'SET', 'SETOF', 'SETS', 'SHARE', 'SHOW', 'SIMILAR', 'SIMPLE', 'SKIP', 'SMALLINT', 'SNAPSHOT', 'SOME', 'SQL', 'STABLE', 'STANDALONE', 'START', 'STATEMENT', 'STATISTICS', 'STDIN', 'STDOUT', 'STORAGE', 'STORED', 'STRICT', 'STRIP', 'SUBSCRIPTION', 'SUBSTRING', 'SUPPORT', 'SYMMETRIC', 'SYSID', 'SYSTEM', 'TABLE', 'TABLES', 'TABLESAMPLE', 'TABLESPACE', 'TEMP', 'TEMPLATE', 'TEMPORARY', 'TEXT', 'THEN', 'TIES', 'TIME', 'TIMESTAMP', 'TO', 'TRAILING', 'TRANSACTION', 'TRANSFORM', 'TREAT', 'TRIGGER', 'TRIM', 'TRUE', 'TRUNCATE', 'TRUSTED', 'TYPE', 'TYPES', 'UESCAPE', 'UNBOUNDED', 'UNCOMMITTED', 'UNENCRYPTED', 'UNION', 'UNIQUE', 'UNKNOWN', 'UNLISTEN', 'UNLOGGED', 'UNTIL', 'UPDATE', 'USER', 'USING', 'VACUUM', 'VALID', 'VALIDATE', 'VALIDATOR', 'VALUE', 'VALUES', 'VARCHAR', 'VARIADIC', 'VARYING', 'VERBOSE', 'VERSION', 'VIEW', 'VIEWS', 'VOLATILE', 'WHEN', 'WHERE', 'WHITESPACE', 'WINDOW', 'WITH', 'WITHIN', 'WITHOUT', 'WORK', 'WRAPPER', 'WRITE', 'XML', 'XMLATTRIBUTES', 'XMLCONCAT', 'XMLELEMENT', 'XMLEXISTS', 'XMLFOREST', 'XMLNAMESPACES', 'XMLPARSE', 'XMLPI', 'XMLROOT', 'XMLSERIALIZE', 'XMLTABLE', 'YEAR', 'YES', 'ZONE'];
var reservedTopLevelWords = ['ADD', 'AFTER', 'ALTER COLUMN', 'ALTER TABLE', 'CASE', 'DELETE FROM', 'END', 'EXCEPT', 'FETCH FIRST', 'FROM', 'GROUP BY', 'HAVING', 'INSERT INTO', 'INSERT', 'LIMIT', 'ORDER BY', 'SELECT', 'SET CURRENT SCHEMA', 'SET SCHEMA', 'SET', 'UPDATE', 'VALUES', 'WHERE'];
var reservedTopLevelWordsNoIndent = ['INTERSECT', 'INTERSECT ALL', 'UNION', 'UNION ALL'];
var reservedNewlineWords = ['AND', 'ELSE', 'OR', 'WHEN', // joins
'JOIN', 'INNER JOIN', 'LEFT JOIN', 'LEFT OUTER JOIN', 'RIGHT JOIN', 'RIGHT OUTER JOIN', 'FULL JOIN', 'FULL OUTER JOIN', 'CROSS JOIN', 'NATURAL JOIN'];

var PostgreSqlFormatter = /*#__PURE__*/function (_Formatter) {
  _inherits(PostgreSqlFormatter, _Formatter);

  var _super = _createSuper(PostgreSqlFormatter);

  function PostgreSqlFormatter() {
    _classCallCheck(this, PostgreSqlFormatter);

    return _super.apply(this, arguments);
  }

  _createClass(PostgreSqlFormatter, [{
    key: "tokenizer",
    value: function tokenizer() {
      return new _core_Tokenizer__WEBPACK_IMPORTED_MODULE_1__["default"]({
        reservedWords: reservedWords,
        reservedTopLevelWords: reservedTopLevelWords,
        reservedNewlineWords: reservedNewlineWords,
        reservedTopLevelWordsNoIndent: reservedTopLevelWordsNoIndent,
        stringTypes: ["\"\"", "''", "U&''", 'U&""', '$$'],
        openParens: ['(', 'CASE'],
        closeParens: [')', 'END'],
        indexedPlaceholderTypes: ['$'],
        namedPlaceholderTypes: [':'],
        lineCommentTypes: ['--'],
        operators: ['!=', '<<', '>>', '||/', '|/', '::', '->>', '->', '~~*', '~~', '!~~*', '!~~', '~*', '!~*', '!~', '!!']
      });
    }
  }]);

  return PostgreSqlFormatter;
}(_core_Formatter__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),

/***/ "./src/languages/RedshiftFormatter.js":
/*!********************************************!*\
  !*** ./src/languages/RedshiftFormatter.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return RedshiftFormatter; });
/* harmony import */ var _core_Formatter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/Formatter */ "./src/core/Formatter.js");
/* harmony import */ var _core_Tokenizer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/Tokenizer */ "./src/core/Tokenizer.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var reservedWords = ['AES128', 'AES256', 'ALLOWOVERWRITE', 'ANALYSE', 'ARRAY', 'AS', 'ASC', 'AUTHORIZATION', 'BACKUP', 'BINARY', 'BLANKSASNULL', 'BOTH', 'BYTEDICT', 'BZIP2', 'CAST', 'CHECK', 'COLLATE', 'COLUMN', 'CONSTRAINT', 'CREATE', 'CREDENTIALS', 'CURRENT_DATE', 'CURRENT_TIME', 'CURRENT_TIMESTAMP', 'CURRENT_USER', 'CURRENT_USER_ID', 'DEFAULT', 'DEFERRABLE', 'DEFLATE', 'DEFRAG', 'DELTA', 'DELTA32K', 'DESC', 'DISABLE', 'DISTINCT', 'DO', 'ELSE', 'EMPTYASNULL', 'ENABLE', 'ENCODE', 'ENCRYPT', 'ENCRYPTION', 'END', 'EXPLICIT', 'FALSE', 'FOR', 'FOREIGN', 'FREEZE', 'FULL', 'GLOBALDICT256', 'GLOBALDICT64K', 'GRANT', 'GZIP', 'IDENTITY', 'IGNORE', 'ILIKE', 'INITIALLY', 'INTO', 'LEADING', 'LOCALTIME', 'LOCALTIMESTAMP', 'LUN', 'LUNS', 'LZO', 'LZOP', 'MINUS', 'MOSTLY13', 'MOSTLY32', 'MOSTLY8', 'NATURAL', 'NEW', 'NULLS', 'OFF', 'OFFLINE', 'OFFSET', 'OLD', 'ON', 'ONLY', 'OPEN', 'ORDER', 'OVERLAPS', 'PARALLEL', 'PARTITION', 'PERCENT', 'PERMISSIONS', 'PLACING', 'PRIMARY', 'RAW', 'READRATIO', 'RECOVER', 'REFERENCES', 'REJECTLOG', 'RESORT', 'RESTORE', 'SESSION_USER', 'SIMILAR', 'SYSDATE', 'SYSTEM', 'TABLE', 'TAG', 'TDES', 'TEXT255', 'TEXT32K', 'THEN', 'TIMESTAMP', 'TO', 'TOP', 'TRAILING', 'TRUE', 'TRUNCATECOLUMNS', 'UNIQUE', 'USER', 'USING', 'VERBOSE', 'WALLET', 'WHEN', 'WITH', 'WITHOUT', 'PREDICATE', 'COLUMNS', 'COMPROWS', 'COMPRESSION', 'COPY', 'FORMAT', 'DELIMITER', 'FIXEDWIDTH', 'AVRO', 'JSON', 'ENCRYPTED', 'BZIP2', 'GZIP', 'LZOP', 'PARQUET', 'ORC', 'ACCEPTANYDATE', 'ACCEPTINVCHARS', 'BLANKSASNULL', 'DATEFORMAT', 'EMPTYASNULL', 'ENCODING', 'ESCAPE', 'EXPLICIT_IDS', 'FILLRECORD', 'IGNOREBLANKLINES', 'IGNOREHEADER', 'NULL AS', 'REMOVEQUOTES', 'ROUNDEC', 'TIMEFORMAT', 'TRIMBLANKS', 'TRUNCATECOLUMNS', 'COMPROWS', 'COMPUPDATE', 'MAXERROR', 'NOLOAD', 'STATUPDATE', 'MANIFEST', 'REGION', 'IAM_ROLE', 'MASTER_SYMMETRIC_KEY', 'SSH', 'ACCEPTANYDATE', 'ACCEPTINVCHARS', 'ACCESS_KEY_ID', 'SECRET_ACCESS_KEY', 'AVRO', 'BLANKSASNULL', 'BZIP2', 'COMPROWS', 'COMPUPDATE', 'CREDENTIALS', 'DATEFORMAT', 'DELIMITER', 'EMPTYASNULL', 'ENCODING', 'ENCRYPTED', 'ESCAPE', 'EXPLICIT_IDS', 'FILLRECORD', 'FIXEDWIDTH', 'FORMAT', 'IAM_ROLE', 'GZIP', 'IGNOREBLANKLINES', 'IGNOREHEADER', 'JSON', 'LZOP', 'MANIFEST', 'MASTER_SYMMETRIC_KEY', 'MAXERROR', 'NOLOAD', 'NULL AS', 'READRATIO', 'REGION', 'REMOVEQUOTES', 'ROUNDEC', 'SSH', 'STATUPDATE', 'TIMEFORMAT', 'SESSION_TOKEN', 'TRIMBLANKS', 'TRUNCATECOLUMNS', 'EXTERNAL', 'DATA CATALOG', 'HIVE METASTORE', 'CATALOG_ROLE', 'VACUUM', 'COPY', 'UNLOAD', 'EVEN', 'ALL'];
var reservedTopLevelWords = ['ADD', 'AFTER', 'ALTER COLUMN', 'ALTER TABLE', 'DELETE FROM', 'EXCEPT', 'FROM', 'GROUP BY', 'HAVING', 'INSERT INTO', 'INSERT', 'INTERSECT', 'TOP', 'LIMIT', 'MODIFY', 'ORDER BY', 'SELECT', 'SET CURRENT SCHEMA', 'SET SCHEMA', 'SET', 'UNION ALL', 'UNION', 'UPDATE', 'VALUES', 'WHERE', 'VACUUM', 'COPY', 'UNLOAD', 'ANALYZE', 'ANALYSE', 'DISTKEY', 'SORTKEY', 'COMPOUND', 'INTERLEAVED', 'FORMAT', 'DELIMITER', 'FIXEDWIDTH', 'AVRO', 'JSON', 'ENCRYPTED', 'BZIP2', 'GZIP', 'LZOP', 'PARQUET', 'ORC', 'ACCEPTANYDATE', 'ACCEPTINVCHARS', 'BLANKSASNULL', 'DATEFORMAT', 'EMPTYASNULL', 'ENCODING', 'ESCAPE', 'EXPLICIT_IDS', 'FILLRECORD', 'IGNOREBLANKLINES', 'IGNOREHEADER', 'NULL AS', 'REMOVEQUOTES', 'ROUNDEC', 'TIMEFORMAT', 'TRIMBLANKS', 'TRUNCATECOLUMNS', 'COMPROWS', 'COMPUPDATE', 'MAXERROR', 'NOLOAD', 'STATUPDATE', 'MANIFEST', 'REGION', 'IAM_ROLE', 'MASTER_SYMMETRIC_KEY', 'SSH', 'ACCEPTANYDATE', 'ACCEPTINVCHARS', 'ACCESS_KEY_ID', 'SECRET_ACCESS_KEY', 'AVRO', 'BLANKSASNULL', 'BZIP2', 'COMPROWS', 'COMPUPDATE', 'CREDENTIALS', 'DATEFORMAT', 'DELIMITER', 'EMPTYASNULL', 'ENCODING', 'ENCRYPTED', 'ESCAPE', 'EXPLICIT_IDS', 'FILLRECORD', 'FIXEDWIDTH', 'FORMAT', 'IAM_ROLE', 'GZIP', 'IGNOREBLANKLINES', 'IGNOREHEADER', 'JSON', 'LZOP', 'MANIFEST', 'MASTER_SYMMETRIC_KEY', 'MAXERROR', 'NOLOAD', 'NULL AS', 'READRATIO', 'REGION', 'REMOVEQUOTES', 'ROUNDEC', 'SSH', 'STATUPDATE', 'TIMEFORMAT', 'SESSION_TOKEN', 'TRIMBLANKS', 'TRUNCATECOLUMNS', 'EXTERNAL', 'DATA CATALOG', 'HIVE METASTORE', 'CATALOG_ROLE'];
var reservedTopLevelWordsNoIndent = [];
var reservedNewlineWords = ['AND', 'ELSE', 'OR', 'OUTER APPLY', 'WHEN', 'VACUUM', 'COPY', 'UNLOAD', 'ANALYZE', 'ANALYSE', 'DISTKEY', 'SORTKEY', 'COMPOUND', 'INTERLEAVED', // joins
'JOIN', 'INNER JOIN', 'LEFT JOIN', 'LEFT OUTER JOIN', 'RIGHT JOIN', 'RIGHT OUTER JOIN', 'FULL JOIN', 'FULL OUTER JOIN', 'CROSS JOIN', 'NATURAL JOIN'];

var RedshiftFormatter = /*#__PURE__*/function (_Formatter) {
  _inherits(RedshiftFormatter, _Formatter);

  var _super = _createSuper(RedshiftFormatter);

  function RedshiftFormatter() {
    _classCallCheck(this, RedshiftFormatter);

    return _super.apply(this, arguments);
  }

  _createClass(RedshiftFormatter, [{
    key: "tokenizer",
    value: function tokenizer() {
      return new _core_Tokenizer__WEBPACK_IMPORTED_MODULE_1__["default"]({
        reservedWords: reservedWords,
        reservedTopLevelWords: reservedTopLevelWords,
        reservedNewlineWords: reservedNewlineWords,
        reservedTopLevelWordsNoIndent: reservedTopLevelWordsNoIndent,
        stringTypes: ["\"\"", "''", '``'],
        openParens: ['('],
        closeParens: [')'],
        indexedPlaceholderTypes: ['?'],
        namedPlaceholderTypes: ['@', '#', '$'],
        lineCommentTypes: ['--'],
        operators: ['|/', '||/', '<<', '>>', '!=', '||']
      });
    }
  }]);

  return RedshiftFormatter;
}(_core_Formatter__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),

/***/ "./src/languages/SparkSqlFormatter.js":
/*!********************************************!*\
  !*** ./src/languages/SparkSqlFormatter.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return SparkSqlFormatter; });
/* harmony import */ var _core_Formatter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/Formatter */ "./src/core/Formatter.js");
/* harmony import */ var _core_token__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/token */ "./src/core/token.js");
/* harmony import */ var _core_Tokenizer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/Tokenizer */ "./src/core/Tokenizer.js");
/* harmony import */ var _core_tokenTypes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/tokenTypes */ "./src/core/tokenTypes.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }





var reservedWords = ['ALL', 'ALTER', 'ANALYSE', 'ANALYZE', 'ARRAY_ZIP', 'ARRAY', 'AS', 'ASC', 'AVG', 'BETWEEN', 'CASCADE', 'CASE', 'CAST', 'COALESCE', 'COLLECT_LIST', 'COLLECT_SET', 'COLUMN', 'COLUMNS', 'COMMENT', 'CONSTRAINT', 'CONTAINS', 'CONVERT', 'COUNT', 'CUME_DIST', 'CURRENT ROW', 'CURRENT_DATE', 'CURRENT_TIMESTAMP', 'DATABASE', 'DATABASES', 'DATE_ADD', 'DATE_SUB', 'DATE_TRUNC', 'DAY_HOUR', 'DAY_MINUTE', 'DAY_SECOND', 'DAY', 'DAYS', 'DECODE', 'DEFAULT', 'DELETE', 'DENSE_RANK', 'DESC', 'DESCRIBE', 'DISTINCT', 'DISTINCTROW', 'DIV', 'DROP', 'ELSE', 'ENCODE', 'END', 'EXISTS', 'EXPLAIN', 'EXPLODE_OUTER', 'EXPLODE', 'FILTER', 'FIRST_VALUE', 'FIRST', 'FIXED', 'FLATTEN', 'FOLLOWING', 'FROM_UNIXTIME', 'FULL', 'GREATEST', 'GROUP_CONCAT', 'HOUR_MINUTE', 'HOUR_SECOND', 'HOUR', 'HOURS', 'IF', 'IFNULL', 'IN', 'INSERT', 'INTERVAL', 'INTO', 'IS', 'LAG', 'LAST_VALUE', 'LAST', 'LEAD', 'LEADING', 'LEAST', 'LEVEL', 'LIKE', 'MAX', 'MERGE', 'MIN', 'MINUTE_SECOND', 'MINUTE', 'MONTH', 'NATURAL', 'NOT', 'NOW()', 'NTILE', 'NULL', 'NULLIF', 'OFFSET', 'ON DELETE', 'ON UPDATE', 'ON', 'ONLY', 'OPTIMIZE', 'OVER', 'PERCENT_RANK', 'PRECEDING', 'RANGE', 'RANK', 'REGEXP', 'RENAME', 'RLIKE', 'ROW', 'ROWS', 'SECOND', 'SEPARATOR', 'SEQUENCE', 'SIZE', 'STRING', 'STRUCT', 'SUM', 'TABLE', 'TABLES', 'TEMPORARY', 'THEN', 'TO_DATE', 'TO_JSON', 'TO', 'TRAILING', 'TRANSFORM', 'TRUE', 'TRUNCATE', 'TYPE', 'TYPES', 'UNBOUNDED', 'UNIQUE', 'UNIX_TIMESTAMP', 'UNLOCK', 'UNSIGNED', 'USING', 'VARIABLES', 'VIEW', 'WHEN', 'WITH', 'YEAR_MONTH'];
var reservedTopLevelWords = ['ADD', 'AFTER', 'ALTER COLUMN', 'ALTER DATABASE', 'ALTER SCHEMA', 'ALTER TABLE', 'CLUSTER BY', 'CLUSTERED BY', 'DELETE FROM', 'DISTRIBUTE BY', 'FROM', 'GROUP BY', 'HAVING', 'INSERT INTO', 'INSERT', 'LIMIT', 'OPTIONS', 'ORDER BY', 'PARTITION BY', 'PARTITIONED BY', 'RANGE', 'ROWS', 'SELECT', 'SET CURRENT SCHEMA', 'SET SCHEMA', 'SET', 'TBLPROPERTIES', 'UPDATE', 'USING', 'VALUES', 'WHERE', 'WINDOW'];
var reservedTopLevelWordsNoIndent = ['EXCEPT ALL', 'EXCEPT', 'INTERSECT ALL', 'INTERSECT', 'UNION ALL', 'UNION'];
var reservedNewlineWords = ['AND', 'CREATE OR', 'CREATE', 'ELSE', 'LATERAL VIEW', 'OR', 'OUTER APPLY', 'WHEN', 'XOR', // joins
'JOIN', 'INNER JOIN', 'LEFT JOIN', 'LEFT OUTER JOIN', 'RIGHT JOIN', 'RIGHT OUTER JOIN', 'FULL JOIN', 'FULL OUTER JOIN', 'CROSS JOIN', 'NATURAL JOIN', // non-standard-joins
'ANTI JOIN', 'SEMI JOIN', 'LEFT ANTI JOIN', 'LEFT SEMI JOIN', 'RIGHT OUTER JOIN', 'RIGHT SEMI JOIN', 'NATURAL ANTI JOIN', 'NATURAL FULL OUTER JOIN', 'NATURAL INNER JOIN', 'NATURAL LEFT ANTI JOIN', 'NATURAL LEFT OUTER JOIN', 'NATURAL LEFT SEMI JOIN', 'NATURAL OUTER JOIN', 'NATURAL RIGHT OUTER JOIN', 'NATURAL RIGHT SEMI JOIN', 'NATURAL SEMI JOIN'];

var SparkSqlFormatter = /*#__PURE__*/function (_Formatter) {
  _inherits(SparkSqlFormatter, _Formatter);

  var _super = _createSuper(SparkSqlFormatter);

  function SparkSqlFormatter() {
    _classCallCheck(this, SparkSqlFormatter);

    return _super.apply(this, arguments);
  }

  _createClass(SparkSqlFormatter, [{
    key: "tokenizer",
    value: function tokenizer() {
      return new _core_Tokenizer__WEBPACK_IMPORTED_MODULE_2__["default"]({
        reservedWords: reservedWords,
        reservedTopLevelWords: reservedTopLevelWords,
        reservedNewlineWords: reservedNewlineWords,
        reservedTopLevelWordsNoIndent: reservedTopLevelWordsNoIndent,
        stringTypes: ["\"\"", "''", '``', '{}'],
        openParens: ['(', 'CASE'],
        closeParens: [')', 'END'],
        indexedPlaceholderTypes: ['?'],
        namedPlaceholderTypes: ['$'],
        lineCommentTypes: ['--'],
        operators: ['!=', '<=>', '&&', '||', '==']
      });
    }
  }, {
    key: "tokenOverride",
    value: function tokenOverride(token) {
      // Fix cases where names are ambiguously keywords or functions
      if (Object(_core_token__WEBPACK_IMPORTED_MODULE_1__["isWindow"])(token)) {
        var aheadToken = this.tokenLookAhead();

        if (aheadToken && aheadToken.type === _core_tokenTypes__WEBPACK_IMPORTED_MODULE_3__["default"].OPEN_PAREN) {
          // This is a function call, treat it as a reserved word
          return {
            type: _core_tokenTypes__WEBPACK_IMPORTED_MODULE_3__["default"].RESERVED,
            value: token.value
          };
        }
      } // Fix cases where names are ambiguously keywords or properties


      if (Object(_core_token__WEBPACK_IMPORTED_MODULE_1__["isEnd"])(token)) {
        var backToken = this.tokenLookBehind();

        if (backToken && backToken.type === _core_tokenTypes__WEBPACK_IMPORTED_MODULE_3__["default"].OPERATOR && backToken.value === '.') {
          // This is window().end (or similar) not CASE ... END
          return {
            type: _core_tokenTypes__WEBPACK_IMPORTED_MODULE_3__["default"].WORD,
            value: token.value
          };
        }
      }

      return token;
    }
  }]);

  return SparkSqlFormatter;
}(_core_Formatter__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),

/***/ "./src/languages/StandardSqlFormatter.js":
/*!***********************************************!*\
  !*** ./src/languages/StandardSqlFormatter.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return StandardSqlFormatter; });
/* harmony import */ var _core_Formatter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/Formatter */ "./src/core/Formatter.js");
/* harmony import */ var _core_Tokenizer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/Tokenizer */ "./src/core/Tokenizer.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }


 // https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#reserved-word

var reservedWords = ['ABS', 'ALL', 'ALLOCATE', 'ALTER', 'AND', 'ANY', 'ARE', 'ARRAY', 'AS', 'ASENSITIVE', 'ASYMMETRIC', 'AT', 'ATOMIC', 'AUTHORIZATION', 'AVG', 'BEGIN', 'BETWEEN', 'BIGINT', 'BINARY', 'BLOB', 'BOOLEAN', 'BOTH', 'BY', 'CALL', 'CALLED', 'CARDINALITY', 'CASCADED', 'CASE', 'CAST', 'CEIL', 'CEILING', 'CHAR', 'CHAR_LENGTH', 'CHARACTER', 'CHARACTER_LENGTH', 'CHECK', 'CLOB', 'CLOSE', 'COALESCE', 'COLLATE', 'COLLECT', 'COLUMN', 'COMMIT', 'CONDITION', 'CONNECT', 'CONSTRAINT', 'CONVERT', 'CORR', 'CORRESPONDING', 'COUNT', 'COVAR_POP', 'COVAR_SAMP', 'CREATE', 'CROSS', 'CUBE', 'CUME_DIST', 'CURRENT', 'CURRENT_CATALOG', 'CURRENT_DATE', 'CURRENT_DEFAULT_TRANSFORM_GROUP', 'CURRENT_PATH', 'CURRENT_ROLE', 'CURRENT_SCHEMA', 'CURRENT_TIME', 'CURRENT_TIMESTAMP', 'CURRENT_TRANSFORM_GROUP_FOR_TYPE', 'CURRENT_USER', 'CURSOR', 'CYCLE', 'DATE', 'DAY', 'DEALLOCATE', 'DEC', 'DECIMAL', 'DECLARE', 'DEFAULT', 'DELETE', 'DENSE_RANK', 'DEREF', 'DESCRIBE', 'DETERMINISTIC', 'DISCONNECT', 'DISTINCT', 'DOUBLE', 'DROP', 'DYNAMIC', 'EACH', 'ELEMENT', 'ELSE', 'END', 'END-EXEC', 'ESCAPE', 'EVERY', 'EXCEPT', 'EXEC', 'EXECUTE', 'EXISTS', 'EXP', 'EXTERNAL', 'EXTRACT', 'FALSE', 'FETCH', 'FILTER', 'FLOAT', 'FLOOR', 'FOR', 'FOREIGN', 'FREE', 'FROM', 'FULL', 'FUNCTION', 'FUSION', 'GET', 'GLOBAL', 'GRANT', 'GROUP', 'GROUPING', 'HAVING', 'HOLD', 'HOUR', 'IDENTITY', 'IN', 'INDICATOR', 'INNER', 'INOUT', 'INSENSITIVE', 'INSERT', 'INT', 'INTEGER', 'INTERSECT', 'INTERSECTION', 'INTERVAL', 'INTO', 'IS', 'JOIN', 'LANGUAGE', 'LARGE', 'LATERAL', 'LEADING', 'LEFT', 'LIKE', 'LIKE_REGEX', 'LN', 'LOCAL', 'LOCALTIME', 'LOCALTIMESTAMP', 'LOWER', 'MATCH', 'MAX', 'MEMBER', 'MERGE', 'METHOD', 'MIN', 'MINUTE', 'MOD', 'MODIFIES', 'MODULE', 'MONTH', 'MULTISET', 'NATIONAL', 'NATURAL', 'NCHAR', 'NCLOB', 'NEW', 'NO', 'NONE', 'NORMALIZE', 'NOT', 'NULL', 'NULLIF', 'NUMERIC', 'OCTET_LENGTH', 'OCCURRENCES_REGEX', 'OF', 'OLD', 'ON', 'ONLY', 'OPEN', 'OR', 'ORDER', 'OUT', 'OUTER', 'OVER', 'OVERLAPS', 'OVERLAY', 'PARAMETER', 'PARTITION', 'PERCENT_RANK', 'PERCENTILE_CONT', 'PERCENTILE_DISC', 'POSITION', 'POSITION_REGEX', 'POWER', 'PRECISION', 'PREPARE', 'PRIMARY', 'PROCEDURE', 'RANGE', 'RANK', 'READS', 'REAL', 'RECURSIVE', 'REF', 'REFERENCES', 'REFERENCING', 'REGR_AVGX', 'REGR_AVGY', 'REGR_COUNT', 'REGR_INTERCEPT', 'REGR_R2', 'REGR_SLOPE', 'REGR_SXX', 'REGR_SXY', 'REGR_SYY', 'RELEASE', 'RESULT', 'RETURN', 'RETURNS', 'REVOKE', 'RIGHT', 'ROLLBACK', 'ROLLUP', 'ROW', 'ROW_NUMBER', 'ROWS', 'SAVEPOINT', 'SCOPE', 'SCROLL', 'SEARCH', 'SECOND', 'SELECT', 'SENSITIVE', 'SESSION_USER', 'SET', 'SIMILAR', 'SMALLINT', 'SOME', 'SPECIFIC', 'SPECIFICTYPE', 'SQL', 'SQLEXCEPTION', 'SQLSTATE', 'SQLWARNING', 'SQRT', 'START', 'STATIC', 'STDDEV_POP', 'STDDEV_SAMP', 'SUBMULTISET', 'SUBSTRING', 'SUBSTRING_REGEX', 'SUM', 'SYMMETRIC', 'SYSTEM', 'SYSTEM_USER', 'TABLE', 'TABLESAMPLE', 'THEN', 'TIME', 'TIMESTAMP', 'TIMEZONE_HOUR', 'TIMEZONE_MINUTE', 'TO', 'TRAILING', 'TRANSLATE', 'TRANSLATE_REGEX', 'TRANSLATION', 'TREAT', 'TRIGGER', 'TRIM', 'TRUE', 'UESCAPE', 'UNION', 'UNIQUE', 'UNKNOWN', 'UNNEST', 'UPDATE', 'UPPER', 'USER', 'USING', 'VALUE', 'VALUES', 'VAR_POP', 'VAR_SAMP', 'VARBINARY', 'VARCHAR', 'VARYING', 'WHEN', 'WHENEVER', 'WHERE', 'WIDTH_BUCKET', 'WINDOW', 'WITH', 'WITHIN', 'WITHOUT', 'YEAR'];
var reservedTopLevelWords = ['ADD', 'ALTER COLUMN', 'ALTER TABLE', 'CASE', 'DELETE FROM', 'END', 'FETCH FIRST', 'FETCH NEXT', 'FETCH PRIOR', 'FETCH LAST', 'FETCH ABSOLUTE', 'FETCH RELATIVE', 'FROM', 'GROUP BY', 'HAVING', 'INSERT INTO', 'LIMIT', 'ORDER BY', 'SELECT', 'SET SCHEMA', 'SET', 'UPDATE', 'VALUES', 'WHERE'];
var reservedTopLevelWordsNoIndent = ['INTERSECT', 'INTERSECT ALL', 'INTERSECT DISTINCT', 'UNION', 'UNION ALL', 'UNION DISTINCT', 'EXCEPT', 'EXCEPT ALL', 'EXCEPT DISTINCT'];
var reservedNewlineWords = ['AND', 'ELSE', 'OR', 'WHEN', // joins
'JOIN', 'INNER JOIN', 'LEFT JOIN', 'LEFT OUTER JOIN', 'RIGHT JOIN', 'RIGHT OUTER JOIN', 'FULL JOIN', 'FULL OUTER JOIN', 'CROSS JOIN', 'NATURAL JOIN'];

var StandardSqlFormatter = /*#__PURE__*/function (_Formatter) {
  _inherits(StandardSqlFormatter, _Formatter);

  var _super = _createSuper(StandardSqlFormatter);

  function StandardSqlFormatter() {
    _classCallCheck(this, StandardSqlFormatter);

    return _super.apply(this, arguments);
  }

  _createClass(StandardSqlFormatter, [{
    key: "tokenizer",
    value: function tokenizer() {
      return new _core_Tokenizer__WEBPACK_IMPORTED_MODULE_1__["default"]({
        reservedWords: reservedWords,
        reservedTopLevelWords: reservedTopLevelWords,
        reservedNewlineWords: reservedNewlineWords,
        reservedTopLevelWordsNoIndent: reservedTopLevelWordsNoIndent,
        stringTypes: ["\"\"", "''"],
        openParens: ['(', 'CASE'],
        closeParens: [')', 'END'],
        indexedPlaceholderTypes: ['?'],
        namedPlaceholderTypes: [],
        lineCommentTypes: ['--']
      });
    }
  }]);

  return StandardSqlFormatter;
}(_core_Formatter__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),

/***/ "./src/languages/TSqlFormatter.js":
/*!****************************************!*\
  !*** ./src/languages/TSqlFormatter.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return TSqlFormatter; });
/* harmony import */ var _core_Formatter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/Formatter */ "./src/core/Formatter.js");
/* harmony import */ var _core_Tokenizer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/Tokenizer */ "./src/core/Tokenizer.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var reservedWords = ['ADD', 'EXTERNAL', 'PROCEDURE', 'ALL', 'FETCH', 'PUBLIC', 'ALTER', 'FILE', 'RAISERROR', 'AND', 'FILLFACTOR', 'READ', 'ANY', 'FOR', 'READTEXT', 'AS', 'FOREIGN', 'RECONFIGURE', 'ASC', 'FREETEXT', 'REFERENCES', 'AUTHORIZATION', 'FREETEXTTABLE', 'REPLICATION', 'BACKUP', 'FROM', 'RESTORE', 'BEGIN', 'FULL', 'RESTRICT', 'BETWEEN', 'FUNCTION', 'RETURN', 'BREAK', 'GOTO', 'REVERT', 'BROWSE', 'GRANT', 'REVOKE', 'BULK', 'GROUP', 'RIGHT', 'BY', 'HAVING', 'ROLLBACK', 'CASCADE', 'HOLDLOCK', 'ROWCOUNT', 'CASE', 'IDENTITY', 'ROWGUIDCOL', 'CHECK', 'IDENTITY_INSERT', 'RULE', 'CHECKPOINT', 'IDENTITYCOL', 'SAVE', 'CLOSE', 'IF', 'SCHEMA', 'CLUSTERED', 'IN', 'SECURITYAUDIT', 'COALESCE', 'INDEX', 'SELECT', 'COLLATE', 'INNER', 'SEMANTICKEYPHRASETABLE', 'COLUMN', 'INSERT', 'SEMANTICSIMILARITYDETAILSTABLE', 'COMMIT', 'INTERSECT', 'SEMANTICSIMILARITYTABLE', 'COMPUTE', 'INTO', 'SESSION_USER', 'CONSTRAINT', 'IS', 'SET', 'CONTAINS', 'JOIN', 'SETUSER', 'CONTAINSTABLE', 'KEY', 'SHUTDOWN', 'CONTINUE', 'KILL', 'SOME', 'CONVERT', 'LEFT', 'STATISTICS', 'CREATE', 'LIKE', 'SYSTEM_USER', 'CROSS', 'LINENO', 'TABLE', 'CURRENT', 'LOAD', 'TABLESAMPLE', 'CURRENT_DATE', 'MERGE', 'TEXTSIZE', 'CURRENT_TIME', 'NATIONAL', 'THEN', 'CURRENT_TIMESTAMP', 'NOCHECK', 'TO', 'CURRENT_USER', 'NONCLUSTERED', 'TOP', 'CURSOR', 'NOT', 'TRAN', 'DATABASE', 'NULL', 'TRANSACTION', 'DBCC', 'NULLIF', 'TRIGGER', 'DEALLOCATE', 'OF', 'TRUNCATE', 'DECLARE', 'OFF', 'TRY_CONVERT', 'DEFAULT', 'OFFSETS', 'TSEQUAL', 'DELETE', 'ON', 'UNION', 'DENY', 'OPEN', 'UNIQUE', 'DESC', 'OPENDATASOURCE', 'UNPIVOT', 'DISK', 'OPENQUERY', 'UPDATE', 'DISTINCT', 'OPENROWSET', 'UPDATETEXT', 'DISTRIBUTED', 'OPENXML', 'USE', 'DOUBLE', 'OPTION', 'USER', 'DROP', 'OR', 'VALUES', 'DUMP', 'ORDER', 'VARYING', 'ELSE', 'OUTER', 'VIEW', 'END', 'OVER', 'WAITFOR', 'ERRLVL', 'PERCENT', 'WHEN', 'ESCAPE', 'PIVOT', 'WHERE', 'EXCEPT', 'PLAN', 'WHILE', 'EXEC', 'PRECISION', 'WITH', 'EXECUTE', 'PRIMARY', 'WITHIN GROUP', 'EXISTS', 'PRINT', 'WRITETEXT', 'EXIT', 'PROC'];
var reservedTopLevelWords = ['ADD', 'ALTER COLUMN', 'ALTER TABLE', 'CASE', 'DELETE FROM', 'END', 'EXCEPT', 'FROM', 'GROUP BY', 'HAVING', 'INSERT INTO', 'INSERT', 'LIMIT', 'ORDER BY', 'SELECT', 'SET CURRENT SCHEMA', 'SET SCHEMA', 'SET', 'UPDATE', 'VALUES', 'WHERE'];
var reservedTopLevelWordsNoIndent = ['INTERSECT', 'INTERSECT ALL', 'MINUS', 'UNION', 'UNION ALL'];
var reservedNewlineWords = ['AND', 'ELSE', 'OR', 'WHEN', // joins
'JOIN', 'INNER JOIN', 'LEFT JOIN', 'LEFT OUTER JOIN', 'RIGHT JOIN', 'RIGHT OUTER JOIN', 'FULL JOIN', 'FULL OUTER JOIN', 'CROSS JOIN'];

var TSqlFormatter = /*#__PURE__*/function (_Formatter) {
  _inherits(TSqlFormatter, _Formatter);

  var _super = _createSuper(TSqlFormatter);

  function TSqlFormatter() {
    _classCallCheck(this, TSqlFormatter);

    return _super.apply(this, arguments);
  }

  _createClass(TSqlFormatter, [{
    key: "tokenizer",
    value: function tokenizer() {
      return new _core_Tokenizer__WEBPACK_IMPORTED_MODULE_1__["default"]({
        reservedWords: reservedWords,
        reservedTopLevelWords: reservedTopLevelWords,
        reservedNewlineWords: reservedNewlineWords,
        reservedTopLevelWordsNoIndent: reservedTopLevelWordsNoIndent,
        stringTypes: ["\"\"", "N''", "''", '[]'],
        openParens: ['(', 'CASE'],
        closeParens: [')', 'END'],
        indexedPlaceholderTypes: [],
        namedPlaceholderTypes: ['@'],
        lineCommentTypes: ['--'],
        specialWordChars: ['#', '@'],
        operators: ['>=', '<=', '<>', '!=', '!<', '!>', '+=', '-=', '*=', '/=', '%=', '|=', '&=', '^=', '::'] // TODO: Support for money constants

      });
    }
  }]);

  return TSqlFormatter;
}(_core_Formatter__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),

/***/ "./src/sqlFormatter.js":
/*!*****************************!*\
  !*** ./src/sqlFormatter.js ***!
  \*****************************/
/*! exports provided: format, supportedDialects */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "format", function() { return format; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "supportedDialects", function() { return supportedDialects; });
/* harmony import */ var _languages_Db2Formatter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./languages/Db2Formatter */ "./src/languages/Db2Formatter.js");
/* harmony import */ var _languages_MariaDbFormatter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./languages/MariaDbFormatter */ "./src/languages/MariaDbFormatter.js");
/* harmony import */ var _languages_MySqlFormatter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./languages/MySqlFormatter */ "./src/languages/MySqlFormatter.js");
/* harmony import */ var _languages_N1qlFormatter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./languages/N1qlFormatter */ "./src/languages/N1qlFormatter.js");
/* harmony import */ var _languages_PlSqlFormatter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./languages/PlSqlFormatter */ "./src/languages/PlSqlFormatter.js");
/* harmony import */ var _languages_PostgreSqlFormatter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./languages/PostgreSqlFormatter */ "./src/languages/PostgreSqlFormatter.js");
/* harmony import */ var _languages_RedshiftFormatter__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./languages/RedshiftFormatter */ "./src/languages/RedshiftFormatter.js");
/* harmony import */ var _languages_SparkSqlFormatter__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./languages/SparkSqlFormatter */ "./src/languages/SparkSqlFormatter.js");
/* harmony import */ var _languages_StandardSqlFormatter__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./languages/StandardSqlFormatter */ "./src/languages/StandardSqlFormatter.js");
/* harmony import */ var _languages_TSqlFormatter__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./languages/TSqlFormatter */ "./src/languages/TSqlFormatter.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }











var formatters = {
  db2: _languages_Db2Formatter__WEBPACK_IMPORTED_MODULE_0__["default"],
  mariadb: _languages_MariaDbFormatter__WEBPACK_IMPORTED_MODULE_1__["default"],
  mysql: _languages_MySqlFormatter__WEBPACK_IMPORTED_MODULE_2__["default"],
  n1ql: _languages_N1qlFormatter__WEBPACK_IMPORTED_MODULE_3__["default"],
  plsql: _languages_PlSqlFormatter__WEBPACK_IMPORTED_MODULE_4__["default"],
  postgresql: _languages_PostgreSqlFormatter__WEBPACK_IMPORTED_MODULE_5__["default"],
  redshift: _languages_RedshiftFormatter__WEBPACK_IMPORTED_MODULE_6__["default"],
  spark: _languages_SparkSqlFormatter__WEBPACK_IMPORTED_MODULE_7__["default"],
  sql: _languages_StandardSqlFormatter__WEBPACK_IMPORTED_MODULE_8__["default"],
  tsql: _languages_TSqlFormatter__WEBPACK_IMPORTED_MODULE_9__["default"]
};
/**
 * Format whitespace in a query to make it easier to read.
 *
 * @param {String} query
 * @param {Object} cfg
 *  @param {String} cfg.language Query language, default is Standard SQL
 *  @param {String} cfg.indent Characters used for indentation, default is "  " (2 spaces)
 *  @param {Boolean} cfg.uppercase Converts keywords to uppercase
 *  @param {Integer} cfg.linesBetweenQueries How many line breaks between queries
 *  @param {Object} cfg.params Collection of params for placeholder replacement
 * @return {String}
 */

var format = function format(query) {
  var cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (typeof query !== 'string') {
    throw new Error('Invalid query argument. Extected string, instead got ' + _typeof(query));
  }

  var Formatter = _languages_StandardSqlFormatter__WEBPACK_IMPORTED_MODULE_8__["default"];

  if (cfg.language !== undefined) {
    Formatter = formatters[cfg.language];
  }

  if (Formatter === undefined) {
    throw Error("Unsupported SQL dialect: ".concat(cfg.language));
  }

  return new Formatter(cfg).format(query);
};
var supportedDialects = Object.keys(formatters);

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/*! exports provided: trimSpacesEnd, last, isEmpty, escapeRegExp, sortByLengthDesc */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trimSpacesEnd", function() { return trimSpacesEnd; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "last", function() { return last; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isEmpty", function() { return isEmpty; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "escapeRegExp", function() { return escapeRegExp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sortByLengthDesc", function() { return sortByLengthDesc; });
// Only removes spaces, not newlines
var trimSpacesEnd = function trimSpacesEnd(str) {
  return str.replace(/[\t ]+$/, '');
}; // Last element from array

var last = function last(arr) {
  return arr[arr.length - 1];
}; // True array is empty, or it's not an array at all

var isEmpty = function isEmpty(arr) {
  return !Array.isArray(arr) || arr.length === 0;
}; // Escapes regex special chars

var escapeRegExp = function escapeRegExp(string) {
  return string.replace(/[\$\(-\+\.\?\[-\^\{-\}]/g, '\\$&');
}; // Sorts strings by length, so that longer ones are first
// Also sorts alphabetically after sorting by length.

var sortByLengthDesc = function sortByLengthDesc(strings) {
  return strings.sort(function (a, b) {
    return b.length - a.length || a.localeCompare(b);
  });
};

/***/ })

/******/ });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zcWxGb3JtYXR0ZXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL3NxbEZvcm1hdHRlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9zcWxGb3JtYXR0ZXIvLi9zcmMvY29yZS9Gb3JtYXR0ZXIuanMiLCJ3ZWJwYWNrOi8vc3FsRm9ybWF0dGVyLy4vc3JjL2NvcmUvSW5kZW50YXRpb24uanMiLCJ3ZWJwYWNrOi8vc3FsRm9ybWF0dGVyLy4vc3JjL2NvcmUvSW5saW5lQmxvY2suanMiLCJ3ZWJwYWNrOi8vc3FsRm9ybWF0dGVyLy4vc3JjL2NvcmUvUGFyYW1zLmpzIiwid2VicGFjazovL3NxbEZvcm1hdHRlci8uL3NyYy9jb3JlL1Rva2VuaXplci5qcyIsIndlYnBhY2s6Ly9zcWxGb3JtYXR0ZXIvLi9zcmMvY29yZS9yZWdleEZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vc3FsRm9ybWF0dGVyLy4vc3JjL2NvcmUvdG9rZW4uanMiLCJ3ZWJwYWNrOi8vc3FsRm9ybWF0dGVyLy4vc3JjL2NvcmUvdG9rZW5UeXBlcy5qcyIsIndlYnBhY2s6Ly9zcWxGb3JtYXR0ZXIvLi9zcmMvbGFuZ3VhZ2VzL0RiMkZvcm1hdHRlci5qcyIsIndlYnBhY2s6Ly9zcWxGb3JtYXR0ZXIvLi9zcmMvbGFuZ3VhZ2VzL01hcmlhRGJGb3JtYXR0ZXIuanMiLCJ3ZWJwYWNrOi8vc3FsRm9ybWF0dGVyLy4vc3JjL2xhbmd1YWdlcy9NeVNxbEZvcm1hdHRlci5qcyIsIndlYnBhY2s6Ly9zcWxGb3JtYXR0ZXIvLi9zcmMvbGFuZ3VhZ2VzL04xcWxGb3JtYXR0ZXIuanMiLCJ3ZWJwYWNrOi8vc3FsRm9ybWF0dGVyLy4vc3JjL2xhbmd1YWdlcy9QbFNxbEZvcm1hdHRlci5qcyIsIndlYnBhY2s6Ly9zcWxGb3JtYXR0ZXIvLi9zcmMvbGFuZ3VhZ2VzL1Bvc3RncmVTcWxGb3JtYXR0ZXIuanMiLCJ3ZWJwYWNrOi8vc3FsRm9ybWF0dGVyLy4vc3JjL2xhbmd1YWdlcy9SZWRzaGlmdEZvcm1hdHRlci5qcyIsIndlYnBhY2s6Ly9zcWxGb3JtYXR0ZXIvLi9zcmMvbGFuZ3VhZ2VzL1NwYXJrU3FsRm9ybWF0dGVyLmpzIiwid2VicGFjazovL3NxbEZvcm1hdHRlci8uL3NyYy9sYW5ndWFnZXMvU3RhbmRhcmRTcWxGb3JtYXR0ZXIuanMiLCJ3ZWJwYWNrOi8vc3FsRm9ybWF0dGVyLy4vc3JjL2xhbmd1YWdlcy9UU3FsRm9ybWF0dGVyLmpzIiwid2VicGFjazovL3NxbEZvcm1hdHRlci8uL3NyYy9zcWxGb3JtYXR0ZXIuanMiLCJ3ZWJwYWNrOi8vc3FsRm9ybWF0dGVyLy4vc3JjL3V0aWxzLmpzIl0sIm5hbWVzIjpbIkZvcm1hdHRlciIsImNmZyIsImluZGVudGF0aW9uIiwiSW5kZW50YXRpb24iLCJpbmRlbnQiLCJpbmxpbmVCbG9jayIsIklubGluZUJsb2NrIiwicGFyYW1zIiwiUGFyYW1zIiwicHJldmlvdXNSZXNlcnZlZFRva2VuIiwidG9rZW5zIiwiaW5kZXgiLCJFcnJvciIsInRva2VuIiwicXVlcnkiLCJ0b2tlbml6ZXIiLCJ0b2tlbml6ZSIsImZvcm1hdHRlZFF1ZXJ5IiwiZ2V0Rm9ybWF0dGVkUXVlcnlGcm9tVG9rZW5zIiwidHJpbSIsImZvckVhY2giLCJ0b2tlbk92ZXJyaWRlIiwidHlwZSIsInRva2VuVHlwZXMiLCJMSU5FX0NPTU1FTlQiLCJmb3JtYXRMaW5lQ29tbWVudCIsIkJMT0NLX0NPTU1FTlQiLCJmb3JtYXRCbG9ja0NvbW1lbnQiLCJSRVNFUlZFRF9UT1BfTEVWRUwiLCJmb3JtYXRUb3BMZXZlbFJlc2VydmVkV29yZCIsIlJFU0VSVkVEX1RPUF9MRVZFTF9OT19JTkRFTlQiLCJmb3JtYXRUb3BMZXZlbFJlc2VydmVkV29yZE5vSW5kZW50IiwiUkVTRVJWRURfTkVXTElORSIsImZvcm1hdE5ld2xpbmVSZXNlcnZlZFdvcmQiLCJSRVNFUlZFRCIsImZvcm1hdFdpdGhTcGFjZXMiLCJPUEVOX1BBUkVOIiwiZm9ybWF0T3BlbmluZ1BhcmVudGhlc2VzIiwiQ0xPU0VfUEFSRU4iLCJmb3JtYXRDbG9zaW5nUGFyZW50aGVzZXMiLCJQTEFDRUhPTERFUiIsImZvcm1hdFBsYWNlaG9sZGVyIiwidmFsdWUiLCJmb3JtYXRDb21tYSIsImZvcm1hdFdpdGhTcGFjZUFmdGVyIiwiZm9ybWF0V2l0aG91dFNwYWNlcyIsImZvcm1hdFF1ZXJ5U2VwYXJhdG9yIiwiYWRkTmV3bGluZSIsInNob3ciLCJpbmRlbnRDb21tZW50IiwiY29tbWVudCIsInJlcGxhY2UiLCJnZXRJbmRlbnQiLCJkZWNyZWFzZVRvcExldmVsIiwiZXF1YWxpemVXaGl0ZXNwYWNlIiwiaW5jcmVhc2VUb3BMZXZlbCIsImlzQW5kIiwiaXNCZXR3ZWVuIiwidG9rZW5Mb29rQmVoaW5kIiwic3RyaW5nIiwicHJlc2VydmVXaGl0ZXNwYWNlRm9yIiwiT1BFUkFUT1IiLCJ3aGl0ZXNwYWNlQmVmb3JlIiwibGVuZ3RoIiwidHJpbVNwYWNlc0VuZCIsImJlZ2luSWZQb3NzaWJsZSIsImlzQWN0aXZlIiwiaW5jcmVhc2VCbG9ja0xldmVsIiwiZW5kIiwiZGVjcmVhc2VCbG9ja0xldmVsIiwiZ2V0IiwiaXNMaW1pdCIsInJlc2V0SW5kZW50YXRpb24iLCJyZXBlYXQiLCJsaW5lc0JldHdlZW5RdWVyaWVzIiwidXBwZXJjYXNlIiwidG9VcHBlckNhc2UiLCJlbmRzV2l0aCIsIm4iLCJJTkRFTlRfVFlQRV9UT1BfTEVWRUwiLCJJTkRFTlRfVFlQRV9CTE9DS19MRVZFTCIsImluZGVudFR5cGVzIiwicHVzaCIsImxhc3QiLCJwb3AiLCJJTkxJTkVfTUFYX0xFTkdUSCIsImxldmVsIiwiaXNJbmxpbmVCbG9jayIsImkiLCJpc0ZvcmJpZGRlblRva2VuIiwiQ09NTUVOVCIsImtleSIsIlRva2VuaXplciIsIldISVRFU1BBQ0VfUkVHRVgiLCJOVU1CRVJfUkVHRVgiLCJPUEVSQVRPUl9SRUdFWCIsInJlZ2V4RmFjdG9yeSIsIm9wZXJhdG9ycyIsIkJMT0NLX0NPTU1FTlRfUkVHRVgiLCJMSU5FX0NPTU1FTlRfUkVHRVgiLCJsaW5lQ29tbWVudFR5cGVzIiwiUkVTRVJWRURfVE9QX0xFVkVMX1JFR0VYIiwicmVzZXJ2ZWRUb3BMZXZlbFdvcmRzIiwiUkVTRVJWRURfVE9QX0xFVkVMX05PX0lOREVOVF9SRUdFWCIsInJlc2VydmVkVG9wTGV2ZWxXb3Jkc05vSW5kZW50IiwiUkVTRVJWRURfTkVXTElORV9SRUdFWCIsInJlc2VydmVkTmV3bGluZVdvcmRzIiwiUkVTRVJWRURfUExBSU5fUkVHRVgiLCJyZXNlcnZlZFdvcmRzIiwiV09SRF9SRUdFWCIsInNwZWNpYWxXb3JkQ2hhcnMiLCJTVFJJTkdfUkVHRVgiLCJzdHJpbmdUeXBlcyIsIk9QRU5fUEFSRU5fUkVHRVgiLCJvcGVuUGFyZW5zIiwiQ0xPU0VfUEFSRU5fUkVHRVgiLCJjbG9zZVBhcmVucyIsIklOREVYRURfUExBQ0VIT0xERVJfUkVHRVgiLCJpbmRleGVkUGxhY2Vob2xkZXJUeXBlcyIsIklERU5UX05BTUVEX1BMQUNFSE9MREVSX1JFR0VYIiwibmFtZWRQbGFjZWhvbGRlclR5cGVzIiwiU1RSSU5HX05BTUVEX1BMQUNFSE9MREVSX1JFR0VYIiwiaW5wdXQiLCJnZXRXaGl0ZXNwYWNlIiwic3Vic3RyaW5nIiwiZ2V0TmV4dFRva2VuIiwibWF0Y2hlcyIsIm1hdGNoIiwicHJldmlvdXNUb2tlbiIsImdldENvbW1lbnRUb2tlbiIsImdldFN0cmluZ1Rva2VuIiwiZ2V0T3BlblBhcmVuVG9rZW4iLCJnZXRDbG9zZVBhcmVuVG9rZW4iLCJnZXRQbGFjZWhvbGRlclRva2VuIiwiZ2V0TnVtYmVyVG9rZW4iLCJnZXRSZXNlcnZlZFdvcmRUb2tlbiIsImdldFdvcmRUb2tlbiIsImdldE9wZXJhdG9yVG9rZW4iLCJnZXRMaW5lQ29tbWVudFRva2VuIiwiZ2V0QmxvY2tDb21tZW50VG9rZW4iLCJnZXRUb2tlbk9uRmlyc3RNYXRjaCIsInJlZ2V4IiwiU1RSSU5HIiwiZ2V0SWRlbnROYW1lZFBsYWNlaG9sZGVyVG9rZW4iLCJnZXRTdHJpbmdOYW1lZFBsYWNlaG9sZGVyVG9rZW4iLCJnZXRJbmRleGVkUGxhY2Vob2xkZXJUb2tlbiIsImdldFBsYWNlaG9sZGVyVG9rZW5XaXRoS2V5IiwicGFyc2VLZXkiLCJ2Iiwic2xpY2UiLCJnZXRFc2NhcGVkUGxhY2Vob2xkZXJLZXkiLCJxdW90ZUNoYXIiLCJSZWdFeHAiLCJlc2NhcGVSZWdFeHAiLCJOVU1CRVIiLCJ1bmRlZmluZWQiLCJnZXRUb3BMZXZlbFJlc2VydmVkVG9rZW4iLCJnZXROZXdsaW5lUmVzZXJ2ZWRUb2tlbiIsImdldFRvcExldmVsUmVzZXJ2ZWRUb2tlbk5vSW5kZW50IiwiZ2V0UGxhaW5SZXNlcnZlZFRva2VuIiwiV09SRCIsImNyZWF0ZU9wZXJhdG9yUmVnZXgiLCJtdWx0aUxldHRlck9wZXJhdG9ycyIsInNvcnRCeUxlbmd0aERlc2MiLCJtYXAiLCJqb2luIiwiY3JlYXRlTGluZUNvbW1lbnRSZWdleCIsImMiLCJjcmVhdGVSZXNlcnZlZFdvcmRSZWdleCIsInJlc2VydmVkV29yZHNQYXR0ZXJuIiwiY3JlYXRlV29yZFJlZ2V4Iiwic3BlY2lhbENoYXJzIiwiY3JlYXRlU3RyaW5nUmVnZXgiLCJjcmVhdGVTdHJpbmdQYXR0ZXJuIiwicGF0dGVybnMiLCIkJCIsInQiLCJjcmVhdGVQYXJlblJlZ2V4IiwicGFyZW5zIiwiZXNjYXBlUGFyZW4iLCJwYXJlbiIsImNyZWF0ZVBsYWNlaG9sZGVyUmVnZXgiLCJ0eXBlcyIsInBhdHRlcm4iLCJpc0VtcHR5IiwidHlwZXNSZWdleCIsImlzVG9rZW4iLCJ0ZXN0IiwiaXNTZXQiLCJpc0J5IiwiaXNXaW5kb3ciLCJpc0VuZCIsIkRiMkZvcm1hdHRlciIsIk1hcmlhRGJGb3JtYXR0ZXIiLCJNeVNxbEZvcm1hdHRlciIsIk4xcWxGb3JtYXR0ZXIiLCJQbFNxbEZvcm1hdHRlciIsIlBvc3RncmVTcWxGb3JtYXR0ZXIiLCJSZWRzaGlmdEZvcm1hdHRlciIsIlNwYXJrU3FsRm9ybWF0dGVyIiwiYWhlYWRUb2tlbiIsInRva2VuTG9va0FoZWFkIiwiYmFja1Rva2VuIiwiU3RhbmRhcmRTcWxGb3JtYXR0ZXIiLCJUU3FsRm9ybWF0dGVyIiwiZm9ybWF0dGVycyIsImRiMiIsIm1hcmlhZGIiLCJteXNxbCIsIm4xcWwiLCJwbHNxbCIsInBvc3RncmVzcWwiLCJyZWRzaGlmdCIsInNwYXJrIiwic3FsIiwidHNxbCIsImZvcm1hdCIsImxhbmd1YWdlIiwic3VwcG9ydGVkRGlhbGVjdHMiLCJPYmplY3QiLCJrZXlzIiwic3RyIiwiYXJyIiwiQXJyYXkiLCJpc0FycmF5Iiwic3RyaW5ncyIsInNvcnQiLCJhIiwiYiIsImxvY2FsZUNvbXBhcmUiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO1FDVkE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0lBRXFCQSxTO0FBQ25C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QUcsQ0FBQ0EsR0FBRyxDQUFDL0osTUFBSixHQUFhLENBQWQsQ0FBWjtBQUFBLENBQWIsQyxDQUVQOztBQUNPLElBQU15SCxPQUFPLEdBQUcsU0FBVkEsT0FBVSxDQUFDc0MsR0FBRDtBQUFBLFNBQVMsQ0FBQ0MsS0FBSyxDQUFDQyxPQUFOLENBQWNGLEdBQWQsQ0FBRCxJQUF1QkEsR0FBRyxDQUFDL0osTUFBSixLQUFlLENBQS9DO0FBQUEsQ0FBaEIsQyxDQUVQOztBQUNPLElBQU0wRixZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUFDOUYsTUFBRDtBQUFBLFNBQVlBLE1BQU0sQ0FBQ1IsT0FBUCxDQUFlLDBCQUFmLEVBQXVDLE1BQXZDLENBQVo7QUFBQSxDQUFyQixDLENBRVA7QUFDQTs7QUFDTyxJQUFNZ0gsZ0JBQWdCLEdBQUcsU0FBbkJBLGdCQUFtQixDQUFDOEQsT0FBRDtBQUFBLFNBQzlCQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxVQUFDQyxDQUFELEVBQUlDLENBQUosRUFBVTtBQUNyQixXQUFPQSxDQUFDLENBQUNySyxNQUFGLEdBQVdvSyxDQUFDLENBQUNwSyxNQUFiLElBQXVCb0ssQ0FBQyxDQUFDRSxhQUFGLENBQWdCRCxDQUFoQixDQUE5QjtBQUNELEdBRkQsQ0FEOEI7QUFBQSxDQUF6QixDIiwiZmlsZSI6InNxbC1mb3JtYXR0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJzcWxGb3JtYXR0ZXJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wic3FsRm9ybWF0dGVyXCJdID0gZmFjdG9yeSgpO1xufSkod2luZG93LCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9zcWxGb3JtYXR0ZXIuanNcIik7XG4iLCJpbXBvcnQgdG9rZW5UeXBlcyBmcm9tICcuL3Rva2VuVHlwZXMnO1xuaW1wb3J0IEluZGVudGF0aW9uIGZyb20gJy4vSW5kZW50YXRpb24nO1xuaW1wb3J0IElubGluZUJsb2NrIGZyb20gJy4vSW5saW5lQmxvY2snO1xuaW1wb3J0IFBhcmFtcyBmcm9tICcuL1BhcmFtcyc7XG5pbXBvcnQgeyB0cmltU3BhY2VzRW5kIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgaXNBbmQsIGlzQmV0d2VlbiwgaXNMaW1pdCB9IGZyb20gJy4vdG9rZW4nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGb3JtYXR0ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IGNmZ1xuICAgKiAgQHBhcmFtIHtTdHJpbmd9IGNmZy5sYW5ndWFnZVxuICAgKiAgQHBhcmFtIHtTdHJpbmd9IGNmZy5pbmRlbnRcbiAgICogIEBwYXJhbSB7Qm9vbGVhbn0gY2ZnLnVwcGVyY2FzZVxuICAgKiAgQHBhcmFtIHtJbnRlZ2VyfSBjZmcubGluZXNCZXR3ZWVuUXVlcmllc1xuICAgKiAgQHBhcmFtIHtPYmplY3R9IGNmZy5wYXJhbXNcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNmZykge1xuICAgIHRoaXMuY2ZnID0gY2ZnO1xuICAgIHRoaXMuaW5kZW50YXRpb24gPSBuZXcgSW5kZW50YXRpb24odGhpcy5jZmcuaW5kZW50KTtcbiAgICB0aGlzLmlubGluZUJsb2NrID0gbmV3IElubGluZUJsb2NrKCk7XG4gICAgdGhpcy5wYXJhbXMgPSBuZXcgUGFyYW1zKHRoaXMuY2ZnLnBhcmFtcyk7XG4gICAgdGhpcy5wcmV2aW91c1Jlc2VydmVkVG9rZW4gPSB7fTtcbiAgICB0aGlzLnRva2VucyA9IFtdO1xuICAgIHRoaXMuaW5kZXggPSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFNRTCBUb2tlbml6ZXIgZm9yIHRoaXMgZm9ybWF0dGVyLCBwcm92aWRlZCBieSBzdWJjbGFzc2VzLlxuICAgKi9cbiAgdG9rZW5pemVyKCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndG9rZW5pemVyKCkgbm90IGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzJyk7XG4gIH1cblxuICAvKipcbiAgICogUmVwcm9jZXNzIGFuZCBtb2RpZnkgYSB0b2tlbiBiYXNlZCBvbiBwYXJzZWQgY29udGV4dC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHRva2VuIFRoZSB0b2tlbiB0byBtb2RpZnlcbiAgICogIEBwYXJhbSB7U3RyaW5nfSB0b2tlbi50eXBlXG4gICAqICBAcGFyYW0ge1N0cmluZ30gdG9rZW4udmFsdWVcbiAgICogQHJldHVybiB7T2JqZWN0fSBuZXcgdG9rZW4gb3IgdGhlIG9yaWdpbmFsXG4gICAqICBAcmV0dXJuIHtTdHJpbmd9IHRva2VuLnR5cGVcbiAgICogIEByZXR1cm4ge1N0cmluZ30gdG9rZW4udmFsdWVcbiAgICovXG4gIHRva2VuT3ZlcnJpZGUodG9rZW4pIHtcbiAgICAvLyBzdWJjbGFzc2VzIGNhbiBvdmVycmlkZSB0aGlzIHRvIG1vZGlmeSB0b2tlbnMgZHVyaW5nIGZvcm1hdHRpbmdcbiAgICByZXR1cm4gdG9rZW47XG4gIH1cblxuICAvKipcbiAgICogRm9ybWF0cyB3aGl0ZXNwYWNlIGluIGEgU1FMIHN0cmluZyB0byBtYWtlIGl0IGVhc2llciB0byByZWFkLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcXVlcnkgVGhlIFNRTCBxdWVyeSBzdHJpbmdcbiAgICogQHJldHVybiB7U3RyaW5nfSBmb3JtYXR0ZWQgcXVlcnlcbiAgICovXG4gIGZvcm1hdChxdWVyeSkge1xuICAgIHRoaXMudG9rZW5zID0gdGhpcy50b2tlbml6ZXIoKS50b2tlbml6ZShxdWVyeSk7XG4gICAgY29uc3QgZm9ybWF0dGVkUXVlcnkgPSB0aGlzLmdldEZvcm1hdHRlZFF1ZXJ5RnJvbVRva2VucygpO1xuXG4gICAgcmV0dXJuIGZvcm1hdHRlZFF1ZXJ5LnRyaW0oKTtcbiAgfVxuXG4gIGdldEZvcm1hdHRlZFF1ZXJ5RnJvbVRva2VucygpIHtcbiAgICBsZXQgZm9ybWF0dGVkUXVlcnkgPSAnJztcblxuICAgIHRoaXMudG9rZW5zLmZvckVhY2goKHRva2VuLCBpbmRleCkgPT4ge1xuICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuXG4gICAgICB0b2tlbiA9IHRoaXMudG9rZW5PdmVycmlkZSh0b2tlbik7XG5cbiAgICAgIGlmICh0b2tlbi50eXBlID09PSB0b2tlblR5cGVzLkxJTkVfQ09NTUVOVCkge1xuICAgICAgICBmb3JtYXR0ZWRRdWVyeSA9IHRoaXMuZm9ybWF0TGluZUNvbW1lbnQodG9rZW4sIGZvcm1hdHRlZFF1ZXJ5KTtcbiAgICAgIH0gZWxzZSBpZiAodG9rZW4udHlwZSA9PT0gdG9rZW5UeXBlcy5CTE9DS19DT01NRU5UKSB7XG4gICAgICAgIGZvcm1hdHRlZFF1ZXJ5ID0gdGhpcy5mb3JtYXRCbG9ja0NvbW1lbnQodG9rZW4sIGZvcm1hdHRlZFF1ZXJ5KTtcbiAgICAgIH0gZWxzZSBpZiAodG9rZW4udHlwZSA9PT0gdG9rZW5UeXBlcy5SRVNFUlZFRF9UT1BfTEVWRUwpIHtcbiAgICAgICAgZm9ybWF0dGVkUXVlcnkgPSB0aGlzLmZvcm1hdFRvcExldmVsUmVzZXJ2ZWRXb3JkKHRva2VuLCBmb3JtYXR0ZWRRdWVyeSk7XG4gICAgICAgIHRoaXMucHJldmlvdXNSZXNlcnZlZFRva2VuID0gdG9rZW47XG4gICAgICB9IGVsc2UgaWYgKHRva2VuLnR5cGUgPT09IHRva2VuVHlwZXMuUkVTRVJWRURfVE9QX0xFVkVMX05PX0lOREVOVCkge1xuICAgICAgICBmb3JtYXR0ZWRRdWVyeSA9IHRoaXMuZm9ybWF0VG9wTGV2ZWxSZXNlcnZlZFdvcmROb0luZGVudCh0b2tlbiwgZm9ybWF0dGVkUXVlcnkpO1xuICAgICAgICB0aGlzLnByZXZpb3VzUmVzZXJ2ZWRUb2tlbiA9IHRva2VuO1xuICAgICAgfSBlbHNlIGlmICh0b2tlbi50eXBlID09PSB0b2tlblR5cGVzLlJFU0VSVkVEX05FV0xJTkUpIHtcbiAgICAgICAgZm9ybWF0dGVkUXVlcnkgPSB0aGlzLmZvcm1hdE5ld2xpbmVSZXNlcnZlZFdvcmQodG9rZW4sIGZvcm1hdHRlZFF1ZXJ5KTtcbiAgICAgICAgdGhpcy5wcmV2aW91c1Jlc2VydmVkVG9rZW4gPSB0b2tlbjtcbiAgICAgIH0gZWxzZSBpZiAodG9rZW4udHlwZSA9PT0gdG9rZW5UeXBlcy5SRVNFUlZFRCkge1xuICAgICAgICBmb3JtYXR0ZWRRdWVyeSA9IHRoaXMuZm9ybWF0V2l0aFNwYWNlcyh0b2tlbiwgZm9ybWF0dGVkUXVlcnkpO1xuICAgICAgICB0aGlzLnByZXZpb3VzUmVzZXJ2ZWRUb2tlbiA9IHRva2VuO1xuICAgICAgfSBlbHNlIGlmICh0b2tlbi50eXBlID09PSB0b2tlblR5cGVzLk9QRU5fUEFSRU4pIHtcbiAgICAgICAgZm9ybWF0dGVkUXVlcnkgPSB0aGlzLmZvcm1hdE9wZW5pbmdQYXJlbnRoZXNlcyh0b2tlbiwgZm9ybWF0dGVkUXVlcnkpO1xuICAgICAgfSBlbHNlIGlmICh0b2tlbi50eXBlID09PSB0b2tlblR5cGVzLkNMT1NFX1BBUkVOKSB7XG4gICAgICAgIGZvcm1hdHRlZFF1ZXJ5ID0gdGhpcy5mb3JtYXRDbG9zaW5nUGFyZW50aGVzZXModG9rZW4sIGZvcm1hdHRlZFF1ZXJ5KTtcbiAgICAgIH0gZWxzZSBpZiAodG9rZW4udHlwZSA9PT0gdG9rZW5UeXBlcy5QTEFDRUhPTERFUikge1xuICAgICAgICBmb3JtYXR0ZWRRdWVyeSA9IHRoaXMuZm9ybWF0UGxhY2Vob2xkZXIodG9rZW4sIGZvcm1hdHRlZFF1ZXJ5KTtcbiAgICAgIH0gZWxzZSBpZiAodG9rZW4udmFsdWUgPT09ICcsJykge1xuICAgICAgICBmb3JtYXR0ZWRRdWVyeSA9IHRoaXMuZm9ybWF0Q29tbWEodG9rZW4sIGZvcm1hdHRlZFF1ZXJ5KTtcbiAgICAgIH0gZWxzZSBpZiAodG9rZW4udmFsdWUgPT09ICc6Jykge1xuICAgICAgICBmb3JtYXR0ZWRRdWVyeSA9IHRoaXMuZm9ybWF0V2l0aFNwYWNlQWZ0ZXIodG9rZW4sIGZvcm1hdHRlZFF1ZXJ5KTtcbiAgICAgIH0gZWxzZSBpZiAodG9rZW4udmFsdWUgPT09ICcuJykge1xuICAgICAgICBmb3JtYXR0ZWRRdWVyeSA9IHRoaXMuZm9ybWF0V2l0aG91dFNwYWNlcyh0b2tlbiwgZm9ybWF0dGVkUXVlcnkpO1xuICAgICAgfSBlbHNlIGlmICh0b2tlbi52YWx1ZSA9PT0gJzsnKSB7XG4gICAgICAgIGZvcm1hdHRlZFF1ZXJ5ID0gdGhpcy5mb3JtYXRRdWVyeVNlcGFyYXRvcih0b2tlbiwgZm9ybWF0dGVkUXVlcnkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9ybWF0dGVkUXVlcnkgPSB0aGlzLmZvcm1hdFdpdGhTcGFjZXModG9rZW4sIGZvcm1hdHRlZFF1ZXJ5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZm9ybWF0dGVkUXVlcnk7XG4gIH1cblxuICBmb3JtYXRMaW5lQ29tbWVudCh0b2tlbiwgcXVlcnkpIHtcbiAgICByZXR1cm4gdGhpcy5hZGROZXdsaW5lKHF1ZXJ5ICsgdGhpcy5zaG93KHRva2VuKSk7XG4gIH1cblxuICBmb3JtYXRCbG9ja0NvbW1lbnQodG9rZW4sIHF1ZXJ5KSB7XG4gICAgcmV0dXJuIHRoaXMuYWRkTmV3bGluZSh0aGlzLmFkZE5ld2xpbmUocXVlcnkpICsgdGhpcy5pbmRlbnRDb21tZW50KHRva2VuLnZhbHVlKSk7XG4gIH1cblxuICBpbmRlbnRDb21tZW50KGNvbW1lbnQpIHtcbiAgICByZXR1cm4gY29tbWVudC5yZXBsYWNlKC9cXG5bIFxcdF0qL2d1LCAnXFxuJyArIHRoaXMuaW5kZW50YXRpb24uZ2V0SW5kZW50KCkgKyAnICcpO1xuICB9XG5cbiAgZm9ybWF0VG9wTGV2ZWxSZXNlcnZlZFdvcmROb0luZGVudCh0b2tlbiwgcXVlcnkpIHtcbiAgICB0aGlzLmluZGVudGF0aW9uLmRlY3JlYXNlVG9wTGV2ZWwoKTtcbiAgICBxdWVyeSA9IHRoaXMuYWRkTmV3bGluZShxdWVyeSkgKyB0aGlzLmVxdWFsaXplV2hpdGVzcGFjZSh0aGlzLnNob3codG9rZW4pKTtcbiAgICByZXR1cm4gdGhpcy5hZGROZXdsaW5lKHF1ZXJ5KTtcbiAgfVxuXG4gIGZvcm1hdFRvcExldmVsUmVzZXJ2ZWRXb3JkKHRva2VuLCBxdWVyeSkge1xuICAgIHRoaXMuaW5kZW50YXRpb24uZGVjcmVhc2VUb3BMZXZlbCgpO1xuXG4gICAgcXVlcnkgPSB0aGlzLmFkZE5ld2xpbmUocXVlcnkpO1xuXG4gICAgdGhpcy5pbmRlbnRhdGlvbi5pbmNyZWFzZVRvcExldmVsKCk7XG5cbiAgICBxdWVyeSArPSB0aGlzLmVxdWFsaXplV2hpdGVzcGFjZSh0aGlzLnNob3codG9rZW4pKTtcbiAgICByZXR1cm4gdGhpcy5hZGROZXdsaW5lKHF1ZXJ5KTtcbiAgfVxuXG4gIGZvcm1hdE5ld2xpbmVSZXNlcnZlZFdvcmQodG9rZW4sIHF1ZXJ5KSB7XG4gICAgaWYgKGlzQW5kKHRva2VuKSAmJiBpc0JldHdlZW4odGhpcy50b2tlbkxvb2tCZWhpbmQoMikpKSB7XG4gICAgICByZXR1cm4gdGhpcy5mb3JtYXRXaXRoU3BhY2VzKHRva2VuLCBxdWVyeSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmFkZE5ld2xpbmUocXVlcnkpICsgdGhpcy5lcXVhbGl6ZVdoaXRlc3BhY2UodGhpcy5zaG93KHRva2VuKSkgKyAnICc7XG4gIH1cblxuICAvLyBSZXBsYWNlIGFueSBzZXF1ZW5jZSBvZiB3aGl0ZXNwYWNlIGNoYXJhY3RlcnMgd2l0aCBzaW5nbGUgc3BhY2VcbiAgZXF1YWxpemVXaGl0ZXNwYWNlKHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZSgvXFxzKy9ndSwgJyAnKTtcbiAgfVxuXG4gIC8vIE9wZW5pbmcgcGFyZW50aGVzZXMgaW5jcmVhc2UgdGhlIGJsb2NrIGluZGVudCBsZXZlbCBhbmQgc3RhcnQgYSBuZXcgbGluZVxuICBmb3JtYXRPcGVuaW5nUGFyZW50aGVzZXModG9rZW4sIHF1ZXJ5KSB7XG4gICAgLy8gVGFrZSBvdXQgdGhlIHByZWNlZGluZyBzcGFjZSB1bmxlc3MgdGhlcmUgd2FzIHdoaXRlc3BhY2UgdGhlcmUgaW4gdGhlIG9yaWdpbmFsIHF1ZXJ5XG4gICAgLy8gb3IgYW5vdGhlciBvcGVuaW5nIHBhcmVucyBvciBsaW5lIGNvbW1lbnRcbiAgICBjb25zdCBwcmVzZXJ2ZVdoaXRlc3BhY2VGb3IgPSB7XG4gICAgICBbdG9rZW5UeXBlcy5PUEVOX1BBUkVOXTogdHJ1ZSxcbiAgICAgIFt0b2tlblR5cGVzLkxJTkVfQ09NTUVOVF06IHRydWUsXG4gICAgICBbdG9rZW5UeXBlcy5PUEVSQVRPUl06IHRydWUsXG4gICAgfTtcbiAgICBpZiAoXG4gICAgICB0b2tlbi53aGl0ZXNwYWNlQmVmb3JlLmxlbmd0aCA9PT0gMCAmJlxuICAgICAgIXByZXNlcnZlV2hpdGVzcGFjZUZvclt0aGlzLnRva2VuTG9va0JlaGluZCgpPy50eXBlXVxuICAgICkge1xuICAgICAgcXVlcnkgPSB0cmltU3BhY2VzRW5kKHF1ZXJ5KTtcbiAgICB9XG4gICAgcXVlcnkgKz0gdGhpcy5zaG93KHRva2VuKTtcblxuICAgIHRoaXMuaW5saW5lQmxvY2suYmVnaW5JZlBvc3NpYmxlKHRoaXMudG9rZW5zLCB0aGlzLmluZGV4KTtcblxuICAgIGlmICghdGhpcy5pbmxpbmVCbG9jay5pc0FjdGl2ZSgpKSB7XG4gICAgICB0aGlzLmluZGVudGF0aW9uLmluY3JlYXNlQmxvY2tMZXZlbCgpO1xuICAgICAgcXVlcnkgPSB0aGlzLmFkZE5ld2xpbmUocXVlcnkpO1xuICAgIH1cbiAgICByZXR1cm4gcXVlcnk7XG4gIH1cblxuICAvLyBDbG9zaW5nIHBhcmVudGhlc2VzIGRlY3JlYXNlIHRoZSBibG9jayBpbmRlbnQgbGV2ZWxcbiAgZm9ybWF0Q2xvc2luZ1BhcmVudGhlc2VzKHRva2VuLCBxdWVyeSkge1xuICAgIGlmICh0aGlzLmlubGluZUJsb2NrLmlzQWN0aXZlKCkpIHtcbiAgICAgIHRoaXMuaW5saW5lQmxvY2suZW5kKCk7XG4gICAgICByZXR1cm4gdGhpcy5mb3JtYXRXaXRoU3BhY2VBZnRlcih0b2tlbiwgcXVlcnkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmluZGVudGF0aW9uLmRlY3JlYXNlQmxvY2tMZXZlbCgpO1xuICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0V2l0aFNwYWNlcyh0b2tlbiwgdGhpcy5hZGROZXdsaW5lKHF1ZXJ5KSk7XG4gICAgfVxuICB9XG5cbiAgZm9ybWF0UGxhY2Vob2xkZXIodG9rZW4sIHF1ZXJ5KSB7XG4gICAgcmV0dXJuIHF1ZXJ5ICsgdGhpcy5wYXJhbXMuZ2V0KHRva2VuKSArICcgJztcbiAgfVxuXG4gIC8vIENvbW1hcyBzdGFydCBhIG5ldyBsaW5lICh1bmxlc3Mgd2l0aGluIGlubGluZSBwYXJlbnRoZXNlcyBvciBTUUwgXCJMSU1JVFwiIGNsYXVzZSlcbiAgZm9ybWF0Q29tbWEodG9rZW4sIHF1ZXJ5KSB7XG4gICAgcXVlcnkgPSB0cmltU3BhY2VzRW5kKHF1ZXJ5KSArIHRoaXMuc2hvdyh0b2tlbikgKyAnICc7XG5cbiAgICBpZiAodGhpcy5pbmxpbmVCbG9jay5pc0FjdGl2ZSgpKSB7XG4gICAgICByZXR1cm4gcXVlcnk7XG4gICAgfSBlbHNlIGlmIChpc0xpbWl0KHRoaXMucHJldmlvdXNSZXNlcnZlZFRva2VuKSkge1xuICAgICAgcmV0dXJuIHF1ZXJ5O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5hZGROZXdsaW5lKHF1ZXJ5KTtcbiAgICB9XG4gIH1cblxuICBmb3JtYXRXaXRoU3BhY2VBZnRlcih0b2tlbiwgcXVlcnkpIHtcbiAgICByZXR1cm4gdHJpbVNwYWNlc0VuZChxdWVyeSkgKyB0aGlzLnNob3codG9rZW4pICsgJyAnO1xuICB9XG5cbiAgZm9ybWF0V2l0aG91dFNwYWNlcyh0b2tlbiwgcXVlcnkpIHtcbiAgICByZXR1cm4gdHJpbVNwYWNlc0VuZChxdWVyeSkgKyB0aGlzLnNob3codG9rZW4pO1xuICB9XG5cbiAgZm9ybWF0V2l0aFNwYWNlcyh0b2tlbiwgcXVlcnkpIHtcbiAgICByZXR1cm4gcXVlcnkgKyB0aGlzLnNob3codG9rZW4pICsgJyAnO1xuICB9XG5cbiAgZm9ybWF0UXVlcnlTZXBhcmF0b3IodG9rZW4sIHF1ZXJ5KSB7XG4gICAgdGhpcy5pbmRlbnRhdGlvbi5yZXNldEluZGVudGF0aW9uKCk7XG4gICAgcmV0dXJuIHRyaW1TcGFjZXNFbmQocXVlcnkpICsgdGhpcy5zaG93KHRva2VuKSArICdcXG4nLnJlcGVhdCh0aGlzLmNmZy5saW5lc0JldHdlZW5RdWVyaWVzIHx8IDEpO1xuICB9XG5cbiAgLy8gQ29udmVydHMgdG9rZW4gdG8gc3RyaW5nICh1cHBlcmNhc2luZyBpdCBpZiBuZWVkZWQpXG4gIHNob3coeyB0eXBlLCB2YWx1ZSB9KSB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5jZmcudXBwZXJjYXNlICYmXG4gICAgICAodHlwZSA9PT0gdG9rZW5UeXBlcy5SRVNFUlZFRCB8fFxuICAgICAgICB0eXBlID09PSB0b2tlblR5cGVzLlJFU0VSVkVEX1RPUF9MRVZFTCB8fFxuICAgICAgICB0eXBlID09PSB0b2tlblR5cGVzLlJFU0VSVkVEX1RPUF9MRVZFTF9OT19JTkRFTlQgfHxcbiAgICAgICAgdHlwZSA9PT0gdG9rZW5UeXBlcy5SRVNFUlZFRF9ORVdMSU5FIHx8XG4gICAgICAgIHR5cGUgPT09IHRva2VuVHlwZXMuT1BFTl9QQVJFTiB8fFxuICAgICAgICB0eXBlID09PSB0b2tlblR5cGVzLkNMT1NFX1BBUkVOKVxuICAgICkge1xuICAgICAgcmV0dXJuIHZhbHVlLnRvVXBwZXJDYXNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBhZGROZXdsaW5lKHF1ZXJ5KSB7XG4gICAgcXVlcnkgPSB0cmltU3BhY2VzRW5kKHF1ZXJ5KTtcbiAgICBpZiAoIXF1ZXJ5LmVuZHNXaXRoKCdcXG4nKSkge1xuICAgICAgcXVlcnkgKz0gJ1xcbic7XG4gICAgfVxuICAgIHJldHVybiBxdWVyeSArIHRoaXMuaW5kZW50YXRpb24uZ2V0SW5kZW50KCk7XG4gIH1cblxuICB0b2tlbkxvb2tCZWhpbmQobiA9IDEpIHtcbiAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5pbmRleCAtIG5dO1xuICB9XG5cbiAgdG9rZW5Mb29rQWhlYWQobiA9IDEpIHtcbiAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5pbmRleCArIG5dO1xuICB9XG59XG4iLCJpbXBvcnQgeyBsYXN0IH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5jb25zdCBJTkRFTlRfVFlQRV9UT1BfTEVWRUwgPSAndG9wLWxldmVsJztcbmNvbnN0IElOREVOVF9UWVBFX0JMT0NLX0xFVkVMID0gJ2Jsb2NrLWxldmVsJztcblxuLyoqXG4gKiBNYW5hZ2VzIGluZGVudGF0aW9uIGxldmVscy5cbiAqXG4gKiBUaGVyZSBhcmUgdHdvIHR5cGVzIG9mIGluZGVudGF0aW9uIGxldmVsczpcbiAqXG4gKiAtIEJMT0NLX0xFVkVMIDogaW5jcmVhc2VkIGJ5IG9wZW4tcGFyZW50aGVzaXNcbiAqIC0gVE9QX0xFVkVMIDogaW5jcmVhc2VkIGJ5IFJFU0VSVkVEX1RPUF9MRVZFTCB3b3Jkc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbmRlbnRhdGlvbiB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaW5kZW50IEluZGVudCB2YWx1ZSwgZGVmYXVsdCBpcyBcIiAgXCIgKDIgc3BhY2VzKVxuICAgKi9cbiAgY29uc3RydWN0b3IoaW5kZW50KSB7XG4gICAgdGhpcy5pbmRlbnQgPSBpbmRlbnQgfHwgJyAgJztcbiAgICB0aGlzLmluZGVudFR5cGVzID0gW107XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBjdXJyZW50IGluZGVudGF0aW9uIHN0cmluZy5cbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cbiAgZ2V0SW5kZW50KCkge1xuICAgIHJldHVybiB0aGlzLmluZGVudC5yZXBlYXQodGhpcy5pbmRlbnRUeXBlcy5sZW5ndGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluY3JlYXNlcyBpbmRlbnRhdGlvbiBieSBvbmUgdG9wLWxldmVsIGluZGVudC5cbiAgICovXG4gIGluY3JlYXNlVG9wTGV2ZWwoKSB7XG4gICAgdGhpcy5pbmRlbnRUeXBlcy5wdXNoKElOREVOVF9UWVBFX1RPUF9MRVZFTCk7XG4gIH1cblxuICAvKipcbiAgICogSW5jcmVhc2VzIGluZGVudGF0aW9uIGJ5IG9uZSBibG9jay1sZXZlbCBpbmRlbnQuXG4gICAqL1xuICBpbmNyZWFzZUJsb2NrTGV2ZWwoKSB7XG4gICAgdGhpcy5pbmRlbnRUeXBlcy5wdXNoKElOREVOVF9UWVBFX0JMT0NLX0xFVkVMKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWNyZWFzZXMgaW5kZW50YXRpb24gYnkgb25lIHRvcC1sZXZlbCBpbmRlbnQuXG4gICAqIERvZXMgbm90aGluZyB3aGVuIHRoZSBwcmV2aW91cyBpbmRlbnQgaXMgbm90IHRvcC1sZXZlbC5cbiAgICovXG4gIGRlY3JlYXNlVG9wTGV2ZWwoKSB7XG4gICAgaWYgKHRoaXMuaW5kZW50VHlwZXMubGVuZ3RoID4gMCAmJiBsYXN0KHRoaXMuaW5kZW50VHlwZXMpID09PSBJTkRFTlRfVFlQRV9UT1BfTEVWRUwpIHtcbiAgICAgIHRoaXMuaW5kZW50VHlwZXMucG9wKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERlY3JlYXNlcyBpbmRlbnRhdGlvbiBieSBvbmUgYmxvY2stbGV2ZWwgaW5kZW50LlxuICAgKiBJZiB0aGVyZSBhcmUgdG9wLWxldmVsIGluZGVudHMgd2l0aGluIHRoZSBibG9jay1sZXZlbCBpbmRlbnQsXG4gICAqIHRocm93cyBhd2F5IHRoZXNlIGFzIHdlbGwuXG4gICAqL1xuICBkZWNyZWFzZUJsb2NrTGV2ZWwoKSB7XG4gICAgd2hpbGUgKHRoaXMuaW5kZW50VHlwZXMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgdHlwZSA9IHRoaXMuaW5kZW50VHlwZXMucG9wKCk7XG4gICAgICBpZiAodHlwZSAhPT0gSU5ERU5UX1RZUEVfVE9QX0xFVkVMKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlc2V0SW5kZW50YXRpb24oKSB7XG4gICAgdGhpcy5pbmRlbnRUeXBlcyA9IFtdO1xuICB9XG59XG4iLCJpbXBvcnQgdG9rZW5UeXBlcyBmcm9tICcuL3Rva2VuVHlwZXMnO1xuXG5jb25zdCBJTkxJTkVfTUFYX0xFTkdUSCA9IDUwO1xuXG4vKipcbiAqIEJvb2trZWVwZXIgZm9yIGlubGluZSBibG9ja3MuXG4gKlxuICogSW5saW5lIGJsb2NrcyBhcmUgcGFyZW50aGl6ZWQgZXhwcmVzc2lvbnMgdGhhdCBhcmUgc2hvcnRlciB0aGFuIElOTElORV9NQVhfTEVOR1RILlxuICogVGhlc2UgYmxvY2tzIGFyZSBmb3JtYXR0ZWQgb24gYSBzaW5nbGUgbGluZSwgdW5saWtlIGxvbmdlciBwYXJlbnRoaXplZFxuICogZXhwcmVzc2lvbnMgd2hlcmUgb3Blbi1wYXJlbnRoZXNpcyBjYXVzZXMgbmV3bGluZSBhbmQgaW5jcmVhc2Ugb2YgaW5kZW50YXRpb24uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElubGluZUJsb2NrIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5sZXZlbCA9IDA7XG4gIH1cblxuICAvKipcbiAgICogQmVnaW5zIGlubGluZSBibG9jayB3aGVuIGxvb2thaGVhZCB0aHJvdWdoIHVwY29taW5nIHRva2VucyBkZXRlcm1pbmVzXG4gICAqIHRoYXQgdGhlIGJsb2NrIHdvdWxkIGJlIHNtYWxsZXIgdGhhbiBJTkxJTkVfTUFYX0xFTkdUSC5cbiAgICogQHBhcmFtICB7T2JqZWN0W119IHRva2VucyBBcnJheSBvZiBhbGwgdG9rZW5zXG4gICAqIEBwYXJhbSAge051bWJlcn0gaW5kZXggQ3VycmVudCB0b2tlbiBwb3NpdGlvblxuICAgKi9cbiAgYmVnaW5JZlBvc3NpYmxlKHRva2VucywgaW5kZXgpIHtcbiAgICBpZiAodGhpcy5sZXZlbCA9PT0gMCAmJiB0aGlzLmlzSW5saW5lQmxvY2sodG9rZW5zLCBpbmRleCkpIHtcbiAgICAgIHRoaXMubGV2ZWwgPSAxO1xuICAgIH0gZWxzZSBpZiAodGhpcy5sZXZlbCA+IDApIHtcbiAgICAgIHRoaXMubGV2ZWwrKztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sZXZlbCA9IDA7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZpbmlzaGVzIGN1cnJlbnQgaW5saW5lIGJsb2NrLlxuICAgKiBUaGVyZSBtaWdodCBiZSBzZXZlcmFsIG5lc3RlZCBvbmVzLlxuICAgKi9cbiAgZW5kKCkge1xuICAgIHRoaXMubGV2ZWwtLTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcnVlIHdoZW4gaW5zaWRlIGFuIGlubGluZSBibG9ja1xuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgaXNBY3RpdmUoKSB7XG4gICAgcmV0dXJuIHRoaXMubGV2ZWwgPiAwO1xuICB9XG5cbiAgLy8gQ2hlY2sgaWYgdGhpcyBzaG91bGQgYmUgYW4gaW5saW5lIHBhcmVudGhlc2VzIGJsb2NrXG4gIC8vIEV4YW1wbGVzIGFyZSBcIk5PVygpXCIsIFwiQ09VTlQoKilcIiwgXCJpbnQoMTApXCIsIGtleShgc29tZWNvbHVtbmApLCBERUNJTUFMKDcsMilcbiAgaXNJbmxpbmVCbG9jayh0b2tlbnMsIGluZGV4KSB7XG4gICAgbGV0IGxlbmd0aCA9IDA7XG4gICAgbGV0IGxldmVsID0gMDtcblxuICAgIGZvciAobGV0IGkgPSBpbmRleDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgdG9rZW4gPSB0b2tlbnNbaV07XG4gICAgICBsZW5ndGggKz0gdG9rZW4udmFsdWUubGVuZ3RoO1xuXG4gICAgICAvLyBPdmVycmFuIG1heCBsZW5ndGhcbiAgICAgIGlmIChsZW5ndGggPiBJTkxJTkVfTUFYX0xFTkdUSCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh0b2tlbi50eXBlID09PSB0b2tlblR5cGVzLk9QRU5fUEFSRU4pIHtcbiAgICAgICAgbGV2ZWwrKztcbiAgICAgIH0gZWxzZSBpZiAodG9rZW4udHlwZSA9PT0gdG9rZW5UeXBlcy5DTE9TRV9QQVJFTikge1xuICAgICAgICBsZXZlbC0tO1xuICAgICAgICBpZiAobGV2ZWwgPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5pc0ZvcmJpZGRlblRva2VuKHRva2VuKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIFJlc2VydmVkIHdvcmRzIHRoYXQgY2F1c2UgbmV3bGluZXMsIGNvbW1lbnRzIGFuZCBzZW1pY29sb25zXG4gIC8vIGFyZSBub3QgYWxsb3dlZCBpbnNpZGUgaW5saW5lIHBhcmVudGhlc2VzIGJsb2NrXG4gIGlzRm9yYmlkZGVuVG9rZW4oeyB0eXBlLCB2YWx1ZSB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHR5cGUgPT09IHRva2VuVHlwZXMuUkVTRVJWRURfVE9QX0xFVkVMIHx8XG4gICAgICB0eXBlID09PSB0b2tlblR5cGVzLlJFU0VSVkVEX05FV0xJTkUgfHxcbiAgICAgIHR5cGUgPT09IHRva2VuVHlwZXMuQ09NTUVOVCB8fFxuICAgICAgdHlwZSA9PT0gdG9rZW5UeXBlcy5CTE9DS19DT01NRU5UIHx8XG4gICAgICB2YWx1ZSA9PT0gJzsnXG4gICAgKTtcbiAgfVxufVxuIiwiLyoqXG4gKiBIYW5kbGVzIHBsYWNlaG9sZGVyIHJlcGxhY2VtZW50IHdpdGggZ2l2ZW4gcGFyYW1zLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJhbXMge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICAgKi9cbiAgY29uc3RydWN0b3IocGFyYW1zKSB7XG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XG4gICAgdGhpcy5pbmRleCA9IDA7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBwYXJhbSB2YWx1ZSB0aGF0IG1hdGNoZXMgZ2l2ZW4gcGxhY2Vob2xkZXIgd2l0aCBwYXJhbSBrZXkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0b2tlblxuICAgKiAgIEBwYXJhbSB7U3RyaW5nfSB0b2tlbi5rZXkgUGxhY2Vob2xkZXIga2V5XG4gICAqICAgQHBhcmFtIHtTdHJpbmd9IHRva2VuLnZhbHVlIFBsYWNlaG9sZGVyIHZhbHVlXG4gICAqIEByZXR1cm4ge1N0cmluZ30gcGFyYW0gb3IgdG9rZW4udmFsdWUgd2hlbiBwYXJhbXMgYXJlIG1pc3NpbmdcbiAgICovXG4gIGdldCh7IGtleSwgdmFsdWUgfSkge1xuICAgIGlmICghdGhpcy5wYXJhbXMpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKGtleSkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyYW1zW2tleV07XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnBhcmFtc1t0aGlzLmluZGV4KytdO1xuICB9XG59XG4iLCJpbXBvcnQgdG9rZW5UeXBlcyBmcm9tICcuL3Rva2VuVHlwZXMnO1xuaW1wb3J0ICogYXMgcmVnZXhGYWN0b3J5IGZyb20gJy4vcmVnZXhGYWN0b3J5JztcbmltcG9ydCB7IGVzY2FwZVJlZ0V4cCB9IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG9rZW5pemVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjZmdcbiAgICogIEBwYXJhbSB7U3RyaW5nW119IGNmZy5yZXNlcnZlZFdvcmRzIFJlc2VydmVkIHdvcmRzIGluIFNRTFxuICAgKiAgQHBhcmFtIHtTdHJpbmdbXX0gY2ZnLnJlc2VydmVkVG9wTGV2ZWxXb3JkcyBXb3JkcyB0aGF0IGFyZSBzZXQgdG8gbmV3IGxpbmUgc2VwYXJhdGVseVxuICAgKiAgQHBhcmFtIHtTdHJpbmdbXX0gY2ZnLnJlc2VydmVkTmV3bGluZVdvcmRzIFdvcmRzIHRoYXQgYXJlIHNldCB0byBuZXdsaW5lXG4gICAqICBAcGFyYW0ge1N0cmluZ1tdfSBjZmcucmVzZXJ2ZWRUb3BMZXZlbFdvcmRzTm9JbmRlbnQgV29yZHMgdGhhdCBhcmUgdG9wIGxldmVsIGJ1dCBoYXZlIG5vIGluZGVudGF0aW9uXG4gICAqICBAcGFyYW0ge1N0cmluZ1tdfSBjZmcuc3RyaW5nVHlwZXMgU3RyaW5nIHR5cGVzIHRvIGVuYWJsZTogXCJcIiwgJycsIGBgLCBbXSwgTicnXG4gICAqICBAcGFyYW0ge1N0cmluZ1tdfSBjZmcub3BlblBhcmVucyBPcGVuaW5nIHBhcmVudGhlc2VzIHRvIGVuYWJsZSwgbGlrZSAoLCBbXG4gICAqICBAcGFyYW0ge1N0cmluZ1tdfSBjZmcuY2xvc2VQYXJlbnMgQ2xvc2luZyBwYXJlbnRoZXNlcyB0byBlbmFibGUsIGxpa2UgKSwgXVxuICAgKiAgQHBhcmFtIHtTdHJpbmdbXX0gY2ZnLmluZGV4ZWRQbGFjZWhvbGRlclR5cGVzIFByZWZpeGVzIGZvciBpbmRleGVkIHBsYWNlaG9sZGVycywgbGlrZSA/XG4gICAqICBAcGFyYW0ge1N0cmluZ1tdfSBjZmcubmFtZWRQbGFjZWhvbGRlclR5cGVzIFByZWZpeGVzIGZvciBuYW1lZCBwbGFjZWhvbGRlcnMsIGxpa2UgQCBhbmQgOlxuICAgKiAgQHBhcmFtIHtTdHJpbmdbXX0gY2ZnLmxpbmVDb21tZW50VHlwZXMgTGluZSBjb21tZW50cyB0byBlbmFibGUsIGxpa2UgIyBhbmQgLS1cbiAgICogIEBwYXJhbSB7U3RyaW5nW119IGNmZy5zcGVjaWFsV29yZENoYXJzIFNwZWNpYWwgY2hhcnMgdGhhdCBjYW4gYmUgZm91bmQgaW5zaWRlIG9mIHdvcmRzLCBsaWtlIEAgYW5kICNcbiAgICogIEBwYXJhbSB7U3RyaW5nW119IFtjZmcub3BlcmF0b3JdIEFkZGl0aW9uYWwgb3BlcmF0b3JzIHRvIHJlY29nbml6ZVxuICAgKi9cbiAgY29uc3RydWN0b3IoY2ZnKSB7XG4gICAgdGhpcy5XSElURVNQQUNFX1JFR0VYID0gL14oXFxzKykvdTtcbiAgICB0aGlzLk5VTUJFUl9SRUdFWCA9IC9eKCgtXFxzKik/WzAtOV0rKFxcLlswLTldKyk/KFtlRV0tP1swLTldKyhcXC5bMC05XSspPyk/fDB4WzAtOWEtZkEtRl0rfDBiWzAxXSspXFxiL3U7XG5cbiAgICB0aGlzLk9QRVJBVE9SX1JFR0VYID0gcmVnZXhGYWN0b3J5LmNyZWF0ZU9wZXJhdG9yUmVnZXgoW1xuICAgICAgJzw+JyxcbiAgICAgICc8PScsXG4gICAgICAnPj0nLFxuICAgICAgLi4uKGNmZy5vcGVyYXRvcnMgfHwgW10pLFxuICAgIF0pO1xuXG4gICAgdGhpcy5CTE9DS19DT01NRU5UX1JFR0VYID0gL14oXFwvXFwqW15dKj8oPzpcXCpcXC98JCkpL3U7XG4gICAgdGhpcy5MSU5FX0NPTU1FTlRfUkVHRVggPSByZWdleEZhY3RvcnkuY3JlYXRlTGluZUNvbW1lbnRSZWdleChjZmcubGluZUNvbW1lbnRUeXBlcyk7XG5cbiAgICB0aGlzLlJFU0VSVkVEX1RPUF9MRVZFTF9SRUdFWCA9IHJlZ2V4RmFjdG9yeS5jcmVhdGVSZXNlcnZlZFdvcmRSZWdleChjZmcucmVzZXJ2ZWRUb3BMZXZlbFdvcmRzKTtcbiAgICB0aGlzLlJFU0VSVkVEX1RPUF9MRVZFTF9OT19JTkRFTlRfUkVHRVggPSByZWdleEZhY3RvcnkuY3JlYXRlUmVzZXJ2ZWRXb3JkUmVnZXgoXG4gICAgICBjZmcucmVzZXJ2ZWRUb3BMZXZlbFdvcmRzTm9JbmRlbnRcbiAgICApO1xuICAgIHRoaXMuUkVTRVJWRURfTkVXTElORV9SRUdFWCA9IHJlZ2V4RmFjdG9yeS5jcmVhdGVSZXNlcnZlZFdvcmRSZWdleChjZmcucmVzZXJ2ZWROZXdsaW5lV29yZHMpO1xuICAgIHRoaXMuUkVTRVJWRURfUExBSU5fUkVHRVggPSByZWdleEZhY3RvcnkuY3JlYXRlUmVzZXJ2ZWRXb3JkUmVnZXgoY2ZnLnJlc2VydmVkV29yZHMpO1xuXG4gICAgdGhpcy5XT1JEX1JFR0VYID0gcmVnZXhGYWN0b3J5LmNyZWF0ZVdvcmRSZWdleChjZmcuc3BlY2lhbFdvcmRDaGFycyk7XG4gICAgdGhpcy5TVFJJTkdfUkVHRVggPSByZWdleEZhY3RvcnkuY3JlYXRlU3RyaW5nUmVnZXgoY2ZnLnN0cmluZ1R5cGVzKTtcblxuICAgIHRoaXMuT1BFTl9QQVJFTl9SRUdFWCA9IHJlZ2V4RmFjdG9yeS5jcmVhdGVQYXJlblJlZ2V4KGNmZy5vcGVuUGFyZW5zKTtcbiAgICB0aGlzLkNMT1NFX1BBUkVOX1JFR0VYID0gcmVnZXhGYWN0b3J5LmNyZWF0ZVBhcmVuUmVnZXgoY2ZnLmNsb3NlUGFyZW5zKTtcblxuICAgIHRoaXMuSU5ERVhFRF9QTEFDRUhPTERFUl9SRUdFWCA9IHJlZ2V4RmFjdG9yeS5jcmVhdGVQbGFjZWhvbGRlclJlZ2V4KFxuICAgICAgY2ZnLmluZGV4ZWRQbGFjZWhvbGRlclR5cGVzLFxuICAgICAgJ1swLTldKidcbiAgICApO1xuICAgIHRoaXMuSURFTlRfTkFNRURfUExBQ0VIT0xERVJfUkVHRVggPSByZWdleEZhY3RvcnkuY3JlYXRlUGxhY2Vob2xkZXJSZWdleChcbiAgICAgIGNmZy5uYW1lZFBsYWNlaG9sZGVyVHlwZXMsXG4gICAgICAnW2EtekEtWjAtOS5fJF0rJ1xuICAgICk7XG4gICAgdGhpcy5TVFJJTkdfTkFNRURfUExBQ0VIT0xERVJfUkVHRVggPSByZWdleEZhY3RvcnkuY3JlYXRlUGxhY2Vob2xkZXJSZWdleChcbiAgICAgIGNmZy5uYW1lZFBsYWNlaG9sZGVyVHlwZXMsXG4gICAgICByZWdleEZhY3RvcnkuY3JlYXRlU3RyaW5nUGF0dGVybihjZmcuc3RyaW5nVHlwZXMpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUYWtlcyBhIFNRTCBzdHJpbmcgYW5kIGJyZWFrcyBpdCBpbnRvIHRva2Vucy5cbiAgICogRWFjaCB0b2tlbiBpcyBhbiBvYmplY3Qgd2l0aCB0eXBlIGFuZCB2YWx1ZS5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBTUUwgc3RyaW5nXG4gICAqIEByZXR1cm4ge09iamVjdFtdfSB0b2tlbnMgQW4gYXJyYXkgb2YgdG9rZW5zLlxuICAgKiAgQHJldHVybiB7U3RyaW5nfSB0b2tlbi50eXBlXG4gICAqICBAcmV0dXJuIHtTdHJpbmd9IHRva2VuLnZhbHVlXG4gICAqICBAcmV0dXJuIHtTdHJpbmd9IHRva2VuLndoaXRlc3BhY2VCZWZvcmUgUHJlY2VkaW5nIHdoaXRlc3BhY2VcbiAgICovXG4gIHRva2VuaXplKGlucHV0KSB7XG4gICAgY29uc3QgdG9rZW5zID0gW107XG4gICAgbGV0IHRva2VuO1xuXG4gICAgLy8gS2VlcCBwcm9jZXNzaW5nIHRoZSBzdHJpbmcgdW50aWwgaXQgaXMgZW1wdHlcbiAgICB3aGlsZSAoaW5wdXQubGVuZ3RoKSB7XG4gICAgICAvLyBncmFiIGFueSBwcmVjZWRpbmcgd2hpdGVzcGFjZVxuICAgICAgY29uc3Qgd2hpdGVzcGFjZUJlZm9yZSA9IHRoaXMuZ2V0V2hpdGVzcGFjZShpbnB1dCk7XG4gICAgICBpbnB1dCA9IGlucHV0LnN1YnN0cmluZyh3aGl0ZXNwYWNlQmVmb3JlLmxlbmd0aCk7XG5cbiAgICAgIGlmIChpbnB1dC5sZW5ndGgpIHtcbiAgICAgICAgLy8gR2V0IHRoZSBuZXh0IHRva2VuIGFuZCB0aGUgdG9rZW4gdHlwZVxuICAgICAgICB0b2tlbiA9IHRoaXMuZ2V0TmV4dFRva2VuKGlucHV0LCB0b2tlbik7XG4gICAgICAgIC8vIEFkdmFuY2UgdGhlIHN0cmluZ1xuICAgICAgICBpbnB1dCA9IGlucHV0LnN1YnN0cmluZyh0b2tlbi52YWx1ZS5sZW5ndGgpO1xuXG4gICAgICAgIHRva2Vucy5wdXNoKHsgLi4udG9rZW4sIHdoaXRlc3BhY2VCZWZvcmUgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0b2tlbnM7XG4gIH1cblxuICBnZXRXaGl0ZXNwYWNlKGlucHV0KSB7XG4gICAgY29uc3QgbWF0Y2hlcyA9IGlucHV0Lm1hdGNoKHRoaXMuV0hJVEVTUEFDRV9SRUdFWCk7XG4gICAgcmV0dXJuIG1hdGNoZXMgPyBtYXRjaGVzWzFdIDogJyc7XG4gIH1cblxuICBnZXROZXh0VG9rZW4oaW5wdXQsIHByZXZpb3VzVG9rZW4pIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5nZXRDb21tZW50VG9rZW4oaW5wdXQpIHx8XG4gICAgICB0aGlzLmdldFN0cmluZ1Rva2VuKGlucHV0KSB8fFxuICAgICAgdGhpcy5nZXRPcGVuUGFyZW5Ub2tlbihpbnB1dCkgfHxcbiAgICAgIHRoaXMuZ2V0Q2xvc2VQYXJlblRva2VuKGlucHV0KSB8fFxuICAgICAgdGhpcy5nZXRQbGFjZWhvbGRlclRva2VuKGlucHV0KSB8fFxuICAgICAgdGhpcy5nZXROdW1iZXJUb2tlbihpbnB1dCkgfHxcbiAgICAgIHRoaXMuZ2V0UmVzZXJ2ZWRXb3JkVG9rZW4oaW5wdXQsIHByZXZpb3VzVG9rZW4pIHx8XG4gICAgICB0aGlzLmdldFdvcmRUb2tlbihpbnB1dCkgfHxcbiAgICAgIHRoaXMuZ2V0T3BlcmF0b3JUb2tlbihpbnB1dClcbiAgICApO1xuICB9XG5cbiAgZ2V0Q29tbWVudFRva2VuKGlucHV0KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0TGluZUNvbW1lbnRUb2tlbihpbnB1dCkgfHwgdGhpcy5nZXRCbG9ja0NvbW1lbnRUb2tlbihpbnB1dCk7XG4gIH1cblxuICBnZXRMaW5lQ29tbWVudFRva2VuKGlucHV0KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VG9rZW5PbkZpcnN0TWF0Y2goe1xuICAgICAgaW5wdXQsXG4gICAgICB0eXBlOiB0b2tlblR5cGVzLkxJTkVfQ09NTUVOVCxcbiAgICAgIHJlZ2V4OiB0aGlzLkxJTkVfQ09NTUVOVF9SRUdFWCxcbiAgICB9KTtcbiAgfVxuXG4gIGdldEJsb2NrQ29tbWVudFRva2VuKGlucHV0KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VG9rZW5PbkZpcnN0TWF0Y2goe1xuICAgICAgaW5wdXQsXG4gICAgICB0eXBlOiB0b2tlblR5cGVzLkJMT0NLX0NPTU1FTlQsXG4gICAgICByZWdleDogdGhpcy5CTE9DS19DT01NRU5UX1JFR0VYLFxuICAgIH0pO1xuICB9XG5cbiAgZ2V0U3RyaW5nVG9rZW4oaW5wdXQpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUb2tlbk9uRmlyc3RNYXRjaCh7XG4gICAgICBpbnB1dCxcbiAgICAgIHR5cGU6IHRva2VuVHlwZXMuU1RSSU5HLFxuICAgICAgcmVnZXg6IHRoaXMuU1RSSU5HX1JFR0VYLFxuICAgIH0pO1xuICB9XG5cbiAgZ2V0T3BlblBhcmVuVG9rZW4oaW5wdXQpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUb2tlbk9uRmlyc3RNYXRjaCh7XG4gICAgICBpbnB1dCxcbiAgICAgIHR5cGU6IHRva2VuVHlwZXMuT1BFTl9QQVJFTixcbiAgICAgIHJlZ2V4OiB0aGlzLk9QRU5fUEFSRU5fUkVHRVgsXG4gICAgfSk7XG4gIH1cblxuICBnZXRDbG9zZVBhcmVuVG9rZW4oaW5wdXQpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUb2tlbk9uRmlyc3RNYXRjaCh7XG4gICAgICBpbnB1dCxcbiAgICAgIHR5cGU6IHRva2VuVHlwZXMuQ0xPU0VfUEFSRU4sXG4gICAgICByZWdleDogdGhpcy5DTE9TRV9QQVJFTl9SRUdFWCxcbiAgICB9KTtcbiAgfVxuXG4gIGdldFBsYWNlaG9sZGVyVG9rZW4oaW5wdXQpIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5nZXRJZGVudE5hbWVkUGxhY2Vob2xkZXJUb2tlbihpbnB1dCkgfHxcbiAgICAgIHRoaXMuZ2V0U3RyaW5nTmFtZWRQbGFjZWhvbGRlclRva2VuKGlucHV0KSB8fFxuICAgICAgdGhpcy5nZXRJbmRleGVkUGxhY2Vob2xkZXJUb2tlbihpbnB1dClcbiAgICApO1xuICB9XG5cbiAgZ2V0SWRlbnROYW1lZFBsYWNlaG9sZGVyVG9rZW4oaW5wdXQpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQbGFjZWhvbGRlclRva2VuV2l0aEtleSh7XG4gICAgICBpbnB1dCxcbiAgICAgIHJlZ2V4OiB0aGlzLklERU5UX05BTUVEX1BMQUNFSE9MREVSX1JFR0VYLFxuICAgICAgcGFyc2VLZXk6ICh2KSA9PiB2LnNsaWNlKDEpLFxuICAgIH0pO1xuICB9XG5cbiAgZ2V0U3RyaW5nTmFtZWRQbGFjZWhvbGRlclRva2VuKGlucHV0KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGxhY2Vob2xkZXJUb2tlbldpdGhLZXkoe1xuICAgICAgaW5wdXQsXG4gICAgICByZWdleDogdGhpcy5TVFJJTkdfTkFNRURfUExBQ0VIT0xERVJfUkVHRVgsXG4gICAgICBwYXJzZUtleTogKHYpID0+XG4gICAgICAgIHRoaXMuZ2V0RXNjYXBlZFBsYWNlaG9sZGVyS2V5KHsga2V5OiB2LnNsaWNlKDIsIC0xKSwgcXVvdGVDaGFyOiB2LnNsaWNlKC0xKSB9KSxcbiAgICB9KTtcbiAgfVxuXG4gIGdldEluZGV4ZWRQbGFjZWhvbGRlclRva2VuKGlucHV0KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGxhY2Vob2xkZXJUb2tlbldpdGhLZXkoe1xuICAgICAgaW5wdXQsXG4gICAgICByZWdleDogdGhpcy5JTkRFWEVEX1BMQUNFSE9MREVSX1JFR0VYLFxuICAgICAgcGFyc2VLZXk6ICh2KSA9PiB2LnNsaWNlKDEpLFxuICAgIH0pO1xuICB9XG5cbiAgZ2V0UGxhY2Vob2xkZXJUb2tlbldpdGhLZXkoeyBpbnB1dCwgcmVnZXgsIHBhcnNlS2V5IH0pIHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMuZ2V0VG9rZW5PbkZpcnN0TWF0Y2goeyBpbnB1dCwgcmVnZXgsIHR5cGU6IHRva2VuVHlwZXMuUExBQ0VIT0xERVIgfSk7XG4gICAgaWYgKHRva2VuKSB7XG4gICAgICB0b2tlbi5rZXkgPSBwYXJzZUtleSh0b2tlbi52YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiB0b2tlbjtcbiAgfVxuXG4gIGdldEVzY2FwZWRQbGFjZWhvbGRlcktleSh7IGtleSwgcXVvdGVDaGFyIH0pIHtcbiAgICByZXR1cm4ga2V5LnJlcGxhY2UobmV3IFJlZ0V4cChlc2NhcGVSZWdFeHAoJ1xcXFwnICsgcXVvdGVDaGFyKSwgJ2d1JyksIHF1b3RlQ2hhcik7XG4gIH1cblxuICAvLyBEZWNpbWFsLCBiaW5hcnksIG9yIGhleCBudW1iZXJzXG4gIGdldE51bWJlclRva2VuKGlucHV0KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VG9rZW5PbkZpcnN0TWF0Y2goe1xuICAgICAgaW5wdXQsXG4gICAgICB0eXBlOiB0b2tlblR5cGVzLk5VTUJFUixcbiAgICAgIHJlZ2V4OiB0aGlzLk5VTUJFUl9SRUdFWCxcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFB1bmN0dWF0aW9uIGFuZCBzeW1ib2xzXG4gIGdldE9wZXJhdG9yVG9rZW4oaW5wdXQpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUb2tlbk9uRmlyc3RNYXRjaCh7XG4gICAgICBpbnB1dCxcbiAgICAgIHR5cGU6IHRva2VuVHlwZXMuT1BFUkFUT1IsXG4gICAgICByZWdleDogdGhpcy5PUEVSQVRPUl9SRUdFWCxcbiAgICB9KTtcbiAgfVxuXG4gIGdldFJlc2VydmVkV29yZFRva2VuKGlucHV0LCBwcmV2aW91c1Rva2VuKSB7XG4gICAgLy8gQSByZXNlcnZlZCB3b3JkIGNhbm5vdCBiZSBwcmVjZWRlZCBieSBhIFwiLlwiXG4gICAgLy8gdGhpcyBtYWtlcyBpdCBzbyBpbiBcIm15dGFibGUuZnJvbVwiLCBcImZyb21cIiBpcyBub3QgY29uc2lkZXJlZCBhIHJlc2VydmVkIHdvcmRcbiAgICBpZiAocHJldmlvdXNUb2tlbiAmJiBwcmV2aW91c1Rva2VuLnZhbHVlICYmIHByZXZpb3VzVG9rZW4udmFsdWUgPT09ICcuJykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuZ2V0VG9wTGV2ZWxSZXNlcnZlZFRva2VuKGlucHV0KSB8fFxuICAgICAgdGhpcy5nZXROZXdsaW5lUmVzZXJ2ZWRUb2tlbihpbnB1dCkgfHxcbiAgICAgIHRoaXMuZ2V0VG9wTGV2ZWxSZXNlcnZlZFRva2VuTm9JbmRlbnQoaW5wdXQpIHx8XG4gICAgICB0aGlzLmdldFBsYWluUmVzZXJ2ZWRUb2tlbihpbnB1dClcbiAgICApO1xuICB9XG5cbiAgZ2V0VG9wTGV2ZWxSZXNlcnZlZFRva2VuKGlucHV0KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VG9rZW5PbkZpcnN0TWF0Y2goe1xuICAgICAgaW5wdXQsXG4gICAgICB0eXBlOiB0b2tlblR5cGVzLlJFU0VSVkVEX1RPUF9MRVZFTCxcbiAgICAgIHJlZ2V4OiB0aGlzLlJFU0VSVkVEX1RPUF9MRVZFTF9SRUdFWCxcbiAgICB9KTtcbiAgfVxuXG4gIGdldE5ld2xpbmVSZXNlcnZlZFRva2VuKGlucHV0KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VG9rZW5PbkZpcnN0TWF0Y2goe1xuICAgICAgaW5wdXQsXG4gICAgICB0eXBlOiB0b2tlblR5cGVzLlJFU0VSVkVEX05FV0xJTkUsXG4gICAgICByZWdleDogdGhpcy5SRVNFUlZFRF9ORVdMSU5FX1JFR0VYLFxuICAgIH0pO1xuICB9XG5cbiAgZ2V0VG9wTGV2ZWxSZXNlcnZlZFRva2VuTm9JbmRlbnQoaW5wdXQpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUb2tlbk9uRmlyc3RNYXRjaCh7XG4gICAgICBpbnB1dCxcbiAgICAgIHR5cGU6IHRva2VuVHlwZXMuUkVTRVJWRURfVE9QX0xFVkVMX05PX0lOREVOVCxcbiAgICAgIHJlZ2V4OiB0aGlzLlJFU0VSVkVEX1RPUF9MRVZFTF9OT19JTkRFTlRfUkVHRVgsXG4gICAgfSk7XG4gIH1cblxuICBnZXRQbGFpblJlc2VydmVkVG9rZW4oaW5wdXQpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUb2tlbk9uRmlyc3RNYXRjaCh7XG4gICAgICBpbnB1dCxcbiAgICAgIHR5cGU6IHRva2VuVHlwZXMuUkVTRVJWRUQsXG4gICAgICByZWdleDogdGhpcy5SRVNFUlZFRF9QTEFJTl9SRUdFWCxcbiAgICB9KTtcbiAgfVxuXG4gIGdldFdvcmRUb2tlbihpbnB1dCkge1xuICAgIHJldHVybiB0aGlzLmdldFRva2VuT25GaXJzdE1hdGNoKHtcbiAgICAgIGlucHV0LFxuICAgICAgdHlwZTogdG9rZW5UeXBlcy5XT1JELFxuICAgICAgcmVnZXg6IHRoaXMuV09SRF9SRUdFWCxcbiAgICB9KTtcbiAgfVxuXG4gIGdldFRva2VuT25GaXJzdE1hdGNoKHsgaW5wdXQsIHR5cGUsIHJlZ2V4IH0pIHtcbiAgICBjb25zdCBtYXRjaGVzID0gaW5wdXQubWF0Y2gocmVnZXgpO1xuXG4gICAgcmV0dXJuIG1hdGNoZXMgPyB7IHR5cGUsIHZhbHVlOiBtYXRjaGVzWzFdIH0gOiB1bmRlZmluZWQ7XG4gIH1cbn1cbiIsImltcG9ydCB7IGVzY2FwZVJlZ0V4cCwgaXNFbXB0eSwgc29ydEJ5TGVuZ3RoRGVzYyB9IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU9wZXJhdG9yUmVnZXgobXVsdGlMZXR0ZXJPcGVyYXRvcnMpIHtcbiAgcmV0dXJuIG5ldyBSZWdFeHAoXG4gICAgYF4oJHtzb3J0QnlMZW5ndGhEZXNjKG11bHRpTGV0dGVyT3BlcmF0b3JzKS5tYXAoZXNjYXBlUmVnRXhwKS5qb2luKCd8Jyl9fC4pYCxcbiAgICAndSdcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUxpbmVDb21tZW50UmVnZXgobGluZUNvbW1lbnRUeXBlcykge1xuICByZXR1cm4gbmV3IFJlZ0V4cChcbiAgICBgXigoPzoke2xpbmVDb21tZW50VHlwZXMubWFwKChjKSA9PiBlc2NhcGVSZWdFeHAoYykpLmpvaW4oJ3wnKX0pLio/KSg/OlxcclxcbnxcXHJ8XFxufCQpYCxcbiAgICAndSdcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVJlc2VydmVkV29yZFJlZ2V4KHJlc2VydmVkV29yZHMpIHtcbiAgaWYgKHJlc2VydmVkV29yZHMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoYF5cXGIkYCwgJ3UnKTtcbiAgfVxuICBjb25zdCByZXNlcnZlZFdvcmRzUGF0dGVybiA9IHNvcnRCeUxlbmd0aERlc2MocmVzZXJ2ZWRXb3Jkcykuam9pbignfCcpLnJlcGxhY2UoLyAvZ3UsICdcXFxccysnKTtcbiAgcmV0dXJuIG5ldyBSZWdFeHAoYF4oJHtyZXNlcnZlZFdvcmRzUGF0dGVybn0pXFxcXGJgLCAnaXUnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVdvcmRSZWdleChzcGVjaWFsQ2hhcnMgPSBbXSkge1xuICByZXR1cm4gbmV3IFJlZ0V4cChcbiAgICBgXihbXFxcXHB7QWxwaGFiZXRpY31cXFxccHtNYXJrfVxcXFxwe0RlY2ltYWxfTnVtYmVyfVxcXFxwe0Nvbm5lY3Rvcl9QdW5jdHVhdGlvbn1cXFxccHtKb2luX0NvbnRyb2x9JHtzcGVjaWFsQ2hhcnMuam9pbihcbiAgICAgICcnXG4gICAgKX1dKylgLFxuICAgICd1J1xuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3RyaW5nUmVnZXgoc3RyaW5nVHlwZXMpIHtcbiAgcmV0dXJuIG5ldyBSZWdFeHAoJ14oJyArIGNyZWF0ZVN0cmluZ1BhdHRlcm4oc3RyaW5nVHlwZXMpICsgJyknLCAndScpO1xufVxuXG4vLyBUaGlzIGVuYWJsZXMgdGhlIGZvbGxvd2luZyBzdHJpbmcgcGF0dGVybnM6XG4vLyAxLiBiYWNrdGljayBxdW90ZWQgc3RyaW5nIHVzaW5nIGBgIHRvIGVzY2FwZVxuLy8gMi4gc3F1YXJlIGJyYWNrZXQgcXVvdGVkIHN0cmluZyAoU1FMIFNlcnZlcikgdXNpbmcgXV0gdG8gZXNjYXBlXG4vLyAzLiBkb3VibGUgcXVvdGVkIHN0cmluZyB1c2luZyBcIlwiIG9yIFxcXCIgdG8gZXNjYXBlXG4vLyA0LiBzaW5nbGUgcXVvdGVkIHN0cmluZyB1c2luZyAnJyBvciBcXCcgdG8gZXNjYXBlXG4vLyA1LiBuYXRpb25hbCBjaGFyYWN0ZXIgcXVvdGVkIHN0cmluZyB1c2luZyBOJycgb3IgTlxcJyB0byBlc2NhcGVcbi8vIDYuIFVuaWNvZGUgc2luZ2xlLXF1b3RlZCBzdHJpbmcgdXNpbmcgXFwnIHRvIGVzY2FwZVxuLy8gNy4gVW5pY29kZSBkb3VibGUtcXVvdGVkIHN0cmluZyB1c2luZyBcXFwiIHRvIGVzY2FwZVxuLy8gOC4gUG9zdGdyZVNRTCBkb2xsYXItcXVvdGVkIHN0cmluZ3NcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTdHJpbmdQYXR0ZXJuKHN0cmluZ1R5cGVzKSB7XG4gIGNvbnN0IHBhdHRlcm5zID0ge1xuICAgICdgYCc6ICcoKGBbXmBdKigkfGApKSspJyxcbiAgICAne30nOiAnKChcXFxce1teXFxcXH1dKigkfFxcXFx9KSkrKScsXG4gICAgJ1tdJzogJygoXFxcXFtbXlxcXFxdXSooJHxcXFxcXSkpKFxcXFxdW15cXFxcXV0qKCR8XFxcXF0pKSopJyxcbiAgICAnXCJcIic6ICcoKFwiW15cIlxcXFxcXFxcXSooPzpcXFxcXFxcXC5bXlwiXFxcXFxcXFxdKikqKFwifCQpKSspJyxcbiAgICBcIicnXCI6IFwiKCgnW14nXFxcXFxcXFxdKig/OlxcXFxcXFxcLlteJ1xcXFxcXFxcXSopKignfCQpKSspXCIsXG4gICAgXCJOJydcIjogXCIoKE4nW14nXFxcXFxcXFxdKig/OlxcXFxcXFxcLlteJ1xcXFxcXFxcXSopKignfCQpKSspXCIsXG4gICAgXCJVJicnXCI6IFwiKChVJidbXidcXFxcXFxcXF0qKD86XFxcXFxcXFwuW14nXFxcXFxcXFxdKikqKCd8JCkpKylcIixcbiAgICAnVSZcIlwiJzogJygoVSZcIlteXCJcXFxcXFxcXF0qKD86XFxcXFxcXFwuW15cIlxcXFxcXFxcXSopKihcInwkKSkrKScsXG4gICAgJCQ6ICcoKD88dGFnPlxcXFwkXFxcXHcqXFxcXCQpW1xcXFxzXFxcXFNdKj8oPzpcXFxcazx0YWc+fCQpKScsXG4gIH07XG5cbiAgcmV0dXJuIHN0cmluZ1R5cGVzLm1hcCgodCkgPT4gcGF0dGVybnNbdF0pLmpvaW4oJ3wnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVBhcmVuUmVnZXgocGFyZW5zKSB7XG4gIHJldHVybiBuZXcgUmVnRXhwKCdeKCcgKyBwYXJlbnMubWFwKGVzY2FwZVBhcmVuKS5qb2luKCd8JykgKyAnKScsICdpdScpO1xufVxuXG5mdW5jdGlvbiBlc2NhcGVQYXJlbihwYXJlbikge1xuICBpZiAocGFyZW4ubGVuZ3RoID09PSAxKSB7XG4gICAgLy8gQSBzaW5nbGUgcHVuY3R1YXRpb24gY2hhcmFjdGVyXG4gICAgcmV0dXJuIGVzY2FwZVJlZ0V4cChwYXJlbik7XG4gIH0gZWxzZSB7XG4gICAgLy8gbG9uZ2VyIHdvcmRcbiAgICByZXR1cm4gJ1xcXFxiJyArIHBhcmVuICsgJ1xcXFxiJztcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUGxhY2Vob2xkZXJSZWdleCh0eXBlcywgcGF0dGVybikge1xuICBpZiAoaXNFbXB0eSh0eXBlcykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgdHlwZXNSZWdleCA9IHR5cGVzLm1hcChlc2NhcGVSZWdFeHApLmpvaW4oJ3wnKTtcblxuICByZXR1cm4gbmV3IFJlZ0V4cChgXigoPzoke3R5cGVzUmVnZXh9KSg/OiR7cGF0dGVybn0pKWAsICd1Jyk7XG59XG4iLCJpbXBvcnQgdG9rZW5UeXBlcyBmcm9tICcuL3Rva2VuVHlwZXMnO1xuXG5jb25zdCBpc1Rva2VuID0gKHR5cGUsIHJlZ2V4KSA9PiAodG9rZW4pID0+IHRva2VuPy50eXBlID09PSB0eXBlICYmIHJlZ2V4LnRlc3QodG9rZW4/LnZhbHVlKTtcblxuZXhwb3J0IGNvbnN0IGlzQW5kID0gaXNUb2tlbih0b2tlblR5cGVzLlJFU0VSVkVEX05FV0xJTkUsIC9eQU5EJC9pdSk7XG5cbmV4cG9ydCBjb25zdCBpc0JldHdlZW4gPSBpc1Rva2VuKHRva2VuVHlwZXMuUkVTRVJWRUQsIC9eQkVUV0VFTiQvaXUpO1xuXG5leHBvcnQgY29uc3QgaXNMaW1pdCA9IGlzVG9rZW4odG9rZW5UeXBlcy5SRVNFUlZFRF9UT1BfTEVWRUwsIC9eTElNSVQkL2l1KTtcblxuZXhwb3J0IGNvbnN0IGlzU2V0ID0gaXNUb2tlbih0b2tlblR5cGVzLlJFU0VSVkVEX1RPUF9MRVZFTCwgL15TRVQkL2l1KTtcblxuZXhwb3J0IGNvbnN0IGlzQnkgPSBpc1Rva2VuKHRva2VuVHlwZXMuUkVTRVJWRUQsIC9eQlkkL2l1KTtcblxuZXhwb3J0IGNvbnN0IGlzV2luZG93ID0gaXNUb2tlbih0b2tlblR5cGVzLlJFU0VSVkVEX1RPUF9MRVZFTCwgL15XSU5ET1ckL2l1KTtcblxuZXhwb3J0IGNvbnN0IGlzRW5kID0gaXNUb2tlbih0b2tlblR5cGVzLkNMT1NFX1BBUkVOLCAvXkVORCQvaXUpO1xuIiwiLyoqXG4gKiBDb25zdGFudHMgZm9yIHRva2VuIHR5cGVzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IHtcbiAgV09SRDogJ3dvcmQnLFxuICBTVFJJTkc6ICdzdHJpbmcnLFxuICBSRVNFUlZFRDogJ3Jlc2VydmVkJyxcbiAgUkVTRVJWRURfVE9QX0xFVkVMOiAncmVzZXJ2ZWQtdG9wLWxldmVsJyxcbiAgUkVTRVJWRURfVE9QX0xFVkVMX05PX0lOREVOVDogJ3Jlc2VydmVkLXRvcC1sZXZlbC1uby1pbmRlbnQnLFxuICBSRVNFUlZFRF9ORVdMSU5FOiAncmVzZXJ2ZWQtbmV3bGluZScsXG4gIE9QRVJBVE9SOiAnb3BlcmF0b3InLFxuICBPUEVOX1BBUkVOOiAnb3Blbi1wYXJlbicsXG4gIENMT1NFX1BBUkVOOiAnY2xvc2UtcGFyZW4nLFxuICBMSU5FX0NPTU1FTlQ6ICdsaW5lLWNvbW1lbnQnLFxuICBCTE9DS19DT01NRU5UOiAnYmxvY2stY29tbWVudCcsXG4gIE5VTUJFUjogJ251bWJlcicsXG4gIFBMQUNFSE9MREVSOiAncGxhY2Vob2xkZXInLFxufTtcbiIsImltcG9ydCBGb3JtYXR0ZXIgZnJvbSAnLi4vY29yZS9Gb3JtYXR0ZXInO1xuaW1wb3J0IFRva2VuaXplciBmcm9tICcuLi9jb3JlL1Rva2VuaXplcic7XG5cbmNvbnN0IHJlc2VydmVkV29yZHMgPSBbXG4gICdBQlMnLFxuICAnQUNUSVZBVEUnLFxuICAnQUxJQVMnLFxuICAnQUxMJyxcbiAgJ0FMTE9DQVRFJyxcbiAgJ0FMTE9XJyxcbiAgJ0FMVEVSJyxcbiAgJ0FOWScsXG4gICdBUkUnLFxuICAnQVJSQVknLFxuICAnQVMnLFxuICAnQVNDJyxcbiAgJ0FTRU5TSVRJVkUnLFxuICAnQVNTT0NJQVRFJyxcbiAgJ0FTVVRJTUUnLFxuICAnQVNZTU1FVFJJQycsXG4gICdBVCcsXG4gICdBVE9NSUMnLFxuICAnQVRUUklCVVRFUycsXG4gICdBVURJVCcsXG4gICdBVVRIT1JJWkFUSU9OJyxcbiAgJ0FVWCcsXG4gICdBVVhJTElBUlknLFxuICAnQVZHJyxcbiAgJ0JFRk9SRScsXG4gICdCRUdJTicsXG4gICdCRVRXRUVOJyxcbiAgJ0JJR0lOVCcsXG4gICdCSU5BUlknLFxuICAnQkxPQicsXG4gICdCT09MRUFOJyxcbiAgJ0JPVEgnLFxuICAnQlVGRkVSUE9PTCcsXG4gICdCWScsXG4gICdDQUNIRScsXG4gICdDQUxMJyxcbiAgJ0NBTExFRCcsXG4gICdDQVBUVVJFJyxcbiAgJ0NBUkRJTkFMSVRZJyxcbiAgJ0NBU0NBREVEJyxcbiAgJ0NBU0UnLFxuICAnQ0FTVCcsXG4gICdDQ1NJRCcsXG4gICdDRUlMJyxcbiAgJ0NFSUxJTkcnLFxuICAnQ0hBUicsXG4gICdDSEFSQUNURVInLFxuICAnQ0hBUkFDVEVSX0xFTkdUSCcsXG4gICdDSEFSX0xFTkdUSCcsXG4gICdDSEVDSycsXG4gICdDTE9CJyxcbiAgJ0NMT05FJyxcbiAgJ0NMT1NFJyxcbiAgJ0NMVVNURVInLFxuICAnQ09BTEVTQ0UnLFxuICAnQ09MTEFURScsXG4gICdDT0xMRUNUJyxcbiAgJ0NPTExFQ1RJT04nLFxuICAnQ09MTElEJyxcbiAgJ0NPTFVNTicsXG4gICdDT01NRU5UJyxcbiAgJ0NPTU1JVCcsXG4gICdDT05DQVQnLFxuICAnQ09ORElUSU9OJyxcbiAgJ0NPTk5FQ1QnLFxuICAnQ09OTkVDVElPTicsXG4gICdDT05TVFJBSU5UJyxcbiAgJ0NPTlRBSU5TJyxcbiAgJ0NPTlRJTlVFJyxcbiAgJ0NPTlZFUlQnLFxuICAnQ09SUicsXG4gICdDT1JSRVNQT05ESU5HJyxcbiAgJ0NPVU5UJyxcbiAgJ0NPVU5UX0JJRycsXG4gICdDT1ZBUl9QT1AnLFxuICAnQ09WQVJfU0FNUCcsXG4gICdDUkVBVEUnLFxuICAnQ1JPU1MnLFxuICAnQ1VCRScsXG4gICdDVU1FX0RJU1QnLFxuICAnQ1VSUkVOVCcsXG4gICdDVVJSRU5UX0RBVEUnLFxuICAnQ1VSUkVOVF9ERUZBVUxUX1RSQU5TRk9STV9HUk9VUCcsXG4gICdDVVJSRU5UX0xDX0NUWVBFJyxcbiAgJ0NVUlJFTlRfUEFUSCcsXG4gICdDVVJSRU5UX1JPTEUnLFxuICAnQ1VSUkVOVF9TQ0hFTUEnLFxuICAnQ1VSUkVOVF9TRVJWRVInLFxuICAnQ1VSUkVOVF9USU1FJyxcbiAgJ0NVUlJFTlRfVElNRVNUQU1QJyxcbiAgJ0NVUlJFTlRfVElNRVpPTkUnLFxuICAnQ1VSUkVOVF9UUkFOU0ZPUk1fR1JPVVBfRk9SX1RZUEUnLFxuICAnQ1VSUkVOVF9VU0VSJyxcbiAgJ0NVUlNPUicsXG4gICdDWUNMRScsXG4gICdEQVRBJyxcbiAgJ0RBVEFCQVNFJyxcbiAgJ0RBVEFQQVJUSVRJT05OQU1FJyxcbiAgJ0RBVEFQQVJUSVRJT05OVU0nLFxuICAnREFURScsXG4gICdEQVknLFxuICAnREFZUycsXG4gICdEQjJHRU5FUkFMJyxcbiAgJ0RCMkdFTlJMJyxcbiAgJ0RCMlNRTCcsXG4gICdEQklORk8nLFxuICAnREJQQVJUSVRJT05OQU1FJyxcbiAgJ0RCUEFSVElUSU9OTlVNJyxcbiAgJ0RFQUxMT0NBVEUnLFxuICAnREVDJyxcbiAgJ0RFQ0lNQUwnLFxuICAnREVDTEFSRScsXG4gICdERUZBVUxUJyxcbiAgJ0RFRkFVTFRTJyxcbiAgJ0RFRklOSVRJT04nLFxuICAnREVMRVRFJyxcbiAgJ0RFTlNFUkFOSycsXG4gICdERU5TRV9SQU5LJyxcbiAgJ0RFUkVGJyxcbiAgJ0RFU0NSSUJFJyxcbiAgJ0RFU0NSSVBUT1InLFxuICAnREVURVJNSU5JU1RJQycsXG4gICdESUFHTk9TVElDUycsXG4gICdESVNBQkxFJyxcbiAgJ0RJU0FMTE9XJyxcbiAgJ0RJU0NPTk5FQ1QnLFxuICAnRElTVElOQ1QnLFxuICAnRE8nLFxuICAnRE9DVU1FTlQnLFxuICAnRE9VQkxFJyxcbiAgJ0RST1AnLFxuICAnRFNTSVpFJyxcbiAgJ0RZTkFNSUMnLFxuICAnRUFDSCcsXG4gICdFRElUUFJPQycsXG4gICdFTEVNRU5UJyxcbiAgJ0VMU0UnLFxuICAnRUxTRUlGJyxcbiAgJ0VOQUJMRScsXG4gICdFTkNPRElORycsXG4gICdFTkNSWVBUSU9OJyxcbiAgJ0VORCcsXG4gICdFTkQtRVhFQycsXG4gICdFTkRJTkcnLFxuICAnRVJBU0UnLFxuICAnRVNDQVBFJyxcbiAgJ0VWRVJZJyxcbiAgJ0VYQ0VQVElPTicsXG4gICdFWENMVURJTkcnLFxuICAnRVhDTFVTSVZFJyxcbiAgJ0VYRUMnLFxuICAnRVhFQ1VURScsXG4gICdFWElTVFMnLFxuICAnRVhJVCcsXG4gICdFWFAnLFxuICAnRVhQTEFJTicsXG4gICdFWFRFTkRFRCcsXG4gICdFWFRFUk5BTCcsXG4gICdFWFRSQUNUJyxcbiAgJ0ZBTFNFJyxcbiAgJ0ZFTkNFRCcsXG4gICdGRVRDSCcsXG4gICdGSUVMRFBST0MnLFxuICAnRklMRScsXG4gICdGSUxURVInLFxuICAnRklOQUwnLFxuICAnRklSU1QnLFxuICAnRkxPQVQnLFxuICAnRkxPT1InLFxuICAnRk9SJyxcbiAgJ0ZPUkVJR04nLFxuICAnRlJFRScsXG4gICdGVUxMJyxcbiAgJ0ZVTkNUSU9OJyxcbiAgJ0ZVU0lPTicsXG4gICdHRU5FUkFMJyxcbiAgJ0dFTkVSQVRFRCcsXG4gICdHRVQnLFxuICAnR0xPQkFMJyxcbiAgJ0dPVE8nLFxuICAnR1JBTlQnLFxuICAnR1JBUEhJQycsXG4gICdHUk9VUCcsXG4gICdHUk9VUElORycsXG4gICdIQU5ETEVSJyxcbiAgJ0hBU0gnLFxuICAnSEFTSEVEX1ZBTFVFJyxcbiAgJ0hJTlQnLFxuICAnSE9MRCcsXG4gICdIT1VSJyxcbiAgJ0hPVVJTJyxcbiAgJ0lERU5USVRZJyxcbiAgJ0lGJyxcbiAgJ0lNTUVESUFURScsXG4gICdJTicsXG4gICdJTkNMVURJTkcnLFxuICAnSU5DTFVTSVZFJyxcbiAgJ0lOQ1JFTUVOVCcsXG4gICdJTkRFWCcsXG4gICdJTkRJQ0FUT1InLFxuICAnSU5ESUNBVE9SUycsXG4gICdJTkYnLFxuICAnSU5GSU5JVFknLFxuICAnSU5IRVJJVCcsXG4gICdJTk5FUicsXG4gICdJTk9VVCcsXG4gICdJTlNFTlNJVElWRScsXG4gICdJTlNFUlQnLFxuICAnSU5UJyxcbiAgJ0lOVEVHRVInLFxuICAnSU5URUdSSVRZJyxcbiAgJ0lOVEVSU0VDVElPTicsXG4gICdJTlRFUlZBTCcsXG4gICdJTlRPJyxcbiAgJ0lTJyxcbiAgJ0lTT0JJRCcsXG4gICdJU09MQVRJT04nLFxuICAnSVRFUkFURScsXG4gICdKQVInLFxuICAnSkFWQScsXG4gICdLRUVQJyxcbiAgJ0tFWScsXG4gICdMQUJFTCcsXG4gICdMQU5HVUFHRScsXG4gICdMQVJHRScsXG4gICdMQVRFUkFMJyxcbiAgJ0xDX0NUWVBFJyxcbiAgJ0xFQURJTkcnLFxuICAnTEVBVkUnLFxuICAnTEVGVCcsXG4gICdMSUtFJyxcbiAgJ0xJTktUWVBFJyxcbiAgJ0xOJyxcbiAgJ0xPQ0FMJyxcbiAgJ0xPQ0FMREFURScsXG4gICdMT0NBTEUnLFxuICAnTE9DQUxUSU1FJyxcbiAgJ0xPQ0FMVElNRVNUQU1QJyxcbiAgJ0xPQ0FUT1InLFxuICAnTE9DQVRPUlMnLFxuICAnTE9DSycsXG4gICdMT0NLTUFYJyxcbiAgJ0xPQ0tTSVpFJyxcbiAgJ0xPTkcnLFxuICAnTE9PUCcsXG4gICdMT1dFUicsXG4gICdNQUlOVEFJTkVEJyxcbiAgJ01BVENIJyxcbiAgJ01BVEVSSUFMSVpFRCcsXG4gICdNQVgnLFxuICAnTUFYVkFMVUUnLFxuICAnTUVNQkVSJyxcbiAgJ01FUkdFJyxcbiAgJ01FVEhPRCcsXG4gICdNSUNST1NFQ09ORCcsXG4gICdNSUNST1NFQ09ORFMnLFxuICAnTUlOJyxcbiAgJ01JTlVURScsXG4gICdNSU5VVEVTJyxcbiAgJ01JTlZBTFVFJyxcbiAgJ01PRCcsXG4gICdNT0RFJyxcbiAgJ01PRElGSUVTJyxcbiAgJ01PRFVMRScsXG4gICdNT05USCcsXG4gICdNT05USFMnLFxuICAnTVVMVElTRVQnLFxuICAnTkFOJyxcbiAgJ05BVElPTkFMJyxcbiAgJ05BVFVSQUwnLFxuICAnTkNIQVInLFxuICAnTkNMT0InLFxuICAnTkVXJyxcbiAgJ05FV19UQUJMRScsXG4gICdORVhUVkFMJyxcbiAgJ05PJyxcbiAgJ05PQ0FDSEUnLFxuICAnTk9DWUNMRScsXG4gICdOT0RFTkFNRScsXG4gICdOT0RFTlVNQkVSJyxcbiAgJ05PTUFYVkFMVUUnLFxuICAnTk9NSU5WQUxVRScsXG4gICdOT05FJyxcbiAgJ05PT1JERVInLFxuICAnTk9STUFMSVpFJyxcbiAgJ05PUk1BTElaRUQnLFxuICAnTk9UJyxcbiAgJ05VTEwnLFxuICAnTlVMTElGJyxcbiAgJ05VTExTJyxcbiAgJ05VTUVSSUMnLFxuICAnTlVNUEFSVFMnLFxuICAnT0JJRCcsXG4gICdPQ1RFVF9MRU5HVEgnLFxuICAnT0YnLFxuICAnT0ZGU0VUJyxcbiAgJ09MRCcsXG4gICdPTERfVEFCTEUnLFxuICAnT04nLFxuICAnT05MWScsXG4gICdPUEVOJyxcbiAgJ09QVElNSVpBVElPTicsXG4gICdPUFRJTUlaRScsXG4gICdPUFRJT04nLFxuICAnT1JERVInLFxuICAnT1VUJyxcbiAgJ09VVEVSJyxcbiAgJ09WRVInLFxuICAnT1ZFUkxBUFMnLFxuICAnT1ZFUkxBWScsXG4gICdPVkVSUklESU5HJyxcbiAgJ1BBQ0tBR0UnLFxuICAnUEFEREVEJyxcbiAgJ1BBR0VTSVpFJyxcbiAgJ1BBUkFNRVRFUicsXG4gICdQQVJUJyxcbiAgJ1BBUlRJVElPTicsXG4gICdQQVJUSVRJT05FRCcsXG4gICdQQVJUSVRJT05JTkcnLFxuICAnUEFSVElUSU9OUycsXG4gICdQQVNTV09SRCcsXG4gICdQQVRIJyxcbiAgJ1BFUkNFTlRJTEVfQ09OVCcsXG4gICdQRVJDRU5USUxFX0RJU0MnLFxuICAnUEVSQ0VOVF9SQU5LJyxcbiAgJ1BJRUNFU0laRScsXG4gICdQTEFOJyxcbiAgJ1BPU0lUSU9OJyxcbiAgJ1BPV0VSJyxcbiAgJ1BSRUNJU0lPTicsXG4gICdQUkVQQVJFJyxcbiAgJ1BSRVZWQUwnLFxuICAnUFJJTUFSWScsXG4gICdQUklRVFknLFxuICAnUFJJVklMRUdFUycsXG4gICdQUk9DRURVUkUnLFxuICAnUFJPR1JBTScsXG4gICdQU0lEJyxcbiAgJ1BVQkxJQycsXG4gICdRVUVSWScsXG4gICdRVUVSWU5PJyxcbiAgJ1JBTkdFJyxcbiAgJ1JBTksnLFxuICAnUkVBRCcsXG4gICdSRUFEUycsXG4gICdSRUFMJyxcbiAgJ1JFQ09WRVJZJyxcbiAgJ1JFQ1VSU0lWRScsXG4gICdSRUYnLFxuICAnUkVGRVJFTkNFUycsXG4gICdSRUZFUkVOQ0lORycsXG4gICdSRUZSRVNIJyxcbiAgJ1JFR1JfQVZHWCcsXG4gICdSRUdSX0FWR1knLFxuICAnUkVHUl9DT1VOVCcsXG4gICdSRUdSX0lOVEVSQ0VQVCcsXG4gICdSRUdSX1IyJyxcbiAgJ1JFR1JfU0xPUEUnLFxuICAnUkVHUl9TWFgnLFxuICAnUkVHUl9TWFknLFxuICAnUkVHUl9TWVknLFxuICAnUkVMRUFTRScsXG4gICdSRU5BTUUnLFxuICAnUkVQRUFUJyxcbiAgJ1JFU0VUJyxcbiAgJ1JFU0lHTkFMJyxcbiAgJ1JFU1RBUlQnLFxuICAnUkVTVFJJQ1QnLFxuICAnUkVTVUxUJyxcbiAgJ1JFU1VMVF9TRVRfTE9DQVRPUicsXG4gICdSRVRVUk4nLFxuICAnUkVUVVJOUycsXG4gICdSRVZPS0UnLFxuICAnUklHSFQnLFxuICAnUk9MRScsXG4gICdST0xMQkFDSycsXG4gICdST0xMVVAnLFxuICAnUk9VTkRfQ0VJTElORycsXG4gICdST1VORF9ET1dOJyxcbiAgJ1JPVU5EX0ZMT09SJyxcbiAgJ1JPVU5EX0hBTEZfRE9XTicsXG4gICdST1VORF9IQUxGX0VWRU4nLFxuICAnUk9VTkRfSEFMRl9VUCcsXG4gICdST1VORF9VUCcsXG4gICdST1VUSU5FJyxcbiAgJ1JPVycsXG4gICdST1dOVU1CRVInLFxuICAnUk9XUycsXG4gICdST1dTRVQnLFxuICAnUk9XX05VTUJFUicsXG4gICdSUk4nLFxuICAnUlVOJyxcbiAgJ1NBVkVQT0lOVCcsXG4gICdTQ0hFTUEnLFxuICAnU0NPUEUnLFxuICAnU0NSQVRDSFBBRCcsXG4gICdTQ1JPTEwnLFxuICAnU0VBUkNIJyxcbiAgJ1NFQ09ORCcsXG4gICdTRUNPTkRTJyxcbiAgJ1NFQ1FUWScsXG4gICdTRUNVUklUWScsXG4gICdTRU5TSVRJVkUnLFxuICAnU0VRVUVOQ0UnLFxuICAnU0VTU0lPTicsXG4gICdTRVNTSU9OX1VTRVInLFxuICAnU0lHTkFMJyxcbiAgJ1NJTUlMQVInLFxuICAnU0lNUExFJyxcbiAgJ1NNQUxMSU5UJyxcbiAgJ1NOQU4nLFxuICAnU09NRScsXG4gICdTT1VSQ0UnLFxuICAnU1BFQ0lGSUMnLFxuICAnU1BFQ0lGSUNUWVBFJyxcbiAgJ1NRTCcsXG4gICdTUUxFWENFUFRJT04nLFxuICAnU1FMSUQnLFxuICAnU1FMU1RBVEUnLFxuICAnU1FMV0FSTklORycsXG4gICdTUVJUJyxcbiAgJ1NUQUNLRUQnLFxuICAnU1RBTkRBUkQnLFxuICAnU1RBUlQnLFxuICAnU1RBUlRJTkcnLFxuICAnU1RBVEVNRU5UJyxcbiAgJ1NUQVRJQycsXG4gICdTVEFUTUVOVCcsXG4gICdTVEFZJyxcbiAgJ1NURERFVl9QT1AnLFxuICAnU1REREVWX1NBTVAnLFxuICAnU1RPR1JPVVAnLFxuICAnU1RPUkVTJyxcbiAgJ1NUWUxFJyxcbiAgJ1NVQk1VTFRJU0VUJyxcbiAgJ1NVQlNUUklORycsXG4gICdTVU0nLFxuICAnU1VNTUFSWScsXG4gICdTWU1NRVRSSUMnLFxuICAnU1lOT05ZTScsXG4gICdTWVNGVU4nLFxuICAnU1lTSUJNJyxcbiAgJ1NZU1BST0MnLFxuICAnU1lTVEVNJyxcbiAgJ1NZU1RFTV9VU0VSJyxcbiAgJ1RBQkxFJyxcbiAgJ1RBQkxFU0FNUExFJyxcbiAgJ1RBQkxFU1BBQ0UnLFxuICAnVEhFTicsXG4gICdUSU1FJyxcbiAgJ1RJTUVTVEFNUCcsXG4gICdUSU1FWk9ORV9IT1VSJyxcbiAgJ1RJTUVaT05FX01JTlVURScsXG4gICdUTycsXG4gICdUUkFJTElORycsXG4gICdUUkFOU0FDVElPTicsXG4gICdUUkFOU0xBVEUnLFxuICAnVFJBTlNMQVRJT04nLFxuICAnVFJFQVQnLFxuICAnVFJJR0dFUicsXG4gICdUUklNJyxcbiAgJ1RSVUUnLFxuICAnVFJVTkNBVEUnLFxuICAnVFlQRScsXG4gICdVRVNDQVBFJyxcbiAgJ1VORE8nLFxuICAnVU5JUVVFJyxcbiAgJ1VOS05PV04nLFxuICAnVU5ORVNUJyxcbiAgJ1VOVElMJyxcbiAgJ1VQUEVSJyxcbiAgJ1VTQUdFJyxcbiAgJ1VTRVInLFxuICAnVVNJTkcnLFxuICAnVkFMSURQUk9DJyxcbiAgJ1ZBTFVFJyxcbiAgJ1ZBUkNIQVInLFxuICAnVkFSSUFCTEUnLFxuICAnVkFSSUFOVCcsXG4gICdWQVJZSU5HJyxcbiAgJ1ZBUl9QT1AnLFxuICAnVkFSX1NBTVAnLFxuICAnVkNBVCcsXG4gICdWRVJTSU9OJyxcbiAgJ1ZJRVcnLFxuICAnVk9MQVRJTEUnLFxuICAnVk9MVU1FUycsXG4gICdXSEVOJyxcbiAgJ1dIRU5FVkVSJyxcbiAgJ1dISUxFJyxcbiAgJ1dJRFRIX0JVQ0tFVCcsXG4gICdXSU5ET1cnLFxuICAnV0lUSCcsXG4gICdXSVRISU4nLFxuICAnV0lUSE9VVCcsXG4gICdXTE0nLFxuICAnV1JJVEUnLFxuICAnWE1MRUxFTUVOVCcsXG4gICdYTUxFWElTVFMnLFxuICAnWE1MTkFNRVNQQUNFUycsXG4gICdZRUFSJyxcbiAgJ1lFQVJTJyxcbl07XG5cbmNvbnN0IHJlc2VydmVkVG9wTGV2ZWxXb3JkcyA9IFtcbiAgJ0FERCcsXG4gICdBRlRFUicsXG4gICdBTFRFUiBDT0xVTU4nLFxuICAnQUxURVIgVEFCTEUnLFxuICAnREVMRVRFIEZST00nLFxuICAnRVhDRVBUJyxcbiAgJ0ZFVENIIEZJUlNUJyxcbiAgJ0ZST00nLFxuICAnR1JPVVAgQlknLFxuICAnR08nLFxuICAnSEFWSU5HJyxcbiAgJ0lOU0VSVCBJTlRPJyxcbiAgJ0lOVEVSU0VDVCcsXG4gICdMSU1JVCcsXG4gICdPUkRFUiBCWScsXG4gICdTRUxFQ1QnLFxuICAnU0VUIENVUlJFTlQgU0NIRU1BJyxcbiAgJ1NFVCBTQ0hFTUEnLFxuICAnU0VUJyxcbiAgJ1VQREFURScsXG4gICdWQUxVRVMnLFxuICAnV0hFUkUnLFxuXTtcblxuY29uc3QgcmVzZXJ2ZWRUb3BMZXZlbFdvcmRzTm9JbmRlbnQgPSBbJ0lOVEVSU0VDVCcsICdJTlRFUlNFQ1QgQUxMJywgJ01JTlVTJywgJ1VOSU9OJywgJ1VOSU9OIEFMTCddO1xuXG5jb25zdCByZXNlcnZlZE5ld2xpbmVXb3JkcyA9IFtcbiAgJ0FORCcsXG4gICdPUicsXG4gIC8vIGpvaW5zXG4gICdKT0lOJyxcbiAgJ0lOTkVSIEpPSU4nLFxuICAnTEVGVCBKT0lOJyxcbiAgJ0xFRlQgT1VURVIgSk9JTicsXG4gICdSSUdIVCBKT0lOJyxcbiAgJ1JJR0hUIE9VVEVSIEpPSU4nLFxuICAnRlVMTCBKT0lOJyxcbiAgJ0ZVTEwgT1VURVIgSk9JTicsXG4gICdDUk9TUyBKT0lOJyxcbiAgJ05BVFVSQUwgSk9JTicsXG5dO1xuXG4vLyBGb3IgcmVmZXJlbmNlOiBodHRwczovL3d3dy5pYm0uY29tL3N1cHBvcnQva25vd2xlZGdlY2VudGVyL2VuL3Nzd19pYm1faV83Mi9kYjIvcmJhZnppbnRyby5odG1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERiMkZvcm1hdHRlciBleHRlbmRzIEZvcm1hdHRlciB7XG4gIHRva2VuaXplcigpIHtcbiAgICByZXR1cm4gbmV3IFRva2VuaXplcih7XG4gICAgICByZXNlcnZlZFdvcmRzLFxuICAgICAgcmVzZXJ2ZWRUb3BMZXZlbFdvcmRzLFxuICAgICAgcmVzZXJ2ZWROZXdsaW5lV29yZHMsXG4gICAgICByZXNlcnZlZFRvcExldmVsV29yZHNOb0luZGVudCxcbiAgICAgIHN0cmluZ1R5cGVzOiBbYFwiXCJgLCBcIicnXCIsICdgYCcsICdbXSddLFxuICAgICAgb3BlblBhcmVuczogWycoJ10sXG4gICAgICBjbG9zZVBhcmVuczogWycpJ10sXG4gICAgICBpbmRleGVkUGxhY2Vob2xkZXJUeXBlczogWyc/J10sXG4gICAgICBuYW1lZFBsYWNlaG9sZGVyVHlwZXM6IFsnOiddLFxuICAgICAgbGluZUNvbW1lbnRUeXBlczogWyctLSddLFxuICAgICAgc3BlY2lhbFdvcmRDaGFyczogWycjJywgJ0AnLCBcIngnXCJdLFxuICAgICAgb3BlcmF0b3JzOiBbJyoqJywgJyE9JywgJyE+JywgJyE+JywgJ3x8J10sXG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCBGb3JtYXR0ZXIgZnJvbSAnLi4vY29yZS9Gb3JtYXR0ZXInO1xuaW1wb3J0IFRva2VuaXplciBmcm9tICcuLi9jb3JlL1Rva2VuaXplcic7XG5cbmNvbnN0IHJlc2VydmVkV29yZHMgPSBbXG4gICdBQ0NFU1NJQkxFJyxcbiAgJ0FERCcsXG4gICdBTEwnLFxuICAnQUxURVInLFxuICAnQU5BTFlaRScsXG4gICdBTkQnLFxuICAnQVMnLFxuICAnQVNDJyxcbiAgJ0FTRU5TSVRJVkUnLFxuICAnQkVGT1JFJyxcbiAgJ0JFVFdFRU4nLFxuICAnQklHSU5UJyxcbiAgJ0JJTkFSWScsXG4gICdCTE9CJyxcbiAgJ0JPVEgnLFxuICAnQlknLFxuICAnQ0FMTCcsXG4gICdDQVNDQURFJyxcbiAgJ0NBU0UnLFxuICAnQ0hBTkdFJyxcbiAgJ0NIQVInLFxuICAnQ0hBUkFDVEVSJyxcbiAgJ0NIRUNLJyxcbiAgJ0NPTExBVEUnLFxuICAnQ09MVU1OJyxcbiAgJ0NPTkRJVElPTicsXG4gICdDT05TVFJBSU5UJyxcbiAgJ0NPTlRJTlVFJyxcbiAgJ0NPTlZFUlQnLFxuICAnQ1JFQVRFJyxcbiAgJ0NST1NTJyxcbiAgJ0NVUlJFTlRfREFURScsXG4gICdDVVJSRU5UX1JPTEUnLFxuICAnQ1VSUkVOVF9USU1FJyxcbiAgJ0NVUlJFTlRfVElNRVNUQU1QJyxcbiAgJ0NVUlJFTlRfVVNFUicsXG4gICdDVVJTT1InLFxuICAnREFUQUJBU0UnLFxuICAnREFUQUJBU0VTJyxcbiAgJ0RBWV9IT1VSJyxcbiAgJ0RBWV9NSUNST1NFQ09ORCcsXG4gICdEQVlfTUlOVVRFJyxcbiAgJ0RBWV9TRUNPTkQnLFxuICAnREVDJyxcbiAgJ0RFQ0lNQUwnLFxuICAnREVDTEFSRScsXG4gICdERUZBVUxUJyxcbiAgJ0RFTEFZRUQnLFxuICAnREVMRVRFJyxcbiAgJ0RFU0MnLFxuICAnREVTQ1JJQkUnLFxuICAnREVURVJNSU5JU1RJQycsXG4gICdESVNUSU5DVCcsXG4gICdESVNUSU5DVFJPVycsXG4gICdESVYnLFxuICAnRE9fRE9NQUlOX0lEUycsXG4gICdET1VCTEUnLFxuICAnRFJPUCcsXG4gICdEVUFMJyxcbiAgJ0VBQ0gnLFxuICAnRUxTRScsXG4gICdFTFNFSUYnLFxuICAnRU5DTE9TRUQnLFxuICAnRVNDQVBFRCcsXG4gICdFWENFUFQnLFxuICAnRVhJU1RTJyxcbiAgJ0VYSVQnLFxuICAnRVhQTEFJTicsXG4gICdGQUxTRScsXG4gICdGRVRDSCcsXG4gICdGTE9BVCcsXG4gICdGTE9BVDQnLFxuICAnRkxPQVQ4JyxcbiAgJ0ZPUicsXG4gICdGT1JDRScsXG4gICdGT1JFSUdOJyxcbiAgJ0ZST00nLFxuICAnRlVMTFRFWFQnLFxuICAnR0VORVJBTCcsXG4gICdHUkFOVCcsXG4gICdHUk9VUCcsXG4gICdIQVZJTkcnLFxuICAnSElHSF9QUklPUklUWScsXG4gICdIT1VSX01JQ1JPU0VDT05EJyxcbiAgJ0hPVVJfTUlOVVRFJyxcbiAgJ0hPVVJfU0VDT05EJyxcbiAgJ0lGJyxcbiAgJ0lHTk9SRScsXG4gICdJR05PUkVfRE9NQUlOX0lEUycsXG4gICdJR05PUkVfU0VSVkVSX0lEUycsXG4gICdJTicsXG4gICdJTkRFWCcsXG4gICdJTkZJTEUnLFxuICAnSU5ORVInLFxuICAnSU5PVVQnLFxuICAnSU5TRU5TSVRJVkUnLFxuICAnSU5TRVJUJyxcbiAgJ0lOVCcsXG4gICdJTlQxJyxcbiAgJ0lOVDInLFxuICAnSU5UMycsXG4gICdJTlQ0JyxcbiAgJ0lOVDgnLFxuICAnSU5URUdFUicsXG4gICdJTlRFUlNFQ1QnLFxuICAnSU5URVJWQUwnLFxuICAnSU5UTycsXG4gICdJUycsXG4gICdJVEVSQVRFJyxcbiAgJ0pPSU4nLFxuICAnS0VZJyxcbiAgJ0tFWVMnLFxuICAnS0lMTCcsXG4gICdMRUFESU5HJyxcbiAgJ0xFQVZFJyxcbiAgJ0xFRlQnLFxuICAnTElLRScsXG4gICdMSU1JVCcsXG4gICdMSU5FQVInLFxuICAnTElORVMnLFxuICAnTE9BRCcsXG4gICdMT0NBTFRJTUUnLFxuICAnTE9DQUxUSU1FU1RBTVAnLFxuICAnTE9DSycsXG4gICdMT05HJyxcbiAgJ0xPTkdCTE9CJyxcbiAgJ0xPTkdURVhUJyxcbiAgJ0xPT1AnLFxuICAnTE9XX1BSSU9SSVRZJyxcbiAgJ01BU1RFUl9IRUFSVEJFQVRfUEVSSU9EJyxcbiAgJ01BU1RFUl9TU0xfVkVSSUZZX1NFUlZFUl9DRVJUJyxcbiAgJ01BVENIJyxcbiAgJ01BWFZBTFVFJyxcbiAgJ01FRElVTUJMT0InLFxuICAnTUVESVVNSU5UJyxcbiAgJ01FRElVTVRFWFQnLFxuICAnTUlERExFSU5UJyxcbiAgJ01JTlVURV9NSUNST1NFQ09ORCcsXG4gICdNSU5VVEVfU0VDT05EJyxcbiAgJ01PRCcsXG4gICdNT0RJRklFUycsXG4gICdOQVRVUkFMJyxcbiAgJ05PVCcsXG4gICdOT19XUklURV9UT19CSU5MT0cnLFxuICAnTlVMTCcsXG4gICdOVU1FUklDJyxcbiAgJ09OJyxcbiAgJ09QVElNSVpFJyxcbiAgJ09QVElPTicsXG4gICdPUFRJT05BTExZJyxcbiAgJ09SJyxcbiAgJ09SREVSJyxcbiAgJ09VVCcsXG4gICdPVVRFUicsXG4gICdPVVRGSUxFJyxcbiAgJ09WRVInLFxuICAnUEFHRV9DSEVDS1NVTScsXG4gICdQQVJTRV9WQ09MX0VYUFInLFxuICAnUEFSVElUSU9OJyxcbiAgJ1BPU0lUSU9OJyxcbiAgJ1BSRUNJU0lPTicsXG4gICdQUklNQVJZJyxcbiAgJ1BST0NFRFVSRScsXG4gICdQVVJHRScsXG4gICdSQU5HRScsXG4gICdSRUFEJyxcbiAgJ1JFQURTJyxcbiAgJ1JFQURfV1JJVEUnLFxuICAnUkVBTCcsXG4gICdSRUNVUlNJVkUnLFxuICAnUkVGX1NZU1RFTV9JRCcsXG4gICdSRUZFUkVOQ0VTJyxcbiAgJ1JFR0VYUCcsXG4gICdSRUxFQVNFJyxcbiAgJ1JFTkFNRScsXG4gICdSRVBFQVQnLFxuICAnUkVQTEFDRScsXG4gICdSRVFVSVJFJyxcbiAgJ1JFU0lHTkFMJyxcbiAgJ1JFU1RSSUNUJyxcbiAgJ1JFVFVSTicsXG4gICdSRVRVUk5JTkcnLFxuICAnUkVWT0tFJyxcbiAgJ1JJR0hUJyxcbiAgJ1JMSUtFJyxcbiAgJ1JPV1MnLFxuICAnU0NIRU1BJyxcbiAgJ1NDSEVNQVMnLFxuICAnU0VDT05EX01JQ1JPU0VDT05EJyxcbiAgJ1NFTEVDVCcsXG4gICdTRU5TSVRJVkUnLFxuICAnU0VQQVJBVE9SJyxcbiAgJ1NFVCcsXG4gICdTSE9XJyxcbiAgJ1NJR05BTCcsXG4gICdTTE9XJyxcbiAgJ1NNQUxMSU5UJyxcbiAgJ1NQQVRJQUwnLFxuICAnU1BFQ0lGSUMnLFxuICAnU1FMJyxcbiAgJ1NRTEVYQ0VQVElPTicsXG4gICdTUUxTVEFURScsXG4gICdTUUxXQVJOSU5HJyxcbiAgJ1NRTF9CSUdfUkVTVUxUJyxcbiAgJ1NRTF9DQUxDX0ZPVU5EX1JPV1MnLFxuICAnU1FMX1NNQUxMX1JFU1VMVCcsXG4gICdTU0wnLFxuICAnU1RBUlRJTkcnLFxuICAnU1RBVFNfQVVUT19SRUNBTEMnLFxuICAnU1RBVFNfUEVSU0lTVEVOVCcsXG4gICdTVEFUU19TQU1QTEVfUEFHRVMnLFxuICAnU1RSQUlHSFRfSk9JTicsXG4gICdUQUJMRScsXG4gICdURVJNSU5BVEVEJyxcbiAgJ1RIRU4nLFxuICAnVElOWUJMT0InLFxuICAnVElOWUlOVCcsXG4gICdUSU5ZVEVYVCcsXG4gICdUTycsXG4gICdUUkFJTElORycsXG4gICdUUklHR0VSJyxcbiAgJ1RSVUUnLFxuICAnVU5ETycsXG4gICdVTklPTicsXG4gICdVTklRVUUnLFxuICAnVU5MT0NLJyxcbiAgJ1VOU0lHTkVEJyxcbiAgJ1VQREFURScsXG4gICdVU0FHRScsXG4gICdVU0UnLFxuICAnVVNJTkcnLFxuICAnVVRDX0RBVEUnLFxuICAnVVRDX1RJTUUnLFxuICAnVVRDX1RJTUVTVEFNUCcsXG4gICdWQUxVRVMnLFxuICAnVkFSQklOQVJZJyxcbiAgJ1ZBUkNIQVInLFxuICAnVkFSQ0hBUkFDVEVSJyxcbiAgJ1ZBUllJTkcnLFxuICAnV0hFTicsXG4gICdXSEVSRScsXG4gICdXSElMRScsXG4gICdXSU5ET1cnLFxuICAnV0lUSCcsXG4gICdXUklURScsXG4gICdYT1InLFxuICAnWUVBUl9NT05USCcsXG4gICdaRVJPRklMTCcsXG5dO1xuXG5jb25zdCByZXNlcnZlZFRvcExldmVsV29yZHMgPSBbXG4gICdBREQnLFxuICAnQUxURVIgQ09MVU1OJyxcbiAgJ0FMVEVSIFRBQkxFJyxcbiAgJ0RFTEVURSBGUk9NJyxcbiAgJ0VYQ0VQVCcsXG4gICdGUk9NJyxcbiAgJ0dST1VQIEJZJyxcbiAgJ0hBVklORycsXG4gICdJTlNFUlQgSU5UTycsXG4gICdJTlNFUlQnLFxuICAnTElNSVQnLFxuICAnT1JERVIgQlknLFxuICAnU0VMRUNUJyxcbiAgJ1NFVCcsXG4gICdVUERBVEUnLFxuICAnVkFMVUVTJyxcbiAgJ1dIRVJFJyxcbl07XG5cbmNvbnN0IHJlc2VydmVkVG9wTGV2ZWxXb3Jkc05vSW5kZW50ID0gWydJTlRFUlNFQ1QnLCAnSU5URVJTRUNUIEFMTCcsICdVTklPTicsICdVTklPTiBBTEwnXTtcblxuY29uc3QgcmVzZXJ2ZWROZXdsaW5lV29yZHMgPSBbXG4gICdBTkQnLFxuICAnRUxTRScsXG4gICdPUicsXG4gICdXSEVOJyxcbiAgLy8gam9pbnNcbiAgJ0pPSU4nLFxuICAnSU5ORVIgSk9JTicsXG4gICdMRUZUIEpPSU4nLFxuICAnTEVGVCBPVVRFUiBKT0lOJyxcbiAgJ1JJR0hUIEpPSU4nLFxuICAnUklHSFQgT1VURVIgSk9JTicsXG4gICdDUk9TUyBKT0lOJyxcbiAgJ05BVFVSQUwgSk9JTicsXG4gIC8vIG5vbi1zdGFuZGFyZCBqb2luc1xuICAnU1RSQUlHSFRfSk9JTicsXG4gICdOQVRVUkFMIExFRlQgSk9JTicsXG4gICdOQVRVUkFMIExFRlQgT1VURVIgSk9JTicsXG4gICdOQVRVUkFMIFJJR0hUIEpPSU4nLFxuICAnTkFUVVJBTCBSSUdIVCBPVVRFUiBKT0lOJyxcbl07XG5cbi8vIEZvciByZWZlcmVuY2U6IGh0dHBzOi8vbWFyaWFkYi5jb20va2IvZW4vc3FsLXN0YXRlbWVudHMtc3RydWN0dXJlL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFyaWFEYkZvcm1hdHRlciBleHRlbmRzIEZvcm1hdHRlciB7XG4gIHRva2VuaXplcigpIHtcbiAgICByZXR1cm4gbmV3IFRva2VuaXplcih7XG4gICAgICByZXNlcnZlZFdvcmRzLFxuICAgICAgcmVzZXJ2ZWRUb3BMZXZlbFdvcmRzLFxuICAgICAgcmVzZXJ2ZWROZXdsaW5lV29yZHMsXG4gICAgICByZXNlcnZlZFRvcExldmVsV29yZHNOb0luZGVudCxcbiAgICAgIHN0cmluZ1R5cGVzOiBbJ2BgJywgXCInJ1wiLCAnXCJcIiddLFxuICAgICAgb3BlblBhcmVuczogWycoJywgJ0NBU0UnXSxcbiAgICAgIGNsb3NlUGFyZW5zOiBbJyknLCAnRU5EJ10sXG4gICAgICBpbmRleGVkUGxhY2Vob2xkZXJUeXBlczogWyc/J10sXG4gICAgICBuYW1lZFBsYWNlaG9sZGVyVHlwZXM6IFtdLFxuICAgICAgbGluZUNvbW1lbnRUeXBlczogWyctLScsICcjJ10sXG4gICAgICBzcGVjaWFsV29yZENoYXJzOiBbJ0AnXSxcbiAgICAgIG9wZXJhdG9yczogWyc6PScsICc8PCcsICc+PicsICchPScsICc8PicsICc8PT4nLCAnJiYnLCAnfHwnXSxcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IEZvcm1hdHRlciBmcm9tICcuLi9jb3JlL0Zvcm1hdHRlcic7XG5pbXBvcnQgVG9rZW5pemVyIGZyb20gJy4uL2NvcmUvVG9rZW5pemVyJztcblxuY29uc3QgcmVzZXJ2ZWRXb3JkcyA9IFtcbiAgJ0FDQ0VTU0lCTEUnLFxuICAnQUREJyxcbiAgJ0FMTCcsXG4gICdBTFRFUicsXG4gICdBTkFMWVpFJyxcbiAgJ0FORCcsXG4gICdBUycsXG4gICdBU0MnLFxuICAnQVNFTlNJVElWRScsXG4gICdCRUZPUkUnLFxuICAnQkVUV0VFTicsXG4gICdCSUdJTlQnLFxuICAnQklOQVJZJyxcbiAgJ0JMT0InLFxuICAnQk9USCcsXG4gICdCWScsXG4gICdDQUxMJyxcbiAgJ0NBU0NBREUnLFxuICAnQ0FTRScsXG4gICdDSEFOR0UnLFxuICAnQ0hBUicsXG4gICdDSEFSQUNURVInLFxuICAnQ0hFQ0snLFxuICAnQ09MTEFURScsXG4gICdDT0xVTU4nLFxuICAnQ09ORElUSU9OJyxcbiAgJ0NPTlNUUkFJTlQnLFxuICAnQ09OVElOVUUnLFxuICAnQ09OVkVSVCcsXG4gICdDUkVBVEUnLFxuICAnQ1JPU1MnLFxuICAnQ1VCRScsXG4gICdDVU1FX0RJU1QnLFxuICAnQ1VSUkVOVF9EQVRFJyxcbiAgJ0NVUlJFTlRfVElNRScsXG4gICdDVVJSRU5UX1RJTUVTVEFNUCcsXG4gICdDVVJSRU5UX1VTRVInLFxuICAnQ1VSU09SJyxcbiAgJ0RBVEFCQVNFJyxcbiAgJ0RBVEFCQVNFUycsXG4gICdEQVlfSE9VUicsXG4gICdEQVlfTUlDUk9TRUNPTkQnLFxuICAnREFZX01JTlVURScsXG4gICdEQVlfU0VDT05EJyxcbiAgJ0RFQycsXG4gICdERUNJTUFMJyxcbiAgJ0RFQ0xBUkUnLFxuICAnREVGQVVMVCcsXG4gICdERUxBWUVEJyxcbiAgJ0RFTEVURScsXG4gICdERU5TRV9SQU5LJyxcbiAgJ0RFU0MnLFxuICAnREVTQ1JJQkUnLFxuICAnREVURVJNSU5JU1RJQycsXG4gICdESVNUSU5DVCcsXG4gICdESVNUSU5DVFJPVycsXG4gICdESVYnLFxuICAnRE9VQkxFJyxcbiAgJ0RST1AnLFxuICAnRFVBTCcsXG4gICdFQUNIJyxcbiAgJ0VMU0UnLFxuICAnRUxTRUlGJyxcbiAgJ0VNUFRZJyxcbiAgJ0VOQ0xPU0VEJyxcbiAgJ0VTQ0FQRUQnLFxuICAnRVhDRVBUJyxcbiAgJ0VYSVNUUycsXG4gICdFWElUJyxcbiAgJ0VYUExBSU4nLFxuICAnRkFMU0UnLFxuICAnRkVUQ0gnLFxuICAnRklSU1RfVkFMVUUnLFxuICAnRkxPQVQnLFxuICAnRkxPQVQ0JyxcbiAgJ0ZMT0FUOCcsXG4gICdGT1InLFxuICAnRk9SQ0UnLFxuICAnRk9SRUlHTicsXG4gICdGUk9NJyxcbiAgJ0ZVTExURVhUJyxcbiAgJ0ZVTkNUSU9OJyxcbiAgJ0dFTkVSQVRFRCcsXG4gICdHRVQnLFxuICAnR1JBTlQnLFxuICAnR1JPVVAnLFxuICAnR1JPVVBJTkcnLFxuICAnR1JPVVBTJyxcbiAgJ0hBVklORycsXG4gICdISUdIX1BSSU9SSVRZJyxcbiAgJ0hPVVJfTUlDUk9TRUNPTkQnLFxuICAnSE9VUl9NSU5VVEUnLFxuICAnSE9VUl9TRUNPTkQnLFxuICAnSUYnLFxuICAnSUdOT1JFJyxcbiAgJ0lOJyxcbiAgJ0lOREVYJyxcbiAgJ0lORklMRScsXG4gICdJTk5FUicsXG4gICdJTk9VVCcsXG4gICdJTlNFTlNJVElWRScsXG4gICdJTlNFUlQnLFxuICAnSU5UJyxcbiAgJ0lOVDEnLFxuICAnSU5UMicsXG4gICdJTlQzJyxcbiAgJ0lOVDQnLFxuICAnSU5UOCcsXG4gICdJTlRFR0VSJyxcbiAgJ0lOVEVSVkFMJyxcbiAgJ0lOVE8nLFxuICAnSU9fQUZURVJfR1RJRFMnLFxuICAnSU9fQkVGT1JFX0dUSURTJyxcbiAgJ0lTJyxcbiAgJ0lURVJBVEUnLFxuICAnSk9JTicsXG4gICdKU09OX1RBQkxFJyxcbiAgJ0tFWScsXG4gICdLRVlTJyxcbiAgJ0tJTEwnLFxuICAnTEFHJyxcbiAgJ0xBU1RfVkFMVUUnLFxuICAnTEFURVJBTCcsXG4gICdMRUFEJyxcbiAgJ0xFQURJTkcnLFxuICAnTEVBVkUnLFxuICAnTEVGVCcsXG4gICdMSUtFJyxcbiAgJ0xJTUlUJyxcbiAgJ0xJTkVBUicsXG4gICdMSU5FUycsXG4gICdMT0FEJyxcbiAgJ0xPQ0FMVElNRScsXG4gICdMT0NBTFRJTUVTVEFNUCcsXG4gICdMT0NLJyxcbiAgJ0xPTkcnLFxuICAnTE9OR0JMT0InLFxuICAnTE9OR1RFWFQnLFxuICAnTE9PUCcsXG4gICdMT1dfUFJJT1JJVFknLFxuICAnTUFTVEVSX0JJTkQnLFxuICAnTUFTVEVSX1NTTF9WRVJJRllfU0VSVkVSX0NFUlQnLFxuICAnTUFUQ0gnLFxuICAnTUFYVkFMVUUnLFxuICAnTUVESVVNQkxPQicsXG4gICdNRURJVU1JTlQnLFxuICAnTUVESVVNVEVYVCcsXG4gICdNSURETEVJTlQnLFxuICAnTUlOVVRFX01JQ1JPU0VDT05EJyxcbiAgJ01JTlVURV9TRUNPTkQnLFxuICAnTU9EJyxcbiAgJ01PRElGSUVTJyxcbiAgJ05BVFVSQUwnLFxuICAnTk9UJyxcbiAgJ05PX1dSSVRFX1RPX0JJTkxPRycsXG4gICdOVEhfVkFMVUUnLFxuICAnTlRJTEUnLFxuICAnTlVMTCcsXG4gICdOVU1FUklDJyxcbiAgJ09GJyxcbiAgJ09OJyxcbiAgJ09QVElNSVpFJyxcbiAgJ09QVElNSVpFUl9DT1NUUycsXG4gICdPUFRJT04nLFxuICAnT1BUSU9OQUxMWScsXG4gICdPUicsXG4gICdPUkRFUicsXG4gICdPVVQnLFxuICAnT1VURVInLFxuICAnT1VURklMRScsXG4gICdPVkVSJyxcbiAgJ1BBUlRJVElPTicsXG4gICdQRVJDRU5UX1JBTksnLFxuICAnUFJFQ0lTSU9OJyxcbiAgJ1BSSU1BUlknLFxuICAnUFJPQ0VEVVJFJyxcbiAgJ1BVUkdFJyxcbiAgJ1JBTkdFJyxcbiAgJ1JBTksnLFxuICAnUkVBRCcsXG4gICdSRUFEUycsXG4gICdSRUFEX1dSSVRFJyxcbiAgJ1JFQUwnLFxuICAnUkVDVVJTSVZFJyxcbiAgJ1JFRkVSRU5DRVMnLFxuICAnUkVHRVhQJyxcbiAgJ1JFTEVBU0UnLFxuICAnUkVOQU1FJyxcbiAgJ1JFUEVBVCcsXG4gICdSRVBMQUNFJyxcbiAgJ1JFUVVJUkUnLFxuICAnUkVTSUdOQUwnLFxuICAnUkVTVFJJQ1QnLFxuICAnUkVUVVJOJyxcbiAgJ1JFVk9LRScsXG4gICdSSUdIVCcsXG4gICdSTElLRScsXG4gICdST1cnLFxuICAnUk9XUycsXG4gICdST1dfTlVNQkVSJyxcbiAgJ1NDSEVNQScsXG4gICdTQ0hFTUFTJyxcbiAgJ1NFQ09ORF9NSUNST1NFQ09ORCcsXG4gICdTRUxFQ1QnLFxuICAnU0VOU0lUSVZFJyxcbiAgJ1NFUEFSQVRPUicsXG4gICdTRVQnLFxuICAnU0hPVycsXG4gICdTSUdOQUwnLFxuICAnU01BTExJTlQnLFxuICAnU1BBVElBTCcsXG4gICdTUEVDSUZJQycsXG4gICdTUUwnLFxuICAnU1FMRVhDRVBUSU9OJyxcbiAgJ1NRTFNUQVRFJyxcbiAgJ1NRTFdBUk5JTkcnLFxuICAnU1FMX0JJR19SRVNVTFQnLFxuICAnU1FMX0NBTENfRk9VTkRfUk9XUycsXG4gICdTUUxfU01BTExfUkVTVUxUJyxcbiAgJ1NTTCcsXG4gICdTVEFSVElORycsXG4gICdTVE9SRUQnLFxuICAnU1RSQUlHSFRfSk9JTicsXG4gICdTWVNURU0nLFxuICAnVEFCTEUnLFxuICAnVEVSTUlOQVRFRCcsXG4gICdUSEVOJyxcbiAgJ1RJTllCTE9CJyxcbiAgJ1RJTllJTlQnLFxuICAnVElOWVRFWFQnLFxuICAnVE8nLFxuICAnVFJBSUxJTkcnLFxuICAnVFJJR0dFUicsXG4gICdUUlVFJyxcbiAgJ1VORE8nLFxuICAnVU5JT04nLFxuICAnVU5JUVVFJyxcbiAgJ1VOTE9DSycsXG4gICdVTlNJR05FRCcsXG4gICdVUERBVEUnLFxuICAnVVNBR0UnLFxuICAnVVNFJyxcbiAgJ1VTSU5HJyxcbiAgJ1VUQ19EQVRFJyxcbiAgJ1VUQ19USU1FJyxcbiAgJ1VUQ19USU1FU1RBTVAnLFxuICAnVkFMVUVTJyxcbiAgJ1ZBUkJJTkFSWScsXG4gICdWQVJDSEFSJyxcbiAgJ1ZBUkNIQVJBQ1RFUicsXG4gICdWQVJZSU5HJyxcbiAgJ1ZJUlRVQUwnLFxuICAnV0hFTicsXG4gICdXSEVSRScsXG4gICdXSElMRScsXG4gICdXSU5ET1cnLFxuICAnV0lUSCcsXG4gICdXUklURScsXG4gICdYT1InLFxuICAnWUVBUl9NT05USCcsXG4gICdaRVJPRklMTCcsXG5dO1xuXG5jb25zdCByZXNlcnZlZFRvcExldmVsV29yZHMgPSBbXG4gICdBREQnLFxuICAnQUxURVIgQ09MVU1OJyxcbiAgJ0FMVEVSIFRBQkxFJyxcbiAgJ0RFTEVURSBGUk9NJyxcbiAgJ0VYQ0VQVCcsXG4gICdGUk9NJyxcbiAgJ0dST1VQIEJZJyxcbiAgJ0hBVklORycsXG4gICdJTlNFUlQgSU5UTycsXG4gICdJTlNFUlQnLFxuICAnTElNSVQnLFxuICAnT1JERVIgQlknLFxuICAnU0VMRUNUJyxcbiAgJ1NFVCcsXG4gICdVUERBVEUnLFxuICAnVkFMVUVTJyxcbiAgJ1dIRVJFJyxcbl07XG5cbmNvbnN0IHJlc2VydmVkVG9wTGV2ZWxXb3Jkc05vSW5kZW50ID0gWydJTlRFUlNFQ1QnLCAnSU5URVJTRUNUIEFMTCcsICdVTklPTicsICdVTklPTiBBTEwnXTtcblxuY29uc3QgcmVzZXJ2ZWROZXdsaW5lV29yZHMgPSBbXG4gICdBTkQnLFxuICAnRUxTRScsXG4gICdPUicsXG4gICdXSEVOJyxcbiAgLy8gam9pbnNcbiAgJ0pPSU4nLFxuICAnSU5ORVIgSk9JTicsXG4gICdMRUZUIEpPSU4nLFxuICAnTEVGVCBPVVRFUiBKT0lOJyxcbiAgJ1JJR0hUIEpPSU4nLFxuICAnUklHSFQgT1VURVIgSk9JTicsXG4gICdDUk9TUyBKT0lOJyxcbiAgJ05BVFVSQUwgSk9JTicsXG4gIC8vIG5vbi1zdGFuZGFyZCBqb2luc1xuICAnU1RSQUlHSFRfSk9JTicsXG4gICdOQVRVUkFMIExFRlQgSk9JTicsXG4gICdOQVRVUkFMIExFRlQgT1VURVIgSk9JTicsXG4gICdOQVRVUkFMIFJJR0hUIEpPSU4nLFxuICAnTkFUVVJBTCBSSUdIVCBPVVRFUiBKT0lOJyxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE15U3FsRm9ybWF0dGVyIGV4dGVuZHMgRm9ybWF0dGVyIHtcbiAgdG9rZW5pemVyKCkge1xuICAgIHJldHVybiBuZXcgVG9rZW5pemVyKHtcbiAgICAgIHJlc2VydmVkV29yZHMsXG4gICAgICByZXNlcnZlZFRvcExldmVsV29yZHMsXG4gICAgICByZXNlcnZlZE5ld2xpbmVXb3JkcyxcbiAgICAgIHJlc2VydmVkVG9wTGV2ZWxXb3Jkc05vSW5kZW50LFxuICAgICAgc3RyaW5nVHlwZXM6IFsnYGAnLCBcIicnXCIsICdcIlwiJ10sXG4gICAgICBvcGVuUGFyZW5zOiBbJygnLCAnQ0FTRSddLFxuICAgICAgY2xvc2VQYXJlbnM6IFsnKScsICdFTkQnXSxcbiAgICAgIGluZGV4ZWRQbGFjZWhvbGRlclR5cGVzOiBbJz8nXSxcbiAgICAgIG5hbWVkUGxhY2Vob2xkZXJUeXBlczogW10sXG4gICAgICBsaW5lQ29tbWVudFR5cGVzOiBbJy0tJywgJyMnXSxcbiAgICAgIHNwZWNpYWxXb3JkQ2hhcnM6IFsnQCddLFxuICAgICAgb3BlcmF0b3JzOiBbJzo9JywgJzw8JywgJz4+JywgJyE9JywgJzw+JywgJzw9PicsICcmJicsICd8fCcsICctPicsICctPj4nXSxcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IEZvcm1hdHRlciBmcm9tICcuLi9jb3JlL0Zvcm1hdHRlcic7XG5pbXBvcnQgVG9rZW5pemVyIGZyb20gJy4uL2NvcmUvVG9rZW5pemVyJztcblxuY29uc3QgcmVzZXJ2ZWRXb3JkcyA9IFtcbiAgJ0FMTCcsXG4gICdBTFRFUicsXG4gICdBTkFMWVpFJyxcbiAgJ0FORCcsXG4gICdBTlknLFxuICAnQVJSQVknLFxuICAnQVMnLFxuICAnQVNDJyxcbiAgJ0JFR0lOJyxcbiAgJ0JFVFdFRU4nLFxuICAnQklOQVJZJyxcbiAgJ0JPT0xFQU4nLFxuICAnQlJFQUsnLFxuICAnQlVDS0VUJyxcbiAgJ0JVSUxEJyxcbiAgJ0JZJyxcbiAgJ0NBTEwnLFxuICAnQ0FTRScsXG4gICdDQVNUJyxcbiAgJ0NMVVNURVInLFxuICAnQ09MTEFURScsXG4gICdDT0xMRUNUSU9OJyxcbiAgJ0NPTU1JVCcsXG4gICdDT05ORUNUJyxcbiAgJ0NPTlRJTlVFJyxcbiAgJ0NPUlJFTEFURScsXG4gICdDT1ZFUicsXG4gICdDUkVBVEUnLFxuICAnREFUQUJBU0UnLFxuICAnREFUQVNFVCcsXG4gICdEQVRBU1RPUkUnLFxuICAnREVDTEFSRScsXG4gICdERUNSRU1FTlQnLFxuICAnREVMRVRFJyxcbiAgJ0RFUklWRUQnLFxuICAnREVTQycsXG4gICdERVNDUklCRScsXG4gICdESVNUSU5DVCcsXG4gICdETycsXG4gICdEUk9QJyxcbiAgJ0VBQ0gnLFxuICAnRUxFTUVOVCcsXG4gICdFTFNFJyxcbiAgJ0VORCcsXG4gICdFVkVSWScsXG4gICdFWENFUFQnLFxuICAnRVhDTFVERScsXG4gICdFWEVDVVRFJyxcbiAgJ0VYSVNUUycsXG4gICdFWFBMQUlOJyxcbiAgJ0ZBTFNFJyxcbiAgJ0ZFVENIJyxcbiAgJ0ZJUlNUJyxcbiAgJ0ZMQVRURU4nLFxuICAnRk9SJyxcbiAgJ0ZPUkNFJyxcbiAgJ0ZST00nLFxuICAnRlVOQ1RJT04nLFxuICAnR1JBTlQnLFxuICAnR1JPVVAnLFxuICAnR1NJJyxcbiAgJ0hBVklORycsXG4gICdJRicsXG4gICdJR05PUkUnLFxuICAnSUxJS0UnLFxuICAnSU4nLFxuICAnSU5DTFVERScsXG4gICdJTkNSRU1FTlQnLFxuICAnSU5ERVgnLFxuICAnSU5GRVInLFxuICAnSU5MSU5FJyxcbiAgJ0lOTkVSJyxcbiAgJ0lOU0VSVCcsXG4gICdJTlRFUlNFQ1QnLFxuICAnSU5UTycsXG4gICdJUycsXG4gICdKT0lOJyxcbiAgJ0tFWScsXG4gICdLRVlTJyxcbiAgJ0tFWVNQQUNFJyxcbiAgJ0tOT1dOJyxcbiAgJ0xBU1QnLFxuICAnTEVGVCcsXG4gICdMRVQnLFxuICAnTEVUVElORycsXG4gICdMSUtFJyxcbiAgJ0xJTUlUJyxcbiAgJ0xTTScsXG4gICdNQVAnLFxuICAnTUFQUElORycsXG4gICdNQVRDSEVEJyxcbiAgJ01BVEVSSUFMSVpFRCcsXG4gICdNRVJHRScsXG4gICdNSVNTSU5HJyxcbiAgJ05BTUVTUEFDRScsXG4gICdORVNUJyxcbiAgJ05PVCcsXG4gICdOVUxMJyxcbiAgJ05VTUJFUicsXG4gICdPQkpFQ1QnLFxuICAnT0ZGU0VUJyxcbiAgJ09OJyxcbiAgJ09QVElPTicsXG4gICdPUicsXG4gICdPUkRFUicsXG4gICdPVVRFUicsXG4gICdPVkVSJyxcbiAgJ1BBUlNFJyxcbiAgJ1BBUlRJVElPTicsXG4gICdQQVNTV09SRCcsXG4gICdQQVRIJyxcbiAgJ1BPT0wnLFxuICAnUFJFUEFSRScsXG4gICdQUklNQVJZJyxcbiAgJ1BSSVZBVEUnLFxuICAnUFJJVklMRUdFJyxcbiAgJ1BST0NFRFVSRScsXG4gICdQVUJMSUMnLFxuICAnUkFXJyxcbiAgJ1JFQUxNJyxcbiAgJ1JFRFVDRScsXG4gICdSRU5BTUUnLFxuICAnUkVUVVJOJyxcbiAgJ1JFVFVSTklORycsXG4gICdSRVZPS0UnLFxuICAnUklHSFQnLFxuICAnUk9MRScsXG4gICdST0xMQkFDSycsXG4gICdTQVRJU0ZJRVMnLFxuICAnU0NIRU1BJyxcbiAgJ1NFTEVDVCcsXG4gICdTRUxGJyxcbiAgJ1NFTUknLFxuICAnU0VUJyxcbiAgJ1NIT1cnLFxuICAnU09NRScsXG4gICdTVEFSVCcsXG4gICdTVEFUSVNUSUNTJyxcbiAgJ1NUUklORycsXG4gICdTWVNURU0nLFxuICAnVEhFTicsXG4gICdUTycsXG4gICdUUkFOU0FDVElPTicsXG4gICdUUklHR0VSJyxcbiAgJ1RSVUUnLFxuICAnVFJVTkNBVEUnLFxuICAnVU5ERVInLFxuICAnVU5JT04nLFxuICAnVU5JUVVFJyxcbiAgJ1VOS05PV04nLFxuICAnVU5ORVNUJyxcbiAgJ1VOU0VUJyxcbiAgJ1VQREFURScsXG4gICdVUFNFUlQnLFxuICAnVVNFJyxcbiAgJ1VTRVInLFxuICAnVVNJTkcnLFxuICAnVkFMSURBVEUnLFxuICAnVkFMVUUnLFxuICAnVkFMVUVEJyxcbiAgJ1ZBTFVFUycsXG4gICdWSUEnLFxuICAnVklFVycsXG4gICdXSEVOJyxcbiAgJ1dIRVJFJyxcbiAgJ1dISUxFJyxcbiAgJ1dJVEgnLFxuICAnV0lUSElOJyxcbiAgJ1dPUksnLFxuICAnWE9SJyxcbl07XG5cbmNvbnN0IHJlc2VydmVkVG9wTGV2ZWxXb3JkcyA9IFtcbiAgJ0RFTEVURSBGUk9NJyxcbiAgJ0VYQ0VQVCBBTEwnLFxuICAnRVhDRVBUJyxcbiAgJ0VYUExBSU4gREVMRVRFIEZST00nLFxuICAnRVhQTEFJTiBVUERBVEUnLFxuICAnRVhQTEFJTiBVUFNFUlQnLFxuICAnRlJPTScsXG4gICdHUk9VUCBCWScsXG4gICdIQVZJTkcnLFxuICAnSU5GRVInLFxuICAnSU5TRVJUIElOVE8nLFxuICAnTEVUJyxcbiAgJ0xJTUlUJyxcbiAgJ01FUkdFJyxcbiAgJ05FU1QnLFxuICAnT1JERVIgQlknLFxuICAnUFJFUEFSRScsXG4gICdTRUxFQ1QnLFxuICAnU0VUIENVUlJFTlQgU0NIRU1BJyxcbiAgJ1NFVCBTQ0hFTUEnLFxuICAnU0VUJyxcbiAgJ1VOTkVTVCcsXG4gICdVUERBVEUnLFxuICAnVVBTRVJUJyxcbiAgJ1VTRSBLRVlTJyxcbiAgJ1ZBTFVFUycsXG4gICdXSEVSRScsXG5dO1xuXG5jb25zdCByZXNlcnZlZFRvcExldmVsV29yZHNOb0luZGVudCA9IFsnSU5URVJTRUNUJywgJ0lOVEVSU0VDVCBBTEwnLCAnTUlOVVMnLCAnVU5JT04nLCAnVU5JT04gQUxMJ107XG5cbmNvbnN0IHJlc2VydmVkTmV3bGluZVdvcmRzID0gW1xuICAnQU5EJyxcbiAgJ09SJyxcbiAgJ1hPUicsXG4gIC8vIGpvaW5zXG4gICdKT0lOJyxcbiAgJ0lOTkVSIEpPSU4nLFxuICAnTEVGVCBKT0lOJyxcbiAgJ0xFRlQgT1VURVIgSk9JTicsXG4gICdSSUdIVCBKT0lOJyxcbiAgJ1JJR0hUIE9VVEVSIEpPSU4nLFxuXTtcblxuLy8gRm9yIHJlZmVyZW5jZTogaHR0cDovL2RvY3MuY291Y2hiYXNlLmNvbS5zMy13ZWJzaXRlLXVzLXdlc3QtMS5hbWF6b25hd3MuY29tL3NlcnZlci82LjAvbjFxbC9uMXFsLWxhbmd1YWdlLXJlZmVyZW5jZS9pbmRleC5odG1sXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOMXFsRm9ybWF0dGVyIGV4dGVuZHMgRm9ybWF0dGVyIHtcbiAgdG9rZW5pemVyKCkge1xuICAgIHJldHVybiBuZXcgVG9rZW5pemVyKHtcbiAgICAgIHJlc2VydmVkV29yZHMsXG4gICAgICByZXNlcnZlZFRvcExldmVsV29yZHMsXG4gICAgICByZXNlcnZlZE5ld2xpbmVXb3JkcyxcbiAgICAgIHJlc2VydmVkVG9wTGV2ZWxXb3Jkc05vSW5kZW50LFxuICAgICAgc3RyaW5nVHlwZXM6IFtgXCJcImAsIFwiJydcIiwgJ2BgJ10sXG4gICAgICBvcGVuUGFyZW5zOiBbJygnLCAnWycsICd7J10sXG4gICAgICBjbG9zZVBhcmVuczogWycpJywgJ10nLCAnfSddLFxuICAgICAgbmFtZWRQbGFjZWhvbGRlclR5cGVzOiBbJyQnXSxcbiAgICAgIGxpbmVDb21tZW50VHlwZXM6IFsnIycsICctLSddLFxuICAgICAgb3BlcmF0b3JzOiBbJz09JywgJyE9J10sXG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCBGb3JtYXR0ZXIgZnJvbSAnLi4vY29yZS9Gb3JtYXR0ZXInO1xuaW1wb3J0IHsgaXNCeSwgaXNTZXQgfSBmcm9tICcuLi9jb3JlL3Rva2VuJztcbmltcG9ydCBUb2tlbml6ZXIgZnJvbSAnLi4vY29yZS9Ub2tlbml6ZXInO1xuaW1wb3J0IHRva2VuVHlwZXMgZnJvbSAnLi4vY29yZS90b2tlblR5cGVzJztcblxuY29uc3QgcmVzZXJ2ZWRXb3JkcyA9IFtcbiAgJ0EnLFxuICAnQUNDRVNTSUJMRScsXG4gICdBR0VOVCcsXG4gICdBR0dSRUdBVEUnLFxuICAnQUxMJyxcbiAgJ0FMVEVSJyxcbiAgJ0FOWScsXG4gICdBUlJBWScsXG4gICdBUycsXG4gICdBU0MnLFxuICAnQVQnLFxuICAnQVRUUklCVVRFJyxcbiAgJ0FVVEhJRCcsXG4gICdBVkcnLFxuICAnQkVUV0VFTicsXG4gICdCRklMRV9CQVNFJyxcbiAgJ0JJTkFSWV9JTlRFR0VSJyxcbiAgJ0JJTkFSWScsXG4gICdCTE9CX0JBU0UnLFxuICAnQkxPQ0snLFxuICAnQk9EWScsXG4gICdCT09MRUFOJyxcbiAgJ0JPVEgnLFxuICAnQk9VTkQnLFxuICAnQlJFQURUSCcsXG4gICdCVUxLJyxcbiAgJ0JZJyxcbiAgJ0JZVEUnLFxuICAnQycsXG4gICdDQUxMJyxcbiAgJ0NBTExJTkcnLFxuICAnQ0FTQ0FERScsXG4gICdDQVNFJyxcbiAgJ0NIQVJfQkFTRScsXG4gICdDSEFSJyxcbiAgJ0NIQVJBQ1RFUicsXG4gICdDSEFSU0VUJyxcbiAgJ0NIQVJTRVRGT1JNJyxcbiAgJ0NIQVJTRVRJRCcsXG4gICdDSEVDSycsXG4gICdDTE9CX0JBU0UnLFxuICAnQ0xPTkUnLFxuICAnQ0xPU0UnLFxuICAnQ0xVU1RFUicsXG4gICdDTFVTVEVSUycsXG4gICdDT0FMRVNDRScsXG4gICdDT0xBVVRIJyxcbiAgJ0NPTExFQ1QnLFxuICAnQ09MVU1OUycsXG4gICdDT01NRU5UJyxcbiAgJ0NPTU1JVCcsXG4gICdDT01NSVRURUQnLFxuICAnQ09NUElMRUQnLFxuICAnQ09NUFJFU1MnLFxuICAnQ09OTkVDVCcsXG4gICdDT05TVEFOVCcsXG4gICdDT05TVFJVQ1RPUicsXG4gICdDT05URVhUJyxcbiAgJ0NPTlRJTlVFJyxcbiAgJ0NPTlZFUlQnLFxuICAnQ09VTlQnLFxuICAnQ1JBU0gnLFxuICAnQ1JFQVRFJyxcbiAgJ0NSRURFTlRJQUwnLFxuICAnQ1VSUkVOVCcsXG4gICdDVVJSVkFMJyxcbiAgJ0NVUlNPUicsXG4gICdDVVNUT01EQVRVTScsXG4gICdEQU5HTElORycsXG4gICdEQVRBJyxcbiAgJ0RBVEVfQkFTRScsXG4gICdEQVRFJyxcbiAgJ0RBWScsXG4gICdERUNJTUFMJyxcbiAgJ0RFRkFVTFQnLFxuICAnREVGSU5FJyxcbiAgJ0RFTEVURScsXG4gICdERVBUSCcsXG4gICdERVNDJyxcbiAgJ0RFVEVSTUlOSVNUSUMnLFxuICAnRElSRUNUT1JZJyxcbiAgJ0RJU1RJTkNUJyxcbiAgJ0RPJyxcbiAgJ0RPVUJMRScsXG4gICdEUk9QJyxcbiAgJ0RVUkFUSU9OJyxcbiAgJ0VMRU1FTlQnLFxuICAnRUxTSUYnLFxuICAnRU1QVFknLFxuICAnRU5EJyxcbiAgJ0VTQ0FQRScsXG4gICdFWENFUFRJT05TJyxcbiAgJ0VYQ0xVU0lWRScsXG4gICdFWEVDVVRFJyxcbiAgJ0VYSVNUUycsXG4gICdFWElUJyxcbiAgJ0VYVEVORFMnLFxuICAnRVhURVJOQUwnLFxuICAnRVhUUkFDVCcsXG4gICdGQUxTRScsXG4gICdGRVRDSCcsXG4gICdGSU5BTCcsXG4gICdGSVJTVCcsXG4gICdGSVhFRCcsXG4gICdGTE9BVCcsXG4gICdGT1InLFxuICAnRk9SQUxMJyxcbiAgJ0ZPUkNFJyxcbiAgJ0ZST00nLFxuICAnRlVOQ1RJT04nLFxuICAnR0VORVJBTCcsXG4gICdHT1RPJyxcbiAgJ0dSQU5UJyxcbiAgJ0dST1VQJyxcbiAgJ0hBU0gnLFxuICAnSEVBUCcsXG4gICdISURERU4nLFxuICAnSE9VUicsXG4gICdJREVOVElGSUVEJyxcbiAgJ0lGJyxcbiAgJ0lNTUVESUFURScsXG4gICdJTicsXG4gICdJTkNMVURJTkcnLFxuICAnSU5ERVgnLFxuICAnSU5ERVhFUycsXG4gICdJTkRJQ0FUT1InLFxuICAnSU5ESUNFUycsXG4gICdJTkZJTklURScsXG4gICdJTlNUQU5USUFCTEUnLFxuICAnSU5UJyxcbiAgJ0lOVEVHRVInLFxuICAnSU5URVJGQUNFJyxcbiAgJ0lOVEVSVkFMJyxcbiAgJ0lOVE8nLFxuICAnSU5WQUxJREFURScsXG4gICdJUycsXG4gICdJU09MQVRJT04nLFxuICAnSkFWQScsXG4gICdMQU5HVUFHRScsXG4gICdMQVJHRScsXG4gICdMRUFESU5HJyxcbiAgJ0xFTkdUSCcsXG4gICdMRVZFTCcsXG4gICdMSUJSQVJZJyxcbiAgJ0xJS0UnLFxuICAnTElLRTInLFxuICAnTElLRTQnLFxuICAnTElLRUMnLFxuICAnTElNSVRFRCcsXG4gICdMT0NBTCcsXG4gICdMT0NLJyxcbiAgJ0xPTkcnLFxuICAnTUFQJyxcbiAgJ01BWCcsXG4gICdNQVhMRU4nLFxuICAnTUVNQkVSJyxcbiAgJ01FUkdFJyxcbiAgJ01JTicsXG4gICdNSU5VVEUnLFxuICAnTUxTTEFCRUwnLFxuICAnTU9EJyxcbiAgJ01PREUnLFxuICAnTU9OVEgnLFxuICAnTVVMVElTRVQnLFxuICAnTkFNRScsXG4gICdOQU4nLFxuICAnTkFUSU9OQUwnLFxuICAnTkFUSVZFJyxcbiAgJ05BVFVSQUwnLFxuICAnTkFUVVJBTE4nLFxuICAnTkNIQVInLFxuICAnTkVXJyxcbiAgJ05FWFRWQUwnLFxuICAnTk9DT01QUkVTUycsXG4gICdOT0NPUFknLFxuICAnTk9UJyxcbiAgJ05PV0FJVCcsXG4gICdOVUxMJyxcbiAgJ05VTExJRicsXG4gICdOVU1CRVJfQkFTRScsXG4gICdOVU1CRVInLFxuICAnT0JKRUNUJyxcbiAgJ09DSUNPTEwnLFxuICAnT0NJREFURScsXG4gICdPQ0lEQVRFVElNRScsXG4gICdPQ0lEVVJBVElPTicsXG4gICdPQ0lJTlRFUlZBTCcsXG4gICdPQ0lMT0JMT0NBVE9SJyxcbiAgJ09DSU5VTUJFUicsXG4gICdPQ0lSQVcnLFxuICAnT0NJUkVGJyxcbiAgJ09DSVJFRkNVUlNPUicsXG4gICdPQ0lST1dJRCcsXG4gICdPQ0lTVFJJTkcnLFxuICAnT0NJVFlQRScsXG4gICdPRicsXG4gICdPTEQnLFxuICAnT04nLFxuICAnT05MWScsXG4gICdPUEFRVUUnLFxuICAnT1BFTicsXG4gICdPUEVSQVRPUicsXG4gICdPUFRJT04nLFxuICAnT1JBQ0xFJyxcbiAgJ09SQURBVEEnLFxuICAnT1JERVInLFxuICAnT1JHQU5JWkFUSU9OJyxcbiAgJ09STEFOWScsXG4gICdPUkxWQVJZJyxcbiAgJ09USEVSUycsXG4gICdPVVQnLFxuICAnT1ZFUkxBUFMnLFxuICAnT1ZFUlJJRElORycsXG4gICdQQUNLQUdFJyxcbiAgJ1BBUkFMTEVMX0VOQUJMRScsXG4gICdQQVJBTUVURVInLFxuICAnUEFSQU1FVEVSUycsXG4gICdQQVJFTlQnLFxuICAnUEFSVElUSU9OJyxcbiAgJ1BBU0NBTCcsXG4gICdQQ1RGUkVFJyxcbiAgJ1BJUEUnLFxuICAnUElQRUxJTkVEJyxcbiAgJ1BMU19JTlRFR0VSJyxcbiAgJ1BMVUdHQUJMRScsXG4gICdQT1NJVElWRScsXG4gICdQT1NJVElWRU4nLFxuICAnUFJBR01BJyxcbiAgJ1BSRUNJU0lPTicsXG4gICdQUklPUicsXG4gICdQUklWQVRFJyxcbiAgJ1BST0NFRFVSRScsXG4gICdQVUJMSUMnLFxuICAnUkFJU0UnLFxuICAnUkFOR0UnLFxuICAnUkFXJyxcbiAgJ1JFQUQnLFxuICAnUkVBTCcsXG4gICdSRUNPUkQnLFxuICAnUkVGJyxcbiAgJ1JFRkVSRU5DRScsXG4gICdSRUxFQVNFJyxcbiAgJ1JFTElFU19PTicsXG4gICdSRU0nLFxuICAnUkVNQUlOREVSJyxcbiAgJ1JFTkFNRScsXG4gICdSRVNPVVJDRScsXG4gICdSRVNVTFRfQ0FDSEUnLFxuICAnUkVTVUxUJyxcbiAgJ1JFVFVSTicsXG4gICdSRVRVUk5JTkcnLFxuICAnUkVWRVJTRScsXG4gICdSRVZPS0UnLFxuICAnUk9MTEJBQ0snLFxuICAnUk9XJyxcbiAgJ1JPV0lEJyxcbiAgJ1JPV05VTScsXG4gICdST1dUWVBFJyxcbiAgJ1NBTVBMRScsXG4gICdTQVZFJyxcbiAgJ1NBVkVQT0lOVCcsXG4gICdTQjEnLFxuICAnU0IyJyxcbiAgJ1NCNCcsXG4gICdTRUFSQ0gnLFxuICAnU0VDT05EJyxcbiAgJ1NFR01FTlQnLFxuICAnU0VMRicsXG4gICdTRVBBUkFURScsXG4gICdTRVFVRU5DRScsXG4gICdTRVJJQUxJWkFCTEUnLFxuICAnU0hBUkUnLFxuICAnU0hPUlQnLFxuICAnU0laRV9UJyxcbiAgJ1NJWkUnLFxuICAnU01BTExJTlQnLFxuICAnU09NRScsXG4gICdTUEFDRScsXG4gICdTUEFSU0UnLFxuICAnU1FMJyxcbiAgJ1NRTENPREUnLFxuICAnU1FMREFUQScsXG4gICdTUUxFUlJNJyxcbiAgJ1NRTE5BTUUnLFxuICAnU1FMU1RBVEUnLFxuICAnU1RBTkRBUkQnLFxuICAnU1RBUlQnLFxuICAnU1RBVElDJyxcbiAgJ1NURERFVicsXG4gICdTVE9SRUQnLFxuICAnU1RSSU5HJyxcbiAgJ1NUUlVDVCcsXG4gICdTVFlMRScsXG4gICdTVUJNVUxUSVNFVCcsXG4gICdTVUJQQVJUSVRJT04nLFxuICAnU1VCU1RJVFVUQUJMRScsXG4gICdTVUJUWVBFJyxcbiAgJ1NVQ0NFU1NGVUwnLFxuICAnU1VNJyxcbiAgJ1NZTk9OWU0nLFxuICAnU1lTREFURScsXG4gICdUQUJBVVRIJyxcbiAgJ1RBQkxFJyxcbiAgJ1RETycsXG4gICdUSEUnLFxuICAnVEhFTicsXG4gICdUSU1FJyxcbiAgJ1RJTUVTVEFNUCcsXG4gICdUSU1FWk9ORV9BQkJSJyxcbiAgJ1RJTUVaT05FX0hPVVInLFxuICAnVElNRVpPTkVfTUlOVVRFJyxcbiAgJ1RJTUVaT05FX1JFR0lPTicsXG4gICdUTycsXG4gICdUUkFJTElORycsXG4gICdUUkFOU0FDVElPTicsXG4gICdUUkFOU0FDVElPTkFMJyxcbiAgJ1RSSUdHRVInLFxuICAnVFJVRScsXG4gICdUUlVTVEVEJyxcbiAgJ1RZUEUnLFxuICAnVUIxJyxcbiAgJ1VCMicsXG4gICdVQjQnLFxuICAnVUlEJyxcbiAgJ1VOREVSJyxcbiAgJ1VOSVFVRScsXG4gICdVTlBMVUcnLFxuICAnVU5TSUdORUQnLFxuICAnVU5UUlVTVEVEJyxcbiAgJ1VTRScsXG4gICdVU0VSJyxcbiAgJ1VTSU5HJyxcbiAgJ1ZBTElEQVRFJyxcbiAgJ1ZBTElTVCcsXG4gICdWQUxVRScsXG4gICdWQVJDSEFSJyxcbiAgJ1ZBUkNIQVIyJyxcbiAgJ1ZBUklBQkxFJyxcbiAgJ1ZBUklBTkNFJyxcbiAgJ1ZBUlJBWScsXG4gICdWQVJZSU5HJyxcbiAgJ1ZJRVcnLFxuICAnVklFV1MnLFxuICAnVk9JRCcsXG4gICdXSEVORVZFUicsXG4gICdXSElMRScsXG4gICdXSVRIJyxcbiAgJ1dPUksnLFxuICAnV1JBUFBFRCcsXG4gICdXUklURScsXG4gICdZRUFSJyxcbiAgJ1pPTkUnLFxuXTtcblxuY29uc3QgcmVzZXJ2ZWRUb3BMZXZlbFdvcmRzID0gW1xuICAnQUREJyxcbiAgJ0FMVEVSIENPTFVNTicsXG4gICdBTFRFUiBUQUJMRScsXG4gICdCRUdJTicsXG4gICdDT05ORUNUIEJZJyxcbiAgJ0RFQ0xBUkUnLFxuICAnREVMRVRFIEZST00nLFxuICAnREVMRVRFJyxcbiAgJ0VORCcsXG4gICdFWENFUFQnLFxuICAnRVhDRVBUSU9OJyxcbiAgJ0ZFVENIIEZJUlNUJyxcbiAgJ0ZST00nLFxuICAnR1JPVVAgQlknLFxuICAnSEFWSU5HJyxcbiAgJ0lOU0VSVCBJTlRPJyxcbiAgJ0lOU0VSVCcsXG4gICdMSU1JVCcsXG4gICdMT09QJyxcbiAgJ01PRElGWScsXG4gICdPUkRFUiBCWScsXG4gICdTRUxFQ1QnLFxuICAnU0VUIENVUlJFTlQgU0NIRU1BJyxcbiAgJ1NFVCBTQ0hFTUEnLFxuICAnU0VUJyxcbiAgJ1NUQVJUIFdJVEgnLFxuICAnVVBEQVRFJyxcbiAgJ1ZBTFVFUycsXG4gICdXSEVSRScsXG5dO1xuXG5jb25zdCByZXNlcnZlZFRvcExldmVsV29yZHNOb0luZGVudCA9IFsnSU5URVJTRUNUJywgJ0lOVEVSU0VDVCBBTEwnLCAnTUlOVVMnLCAnVU5JT04nLCAnVU5JT04gQUxMJ107XG5cbmNvbnN0IHJlc2VydmVkTmV3bGluZVdvcmRzID0gW1xuICAnQU5EJyxcbiAgJ0NST1NTIEFQUExZJyxcbiAgJ0VMU0UnLFxuICAnRU5EJyxcbiAgJ09SJyxcbiAgJ09VVEVSIEFQUExZJyxcbiAgJ1dIRU4nLFxuICAnWE9SJyxcbiAgLy8gam9pbnNcbiAgJ0pPSU4nLFxuICAnSU5ORVIgSk9JTicsXG4gICdMRUZUIEpPSU4nLFxuICAnTEVGVCBPVVRFUiBKT0lOJyxcbiAgJ1JJR0hUIEpPSU4nLFxuICAnUklHSFQgT1VURVIgSk9JTicsXG4gICdGVUxMIEpPSU4nLFxuICAnRlVMTCBPVVRFUiBKT0lOJyxcbiAgJ0NST1NTIEpPSU4nLFxuICAnTkFUVVJBTCBKT0lOJyxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsU3FsRm9ybWF0dGVyIGV4dGVuZHMgRm9ybWF0dGVyIHtcbiAgdG9rZW5pemVyKCkge1xuICAgIHJldHVybiBuZXcgVG9rZW5pemVyKHtcbiAgICAgIHJlc2VydmVkV29yZHMsXG4gICAgICByZXNlcnZlZFRvcExldmVsV29yZHMsXG4gICAgICByZXNlcnZlZE5ld2xpbmVXb3JkcyxcbiAgICAgIHJlc2VydmVkVG9wTGV2ZWxXb3Jkc05vSW5kZW50LFxuICAgICAgc3RyaW5nVHlwZXM6IFtgXCJcImAsIFwiTicnXCIsIFwiJydcIiwgJ2BgJ10sXG4gICAgICBvcGVuUGFyZW5zOiBbJygnLCAnQ0FTRSddLFxuICAgICAgY2xvc2VQYXJlbnM6IFsnKScsICdFTkQnXSxcbiAgICAgIGluZGV4ZWRQbGFjZWhvbGRlclR5cGVzOiBbJz8nXSxcbiAgICAgIG5hbWVkUGxhY2Vob2xkZXJUeXBlczogWyc6J10sXG4gICAgICBsaW5lQ29tbWVudFR5cGVzOiBbJy0tJ10sXG4gICAgICBzcGVjaWFsV29yZENoYXJzOiBbJ18nLCAnJCcsICcjJywgJy4nLCAnQCddLFxuICAgICAgb3BlcmF0b3JzOiBbJ3x8JywgJyoqJywgJyE9JywgJzo9J10sXG4gICAgfSk7XG4gIH1cblxuICB0b2tlbk92ZXJyaWRlKHRva2VuKSB7XG4gICAgaWYgKGlzU2V0KHRva2VuKSAmJiBpc0J5KHRoaXMucHJldmlvdXNSZXNlcnZlZFRva2VuKSkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogdG9rZW5UeXBlcy5SRVNFUlZFRCwgdmFsdWU6IHRva2VuLnZhbHVlIH07XG4gICAgfVxuICAgIHJldHVybiB0b2tlbjtcbiAgfVxufVxuIiwiaW1wb3J0IEZvcm1hdHRlciBmcm9tICcuLi9jb3JlL0Zvcm1hdHRlcic7XG5pbXBvcnQgVG9rZW5pemVyIGZyb20gJy4uL2NvcmUvVG9rZW5pemVyJztcblxuY29uc3QgcmVzZXJ2ZWRXb3JkcyA9IFtcbiAgJ0FCT1JUJyxcbiAgJ0FCU09MVVRFJyxcbiAgJ0FDQ0VTUycsXG4gICdBQ1RJT04nLFxuICAnQUREJyxcbiAgJ0FETUlOJyxcbiAgJ0FGVEVSJyxcbiAgJ0FHR1JFR0FURScsXG4gICdBTEwnLFxuICAnQUxTTycsXG4gICdBTFRFUicsXG4gICdBTFdBWVMnLFxuICAnQU5BTFlTRScsXG4gICdBTkFMWVpFJyxcbiAgJ0FORCcsXG4gICdBTlknLFxuICAnQVJSQVknLFxuICAnQVMnLFxuICAnQVNDJyxcbiAgJ0FTU0VSVElPTicsXG4gICdBU1NJR05NRU5UJyxcbiAgJ0FTWU1NRVRSSUMnLFxuICAnQVQnLFxuICAnQVRUQUNIJyxcbiAgJ0FUVFJJQlVURScsXG4gICdBVVRIT1JJWkFUSU9OJyxcbiAgJ0JBQ0tXQVJEJyxcbiAgJ0JFRk9SRScsXG4gICdCRUdJTicsXG4gICdCRVRXRUVOJyxcbiAgJ0JJR0lOVCcsXG4gICdCSU5BUlknLFxuICAnQklUJyxcbiAgJ0JPT0xFQU4nLFxuICAnQk9USCcsXG4gICdCWScsXG4gICdDQUNIRScsXG4gICdDQUxMJyxcbiAgJ0NBTExFRCcsXG4gICdDQVNDQURFJyxcbiAgJ0NBU0NBREVEJyxcbiAgJ0NBU0UnLFxuICAnQ0FTVCcsXG4gICdDQVRBTE9HJyxcbiAgJ0NIQUlOJyxcbiAgJ0NIQVInLFxuICAnQ0hBUkFDVEVSJyxcbiAgJ0NIQVJBQ1RFUklTVElDUycsXG4gICdDSEVDSycsXG4gICdDSEVDS1BPSU5UJyxcbiAgJ0NMQVNTJyxcbiAgJ0NMT1NFJyxcbiAgJ0NMVVNURVInLFxuICAnQ09BTEVTQ0UnLFxuICAnQ09MTEFURScsXG4gICdDT0xMQVRJT04nLFxuICAnQ09MVU1OJyxcbiAgJ0NPTFVNTlMnLFxuICAnQ09NTUVOVCcsXG4gICdDT01NRU5UUycsXG4gICdDT01NSVQnLFxuICAnQ09NTUlUVEVEJyxcbiAgJ0NPTkNVUlJFTlRMWScsXG4gICdDT05GSUdVUkFUSU9OJyxcbiAgJ0NPTkZMSUNUJyxcbiAgJ0NPTk5FQ1RJT04nLFxuICAnQ09OU1RSQUlOVCcsXG4gICdDT05TVFJBSU5UUycsXG4gICdDT05URU5UJyxcbiAgJ0NPTlRJTlVFJyxcbiAgJ0NPTlZFUlNJT04nLFxuICAnQ09QWScsXG4gICdDT1NUJyxcbiAgJ0NSRUFURScsXG4gICdDUk9TUycsXG4gICdDU1YnLFxuICAnQ1VCRScsXG4gICdDVVJSRU5UJyxcbiAgJ0NVUlJFTlRfQ0FUQUxPRycsXG4gICdDVVJSRU5UX0RBVEUnLFxuICAnQ1VSUkVOVF9ST0xFJyxcbiAgJ0NVUlJFTlRfU0NIRU1BJyxcbiAgJ0NVUlJFTlRfVElNRScsXG4gICdDVVJSRU5UX1RJTUVTVEFNUCcsXG4gICdDVVJSRU5UX1VTRVInLFxuICAnQ1VSU09SJyxcbiAgJ0NZQ0xFJyxcbiAgJ0RBVEEnLFxuICAnREFUQUJBU0UnLFxuICAnREFZJyxcbiAgJ0RFQUxMT0NBVEUnLFxuICAnREVDJyxcbiAgJ0RFQ0lNQUwnLFxuICAnREVDTEFSRScsXG4gICdERUZBVUxUJyxcbiAgJ0RFRkFVTFRTJyxcbiAgJ0RFRkVSUkFCTEUnLFxuICAnREVGRVJSRUQnLFxuICAnREVGSU5FUicsXG4gICdERUxFVEUnLFxuICAnREVMSU1JVEVSJyxcbiAgJ0RFTElNSVRFUlMnLFxuICAnREVQRU5EUycsXG4gICdERVNDJyxcbiAgJ0RFVEFDSCcsXG4gICdESUNUSU9OQVJZJyxcbiAgJ0RJU0FCTEUnLFxuICAnRElTQ0FSRCcsXG4gICdESVNUSU5DVCcsXG4gICdETycsXG4gICdET0NVTUVOVCcsXG4gICdET01BSU4nLFxuICAnRE9VQkxFJyxcbiAgJ0RST1AnLFxuICAnRUFDSCcsXG4gICdFTFNFJyxcbiAgJ0VOQUJMRScsXG4gICdFTkNPRElORycsXG4gICdFTkNSWVBURUQnLFxuICAnRU5EJyxcbiAgJ0VOVU0nLFxuICAnRVNDQVBFJyxcbiAgJ0VWRU5UJyxcbiAgJ0VYQ0VQVCcsXG4gICdFWENMVURFJyxcbiAgJ0VYQ0xVRElORycsXG4gICdFWENMVVNJVkUnLFxuICAnRVhFQ1VURScsXG4gICdFWElTVFMnLFxuICAnRVhQTEFJTicsXG4gICdFWFBSRVNTSU9OJyxcbiAgJ0VYVEVOU0lPTicsXG4gICdFWFRFUk5BTCcsXG4gICdFWFRSQUNUJyxcbiAgJ0ZBTFNFJyxcbiAgJ0ZBTUlMWScsXG4gICdGRVRDSCcsXG4gICdGSUxURVInLFxuICAnRklSU1QnLFxuICAnRkxPQVQnLFxuICAnRk9MTE9XSU5HJyxcbiAgJ0ZPUicsXG4gICdGT1JDRScsXG4gICdGT1JFSUdOJyxcbiAgJ0ZPUldBUkQnLFxuICAnRlJFRVpFJyxcbiAgJ0ZST00nLFxuICAnRlVMTCcsXG4gICdGVU5DVElPTicsXG4gICdGVU5DVElPTlMnLFxuICAnR0VORVJBVEVEJyxcbiAgJ0dMT0JBTCcsXG4gICdHUkFOVCcsXG4gICdHUkFOVEVEJyxcbiAgJ0dSRUFURVNUJyxcbiAgJ0dST1VQJyxcbiAgJ0dST1VQSU5HJyxcbiAgJ0dST1VQUycsXG4gICdIQU5ETEVSJyxcbiAgJ0hBVklORycsXG4gICdIRUFERVInLFxuICAnSE9MRCcsXG4gICdIT1VSJyxcbiAgJ0lERU5USVRZJyxcbiAgJ0lGJyxcbiAgJ0lMSUtFJyxcbiAgJ0lNTUVESUFURScsXG4gICdJTU1VVEFCTEUnLFxuICAnSU1QTElDSVQnLFxuICAnSU1QT1JUJyxcbiAgJ0lOJyxcbiAgJ0lOQ0xVREUnLFxuICAnSU5DTFVESU5HJyxcbiAgJ0lOQ1JFTUVOVCcsXG4gICdJTkRFWCcsXG4gICdJTkRFWEVTJyxcbiAgJ0lOSEVSSVQnLFxuICAnSU5IRVJJVFMnLFxuICAnSU5JVElBTExZJyxcbiAgJ0lOTElORScsXG4gICdJTk5FUicsXG4gICdJTk9VVCcsXG4gICdJTlBVVCcsXG4gICdJTlNFTlNJVElWRScsXG4gICdJTlNFUlQnLFxuICAnSU5TVEVBRCcsXG4gICdJTlQnLFxuICAnSU5URUdFUicsXG4gICdJTlRFUlNFQ1QnLFxuICAnSU5URVJWQUwnLFxuICAnSU5UTycsXG4gICdJTlZPS0VSJyxcbiAgJ0lTJyxcbiAgJ0lTTlVMTCcsXG4gICdJU09MQVRJT04nLFxuICAnSk9JTicsXG4gICdLRVknLFxuICAnTEFCRUwnLFxuICAnTEFOR1VBR0UnLFxuICAnTEFSR0UnLFxuICAnTEFTVCcsXG4gICdMQVRFUkFMJyxcbiAgJ0xFQURJTkcnLFxuICAnTEVBS1BST09GJyxcbiAgJ0xFQVNUJyxcbiAgJ0xFRlQnLFxuICAnTEVWRUwnLFxuICAnTElLRScsXG4gICdMSU1JVCcsXG4gICdMSVNURU4nLFxuICAnTE9BRCcsXG4gICdMT0NBTCcsXG4gICdMT0NBTFRJTUUnLFxuICAnTE9DQUxUSU1FU1RBTVAnLFxuICAnTE9DQVRJT04nLFxuICAnTE9DSycsXG4gICdMT0NLRUQnLFxuICAnTE9HR0VEJyxcbiAgJ01BUFBJTkcnLFxuICAnTUFUQ0gnLFxuICAnTUFURVJJQUxJWkVEJyxcbiAgJ01BWFZBTFVFJyxcbiAgJ01FVEhPRCcsXG4gICdNSU5VVEUnLFxuICAnTUlOVkFMVUUnLFxuICAnTU9ERScsXG4gICdNT05USCcsXG4gICdNT1ZFJyxcbiAgJ05BTUUnLFxuICAnTkFNRVMnLFxuICAnTkFUSU9OQUwnLFxuICAnTkFUVVJBTCcsXG4gICdOQ0hBUicsXG4gICdORVcnLFxuICAnTkVYVCcsXG4gICdORkMnLFxuICAnTkZEJyxcbiAgJ05GS0MnLFxuICAnTkZLRCcsXG4gICdOTycsXG4gICdOT05FJyxcbiAgJ05PUk1BTElaRScsXG4gICdOT1JNQUxJWkVEJyxcbiAgJ05PVCcsXG4gICdOT1RISU5HJyxcbiAgJ05PVElGWScsXG4gICdOT1ROVUxMJyxcbiAgJ05PV0FJVCcsXG4gICdOVUxMJyxcbiAgJ05VTExJRicsXG4gICdOVUxMUycsXG4gICdOVU1FUklDJyxcbiAgJ09CSkVDVCcsXG4gICdPRicsXG4gICdPRkYnLFxuICAnT0ZGU0VUJyxcbiAgJ09JRFMnLFxuICAnT0xEJyxcbiAgJ09OJyxcbiAgJ09OTFknLFxuICAnT1BFUkFUT1InLFxuICAnT1BUSU9OJyxcbiAgJ09QVElPTlMnLFxuICAnT1InLFxuICAnT1JERVInLFxuICAnT1JESU5BTElUWScsXG4gICdPVEhFUlMnLFxuICAnT1VUJyxcbiAgJ09VVEVSJyxcbiAgJ09WRVInLFxuICAnT1ZFUkxBUFMnLFxuICAnT1ZFUkxBWScsXG4gICdPVkVSUklESU5HJyxcbiAgJ09XTkVEJyxcbiAgJ09XTkVSJyxcbiAgJ1BBUkFMTEVMJyxcbiAgJ1BBUlNFUicsXG4gICdQQVJUSUFMJyxcbiAgJ1BBUlRJVElPTicsXG4gICdQQVNTSU5HJyxcbiAgJ1BBU1NXT1JEJyxcbiAgJ1BMQUNJTkcnLFxuICAnUExBTlMnLFxuICAnUE9MSUNZJyxcbiAgJ1BPU0lUSU9OJyxcbiAgJ1BSRUNFRElORycsXG4gICdQUkVDSVNJT04nLFxuICAnUFJFUEFSRScsXG4gICdQUkVQQVJFRCcsXG4gICdQUkVTRVJWRScsXG4gICdQUklNQVJZJyxcbiAgJ1BSSU9SJyxcbiAgJ1BSSVZJTEVHRVMnLFxuICAnUFJPQ0VEVVJBTCcsXG4gICdQUk9DRURVUkUnLFxuICAnUFJPQ0VEVVJFUycsXG4gICdQUk9HUkFNJyxcbiAgJ1BVQkxJQ0FUSU9OJyxcbiAgJ1FVT1RFJyxcbiAgJ1JBTkdFJyxcbiAgJ1JFQUQnLFxuICAnUkVBTCcsXG4gICdSRUFTU0lHTicsXG4gICdSRUNIRUNLJyxcbiAgJ1JFQ1VSU0lWRScsXG4gICdSRUYnLFxuICAnUkVGRVJFTkNFUycsXG4gICdSRUZFUkVOQ0lORycsXG4gICdSRUZSRVNIJyxcbiAgJ1JFSU5ERVgnLFxuICAnUkVMQVRJVkUnLFxuICAnUkVMRUFTRScsXG4gICdSRU5BTUUnLFxuICAnUkVQRUFUQUJMRScsXG4gICdSRVBMQUNFJyxcbiAgJ1JFUExJQ0EnLFxuICAnUkVTRVQnLFxuICAnUkVTVEFSVCcsXG4gICdSRVNUUklDVCcsXG4gICdSRVRVUk5JTkcnLFxuICAnUkVUVVJOUycsXG4gICdSRVZPS0UnLFxuICAnUklHSFQnLFxuICAnUk9MRScsXG4gICdST0xMQkFDSycsXG4gICdST0xMVVAnLFxuICAnUk9VVElORScsXG4gICdST1VUSU5FUycsXG4gICdST1cnLFxuICAnUk9XUycsXG4gICdSVUxFJyxcbiAgJ1NBVkVQT0lOVCcsXG4gICdTQ0hFTUEnLFxuICAnU0NIRU1BUycsXG4gICdTQ1JPTEwnLFxuICAnU0VBUkNIJyxcbiAgJ1NFQ09ORCcsXG4gICdTRUNVUklUWScsXG4gICdTRUxFQ1QnLFxuICAnU0VRVUVOQ0UnLFxuICAnU0VRVUVOQ0VTJyxcbiAgJ1NFUklBTElaQUJMRScsXG4gICdTRVJWRVInLFxuICAnU0VTU0lPTicsXG4gICdTRVNTSU9OX1VTRVInLFxuICAnU0VUJyxcbiAgJ1NFVE9GJyxcbiAgJ1NFVFMnLFxuICAnU0hBUkUnLFxuICAnU0hPVycsXG4gICdTSU1JTEFSJyxcbiAgJ1NJTVBMRScsXG4gICdTS0lQJyxcbiAgJ1NNQUxMSU5UJyxcbiAgJ1NOQVBTSE9UJyxcbiAgJ1NPTUUnLFxuICAnU1FMJyxcbiAgJ1NUQUJMRScsXG4gICdTVEFOREFMT05FJyxcbiAgJ1NUQVJUJyxcbiAgJ1NUQVRFTUVOVCcsXG4gICdTVEFUSVNUSUNTJyxcbiAgJ1NURElOJyxcbiAgJ1NURE9VVCcsXG4gICdTVE9SQUdFJyxcbiAgJ1NUT1JFRCcsXG4gICdTVFJJQ1QnLFxuICAnU1RSSVAnLFxuICAnU1VCU0NSSVBUSU9OJyxcbiAgJ1NVQlNUUklORycsXG4gICdTVVBQT1JUJyxcbiAgJ1NZTU1FVFJJQycsXG4gICdTWVNJRCcsXG4gICdTWVNURU0nLFxuICAnVEFCTEUnLFxuICAnVEFCTEVTJyxcbiAgJ1RBQkxFU0FNUExFJyxcbiAgJ1RBQkxFU1BBQ0UnLFxuICAnVEVNUCcsXG4gICdURU1QTEFURScsXG4gICdURU1QT1JBUlknLFxuICAnVEVYVCcsXG4gICdUSEVOJyxcbiAgJ1RJRVMnLFxuICAnVElNRScsXG4gICdUSU1FU1RBTVAnLFxuICAnVE8nLFxuICAnVFJBSUxJTkcnLFxuICAnVFJBTlNBQ1RJT04nLFxuICAnVFJBTlNGT1JNJyxcbiAgJ1RSRUFUJyxcbiAgJ1RSSUdHRVInLFxuICAnVFJJTScsXG4gICdUUlVFJyxcbiAgJ1RSVU5DQVRFJyxcbiAgJ1RSVVNURUQnLFxuICAnVFlQRScsXG4gICdUWVBFUycsXG4gICdVRVNDQVBFJyxcbiAgJ1VOQk9VTkRFRCcsXG4gICdVTkNPTU1JVFRFRCcsXG4gICdVTkVOQ1JZUFRFRCcsXG4gICdVTklPTicsXG4gICdVTklRVUUnLFxuICAnVU5LTk9XTicsXG4gICdVTkxJU1RFTicsXG4gICdVTkxPR0dFRCcsXG4gICdVTlRJTCcsXG4gICdVUERBVEUnLFxuICAnVVNFUicsXG4gICdVU0lORycsXG4gICdWQUNVVU0nLFxuICAnVkFMSUQnLFxuICAnVkFMSURBVEUnLFxuICAnVkFMSURBVE9SJyxcbiAgJ1ZBTFVFJyxcbiAgJ1ZBTFVFUycsXG4gICdWQVJDSEFSJyxcbiAgJ1ZBUklBRElDJyxcbiAgJ1ZBUllJTkcnLFxuICAnVkVSQk9TRScsXG4gICdWRVJTSU9OJyxcbiAgJ1ZJRVcnLFxuICAnVklFV1MnLFxuICAnVk9MQVRJTEUnLFxuICAnV0hFTicsXG4gICdXSEVSRScsXG4gICdXSElURVNQQUNFJyxcbiAgJ1dJTkRPVycsXG4gICdXSVRIJyxcbiAgJ1dJVEhJTicsXG4gICdXSVRIT1VUJyxcbiAgJ1dPUksnLFxuICAnV1JBUFBFUicsXG4gICdXUklURScsXG4gICdYTUwnLFxuICAnWE1MQVRUUklCVVRFUycsXG4gICdYTUxDT05DQVQnLFxuICAnWE1MRUxFTUVOVCcsXG4gICdYTUxFWElTVFMnLFxuICAnWE1MRk9SRVNUJyxcbiAgJ1hNTE5BTUVTUEFDRVMnLFxuICAnWE1MUEFSU0UnLFxuICAnWE1MUEknLFxuICAnWE1MUk9PVCcsXG4gICdYTUxTRVJJQUxJWkUnLFxuICAnWE1MVEFCTEUnLFxuICAnWUVBUicsXG4gICdZRVMnLFxuICAnWk9ORScsXG5dO1xuXG5jb25zdCByZXNlcnZlZFRvcExldmVsV29yZHMgPSBbXG4gICdBREQnLFxuICAnQUZURVInLFxuICAnQUxURVIgQ09MVU1OJyxcbiAgJ0FMVEVSIFRBQkxFJyxcbiAgJ0NBU0UnLFxuICAnREVMRVRFIEZST00nLFxuICAnRU5EJyxcbiAgJ0VYQ0VQVCcsXG4gICdGRVRDSCBGSVJTVCcsXG4gICdGUk9NJyxcbiAgJ0dST1VQIEJZJyxcbiAgJ0hBVklORycsXG4gICdJTlNFUlQgSU5UTycsXG4gICdJTlNFUlQnLFxuICAnTElNSVQnLFxuICAnT1JERVIgQlknLFxuICAnU0VMRUNUJyxcbiAgJ1NFVCBDVVJSRU5UIFNDSEVNQScsXG4gICdTRVQgU0NIRU1BJyxcbiAgJ1NFVCcsXG4gICdVUERBVEUnLFxuICAnVkFMVUVTJyxcbiAgJ1dIRVJFJyxcbl07XG5cbmNvbnN0IHJlc2VydmVkVG9wTGV2ZWxXb3Jkc05vSW5kZW50ID0gWydJTlRFUlNFQ1QnLCAnSU5URVJTRUNUIEFMTCcsICdVTklPTicsICdVTklPTiBBTEwnXTtcblxuY29uc3QgcmVzZXJ2ZWROZXdsaW5lV29yZHMgPSBbXG4gICdBTkQnLFxuICAnRUxTRScsXG4gICdPUicsXG4gICdXSEVOJyxcbiAgLy8gam9pbnNcbiAgJ0pPSU4nLFxuICAnSU5ORVIgSk9JTicsXG4gICdMRUZUIEpPSU4nLFxuICAnTEVGVCBPVVRFUiBKT0lOJyxcbiAgJ1JJR0hUIEpPSU4nLFxuICAnUklHSFQgT1VURVIgSk9JTicsXG4gICdGVUxMIEpPSU4nLFxuICAnRlVMTCBPVVRFUiBKT0lOJyxcbiAgJ0NST1NTIEpPSU4nLFxuICAnTkFUVVJBTCBKT0lOJyxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvc3RncmVTcWxGb3JtYXR0ZXIgZXh0ZW5kcyBGb3JtYXR0ZXIge1xuICB0b2tlbml6ZXIoKSB7XG4gICAgcmV0dXJuIG5ldyBUb2tlbml6ZXIoe1xuICAgICAgcmVzZXJ2ZWRXb3JkcyxcbiAgICAgIHJlc2VydmVkVG9wTGV2ZWxXb3JkcyxcbiAgICAgIHJlc2VydmVkTmV3bGluZVdvcmRzLFxuICAgICAgcmVzZXJ2ZWRUb3BMZXZlbFdvcmRzTm9JbmRlbnQsXG4gICAgICBzdHJpbmdUeXBlczogW2BcIlwiYCwgXCInJ1wiLCBcIlUmJydcIiwgJ1UmXCJcIicsICckJCddLFxuICAgICAgb3BlblBhcmVuczogWycoJywgJ0NBU0UnXSxcbiAgICAgIGNsb3NlUGFyZW5zOiBbJyknLCAnRU5EJ10sXG4gICAgICBpbmRleGVkUGxhY2Vob2xkZXJUeXBlczogWyckJ10sXG4gICAgICBuYW1lZFBsYWNlaG9sZGVyVHlwZXM6IFsnOiddLFxuICAgICAgbGluZUNvbW1lbnRUeXBlczogWyctLSddLFxuICAgICAgb3BlcmF0b3JzOiBbXG4gICAgICAgICchPScsXG4gICAgICAgICc8PCcsXG4gICAgICAgICc+PicsXG4gICAgICAgICd8fC8nLFxuICAgICAgICAnfC8nLFxuICAgICAgICAnOjonLFxuICAgICAgICAnLT4+JyxcbiAgICAgICAgJy0+JyxcbiAgICAgICAgJ35+KicsXG4gICAgICAgICd+ficsXG4gICAgICAgICchfn4qJyxcbiAgICAgICAgJyF+ficsXG4gICAgICAgICd+KicsXG4gICAgICAgICchfionLFxuICAgICAgICAnIX4nLFxuICAgICAgICAnISEnLFxuICAgICAgXSxcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IEZvcm1hdHRlciBmcm9tICcuLi9jb3JlL0Zvcm1hdHRlcic7XG5pbXBvcnQgVG9rZW5pemVyIGZyb20gJy4uL2NvcmUvVG9rZW5pemVyJztcblxuY29uc3QgcmVzZXJ2ZWRXb3JkcyA9IFtcbiAgJ0FFUzEyOCcsXG4gICdBRVMyNTYnLFxuICAnQUxMT1dPVkVSV1JJVEUnLFxuICAnQU5BTFlTRScsXG4gICdBUlJBWScsXG4gICdBUycsXG4gICdBU0MnLFxuICAnQVVUSE9SSVpBVElPTicsXG4gICdCQUNLVVAnLFxuICAnQklOQVJZJyxcbiAgJ0JMQU5LU0FTTlVMTCcsXG4gICdCT1RIJyxcbiAgJ0JZVEVESUNUJyxcbiAgJ0JaSVAyJyxcbiAgJ0NBU1QnLFxuICAnQ0hFQ0snLFxuICAnQ09MTEFURScsXG4gICdDT0xVTU4nLFxuICAnQ09OU1RSQUlOVCcsXG4gICdDUkVBVEUnLFxuICAnQ1JFREVOVElBTFMnLFxuICAnQ1VSUkVOVF9EQVRFJyxcbiAgJ0NVUlJFTlRfVElNRScsXG4gICdDVVJSRU5UX1RJTUVTVEFNUCcsXG4gICdDVVJSRU5UX1VTRVInLFxuICAnQ1VSUkVOVF9VU0VSX0lEJyxcbiAgJ0RFRkFVTFQnLFxuICAnREVGRVJSQUJMRScsXG4gICdERUZMQVRFJyxcbiAgJ0RFRlJBRycsXG4gICdERUxUQScsXG4gICdERUxUQTMySycsXG4gICdERVNDJyxcbiAgJ0RJU0FCTEUnLFxuICAnRElTVElOQ1QnLFxuICAnRE8nLFxuICAnRUxTRScsXG4gICdFTVBUWUFTTlVMTCcsXG4gICdFTkFCTEUnLFxuICAnRU5DT0RFJyxcbiAgJ0VOQ1JZUFQnLFxuICAnRU5DUllQVElPTicsXG4gICdFTkQnLFxuICAnRVhQTElDSVQnLFxuICAnRkFMU0UnLFxuICAnRk9SJyxcbiAgJ0ZPUkVJR04nLFxuICAnRlJFRVpFJyxcbiAgJ0ZVTEwnLFxuICAnR0xPQkFMRElDVDI1NicsXG4gICdHTE9CQUxESUNUNjRLJyxcbiAgJ0dSQU5UJyxcbiAgJ0daSVAnLFxuICAnSURFTlRJVFknLFxuICAnSUdOT1JFJyxcbiAgJ0lMSUtFJyxcbiAgJ0lOSVRJQUxMWScsXG4gICdJTlRPJyxcbiAgJ0xFQURJTkcnLFxuICAnTE9DQUxUSU1FJyxcbiAgJ0xPQ0FMVElNRVNUQU1QJyxcbiAgJ0xVTicsXG4gICdMVU5TJyxcbiAgJ0xaTycsXG4gICdMWk9QJyxcbiAgJ01JTlVTJyxcbiAgJ01PU1RMWTEzJyxcbiAgJ01PU1RMWTMyJyxcbiAgJ01PU1RMWTgnLFxuICAnTkFUVVJBTCcsXG4gICdORVcnLFxuICAnTlVMTFMnLFxuICAnT0ZGJyxcbiAgJ09GRkxJTkUnLFxuICAnT0ZGU0VUJyxcbiAgJ09MRCcsXG4gICdPTicsXG4gICdPTkxZJyxcbiAgJ09QRU4nLFxuICAnT1JERVInLFxuICAnT1ZFUkxBUFMnLFxuICAnUEFSQUxMRUwnLFxuICAnUEFSVElUSU9OJyxcbiAgJ1BFUkNFTlQnLFxuICAnUEVSTUlTU0lPTlMnLFxuICAnUExBQ0lORycsXG4gICdQUklNQVJZJyxcbiAgJ1JBVycsXG4gICdSRUFEUkFUSU8nLFxuICAnUkVDT1ZFUicsXG4gICdSRUZFUkVOQ0VTJyxcbiAgJ1JFSkVDVExPRycsXG4gICdSRVNPUlQnLFxuICAnUkVTVE9SRScsXG4gICdTRVNTSU9OX1VTRVInLFxuICAnU0lNSUxBUicsXG4gICdTWVNEQVRFJyxcbiAgJ1NZU1RFTScsXG4gICdUQUJMRScsXG4gICdUQUcnLFxuICAnVERFUycsXG4gICdURVhUMjU1JyxcbiAgJ1RFWFQzMksnLFxuICAnVEhFTicsXG4gICdUSU1FU1RBTVAnLFxuICAnVE8nLFxuICAnVE9QJyxcbiAgJ1RSQUlMSU5HJyxcbiAgJ1RSVUUnLFxuICAnVFJVTkNBVEVDT0xVTU5TJyxcbiAgJ1VOSVFVRScsXG4gICdVU0VSJyxcbiAgJ1VTSU5HJyxcbiAgJ1ZFUkJPU0UnLFxuICAnV0FMTEVUJyxcbiAgJ1dIRU4nLFxuICAnV0lUSCcsXG4gICdXSVRIT1VUJyxcbiAgJ1BSRURJQ0FURScsXG4gICdDT0xVTU5TJyxcbiAgJ0NPTVBST1dTJyxcbiAgJ0NPTVBSRVNTSU9OJyxcbiAgJ0NPUFknLFxuICAnRk9STUFUJyxcbiAgJ0RFTElNSVRFUicsXG4gICdGSVhFRFdJRFRIJyxcbiAgJ0FWUk8nLFxuICAnSlNPTicsXG4gICdFTkNSWVBURUQnLFxuICAnQlpJUDInLFxuICAnR1pJUCcsXG4gICdMWk9QJyxcbiAgJ1BBUlFVRVQnLFxuICAnT1JDJyxcbiAgJ0FDQ0VQVEFOWURBVEUnLFxuICAnQUNDRVBUSU5WQ0hBUlMnLFxuICAnQkxBTktTQVNOVUxMJyxcbiAgJ0RBVEVGT1JNQVQnLFxuICAnRU1QVFlBU05VTEwnLFxuICAnRU5DT0RJTkcnLFxuICAnRVNDQVBFJyxcbiAgJ0VYUExJQ0lUX0lEUycsXG4gICdGSUxMUkVDT1JEJyxcbiAgJ0lHTk9SRUJMQU5LTElORVMnLFxuICAnSUdOT1JFSEVBREVSJyxcbiAgJ05VTEwgQVMnLFxuICAnUkVNT1ZFUVVPVEVTJyxcbiAgJ1JPVU5ERUMnLFxuICAnVElNRUZPUk1BVCcsXG4gICdUUklNQkxBTktTJyxcbiAgJ1RSVU5DQVRFQ09MVU1OUycsXG4gICdDT01QUk9XUycsXG4gICdDT01QVVBEQVRFJyxcbiAgJ01BWEVSUk9SJyxcbiAgJ05PTE9BRCcsXG4gICdTVEFUVVBEQVRFJyxcbiAgJ01BTklGRVNUJyxcbiAgJ1JFR0lPTicsXG4gICdJQU1fUk9MRScsXG4gICdNQVNURVJfU1lNTUVUUklDX0tFWScsXG4gICdTU0gnLFxuICAnQUNDRVBUQU5ZREFURScsXG4gICdBQ0NFUFRJTlZDSEFSUycsXG4gICdBQ0NFU1NfS0VZX0lEJyxcbiAgJ1NFQ1JFVF9BQ0NFU1NfS0VZJyxcbiAgJ0FWUk8nLFxuICAnQkxBTktTQVNOVUxMJyxcbiAgJ0JaSVAyJyxcbiAgJ0NPTVBST1dTJyxcbiAgJ0NPTVBVUERBVEUnLFxuICAnQ1JFREVOVElBTFMnLFxuICAnREFURUZPUk1BVCcsXG4gICdERUxJTUlURVInLFxuICAnRU1QVFlBU05VTEwnLFxuICAnRU5DT0RJTkcnLFxuICAnRU5DUllQVEVEJyxcbiAgJ0VTQ0FQRScsXG4gICdFWFBMSUNJVF9JRFMnLFxuICAnRklMTFJFQ09SRCcsXG4gICdGSVhFRFdJRFRIJyxcbiAgJ0ZPUk1BVCcsXG4gICdJQU1fUk9MRScsXG4gICdHWklQJyxcbiAgJ0lHTk9SRUJMQU5LTElORVMnLFxuICAnSUdOT1JFSEVBREVSJyxcbiAgJ0pTT04nLFxuICAnTFpPUCcsXG4gICdNQU5JRkVTVCcsXG4gICdNQVNURVJfU1lNTUVUUklDX0tFWScsXG4gICdNQVhFUlJPUicsXG4gICdOT0xPQUQnLFxuICAnTlVMTCBBUycsXG4gICdSRUFEUkFUSU8nLFxuICAnUkVHSU9OJyxcbiAgJ1JFTU9WRVFVT1RFUycsXG4gICdST1VOREVDJyxcbiAgJ1NTSCcsXG4gICdTVEFUVVBEQVRFJyxcbiAgJ1RJTUVGT1JNQVQnLFxuICAnU0VTU0lPTl9UT0tFTicsXG4gICdUUklNQkxBTktTJyxcbiAgJ1RSVU5DQVRFQ09MVU1OUycsXG4gICdFWFRFUk5BTCcsXG4gICdEQVRBIENBVEFMT0cnLFxuICAnSElWRSBNRVRBU1RPUkUnLFxuICAnQ0FUQUxPR19ST0xFJyxcbiAgJ1ZBQ1VVTScsXG4gICdDT1BZJyxcbiAgJ1VOTE9BRCcsXG4gICdFVkVOJyxcbiAgJ0FMTCcsXG5dO1xuXG5jb25zdCByZXNlcnZlZFRvcExldmVsV29yZHMgPSBbXG4gICdBREQnLFxuICAnQUZURVInLFxuICAnQUxURVIgQ09MVU1OJyxcbiAgJ0FMVEVSIFRBQkxFJyxcbiAgJ0RFTEVURSBGUk9NJyxcbiAgJ0VYQ0VQVCcsXG4gICdGUk9NJyxcbiAgJ0dST1VQIEJZJyxcbiAgJ0hBVklORycsXG4gICdJTlNFUlQgSU5UTycsXG4gICdJTlNFUlQnLFxuICAnSU5URVJTRUNUJyxcbiAgJ1RPUCcsXG4gICdMSU1JVCcsXG4gICdNT0RJRlknLFxuICAnT1JERVIgQlknLFxuICAnU0VMRUNUJyxcbiAgJ1NFVCBDVVJSRU5UIFNDSEVNQScsXG4gICdTRVQgU0NIRU1BJyxcbiAgJ1NFVCcsXG4gICdVTklPTiBBTEwnLFxuICAnVU5JT04nLFxuICAnVVBEQVRFJyxcbiAgJ1ZBTFVFUycsXG4gICdXSEVSRScsXG4gICdWQUNVVU0nLFxuICAnQ09QWScsXG4gICdVTkxPQUQnLFxuICAnQU5BTFlaRScsXG4gICdBTkFMWVNFJyxcbiAgJ0RJU1RLRVknLFxuICAnU09SVEtFWScsXG4gICdDT01QT1VORCcsXG4gICdJTlRFUkxFQVZFRCcsXG4gICdGT1JNQVQnLFxuICAnREVMSU1JVEVSJyxcbiAgJ0ZJWEVEV0lEVEgnLFxuICAnQVZSTycsXG4gICdKU09OJyxcbiAgJ0VOQ1JZUFRFRCcsXG4gICdCWklQMicsXG4gICdHWklQJyxcbiAgJ0xaT1AnLFxuICAnUEFSUVVFVCcsXG4gICdPUkMnLFxuICAnQUNDRVBUQU5ZREFURScsXG4gICdBQ0NFUFRJTlZDSEFSUycsXG4gICdCTEFOS1NBU05VTEwnLFxuICAnREFURUZPUk1BVCcsXG4gICdFTVBUWUFTTlVMTCcsXG4gICdFTkNPRElORycsXG4gICdFU0NBUEUnLFxuICAnRVhQTElDSVRfSURTJyxcbiAgJ0ZJTExSRUNPUkQnLFxuICAnSUdOT1JFQkxBTktMSU5FUycsXG4gICdJR05PUkVIRUFERVInLFxuICAnTlVMTCBBUycsXG4gICdSRU1PVkVRVU9URVMnLFxuICAnUk9VTkRFQycsXG4gICdUSU1FRk9STUFUJyxcbiAgJ1RSSU1CTEFOS1MnLFxuICAnVFJVTkNBVEVDT0xVTU5TJyxcbiAgJ0NPTVBST1dTJyxcbiAgJ0NPTVBVUERBVEUnLFxuICAnTUFYRVJST1InLFxuICAnTk9MT0FEJyxcbiAgJ1NUQVRVUERBVEUnLFxuICAnTUFOSUZFU1QnLFxuICAnUkVHSU9OJyxcbiAgJ0lBTV9ST0xFJyxcbiAgJ01BU1RFUl9TWU1NRVRSSUNfS0VZJyxcbiAgJ1NTSCcsXG4gICdBQ0NFUFRBTllEQVRFJyxcbiAgJ0FDQ0VQVElOVkNIQVJTJyxcbiAgJ0FDQ0VTU19LRVlfSUQnLFxuICAnU0VDUkVUX0FDQ0VTU19LRVknLFxuICAnQVZSTycsXG4gICdCTEFOS1NBU05VTEwnLFxuICAnQlpJUDInLFxuICAnQ09NUFJPV1MnLFxuICAnQ09NUFVQREFURScsXG4gICdDUkVERU5USUFMUycsXG4gICdEQVRFRk9STUFUJyxcbiAgJ0RFTElNSVRFUicsXG4gICdFTVBUWUFTTlVMTCcsXG4gICdFTkNPRElORycsXG4gICdFTkNSWVBURUQnLFxuICAnRVNDQVBFJyxcbiAgJ0VYUExJQ0lUX0lEUycsXG4gICdGSUxMUkVDT1JEJyxcbiAgJ0ZJWEVEV0lEVEgnLFxuICAnRk9STUFUJyxcbiAgJ0lBTV9ST0xFJyxcbiAgJ0daSVAnLFxuICAnSUdOT1JFQkxBTktMSU5FUycsXG4gICdJR05PUkVIRUFERVInLFxuICAnSlNPTicsXG4gICdMWk9QJyxcbiAgJ01BTklGRVNUJyxcbiAgJ01BU1RFUl9TWU1NRVRSSUNfS0VZJyxcbiAgJ01BWEVSUk9SJyxcbiAgJ05PTE9BRCcsXG4gICdOVUxMIEFTJyxcbiAgJ1JFQURSQVRJTycsXG4gICdSRUdJT04nLFxuICAnUkVNT1ZFUVVPVEVTJyxcbiAgJ1JPVU5ERUMnLFxuICAnU1NIJyxcbiAgJ1NUQVRVUERBVEUnLFxuICAnVElNRUZPUk1BVCcsXG4gICdTRVNTSU9OX1RPS0VOJyxcbiAgJ1RSSU1CTEFOS1MnLFxuICAnVFJVTkNBVEVDT0xVTU5TJyxcbiAgJ0VYVEVSTkFMJyxcbiAgJ0RBVEEgQ0FUQUxPRycsXG4gICdISVZFIE1FVEFTVE9SRScsXG4gICdDQVRBTE9HX1JPTEUnLFxuXTtcblxuY29uc3QgcmVzZXJ2ZWRUb3BMZXZlbFdvcmRzTm9JbmRlbnQgPSBbXTtcblxuY29uc3QgcmVzZXJ2ZWROZXdsaW5lV29yZHMgPSBbXG4gICdBTkQnLFxuICAnRUxTRScsXG4gICdPUicsXG4gICdPVVRFUiBBUFBMWScsXG4gICdXSEVOJyxcbiAgJ1ZBQ1VVTScsXG4gICdDT1BZJyxcbiAgJ1VOTE9BRCcsXG4gICdBTkFMWVpFJyxcbiAgJ0FOQUxZU0UnLFxuICAnRElTVEtFWScsXG4gICdTT1JUS0VZJyxcbiAgJ0NPTVBPVU5EJyxcbiAgJ0lOVEVSTEVBVkVEJyxcbiAgLy8gam9pbnNcbiAgJ0pPSU4nLFxuICAnSU5ORVIgSk9JTicsXG4gICdMRUZUIEpPSU4nLFxuICAnTEVGVCBPVVRFUiBKT0lOJyxcbiAgJ1JJR0hUIEpPSU4nLFxuICAnUklHSFQgT1VURVIgSk9JTicsXG4gICdGVUxMIEpPSU4nLFxuICAnRlVMTCBPVVRFUiBKT0lOJyxcbiAgJ0NST1NTIEpPSU4nLFxuICAnTkFUVVJBTCBKT0lOJyxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlZHNoaWZ0Rm9ybWF0dGVyIGV4dGVuZHMgRm9ybWF0dGVyIHtcbiAgdG9rZW5pemVyKCkge1xuICAgIHJldHVybiBuZXcgVG9rZW5pemVyKHtcbiAgICAgIHJlc2VydmVkV29yZHMsXG4gICAgICByZXNlcnZlZFRvcExldmVsV29yZHMsXG4gICAgICByZXNlcnZlZE5ld2xpbmVXb3JkcyxcbiAgICAgIHJlc2VydmVkVG9wTGV2ZWxXb3Jkc05vSW5kZW50LFxuICAgICAgc3RyaW5nVHlwZXM6IFtgXCJcImAsIFwiJydcIiwgJ2BgJ10sXG4gICAgICBvcGVuUGFyZW5zOiBbJygnXSxcbiAgICAgIGNsb3NlUGFyZW5zOiBbJyknXSxcbiAgICAgIGluZGV4ZWRQbGFjZWhvbGRlclR5cGVzOiBbJz8nXSxcbiAgICAgIG5hbWVkUGxhY2Vob2xkZXJUeXBlczogWydAJywgJyMnLCAnJCddLFxuICAgICAgbGluZUNvbW1lbnRUeXBlczogWyctLSddLFxuICAgICAgb3BlcmF0b3JzOiBbJ3wvJywgJ3x8LycsICc8PCcsICc+PicsICchPScsICd8fCddLFxuICAgIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgRm9ybWF0dGVyIGZyb20gJy4uL2NvcmUvRm9ybWF0dGVyJztcbmltcG9ydCB7IGlzRW5kLCBpc1dpbmRvdyB9IGZyb20gJy4uL2NvcmUvdG9rZW4nO1xuaW1wb3J0IFRva2VuaXplciBmcm9tICcuLi9jb3JlL1Rva2VuaXplcic7XG5pbXBvcnQgdG9rZW5UeXBlcyBmcm9tICcuLi9jb3JlL3Rva2VuVHlwZXMnO1xuXG5jb25zdCByZXNlcnZlZFdvcmRzID0gW1xuICAnQUxMJyxcbiAgJ0FMVEVSJyxcbiAgJ0FOQUxZU0UnLFxuICAnQU5BTFlaRScsXG4gICdBUlJBWV9aSVAnLFxuICAnQVJSQVknLFxuICAnQVMnLFxuICAnQVNDJyxcbiAgJ0FWRycsXG4gICdCRVRXRUVOJyxcbiAgJ0NBU0NBREUnLFxuICAnQ0FTRScsXG4gICdDQVNUJyxcbiAgJ0NPQUxFU0NFJyxcbiAgJ0NPTExFQ1RfTElTVCcsXG4gICdDT0xMRUNUX1NFVCcsXG4gICdDT0xVTU4nLFxuICAnQ09MVU1OUycsXG4gICdDT01NRU5UJyxcbiAgJ0NPTlNUUkFJTlQnLFxuICAnQ09OVEFJTlMnLFxuICAnQ09OVkVSVCcsXG4gICdDT1VOVCcsXG4gICdDVU1FX0RJU1QnLFxuICAnQ1VSUkVOVCBST1cnLFxuICAnQ1VSUkVOVF9EQVRFJyxcbiAgJ0NVUlJFTlRfVElNRVNUQU1QJyxcbiAgJ0RBVEFCQVNFJyxcbiAgJ0RBVEFCQVNFUycsXG4gICdEQVRFX0FERCcsXG4gICdEQVRFX1NVQicsXG4gICdEQVRFX1RSVU5DJyxcbiAgJ0RBWV9IT1VSJyxcbiAgJ0RBWV9NSU5VVEUnLFxuICAnREFZX1NFQ09ORCcsXG4gICdEQVknLFxuICAnREFZUycsXG4gICdERUNPREUnLFxuICAnREVGQVVMVCcsXG4gICdERUxFVEUnLFxuICAnREVOU0VfUkFOSycsXG4gICdERVNDJyxcbiAgJ0RFU0NSSUJFJyxcbiAgJ0RJU1RJTkNUJyxcbiAgJ0RJU1RJTkNUUk9XJyxcbiAgJ0RJVicsXG4gICdEUk9QJyxcbiAgJ0VMU0UnLFxuICAnRU5DT0RFJyxcbiAgJ0VORCcsXG4gICdFWElTVFMnLFxuICAnRVhQTEFJTicsXG4gICdFWFBMT0RFX09VVEVSJyxcbiAgJ0VYUExPREUnLFxuICAnRklMVEVSJyxcbiAgJ0ZJUlNUX1ZBTFVFJyxcbiAgJ0ZJUlNUJyxcbiAgJ0ZJWEVEJyxcbiAgJ0ZMQVRURU4nLFxuICAnRk9MTE9XSU5HJyxcbiAgJ0ZST01fVU5JWFRJTUUnLFxuICAnRlVMTCcsXG4gICdHUkVBVEVTVCcsXG4gICdHUk9VUF9DT05DQVQnLFxuICAnSE9VUl9NSU5VVEUnLFxuICAnSE9VUl9TRUNPTkQnLFxuICAnSE9VUicsXG4gICdIT1VSUycsXG4gICdJRicsXG4gICdJRk5VTEwnLFxuICAnSU4nLFxuICAnSU5TRVJUJyxcbiAgJ0lOVEVSVkFMJyxcbiAgJ0lOVE8nLFxuICAnSVMnLFxuICAnTEFHJyxcbiAgJ0xBU1RfVkFMVUUnLFxuICAnTEFTVCcsXG4gICdMRUFEJyxcbiAgJ0xFQURJTkcnLFxuICAnTEVBU1QnLFxuICAnTEVWRUwnLFxuICAnTElLRScsXG4gICdNQVgnLFxuICAnTUVSR0UnLFxuICAnTUlOJyxcbiAgJ01JTlVURV9TRUNPTkQnLFxuICAnTUlOVVRFJyxcbiAgJ01PTlRIJyxcbiAgJ05BVFVSQUwnLFxuICAnTk9UJyxcbiAgJ05PVygpJyxcbiAgJ05USUxFJyxcbiAgJ05VTEwnLFxuICAnTlVMTElGJyxcbiAgJ09GRlNFVCcsXG4gICdPTiBERUxFVEUnLFxuICAnT04gVVBEQVRFJyxcbiAgJ09OJyxcbiAgJ09OTFknLFxuICAnT1BUSU1JWkUnLFxuICAnT1ZFUicsXG4gICdQRVJDRU5UX1JBTksnLFxuICAnUFJFQ0VESU5HJyxcbiAgJ1JBTkdFJyxcbiAgJ1JBTksnLFxuICAnUkVHRVhQJyxcbiAgJ1JFTkFNRScsXG4gICdSTElLRScsXG4gICdST1cnLFxuICAnUk9XUycsXG4gICdTRUNPTkQnLFxuICAnU0VQQVJBVE9SJyxcbiAgJ1NFUVVFTkNFJyxcbiAgJ1NJWkUnLFxuICAnU1RSSU5HJyxcbiAgJ1NUUlVDVCcsXG4gICdTVU0nLFxuICAnVEFCTEUnLFxuICAnVEFCTEVTJyxcbiAgJ1RFTVBPUkFSWScsXG4gICdUSEVOJyxcbiAgJ1RPX0RBVEUnLFxuICAnVE9fSlNPTicsXG4gICdUTycsXG4gICdUUkFJTElORycsXG4gICdUUkFOU0ZPUk0nLFxuICAnVFJVRScsXG4gICdUUlVOQ0FURScsXG4gICdUWVBFJyxcbiAgJ1RZUEVTJyxcbiAgJ1VOQk9VTkRFRCcsXG4gICdVTklRVUUnLFxuICAnVU5JWF9USU1FU1RBTVAnLFxuICAnVU5MT0NLJyxcbiAgJ1VOU0lHTkVEJyxcbiAgJ1VTSU5HJyxcbiAgJ1ZBUklBQkxFUycsXG4gICdWSUVXJyxcbiAgJ1dIRU4nLFxuICAnV0lUSCcsXG4gICdZRUFSX01PTlRIJyxcbl07XG5cbmNvbnN0IHJlc2VydmVkVG9wTGV2ZWxXb3JkcyA9IFtcbiAgJ0FERCcsXG4gICdBRlRFUicsXG4gICdBTFRFUiBDT0xVTU4nLFxuICAnQUxURVIgREFUQUJBU0UnLFxuICAnQUxURVIgU0NIRU1BJyxcbiAgJ0FMVEVSIFRBQkxFJyxcbiAgJ0NMVVNURVIgQlknLFxuICAnQ0xVU1RFUkVEIEJZJyxcbiAgJ0RFTEVURSBGUk9NJyxcbiAgJ0RJU1RSSUJVVEUgQlknLFxuICAnRlJPTScsXG4gICdHUk9VUCBCWScsXG4gICdIQVZJTkcnLFxuICAnSU5TRVJUIElOVE8nLFxuICAnSU5TRVJUJyxcbiAgJ0xJTUlUJyxcbiAgJ09QVElPTlMnLFxuICAnT1JERVIgQlknLFxuICAnUEFSVElUSU9OIEJZJyxcbiAgJ1BBUlRJVElPTkVEIEJZJyxcbiAgJ1JBTkdFJyxcbiAgJ1JPV1MnLFxuICAnU0VMRUNUJyxcbiAgJ1NFVCBDVVJSRU5UIFNDSEVNQScsXG4gICdTRVQgU0NIRU1BJyxcbiAgJ1NFVCcsXG4gICdUQkxQUk9QRVJUSUVTJyxcbiAgJ1VQREFURScsXG4gICdVU0lORycsXG4gICdWQUxVRVMnLFxuICAnV0hFUkUnLFxuICAnV0lORE9XJyxcbl07XG5cbmNvbnN0IHJlc2VydmVkVG9wTGV2ZWxXb3Jkc05vSW5kZW50ID0gW1xuICAnRVhDRVBUIEFMTCcsXG4gICdFWENFUFQnLFxuICAnSU5URVJTRUNUIEFMTCcsXG4gICdJTlRFUlNFQ1QnLFxuICAnVU5JT04gQUxMJyxcbiAgJ1VOSU9OJyxcbl07XG5cbmNvbnN0IHJlc2VydmVkTmV3bGluZVdvcmRzID0gW1xuICAnQU5EJyxcbiAgJ0NSRUFURSBPUicsXG4gICdDUkVBVEUnLFxuICAnRUxTRScsXG4gICdMQVRFUkFMIFZJRVcnLFxuICAnT1InLFxuICAnT1VURVIgQVBQTFknLFxuICAnV0hFTicsXG4gICdYT1InLFxuICAvLyBqb2luc1xuICAnSk9JTicsXG4gICdJTk5FUiBKT0lOJyxcbiAgJ0xFRlQgSk9JTicsXG4gICdMRUZUIE9VVEVSIEpPSU4nLFxuICAnUklHSFQgSk9JTicsXG4gICdSSUdIVCBPVVRFUiBKT0lOJyxcbiAgJ0ZVTEwgSk9JTicsXG4gICdGVUxMIE9VVEVSIEpPSU4nLFxuICAnQ1JPU1MgSk9JTicsXG4gICdOQVRVUkFMIEpPSU4nLFxuICAvLyBub24tc3RhbmRhcmQtam9pbnNcbiAgJ0FOVEkgSk9JTicsXG4gICdTRU1JIEpPSU4nLFxuICAnTEVGVCBBTlRJIEpPSU4nLFxuICAnTEVGVCBTRU1JIEpPSU4nLFxuICAnUklHSFQgT1VURVIgSk9JTicsXG4gICdSSUdIVCBTRU1JIEpPSU4nLFxuICAnTkFUVVJBTCBBTlRJIEpPSU4nLFxuICAnTkFUVVJBTCBGVUxMIE9VVEVSIEpPSU4nLFxuICAnTkFUVVJBTCBJTk5FUiBKT0lOJyxcbiAgJ05BVFVSQUwgTEVGVCBBTlRJIEpPSU4nLFxuICAnTkFUVVJBTCBMRUZUIE9VVEVSIEpPSU4nLFxuICAnTkFUVVJBTCBMRUZUIFNFTUkgSk9JTicsXG4gICdOQVRVUkFMIE9VVEVSIEpPSU4nLFxuICAnTkFUVVJBTCBSSUdIVCBPVVRFUiBKT0lOJyxcbiAgJ05BVFVSQUwgUklHSFQgU0VNSSBKT0lOJyxcbiAgJ05BVFVSQUwgU0VNSSBKT0lOJyxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNwYXJrU3FsRm9ybWF0dGVyIGV4dGVuZHMgRm9ybWF0dGVyIHtcbiAgdG9rZW5pemVyKCkge1xuICAgIHJldHVybiBuZXcgVG9rZW5pemVyKHtcbiAgICAgIHJlc2VydmVkV29yZHMsXG4gICAgICByZXNlcnZlZFRvcExldmVsV29yZHMsXG4gICAgICByZXNlcnZlZE5ld2xpbmVXb3JkcyxcbiAgICAgIHJlc2VydmVkVG9wTGV2ZWxXb3Jkc05vSW5kZW50LFxuICAgICAgc3RyaW5nVHlwZXM6IFtgXCJcImAsIFwiJydcIiwgJ2BgJywgJ3t9J10sXG4gICAgICBvcGVuUGFyZW5zOiBbJygnLCAnQ0FTRSddLFxuICAgICAgY2xvc2VQYXJlbnM6IFsnKScsICdFTkQnXSxcbiAgICAgIGluZGV4ZWRQbGFjZWhvbGRlclR5cGVzOiBbJz8nXSxcbiAgICAgIG5hbWVkUGxhY2Vob2xkZXJUeXBlczogWyckJ10sXG4gICAgICBsaW5lQ29tbWVudFR5cGVzOiBbJy0tJ10sXG4gICAgICBvcGVyYXRvcnM6IFsnIT0nLCAnPD0+JywgJyYmJywgJ3x8JywgJz09J10sXG4gICAgfSk7XG4gIH1cblxuICB0b2tlbk92ZXJyaWRlKHRva2VuKSB7XG4gICAgLy8gRml4IGNhc2VzIHdoZXJlIG5hbWVzIGFyZSBhbWJpZ3VvdXNseSBrZXl3b3JkcyBvciBmdW5jdGlvbnNcbiAgICBpZiAoaXNXaW5kb3codG9rZW4pKSB7XG4gICAgICBjb25zdCBhaGVhZFRva2VuID0gdGhpcy50b2tlbkxvb2tBaGVhZCgpO1xuICAgICAgaWYgKGFoZWFkVG9rZW4gJiYgYWhlYWRUb2tlbi50eXBlID09PSB0b2tlblR5cGVzLk9QRU5fUEFSRU4pIHtcbiAgICAgICAgLy8gVGhpcyBpcyBhIGZ1bmN0aW9uIGNhbGwsIHRyZWF0IGl0IGFzIGEgcmVzZXJ2ZWQgd29yZFxuICAgICAgICByZXR1cm4geyB0eXBlOiB0b2tlblR5cGVzLlJFU0VSVkVELCB2YWx1ZTogdG9rZW4udmFsdWUgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBGaXggY2FzZXMgd2hlcmUgbmFtZXMgYXJlIGFtYmlndW91c2x5IGtleXdvcmRzIG9yIHByb3BlcnRpZXNcbiAgICBpZiAoaXNFbmQodG9rZW4pKSB7XG4gICAgICBjb25zdCBiYWNrVG9rZW4gPSB0aGlzLnRva2VuTG9va0JlaGluZCgpO1xuICAgICAgaWYgKGJhY2tUb2tlbiAmJiBiYWNrVG9rZW4udHlwZSA9PT0gdG9rZW5UeXBlcy5PUEVSQVRPUiAmJiBiYWNrVG9rZW4udmFsdWUgPT09ICcuJykge1xuICAgICAgICAvLyBUaGlzIGlzIHdpbmRvdygpLmVuZCAob3Igc2ltaWxhcikgbm90IENBU0UgLi4uIEVORFxuICAgICAgICByZXR1cm4geyB0eXBlOiB0b2tlblR5cGVzLldPUkQsIHZhbHVlOiB0b2tlbi52YWx1ZSB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0b2tlbjtcbiAgfVxufVxuIiwiaW1wb3J0IEZvcm1hdHRlciBmcm9tICcuLi9jb3JlL0Zvcm1hdHRlcic7XG5pbXBvcnQgVG9rZW5pemVyIGZyb20gJy4uL2NvcmUvVG9rZW5pemVyJztcblxuLy8gaHR0cHM6Ly9qYWtld2hlYXQuZ2l0aHViLmlvL3NxbC1vdmVydmlldy9zcWwtMjAwOC1mb3VuZGF0aW9uLWdyYW1tYXIuaHRtbCNyZXNlcnZlZC13b3JkXG5jb25zdCByZXNlcnZlZFdvcmRzID0gW1xuICAnQUJTJyxcbiAgJ0FMTCcsXG4gICdBTExPQ0FURScsXG4gICdBTFRFUicsXG4gICdBTkQnLFxuICAnQU5ZJyxcbiAgJ0FSRScsXG4gICdBUlJBWScsXG4gICdBUycsXG4gICdBU0VOU0lUSVZFJyxcbiAgJ0FTWU1NRVRSSUMnLFxuICAnQVQnLFxuICAnQVRPTUlDJyxcbiAgJ0FVVEhPUklaQVRJT04nLFxuICAnQVZHJyxcbiAgJ0JFR0lOJyxcbiAgJ0JFVFdFRU4nLFxuICAnQklHSU5UJyxcbiAgJ0JJTkFSWScsXG4gICdCTE9CJyxcbiAgJ0JPT0xFQU4nLFxuICAnQk9USCcsXG4gICdCWScsXG4gICdDQUxMJyxcbiAgJ0NBTExFRCcsXG4gICdDQVJESU5BTElUWScsXG4gICdDQVNDQURFRCcsXG4gICdDQVNFJyxcbiAgJ0NBU1QnLFxuICAnQ0VJTCcsXG4gICdDRUlMSU5HJyxcbiAgJ0NIQVInLFxuICAnQ0hBUl9MRU5HVEgnLFxuICAnQ0hBUkFDVEVSJyxcbiAgJ0NIQVJBQ1RFUl9MRU5HVEgnLFxuICAnQ0hFQ0snLFxuICAnQ0xPQicsXG4gICdDTE9TRScsXG4gICdDT0FMRVNDRScsXG4gICdDT0xMQVRFJyxcbiAgJ0NPTExFQ1QnLFxuICAnQ09MVU1OJyxcbiAgJ0NPTU1JVCcsXG4gICdDT05ESVRJT04nLFxuICAnQ09OTkVDVCcsXG4gICdDT05TVFJBSU5UJyxcbiAgJ0NPTlZFUlQnLFxuICAnQ09SUicsXG4gICdDT1JSRVNQT05ESU5HJyxcbiAgJ0NPVU5UJyxcbiAgJ0NPVkFSX1BPUCcsXG4gICdDT1ZBUl9TQU1QJyxcbiAgJ0NSRUFURScsXG4gICdDUk9TUycsXG4gICdDVUJFJyxcbiAgJ0NVTUVfRElTVCcsXG4gICdDVVJSRU5UJyxcbiAgJ0NVUlJFTlRfQ0FUQUxPRycsXG4gICdDVVJSRU5UX0RBVEUnLFxuICAnQ1VSUkVOVF9ERUZBVUxUX1RSQU5TRk9STV9HUk9VUCcsXG4gICdDVVJSRU5UX1BBVEgnLFxuICAnQ1VSUkVOVF9ST0xFJyxcbiAgJ0NVUlJFTlRfU0NIRU1BJyxcbiAgJ0NVUlJFTlRfVElNRScsXG4gICdDVVJSRU5UX1RJTUVTVEFNUCcsXG4gICdDVVJSRU5UX1RSQU5TRk9STV9HUk9VUF9GT1JfVFlQRScsXG4gICdDVVJSRU5UX1VTRVInLFxuICAnQ1VSU09SJyxcbiAgJ0NZQ0xFJyxcbiAgJ0RBVEUnLFxuICAnREFZJyxcbiAgJ0RFQUxMT0NBVEUnLFxuICAnREVDJyxcbiAgJ0RFQ0lNQUwnLFxuICAnREVDTEFSRScsXG4gICdERUZBVUxUJyxcbiAgJ0RFTEVURScsXG4gICdERU5TRV9SQU5LJyxcbiAgJ0RFUkVGJyxcbiAgJ0RFU0NSSUJFJyxcbiAgJ0RFVEVSTUlOSVNUSUMnLFxuICAnRElTQ09OTkVDVCcsXG4gICdESVNUSU5DVCcsXG4gICdET1VCTEUnLFxuICAnRFJPUCcsXG4gICdEWU5BTUlDJyxcbiAgJ0VBQ0gnLFxuICAnRUxFTUVOVCcsXG4gICdFTFNFJyxcbiAgJ0VORCcsXG4gICdFTkQtRVhFQycsXG4gICdFU0NBUEUnLFxuICAnRVZFUlknLFxuICAnRVhDRVBUJyxcbiAgJ0VYRUMnLFxuICAnRVhFQ1VURScsXG4gICdFWElTVFMnLFxuICAnRVhQJyxcbiAgJ0VYVEVSTkFMJyxcbiAgJ0VYVFJBQ1QnLFxuICAnRkFMU0UnLFxuICAnRkVUQ0gnLFxuICAnRklMVEVSJyxcbiAgJ0ZMT0FUJyxcbiAgJ0ZMT09SJyxcbiAgJ0ZPUicsXG4gICdGT1JFSUdOJyxcbiAgJ0ZSRUUnLFxuICAnRlJPTScsXG4gICdGVUxMJyxcbiAgJ0ZVTkNUSU9OJyxcbiAgJ0ZVU0lPTicsXG4gICdHRVQnLFxuICAnR0xPQkFMJyxcbiAgJ0dSQU5UJyxcbiAgJ0dST1VQJyxcbiAgJ0dST1VQSU5HJyxcbiAgJ0hBVklORycsXG4gICdIT0xEJyxcbiAgJ0hPVVInLFxuICAnSURFTlRJVFknLFxuICAnSU4nLFxuICAnSU5ESUNBVE9SJyxcbiAgJ0lOTkVSJyxcbiAgJ0lOT1VUJyxcbiAgJ0lOU0VOU0lUSVZFJyxcbiAgJ0lOU0VSVCcsXG4gICdJTlQnLFxuICAnSU5URUdFUicsXG4gICdJTlRFUlNFQ1QnLFxuICAnSU5URVJTRUNUSU9OJyxcbiAgJ0lOVEVSVkFMJyxcbiAgJ0lOVE8nLFxuICAnSVMnLFxuICAnSk9JTicsXG4gICdMQU5HVUFHRScsXG4gICdMQVJHRScsXG4gICdMQVRFUkFMJyxcbiAgJ0xFQURJTkcnLFxuICAnTEVGVCcsXG4gICdMSUtFJyxcbiAgJ0xJS0VfUkVHRVgnLFxuICAnTE4nLFxuICAnTE9DQUwnLFxuICAnTE9DQUxUSU1FJyxcbiAgJ0xPQ0FMVElNRVNUQU1QJyxcbiAgJ0xPV0VSJyxcbiAgJ01BVENIJyxcbiAgJ01BWCcsXG4gICdNRU1CRVInLFxuICAnTUVSR0UnLFxuICAnTUVUSE9EJyxcbiAgJ01JTicsXG4gICdNSU5VVEUnLFxuICAnTU9EJyxcbiAgJ01PRElGSUVTJyxcbiAgJ01PRFVMRScsXG4gICdNT05USCcsXG4gICdNVUxUSVNFVCcsXG4gICdOQVRJT05BTCcsXG4gICdOQVRVUkFMJyxcbiAgJ05DSEFSJyxcbiAgJ05DTE9CJyxcbiAgJ05FVycsXG4gICdOTycsXG4gICdOT05FJyxcbiAgJ05PUk1BTElaRScsXG4gICdOT1QnLFxuICAnTlVMTCcsXG4gICdOVUxMSUYnLFxuICAnTlVNRVJJQycsXG4gICdPQ1RFVF9MRU5HVEgnLFxuICAnT0NDVVJSRU5DRVNfUkVHRVgnLFxuICAnT0YnLFxuICAnT0xEJyxcbiAgJ09OJyxcbiAgJ09OTFknLFxuICAnT1BFTicsXG4gICdPUicsXG4gICdPUkRFUicsXG4gICdPVVQnLFxuICAnT1VURVInLFxuICAnT1ZFUicsXG4gICdPVkVSTEFQUycsXG4gICdPVkVSTEFZJyxcbiAgJ1BBUkFNRVRFUicsXG4gICdQQVJUSVRJT04nLFxuICAnUEVSQ0VOVF9SQU5LJyxcbiAgJ1BFUkNFTlRJTEVfQ09OVCcsXG4gICdQRVJDRU5USUxFX0RJU0MnLFxuICAnUE9TSVRJT04nLFxuICAnUE9TSVRJT05fUkVHRVgnLFxuICAnUE9XRVInLFxuICAnUFJFQ0lTSU9OJyxcbiAgJ1BSRVBBUkUnLFxuICAnUFJJTUFSWScsXG4gICdQUk9DRURVUkUnLFxuICAnUkFOR0UnLFxuICAnUkFOSycsXG4gICdSRUFEUycsXG4gICdSRUFMJyxcbiAgJ1JFQ1VSU0lWRScsXG4gICdSRUYnLFxuICAnUkVGRVJFTkNFUycsXG4gICdSRUZFUkVOQ0lORycsXG4gICdSRUdSX0FWR1gnLFxuICAnUkVHUl9BVkdZJyxcbiAgJ1JFR1JfQ09VTlQnLFxuICAnUkVHUl9JTlRFUkNFUFQnLFxuICAnUkVHUl9SMicsXG4gICdSRUdSX1NMT1BFJyxcbiAgJ1JFR1JfU1hYJyxcbiAgJ1JFR1JfU1hZJyxcbiAgJ1JFR1JfU1lZJyxcbiAgJ1JFTEVBU0UnLFxuICAnUkVTVUxUJyxcbiAgJ1JFVFVSTicsXG4gICdSRVRVUk5TJyxcbiAgJ1JFVk9LRScsXG4gICdSSUdIVCcsXG4gICdST0xMQkFDSycsXG4gICdST0xMVVAnLFxuICAnUk9XJyxcbiAgJ1JPV19OVU1CRVInLFxuICAnUk9XUycsXG4gICdTQVZFUE9JTlQnLFxuICAnU0NPUEUnLFxuICAnU0NST0xMJyxcbiAgJ1NFQVJDSCcsXG4gICdTRUNPTkQnLFxuICAnU0VMRUNUJyxcbiAgJ1NFTlNJVElWRScsXG4gICdTRVNTSU9OX1VTRVInLFxuICAnU0VUJyxcbiAgJ1NJTUlMQVInLFxuICAnU01BTExJTlQnLFxuICAnU09NRScsXG4gICdTUEVDSUZJQycsXG4gICdTUEVDSUZJQ1RZUEUnLFxuICAnU1FMJyxcbiAgJ1NRTEVYQ0VQVElPTicsXG4gICdTUUxTVEFURScsXG4gICdTUUxXQVJOSU5HJyxcbiAgJ1NRUlQnLFxuICAnU1RBUlQnLFxuICAnU1RBVElDJyxcbiAgJ1NURERFVl9QT1AnLFxuICAnU1REREVWX1NBTVAnLFxuICAnU1VCTVVMVElTRVQnLFxuICAnU1VCU1RSSU5HJyxcbiAgJ1NVQlNUUklOR19SRUdFWCcsXG4gICdTVU0nLFxuICAnU1lNTUVUUklDJyxcbiAgJ1NZU1RFTScsXG4gICdTWVNURU1fVVNFUicsXG4gICdUQUJMRScsXG4gICdUQUJMRVNBTVBMRScsXG4gICdUSEVOJyxcbiAgJ1RJTUUnLFxuICAnVElNRVNUQU1QJyxcbiAgJ1RJTUVaT05FX0hPVVInLFxuICAnVElNRVpPTkVfTUlOVVRFJyxcbiAgJ1RPJyxcbiAgJ1RSQUlMSU5HJyxcbiAgJ1RSQU5TTEFURScsXG4gICdUUkFOU0xBVEVfUkVHRVgnLFxuICAnVFJBTlNMQVRJT04nLFxuICAnVFJFQVQnLFxuICAnVFJJR0dFUicsXG4gICdUUklNJyxcbiAgJ1RSVUUnLFxuICAnVUVTQ0FQRScsXG4gICdVTklPTicsXG4gICdVTklRVUUnLFxuICAnVU5LTk9XTicsXG4gICdVTk5FU1QnLFxuICAnVVBEQVRFJyxcbiAgJ1VQUEVSJyxcbiAgJ1VTRVInLFxuICAnVVNJTkcnLFxuICAnVkFMVUUnLFxuICAnVkFMVUVTJyxcbiAgJ1ZBUl9QT1AnLFxuICAnVkFSX1NBTVAnLFxuICAnVkFSQklOQVJZJyxcbiAgJ1ZBUkNIQVInLFxuICAnVkFSWUlORycsXG4gICdXSEVOJyxcbiAgJ1dIRU5FVkVSJyxcbiAgJ1dIRVJFJyxcbiAgJ1dJRFRIX0JVQ0tFVCcsXG4gICdXSU5ET1cnLFxuICAnV0lUSCcsXG4gICdXSVRISU4nLFxuICAnV0lUSE9VVCcsXG4gICdZRUFSJyxcbl07XG5cbmNvbnN0IHJlc2VydmVkVG9wTGV2ZWxXb3JkcyA9IFtcbiAgJ0FERCcsXG4gICdBTFRFUiBDT0xVTU4nLFxuICAnQUxURVIgVEFCTEUnLFxuICAnQ0FTRScsXG4gICdERUxFVEUgRlJPTScsXG4gICdFTkQnLFxuICAnRkVUQ0ggRklSU1QnLFxuICAnRkVUQ0ggTkVYVCcsXG4gICdGRVRDSCBQUklPUicsXG4gICdGRVRDSCBMQVNUJyxcbiAgJ0ZFVENIIEFCU09MVVRFJyxcbiAgJ0ZFVENIIFJFTEFUSVZFJyxcbiAgJ0ZST00nLFxuICAnR1JPVVAgQlknLFxuICAnSEFWSU5HJyxcbiAgJ0lOU0VSVCBJTlRPJyxcbiAgJ0xJTUlUJyxcbiAgJ09SREVSIEJZJyxcbiAgJ1NFTEVDVCcsXG4gICdTRVQgU0NIRU1BJyxcbiAgJ1NFVCcsXG4gICdVUERBVEUnLFxuICAnVkFMVUVTJyxcbiAgJ1dIRVJFJyxcbl07XG5cbmNvbnN0IHJlc2VydmVkVG9wTGV2ZWxXb3Jkc05vSW5kZW50ID0gW1xuICAnSU5URVJTRUNUJyxcbiAgJ0lOVEVSU0VDVCBBTEwnLFxuICAnSU5URVJTRUNUIERJU1RJTkNUJyxcbiAgJ1VOSU9OJyxcbiAgJ1VOSU9OIEFMTCcsXG4gICdVTklPTiBESVNUSU5DVCcsXG4gICdFWENFUFQnLFxuICAnRVhDRVBUIEFMTCcsXG4gICdFWENFUFQgRElTVElOQ1QnLFxuXTtcblxuY29uc3QgcmVzZXJ2ZWROZXdsaW5lV29yZHMgPSBbXG4gICdBTkQnLFxuICAnRUxTRScsXG4gICdPUicsXG4gICdXSEVOJyxcbiAgLy8gam9pbnNcbiAgJ0pPSU4nLFxuICAnSU5ORVIgSk9JTicsXG4gICdMRUZUIEpPSU4nLFxuICAnTEVGVCBPVVRFUiBKT0lOJyxcbiAgJ1JJR0hUIEpPSU4nLFxuICAnUklHSFQgT1VURVIgSk9JTicsXG4gICdGVUxMIEpPSU4nLFxuICAnRlVMTCBPVVRFUiBKT0lOJyxcbiAgJ0NST1NTIEpPSU4nLFxuICAnTkFUVVJBTCBKT0lOJyxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YW5kYXJkU3FsRm9ybWF0dGVyIGV4dGVuZHMgRm9ybWF0dGVyIHtcbiAgdG9rZW5pemVyKCkge1xuICAgIHJldHVybiBuZXcgVG9rZW5pemVyKHtcbiAgICAgIHJlc2VydmVkV29yZHMsXG4gICAgICByZXNlcnZlZFRvcExldmVsV29yZHMsXG4gICAgICByZXNlcnZlZE5ld2xpbmVXb3JkcyxcbiAgICAgIHJlc2VydmVkVG9wTGV2ZWxXb3Jkc05vSW5kZW50LFxuICAgICAgc3RyaW5nVHlwZXM6IFtgXCJcImAsIFwiJydcIl0sXG4gICAgICBvcGVuUGFyZW5zOiBbJygnLCAnQ0FTRSddLFxuICAgICAgY2xvc2VQYXJlbnM6IFsnKScsICdFTkQnXSxcbiAgICAgIGluZGV4ZWRQbGFjZWhvbGRlclR5cGVzOiBbJz8nXSxcbiAgICAgIG5hbWVkUGxhY2Vob2xkZXJUeXBlczogW10sXG4gICAgICBsaW5lQ29tbWVudFR5cGVzOiBbJy0tJ10sXG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCBGb3JtYXR0ZXIgZnJvbSAnLi4vY29yZS9Gb3JtYXR0ZXInO1xuaW1wb3J0IFRva2VuaXplciBmcm9tICcuLi9jb3JlL1Rva2VuaXplcic7XG5cbmNvbnN0IHJlc2VydmVkV29yZHMgPSBbXG4gICdBREQnLFxuICAnRVhURVJOQUwnLFxuICAnUFJPQ0VEVVJFJyxcbiAgJ0FMTCcsXG4gICdGRVRDSCcsXG4gICdQVUJMSUMnLFxuICAnQUxURVInLFxuICAnRklMRScsXG4gICdSQUlTRVJST1InLFxuICAnQU5EJyxcbiAgJ0ZJTExGQUNUT1InLFxuICAnUkVBRCcsXG4gICdBTlknLFxuICAnRk9SJyxcbiAgJ1JFQURURVhUJyxcbiAgJ0FTJyxcbiAgJ0ZPUkVJR04nLFxuICAnUkVDT05GSUdVUkUnLFxuICAnQVNDJyxcbiAgJ0ZSRUVURVhUJyxcbiAgJ1JFRkVSRU5DRVMnLFxuICAnQVVUSE9SSVpBVElPTicsXG4gICdGUkVFVEVYVFRBQkxFJyxcbiAgJ1JFUExJQ0FUSU9OJyxcbiAgJ0JBQ0tVUCcsXG4gICdGUk9NJyxcbiAgJ1JFU1RPUkUnLFxuICAnQkVHSU4nLFxuICAnRlVMTCcsXG4gICdSRVNUUklDVCcsXG4gICdCRVRXRUVOJyxcbiAgJ0ZVTkNUSU9OJyxcbiAgJ1JFVFVSTicsXG4gICdCUkVBSycsXG4gICdHT1RPJyxcbiAgJ1JFVkVSVCcsXG4gICdCUk9XU0UnLFxuICAnR1JBTlQnLFxuICAnUkVWT0tFJyxcbiAgJ0JVTEsnLFxuICAnR1JPVVAnLFxuICAnUklHSFQnLFxuICAnQlknLFxuICAnSEFWSU5HJyxcbiAgJ1JPTExCQUNLJyxcbiAgJ0NBU0NBREUnLFxuICAnSE9MRExPQ0snLFxuICAnUk9XQ09VTlQnLFxuICAnQ0FTRScsXG4gICdJREVOVElUWScsXG4gICdST1dHVUlEQ09MJyxcbiAgJ0NIRUNLJyxcbiAgJ0lERU5USVRZX0lOU0VSVCcsXG4gICdSVUxFJyxcbiAgJ0NIRUNLUE9JTlQnLFxuICAnSURFTlRJVFlDT0wnLFxuICAnU0FWRScsXG4gICdDTE9TRScsXG4gICdJRicsXG4gICdTQ0hFTUEnLFxuICAnQ0xVU1RFUkVEJyxcbiAgJ0lOJyxcbiAgJ1NFQ1VSSVRZQVVESVQnLFxuICAnQ09BTEVTQ0UnLFxuICAnSU5ERVgnLFxuICAnU0VMRUNUJyxcbiAgJ0NPTExBVEUnLFxuICAnSU5ORVInLFxuICAnU0VNQU5USUNLRVlQSFJBU0VUQUJMRScsXG4gICdDT0xVTU4nLFxuICAnSU5TRVJUJyxcbiAgJ1NFTUFOVElDU0lNSUxBUklUWURFVEFJTFNUQUJMRScsXG4gICdDT01NSVQnLFxuICAnSU5URVJTRUNUJyxcbiAgJ1NFTUFOVElDU0lNSUxBUklUWVRBQkxFJyxcbiAgJ0NPTVBVVEUnLFxuICAnSU5UTycsXG4gICdTRVNTSU9OX1VTRVInLFxuICAnQ09OU1RSQUlOVCcsXG4gICdJUycsXG4gICdTRVQnLFxuICAnQ09OVEFJTlMnLFxuICAnSk9JTicsXG4gICdTRVRVU0VSJyxcbiAgJ0NPTlRBSU5TVEFCTEUnLFxuICAnS0VZJyxcbiAgJ1NIVVRET1dOJyxcbiAgJ0NPTlRJTlVFJyxcbiAgJ0tJTEwnLFxuICAnU09NRScsXG4gICdDT05WRVJUJyxcbiAgJ0xFRlQnLFxuICAnU1RBVElTVElDUycsXG4gICdDUkVBVEUnLFxuICAnTElLRScsXG4gICdTWVNURU1fVVNFUicsXG4gICdDUk9TUycsXG4gICdMSU5FTk8nLFxuICAnVEFCTEUnLFxuICAnQ1VSUkVOVCcsXG4gICdMT0FEJyxcbiAgJ1RBQkxFU0FNUExFJyxcbiAgJ0NVUlJFTlRfREFURScsXG4gICdNRVJHRScsXG4gICdURVhUU0laRScsXG4gICdDVVJSRU5UX1RJTUUnLFxuICAnTkFUSU9OQUwnLFxuICAnVEhFTicsXG4gICdDVVJSRU5UX1RJTUVTVEFNUCcsXG4gICdOT0NIRUNLJyxcbiAgJ1RPJyxcbiAgJ0NVUlJFTlRfVVNFUicsXG4gICdOT05DTFVTVEVSRUQnLFxuICAnVE9QJyxcbiAgJ0NVUlNPUicsXG4gICdOT1QnLFxuICAnVFJBTicsXG4gICdEQVRBQkFTRScsXG4gICdOVUxMJyxcbiAgJ1RSQU5TQUNUSU9OJyxcbiAgJ0RCQ0MnLFxuICAnTlVMTElGJyxcbiAgJ1RSSUdHRVInLFxuICAnREVBTExPQ0FURScsXG4gICdPRicsXG4gICdUUlVOQ0FURScsXG4gICdERUNMQVJFJyxcbiAgJ09GRicsXG4gICdUUllfQ09OVkVSVCcsXG4gICdERUZBVUxUJyxcbiAgJ09GRlNFVFMnLFxuICAnVFNFUVVBTCcsXG4gICdERUxFVEUnLFxuICAnT04nLFxuICAnVU5JT04nLFxuICAnREVOWScsXG4gICdPUEVOJyxcbiAgJ1VOSVFVRScsXG4gICdERVNDJyxcbiAgJ09QRU5EQVRBU09VUkNFJyxcbiAgJ1VOUElWT1QnLFxuICAnRElTSycsXG4gICdPUEVOUVVFUlknLFxuICAnVVBEQVRFJyxcbiAgJ0RJU1RJTkNUJyxcbiAgJ09QRU5ST1dTRVQnLFxuICAnVVBEQVRFVEVYVCcsXG4gICdESVNUUklCVVRFRCcsXG4gICdPUEVOWE1MJyxcbiAgJ1VTRScsXG4gICdET1VCTEUnLFxuICAnT1BUSU9OJyxcbiAgJ1VTRVInLFxuICAnRFJPUCcsXG4gICdPUicsXG4gICdWQUxVRVMnLFxuICAnRFVNUCcsXG4gICdPUkRFUicsXG4gICdWQVJZSU5HJyxcbiAgJ0VMU0UnLFxuICAnT1VURVInLFxuICAnVklFVycsXG4gICdFTkQnLFxuICAnT1ZFUicsXG4gICdXQUlURk9SJyxcbiAgJ0VSUkxWTCcsXG4gICdQRVJDRU5UJyxcbiAgJ1dIRU4nLFxuICAnRVNDQVBFJyxcbiAgJ1BJVk9UJyxcbiAgJ1dIRVJFJyxcbiAgJ0VYQ0VQVCcsXG4gICdQTEFOJyxcbiAgJ1dISUxFJyxcbiAgJ0VYRUMnLFxuICAnUFJFQ0lTSU9OJyxcbiAgJ1dJVEgnLFxuICAnRVhFQ1VURScsXG4gICdQUklNQVJZJyxcbiAgJ1dJVEhJTiBHUk9VUCcsXG4gICdFWElTVFMnLFxuICAnUFJJTlQnLFxuICAnV1JJVEVURVhUJyxcbiAgJ0VYSVQnLFxuICAnUFJPQycsXG5dO1xuXG5jb25zdCByZXNlcnZlZFRvcExldmVsV29yZHMgPSBbXG4gICdBREQnLFxuICAnQUxURVIgQ09MVU1OJyxcbiAgJ0FMVEVSIFRBQkxFJyxcbiAgJ0NBU0UnLFxuICAnREVMRVRFIEZST00nLFxuICAnRU5EJyxcbiAgJ0VYQ0VQVCcsXG4gICdGUk9NJyxcbiAgJ0dST1VQIEJZJyxcbiAgJ0hBVklORycsXG4gICdJTlNFUlQgSU5UTycsXG4gICdJTlNFUlQnLFxuICAnTElNSVQnLFxuICAnT1JERVIgQlknLFxuICAnU0VMRUNUJyxcbiAgJ1NFVCBDVVJSRU5UIFNDSEVNQScsXG4gICdTRVQgU0NIRU1BJyxcbiAgJ1NFVCcsXG4gICdVUERBVEUnLFxuICAnVkFMVUVTJyxcbiAgJ1dIRVJFJyxcbl07XG5cbmNvbnN0IHJlc2VydmVkVG9wTGV2ZWxXb3Jkc05vSW5kZW50ID0gWydJTlRFUlNFQ1QnLCAnSU5URVJTRUNUIEFMTCcsICdNSU5VUycsICdVTklPTicsICdVTklPTiBBTEwnXTtcblxuY29uc3QgcmVzZXJ2ZWROZXdsaW5lV29yZHMgPSBbXG4gICdBTkQnLFxuICAnRUxTRScsXG4gICdPUicsXG4gICdXSEVOJyxcbiAgLy8gam9pbnNcbiAgJ0pPSU4nLFxuICAnSU5ORVIgSk9JTicsXG4gICdMRUZUIEpPSU4nLFxuICAnTEVGVCBPVVRFUiBKT0lOJyxcbiAgJ1JJR0hUIEpPSU4nLFxuICAnUklHSFQgT1VURVIgSk9JTicsXG4gICdGVUxMIEpPSU4nLFxuICAnRlVMTCBPVVRFUiBKT0lOJyxcbiAgJ0NST1NTIEpPSU4nLFxuXTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVFNxbEZvcm1hdHRlciBleHRlbmRzIEZvcm1hdHRlciB7XG4gIHRva2VuaXplcigpIHtcbiAgICByZXR1cm4gbmV3IFRva2VuaXplcih7XG4gICAgICByZXNlcnZlZFdvcmRzLFxuICAgICAgcmVzZXJ2ZWRUb3BMZXZlbFdvcmRzLFxuICAgICAgcmVzZXJ2ZWROZXdsaW5lV29yZHMsXG4gICAgICByZXNlcnZlZFRvcExldmVsV29yZHNOb0luZGVudCxcbiAgICAgIHN0cmluZ1R5cGVzOiBbYFwiXCJgLCBcIk4nJ1wiLCBcIicnXCIsICdbXSddLFxuICAgICAgb3BlblBhcmVuczogWycoJywgJ0NBU0UnXSxcbiAgICAgIGNsb3NlUGFyZW5zOiBbJyknLCAnRU5EJ10sXG4gICAgICBpbmRleGVkUGxhY2Vob2xkZXJUeXBlczogW10sXG4gICAgICBuYW1lZFBsYWNlaG9sZGVyVHlwZXM6IFsnQCddLFxuICAgICAgbGluZUNvbW1lbnRUeXBlczogWyctLSddLFxuICAgICAgc3BlY2lhbFdvcmRDaGFyczogWycjJywgJ0AnXSxcbiAgICAgIG9wZXJhdG9yczogW1xuICAgICAgICAnPj0nLFxuICAgICAgICAnPD0nLFxuICAgICAgICAnPD4nLFxuICAgICAgICAnIT0nLFxuICAgICAgICAnITwnLFxuICAgICAgICAnIT4nLFxuICAgICAgICAnKz0nLFxuICAgICAgICAnLT0nLFxuICAgICAgICAnKj0nLFxuICAgICAgICAnLz0nLFxuICAgICAgICAnJT0nLFxuICAgICAgICAnfD0nLFxuICAgICAgICAnJj0nLFxuICAgICAgICAnXj0nLFxuICAgICAgICAnOjonLFxuICAgICAgXSxcbiAgICAgIC8vIFRPRE86IFN1cHBvcnQgZm9yIG1vbmV5IGNvbnN0YW50c1xuICAgIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgRGIyRm9ybWF0dGVyIGZyb20gJy4vbGFuZ3VhZ2VzL0RiMkZvcm1hdHRlcic7XG5pbXBvcnQgTWFyaWFEYkZvcm1hdHRlciBmcm9tICcuL2xhbmd1YWdlcy9NYXJpYURiRm9ybWF0dGVyJztcbmltcG9ydCBNeVNxbEZvcm1hdHRlciBmcm9tICcuL2xhbmd1YWdlcy9NeVNxbEZvcm1hdHRlcic7XG5pbXBvcnQgTjFxbEZvcm1hdHRlciBmcm9tICcuL2xhbmd1YWdlcy9OMXFsRm9ybWF0dGVyJztcbmltcG9ydCBQbFNxbEZvcm1hdHRlciBmcm9tICcuL2xhbmd1YWdlcy9QbFNxbEZvcm1hdHRlcic7XG5pbXBvcnQgUG9zdGdyZVNxbEZvcm1hdHRlciBmcm9tICcuL2xhbmd1YWdlcy9Qb3N0Z3JlU3FsRm9ybWF0dGVyJztcbmltcG9ydCBSZWRzaGlmdEZvcm1hdHRlciBmcm9tICcuL2xhbmd1YWdlcy9SZWRzaGlmdEZvcm1hdHRlcic7XG5pbXBvcnQgU3BhcmtTcWxGb3JtYXR0ZXIgZnJvbSAnLi9sYW5ndWFnZXMvU3BhcmtTcWxGb3JtYXR0ZXInO1xuaW1wb3J0IFN0YW5kYXJkU3FsRm9ybWF0dGVyIGZyb20gJy4vbGFuZ3VhZ2VzL1N0YW5kYXJkU3FsRm9ybWF0dGVyJztcbmltcG9ydCBUU3FsRm9ybWF0dGVyIGZyb20gJy4vbGFuZ3VhZ2VzL1RTcWxGb3JtYXR0ZXInO1xuXG5jb25zdCBmb3JtYXR0ZXJzID0ge1xuICBkYjI6IERiMkZvcm1hdHRlcixcbiAgbWFyaWFkYjogTWFyaWFEYkZvcm1hdHRlcixcbiAgbXlzcWw6IE15U3FsRm9ybWF0dGVyLFxuICBuMXFsOiBOMXFsRm9ybWF0dGVyLFxuICBwbHNxbDogUGxTcWxGb3JtYXR0ZXIsXG4gIHBvc3RncmVzcWw6IFBvc3RncmVTcWxGb3JtYXR0ZXIsXG4gIHJlZHNoaWZ0OiBSZWRzaGlmdEZvcm1hdHRlcixcbiAgc3Bhcms6IFNwYXJrU3FsRm9ybWF0dGVyLFxuICBzcWw6IFN0YW5kYXJkU3FsRm9ybWF0dGVyLFxuICB0c3FsOiBUU3FsRm9ybWF0dGVyLFxufTtcblxuLyoqXG4gKiBGb3JtYXQgd2hpdGVzcGFjZSBpbiBhIHF1ZXJ5IHRvIG1ha2UgaXQgZWFzaWVyIHRvIHJlYWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHF1ZXJ5XG4gKiBAcGFyYW0ge09iamVjdH0gY2ZnXG4gKiAgQHBhcmFtIHtTdHJpbmd9IGNmZy5sYW5ndWFnZSBRdWVyeSBsYW5ndWFnZSwgZGVmYXVsdCBpcyBTdGFuZGFyZCBTUUxcbiAqICBAcGFyYW0ge1N0cmluZ30gY2ZnLmluZGVudCBDaGFyYWN0ZXJzIHVzZWQgZm9yIGluZGVudGF0aW9uLCBkZWZhdWx0IGlzIFwiICBcIiAoMiBzcGFjZXMpXG4gKiAgQHBhcmFtIHtCb29sZWFufSBjZmcudXBwZXJjYXNlIENvbnZlcnRzIGtleXdvcmRzIHRvIHVwcGVyY2FzZVxuICogIEBwYXJhbSB7SW50ZWdlcn0gY2ZnLmxpbmVzQmV0d2VlblF1ZXJpZXMgSG93IG1hbnkgbGluZSBicmVha3MgYmV0d2VlbiBxdWVyaWVzXG4gKiAgQHBhcmFtIHtPYmplY3R9IGNmZy5wYXJhbXMgQ29sbGVjdGlvbiBvZiBwYXJhbXMgZm9yIHBsYWNlaG9sZGVyIHJlcGxhY2VtZW50XG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBmb3JtYXQgPSAocXVlcnksIGNmZyA9IHt9KSA9PiB7XG4gIGlmICh0eXBlb2YgcXVlcnkgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHF1ZXJ5IGFyZ3VtZW50LiBFeHRlY3RlZCBzdHJpbmcsIGluc3RlYWQgZ290ICcgKyB0eXBlb2YgcXVlcnkpO1xuICB9XG5cbiAgbGV0IEZvcm1hdHRlciA9IFN0YW5kYXJkU3FsRm9ybWF0dGVyO1xuICBpZiAoY2ZnLmxhbmd1YWdlICE9PSB1bmRlZmluZWQpIHtcbiAgICBGb3JtYXR0ZXIgPSBmb3JtYXR0ZXJzW2NmZy5sYW5ndWFnZV07XG4gIH1cbiAgaWYgKEZvcm1hdHRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgRXJyb3IoYFVuc3VwcG9ydGVkIFNRTCBkaWFsZWN0OiAke2NmZy5sYW5ndWFnZX1gKTtcbiAgfVxuICByZXR1cm4gbmV3IEZvcm1hdHRlcihjZmcpLmZvcm1hdChxdWVyeSk7XG59O1xuXG5leHBvcnQgY29uc3Qgc3VwcG9ydGVkRGlhbGVjdHMgPSBPYmplY3Qua2V5cyhmb3JtYXR0ZXJzKTtcbiIsIi8vIE9ubHkgcmVtb3ZlcyBzcGFjZXMsIG5vdCBuZXdsaW5lc1xuZXhwb3J0IGNvbnN0IHRyaW1TcGFjZXNFbmQgPSAoc3RyKSA9PiBzdHIucmVwbGFjZSgvWyBcXHRdKyQvdSwgJycpO1xuXG4vLyBMYXN0IGVsZW1lbnQgZnJvbSBhcnJheVxuZXhwb3J0IGNvbnN0IGxhc3QgPSAoYXJyKSA9PiBhcnJbYXJyLmxlbmd0aCAtIDFdO1xuXG4vLyBUcnVlIGFycmF5IGlzIGVtcHR5LCBvciBpdCdzIG5vdCBhbiBhcnJheSBhdCBhbGxcbmV4cG9ydCBjb25zdCBpc0VtcHR5ID0gKGFycikgPT4gIUFycmF5LmlzQXJyYXkoYXJyKSB8fCBhcnIubGVuZ3RoID09PSAwO1xuXG4vLyBFc2NhcGVzIHJlZ2V4IHNwZWNpYWwgY2hhcnNcbmV4cG9ydCBjb25zdCBlc2NhcGVSZWdFeHAgPSAoc3RyaW5nKSA9PiBzdHJpbmcucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2d1LCAnXFxcXCQmJyk7XG5cbi8vIFNvcnRzIHN0cmluZ3MgYnkgbGVuZ3RoLCBzbyB0aGF0IGxvbmdlciBvbmVzIGFyZSBmaXJzdFxuLy8gQWxzbyBzb3J0cyBhbHBoYWJldGljYWxseSBhZnRlciBzb3J0aW5nIGJ5IGxlbmd0aC5cbmV4cG9ydCBjb25zdCBzb3J0QnlMZW5ndGhEZXNjID0gKHN0cmluZ3MpID0+XG4gIHN0cmluZ3Muc29ydCgoYSwgYikgPT4ge1xuICAgIHJldHVybiBiLmxlbmd0aCAtIGEubGVuZ3RoIHx8IGEubG9jYWxlQ29tcGFyZShiKTtcbiAgfSk7XG4iXSwic291cmNlUm9vdCI6IiJ9