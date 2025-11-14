import { DialectOptions } from '../../dialect.js';
import { expandPhrases } from '../../expandPhrases.js';
import { functions } from './clickhouse.functions.js';
import { dataTypes, keywords, keywordPhrases } from './clickhouse.keywords.js';

const reservedSelect = expandPhrases(['SELECT [DISTINCT]']);

const reservedClauses = expandPhrases([
  // https://clickhouse.com/docs/sql-reference/statements/explain
  'EXPLAIN [AST | SYNTAX | QUERY TREE | PLAN | PIPELINE | ESTIMATE | TABLE OVERRIDE]',
]);

const standardOnelineClauses = expandPhrases([
  // https://clickhouse.com/docs/sql-reference/statements/create
  'CREATE [OR REPLACE] [TEMPORARY] TABLE [IF NOT EXISTS]',
  // https://clickhouse.com/docs/sql-reference/statements/update
  'UPDATE',
  // https://clickhouse.com/docs/sql-reference/statements/system
  'SYSTEM RELOAD {DICTIONARIES | DICTIONARY | FUNCTIONS | FUNCTION | ASYNCHRONOUS METRICS} [ON CLUSTER]',
  'SYSTEM DROP {DNS CACHE | MARK CACHE | ICEBERG METADATA CACHE | TEXT INDEX DICTIONARY CACHE | TEXT INDEX HEADER CACHE | TEXT INDEX POSTINGS CACHE | REPLICA | DATABASE REPLICA | UNCOMPRESSED CACHE | COMPILED EXPRESSION CACHE | QUERY CONDITION CACHE | QUERY CACHE | FORMAT SCHEMA CACHE | DROP FILESYSTEM CACHE}',
  'SYSTEM FLUSH LOGS',
  'SYSTEM RELOAD {CONFIG | USERS}',
  'SYSTEM SHUTDOWN',
  'SYSTEM KILL',
  'SYSTEM FLUSH DISTRIBUTED',
  'SYSTEM START DISTRIBUTED SENDS',
  'SYSTEM {STOP | START} {LISTEN | MERGES | TTL MERGES | MOVES | FETCHES | REPLICATED SENDS | REPLICATION QUEUES | PULLING REPLICATION LOG}',
  'SYSTEM {SYNC | RESTART | RESTORE} REPLICA',
  'SYSTEM {SYNC | RESTORE} DATABASE REPLICA',
  'SYSTEM RESTART REPLICAS',
  'SYSTEM UNFREEZE',
  'SYSTEM WAIT LOADING PARTS',
  'SYSTEM {LOAD | UNLOAD} PRIMARY KEY',
  'SYSTEM {STOP | START} [REPLICATED] VIEW',
  'SYSTEM {STOP | START} VIEWS',
  'SYSTEM {REFRESH | CANCEL | WAIT} VIEW',
  // https://clickhouse.com/docs/sql-reference/statements/show
  'SHOW [CREATE] {TABLE | TEMPORARY TABLE | DICTIONARY | VIEW | DATABASE}',
  'SHOW DATABASES [[NOT] {LIKE | ILIKE}]',
  'SHOW [FULL] [TEMPORARY] TABLES [FROM | IN]',
  'SHOW [EXTENDED] [FULL] COLUMNS {FROM | IN}',
  // https://clickhouse.com/docs/sql-reference/statements/attach
  'ATTACH {TABLE | DICTIONARY | DATABASE} [IF NOT EXISTS]',
  // https://clickhouse.com/docs/sql-reference/statements/detach
  'DETACH {TABLE | DICTIONARY | DATABASE} [IF EXISTS]',
  // https://clickhouse.com/docs/sql-reference/statements/drop
  'DROP {DICTIONARY | DATABASE | USER | ROLE | QUOTA | PROFILE | SETTINGS PROFILE | VIEW | FUNCTION | NAMED COLLECTION | ROW POLICY | POLICY} [IF EXISTS]',
  'DROP [TEMPORARY] TABLE [IF EXISTS] [IF EMPTY]',
  // https://clickhouse.com/docs/sql-reference/statements/exists
  'EXISTS [TEMPORARY] {TABLE | DICTIONARY | DATABASE}',
  // https://clickhouse.com/docs/sql-reference/statements/kill
  'KILL QUERY [ON CLUSTER]',
  // https://clickhouse.com/docs/sql-reference/statements/optimize
  'OPTIMIZE TABLE',
  // https://clickhouse.com/docs/sql-reference/statements/rename
  'RENAME [TABLE | DICTIONARY | DATABASE]',
  // https://clickhouse.com/docs/sql-reference/statements/exchange
  'EXCHANGE {TABLES | DICTIONARIES}',
  // https://clickhouse.com/docs/sql-reference/statements/set
  'SET',
  // https://clickhouse.com/docs/sql-reference/statements/set-role
  'SET ROLE [DEFAULT | NONE | ALL | ALL EXCEPT]',
  'SET DEFAULT ROLE [NONE]',
  // https://clickhouse.com/docs/sql-reference/statements/truncate
  'TRUNCATE TABLE [IF EXISTS]',
  // https://clickhouse.com/docs/sql-reference/statements/execute_as
  'EXECUTE AS',
  // https://clickhouse.com/docs/sql-reference/statements/use
  'USE',
  // https://clickhouse.com/docs/sql-reference/statements/move
  'MOVE {USER | ROLE | QUOTA | SETTINGS PROFILE | ROW POLICY}',
  // https://clickhouse.com/docs/sql-reference/statements/check-grant
  'CHECK GRANT',
  // https://clickhouse.com/docs/sql-reference/statements/undrop
  'UNDROP TABLE',
]);
const tabularOnelineClauses = expandPhrases([
  // https://clickhouse.com/docs/sql-reference/statements/create
  'CREATE {DATABASE | NAMED COLLECTION} [IF NOT EXISTS]',
  'CREATE [OR REPLACE] {VIEW | DICTIONARY} [IF NOT EXISTS]',
  'CREATE MATERIALIZED VIEW [IF NOT EXISTS]',
  'CREATE FUNCTION',
  'CREATE {USER | ROLE | QUOTA | SETTINGS PROFILE} [IF NOT EXISTS | OR REPLACE]',
  'CREATE [ROW] POLICY [IF NOT EXISTS | OR REPLACE]',
  // https://clickhouse.com/docs/sql-reference/statements/create/table#replace-table
  'REPLACE [TEMPORARY] TABLE [IF NOT EXISTS]',
  // https://clickhouse.com/docs/sql-reference/statements/alter
  'ALTER [TEMPORARY] TABLE',
  'ALTER {USER | ROLE | QUOTA | SETTINGS PROFILE} [IF EXISTS]',
  'ALTER [ROW] POLICY [IF EXISTS]',
  'ALTER NAMED COLLECTION [IF EXISTS]',
  // https://clickhouse.com/docs/sql-reference/statements/delete
  'DELETE FROM',
  // https://clickhouse.com/docs/sql-reference/statements/grant
  'GRANT [ON CLUSTER]',
  // https://clickhouse.com/docs/sql-reference/statements/revoke
  'REVOKE [ON CLUSTER]',
  // https://clickhouse.com/docs/sql-reference/statements/check-table
  'CHECK TABLE',
  // https://clickhouse.com/docs/sql-reference/statements/describe-table
  '{DESC | DESCRIBE} TABLE',
]);

