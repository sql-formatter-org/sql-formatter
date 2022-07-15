import { flatKeywordList } from '../../utils';

export const keywords = flatKeywordList({
  // https://cwiki.apache.org/confluence/display/hive/languagemanual+ddl
  // Non-reserved keywords have proscribed meanings in. HiveQL, but can still be used as table or column names
  nonReserved: [
    'ADD',
    'ADMIN',
    'AFTER',
    'ANALYZE',
    'ARCHIVE',
    'ASC',
    'BEFORE',
    'BUCKET',
    'BUCKETS',
    'CASCADE',
    'CHANGE',
    'CLUSTER',
    'CLUSTERED',
    'CLUSTERSTATUS',
    'COLLECTION',
    'COLUMNS',
    'COMMENT',
    'COMPACT',
    'COMPACTIONS',
    'COMPUTE',
    'CONCATENATE',
    'CONTINUE',
    'DATA',
    'DATABASES',
    'DATETIME',
    'DAY',
    'DBPROPERTIES',
    'DEFERRED',
    'DEFINED',
    'DELIMITED',
    'DEPENDENCY',
    'DESC',
    'DIRECTORIES',
    'DIRECTORY',
    'DISABLE',
    'DISTRIBUTE',
    'ELEM_TYPE',
    'ENABLE',
    'ESCAPED',
    'EXCLUSIVE',
    'EXPLAIN',
    'EXPORT',
    'FIELDS',
    'FILE',
    'FILEFORMAT',
    'FIRST',
    'FORMAT',
    'FORMATTED',
    'FUNCTIONS',
    'HOLD_DDLTIME',
    'HOUR',
    'IDXPROPERTIES',
    'IGNORE',
    'INDEX',
    'INDEXES',
    'INPATH',
    'INPUTDRIVER',
    'INPUTFORMAT',
    'ITEMS',
    'JAR',
    'KEYS',
    'KEY_TYPE',
    'LIMIT',
    'LINES',
    'LOAD',
    'LOCATION',
    'LOCK',
    'LOCKS',
    'LOGICAL',
    'LONG',
    'MAPJOIN',
    'MATERIALIZED',
    'METADATA',
    'MINUS',
    'MINUTE',
    'MONTH',
    'MSCK',
    'NOSCAN',
    'NO_DROP',
    'OFFLINE',
    'OPTION',
    'OUTPUTDRIVER',
    'OUTPUTFORMAT',
    'OVERWRITE',
    'OWNER',
    'PARTITIONED',
    'PARTITIONS',
    'PLUS',
    'PRETTY',
    'PRINCIPALS',
    'PROTECTION',
    'PURGE',
    'READ',
    'READONLY',
    'REBUILD',
    'RECORDREADER',
    'RECORDWRITER',
    'RELOAD',
    'RENAME',
    'REPAIR',
    'REPLACE',
    'REPLICATION',
    'RESTRICT',
    'REWRITE',
    'ROLE',
    'ROLES',
    'SCHEMA',
    'SCHEMAS',
    'SECOND',
    'SEMI',
    'SERDE',
    'SERDEPROPERTIES',
    'SERVER',
    'SETS',
    'SHARED',
    'SHOW',
    'SHOW_DATABASE',
    'SKEWED',
    'SORT',
    'SORTED',
    'SSL',
    'STATISTICS',
    'STORED',
    'STREAMTABLE',
    'STRING',
    'STRUCT',
    'TABLES',
    'TBLPROPERTIES',
    'TEMPORARY',
    'TERMINATED',
    'TINYINT',
    'TOUCH',
    'TRANSACTIONS',
    'UNARCHIVE',
    'UNDO',
    'UNIONTYPE',
    'UNLOCK',
    'UNSET',
    'UNSIGNED',
    'URI',
    // 'USE',
    'UTC',
    'UTCTIMESTAMP',
    'VALUE_TYPE',
    'VIEW',
    'WHILE',
    'YEAR',
    'AUTOCOMMIT',
    'ISOLATION',
    'LEVEL',
    'OFFSET',
    'SNAPSHOT',
    'TRANSACTION',
    'WORK',
    'WRITE',
    'ABORT',
    'KEY',
    'LAST',
    'NORELY',
    'NOVALIDATE',
    'NULLS',
    'RELY',
    'VALIDATE',
    'DETAIL',
    'DOW',
    'EXPRESSION',
    'OPERATOR',
    'QUARTER',
    'SUMMARY',
    'VECTORIZATION',
    'WEEK',
    'YEARS',
    'MONTHS',
    'WEEKS',
    'DAYS',
    'HOURS',
    'MINUTES',
    'SECONDS',
    'TIMESTAMPTZ',
    'ZONE',
  ],
  reserved: [
    // reserved
    'ALL',
    // 'ALTER',
    // 'AND',
    'ARRAY',
    'AS',
    'AUTHORIZATION',
    'BETWEEN',
    'BIGINT',
    'BINARY',
    'BOOLEAN',
    'BOTH',
    'BY',
    // 'CASE',
    'CAST',
    'CHAR',
    'COLUMN',
    'CONF',
    // 'CREATE',
    'CROSS',
    'CUBE',
    'CURRENT',
    'CURRENT_DATE',
    'CURRENT_TIMESTAMP',
    'CURSOR',
    'DATABASE',
    'DATE',
    'DECIMAL',
    'DELETE',
    // 'DESCRIBE',
    'DISTINCT',
    'DOUBLE',
    // 'DROP',
    // 'ELSE',
    // 'END',
    'EXCHANGE',
    'EXISTS',
    'EXTENDED',
    'EXTERNAL',
    'FALSE',
    // 'FETCH',
    'FLOAT',
    'FOLLOWING',
    'FOR',
    // 'FROM',
    'FULL',
    'FUNCTION',
    'GRANT',
    // 'GROUP',
    'GROUPING',
    // 'HAVING',
    'IF',
    'IMPORT',
    'IN',
    'INNER',
    // 'INSERT',
    'INT',
    // 'INTERSECT',
    'INTERVAL',
    'INTO',
    'IS',
    // 'JOIN',
    'LATERAL',
    'LEFT',
    'LESS',
    'LIKE',
    'LOCAL',
    'MACRO',
    'MAP',
    'MORE',
    'NONE',
    'NOT',
    'NULL',
    'OF',
    'ON',
    // 'OR',
    'ORDER',
    'OUT',
    'OUTER',
    'OVER',
    'PARTIALSCAN',
    'PARTITION',
    'PERCENT',
    'PRECEDING',
    'PRESERVE',
    'PROCEDURE',
    'RANGE',
    'READS',
    'REDUCE',
    'REVOKE',
    'RIGHT',
    'ROLLUP',
    'ROW',
    'ROWS',
    // 'SELECT',
    'SET',
    'SMALLINT',
    'TABLE',
    'TABLESAMPLE',
    'THEN',
    'TIMESTAMP',
    'TO',
    'TRANSFORM',
    'TRIGGER',
    'TRUE',
    // 'TRUNCATE',
    'UNBOUNDED',
    // 'UNION',
    'UNIQUEJOIN',
    // 'UPDATE',
    'USER',
    'USING',
    'UTC_TMESTAMP',
    // 'VALUES',
    'VARCHAR',
    // 'WHEN',
    // 'WHERE',
    'WINDOW',
    // 'WITH',
    'COMMIT',
    'ONLY',
    'REGEXP',
    'RLIKE',
    'ROLLBACK',
    'START',
    'CACHE',
    'CONSTRAINT',
    'FOREIGN',
    'PRIMARY',
    'REFERENCES',
    'DAYOFWEEK',
    'EXTRACT',
    'FLOOR',
    'INTEGER',
    'PRECISION',
    'VIEWS',
    'TIME',
    'NUMERIC',
    'SYNC',
  ],
  fileTypes: [
    'TEXTFILE',
    'SEQUENCEFILE',
    'ORC',
    'CSV',
    'TSV',
    'PARQUET',
    'AVRO',
    'RCFILE',
    'JSONFILE',
    'INPUTFORMAT',
    'OUTPUTFORMAT',
  ],
});
