import { DialectOptions } from '../../dialect.js';
import { expandPhrases } from '../../expandPhrases.js';
import { functions } from './duckdb.functions.js';
import { dataTypes, keywords } from './duckdb.keywords.js';

const reservedSelect = expandPhrases(['SELECT [ALL | DISTINCT]']);

const reservedClauses = expandPhrases([
  // queries
  'WITH [RECURSIVE]',
  'FROM',
  'WHERE',
  'GROUP BY [ALL]',
  'HAVING',
  'WINDOW',
  'PARTITION BY',
  'ORDER BY [ALL]',
  'LIMIT',
  'OFFSET',
  // 'USING' (conflicts with 'USING' in JOIN)
  'USING SAMPLE',
  'QUALIFY',
  // Data manipulation
  // - insert:
  'INSERT [OR REPLACE] INTO',
  'VALUES',
  'DEFAULT VALUES',
  // - update:
  'SET',
  // other:
  'RETURNING',
]);

const standardOnelineClauses = expandPhrases([
  'CREATE [OR REPLACE] [TEMPORARY | TEMP] TABLE [IF NOT EXISTS]',
]);

const tabularOnelineClauses = expandPhrases([
  // TABLE
  // - update:
  'UPDATE',
  // - insert:
  'ON CONFLICT',
  // - delete:
  'DELETE FROM',
  // - drop table:
  'DROP TABLE [IF EXISTS]',
  // - truncate
  'TRUNCATE',
  // - alter table:
  'ALTER TABLE',
  'ADD [COLUMN] [IF NOT EXISTS]',
  'ADD PRIMARY KEY',
  'DROP [COLUMN] [IF EXISTS]',
  'ALTER [COLUMN]',
  'RENAME [COLUMN]',
  'RENAME TO',
  'SET [DATA] TYPE', // for alter column
  '{SET | DROP} DEFAULT', // for alter column
  '{SET | DROP} NOT NULL', // for alter column

  // MACRO / FUNCTION
  'CREATE [OR REPLACE] [TEMPORARY | TEMP] {MACRO | FUNCTION}',
  'DROP MACRO [TABLE] [IF EXISTS]',
  'DROP FUNCTION [IF EXISTS]',
  // INDEX
  'CREATE [UNIQUE] INDEX [IF NOT EXISTS]',
  'DROP INDEX [IF EXISTS]',
  // SCHEMA
  'CREATE [OR REPLACE] SCHEMA [IF NOT EXISTS]',
  'DROP SCHEMA [IF EXISTS]',
  // SECRET
  'CREATE [OR REPLACE] [PERSISTENT | TEMPORARY] SECRET [IF NOT EXISTS]',
  'DROP [PERSISTENT | TEMPORARY] SECRET [IF EXISTS]',
  // SEQUENCE
  'CREATE [OR REPLACE] [TEMPORARY | TEMP] SEQUENCE',
  'DROP SEQUENCE [IF EXISTS]',
  // VIEW
  'CREATE [OR REPLACE] [TEMPORARY | TEMP] VIEW [IF NOT EXISTS]',
  'DROP VIEW [IF EXISTS]',
  'ALTER VIEW',
  // TYPE
  'CREATE TYPE',
  'DROP TYPE [IF EXISTS]',

  // other
  'ANALYZE',
  'ATTACH [DATABASE] [IF NOT EXISTS]',
  'DETACH [DATABASE] [IF EXISTS]',
  'CALL',
  '[FORCE] CHECKPOINT',
  'COMMENT ON [TABLE | COLUMN | VIEW | INDEX | SEQUENCE | TYPE | MACRO | MACRO TABLE]',
  'COPY [FROM DATABASE]',
  'DESCRIBE',
  'EXPORT DATABASE',
  'IMPORT DATABASE',
  'INSTALL',
  'LOAD',
  'PIVOT',
  'PIVOT_WIDER',
  'UNPIVOT',
  'EXPLAIN [ANALYZE]',
  // plain SET conflicts with SET clause in UPDATE
  'SET {LOCAL | SESSION | GLOBAL}',
  'RESET [LOCAL | SESSION | GLOBAL]',
  '{SET | RESET} VARIABLE',
  'SUMMARIZE',
  'BEGIN TRANSACTION',
  'ROLLBACK',
  'COMMIT',
  'ABORT',
  'USE',
  'VACUUM [ANALYZE]',
  // prepared statements
  'PREPARE',
  'EXECUTE',
  'DEALLOCATE [PREPARE]',
]);

const reservedSetOperations = expandPhrases([
  'UNION [ALL | BY NAME]',
  'EXCEPT [ALL]',
  'INTERSECT [ALL]',
]);

const reservedJoins = expandPhrases([
  'JOIN',
  '{LEFT | RIGHT | FULL} [OUTER] JOIN',
  '{INNER | CROSS} JOIN',
  '{NATURAL | ASOF} [INNER] JOIN',
  '{NATURAL | ASOF} {LEFT | RIGHT | FULL} [OUTER] JOIN',
  'POSITIONAL JOIN',
  'ANTI JOIN',
  'SEMI JOIN',
]);

const reservedPhrases = expandPhrases([
  '{ROWS | RANGE | GROUPS} BETWEEN',
  'SIMILAR TO',
  'IS [NOT] DISTINCT FROM',
  'TIMESTAMP WITH TIME ZONE',
]);

export const duckdb: DialectOptions = {
  name: 'duckdb',
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
    nestedBlockComments: true,
    extraParens: ['[]', '{}'],
    stringTypes: [
      '$$',
      "''-qq",
      { quote: "''-qq-bs", prefixes: ['E'], requirePrefix: true },
      { quote: "''-raw", prefixes: ['B', 'X'], requirePrefix: true },
    ],
    identTypes: [`""-qq`],
    identChars: { rest: '$' },
    // TODO: named params $foo currently conflict with $$-quoted strings
    paramTypes: { positional: true, numbered: ['$'], quoted: ['$'] },
    operators: [
      // Arithmetic:
      '//',
      '%',
      '**',
      '^',
      '!',
      // Bitwise:
      '&',
      '|',
      '~',
      '<<',
      '>>',
      // Cast:
      '::',
      // Comparison:
      '==',
      // Lambda & JSON:
      '->',
      // JSON:
      '->>',
      // key-value separator:
      ':',
      // Named function params:
      ':=',
      '=>',
      // Pattern matching:
      '~~',
      '!~~',
      '~~*',
      '!~~*',
      '~~~',
      // Regular expressions:
      '~',
      '!~',
      '~*',
      '!~*',
      // String:
      '^@',
      '||',
      // INET extension:
      '>>=',
      '<<=',
    ],
  },
  formatOptions: {
    alwaysDenseOperators: ['::'],
    onelineClauses: [...standardOnelineClauses, ...tabularOnelineClauses],
    tabularOnelineClauses,
  },
};
