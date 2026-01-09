import { DialectOptions } from '../../dialect.js';
import { expandPhrases } from '../../expandPhrases.js';
import { EOF_TOKEN, isToken, Token, TokenType } from '../../lexer/token.js';
import { functions } from './clickhouse.functions.js';
import { dataTypes, keywords } from './clickhouse.keywords.js';

const reservedSelect = expandPhrases([
  'SELECT [DISTINCT]',
  // https://clickhouse.com/docs/sql-reference/statements/alter/view
  'MODIFY QUERY SELECT [DISTINCT]',
]);

const reservedClauses = expandPhrases([
  'SET',
  // https://clickhouse.com/docs/sql-reference/statements/select
  'WITH',
  'FROM',
  'SAMPLE',
  'PREWHERE',
  'WHERE',
  'GROUP BY',
  'HAVING',
  'QUALIFY',
  'ORDER BY',
  'LIMIT', // Note: Clickhouse has no OFFSET clause
  'SETTINGS',
  'INTO OUTFILE',
  'FORMAT',
  // https://clickhouse.com/docs/sql-reference/window-functions
  'WINDOW',
  'PARTITION BY',
  // https://clickhouse.com/docs/sql-reference/statements/insert-into
  'INSERT INTO',
  'VALUES',
  // https://clickhouse.com/docs/sql-reference/statements/create/view#refreshable-materialized-view
  'DEPENDS ON',
  // https://clickhouse.com/docs/sql-reference/statements/move
  'MOVE {USER | ROLE | QUOTA | SETTINGS PROFILE | ROW POLICY}',
  // https://clickhouse.com/docs/sql-reference/statements/grant
  'GRANT',
  // https://clickhouse.com/docs/sql-reference/statements/revoke
  'REVOKE',
  // https://clickhouse.com/docs/sql-reference/statements/check-grant
  'CHECK GRANT',
  // https://clickhouse.com/docs/sql-reference/statements/set-role
  'SET [DEFAULT] ROLE [NONE | ALL | ALL EXCEPT]',
  // https://clickhouse.com/docs/sql-reference/statements/optimize
  'DEDUPLICATE BY',
  // https://clickhouse.com/docs/sql-reference/statements/alter/statistics
  'MODIFY STATISTICS',
  // Used for ALTER INDEX ... TYPE and ALTER STATISTICS ... TYPE
  'TYPE',
  // https://clickhouse.com/docs/sql-reference/statements/alter
  'ALTER USER [IF EXISTS]',
  'ALTER [ROW] POLICY [IF EXISTS]',
  // https://clickhouse.com/docs/sql-reference/statements/drop
  'DROP {USER | ROLE | QUOTA | PROFILE | SETTINGS PROFILE | ROW POLICY | POLICY} [IF EXISTS]',
]);

