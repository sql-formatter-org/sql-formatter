"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isEnd = exports.isWindow = exports.isBy = exports.isSet = exports.isLimit = exports.isBetween = exports.isAnd = void 0;

var _tokenTypes = _interopRequireDefault(require("./tokenTypes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var isToken = function isToken(type, regex) {
  return function (token) {
    return (token === null || token === void 0 ? void 0 : token.type) === type && regex.test(token === null || token === void 0 ? void 0 : token.value);
  };
};

var isAnd = isToken(_tokenTypes["default"].RESERVED_NEWLINE, /^AND$/i);
exports.isAnd = isAnd;
var isBetween = isToken(_tokenTypes["default"].RESERVED, /^BETWEEN$/i);
exports.isBetween = isBetween;
var isLimit = isToken(_tokenTypes["default"].RESERVED_TOP_LEVEL, /^LIMIT$/i);
exports.isLimit = isLimit;
var isSet = isToken(_tokenTypes["default"].RESERVED_TOP_LEVEL, /^[S\u017F]ET$/i);
exports.isSet = isSet;
var isBy = isToken(_tokenTypes["default"].RESERVED, /^BY$/i);
exports.isBy = isBy;
var isWindow = isToken(_tokenTypes["default"].RESERVED_TOP_LEVEL, /^WINDOW$/i);
exports.isWindow = isWindow;
var isEnd = isToken(_tokenTypes["default"].CLOSE_PAREN, /^END$/i);
exports.isEnd = isEnd;