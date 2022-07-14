import Formatter from 'src/formatter/Formatter';
import Tokenizer from 'src/lexer/Tokenizer';
import { EOF_TOKEN, isToken, TokenType, type Token } from 'src/lexer/token';
import { keywords } from './bigquery.keywords';
import { functions } from './bigquery.functions';

/**
 * Priority 1 (first)
 * keywords that begin a new statement
 * will begin new indented block
 */
const reservedCommands = [
  // DQL, https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax
  'SELECT',
  'FROM',
  'WHERE',
  'GROUP BY',
  'HAVING',
  'ORDER BY',
  'QUALIFY',
  'WINDOW',
  'PARTITION BY',
  'LIMIT',
  'OFFSET',
  'WITH',
  'OMIT RECORD IF', // legacy
  // DML, https://cloud.google.com/bigquery/docs/reference/standard-sql/dml-syntax
  'INSERT',
  'INSERT INTO',
  'VALUES',
  'DELETE',
  'DELETE FROM',
  'TRUNCATE TABLE',
  'UPDATE',
  'MERGE',
  'MERGE INTO',
  // 'USING',
  // DDL, https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language
  'SET SCHEMA', // added
  'CREATE SCHEMA',
  'CREATE TABLE',
  'CREATE TABLE IF NOT EXISTS',
  'CREATE TEMP TABLE',
  'CREATE TEMP TABLE IF NOT EXISTS',
  'CREATE TEMPORARY TABLE',
  'CREATE TEMPORARY TABLE IF NOT EXISTS',
  'CREATE OR REPLACE TABLE',
  'CREATE OR REPLACE TEMP TABLE',
  'CREATE OR REPLACE TEMPORARY TABLE',
  'CREATE TABLE LIKE',
  'CREATE TABLE COPY',
  'CREATE SNAPSHOT TABLE',
  'CREATE TABLE CLONE',
  'CREATE VIEW',
  'CREATE VIEW IF NOT EXISTS',
  'CREATE OR REPLACE VIEW',
  'CREATE MATERIALIZED VIEW',
  'CREATE EXTERNAL TABLE',
  'CREATE FUNCTION',
  'CREATE TABLE FUNCTION',
  'CREATE PROCEDURE',
  'CREATE ROW ACCESS POLICY',
  'ALTER SCHEMA SET OPTIONS',
  'ALTER TABLE SET OPTIONS',
  'ALTER TABLE ADD COLUMN',
  'ALTER TABLE RENAME TO',
  'ALTER TABLE DROP COLUMN',
  'ALTER COLUMN SET OPTIONS',
  'ALTER COLUMN DROP NOT NULL',
  'ALTER COLUMN SET DATA TYPE',
  'ALTER VIEW SET OPTIONS',
  'ALTER MATERIALIZED VIEW SET OPTIONS',
  'DROP SCHEMA',
  'DROP TABLE',
  'DROP SNAPSHOT TABLE',
  'DROP EXTERNAL TABLE',
  'DROP VIEW',
  'DROP MATERIALIZED VIEW',
  'DROP FUNCTION',
  'DROP TABLE FUNCTION',
  'DROP PROCEDURE',
  'DROP ROW ACCESS POLICY',
  // DCL, https://cloud.google.com/bigquery/docs/reference/standard-sql/data-control-language
  'GRANT',
  'REVOKE',
  'CREATE CAPACITY',
  'CREATE RESERVATION',
  'CREATE ASSIGNMENT',
  'DROP CAPACITY',
  'DROP RESERVATION',
  'DROP ASSIGNMENT',
  // Script, https://cloud.google.com/bigquery/docs/reference/standard-sql/scripting
  'DECLARE',
  'SET',
  'EXECUTE IMMEDIATE',
  'LOOP',
  'END LOOP',
  'REPEAT',
  'END REPEAT',
  'WHILE',
  'END WHILE',
  'BREAK',
  'LEAVE',
  'CONTINUE',
  'ITERATE',
  'FOR',
  'END FOR',
  'BEGIN',
  'BEGIN TRANSACTION',
  'COMMIT TRANSACTION',
  'ROLLBACK TRANSACTION',
  'RAISE',
  'RETURN',
  'CALL',
  // Debug, https://cloud.google.com/bigquery/docs/reference/standard-sql/debugging-statements
  'ASSERT',
  // Other, https://cloud.google.com/bigquery/docs/reference/standard-sql/other-statements
  'EXPORT DATA',
];

