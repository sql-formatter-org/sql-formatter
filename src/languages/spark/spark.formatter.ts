import { DialectOptions } from '../../dialect.js';
import { expandPhrases } from '../../expandPhrases.js';
import { EOF_TOKEN, isToken, Token, TokenType } from '../../lexer/token.js';
import { dataTypes, keywords } from './spark.keywords.js';
import { functions } from './spark.functions.js';

// http://spark.apache.org/docs/latest/sql-ref-syntax.html
const reservedSelect = expandPhrases(['SELECT [ALL | DISTINCT]']);

const reservedClauses = expandPhrases([
  // queries
  'WITH',
  'FROM',
  'WHERE',
  'GROUP BY',
  'HAVING',
  'WINDOW',
  'PARTITION BY',
  'ORDER BY',
  'SORT BY',
  'CLUSTER BY',
  'DISTRIBUTE BY',
  'LIMIT',
  // Data manipulation
  // - insert:
  'INSERT [INTO | OVERWRITE] [TABLE]',
  'VALUES',
  // - insert overwrite directory:
  //   https://spark.apache.org/docs/latest/sql-ref-syntax-dml-insert-overwrite-directory.html
  'INSERT OVERWRITE [LOCAL] DIRECTORY',
  // - load:
  //   https://spark.apache.org/docs/latest/sql-ref-syntax-dml-load.html
  'LOAD DATA [LOCAL] INPATH',
  '[OVERWRITE] INTO TABLE',
]);

const standardOnelineClauses = expandPhrases(['CREATE [EXTERNAL] TABLE [IF NOT EXISTS]']);

const tabularOnelineClauses = expandPhrases([
  // - create:
  'CREATE [OR REPLACE] [GLOBAL TEMPORARY | TEMPORARY] VIEW [IF NOT EXISTS]',
  // - drop table:
  'DROP TABLE [IF EXISTS]',
  // - alter table:
  'ALTER TABLE',
  'ADD COLUMNS',
  'DROP {COLUMN | COLUMNS}',
  'RENAME TO',
  'RENAME COLUMN',
  'ALTER COLUMN',
  // - truncate:
  'TRUNCATE TABLE',
  // other
  'LATERAL VIEW',
  'ALTER DATABASE',
  'ALTER VIEW',
  'CREATE DATABASE',
  'CREATE FUNCTION',
  'DROP DATABASE',
  'DROP FUNCTION',
  'DROP VIEW',
  'REPAIR TABLE',
  'USE DATABASE',
  // Data Retrieval
  'TABLESAMPLE',
  'PIVOT',
  'TRANSFORM',
  'EXPLAIN',
  // Auxiliary
  'ADD FILE',
  'ADD JAR',
  'ANALYZE TABLE',
  'CACHE TABLE',
  'CLEAR CACHE',
  'DESCRIBE DATABASE',
  'DESCRIBE FUNCTION',
  'DESCRIBE QUERY',
  'DESCRIBE TABLE',
  'LIST FILE',
  'LIST JAR',
  'REFRESH',
  'REFRESH TABLE',
  'REFRESH FUNCTION',
  'RESET',
  'SHOW COLUMNS',
  'SHOW CREATE TABLE',
  'SHOW DATABASES',
  'SHOW FUNCTIONS',
  'SHOW PARTITIONS',
  'SHOW TABLE EXTENDED',
  'SHOW TABLES',
  'SHOW TBLPROPERTIES',
  'SHOW VIEWS',
  'UNCACHE TABLE',
]);

const reservedSetOperations = expandPhrases([
  'UNION [ALL | DISTINCT]',
  'EXCEPT [ALL | DISTINCT]',
  'INTERSECT [ALL | DISTINCT]',
]);

const reservedJoins = expandPhrases([
  'JOIN',
  '{LEFT | RIGHT | FULL} [OUTER] JOIN',
  '{INNER | CROSS} JOIN',
  'NATURAL [INNER] JOIN',
  'NATURAL {LEFT | RIGHT | FULL} [OUTER] JOIN',
  // non-standard-joins
  '[LEFT] {ANTI | SEMI} JOIN',
  'NATURAL [LEFT] {ANTI | SEMI} JOIN',
]);

const reservedPhrases = expandPhrases([
  'ON DELETE',
  'ON UPDATE',
  'CURRENT ROW',
  '{ROWS | RANGE} BETWEEN',
]);

// http://spark.apache.org/docs/latest/sql-programming-guide.html
export const spark: DialectOptions = {
  name: 'spark',
  tokenizerOptions: {
    reservedSelect,
    reservedClauses: [...reservedClauses, ...standardOnelineClauses, ...tabularOnelineClauses],
    reservedSetOperations,
    reservedJoins,
    reservedPhrases,
    supportsXor: true,
    reservedKeywords: keywords,
    reservedDataTypes: dataTypes,
    reservedFunctionNames: functions,
    extraParens: ['[]'],
    stringTypes: [
      "''-bs",
      '""-bs',
      { quote: "''-raw", prefixes: ['R', 'X'], requirePrefix: true },
      { quote: '""-raw', prefixes: ['R', 'X'], requirePrefix: true },
    ],
    identTypes: ['``'],
    variableTypes: [{ quote: '{}', prefixes: ['$'], requirePrefix: true }],
    operators: ['%', '~', '^', '|', '&', '<=>', '==', '!', '||', '->'],
    postProcess,
  },
  formatOptions: {
    onelineClauses: [...standardOnelineClauses, ...tabularOnelineClauses],
    tabularOnelineClauses,
  },
};

function postProcess(tokens: Token[]) {
  return tokens.map((token, i) => {
    const prevToken = tokens[i - 1] || EOF_TOKEN;
    const nextToken = tokens[i + 1] || EOF_TOKEN;

    // [WINDOW](...)
    if (isToken.WINDOW(token) && nextToken.type === TokenType.OPEN_PAREN) {
      // This is a function call, treat it as a reserved function name
      return { ...token, type: TokenType.RESERVED_FUNCTION_NAME };
    }

    // TODO: deprecate this once ITEMS is merged with COLLECTION
    if (token.text === 'ITEMS' && token.type === TokenType.RESERVED_KEYWORD) {
      if (!(prevToken.text === 'COLLECTION' && nextToken.text === 'TERMINATED')) {
        // this is a word and not COLLECTION ITEMS
        return { ...token, type: TokenType.IDENTIFIER, text: token.raw };
      }
    }

    return token;
  });
}