const standardOnelineClauses = expandPhrases([
  // https://clickhouse.com/docs/sql-reference/statements/create
  'CREATE [OR REPLACE] [TEMPORARY] TABLE [IF NOT EXISTS]',
]);
const tabularOnelineClauses = expandPhrases([
  'ALL EXCEPT',
  'ON CLUSTER',
  // https://clickhouse.com/docs/sql-reference/statements/update
  'UPDATE',
  // https://clickhouse.com/docs/sql-reference/statements/system
  'SYSTEM RELOAD {DICTIONARIES | DICTIONARY | FUNCTIONS | FUNCTION | ASYNCHRONOUS METRICS}',
  'SYSTEM DROP {DNS CACHE | MARK CACHE | ICEBERG METADATA CACHE | TEXT INDEX DICTIONARY CACHE | TEXT INDEX HEADER CACHE | TEXT INDEX POSTINGS CACHE | REPLICA | DATABASE REPLICA | UNCOMPRESSED CACHE | COMPILED EXPRESSION CACHE | QUERY CONDITION CACHE | QUERY CACHE | FORMAT SCHEMA CACHE | FILESYSTEM CACHE}',
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
  'WITH NAME',
  // https://clickhouse.com/docs/sql-reference/statements/show
  'SHOW [CREATE] {TABLE | TEMPORARY TABLE | DICTIONARY | VIEW | DATABASE}',
  'SHOW DATABASES [[NOT] {LIKE | ILIKE}]',
  'SHOW [FULL] [TEMPORARY] TABLES [FROM | IN]',
  'SHOW [EXTENDED] [FULL] COLUMNS {FROM | IN}',
  // https://clickhouse.com/docs/sql-reference/statements/attach
  'ATTACH {TABLE | DICTIONARY | DATABASE} [IF NOT EXISTS]',
  // https://clickhouse.com/docs/sql-reference/statements/detach
  'DETACH {TABLE | DICTIONARY | DATABASE} [IF EXISTS]',
  'PERMANENTLY',
  'SYNC',
  // https://clickhouse.com/docs/sql-reference/statements/drop
  'DROP {DICTIONARY | DATABASE | PROFILE | VIEW | FUNCTION | NAMED COLLECTION} [IF EXISTS]',
  'DROP [TEMPORARY] TABLE [IF EXISTS] [IF EMPTY]',
  // https://clickhouse.com/docs/sql-reference/statements/alter/table#rename
  'RENAME TO',
  // https://clickhouse.com/docs/sql-reference/statements/exists
  'EXISTS [TEMPORARY] {TABLE | DICTIONARY | DATABASE}',
  // https://clickhouse.com/docs/sql-reference/statements/kill
  'KILL QUERY',
  // https://clickhouse.com/docs/sql-reference/statements/optimize
  'OPTIMIZE TABLE',
  // https://clickhouse.com/docs/sql-reference/statements/rename
  'RENAME {TABLE | DICTIONARY | DATABASE}',
  // https://clickhouse.com/docs/sql-reference/statements/exchange
  'EXCHANGE {TABLES | DICTIONARIES}',
  // https://clickhouse.com/docs/sql-reference/statements/truncate
  'TRUNCATE TABLE [IF EXISTS]',
  // https://clickhouse.com/docs/sql-reference/statements/execute_as
  'EXECUTE AS',
  // https://clickhouse.com/docs/sql-reference/statements/use
  'USE',
  'TO',
  // https://clickhouse.com/docs/sql-reference/statements/undrop
  'UNDROP TABLE',
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
  'ALTER {ROLE | QUOTA | SETTINGS PROFILE} [IF EXISTS]',
  'ALTER [TEMPORARY] TABLE',
  'ALTER NAMED COLLECTION [IF EXISTS]',
  // https://clickhouse.com/docs/sql-reference/statements/alter/user
  'GRANTEES',
  'NOT IDENTIFIED',
  'RESET AUTHENTICATION METHODS TO NEW',
  '{IDENTIFIED | ADD IDENTIFIED} [WITH | BY]',
  '[ADD | DROP] HOST {LOCAL | NAME | REGEXP | IP | LIKE}',
  'VALID UNTIL',
  'DROP [ALL] {PROFILES | SETTINGS}',
  '{ADD | MODIFY} SETTINGS',
  'ADD PROFILES',
  // https://clickhouse.com/docs/sql-reference/statements/alter/apply-deleted-mask
  'APPLY DELETED MASK',
  'IN PARTITION',
  // https://clickhouse.com/docs/sql-reference/statements/alter/column
  '{ADD | DROP | RENAME | CLEAR | COMMENT | MODIFY | ALTER | MATERIALIZE} COLUMN',
  // https://clickhouse.com/docs/sql-reference/statements/alter/partition
  '{DETACH | DROP | ATTACH | FETCH | MOVE} {PART | PARTITION}',
  'DROP DETACHED {PART | PARTITION}',
  '{FORGET | REPLACE} PARTITION',
  'CLEAR COLUMN',
  '{FREEZE | UNFREEZE} [PARTITION]',
  'CLEAR INDEX',
  'TO {DISK | VOLUME}',
  '[DELETE | REWRITE PARTS] IN PARTITION',
  // https://clickhouse.com/docs/sql-reference/statements/alter/setting
  '{MODIFY | RESET} SETTING',
  // https://clickhouse.com/docs/sql-reference/statements/alter/delete
  'DELETE WHERE',
  // https://clickhouse.com/docs/sql-reference/statements/alter/order-by
  'MODIFY ORDER BY',
  // https://clickhouse.com/docs/sql-reference/statements/alter/sample-by
  '{MODIFY | REMOVE} SAMPLE BY',
  // https://clickhouse.com/docs/sql-reference/statements/alter/skipping-index
  '{ADD | MATERIALIZE | CLEAR} INDEX [IF NOT EXISTS]',
  'DROP INDEX [IF EXISTS]',
  'GRANULARITY',
  'AFTER',
  'FIRST',

  // https://clickhouse.com/docs/sql-reference/statements/alter/constraint
  'ADD CONSTRAINT [IF NOT EXISTS]',
  'DROP CONSTRAINT [IF EXISTS]',
  // https://clickhouse.com/docs/sql-reference/statements/alter/ttl
  'MODIFY TTL',
  'REMOVE TTL',
  // https://clickhouse.com/docs/sql-reference/statements/alter/statistics
  'ADD STATISTICS [IF NOT EXISTS]',
  '{DROP | CLEAR} STATISTICS [IF EXISTS]',
  'MATERIALIZE STATISTICS [ALL | IF EXISTS]',
  // https://clickhouse.com/docs/sql-reference/statements/alter/quota
  'KEYED BY',
  'NOT KEYED',
  'FOR [RANDOMIZED] INTERVAL',
  // https://clickhouse.com/docs/sql-reference/statements/alter/row-policy
  'AS {PERMISSIVE | RESTRICTIVE}',
  'FOR SELECT',
  // https://clickhouse.com/docs/sql-reference/statements/alter/projection
  'ADD PROJECTION [IF NOT EXISTS]',
  '{DROP | MATERIALIZE | CLEAR} PROJECTION [IF EXISTS]',
  // https://clickhouse.com/docs/sql-reference/statements/create/view#refreshable-materialized-view
  'REFRESH {EVERY | AFTER}',
  'RANDOMIZE FOR',
  'APPEND',
  'APPEND TO',
  // https://clickhouse.com/docs/sql-reference/statements/delete
  'DELETE FROM',
  // https://clickhouse.com/docs/sql-reference/statements/explain
  'EXPLAIN [AST | SYNTAX | QUERY TREE | PLAN | PIPELINE | ESTIMATE | TABLE OVERRIDE]',
  // https://clickhouse.com/docs/sql-reference/statements/grant
  'GRANT ON CLUSTER',
  'GRANT CURRENT GRANTS',
  'WITH GRANT OPTION',
  // https://clickhouse.com/docs/sql-reference/statements/revoke
  'REVOKE ON CLUSTER',
  'ADMIN OPTION FOR',
  // https://clickhouse.com/docs/sql-reference/statements/check-table
  'CHECK TABLE',
  'PARTITION ID',
  // https://clickhouse.com/docs/sql-reference/statements/describe-table
  '{DESC | DESCRIBE} TABLE',
]);

