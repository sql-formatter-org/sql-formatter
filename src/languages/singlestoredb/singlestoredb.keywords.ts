import { flatKeywordList } from '../../utils';

export const keywords = flatKeywordList({
  // https://docs.singlestore.com/managed-service/en/reference/sql-reference.html
  all: [
    'ACCESSIBLE', // (R)
    'ACCOUNT',
    'ACTION',
    'ACTIVE',
    'ADD', // (R)
    'ADMIN',
    'AFTER',
    'AGAINST',
    'AGGREGATE',
    'AGGREGATOR', // (R)
    'ALGORITHM',
    'ALL', // (R)
    'ALTER', // (R)
    'ALWAYS',
    'ANALYZE', // (R)
    'AND', // (R)
    'ANY',
    'ARRAY',
    'AS', // (R)
    'ASC', // (R)
    'ASCII',
    'ASENSITIVE', // (R)
    'AT',
    'ATTACH', // (R)
    'ATTRIBUTE',
    'AUTHENTICATION',
    'AUTOEXTEND_SIZE',
    'AUTO_INCREMENT',
    'AVG',
    'AVG_ROW_LENGTH',
    'BACKUP',
    'BEFORE', // (R)
    'BEGIN',
    'BETWEEN', // (R)
    'BIGINT', // (R)
    'BINARY', // (R)
    'BINLOG',
    'BIT',
    'BLOB', // (R)
    'BLOCK',
    'BOOL',
    'BOOLEAN',
    'BOOTSTRAP', // (R)
    'BOTH', // (R)
    'BTREE',
    'BUCKETS',
    'BY', // (R)
    'BYTE',
    'CACHE',
    'CALL', // (R)
    'CASCADE', // (R)
    'CASCADED',
    'CASE', // (R)
    'CATALOG_NAME',
    'CHAIN',
    'CHALLENGE_RESPONSE',
    'CHANGE', // (R)
    'CHANGED',
    'CHANNEL',
    'CHAR', // (R)
    'CHARACTER', // (R)
    'CHARSET',
    'CHECK', // (R)
    'CHECKSUM',
    'CIPHER',
    'CLASS_ORIGIN',
    'CLEAR', // (R)
    'CLIENT',
    'CLONE',
    'CLOSE',
    'COALESCE',
    'CODE',
    'COLLATE', // (R)
    'COLLATION',
    'COLUMN', // (R)
    'COLUMNS',
    'COLUMN_FORMAT',
    'COLUMN_NAME',
    'COMMENT',
    'COMMIT',
    'COMMITTED',
    'COMPACT',
    'COMPLETION',
    'COMPONENT',
    'COMPRESSED',
    'COMPRESSION',
    'CONCURRENT',
    'CONDITION', // (R)
    'CONNECTION',
    'CONSISTENT',
    'CONSTRAINT', // (R)
    'CONSTRAINT_CATALOG',
    'CONSTRAINT_NAME',
    'CONSTRAINT_SCHEMA',
    'CONTAINS',
    'CONTEXT',
    'CONTINUE', // (R)
    'CONVERT', // (R)
    'CPU',
    'CREATE', // (R)
    'CROSS', // (R)
    'CUBE', // (R)
    'CUME_DIST', // (R)
    'CURRENT',
    'CURRENT_DATE', // (R)
    'CURRENT_TIME', // (R)
    'CURRENT_TIMESTAMP', // (R)
    'CURRENT_USER', // (R)
    'CURSOR', // (R)
    'CURSOR_NAME',
    'DATA',
    'DATABASE', // (R)
    'DATABASES', // (R)
    'DATAFILE',
    'DATE',
    'DATETIME',
    'DAY',
    'DAY_HOUR', // (R)
    'DAY_MICROSECOND', // (R)
    'DAY_MINUTE', // (R)
    'DAY_SECOND', // (R)
    'DEALLOCATE',
    'DEC', // (R)
    'DECIMAL', // (R)
    'DECLARE', // (R)
    'DEFAULT', // (R)
    'DEFAULT_AUTH',
    'DEFINER',
    'DEFINITION',
    'DELAYED', // (R)
    'DELAY_KEY_WRITE',
    'DELETE', // (R)
    'DENSE_RANK', // (R)
    'DESC', // (R)
    'DESCRIBE', // (R)
    'DESCRIPTION',
    'DETERMINISTIC', // (R)
    'DIAGNOSTICS',
    'DIRECTORY',
    'DISABLE',
    'DISCARD',
    'DISK',
    'DISTINCT', // (R)
    'DISTINCTROW', // (R)
    'DIV', // (R)
    'DO',
    'DOUBLE', // (R)
    'DROP', // (R)
    'DUAL', // (R)
    'DUMPFILE',
    'DUPLICATE',
    'DYNAMIC',
    'EACH', // (R)
    'ELSE', // (R)
    'ELSEIF', // (R)
    'EMPTY', // (R)
    'ENABLE',
    'ENCLOSED', // (R)
    'ENCRYPTION',
    'END',
    'ENDS',
    'ENFORCED',
    'ENGINE',
    'ENGINES',
    'ENGINE_ATTRIBUTE',
    'ENUM',
    'ERROR',
    'ERRORS',
    'ESCAPE',
    'ESCAPED', // (R)
    'EVENT',
    'EVENTS',
    'EVERY',
    'EXCEPT', // (R)
    'EXCHANGE',
    'EXCLUDE',
    'EXECUTE',
    'EXISTS', // (R)
    'EXIT', // (R)
    'EXPANSION',
    'EXPIRE',
    'EXPLAIN', // (R)
    'EXPORT',
    'EXTENDED',
    'EXTENT_SIZE',
    'FACTOR',
    'FAILED_LOGIN_ATTEMPTS',
    'FALSE', // (R)
    'FAST',
    'FAULTS',
    'FETCH', // (R)
    'FIELDS',
    'FILE',
    'FILE_BLOCK_SIZE',
    'FILTER',
    'FINISH',
    'FIRST',
    'FIRST_VALUE', // (R)
    'FIXED',
    'FLOAT', // (R)
    'FLOAT4', // (R)
    'FLOAT8', // (R)
    'FLUSH',
    'FOLLOWING',
    'FOLLOWS',
    'FOR', // (R)
    'FORCE', // (R)
    'FOREIGN', // (R)
    'FORMAT',
    'FOUND',
    'FROM', // (R)
    'FULL',
    'FULLTEXT', // (R)
    'FUNCTION', // (R)
    'GENERAL',
    'GENERATED', // (R)
    'GEOGRAPHY', // (R)
    'GEOGRAPHYPOINT', // (R)
    'GEOMCOLLECTION',
    'GEOMETRY',
    'GEOMETRYCOLLECTION',
    'GET', // (R)
    'GET_FORMAT',
    'GET_MASTER_PUBLIC_KEY',
    'GET_SOURCE_PUBLIC_KEY',
    'GLOBAL',
    'GRANT', // (R)
    'GRANTS',
    'GROUP', // (R)
    'GROUPING', // (R)
    'GROUPS', // (R)
    'GROUP_REPLICATION',
    'GTID_ONLY',
    'HANDLER',
    'HASH',
    'HAVING', // (R)
    'HELP',
    'HIGH_PRIORITY', // (R)
    'HISTOGRAM',
    'HISTORY',
    'HOST',
    'HOSTS',
    'HOUR',
    'HOUR_MICROSECOND', // (R)
    'HOUR_MINUTE', // (R)
    'HOUR_SECOND', // (R)
    'IDENTIFIED',
    'IF', // (R)
    'IGNORE', // (R)
    'IGNORE_SERVER_IDS',
    'IMPORT',
    'IN', // (R)
    'INACTIVE',
    'INDEX', // (R)
    'INDEXES',
    'INFILE', // (R)
    'INITIAL',
    'INITIAL_SIZE',
    'INITIATE',
    'INNER', // (R)
    'INOUT', // (R)
    'INSENSITIVE', // (R)
    'INSERT', // (R)
    'INSERT_METHOD',
    'INSTALL',
    'INSTANCE',
    'IN', // <-- moved over from functions
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
    'INVISIBLE',
    'INVOKER',
    'IO',
    'IO_AFTER_GTIDS', // (R)
    'IO_BEFORE_GTIDS', // (R)
    'IO_THREAD',
    'IPC',
    'IS', // (R)
    'ISOLATION',
    'ISSUER',
    'ITERATE', // (R)
    'JOIN', // (R)
    'JSON',
    'JSON_TABLE', // (R)
    'JSON_VALUE',
    'KEY', // (R)
    'KEYRING',
    'KEYS', // (R)
    'KEY_BLOCK_SIZE',
    'KILL', // (R)
    'LAG', // (R)
    'LANGUAGE',
    'LAST',
    'LAST_VALUE', // (R)
    'LATERAL', // (R)
    'LEAD', // (R)
    'LEADING', // (R)
    'LEAF', // (R)
    'LEAVE', // (R)
    'LEAVES',
    'LEFT', // (R)
    'LESS',
    'LEVEL',
    'LIKE', // (R)
    'LIMIT', // (R)
    'LINEAR', // (R)
    'LINES', // (R)
    'LINESTRING',
    'LIST',
    'LOAD', // (R)
    'LOCAL',
    'LOCALTIME', // (R)
    'LOCALTIMESTAMP', // (R)
    'LOCK', // (R)
    'LOCKED',
    'LOCKS',
    'LOGFILE',
    'LOGS',
    'LONG', // (R)
    'LONGBLOB', // (R)
    'LONGTEXT', // (R)
    'LOOP', // (R)
    'LOW_PRIORITY', // (R)
    'MASTER',
    'MASTER_AUTO_POSITION',
    'MASTER_BIND', // (R)
    'MASTER_COMPRESSION_ALGORITHMS',
    'MASTER_CONNECT_RETRY',
    'MASTER_DELAY',
    'MASTER_HEARTBEAT_PERIOD',
    'MASTER_HOST',
    'MASTER_LOG_FILE',
    'MASTER_LOG_POS',
    'MASTER_PASSWORD',
    'MASTER_PORT',
    'MASTER_PUBLIC_KEY_PATH',
    'MASTER_RETRY_COUNT',
    'MASTER_SSL',
    'MASTER_SSL_CA',
    'MASTER_SSL_CAPATH',
    'MASTER_SSL_CERT',
    'MASTER_SSL_CIPHER',
    'MASTER_SSL_CRL',
    'MASTER_SSL_CRLPATH',
    'MASTER_SSL_KEY',
    'MASTER_SSL_VERIFY_SERVER_CERT', // (R)
    'MASTER_TLS_CIPHERSUITES',
    'MASTER_TLS_VERSION',
    'MASTER_USER',
    'MASTER_ZSTD_COMPRESSION_LEVEL',
    'MATCH', // (R)
    'MAXVALUE', // (R)
    'MAX_CONNECTIONS_PER_HOUR',
    'MAX_QUERIES_PER_HOUR',
    'MAX_ROWS',
    'MAX_SIZE',
    'MAX_UPDATES_PER_HOUR',
    'MAX_USER_CONNECTIONS',
    'MEDIUM',
    'MEDIUMBLOB', // (R)
    'MEDIUMINT', // (R)
    'MEDIUMTEXT', // (R)
    'MEMBER',
    'MEMORY',
    'MERGE',
    'MESSAGE_TEXT',
    'MICROSECOND',
    'MIDDLEINT', // (R)
    'MIGRATE',
    'MINUTE',
    'MINUTE_MICROSECOND', // (R)
    'MINUTE_SECOND', // (R)
    'MIN_ROWS',
    'MOD', // (R)
    'MODE',
    'MODIFIES', // (R)
    'MODIFY',
    'MONTH',
    'MULTILINESTRING',
    'MULTIPOINT',
    'MULTIPOLYGON',
    'MUTEX',
    'MYSQL_ERRNO',
    'NAME',
    'NAMES',
    'NATIONAL',
    'NATURAL', // (R)
    'NCHAR',
    'NDB',
    'NDBCLUSTER',
    'NESTED',
    'NETWORK_NAMESPACE',
    'NEVER',
    'NEW',
    'NEXT',
    'NO',
    'NODEGROUP',
    'NONE',
    'NOT', // (R)
    'NOWAIT',
    'NO_WAIT',
    'NO_WRITE_TO_BINLOG', // (R)
    'NTH_VALUE', // (R)
    'NTILE', // (R)
    'NULL', // (R)
    'NULLS',
    'NUMBER',
    'NUMERIC', // (R)
    'NVARCHAR',
    'OF', // (R)
    'OFF',
    'OFFSET',
    'OJ',
    'OLD',
    'ON', // (R)
    'ONE',
    'ONLY',
    'OPEN',
    'OPTIMIZE', // (R)
    'OPTIMIZER_COSTS', // (R)
    'OPTION', // (R)
    'OPTIONAL',
    'OPTIONALLY', // (R)
    'OPTIONS',
    'OR', // (R)
    'ORPHAN', // (R)
    'ORDER', // (R)
    'ORDINALITY',
    'ORGANIZATION',
    'OTHERS',
    'OUT', // (R)
    'OUTER', // (R)
    'OUTFILE', // (R)
    'OVER', // (R)
    'OWNER',
    'PACK_KEYS',
    'PAGE',
    'PARSER',
    'PARTIAL',
    'PARTITION', // (R)
    'PARTITIONING',
    'PARTITIONS',
    'PASSWORD',
    'PASSWORD_LOCK_TIME',
    'PATH',
    'PERCENT_RANK', // (R)
    'PERSIST',
    'PERSIST_ONLY',
    'PHASE',
    'PLUGIN',
    'PLUGINS',
    'PLUGIN_DIR',
    'POINT',
    'POLYGON',
    'PORT',
    'PRECEDES',
    'PRECEDING',
    'PRECISION', // (R)
    'PREPARE',
    'PRESERVE',
    'PREV',
    'PRIMARY', // (R)
    'PRIVILEGES',
    'PRIVILEGE_CHECKS_USER',
    'PROCEDURE', // (R)
    'PROCESS',
    'PROCESSLIST',
    'PROFILE',
    'PROFILES',
    'PROXY',
    'PURGE', // (R)
    'QUARTER',
    'QUERY',
    'QUICK',
    'RANDOM',
    'RANGE', // (R)
    'RANK', // (R)
    'READ', // (R)
    'READS', // (R)
    'READ_ONLY',
    'READ_WRITE', // (R)
    'REAL', // (R)
    'REBALANCE', // (R)
    'REBUILD',
    'RECORD', // (R)
    'RECOVER',
    'RECURSIVE', // (R)
    'REDO_BUFFER_SIZE',
    'REDUNDANCY', // (R)
    'REDUNDANT',
    'REFERENCE',
    'REFERENCES', // (R)
    'REGEXP', // (R)
    'REGISTRATION',
    'RELAY',
    'RELAYLOG',
    'RELAY_LOG_FILE',
    'RELAY_LOG_POS',
    'RELAY_THREAD',
    'RELEASE', // (R)
    'RELOAD',
    'REMOVE',
    'RENAME', // (R)
    'REORGANIZE',
    'REPAIR',
    'REPEAT', // (R)
    'REPEATABLE',
    'REPLACE', // (R)
    'REPLICA',
    'REPLICAS',
    'REPLICATE', // (R)
    'REPLICATE_DO_DB',
    'REPLICATE_DO_TABLE',
    'REPLICATE_IGNORE_DB',
    'REPLICATE_IGNORE_TABLE',
    'REPLICATE_REWRITE_DB',
    'REPLICATE_WILD_DO_TABLE',
    'REPLICATE_WILD_IGNORE_TABLE',
    'REPLICATING', // (R)
    'REPLICATION',
    'REQUIRE', // (R)
    'REQUIRE_ROW_FORMAT',
    'RESET',
    'RESIGNAL', // (R)
    'RESOURCE',
    'RESPECT',
    'RESTART',
    'RESTORE',
    'RESTRICT', // (R)
    'RESUME',
    'RETAIN',
    'RETURN', // (R)
    'RETURNED_SQLSTATE',
    'RETURNING',
    'RETURNS',
    'REUSE',
    'REVERSE',
    'REVOKE', // (R)
    'RIGHT', // (R)
    'RLIKE', // (R)
    'ROLE',
    'ROLLBACK',
    'ROLLUP',
    'ROTATE',
    'ROUTINE',
    'ROW', // (R)
    'ROWS', // (R)
    'ROW_COUNT',
    'ROW_FORMAT',
    'ROW_NUMBER', // (R)
    'RTREE',
    'SAVEPOINT',
    'SCHEDULE',
    'SCHEMA', // (R)
    'SCHEMAS', // (R)
    'SCHEMA_NAME',
    'SECOND',
    'SECONDARY',
    'SECONDARY_ENGINE',
    'SECONDARY_ENGINE_ATTRIBUTE',
    'SECONDARY_LOAD',
    'SECONDARY_UNLOAD',
    'SECOND_MICROSECOND', // (R)
    'SECURITY',
    'SELECT', // (R)
    'SENSITIVE', // (R)
    'SEPARATOR', // (R)
    'SERIAL',
    'SERIALIZABLE',
    'SERVER',
    'SESSION',
    'SET', // (R)
    'SHARE',
    'SHOW', // (R)
    'SHUTDOWN',
    'SIGNAL', // (R)
    'SIGNED',
    'SIMPLE',
    'SKIP',
    'SLAVE',
    'SLOW',
    'SMALLINT', // (R)
    'SNAPSHOT',
    'SOCKET',
    'SOME',
    'SONAME',
    'SOUNDS',
    'SOURCE',
    'SOURCE_AUTO_POSITION',
    'SOURCE_BIND',
    'SOURCE_COMPRESSION_ALGORITHMS',
    'SOURCE_CONNECT_RETRY',
    'SOURCE_DELAY',
    'SOURCE_HEARTBEAT_PERIOD',
    'SOURCE_HOST',
    'SOURCE_LOG_FILE',
    'SOURCE_LOG_POS',
    'SOURCE_PASSWORD',
    'SOURCE_PORT',
    'SOURCE_PUBLIC_KEY_PATH',
    'SOURCE_RETRY_COUNT',
    'SOURCE_SSL',
    'SOURCE_SSL_CA',
    'SOURCE_SSL_CAPATH',
    'SOURCE_SSL_CERT',
    'SOURCE_SSL_CIPHER',
    'SOURCE_SSL_CRL',
    'SOURCE_SSL_CRLPATH',
    'SOURCE_SSL_KEY',
    'SOURCE_SSL_VERIFY_SERVER_CERT',
    'SOURCE_TLS_CIPHERSUITES',
    'SOURCE_TLS_VERSION',
    'SOURCE_USER',
    'SOURCE_ZSTD_COMPRESSION_LEVEL',
    'SPATIAL', // (R)
    'SPECIFIC', // (R)
    'SQL', // (R)
    'SQLEXCEPTION', // (R)
    'SQLSTATE', // (R)
    'SQLWARNING', // (R)
    'SQL_AFTER_GTIDS',
    'SQL_AFTER_MTS_GAPS',
    'SQL_BEFORE_GTIDS',
    'SQL_BIG_RESULT', // (R)
    'SQL_BUFFER_RESULT',
    'SQL_CALC_FOUND_ROWS', // (R)
    'SQL_NO_CACHE',
    'SQL_SMALL_RESULT', // (R)
    'SQL_THREAD',
    'SQL_TSI_DAY',
    'SQL_TSI_HOUR',
    'SQL_TSI_MINUTE',
    'SQL_TSI_MONTH',
    'SQL_TSI_QUARTER',
    'SQL_TSI_SECOND',
    'SQL_TSI_WEEK',
    'SQL_TSI_YEAR',
    'SRID',
    'SSL', // (R)
    'STACKED',
    'START',
    'STARTING', // (R)
    'STARTS',
    'STATS_AUTO_RECALC',
    'STATS_PERSISTENT',
    'STATS_SAMPLE_PAGES',
    'STATUS',
    'STOP',
    'STORAGE',
    'STORED', // (R)
    'STRAIGHT_JOIN', // (R)
    'STREAM',
    'STRING',
    'SUBCLASS_ORIGIN',
    'SUBJECT',
    'SUBPARTITION',
    'SUBPARTITIONS',
    'SUPER',
    'SUSPEND',
    'SWAPS',
    'SWITCHES',
    'SYSTEM', // (R)
    'TABLE', // (R)
    'TABLES',
    'TABLESPACE',
    'TABLE_CHECKSUM',
    'TABLE_NAME',
    'TEMPORARY',
    'TEMPTABLE',
    'TERMINATED', // (R)
    'TEXT',
    'THAN',
    'THEN', // (R)
    'THREAD_PRIORITY',
    'TIES',
    'TIME',
    'TIMESTAMP',
    'TIMESTAMPADD',
    'TIMESTAMPDIFF',
    'TINYBLOB', // (R)
    'TINYINT', // (R)
    'TINYTEXT', // (R)
    'TLS',
    'TO', // (R)
    'TRAILING', // (R)
    'TRANSACTION',
    'TRIGGER', // (R)
    'TRIGGERS',
    'TRUE', // (R)
    'TRUNCATE',
    'TYPE',
    'TYPES',
    'UNBOUNDED',
    'UNCOMMITTED',
    'UNDEFINED',
    'UNDO', // (R)
    'UNDOFILE',
    'UNDO_BUFFER_SIZE',
    'UNICODE',
    'UNINSTALL',
    'UNION', // (R)
    'UNIQUE', // (R)
    'UNKNOWN',
    'UNLOCK', // (R)
    'UNREGISTER',
    'UNSIGNED', // (R)
    'UNTIL',
    'UPDATE', // (R)
    'UPGRADE',
    'USAGE', // (R)
    'USE', // (R)
    'USER',
    'USER_RESOURCES',
    'USE_FRM',
    'USING', // (R)
    'UTC_DATE', // (R)
    'UTC_TIME', // (R)
    'UTC_TIMESTAMP', // (R)
    'VALIDATION',
    'VALUE',
    'VALUES', // (R)
    'VARBINARY', // (R)
    'VARCHAR', // (R)
    'VARCHARACTER', // (R)
    'VARIABLES',
    'VARYING', // (R)
    'VCPU',
    'VIEW',
    'VIRTUAL', // (R)
    'VISIBLE',
    'WAIT',
    'WARNINGS',
    'WEEK',
    'WEIGHT_STRING',
    'WHEN', // (R)
    'WHERE', // (R)
    'WHILE', // (R)
    'WINDOW', // (R)
    'WITH', // (R)
    'WITHOUT',
    'WORK',
    'WRAPPER',
    'WRITE', // (R)
    'X509',
    'XA',
    'XID',
    'XML',
    'XOR', // (R)
    'YEAR',
    'YEAR_MONTH', // (R)
    'ZEROFILL', // (R)
    'ZONE',
  ],
  constraints: ['ON DELETE', 'ON UPDATE'],
  charset: ['CHARACTER SET'],
});
