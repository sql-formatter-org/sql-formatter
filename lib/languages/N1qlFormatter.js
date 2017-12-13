"use strict";

exports.__esModule = true;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _Formatter = require("../core/Formatter");

var _Formatter2 = _interopRequireDefault(_Formatter);

var _Tokenizer = require("../core/Tokenizer");

var _Tokenizer2 = _interopRequireDefault(_Tokenizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var reservedWords = ["ALL", "ALTER", "ANALYZE", "AND", "ANY", "ARRAY", "AS", "ASC", "BEGIN", "BETWEEN", "BINARY", "BOOLEAN", "BREAK", "BUCKET", "BUILD", "BY", "CALL", "CASE", "CAST", "CLUSTER", "COLLATE", "COLLECTION", "COMMIT", "CONNECT", "CONTINUE", "CORRELATE", "COVER", "CREATE", "DATABASE", "DATASET", "DATASTORE", "DECLARE", "DECREMENT", "DELETE", "DERIVED", "DESC", "DESCRIBE", "DISTINCT", "DO", "DROP", "EACH", "ELEMENT", "ELSE", "END", "EVERY", "EXCEPT", "EXCLUDE", "EXECUTE", "EXISTS", "EXPLAIN", "FALSE", "FETCH", "FIRST", "FLATTEN", "FOR", "FORCE", "FROM", "FUNCTION", "GRANT", "GROUP", "GSI", "HAVING", "IF", "IGNORE", "ILIKE", "IN", "INCLUDE", "INCREMENT", "INDEX", "INFER", "INLINE", "INNER", "INSERT", "INTERSECT", "INTO", "IS", "JOIN", "KEY", "KEYS", "KEYSPACE", "KNOWN", "LAST", "LEFT", "LET", "LETTING", "LIKE", "LIMIT", "LSM", "MAP", "MAPPING", "MATCHED", "MATERIALIZED", "MERGE", "MINUS", "MISSING", "NAMESPACE", "NEST", "NOT", "NULL", "NUMBER", "OBJECT", "OFFSET", "ON", "OPTION", "OR", "ORDER", "OUTER", "OVER", "PARSE", "PARTITION", "PASSWORD", "PATH", "POOL", "PREPARE", "PRIMARY", "PRIVATE", "PRIVILEGE", "PROCEDURE", "PUBLIC", "RAW", "REALM", "REDUCE", "RENAME", "RETURN", "RETURNING", "REVOKE", "RIGHT", "ROLE", "ROLLBACK", "SATISFIES", "SCHEMA", "SELECT", "SELF", "SEMI", "SET", "SHOW", "SOME", "START", "STATISTICS", "STRING", "SYSTEM", "THEN", "TO", "TRANSACTION", "TRIGGER", "TRUE", "TRUNCATE", "UNDER", "UNION", "UNIQUE", "UNKNOWN", "UNNEST", "UNSET", "UPDATE", "UPSERT", "USE", "USER", "USING", "VALIDATE", "VALUE", "VALUED", "VALUES", "VIA", "VIEW", "WHEN", "WHERE", "WHILE", "WITH", "WITHIN", "WORK", "XOR"];

var reservedToplevelWords = ["DELETE FROM", "EXCEPT ALL", "EXCEPT", "EXPLAIN DELETE FROM", "EXPLAIN UPDATE", "EXPLAIN UPSERT", "FROM", "GROUP BY", "HAVING", "INFER", "INSERT INTO", "INTERSECT ALL", "INTERSECT", "LET", "LIMIT", "MERGE", "NEST", "ORDER BY", "PREPARE", "SELECT", "SET CURRENT SCHEMA", "SET SCHEMA", "SET", "UNION ALL", "UNION", "UNNEST", "UPDATE", "UPSERT", "USE KEYS", "VALUES", "WHERE"];

var reservedNewlineWords = ["AND", "INNER JOIN", "JOIN", "LEFT JOIN", "LEFT OUTER JOIN", "OR", "OUTER JOIN", "RIGHT JOIN", "RIGHT OUTER JOIN", "XOR"];

var tokenizer = void 0;

var N1qlFormatter = function () {
    /**
     * @param {Object} cfg Different set of configurations
     */
    function N1qlFormatter(cfg) {
        (0, _classCallCheck3["default"])(this, N1qlFormatter);

        this.cfg = cfg;
    }

    /**
     * Format the whitespace in a N1QL string to make it easier to read
     *
     * @param {String} query The N1QL string
     * @return {String} formatted string
     */


    N1qlFormatter.prototype.format = function format(query) {
        if (!tokenizer) {
            tokenizer = new _Tokenizer2["default"]({
                reservedWords: reservedWords,
                reservedToplevelWords: reservedToplevelWords,
                reservedNewlineWords: reservedNewlineWords,
                stringTypes: ["\"\"", "''", "``"],
                openParens: ["(", "[", "{"],
                closeParens: [")", "]", "}"],
                namedPlaceholderTypes: ["$"],
                lineCommentTypes: ["#", "--"]
            });
        }
        return new _Formatter2["default"](this.cfg, tokenizer).format(query);
    };

    return N1qlFormatter;
}();

exports["default"] = N1qlFormatter;
module.exports = exports["default"];