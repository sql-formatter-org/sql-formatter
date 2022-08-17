import { expandPhrases } from 'src/expandPhrases';
import Formatter from 'src/formatter/Formatter';
import Tokenizer from 'src/lexer/Tokenizer';
import { functions } from './sql.functions';
import { keywords } from './sql.keywords';

const reservedSelect = expandPhrases(['SELECT [ALL | DISTINCT]']);

const reservedCommands = expandPhrases([
  // queries
  'WITH [RECURSIVE]',
  'FROM',
  'WHERE',
  'GROUP BY [ALL | DISTINCT]',
  'HAVING',
  'WINDOW',
  'PARTITION BY',
  'ORDER BY',
  'LIMIT',
  'OFFSET',
  'FETCH {FIRST | NEXT}',
  // Data manipulation
  // - insert:
  'INSERT INTO',
  'VALUES',
  // - update:
  'UPDATE',
  'SET',
  'WHERE CURRENT OF',
  // - delete:
  'DELETE FROM',
  // - truncate:
  'TRUNCATE TABLE',
  // Data definition
  'CREATE [RECURSIVE] VIEW',
  'CREATE [GLOBAL TEMPORARY | LOCAL TEMPORARY] TABLE',
  'DROP TABLE',
  // - alter table:
  'ALTER TABLE',
  'ADD COLUMN',
  'DROP [COLUMN]',
  'RENAME COLUMN',
  'RENAME TO',
  'ALTER [COLUMN]',
  '{SET | DROP} DEFAULT', // for alter column
  'ADD SCOPE', // for alter column
  'DROP SCOPE {CASCADE | RESTRICT}', // for alter column
  'RESTART WITH', // for alter column

  // other
  'SET SCHEMA',
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
]);

const reservedPhrases = ['ON DELETE', 'ON UPDATE'];

export default class SqlFormatter extends Formatter {
  static operators = [];

  tokenizer() {
    return new Tokenizer({
      reservedCommands,
      reservedSelect,
      reservedSetOperations,
      reservedJoins,
      reservedDependentClauses: ['WHEN', 'ELSE'],
      reservedPhrases,
      reservedKeywords: keywords,
      reservedFunctionNames: functions,
      stringTypes: [{ quote: "''", prefixes: ['N', 'X', 'U&'] }],
      identTypes: [`""`, '``'],
      paramTypes: { positional: true },
    });
  }
}
