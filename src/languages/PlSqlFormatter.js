import Tokenizer from "../core/Tokenizer";
import NewFormatter from "../core/NewFormatter";

const reservedWords = [
    "A", "ACCESSIBLE", "AGENT", "AGGREGATE", "ALL", "ALTER", 
    "ANY", "ARRAY", "AS", "ASC", "AT", "ATTRIBUTE", "AUTHID", "AVG",
    "BETWEEN", "BFILE_BASE", "BINARY_INTEGER", "BINARY", "BLOB_BASE", 
    "BLOCK", "BODY", "BOOLEAN", "BOTH", "BOUND",
    "BULK", "BY", "BYTE",
    // "C", 
    "CALL", "CALLING", "CASCADE", "CASE", "CHAR_BASE", "CHAR",
    "CHARACTER", "CHARSET", "CHARSETFORM", "CHARSETID",
    "CHECK", "CLOB_BASE", "CLONE", "CLOSE", "CLUSTER", "CLUSTERS", 
    "COALESCE", "COLAUTH", "COLLECT", "COLUMNS", "COMMENT",
    "COMMIT", "COMMITTED", "COMPILED", "COMPRESS", "CONNECT", 
    "CONSTANT", "CONSTRUCTOR", "CONTEXT", "CONTINUE", "CONVERT",
    "COUNT", "CRASH", "CREATE", "CREDENTIAL", "CURRENT", "CURRVAL", 
    "CURSOR", "CUSTOMDATUM", "DANGLING", "DATA", "DATE_BASE", 
    "DATE", "DAY", "DECIMAL", "DEFAULT", "DEFINE", "DELETE", 
    "DESC",
    "DETERMINISTIC", "DIRECTORY", "DISTINCT", "DO", "DOUBLE", 
    "DROP", "DURATION",
    "ELEMENT", "ELSIF", "EMPTY", "ESCAPE", "EXCEPTIONS", 
    "EXCLUSIVE", "EXECUTE", "EXISTS",
    "EXIT", "EXTENDS", "EXTERNAL", "EXTRACT",
    "FALSE", "FETCH", "FINAL", "FIRST", "FIXED", "FLOAT", 
    "FOR", "FORALL", "FORCE", "FROM", "FUNCTION",
    "GENERAL", "GOTO", "GRANT", "GROUP", "HASH", "HEAP", 
    "HIDDEN", "HOUR",
    "IDENTIFIED", "IF", "IMMEDIATE", "IN", "INCLUDING", 
    "INDEX", "INDEXES", "INDICATOR", "INDICES", "INFINITE",
    "INSTANTIABLE", "INT", "INTEGER", "INTERFACE", "INTERVAL",
     "INTO", "INVALIDATE", "IS", "ISOLATION",
    "JAVA",
    "LANGUAGE", "LARGE", "LEADING", "LENGTH", "LEVEL", 
    "LIBRARY", "LIKE", "LIKE2", "LIKE4", "LIKEC", "LIMITED", 
    "LOCAL",
    "LOCK", "LONG",
    "MAP", "MAX", "MAXLEN", "MEMBER", "MERGE INTO", "MIN", "MINUS", 
    "MINUTE", "MLSLABEL", "MOD", "MODE", "MONTH", "MULTISET",
    "NAME", "NAN", "NATIONAL", "NATIVE", "NATURAL", "NATURALN", 
    "NCHAR", "NEW", "NEXTVAL", "NOCOMPRESS", "NOCOPY", "NOT",
    "NOWAIT", "NULL", "NULLIF", "NUMBER_BASE", "NUMBER",
    "OBJECT", "OCICOLL", "OCIDATE", "OCIDATETIME", "OCIDURATION", 
    "OCIINTERVAL", "OCILOBLOCATOR", "OCINUMBER", "OCIRAW",
    "OCIREF", "OCIREFCURSOR", "OCIROWID", "OCISTRING", "OCITYPE",
     "OF", "OLD", "ON", "ONLY", "OPAQUE", "OPEN", "OPERATOR",
    "OPTION", "ORACLE", "ORADATA", "ORDER", "ORGANIZATION", 
    "ORLANY", "ORLVARY", "OTHERS", "OUT", "OVERLAPS",
    "OVERRIDING",
    "PACKAGE", "PARALLEL_ENABLE", "PARAMETER", "PARAMETERS", "PARENT",
     "PARTITION", "PASCAL", "PCTFREE", "PIPE", "PIPELINED",
    "PLS_INTEGER", "PLUGGABLE", "POSITIVE", "POSITIVEN", "PRAGMA", 
    "PRECISION", "PRIOR", "PRIVATE", "PROCEDURE", "PUBLIC",
    "RAISE", "RANGE", "RAW", "READ", "REAL", "RECORD", "REF", 
    "REFERENCE", "RELEASE", "RELIES_ON", "REM", "REMAINDER",
    "RENAME", "RESOURCE", "RESULT_CACHE", "RESULT", "RETURN", 
    "RETURNING", "REVERSE", "REVOKE", "ROLLBACK", "ROW", "ROWID",
    "ROWNUM", "ROWTYPE",
    "SAMPLE", "SAVE", "SAVEPOINT", "SB1", "SB2", "SB4", "SECOND", 
    "SEGMENT", "SELF", "SEPARATE", "SEQUENCE",
    "SERIALIZABLE", "SHARE", "SHORT", "SIZE_T", "SIZE", "SMALLINT",
     "SOME", "SPACE", "SPARSE", "SQL", "SQLCODE",
    "SQLDATA", "SQLERRM", "SQLNAME", "SQLSTATE", "STANDARD", "START",
     "STATIC", "STDDEV", "STORED", "STRING", "STRUCT",
    "STYLE", "SUBMULTISET", "SUBPARTITION", "SUBSTITUTABLE", "SUBTYPE",
    "SUCCESSFUL", "SUM", "SYNONYM", "SYSDATE",
    "TABAUTH", "TABLE", "TDO", "THE", "THEN", "TIME", "TIMESTAMP", 
    "TIMEZONE_ABBR", "TIMEZONE_HOUR", "TIMEZONE_MINUTE",
    "TIMEZONE_REGION", "TO", "TRAILING", "TRANSACTION", "TRANSACTIONAL",
    "TRIGGER", "TRUE", "TRUSTED", "TYPE",
    "UB1", "UB2", "UB4", "UID", "UNDER", "UNIQUE", "UNPLUG", "UNSIGNED",
    "UNTRUSTED", "USE", "USER", "USING",
    "VALIDATE", "VALIST", "VALUE", "VARCHAR", "VARCHAR2", "VARIABLE",
    "VARIANCE", "VARRAY", "VARYING", "VIEW", "VIEWS", "VOID",
    "WHENEVER", "WHILE", "WITH", "WORK", "WRAPPED", "WRITE",
    "YEAR", "SELECT", "UNION", "INSERT", "EXCEPTION",
    "ZONE", 
    "AND", 
    "OR", 
    "LOOP", 
    "TYPE", "WITH", "UNION", 
    "USING",
    "ELSE", 
    "WHEN", "THEN", "ELSIF",
    "ALTER", "SELECT", "INSERT", "UPDATE", "DROP", "MERGE INTO",
    "CREATE", "BEGIN",
    "FUNCTION", "CURSOR", "IF", 
    "FOR", "PROCEDURE", "WHILE", "PRAGMA", "CASE",
];

