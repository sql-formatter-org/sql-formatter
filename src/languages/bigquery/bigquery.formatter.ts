import Formatter from '../../formatter/Formatter.js';
import { DialectFormatOptions } from '../../formatter/ExpressionFormatter.js';
import Tokenizer from '../../lexer/Tokenizer.js';
import { EOF_TOKEN, isToken, TokenType, Token } from '../../lexer/token.js';
import { expandPhrases } from '../../expandPhrases.js';
import { keywords } from './bigquery.keywords.js';
import { functions } from './bigquery.functions.js';

const reservedSelect = expandPhrases(['SELECT [ALL | DISTINCT] [AS STRUCT | AS VALUE]']);

const reservedClauses = expandPhrases([
  // Queries: https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax
  'WITH [RECURSIVE]',
  'FROM',
  'WHERE',
  'GROUP BY',
  'HAVING',
  'QUALIFY',
  'WINDOW',
  'PARTITION BY',
  'ORDER BY',
  'LIMIT',
  'OFFSET',
  'OMIT RECORD IF', // legacy
  // Data modification: https://cloud.google.com/bigquery/docs/reference/standard-sql/dml-syntax
  // - insert:
  'INSERT [INTO]',
  'VALUES',
  // - update:
  'UPDATE',
  'SET',
  // - delete:
  'DELETE [FROM]',
  // - merge:
  'MERGE [INTO]',
  'WHEN [NOT] MATCHED [BY SOURCE | BY TARGET] [THEN]',
  'UPDATE SET',
  // Data definition, https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language
  'CREATE [OR REPLACE] [MATERIALIZED] VIEW [IF NOT EXISTS]',
  'CREATE [OR REPLACE] [TEMP|TEMPORARY|SNAPSHOT|EXTERNAL] TABLE [IF NOT EXISTS]',

  'CLUSTER BY',
  'FOR SYSTEM_TIME AS OF', // CREATE SNAPSHOT TABLE
  'WITH CONNECTION',
  'WITH PARTITION COLUMNS',
  'REMOTE WITH CONNECTION',
]);

const onelineClauses = expandPhrases([
  // - drop table:
  'DROP [SNAPSHOT | EXTERNAL] TABLE [IF EXISTS]',
  // - alter table:
  'ALTER TABLE [IF EXISTS]',
  'ADD COLUMN [IF NOT EXISTS]',
  'DROP COLUMN [IF EXISTS]',
  'RENAME TO',
  'ALTER COLUMN [IF EXISTS]',
  'SET DEFAULT COLLATE', // for alter column
  'SET OPTIONS', // for alter column
  'DROP NOT NULL', // for alter column
  'SET DATA TYPE', // for alter column
  // - alter schema
  'ALTER SCHEMA [IF EXISTS]',
  // - alter view
  'ALTER [MATERIALIZED] VIEW [IF EXISTS]',
  // - alter bi_capacity
  'ALTER BI_CAPACITY',
  // - truncate:
  'TRUNCATE TABLE',
  // - create schema
  'CREATE SCHEMA [IF NOT EXISTS]',
  'DEFAULT COLLATE',

  // stored procedures
  'CREATE [OR REPLACE] [TEMP|TEMPORARY|TABLE] FUNCTION [IF NOT EXISTS]',
  'CREATE [OR REPLACE] PROCEDURE [IF NOT EXISTS]',
  // row access policy
  'CREATE [OR REPLACE] ROW ACCESS POLICY [IF NOT EXISTS]',
  'GRANT TO',
  'FILTER USING',
  // capacity
  'CREATE CAPACITY',
  'AS JSON',
  // reservation
  'CREATE RESERVATION',
  // assignment
  'CREATE ASSIGNMENT',
  // search index
  'CREATE SEARCH INDEX [IF NOT EXISTS]',
  // drop
  'DROP SCHEMA [IF EXISTS]',
  'DROP [MATERIALIZED] VIEW [IF EXISTS]',
  'DROP [TABLE] FUNCTION [IF EXISTS]',
  'DROP PROCEDURE [IF EXISTS]',
  'DROP ROW ACCESS POLICY',
  'DROP ALL ROW ACCESS POLICIES',
  'DROP CAPACITY [IF EXISTS]',
  'DROP RESERVATION [IF EXISTS]',
  'DROP ASSIGNMENT [IF EXISTS]',
  'DROP SEARCH INDEX [IF EXISTS]',
  'DROP [IF EXISTS]',
  // DCL, https://cloud.google.com/bigquery/docs/reference/standard-sql/data-control-language
  'GRANT',
  'REVOKE',
  // Script, https://cloud.google.com/bigquery/docs/reference/standard-sql/scripting
  'DECLARE',
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
]);