const reservedSetOperations = expandPhrases([
  // https://clickhouse.com/docs/sql-reference/statements/select/union
  'UNION [ALL | DISTINCT]',
  // https://clickhouse.com/docs/sql-reference/statements/parallel_with
  'PARALLEL WITH',
]);

const reservedJoins = expandPhrases([
  // https://clickhouse.com/docs/sql-reference/statements/select/join
  '[GLOBAL] [INNER|LEFT|RIGHT|FULL|CROSS] [OUTER|SEMI|ANTI|ANY|ALL|ASOF] JOIN',
  // https://clickhouse.com/docs/sql-reference/statements/select/array-join
  '[LEFT] ARRAY JOIN',
]);

const reservedKeywordPhrases = expandPhrases([
  '{ROWS | RANGE} BETWEEN',
  'ALTER MATERIALIZE STATISTICS',
]);

// https://clickhouse.com/docs/sql-reference/syntax
export const clickhouse: DialectOptions = {
  name: 'clickhouse',
  tokenizerOptions: {
    reservedSelect,
    reservedClauses: [...reservedClauses, ...standardOnelineClauses, ...tabularOnelineClauses],
    reservedSetOperations,
    reservedJoins,
    reservedKeywordPhrases,

    reservedKeywords: keywords,
    reservedDataTypes: dataTypes,
    reservedFunctionNames: functions,
    extraParens: ['[]'],
    lineCommentTypes: ['#', '--'],
    nestedBlockComments: false,
    underscoresInNumbers: true,
    stringTypes: ['$$', "''-qq-bs"],
    identTypes: ['""-qq-bs', '``'],
    paramTypes: {
      // https://clickhouse.com/docs/sql-reference/syntax#defining-and-using-query-parameters
      custom: [
        {
          regex: String.raw`\{[^:]+:[^}]+\}`,
          key: v => {
            const match = /\{([^:]+):/.exec(v);
            return match ? match[1].trim() : v;
          },
        },
      ],
    },
    operators: [
      // Strings, arithmetic
      '%', // modulo
      '||', // string concatenation

      // Ternary
      '?',
      ':',

      // Comparison
      '==',
      '<=>', // null-safe equal

      // Lambda creation
      '->',
    ],
    postProcess,
  },
  formatOptions: {
    onelineClauses: [...standardOnelineClauses, ...tabularOnelineClauses],
    tabularOnelineClauses,
  },
};

/**
 * 1. Formats GRANT statements to use RESERVED_KEYWORD instead of RESERVED_SELECT
 *    for SELECT GRANTs
 * 2. Formats SET(100) as RESERVED_FUNCTION_NAME instead of RESERVED_KEYWORD
 *    so it appears as a function rather than a statement.
 */
function postProcess(tokens: Token[]): Token[] {
  return tokens.map((token, i) => {
    const nextToken = tokens[i + 1] || EOF_TOKEN;
    const prevToken = tokens[i - 1] || EOF_TOKEN;

    // If we have queries like
    // > GRANT SELECT, INSERT ON db.table TO john
    // > GRANT SELECT(a, b), SELECT(c) ON db.table TO john
    // we want to format them as
    // > GRANT
    // >   SELECT,
    // >   INSERT ON db.table
    // > TO john
    // > GRANT
    // >   SELECT(a, b),
    // >   SELECT(c) ON db.table
    // > TO john
    // To do this we need to convert the SELECT keyword to a RESERVED_KEYWORD.
    if (
      token.type === TokenType.RESERVED_SELECT &&
      (nextToken.type === TokenType.COMMA ||
        prevToken.type === TokenType.RESERVED_CLAUSE ||
        prevToken.type === TokenType.COMMA)
    ) {
      return { ...token, type: TokenType.RESERVED_KEYWORD };
    }

    // We should format `set(100)` as-is rather than `SET (100)`
    if (isToken.SET(token) && nextToken.type === TokenType.OPEN_PAREN) {
      return { ...token, type: TokenType.RESERVED_FUNCTION_NAME };
    }

    return token;
  });
}