const reservedToplevelWords = [
    // "LOOP", 
    "TYPE", "WITH", "UNION", 
    "USING",
    "ELSE", 
    "WHEN", "THEN", "ELSIF",
];

const reservedNewlineWords = [
    "ALTER", "SELECT", "INSERT", "UPDATE", "DROP", "MERGE INTO",
];

const openParens = [
    "CREATE", //"BEGIN",
    "FUNCTION", "CURSOR", "IF", 
    "FORALL",
    "FOR",
     "PROCEDURE", 
     // "LOOP",
    "WHILE", 
    // "PRAGMA", 
    "CASE",
]

let tokenizer;

export default class SqlFormatter {
    constructor(cfg) {
        this.cfg = cfg;
    }

    format(query) {
        if (!tokenizer) {
            tokenizer = new Tokenizer({
                reservedWords,
                reservedToplevelWords,
                reservedNewlineWords,
                stringTypes: [`""`, "N''", "''", "``",],
                openParens,
                closeParens: ["END", ],//"RETURN", ],
                indexedPlaceholderTypes: ["?"],
                namedPlaceholderTypes: [":"],
                lineCommentTypes: ["--"],
                specialWordChars: ["_", "$", "#",  ".", "@", "%"]
            });
        }
        return new NewFormatter(this.cfg, tokenizer, reservedWords, openParens).format(query);
    }

    
}