const reservedBinaryCommands = [
  'INTERSECT',
  'INTERSECT ALL',
  'INTERSECT DISTINCT',
  'UNION',
  'UNION ALL',
  'UNION DISTINCT',
  'EXCEPT',
  'EXCEPT ALL',
  'EXCEPT DISTINCT',
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
];

/**
 * Priority 3
 * keywords that follow a previous Statement, must be attached to subsequent data
 * can be fully inline or on newline with optional indent
 */
const reservedDependentClauses = ['WHEN', 'ELSE'];

// https://cloud.google.com/bigquery/docs/reference/#standard-sql-reference
export default class BigQueryFormatter extends Formatter {
  static operators = ['~', '>>', '<<', '||'];
  // TODO: handle trailing comma in select clause

  tokenizer() {
    return new Tokenizer({
      reservedCommands,
      reservedBinaryCommands,
      reservedJoins,
      reservedDependentClauses,
      reservedKeywords: keywords,
      reservedFunctionNames: functions,
      openParens: ['(', '['],
      closeParens: [')', ']'],
      stringTypes: [
        // The triple-quoted strings are listed first, so they get matched first.
        // Otherwise the first two quotes of """ will get matched as an empty "" string.
        { quote: '""".."""', prefixes: ['R', 'B', 'RB', 'BR'] },
        { quote: "'''..'''", prefixes: ['R', 'B', 'RB', 'BR'] },
        { quote: '""', prefixes: ['R', 'B', 'RB', 'BR'] },
        { quote: "''", prefixes: ['R', 'B', 'RB', 'BR'] },
      ],
      identTypes: ['``'],
      identChars: { dashes: true },
      positionalParams: true,
      namedParamTypes: ['@'],
      quotedParamTypes: ['@'],
      lineCommentTypes: ['--', '#'],
      operators: BigQueryFormatter.operators,
      postProcess,
    });
  }
}

function postProcess(tokens: Token[]): Token[] {
  return detectArraySubscripts(combineParameterizedTypes(tokens));
}

// Converts OFFSET token inside array from RESERVED_COMMAND to RESERVED_FUNCTION_NAME
// See: https://cloud.google.com/bigquery/docs/reference/standard-sql/functions-and-operators#array_subscript_operator
function detectArraySubscripts(tokens: Token[]) {
  let prevToken = EOF_TOKEN;
  return tokens.map(token => {
    if (token.value === 'OFFSET' && prevToken.value === '[') {
      prevToken = token;
      return { ...token, type: TokenType.RESERVED_FUNCTION_NAME };
    } else {
      prevToken = token;
      return token;
    }
  });
}

// Combines multiple tokens forming a parameterized type like STRUCT<ARRAY<INT64>> into a single token
function combineParameterizedTypes(tokens: Token[]) {
  const processed: Token[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const nextToken = tokens[i + 1] || EOF_TOKEN;

    if ((isToken.ARRAY(token) || isToken.STRUCT(token)) && nextToken.value === '<') {
      const endIndex = findClosingAngleBracketIndex(tokens, i + 1);
      const typeDefTokens = tokens.slice(i, endIndex + 1);
      processed.push({
        type: TokenType.IDENTIFIER,
        value: typeDefTokens.map(formatTypeDefToken('value')).join(''),
        text: typeDefTokens.map(formatTypeDefToken('text')).join(''),
      });
      i = endIndex;
    } else {
      processed.push(token);
    }
  }
  return processed;
}

const formatTypeDefToken =
  (key: 'text' | 'value') =>
  (token: Token): string => {
    if (token.type === TokenType.IDENTIFIER || token.type === TokenType.COMMA) {
      return token[key] + ' ';
    } else {
      return token[key];
    }
  };

function findClosingAngleBracketIndex(tokens: Token[], startIndex: number): number {
  let level = 0;
  for (let i = startIndex; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.value === '<') {
      level++;
    } else if (token.value === '>') {
      level--;
    } else if (token.value === '>>') {
      level -= 2;
    }
    if (level === 0) {
      return i;
    }
  }
  return tokens.length - 1;
}
