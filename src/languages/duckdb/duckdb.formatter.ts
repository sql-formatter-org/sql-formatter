import { DialectOptions } from '../../dialect.js';
import { expandPhrases } from '../../expandPhrases.js';
import { functions } from './duckdb.functions.js';
import { dataTypes, keywords } from './duckdb.keywords.js';

const reservedSelect = expandPhrases(['SELECT [ALL | DISTINCT] [EXCLUDE | REPLACE]']);

const reservedClauses = expandPhrases([
  // queries
  'WITH [RECURSIVE]',
  'FROM',
  'WHERE',
  'GROUP BY [ALL | DISTINCT]',
  'HAVING',
  'QUALIFY',
  'WINDOW',
  'PARTITION BY',
  'ORDER BY',
  'LIMIT',
  'OFFSET',
  // Data manipulation
  // - insert:
  'INSERT INTO',
  'VALUES',
  'DEFAULT VALUES',
  // - update:
  'SET',
  // other
  'RETURNING',
]);

const standardOnelineClauses = expandPhrases([
  'CREATE [OR REPLACE] [TEMP | TEMPORARY] TABLE',
]);

const tabularOnelineClauses = expandPhrases([
  // - create
  'CREATE [OR REPLACE] [TEMP | TEMPORARY] VIEW',
  // - update:
  'UPDATE',
  // - insert:
  'ON CONFLICT',
  // - delete:
  'DELETE FROM',
  // - drop table:
  'DROP TABLE [IF EXISTS]',
  // - alter table:
  'ALTER TABLE [IF EXISTS]',
  'ALTER TABLE ALL IN TABLESPACE',
  'RENAME [COLUMN]',
  'RENAME TO',
  'ADD [COLUMN] [IF NOT EXISTS]',
  'DROP [COLUMN] [IF EXISTS]',
  'DROP [PERSISTENT] SECRET',
  'DROP [SEQUENCE | MACRO | FUNCTION | INDEX | TYPE | SCHEMA] [IF EXISTS]',
  'DROP [VIEW] [IF EXISTS]',
  'ALTER [COLUMN]',
  'SET DATA TYPE', // for alter column
  '{SET | DROP} DEFAULT', // for alter column
  '{SET | DROP} NOT NULL', // for alter column
  // - truncate:
  'TRUNCATE [TABLE]',
  // other
  'ABORT',
  'ALTER VIEW',
  'ANALYZE',
  'BEGIN',
  'CALL',
  'CHECKPOINT',
  'COMMIT',
  'COPY',
  'CREATE FUNCTION',
  'CREATE INDEX',
  'CREATE MACRO',
  'CREATE SCHEMA',
  'CREATE SECRET',
  'CREATE SEQUENCE',
  'CREATE TYPE',
  'DEALLOCATE',
  'DECLARE',
  'EXECUTE',
  'EXPLAIN',
  'INSTALL',
  'LOAD',
  'PREPARE',
  'INSERT INTO',
  'SHOW',
  'BEGIN TRANSACTION',
  'UNLISTEN',
  'VACUUM [ANALYZE | FULL]',
]);

const reservedSetOperations = expandPhrases([
  'UNION [ALL] BY NAME',
  'EXCEPT [ALL]',
  'INTERSECT [ALL]',
]);

const reservedJoins = expandPhrases([
  'ASOF {LEFT} JOIN',
  'JOIN',
  'NATURAL [INNER] JOIN',
  'NATURAL [LEFT] {ANTI | SEMI} JOIN',
  'NATURAL {LEFT | RIGHT | FULL} [OUTER] JOIN',
  'POSITIONAL JOIN',
  '[LEFT] {ANTI | SEMI} JOIN',
  '{INNER | CROSS} JOIN',
  '{LEFT | RIGHT | FULL} [OUTER] JOIN',
]);

const reservedPhrases = expandPhrases([
  'PRIMARY KEY',
  'GENERATED ALWAYS',
  'ON {UPDATE | DELETE} [SET NULL | SET DEFAULT]',
  '{ROWS | RANGE | GROUPS} BETWEEN',
  '[TIMESTAMP | TIME] {WITH | WITHOUT} TIME ZONE',
  // comparison operator
  'IS [NOT] DISTINCT FROM',
]);

export const duckdb: DialectOptions = {
  name: 'duckdb',
  tokenizerOptions: {
    reservedSelect,
    reservedClauses: [...reservedClauses, ...standardOnelineClauses, ...tabularOnelineClauses],
    reservedSetOperations,
    reservedJoins,
    reservedPhrases,
    reservedKeywords: keywords,
    reservedDataTypes: dataTypes,
    reservedFunctionNames: functions,
    nestedBlockComments: true,
    extraParens: ['[]'],
    stringTypes: [
      '$$',
      { quote: "''-qq", prefixes: ['U&'] },
      { quote: "''-qq-bs", prefixes: ['E'], requirePrefix: true },
      { quote: "''-raw", prefixes: ['B', 'X'], requirePrefix: true },
    ],
    identTypes: [{ quote: '""-qq', prefixes: ['U&'] }],
    identChars: { rest: '$' },
    paramTypes: { numbered: ['$'] },
    operators: [
      // Arithmetic
      '%',
      '^',
      '@',
      // Assignment
      ':=',
      // Bitwise
      '&',
      '|',
      '~',
      '<<',
      '>>',
      // JSON
      '->',
      '->>',
      // Pattern matching
      '~~',
      '~~*',
      '!~~',
      '!~~*',
      '~',
      '!~',
      // String concatenation
      '||',
      // Text search
      '^@',
    ],
  },
  formatOptions: {
    alwaysDenseOperators: ['::', ':'],
    onelineClauses: [...standardOnelineClauses, ...tabularOnelineClauses],
    tabularOnelineClauses,
  },
};
