"use strict";

exports.__esModule = true;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Handles placeholder replacement with given params.
 */
var Params = function () {
    /**
     * @param {Object} params
     */
    function Params(params) {
        (0, _classCallCheck3["default"])(this, Params);

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