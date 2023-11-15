import { DialectOptions } from '../../dialect.js';
import { expandPhrases } from '../../expandPhrases.js';
import { functions } from './sqlite.functions.js';
import { keywords } from './sqlite.keywords.js';

const reservedSelect = expandPhrases(['SELECT [ALL | DISTINCT]']);

const reservedClauses = expandPhrases([
  // queries
  'WITH [RECURSIVE]',
  'FROM',
  'WHERE',
  'GROUP BY',
  'HAVING',
  'WINDOW',
  'PARTITION BY',
  'ORDER BY',
  'LIMIT',
  'OFFSET',
  // Data manipulation
  // - insert:
  'INSERT [OR ABORT | OR FAIL | OR IGNORE | OR REPLACE | OR ROLLBACK] INTO',
  'REPLACE INTO',
  'VALUES',
  // - update:
  'SET',
  // Data definition
  'CREATE [TEMPORARY | TEMP] VIEW [IF NOT EXISTS]',
  'CREATE [TEMPORARY | TEMP] TABLE [IF NOT EXISTS]',
]);

const onelineClauses = expandPhrases([
  // - update:
  'UPDATE [OR ABORT | OR FAIL | OR IGNORE | OR REPLACE | OR ROLLBACK]',
  // - insert:
  'ON CONFLICT',
  // - delete:
  'DELETE FROM',
  // - drop table:
  'DROP TABLE [IF EXISTS]',
  // - alter table:
  'ALTER TABLE',
  'ADD [COLUMN]',
  'DROP [COLUMN]',
  'RENAME [COLUMN]',
  'RENAME TO',
  // - set schema
  'SET SCHEMA',
]);

const reservedSetOperations = expandPhrases(['UNION [ALL]', 'EXCEPT', 'INTERSECT']);

// joins - https://www.sqlite.org/syntax/join-operator.html
const reservedJoins = expandPhrases([
  'JOIN',
  '{LEFT | RIGHT | FULL} [OUTER] JOIN',
  '{INNER | CROSS} JOIN',
  'NATURAL [INNER] JOIN',
  'NATURAL {LEFT | RIGHT | FULL} [OUTER] JOIN',
]);

const reservedPhrases = expandPhrases([
  'ON {UPDATE | DELETE} [SET NULL | SET DEFAULT]',
  '{ROWS | RANGE | GROUPS} BETWEEN',
]);

export const sqlite: DialectOptions = {
  name: 'sqlite',
  tokenizerOptions: {
    reservedSelect,
    reservedClauses: [...reservedClauses, ...onelineClauses],
    reservedSetOperations,
    reservedJoins,
    reservedPhrases,
    reservedKeywords: keywords,
    reservedFunctionNames: functions,
    stringTypes: [
      "''-qq",
      { quote: "''-raw", prefixes: ['X'], requirePrefix: true },
      // Depending on context SQLite also supports double-quotes for strings,
      // and single-quotes for identifiers.
    ],
    identTypes: [`""-qq`, '``', '[]'],
    // https://www.sqlite.org/lang_expr.html#parameters
    paramTypes: { positional: true, numbered: ['?'], named: [':', '@', '$'] },
    operators: ['%', '~', '&', '|', '<<', '>>', '==', '->', '->>', '||'],
  },
  formatOptions: {
    onelineClauses,
  },
};
