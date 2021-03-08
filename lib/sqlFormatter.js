"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.supportedDialects = exports.format = void 0;

var _Db2Formatter = _interopRequireDefault(require("./languages/Db2Formatter"));

var _MariaDbFormatter = _interopRequireDefault(require("./languages/MariaDbFormatter"));

var _MySqlFormatter = _interopRequireDefault(require("./languages/MySqlFormatter"));

var _N1qlFormatter = _interopRequireDefault(require("./languages/N1qlFormatter"));

var _PlSqlFormatter = _interopRequireDefault(require("./languages/PlSqlFormatter"));

var _PostgreSqlFormatter = _interopRequireDefault(require("./languages/PostgreSqlFormatter"));

var _RedshiftFormatter = _interopRequireDefault(require("./languages/RedshiftFormatter"));

var _SparkSqlFormatter = _interopRequireDefault(require("./languages/SparkSqlFormatter"));

var _StandardSqlFormatter = _interopRequireDefault(require("./languages/StandardSqlFormatter"));

var _TSqlFormatter = _interopRequireDefault(require("./languages/TSqlFormatter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var formatters = {
  db2: _Db2Formatter["default"],
  mariadb: _MariaDbFormatter["default"],
  mysql: _MySqlFormatter["default"],
  n1ql: _N1qlFormatter["default"],
  plsql: _PlSqlFormatter["default"],
  postgresql: _PostgreSqlFormatter["default"],
  redshift: _RedshiftFormatter["default"],
  spark: _SparkSqlFormatter["default"],
  sql: _StandardSqlFormatter["default"],
  tsql: _TSqlFormatter["default"]
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

  var Formatter = _StandardSqlFormatter["default"];

  if (cfg.language !== undefined) {
    Formatter = formatters[cfg.language];
  }

  if (Formatter === undefined) {
    throw Error("Unsupported SQL dialect: ".concat(cfg.language));
  }

  return new Formatter(cfg).format(query);
};

exports.format = format;
var supportedDialects = Object.keys(formatters);
exports.supportedDialects = supportedDialects;