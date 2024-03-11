export const keywords: string[] = [
  // https://docs.pingcap.com/tidb/stable/keywords
  'ADD', // (R)
  'ALL', // (R)
  'ALTER', // (R)
  'ANALYZE', // (R)
  'AND', // (R)
  'ARRAY', // (R)
  'AS', // (R)
  'ASC', // (R)
  'BETWEEN', // (R)
  'BIGINT', // (R)
  'BINARY', // (R)
  'BLOB', // (R)
  'BOTH', // (R)
  'BY', // (R)
  'CALL', // (R)
  'CASCADE', // (R)
  'CASE', // (R)
  'CHANGE', // (R)
  'CHAR', // (R)
  'CHARACTER', // (R)
  'CHECK', // (R)
  'COLLATE', // (R)
  'COLUMN', // (R)
  'CONSTRAINT', // (R)
  'CONTINUE', // (R)
  'CONVERT', // (R)
  'CREATE', // (R)
  'CROSS', // (R)
  'CUME_DIST', // (R)
  'CURRENT_DATE', // (R)
  'CURRENT_ROLE', // (R)
  'CURRENT_TIME', // (R)
  'CURRENT_TIMESTAMP', // (R)
  'CURRENT_USER', // (R)
  'CURSOR', // (R)
  'DATABASE', // (R)
  'DATABASES', // (R)
  'DAY_HOUR', // (R)
  'DAY_MICROSECOND', // (R)
  'DAY_MINUTE', // (R)
  'DAY_SECOND', // (R)
  'DECIMAL', // (R)
  'DEFAULT', // (R)
  'DELAYED', // (R)
  'DELETE', // (R)
  'DENSE_RANK', // (R)
  'DESC', // (R)
  'DESCRIBE', // (R)
  'DISTINCT', // (R)
  'DISTINCTROW', // (R)
  'DIV', // (R)
  'DOUBLE', // (R)
  'DROP', // (R)
  'DUAL', // (R)
  'ELSE', // (R)
  'ELSEIF', // (R)
  'ENCLOSED', // (R)
  'ESCAPED', // (R)
  'EXCEPT', // (R)
  'EXISTS', // (R)
  'EXIT', // (R)
  'EXPLAIN', // (R)
  'FALSE', // (R)
  'FETCH', // (R)
  'FIRST_VALUE', // (R)
  'FLOAT', // (R)
  'FLOAT4', // (R)
  'FLOAT8', // (R)
  'FOR', // (R)
  'FORCE', // (R)
  'FOREIGN', // (R)
  'FROM', // (R)
  'FULLTEXT', // (R)
  'GENERATED', // (R)
  'GRANT', // (R)
  'GROUP', // (R)
  'GROUPS', // (R)
  'HAVING', // (R)
  'HIGH_PRIORITY', // (R)
  'HOUR_MICROSECOND', // (R)
  'HOUR_MINUTE', // (R)
  'HOUR_SECOND', // (R)
  'IF', // (R)
  'IGNORE', // (R)
  'ILIKE', // (R)
  'IN', // (R)
  'INDEX', // (R)
  'INFILE', // (R)
  'INNER', // (R)
  'INOUT', // (R)
  'INSERT', // (R)
  'INT', // (R)
  'INT1', // (R)
  'INT2', // (R)
  'INT3', // (R)
  'INT4', // (R)
  'INT8', // (R)
  'INTEGER', // (R)
  'INTERSECT', // (R)
  'INTERVAL', // (R)
  'INTO', // (R)
  'IS', // (R)
  'ITERATE', // (R)
  'JOIN', // (R)
  'KEY', // (R)
  'KEYS', // (R)
  'KILL', // (R)
  'LAG', // (R)
  'LAST_VALUE', // (R)
  'LEAD', // (R)
  'LEADING', // (R)
  'LEAVE', // (R)
  'LEFT', // (R)
  'LIKE', // (R)
  'LIMIT', // (R)
  'LINEAR', // (R)
  'LINES', // (R)
  'LOAD', // (R)
  'LOCALTIME', // (R)
  'LOCALTIMESTAMP', // (R)
  'LOCK', // (R)
  'LONG', // (R)
  'LONGBLOB', // (R)
  'LONGTEXT', // (R)
  'LOW_PRIORITY', // (R)
  'MATCH', // (R)
  'MAXVALUE', // (R)
  'MEDIUMBLOB', // (R)
  'MEDIUMINT', // (R)
  'MEDIUMTEXT', // (R)
  'MIDDLEINT', // (R)
  'MINUTE_MICROSECOND', // (R)
  'MINUTE_SECOND', // (R)
  'MOD', // (R)
  'NATURAL', // (R)
  'NOT', // (R)
  'NO_WRITE_TO_BINLOG', // (R)
  'NTH_VALUE', // (R)
  'NTILE', // (R)
  'NULL', // (R)
  'NUMERIC', // (R)
  'OF', // (R)
  'ON', // (R)
  'OPTIMIZE', // (R)
  'OPTION', // (R)
  'OPTIONALLY', // (R)
  'OR', // (R)
  'ORDER', // (R)
  'OUT', // (R)
  'OUTER', // (R)
  'OUTFILE', // (R)
  'OVER', // (R)
  'PARTITION', // (R)
  'PERCENT_RANK', // (R)
  'PRECISION', // (R)
  'PRIMARY', // (R)
  'PROCEDURE', // (R)
  'RANGE', // (R)
  'RANK', // (R)
  'READ', // (R)
  'REAL', // (R)
  'RECURSIVE', // (R)
  'REFERENCES', // (R)
  'REGEXP', // (R)
  'RELEASE', // (R)
  'RENAME', // (R)
  'REPEAT', // (R)
  'REPLACE', // (R)
  'REQUIRE', // (R)
  'RESTRICT', // (R)
  'REVOKE', // (R)
  'RIGHT', // (R)
  'RLIKE', // (R)
  'ROW', // (R)
  'ROWS', // (R)
  'ROW_NUMBER', // (R)
  'SECOND_MICROSECOND', // (R)
  'SELECT', // (R)
  'SET', // (R)
  'SHOW', // (R)
  'SMALLINT', // (R)
  'SPATIAL', // (R)
  'SQL', // (R)
  'SQLEXCEPTION', // (R)
  'SQLSTATE', // (R)
  'SQLWARNING', // (R)
  'SQL_BIG_RESULT', // (R)
  'SQL_CALC_FOUND_ROWS', // (R)
  'SQL_SMALL_RESULT', // (R)
  'SSL', // (R)
  'STARTING', // (R)
  'STATS_EXTENDED', // (R)
  'STORED', // (R)
  'STRAIGHT_JOIN', // (R)
  'TABLE', // (R)
  'TABLESAMPLE', // (R)
  'TERMINATED', // (R)
  'THEN', // (R)
  'TINYBLOB', // (R)
  'TINYINT', // (R)
  'TINYTEXT', // (R)
  'TO', // (R)
  'TRAILING', // (R)
  'TRIGGER', // (R)
  'TRUE', // (R)
  'TiDB_CURRENT_TSO', // (R)
  'UNION', // (R)
  'UNIQUE', // (R)
  'UNLOCK', // (R)
  'UNSIGNED', // (R)
  'UNTIL', // (R)
  'UPDATE', // (R)
  'USAGE', // (R)
  'USE', // (R)
  'USING', // (R)
  'UTC_DATE', // (R)
  'UTC_TIME', // (R)
  'UTC_TIMESTAMP', // (R)
  'VALUES', // (R)
  'VARBINARY', // (R)
  'VARCHAR', // (R)
  'VARCHARACTER', // (R)
  'VARYING', // (R)
  'VIRTUAL', // (R)
  'WHEN', // (R)
  'WHERE', // (R)
  'WHILE', // (R)
  'WINDOW', // (R)
  'WITH', // (R)
  'WRITE', // (R)
  'XOR', // (R)
  'YEAR_MONTH', // (R)
  'ZEROFILL', // (R)
  'ACCOUNT',
  'ACTION',
  'ADVISE',
  'AFTER',
  'AGAINST',
  'AGO',
  'ALGORITHM',
  'ALWAYS',
  'ANY',
  'ASCII',
  'ATTRIBUTE',
  'ATTRIBUTES',
  'AUTO_ID_CACHE',
  'AUTO_INCREMENT',
  'AUTO_RANDOM',
  'AUTO_RANDOM_BASE',
  'AVG',
  'AVG_ROW_LENGTH',
  'BACKEND',
  'BACKUP',
  'BACKUPS',
  'BDR',
  'BEGIN',
  'BERNOULLI',
  'BINDING',
  'BINDINGS',
  'BINDING_CACHE',
  'BINLOG',
  'BIT',
  'BLOCK',
  'BOOL',
  'BOOLEAN',
  'BTREE',
  'BYTE',
  'CACHE',
  'CALIBRATE',
  'CAPTURE',
  'CASCADED',
  'CAUSAL',
  'CHAIN',
  'CHARSET',
  'CHECKPOINT',
  'CHECKSUM',
  'CIPHER',
  'CLEANUP',
  'CLIENT',
  'CLIENT_ERRORS_SUMMARY',
  'CLOSE',
  'CLUSTER',
  'CLUSTERED',
  'COALESCE',
  'COLLATION',
  'COLUMNS',
  'COLUMN_FORMAT',
  'COMMENT',
  'COMMIT',
  'COMMITTED',
  'COMPACT',
  'COMPRESSED',
  'COMPRESSION',
  'CONCURRENCY',
  'CONFIG',
  'CONNECTION',
  'CONSISTENCY',
  'CONSISTENT',
  'CONTEXT',
  'CPU',
  'CSV_BACKSLASH_ESCAPE',
  'CSV_DELIMITER',
  'CSV_HEADER',
  'CSV_NOT_NULL',
  'CSV_NULL',
  'CSV_SEPARATOR',
  'CSV_TRIM_LAST_SEPARATORS',
  'CURRENT',
  'CYCLE',
  'DATA',
  'DATE',
  'DATETIME',
  'DAY',
  'DEALLOCATE',
  'DECLARE',
  'DEFINER',
  'DELAY_KEY_WRITE',
  'DIGEST',
  'DIRECTORY',
  'DISABLE',
  'DISABLED',
  'DISCARD',
  'DISK',
  'DO',
  'DUPLICATE',
  'DYNAMIC',
  'ENABLE',
  'ENABLED',
  'ENCRYPTION',
  'END',
  'ENFORCED',
  'ENGINE',
  'ENGINES',
  'ENUM',
  'ERROR',
  'ERRORS',
  'ESCAPE',
  'EVENT',
  'EVENTS',
  'EVOLVE',
  'EXCHANGE',
  'EXCLUSIVE',
  'EXECUTE',
  'EXPANSION',
  'EXPIRE',
  'EXTENDED',
  'FAILED_LOGIN_ATTEMPTS',
  'FAULTS',
  'FIELDS',
  'FILE',
  'FIRST',
  'FIXED',
  'FLUSH',
  'FOLLOWING',
  'FORMAT',
  'FOUND',
  'FULL',
  'FUNCTION',
  'GENERAL',
  'GLOBAL',
  'GRANTS',
  'HANDLER',
  'HASH',
  'HELP',
  'HISTOGRAM',
  'HISTORY',
  'HOSTS',
  'HOUR',
  'HYPO',
  'IDENTIFIED',
  'IMPORT',
  'IMPORTS',
  'INCREMENT',
  'INCREMENTAL',
  'INDEXES',
  'INSERT_METHOD',
  'INSTANCE',
  'INVISIBLE',
  'INVOKER',
  'IO',
  'IPC',
  'ISOLATION',
  'ISSUER',
  'JSON',
  'KEY_BLOCK_SIZE',
  'LABELS',
  'LANGUAGE',
  'LAST',
  'LASTVAL',
  'LAST_BACKUP',
  'LESS',
  'LEVEL',
  'LIST',
  'LOCAL',
  'LOCATION',
  'LOCKED',
  'LOGS',
  'MASTER',
  'MAX_CONNECTIONS_PER_HOUR',
  'MAX_IDXNUM',
  'MAX_MINUTES',
  'MAX_QUERIES_PER_HOUR',
  'MAX_ROWS',
  'MAX_UPDATES_PER_HOUR',
  'MAX_USER_CONNECTIONS',
  'MB',
  'MEMBER',
  'MEMORY',
  'MERGE',
  'MICROSECOND',
  'MINUTE',
  'MINVALUE',
  'MIN_ROWS',
  'MODE',
  'MODIFY',
  'MONTH',
  'NAMES',
  'NATIONAL',
  'NCHAR',
  'NEVER',
  'NEXT',
  'NEXTVAL',
  'NO',
  'NOCACHE',
  'NOCYCLE',
  'NODEGROUP',
  'NOMAXVALUE',
  'NOMINVALUE',
  'NONCLUSTERED',
  'NONE',
  'NOWAIT',
  'NULLS',
  'NVARCHAR',
  'OFF',
  'OFFSET',
  'OLTP_READ_ONLY',
  'OLTP_READ_WRITE',
  'OLTP_WRITE_ONLY',
  'ONLINE',
  'ONLY',
  'ON_DUPLICATE',
  'OPEN',
  'OPTIONAL',
  'PACK_KEYS',
  'PAGE',
  'PARSER',
  'PARTIAL',
  'PARTITIONING',
  'PARTITIONS',
  'PASSWORD',
  'PASSWORD_LOCK_TIME',
  'PAUSE',
  'PERCENT',
  'PER_DB',
  'PER_TABLE',
  'PLUGINS',
  'POINT',
  'POLICY',
  'PRECEDING',
  'PREPARE',
  'PRESERVE',
  'PRE_SPLIT_REGIONS',
  'PRIVILEGES',
  'PROCESS',
  'PROCESSLIST',
  'PROFILE',
  'PROFILES',
  'PROXY',
  'PURGE',
  'QUARTER',
  'QUERIES',
  'QUERY',
  'QUICK',
  'RATE_LIMIT',
  'REBUILD',
  'RECOVER',
  'REDUNDANT',
  'RELOAD',
  'REMOVE',
  'REORGANIZE',
  'REPAIR',
  'REPEATABLE',
  'REPLICA',
  'REPLICAS',
  'REPLICATION',
  'REQUIRED',
  'RESOURCE',
  'RESPECT',
  'RESTART',
  'RESTORE',
  'RESTORES',
  'RESUME',
  'REUSE',
  'REVERSE',
  'ROLE',
  'ROLLBACK',
  'ROLLUP',
  'ROUTINE',
  'ROW_COUNT',
  'ROW_FORMAT',
  'RTREE',
  'SAN',
  'SAVEPOINT',
  'SECOND',
  'SECONDARY',
  'SECONDARY_ENGINE',
  'SECONDARY_LOAD',
  'SECONDARY_UNLOAD',
  'SECURITY',
  'SEND_CREDENTIALS_TO_TIKV',
  'SEPARATOR',
  'SEQUENCE',
  'SERIAL',
  'SERIALIZABLE',
  'SESSION',
  'SETVAL',
  'SHARD_ROW_ID_BITS',
  'SHARE',
  'SHARED',
  'SHUTDOWN',
  'SIGNED',
  'SIMPLE',
  'SKIP',
  'SKIP_SCHEMA_FILES',
  'SLAVE',
  'SLOW',
  'SNAPSHOT',
  'SOME',
  'SOURCE',
  'SQL_BUFFER_RESULT',
  'SQL_CACHE',
  'SQL_NO_CACHE',
  'SQL_TSI_DAY',
  'SQL_TSI_HOUR',
  'SQL_TSI_MINUTE',
  'SQL_TSI_MONTH',
  'SQL_TSI_QUARTER',
  'SQL_TSI_SECOND',
  'SQL_TSI_WEEK',
  'SQL_TSI_YEAR',
  'START',
  'STATS_AUTO_RECALC',
  'STATS_COL_CHOICE',
  'STATS_COL_LIST',
  'STATS_OPTIONS',
  'STATS_PERSISTENT',
  'STATS_SAMPLE_PAGES',
  'STATS_SAMPLE_RATE',
  'STATUS',
  'STORAGE',
  'STRICT_FORMAT',
  'SUBJECT',
  'SUBPARTITION',
  'SUBPARTITIONS',
  'SUPER',
  'SWAPS',
  'SWITCHES',
  'SYSTEM',
  'SYSTEM_TIME',
  'TABLES',
  'TABLESPACE',
  'TABLE_CHECKSUM',
  'TEMPORARY',
  'TEMPTABLE',
  'TEXT',
  'THAN',
  'TIKV_IMPORTER',
  'TIME',
  'TIMESTAMP',
  'TOKEN_ISSUER',
  'TPCC',
  'TPCH_10',
  'TRACE',
  'TRADITIONAL',
  'TRANSACTION',
  'TRIGGERS',
  'TRUNCATE',
  'TSO',
  'TTL',
  'TTL_ENABLE',
  'TTL_JOB_INTERVAL',
  'TYPE',
  'UNBOUNDED',
  'UNCOMMITTED',
  'UNDEFINED',
  'UNICODE',
  'UNKNOWN',
  'UNSET',
  'USER',
  'VALIDATION',
  'VALUE',
  'VARIABLES',
  'VIEW',
  'VISIBLE',
  'WAIT',
  'WARNINGS',
  'WEEK',
  'WEIGHT_STRING',
  'WITHOUT',
  'WORKLOAD',
  'X509',
  'YEAR',
  'ADMIN',
  'BATCH',
  'BUCKETS',
  'BUILTINS',
  'CANCEL',
  'CARDINALITY',
  'CMSKETCH',
  'COLUMN_STATS_USAGE',
  'CORRELATION',
  'DDL',
  'DEPENDENCY',
  'DEPTH',
  'DRAINER',
  'DRY',
  'HISTOGRAMS_IN_FLIGHT',
  'JOB',
  'JOBS',
  'NODE_ID',
  'NODE_STATE',
  'OPTIMISTIC',
  'PESSIMISTIC',
  'PUMP',
  'REGION',
  'REGIONS',
  'RESET',
  'RUN',
  'SAMPLERATE',
  'SAMPLES',
  'SESSION_STATES',
  'SPLIT',
  'STATISTICS',
  'STATS',
  'STATS_BUCKETS',
  'STATS_HEALTHY',
  'STATS_HISTOGRAMS',
  'STATS_LOCKED',
  'STATS_META',
  'STATS_TOPN',
  'TELEMETRY',
  'TELEMETRY_ID',
  'TIDB',
  'TIFLASH',
  'TOPN',
  'WIDTH',
];

