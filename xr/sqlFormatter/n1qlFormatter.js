import SqlFormatter from "xr/sqlFormatter/SqlFormatter";
import SqlTokenizer from "xr/sqlFormatter/SqlTokenizer";

// Reserved words
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

// Words that are set to separate new line
const reservedToplevelWords = [
    "SELECT", "FROM", "WHERE", "SET", "ORDER BY", "GROUP BY", "LIMIT", "DROP", "VALUES", "EXPLAIN UPDATE", "UPDATE",
    "HAVING", "EXPLAIN DELETE FROM", "DELETE FROM", "UNION ALL", "UNION", "EXCEPT ALL", "EXCEPT", "INTERSECT ALL", "INTERSECT",
    "INFER", "EXPLAIN UPSERT", "UPSERT", "MERGE", "PREPARE", "LET", "USE KEYS", "UNNEST", "NEST"
];

// Words that are set to newline
const reservedNewlineWords = [
    "LEFT OUTER JOIN", "RIGHT OUTER JOIN", "LEFT JOIN", "RIGHT JOIN", "OUTER JOIN", "INNER JOIN", "JOIN", "XOR", "OR", "AND"
];

// Words that are uppercased as function names
const functionWords = [
    "ARRAY_AGG", "ARRAY_APPEND", "ARRAY_CONCAT", "ARRAY_CONTAINS", "ARRAY_COUNT", "ARRAY_DISTINCT", "ARRAY_IFNULL", "ARRAY_LENGTH",
    "ARRAY_MAX", "ARRAY_MIN", "ARRAY_POSITION", "ARRAY_PREPEND", "ARRAY_PUT", "ARRAY_RANGE", "ARRAY_REMOVE", "ARRAY_REPEAT",
    "ARRAY_REPLACE", "ARRAY_REVERSE", "ARRAY_SORT", "ARRAY_SUM", "AVG", "COUNT", "MAX", "MIN", "SUM", "GREATEST",
    "LEAST", "IFMISSING", "IFMISSINGORNULL", "IFNULL", "MISSINGIF", "NULLIF", "IFINF", "IFNAN", "IFNANORINF", "NANINF", "NEGINFIF",
    "POSINFIF", "CLOCK_MILLIS", "CLOCK_STR", "DATE_ADD_MILLIS", "DATE_ADD_STR", "DATE_DIFF_MILLIS", "DATE_DIFF_STR",
    "DATE_PART_MILLIS", "DATE_PART_STR", "DATE_TRUNC_MILLIS", "DATE_TRUNC_STR", "DURATION_TO_STR", "MILLIS", "STR_TO_MILLIS",
    "MILLIS_TO_STR", "MILLIS_TO_UTC", "MILLIS_TO_ZONE_NAME", "NOW_MILLIS", "NOW_STR", "STR_TO_DURATION", "STR_TO_UTC", "STR_TO_ZONE_NAME",
    "DECODE_JSON", "ENCODE_JSON", "ENCODED_SIZE", "POLY_LENGTH", "BASE64", "BASE64_ENCODE", "BASE64_DECODE", "META",
    "UUID", "ABS", "ACOS", "ASIN", "ATAN", "ATAN2", "CEIL", "COS", "DEGREES", "E",
    "EXP", "LN", "LOG", "FLOOR", "PI", "POWER", "RADIANS", "RANDOM", "ROUND", "SIGN", "SIN", "SQRT", "TAN", "TRUNC",
    "OBJECT_LENGTH", "OBJECT_NAMES", "OBJECT_PAIRS", "OBJECT_INNER_PAIRS", "OBJECT_VALUES", "OBJECT_INNER_VALUES", "OBJECT_ADD",
    "OBJECT_PUT", "OBJECT_REMOVE", "OBJECT_UNWRAP", "REGEXP_CONTAINS", "REGEXP_LIKE", "REGEXP_POSITION", "REGEXP_REPLACE",
    "CONTAINS", "INITCAP", "LENGTH", "LOWER", "LTRIM", "POSITION", "REPEAT", "REPLACE", "RTRIM", "SPLIT", "SUBSTR", "TITLE",
    "TRIM", "UPPER", "ISARRAY", "ISATOM", "ISBOOLEAN", "ISNUMBER", "ISOBJECT", "ISSTRING", "TYPE",
    "TOARRAY", "TOATOM", "TOBOOLEAN", "TONUMBER", "TOOBJECT", "TOSTRING"
];

export default {
    /**
     * Format the whitespace in a N1QL string to make it easier to read
     *
     * @param {String} query The N1QL string
     * @return {String} formatted string
     */
    format: (query) => {
        return new SqlFormatter(new SqlTokenizer({
            reservedWords,
            reservedToplevelWords,
            reservedNewlineWords,
            functionWords
        })).format(query);
    }
};
