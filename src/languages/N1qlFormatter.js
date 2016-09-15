import Formatter from "../core/Formatter";
import Tokenizer from "../core/Tokenizer";

const reservedWords = [
    "ALL", "ALTER", "ANALYZE", "AND", "ANY", "ARRAY", "AS", "ASC", "BEGIN", "BETWEEN", "BINARY", "BOOLEAN", "BREAK", "BUCKET",
    "BUILD", "BY", "CALL", "CASE", "CAST", "CLUSTER", "COLLATE", "COLLECTION", "COMMIT", "CONNECT", "CONTINUE", "CORRELATE",
    "COVER", "CREATE", "DATABASE", "DATASET", "DATASTORE", "DECLARE", "DECREMENT", "DELETE", "DERIVED", "DESC", "DESCRIBE",
    "DISTINCT", "DO", "DROP", "EACH", "ELEMENT", "ELSE", "END", "EVERY", "EXCEPT", "EXCLUDE", "EXECUTE",
    "EXISTS", "EXPLAIN", "FALSE", "FETCH", "FIRST", "FLATTEN", "FOR", "FORCE", "FROM", "FUNCTION", "GRANT", "GROUP", "GSI", "HAVING", "IF",
    "IGNORE", "ILIKE", "IN", "INCLUDE", "INCREMENT", "INDEX", "INFER", "INLINE", "INNER", "INSERT", "INTERSECT", "INTO", "IS",
    "JOIN", "KEY", "KEYS", "KEYSPACE", "KNOWN", "LAST", "LEFT", "LET", "LETTING", "LIKE", "LIMIT", "LSM", "MAP", "MAPPING", "MATCHED",
    "MATERIALIZED", "MERGE", "MINUS", "MISSING", "NAMESPACE", "NEST", "NOT", "NULL", "NUMBER",
    "OBJECT", "OFFSET", "ON", "OPTION", "OR", "ORDER", "OUTER", "OVER", "PARSE", "PARTITION", "PASSWORD", "PATH", "POOL",
    "PREPARE", "PRIMARY", "PRIVATE", "PRIVILEGE", "PROCEDURE", "PUBLIC", "RAW", "REALM",
    "REDUCE", "RENAME", "RETURN", "RETURNING", "REVOKE", "RIGHT", "ROLE", "ROLLBACK", "SATISFIES", "SCHEMA",
    "SELECT", "SELF", "SEMI", "SET", "SHOW", "SOME", "START", "STATISTICS", "STRING", "SYSTEM", "THEN", "TO", "TRANSACTION", "TRIGGER",
    "TRUE", "TRUNCATE", "UNDER", "UNION", "UNIQUE", "UNKNOWN", "UNNEST", "UNSET", "UPDATE", "UPSERT", "USE", "USER", "USING", "VALIDATE",
    "VALUE", "VALUED", "VALUES", "VIA", "VIEW", "WHEN", "WHERE", "WHILE", "WITH", "WITHIN", "WORK", "XOR"
];

const reservedToplevelWords = [
    "SELECT", "FROM", "WHERE", "SET", "ORDER BY", "GROUP BY", "LIMIT", "DROP", "VALUES", "EXPLAIN UPDATE", "UPDATE",
    "HAVING", "EXPLAIN DELETE FROM", "DELETE FROM", "UNION ALL", "UNION", "EXCEPT ALL", "EXCEPT", "INTERSECT ALL", "INTERSECT",
    "INFER", "EXPLAIN UPSERT", "UPSERT", "MERGE", "PREPARE", "LET", "USE KEYS", "UNNEST", "NEST"
];

const reservedNewlineWords = [
    "LEFT OUTER JOIN", "RIGHT OUTER JOIN", "LEFT JOIN", "RIGHT JOIN", "OUTER JOIN", "INNER JOIN", "JOIN", "XOR", "OR", "AND"
];

let tokenizer;

export default class N1qlFormatter {
    /**
     * @param {Object} cfg Different set of configurations
     */
    constructor(cfg) {
        this.cfg = cfg;
    }

    /**
     * Format the whitespace in a N1QL string to make it easier to read
     *
     * @param {String} query The N1QL string
     * @return {String} formatted string
     */
    format(query) {
        if (!tokenizer) {
            tokenizer = new Tokenizer({
                reservedWords,
                reservedToplevelWords,
                reservedNewlineWords,
                stringTypes: [`""`, "''", "``"],
                openParens: ["(", "[", "{"],
                closeParens: [")", "]", "}"],
                variableTypes: [],
            });
        }
        return new Formatter(this.cfg, tokenizer).format(query);
    }
}