export const dataTypes: string[] = [
  // https://docs.pingcap.com/tidb/stable/data-type-overview
  'BIGINT', // (R)
  'BINARY', // (R)
  'BIT',
  'BLOB', // (R)
  'BOOL', // (R)
  'BOOLEAN', // (R)
  'CHAR', // (R)
  'CHARACTER', // (R)
  'DATE', // (R)
  'DATETIME', // (R)
  'DEC', // (R)
  'DECIMAL', // (R)
  'DOUBLE PRECISION',
  'DOUBLE', // (R)
  'ENUM',
  'FIXED',
  'FLOAT', // (R)
  'FLOAT4', // (R)
  'FLOAT8', // (R)
  'INT', // (R)
  'INT1', // (R)
  'INT2', // (R)
  'INT3', // (R)
  'INT4', // (R)
  'INT8', // (R)
  'INTEGER', // (R)
  'LONGBLOB', // (R)
  'LONGTEXT', // (R)
  'MEDIUMBLOB', // (R)
  'MEDIUMINT', // (R)
  'MEDIUMTEXT', // (R)
  'MIDDLEINT', // (R)
  'NATIONAL CHAR', // (R)
  'NATIONAL VARCHAR', // (R)
  'NUMERIC', // (R)
  'PRECISION', // (R)
  'REAL', // (R)
  'SMALLINT', // (R)
  'TEXT',
  'TIME',
  'TIMESTAMP', // (R)
  'TINYBLOB', // (R)
  'TINYINT', // (R)
  'TINYTEXT', // (R)
  'VARBINARY', // (R)
  'VARCHAR', // (R)
  'VARCHARACTER', // (R)
  'VARYING', // (R)
  'YEAR',
  // 'SET' // handled as special-case in postProcess
];
