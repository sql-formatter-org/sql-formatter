"use strict";

exports.__esModule = true;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _tokenTypes = require("./tokenTypes");

var _tokenTypes2 = _interopRequireDefault(_tokenTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var INLINE_MAX_LENGTH = 50;

/**
 * Bookkeeper for inline blocks.
 *
 * Inline blocks are parenthized expressions that are shorter than INLINE_MAX_LENGTH.
 * These blocks are formatted on a single line, unlike longer parenthized
 * expressions where open-parenthesis causes newline and increase of indentation.
 */

var InlineBlock = function () {
    function InlineBlock() {
        (0, _classCallCheck3["default"])(this, InlineBlock);

        this.level = 0;
    }

    /**
     * Begins inline block when lookahead through upcoming tokens determines
     * that the block would be smaller than INLINE_MAX_LENGTH.
     * @param  {Object[]} tokens Array of all tokens
     * @param  {Number} index Current token position
     */


    InlineBlock.prototype.beginIfPossible = function beginIfPossible(tokens, index) {
        if (this.level === 0 && this.isInlineBlock(tokens, index)) {
            this.level = 1;
        } else if (this.level > 0) {
            this.level++;
        } else {
            this.level = 0;
        }
    };

    /**
     * Finishes current inline block.
     * There might be several nested ones.
     */


    InlineBlock.prototype.end = function end() {
        this.level--;
    };

    /**
     * True when inside an inline block
     * @return {Boolean}
     */


    InlineBlock.prototype.isActive = function isActive() {
        return this.level > 0;
    };

    // Check if this should be an inline parentheses block
    // Examples are "NOW()", "COUNT(*)", "int(10)", key(`somecolumn`), DECIMAL(7,2)


    InlineBlock.prototype.isInlineBlock = function isInlineBlock(tokens, index) {
        var length = 0;
        var level = 0;

        for (var i = index; i < tokens.length; i++) {
            var token = tokens[i];
            length += token.value.length;

            // Overran max length
            if (length > INLINE_MAX_LENGTH) {
                return false;
            }

            if (token.type === _tokenTypes2["default"].OPEN_PAREN) {
                level++;
            } else if (token.type === _tokenTypes2["default"].CLOSE_PAREN) {
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
    };

    // Reserved words that cause newlines, comments and semicolons
    // are not allowed inside inline parentheses block


    InlineBlock.prototype.isForbiddenToken = function isForbiddenToken(_ref) {
        var type = _ref.type,
            value = _ref.value;

        return type === _tokenTypes2["default"].RESERVED_TOPLEVEL || type === _tokenTypes2["default"].RESERVED_NEWLINE || type === _tokenTypes2["default"].COMMENT || type === _tokenTypes2["default"].BLOCK_COMMENT || value === ";";
    };

    return InlineBlock;
}();

exports["default"] = InlineBlock;
module.exports = exports["default"];