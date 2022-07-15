import Formatter from 'src/formatter/Formatter';
import Tokenizer from 'src/lexer/Tokenizer';
import { EOF_TOKEN, isToken, TokenType, type Token } from 'src/lexer/token';
import { keywords } from './bigquery.keywords';
import { functions } from './bigquery.functions';

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
  'CREATE SCHEMA IF NOT EXISTS',
  'DEFAULT COLLATE',
  'CREATE TABLE',
  'CREATE TABLE IF NOT EXISTS',
  'CREATE TEMP TABLE',
  'CREATE TEMP TABLE IF NOT EXISTS',
  'CREATE TEMPORARY TABLE',
  'CREATE TEMPORARY TABLE IF NOT EXISTS',
  'CLUSTER BY',
  'CREATE OR REPLACE TABLE',
  'CREATE OR REPLACE TEMP TABLE',
  'CREATE OR REPLACE TEMPORARY TABLE',
  // 'LIKE', // CREATE TABLE LIKE
  'COPY', // CREATE TABLE COPY
  'CLONE', // CREATE TABLE CLONE
  'FOR SYSTEM_TIME AS OF', // CREATE SNAPSHOT TABLE
  'CREATE SNAPSHOT TABLE',
  'CREATE SNAPSHOT TABLE IF NOT EXISTS',
  'CREATE VIEW',
  'CREATE VIEW IF NOT EXISTS',
  'CREATE OR REPLACE VIEW',
  'CREATE MATERIALIZED VIEW',
  'CREATE OR REPLACE MATERIALIZED VIEW',
  'CREATE MATERIALIZED VIEW IF NOT EXISTS',
  'CREATE EXTERNAL TABLE',
  'CREATE OR REPLACE EXTERNAL TABLE',
  'CREATE EXTERNAL TABLE IF NOT EXISTS',
  'WITH CONNECTION',
  'WITH PARTITION COLUMNS',
  'CREATE FUNCTION',
  'CREATE OR REPLACE FUNCTION',
  'CREATE FUNCTION IF NOT EXISTS',
  'CREATE TEMP FUNCTION',
  'CREATE OR REPLACE TEMP FUNCTION',
  'CREATE TEMP FUNCTION IF NOT EXISTS',
  'CREATE TEMPORARY FUNCTION',
  'CREATE OR REPLACE TEMPORARY FUNCTION',
  'CREATE TEMPORARY FUNCTION IF NOT EXISTS',
  'REMOTE WITH CONNECTION',
  'CREATE TABLE FUNCTION',
  'CREATE OR REPLACE TABLE FUNCTION',
  'CREATE TABLE FUNCTION IF NOT EXISTS',
  'RETURNS TABLE',
  'CREATE PROCEDURE',
  'CREATE OR REPLACE PROCEDURE',
  'CREATE PROCEDURE IF NOT EXISTS',
  'CREATE ROW ACCESS POLICY',
  'CREATE OR REPLACE ROW ACCESS POLICY',
  'CREATE ROW ACCESS POLICY IF NOT EXISTS',
  'GRANT TO',
  'FILTER USING',
  'CREATE CAPACITY',
  'AS JSON',
  'CREATE RESERVATION',
  'CREATE ASSIGNMENT',
  'CREATE SEARCH INDEX',
  'CREATE SEARCH INDEX IF NOT EXISTS',
  'ALTER SCHEMA',
  'ALTER SCHEMA IF EXISTS',
  'SET DEFAULT COLLATE',
  'SET OPTIONS',
  'ALTER TABLE',
  'ALTER TABLE IF EXISTS',
  'ADD COLUMN',
  'ADD COLUMN IF NOT EXISTS',
  'RENAME TO',
  'DROP COLUMN',
  'DROP COLUMN IF EXISTS',
  'ALTER COLUMN',
  'ALTER COLUMN IF EXISTS',
  'DROP NOT NULL',
  'SET DATA TYPE',
  'ALTER VIEW',
  'ALTER VIEW IF EXISTS',
  'ALTER MATERIALIZED VIEW',
  'ALTER MATERIALIZED VIEW IF EXISTS',
  'ALTER BI_CAPACITY',
  'DROP SCHEMA',
  'DROP SCHEMA IF EXISTS',
  'DROP TABLE',
  'DROP TABLE IF EXISTS',
  'DROP SNAPSHOT TABLE',
  'DROP SNAPSHOT TABLE IF EXISTS',
  'DROP EXTERNAL TABLE',
  'DROP EXTERNAL TABLE IF EXISTS',
  'DROP VIEW',
  'DROP VIEW IF EXISTS',
  'DROP MATERIALIZED VIEW',
  'DROP MATERIALIZED VIEW IF EXISTS',
  'DROP FUNCTION',
  'DROP FUNCTION IF EXISTS',
  'DROP TABLE FUNCTION',
  'DROP TABLE FUNCTION IF EXISTS',
  'DROP PROCEDURE',
  'DROP PROCEDURE IF EXISTS',
  'DROP ROW ACCESS POLICY',
  'DROP ALL ROW ACCESS POLICIES',
  'DROP CAPACITY',
  'DROP CAPACITY IF EXISTS',
  'DROP RESERVATION',
  'DROP RESERVATION IF EXISTS',
  'DROP ASSIGNMENT',
  'DROP ASSIGNMENT IF EXISTS',
  'DROP SEARCH INDEX',
  'DROP SEARCH INDEX IF EXISTS',
  'DROP',
  'DROP IF EXISTS',
  // DCL, https://cloud.google.com/bigquery/docs/reference/standard-sql/data-control-language
  'GRANT',
  'REVOKE',
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

// https://cloud.google.com/bigquery/docs/reference/#standard-sql-reference
export default class BigQueryFormatter extends Formatter {
  static operators = ['~', '>>', '<<', '||'];
  // TODO: handle trailing comma in select clause

  tokenizer() {
    return new Tokenizer({
      reservedCommands,
      reservedBinaryCommands,
      reservedJoins,
      reservedDependentClauses: ['WHEN', 'ELSE'],
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
