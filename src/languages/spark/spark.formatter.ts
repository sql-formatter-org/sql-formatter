import Formatter from 'src/formatter/Formatter';
import Tokenizer from 'src/lexer/Tokenizer';
import { EOF_TOKEN, isToken, type Token, TokenType } from 'src/lexer/token';
import { keywords } from './spark.keywords';
import { functions } from './spark.functions';

/**
 * Priority 1 (first)
 * keywords that begin a new statement
 * will begin new indented block
 */
// http://spark.apache.org/docs/latest/sql-ref-syntax.html
const reservedCommands = [
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
  'INSERT INTO',
  'INSERT OVERWRITE',
  'INSERT OVERWRITE DIRECTORY',
  'LOAD',
  // Data Retrieval
  'SELECT',
  'WITH',
  'CLUSTER BY',
  'DISTRIBUTE BY',
  'GROUP BY',
  'HAVING',
  'VALUES',
  'LIMIT',
  'OFFSET',
  'ORDER BY',
  'SORT BY',
  'TABLESAMPLE',
  'WHERE',
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
  'SET',
  'SET SCHEMA', // verify
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
  'FROM',
  'INSERT',
  'LATERAL VIEW',
  'UPDATE',
  'WINDOW',
];

const reservedBinaryCommands = [
  // set booleans
  'INTERSECT',
  'INTERSECT ALL',
  'INTERSECT DISTINCT',
  'UNION',
  'UNION ALL',
  'UNION DISTINCT',
  'EXCEPT',
  'EXCEPT ALL',
  'EXCEPT DISTINCT',
  'MINUS',
  'MINUS ALL',
  'MINUS DISTINCT',
  // apply
  'CROSS APPLY',
  'OUTER APPLY',
];

const reservedJoins = [
  'JOIN',
  'INNER JOIN',
  'LEFT JOIN',
  'LEFT OUTER JOIN',
  'RIGHT JOIN',
  'RIGHT OUTER JOIN',
  'FULL JOIN',
  'FULL OUTER JOIN',
  'CROSS JOIN',
  'NATURAL JOIN',
  // non-standard-joins
  'ANTI JOIN',
  'SEMI JOIN',
  'LEFT ANTI JOIN',
  'LEFT SEMI JOIN',
  'RIGHT OUTER JOIN',
  'RIGHT SEMI JOIN',
  'NATURAL ANTI JOIN',
  'NATURAL FULL OUTER JOIN',
  'NATURAL INNER JOIN',
  'NATURAL LEFT ANTI JOIN',
  'NATURAL LEFT OUTER JOIN',
  'NATURAL LEFT SEMI JOIN',
  'NATURAL OUTER JOIN',
  'NATURAL RIGHT OUTER JOIN',
  'NATURAL RIGHT SEMI JOIN',
  'NATURAL SEMI JOIN',
];

/**
 * Priority 3
 * keywords that follow a previous Statement, must be attached to subsequent data
 * can be fully inline or on newline with optional indent
 */
const reservedDependentClauses = ['WHEN', 'ELSE'];

// http://spark.apache.org/docs/latest/sql-programming-guide.html
export default class SparkFormatter extends Formatter {
  static operators = ['~', '<=>', '&&', '||', '==', '->'];

  tokenizer() {
    return new Tokenizer({
      reservedCommands,
      reservedBinaryCommands,
      reservedJoins,
      reservedDependentClauses,
      reservedLogicalOperators: ['AND', 'OR', 'XOR'],
      reservedKeywords: keywords,
      reservedFunctionNames: functions,
      openParens: ['(', '['],
      closeParens: [')', ']'],
      stringTypes: [{ quote: "''", prefixes: ['X'] }],
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