const reservedSetOperations = expandPhrases([
  // https://clickhouse.com/docs/sql-reference/statements/select/set-operations
  'UNION [ALL | DISTINCT]',
  // https://clickhouse.com/docs/sql-reference/statements/parallel_with
  'PARALLEL WITH',
]);

const reservedJoins = expandPhrases([
  // https://clickhouse.com/docs/sql-reference/statements/select/join
  '[GLOBAL] [INNER|LEFT|RIGHT|FULL|CROSS] [OUTER|SEMI|ANTI|ANY|ALL|ASOF] JOIN',
]);

// https://clickhouse.com/docs/sql-reference/syntax
export const clickhouse: DialectOptions = {
  name: 'clickhouse',
  tokenizerOptions: {
    reservedSelect,
    reservedClauses: [...reservedClauses, ...standardOnelineClauses, ...tabularOnelineClauses],
    reservedSetOperations,
    reservedJoins,
    reservedKeywordPhrases: keywordPhrases,

    reservedKeywords: keywords,
    reservedDataTypes: dataTypes,
    reservedFunctionNames: functions,
    nestedBlockComments: false,
    underscoresInNumbers: true,
    stringTypes: ['$$', "''-qq", "''-qq-bs"],
    identTypes: ['""-qq', '``'],
    paramTypes: {
      // https://clickhouse.com/docs/sql-reference/syntax#defining-and-using-query-parameters
      custom: [
        {
          regex: String.raw`\{\s*[a-zA-Z0-9_]+\s*:\s*[a-zA-Z0-9_]+\s*\}`,
          key: v => {
            const [key] = v.split(':');
            return key.trim();
          },
        },
      ],
    },
    operators: [
      // Arithmetic
      '%', // modulo

      // Ternary
      '?',
      ':',

      // Lambda creation
      '->',
    ],
  },
  formatOptions: {
    onelineClauses: standardOnelineClauses,
    tabularOnelineClauses,
  },
};
