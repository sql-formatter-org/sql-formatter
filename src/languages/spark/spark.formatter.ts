import { expandPhrases } from 'src/expandPhrases';
import Formatter from 'src/formatter/Formatter';
import Tokenizer from 'src/lexer/Tokenizer';
import { EOF_TOKEN, isToken, type Token, TokenType } from 'src/lexer/token';
import { keywords } from './spark.keywords';
import { functions } from './spark.functions';

// http://spark.apache.org/docs/latest/sql-ref-syntax.html
const reservedCommands = expandPhrases([
  // queries
  'WITH',
  'SELECT [ALL | DISTINCT]',
  'FROM',
  'WHERE',
  'GROUP BY',
  'HAVING',
  'WINDOW',
  'ORDER BY',
  'SORT BY',
  'CLUSTER BY',
  'DISTRIBUTE BY',
  'LIMIT',
  // Data manipulation
  'INSERT [INTO | OVERWRITE] [TABLE]',
  'VALUES',
  // DDL
  'ALTER COLUMN',
  'ALTER DATABASE',
  'ALTER TABLE',
  'ALTER VIEW',
  'CREATE DATABASE',
  'CREATE FUNCTION',
  'CREATE TABLE',
  'CREATE VIEW',
  'DROP DATABASE',
  'DROP FUNCTION',
  'DROP TABLE',
  'DROP VIEW',
  'REPAIR TABLE',
  'TRUNCATE TABLE',
  'USE DATABASE',
  // DML
  'INSERT OVERWRITE DIRECTORY',
  'LOAD',
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
  // other
  'LATERAL VIEW',
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

const reservedPhrases = ['ON DELETE', 'ON UPDATE', 'CURRENT ROW'];

// http://spark.apache.org/docs/latest/sql-programming-guide.html
export default class SparkFormatter extends Formatter {
  static operators = ['~', '<=>', '&&', '||', '==', '->'];

  tokenizer() {
    return new Tokenizer({
      reservedCommands,
      reservedSetOperations,
      reservedJoins,
      reservedDependentClauses: ['WHEN', 'ELSE'],
      reservedPhrases,
      reservedLogicalOperators: ['AND', 'OR', 'XOR'],
      reservedKeywords: keywords,
      reservedFunctionNames: functions,
      openParens: ['(', '['],
      closeParens: [')', ']'],
      stringTypes: [
        { quote: "''", prefixes: ['R', 'X'] },
        { quote: '""', prefixes: ['R', 'X'] },
      ],
      identTypes: ['``'],
      variableTypes: [{ quote: '{}', prefixes: ['$'], requirePrefix: true }],
      operators: SparkFormatter.operators,
      postProcess,
    });
  }
}

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
    if (token.value === 'ITEMS' && token.type === TokenType.RESERVED_KEYWORD) {
      if (!(prevToken.value === 'COLLECTION' && nextToken.value === 'TERMINATED')) {
        // this is a word and not COLLECTION ITEMS
        return { type: TokenType.IDENTIFIER, text: token.text, value: token.text };
      }
    }

    return token;
  });
}
