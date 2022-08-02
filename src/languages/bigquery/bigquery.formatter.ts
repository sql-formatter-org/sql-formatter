import Formatter from 'src/formatter/Formatter';
import Tokenizer from 'src/lexer/Tokenizer';
import { EOF_TOKEN, isToken, TokenType, type Token } from 'src/lexer/token';
import { expandPhrases } from 'src/expandPhrases';
import { keywords } from './bigquery.keywords';
import { functions } from './bigquery.functions';

const reservedCommands = expandPhrases([
  // Queries: https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax
  'WITH [RECURSIVE]',
  'SELECT [ALL | DISTINCT] [AS STRUCT | AS VALUE]',
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
  'TRUNCATE TABLE',
  'MERGE [INTO]',
  // DDL, https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language
  'CREATE SCHEMA [IF NOT EXISTS]',
  'DEFAULT COLLATE',
  'CREATE [OR REPLACE] [TEMP|TEMPORARY|SNAPSHOT|EXTERNAL] TABLE [IF NOT EXISTS]',
  'CLUSTER BY',
  'FOR SYSTEM_TIME AS OF', // CREATE SNAPSHOT TABLE
  'CREATE [OR REPLACE] [MATERIALIZED] VIEW [IF NOT EXISTS]',
  'WITH CONNECTION',
  'WITH PARTITION COLUMNS',
  'CREATE [OR REPLACE] [TEMP|TEMPORARY|TABLE] FUNCTION [IF NOT EXISTS]',
  'REMOTE WITH CONNECTION',
  'RETURNS TABLE',
  'CREATE [OR REPLACE] PROCEDURE [IF NOT EXISTS]',
  'CREATE [OR REPLACE] ROW ACCESS POLICY [IF NOT EXISTS]',
  'GRANT TO',
  'FILTER USING',
  'CREATE CAPACITY',
  'AS JSON',
  'CREATE RESERVATION',
  'CREATE ASSIGNMENT',
  'CREATE SEARCH INDEX [IF NOT EXISTS]',
  'ALTER SCHEMA [IF EXISTS]',
  'SET DEFAULT COLLATE',
  'SET OPTIONS',
  'ALTER TABLE [IF EXISTS]',
  'ADD COLUMN [IF NOT EXISTS]',
  'RENAME TO',
  'DROP COLUMN [IF EXISTS]',
  'ALTER COLUMN [IF EXISTS]',
  'DROP NOT NULL',
  'SET DATA TYPE',
  'ALTER [MATERIALIZED] VIEW [IF EXISTS]',
  'ALTER BI_CAPACITY',
  'DROP SCHEMA [IF EXISTS]',
  'DROP [SNAPSHOT|EXTERNAL] TABLE [IF EXISTS]',
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

const reservedPhrases = [
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax#tablesample_operator
  'TABLESAMPLE SYSTEM',
  // From DDL: https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language
  'ANY TYPE',
  'ALL COLUMNS',
  'NOT DETERMINISTIC',
];

// https://cloud.google.com/bigquery/docs/reference/#standard-sql-reference
export default class BigQueryFormatter extends Formatter {
  static operators = ['~', '>>', '<<', '||'];
  // TODO: handle trailing comma in select clause

  tokenizer() {
    return new Tokenizer({
      reservedCommands,
      reservedSetOperations,
      reservedJoins,
      reservedDependentClauses: ['WHEN', 'ELSE'],
      reservedPhrases,
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
