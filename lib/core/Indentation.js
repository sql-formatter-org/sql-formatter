"use strict";

exports.__esModule = true;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _repeat = require("lodash/repeat");

var _repeat2 = _interopRequireDefault(_repeat);

var _last = require("lodash/last");

var _last2 = _interopRequireDefault(_last);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var INDENT_TYPE_TOP_LEVEL = "top-level";
var INDENT_TYPE_BLOCK_LEVEL = "block-level";

/**
 * Manages indentation levels.
 *
 * There are two types of indentation levels:
 *
 * - BLOCK_LEVEL : increased by open-parenthesis
 * - TOP_LEVEL : increased by RESERVED_TOPLEVEL words
 */

var Indentation = function () {
    /**
     * @param {String} indent Indent value, default is "  " (2 spaces)
     */
    function Indentation(indent) {
        (0, _classCallCheck3["default"])(this, Indentation);

        this.indent = indent || "  ";
        this.indentTypes = [];
    }

    /**
     * Returns current indentation string.
     * @return {String}
     */


    Indentation.prototype.getIndent = function getIndent() {
        return (0, _repeat2["default"])(this.indent, this.indentTypes.length);
    };

    /**
     * Increases indentation by one top-level indent.
     */


    Indentation.prototype.increaseToplevel = function increaseToplevel() {
        this.indentTypes.push(INDENT_TYPE_TOP_LEVEL);
    };

    /**
     * Increases indentation by one block-level indent.
     */


    Indentation.prototype.increaseBlockLevel = function increaseBlockLevel() {
        this.indentTypes.push(INDENT_TYPE_BLOCK_LEVEL);
    };

    /**
     * Decreases indentation by one top-level indent.
     * Does nothing when the previous indent is not top-level.
     */


    Indentation.prototype.decreaseTopLevel = function decreaseTopLevel() {
        if ((0, _last2["default"])(this.indentTypes) === INDENT_TYPE_TOP_LEVEL) {
            this.indentTypes.pop();
        }
    };

    /**
     * Decreases indentation by one block-level indent.
     * If there are top-level indents within the block-level indent,
     * throws away these as well.
     */


    Indentation.prototype.decreaseBlockLevel = function decreaseBlockLevel() {
        while (this.indentTypes.length > 0) {
            var type = this.indentTypes.pop();
            if (type !== INDENT_TYPE_TOP_LEVEL) {
                break;
            }
        }
    };

    return Indentation;
}();

exports["default"] = Indentation;
module.exports = exports["default"];