const reservedSetOperations = expandPhrases([
  'UNION {ALL | DISTINCT}',
  'EXCEPT DISTINCT',
  'INTERSECT DISTINCT',
]);

const reservedJoins = expandPhrases([
  'JOIN',
  '{LEFT | RIGHT | FULL} [OUTER] JOIN',
  '{INNER | CROSS} JOIN',
]);

const reservedPhrases = expandPhrases([
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax#tablesample_operator
  'TABLESAMPLE SYSTEM',
  // From DDL: https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language
  'ANY TYPE',
  'ALL COLUMNS',
  'NOT DETERMINISTIC',
  // inside window definitions
  '{ROWS | RANGE} BETWEEN',
]);

// https://cloud.google.com/bigquery/docs/reference/#standard-sql-reference
export default class BigQueryFormatter extends Formatter {
  // TODO: handle trailing comma in select clause
  tokenizer() {
    return new Tokenizer({
      reservedSelect,
      reservedClauses: [...reservedClauses, ...onelineClauses],
      reservedSetOperations,
      reservedJoins,
      reservedPhrases,
      reservedKeywords: keywords,
      reservedFunctionNames: functions,
      extraParens: ['[]'],
      stringTypes: [
        // The triple-quoted strings are listed first, so they get matched first.
        // Otherwise the first two quotes of """ will get matched as an empty "" string.
        { quote: '""".."""', prefixes: ['R', 'B', 'RB', 'BR'] },
        { quote: "'''..'''", prefixes: ['R', 'B', 'RB', 'BR'] },
        '""-bs',
        "''-bs",
        { quote: '""-raw', prefixes: ['R', 'B', 'RB', 'BR'], requirePrefix: true },
        { quote: "''-raw", prefixes: ['R', 'B', 'RB', 'BR'], requirePrefix: true },
      ],
      identTypes: ['``'],
      identChars: { dashes: true },
      paramTypes: { positional: true, named: ['@'], quoted: ['@'] },
      lineCommentTypes: ['--', '#'],
      operators: ['&', '|', '^', '~', '>>', '<<', '||'],
      postProcess,
    });
  }

  formatOptions(): DialectFormatOptions {
    return {
      onelineClauses,
    };
  }
}

function postProcess(tokens: Token[]): Token[] {
  return detectArraySubscripts(combineParameterizedTypes(tokens));
}

// Converts OFFSET token inside array from RESERVED_CLAUSE to RESERVED_FUNCTION_NAME
// See: https://cloud.google.com/bigquery/docs/reference/standard-sql/functions-and-operators#array_subscript_operator
function detectArraySubscripts(tokens: Token[]) {
  let prevToken = EOF_TOKEN;
  return tokens.map(token => {
    if (token.text === 'OFFSET' && prevToken.text === '[') {
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

    if ((isToken.ARRAY(token) || isToken.STRUCT(token)) && tokens[i + 1]?.text === '<') {
      const endIndex = findClosingAngleBracketIndex(tokens, i + 1);
      const typeDefTokens = tokens.slice(i, endIndex + 1);
      processed.push({
        type: TokenType.IDENTIFIER,
        raw: typeDefTokens.map(formatTypeDefToken('raw')).join(''),
        text: typeDefTokens.map(formatTypeDefToken('text')).join(''),
        start: token.start,
      });
      i = endIndex;
    } else {
      processed.push(token);
    }
  }
  return processed;
}

const formatTypeDefToken =
  (key: Extract<keyof Token, 'raw' | 'text'>) =>
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
    if (token.text === '<') {
      level++;
    } else if (token.text === '>') {
      level--;
    } else if (token.text === '>>') {
      level -= 2;
    }
    if (level === 0) {
      return i;
    }
  }
  return tokens.length - 1;
}
