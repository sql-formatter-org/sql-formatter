import Formatter from "../core/Formatter";
import Tokenizer from "../core/Tokenizer";

// Reserved words
const reservedWords = [
    "ACCESSIBLE", "ACTION", "AGAINST", "AGGREGATE", "ALGORITHM", "ALL", "ALTER", "ANALYSE", "ANALYZE", "AS", "ASC",
    "AUTOCOMMIT", "AUTO_INCREMENT", "BACKUP", "BEGIN", "BETWEEN", "BINLOG", "BOTH", "CASCADE", "CASE", "CHANGE", "CHANGED", "CHARACTER SET",
    "CHARSET", "CHECK", "CHECKSUM", "COLLATE", "COLLATION", "COLUMN", "COLUMNS", "COMMENT", "COMMIT", "COMMITTED",
    "COMPRESSED", "CONCURRENT",
    "CONSTRAINT", "CONTAINS", "CONVERT", "CREATE", "CROSS", "CURRENT_TIMESTAMP", "DATABASE", "DATABASES", "DAY", "DAY_HOUR", "DAY_MINUTE",
    "DAY_SECOND", "DEFAULT", "DEFINER", "DELAYED", "DELETE", "DESC", "DESCRIBE", "DETERMINISTIC", "DISTINCT", "DISTINCTROW", "DIV",
    "DO", "DUMPFILE", "DUPLICATE", "DYNAMIC", "ELSE", "ENCLOSED", "END", "ENGINE", "ENGINE_TYPE", "ENGINES", "ESCAPE",
    "ESCAPED", "EVENTS", "EXEC",
    "EXECUTE", "EXISTS", "EXPLAIN", "EXTENDED", "FAST", "FIELDS", "FILE", "FIRST", "FIXED", "FLUSH", "FOR", "FORCE",
    "FOREIGN", "FULL", "FULLTEXT",
    "FUNCTION", "GLOBAL", "GRANT", "GRANTS", "GROUP_CONCAT", "HEAP", "HIGH_PRIORITY", "HOSTS", "HOUR", "HOUR_MINUTE",
    "HOUR_SECOND", "IDENTIFIED", "IF", "IFNULL", "IGNORE", "IN", "INDEX", "INDEXES", "INFILE", "INSERT", "INSERT_ID",
    "INSERT_METHOD", "INTERVAL",
    "INTO", "INVOKER", "IS", "ISOLATION", "KEY", "KEYS", "KILL", "LAST_INSERT_ID", "LEADING", "LEVEL", "LIKE", "LINEAR",
    "LINES", "LOAD", "LOCAL", "LOCK", "LOCKS", "LOGS", "LOW_PRIORITY", "MARIA", "MASTER", "MASTER_CONNECT_RETRY",
    "MASTER_HOST", "MASTER_LOG_FILE",
    "MATCH", "MAX_CONNECTIONS_PER_HOUR", "MAX_QUERIES_PER_HOUR", "MAX_ROWS", "MAX_UPDATES_PER_HOUR", "MAX_USER_CONNECTIONS",
    "MEDIUM", "MERGE", "MINUTE", "MINUTE_SECOND", "MIN_ROWS", "MODE", "MODIFY",
    "MONTH", "MRG_MYISAM", "MYISAM", "NAMES", "NATURAL", "NOT", "NOW()", "NULL", "OFFSET", "ON", "OPEN", "OPTIMIZE", "OPTION", "OPTIONALLY",
    "ON UPDATE", "ON DELETE", "OUTFILE", "PACK_KEYS", "PAGE", "PARTIAL", "PARTITION", "PARTITIONS", "PASSWORD", "PRIMARY",
    "PRIVILEGES", "PROCEDURE",
    "PROCESS", "PROCESSLIST", "PURGE", "QUICK", "RANGE", "RAID0", "RAID_CHUNKS", "RAID_CHUNKSIZE", "RAID_TYPE", "READ", "READ_ONLY",
    "READ_WRITE", "REFERENCES", "REGEXP", "RELOAD", "RENAME", "REPAIR", "REPEATABLE", "REPLACE", "REPLICATION", "RESET",
    "RESTORE", "RESTRICT",
    "RETURN", "RETURNS", "REVOKE", "RLIKE", "ROLLBACK", "ROW", "ROWS", "ROW_FORMAT", "SECOND", "SECURITY", "SEPARATOR",
    "SERIALIZABLE", "SESSION", "SHARE", "SHOW", "SHUTDOWN", "SLAVE", "SONAME", "SOUNDS", "SQL", "SQL_AUTO_IS_NULL", "SQL_BIG_RESULT",
    "SQL_BIG_SELECTS", "SQL_BIG_TABLES", "SQL_BUFFER_RESULT", "SQL_CALC_FOUND_ROWS", "SQL_LOG_BIN", "SQL_LOG_OFF", "SQL_LOG_UPDATE",
    "SQL_LOW_PRIORITY_UPDATES", "SQL_MAX_JOIN_SIZE", "SQL_QUOTE_SHOW_CREATE", "SQL_SAFE_UPDATES",
    "SQL_SELECT_LIMIT", "SQL_SLAVE_SKIP_COUNTER",
    "SQL_SMALL_RESULT", "SQL_WARNINGS", "SQL_CACHE", "SQL_NO_CACHE", "START", "STARTING", "STATUS", "STOP", "STORAGE",
    "STRAIGHT_JOIN", "STRING", "STRIPED", "SUPER", "TABLE", "TABLES", "TEMPORARY", "TERMINATED", "THEN", "TO", "TRAILING",
    "TRANSACTIONAL", "TRUE",
    "TRUNCATE", "TYPE", "TYPES", "UNCOMMITTED", "UNIQUE", "UNLOCK", "UNSIGNED", "USAGE", "USE", "USING", "VARIABLES",
    "VIEW", "WHEN", "WITH", "WORK", "WRITE", "YEAR_MONTH"
];

// Words that are set to separate new line
const reservedToplevelWords = [
    "SELECT", "FROM", "WHERE", "SET", "ORDER BY", "GROUP BY", "LIMIT", "DROP", "INSERT INTO",
    "VALUES", "UPDATE", "HAVING", "ADD", "AFTER", "ALTER TABLE", "DELETE FROM", "UNION ALL", "UNION", "EXCEPT", "INTERSECT"
];

// Words that are set to newline
const reservedNewlineWords = [
    "LEFT OUTER JOIN", "RIGHT OUTER JOIN", "LEFT JOIN", "RIGHT JOIN", "OUTER JOIN", "INNER JOIN", "JOIN", "XOR", "OR", "AND"
];

let tokenizer;

export default class StandardSqlFormatter {
    /**
     * @param {Object} cfg Different set of configurations
     */
    constructor(cfg) {
        this.cfg = cfg;
    }

    /**
     * Format the whitespace in a Standard SQL string to make it easier to read
     *
     * @param {String} query The Standard SQL string
     * @return {String} formatted string
     */
    format(query) {
        if (!tokenizer) {
            tokenizer = new Tokenizer({
                reservedWords,
                reservedToplevelWords,
                reservedNewlineWords,
                stringTypes: [`""`, "''", "``", "[]"],
                openParens: ["("],
                closeParens: [")"],
                variableTypes: ["@", ":"],
            });
        }
        return new Formatter(this.cfg, tokenizer).format(query);
    }
}
