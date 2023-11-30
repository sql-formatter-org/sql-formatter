export const keywords = [
  // https://www.postgresql.org/docs/14/sql-keywords-appendix.html
  'ABORT',
  'ABSOLUTE',
  'ACCESS',
  'ACTION',
  'ADD',
  'ADMIN',
  'AFTER',
  'AGGREGATE',
  'ALL', // reserved
  'ALSO',
  'ALTER',
  'ALWAYS',
  'ANALYSE', // reserved
  'ANALYZE', // reserved
  'AND', // reserved
  'ANY', // reserved
  'AS', // reserved, requires AS
  'ASC', // reserved
  'ASENSITIVE',
  'ASSERTION',
  'ASSIGNMENT',
  'ASYMMETRIC', // reserved
  'AT',
  'ATOMIC',
  'ATTACH',
  'ATTRIBUTE',
  'AUTHORIZATION', // reserved (can be function or type)
  'BACKWARD',
  'BEFORE',
  'BEGIN',
  'BETWEEN', // (cannot be function or type)
  'BINARY', // reserved (can be function or type)
  'BOTH', // reserved
  'BREADTH',
  'BY',
  'CACHE',
  'CALL',
  'CALLED',
  'CASCADE',
  'CASCADED',
  'CASE', // reserved
  'CAST', // reserved
  'CATALOG',
  'CHAIN',
  'CHARACTERISTICS',
  'CHECK', // reserved
  'CHECKPOINT',
  'CLASS',
  'CLOSE',
  'CLUSTER',
  'COALESCE', // (cannot be function or type)
  'COLLATE', // reserved
  'COLLATION', // reserved (can be function or type)
  'COLUMN', // reserved
  'COLUMNS',
  'COMMENT',
  'COMMENTS',
  'COMMIT',
  'COMMITTED',
  'COMPRESSION',
  'CONCURRENTLY', // reserved (can be function or type)
  'CONFIGURATION',
  'CONFLICT',
  'CONNECTION',
  'CONSTRAINT', // reserved
  'CONSTRAINTS',
  'CONTENT',
  'CONTINUE',
  'CONVERSION',
  'COPY',
  'COST',
  'CREATE', // reserved, requires AS
  'CROSS', // reserved (can be function or type)
  'CSV',
  'CUBE',
  'CURRENT',
  'CURRENT_CATALOG', // reserved
  'CURRENT_DATE', // reserved
  'CURRENT_ROLE', // reserved
  'CURRENT_SCHEMA', // reserved (can be function or type)
  'CURRENT_TIME', // reserved
  'CURRENT_TIMESTAMP', // reserved
  'CURRENT_USER', // reserved
  'CURSOR',
  'CYCLE',
  'DATA',
  'DATABASE',
  'DAY', // requires AS
  'DEALLOCATE',
  'DEC', // (cannot be function or type)
  'DECLARE',
  'DEFAULT', // reserved
  'DEFAULTS',
  'DEFERRABLE', // reserved
  'DEFERRED',
  'DEFINER',
  'DELETE',
  'DELIMITER',
  'DELIMITERS',
  'DEPENDS',
  'DEPTH',
  'DESC', // reserved
  'DETACH',
  'DICTIONARY',
  'DISABLE',
  'DISCARD',
  'DISTINCT', // reserved
  'DO', // reserved
  'DOCUMENT',
  'DOMAIN',
  'DROP',
  'EACH',
  'ELSE', // reserved
  'ENABLE',
  'ENCODING',
  'ENCRYPTED',
  'END', // reserved
  'ENUM',
  'ESCAPE',
  'EVENT',
  'EXCEPT', // reserved, requires AS
  'EXCLUDE',
  'EXCLUDING',
  'EXCLUSIVE',
  'EXECUTE',
  'EXISTS', // (cannot be function or type)
  'EXPLAIN',
  'EXPRESSION',
  'EXTENSION',
  'EXTERNAL',
  'EXTRACT', // (cannot be function or type)
  'FALSE', // reserved
  'FAMILY',
  'FETCH', // reserved, requires AS
  'FILTER', // requires AS
  'FINALIZE',
  'FIRST',
  'FOLLOWING',
  'FOR', // reserved, requires AS
  'FORCE',
  'FOREIGN', // reserved
  'FORWARD',
  'FREEZE', // reserved (can be function or type)
  'FROM', // reserved, requires AS
  'FULL', // reserved (can be function or type)
  'FUNCTION',
  'FUNCTIONS',
  'GENERATED',
  'GLOBAL',
  'GRANT', // reserved, requires AS
  'GRANTED',
  'GREATEST', // (cannot be function or type)
  'GROUP', // reserved, requires AS
  'GROUPING', // (cannot be function or type)
  'GROUPS',
  'HANDLER',
  'HAVING', // reserved, requires AS
  'HEADER',
  'HOLD',
  'HOUR', // requires AS
  'IDENTITY',
  'IF',
  'ILIKE', // reserved (can be function or type)
  'IMMEDIATE',
  'IMMUTABLE',
  'IMPLICIT',
  'IMPORT',
  'IN', // reserved
  'INCLUDE',
  'INCLUDING',
  'INCREMENT',
  'INDEX',
  'INDEXES',
  'INHERIT',
  'INHERITS',
  'INITIALLY', // reserved
  'INLINE',
  'INNER', // reserved (can be function or type)
  'INOUT', // (cannot be function or type)
  'INPUT',
  'INSENSITIVE',
  'INSERT',
  'INSTEAD',
  'INTERSECT', // reserved, requires AS
  'INTO', // reserved, requires AS
  'INVOKER',
  'IS', // reserved (can be function or type)
  'ISNULL', // reserved (can be function or type), requires AS
  'ISOLATION',
  'JOIN', // reserved (can be function or type)
  'KEY',
  'LABEL',
  'LANGUAGE',
  'LARGE',
  'LAST',
  'LATERAL', // reserved
  'LEADING', // reserved
  'LEAKPROOF',
  'LEAST', // (cannot be function or type)
  'LEFT', // reserved (can be function or type)
  'LEVEL',
  'LIKE', // reserved (can be function or type)
  'LIMIT', // reserved, requires AS
  'LISTEN',
  'LOAD',
  'LOCAL',
  'LOCALTIME', // reserved
  'LOCALTIMESTAMP', // reserved
  'LOCATION',
  'LOCK',
  'LOCKED',
  'LOGGED',
  'MAPPING',
  'MATCH',
  'MATERIALIZED',
  'MAXVALUE',
  'METHOD',
  'MINUTE', // requires AS
  'MINVALUE',
  'MODE',
  'MONTH', // requires AS
  'MOVE',
  'NAME',
  'NAMES',
  'NATIONAL', // (cannot be function or type)
  'NATURAL', // reserved (can be function or type)
  'NCHAR', // (cannot be function or type)
  'NEW',
  'NEXT',
  'NFC',
  'NFD',
  'NFKC',
  'NFKD',
  'NO',
  'NONE', // (cannot be function or type)
  'NORMALIZE', // (cannot be function or type)
  'NORMALIZED',
  'NOT', // reserved
  'NOTHING',
  'NOTIFY',
  'NOTNULL', // reserved (can be function or type), requires AS
  'NOWAIT',
  'NULL', // reserved
  'NULLIF', // (cannot be function or type)
  'NULLS',
  'OBJECT',
  'OF',
  'OFF',
  'OFFSET', // reserved, requires AS
  'OIDS',
  'OLD',
  'ON', // reserved, requires AS
  'ONLY', // reserved
  'OPERATOR',
  'OPTION',
  'OPTIONS',
  'OR', // reserved
  'ORDER', // reserved, requires AS
  'ORDINALITY',
  'OTHERS',
  'OUT', // (cannot be function or type)
  'OUTER', // reserved (can be function or type)
  'OVER', // requires AS
  'OVERLAPS', // reserved (can be function or type), requires AS
  'OVERLAY', // (cannot be function or type)
  'OVERRIDING',
  'OWNED',
  'OWNER',
  'PARALLEL',
  'PARSER',
  'PARTIAL',
  'PARTITION',
  'PASSING',
  'PASSWORD',
  'PLACING', // reserved
  'PLANS',
  'POLICY',
  'POSITION', // (cannot be function or type)
  'PRECEDING',
  'PREPARE',
  'PREPARED',
  'PRESERVE',
  'PRIMARY', // reserved
  'PRIOR',
  'PRIVILEGES',
  'PROCEDURAL',
  'PROCEDURE',
  'PROCEDURES',
  'PROGRAM',
  'PUBLICATION',
  'QUOTE',
  'RANGE',
  'READ',
  'REASSIGN',
  'RECHECK',
  'RECURSIVE',
  'REF',
  'REFERENCES', // reserved
  'REFERENCING',
  'REFRESH',
  'REINDEX',
  'RELATIVE',
  'RELEASE',
  'RENAME',
  'REPEATABLE',
  'REPLACE',
  'REPLICA',
  'RESET',
  'RESTART',
  'RESTRICT',
  'RETURN',
  'RETURNING', // reserved, requires AS
  'RETURNS',
  'REVOKE',
  'RIGHT', // reserved (can be function or type)
  'ROLE',
  'ROLLBACK',
  'ROLLUP',
  'ROUTINE',
  'ROUTINES',
  'ROW', // (cannot be function or type)
  'ROWS',
  'RULE',
  'SAVEPOINT',
  'SCHEMA',
  'SCHEMAS',
  'SCROLL',
  'SEARCH',
  'SECOND', // requires AS
  'SECURITY',
  'SELECT', // reserved
  'SEQUENCE',
  'SEQUENCES',
  'SERIALIZABLE',
  'SERVER',
  'SESSION',
  'SESSION_USER', // reserved
  'SET',
  'SETOF', // (cannot be function or type)
  'SETS',
  'SHARE',
  'SHOW',
  'SIMILAR', // reserved (can be function or type)
  'SIMPLE',
  'SKIP',
  'SNAPSHOT',
  'SOME', // reserved
  'SQL',
  'STABLE',
  'STANDALONE',
  'START',
  'STATEMENT',
  'STATISTICS',
  'STDIN',
  'STDOUT',
  'STORAGE',
  'STORED',
  'STRICT',
  'STRIP',
  'SUBSCRIPTION',
  'SUBSTRING', // (cannot be function or type)
  'SUPPORT',
  'SYMMETRIC', // reserved
  'SYSID',
  'SYSTEM',
  'TABLE', // reserved
  'TABLES',
  'TABLESAMPLE', // reserved (can be function or type)
  'TABLESPACE',
  'TEMP',
  'TEMPLATE',
  'TEMPORARY',
  'THEN', // reserved
  'TIES',
  'TO', // reserved, requires AS
  'TRAILING', // reserved
  'TRANSACTION',
  'TRANSFORM',
  'TREAT', // (cannot be function or type)
  'TRIGGER',
  'TRIM', // (cannot be function or type)
  'TRUE', // reserved
  'TRUNCATE',
  'TRUSTED',
  'TYPE',
  'TYPES',
  'UESCAPE',
  'UNBOUNDED',
  'UNCOMMITTED',
  'UNENCRYPTED',
  'UNION', // reserved, requires AS
  'UNIQUE', // reserved
  'UNKNOWN',
  'UNLISTEN',
  'UNLOGGED',
  'UNTIL',
  'UPDATE',
  'USER', // reserved
  'USING', // reserved
  'VACUUM',
  'VALID',
  'VALIDATE',
  'VALIDATOR',
  'VALUE',
  'VALUES', // (cannot be function or type)
  'VARIADIC', // reserved
  'VERBOSE', // reserved (can be function or type)
  'VERSION',
  'VIEW',
  'VIEWS',
  'VOLATILE',
  'WHEN', // reserved
  'WHERE', // reserved, requires AS
  'WHITESPACE',
  'WINDOW', // reserved, requires AS
  'WITH', // reserved, requires AS
  'WITHIN', // requires AS
  'WITHOUT', // requires AS
  'WORK',
  'WRAPPER',
  'WRITE',
  'XMLATTRIBUTES', // (cannot be function or type)
  'XMLCONCAT', // (cannot be function or type)
  'XMLELEMENT', // (cannot be function or type)
  'XMLEXISTS', // (cannot be function or type)
  'XMLFOREST', // (cannot be function or type)
  'XMLNAMESPACES', // (cannot be function or type)
  'XMLPARSE', // (cannot be function or type)
  'XMLPI', // (cannot be function or type)
  'XMLROOT', // (cannot be function or type)
  'XMLSERIALIZE', // (cannot be function or type)
  'XMLTABLE', // (cannot be function or type)
  'YEAR', // requires AS
  'YES',
];

export const dataTypes: string[] = [
  // https://www.postgresql.org/docs/current/datatype.html
  'ARRAY', // reserved, requires AS
  'BIGINT', // (cannot be function or type)
  'BIT', // (cannot be function or type)
  'BOOL', // (cannot be function or type)
  'BOOLEAN', // (cannot be function or type)
  'CHAR', // (cannot be function or type), requires AS
  'CHARACTER', // (cannot be function or type), requires AS
  'DECIMAL', // (cannot be function or type)
  'DOUBLE',
  'FLOAT', // (cannot be function or type)
  'INT', // (cannot be function or type)
  'INTEGER', // (cannot be function or type)
  'INTERVAL', // (cannot be function or type)
  'NUMERIC', // (cannot be function or type)
  'PRECISION', // (cannot be function or type), requires AS
  'REAL', // (cannot be function or type)
  'SMALLINT', // (cannot be function or type)
  'TEXT',
  'TIME', // (cannot be function or type)
  'TIMESTAMP', // (cannot be function or type)
  'TIMESTAMPTZ', // (cannot be function or type)
  'VARCHAR', // (cannot be function or type)
  'VARYING', // requires AS
  'XML',
  'ZONE',
];
