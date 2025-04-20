import { DialectOptions } from '../../dialect.js';
import { expandPhrases } from '../../expandPhrases.js';
import { functions } from '../postgresql/postgresql.functions.js';
import { dataTypes, keywords } from '../postgresql/postgresql.keywords.js';

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
  // - create:
  'CREATE [OR REPLACE] [TEMPORARY | TEMP] VIEW [IF NOT EXISTS]',
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
    paramTypes: { positional: true, numbered: ['$'], named: ['$'], quoted: ['$'] },
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
      // Lambda:
      '->',
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
    alwaysDenseOperators: ['::', ':'],
    onelineClauses: [...standardOnelineClauses, ...tabularOnelineClauses],
    tabularOnelineClauses,
  },
};
