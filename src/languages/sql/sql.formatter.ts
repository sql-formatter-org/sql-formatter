import { expandPhrases } from 'src/expandPhrases';
import Formatter from 'src/formatter/Formatter';
import Tokenizer from 'src/lexer/Tokenizer';
import { functions } from './sql.functions';
import { keywords } from './sql.keywords';

const reservedCommands = expandPhrases([
  // queries
  'WITH [RECURSIVE]',
  'SELECT [ALL | DISTINCT]',
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
  // other
  'ADD',
  'ALTER COLUMN',
  'ALTER TABLE',
  'CREATE TABLE',
  'DROP TABLE',
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
      reservedSetOperations,
      reservedJoins,
      reservedDependentClauses: ['WHEN', 'ELSE'],
      reservedPhrases,
      reservedKeywords: keywords,
      reservedFunctionNames: functions,
      stringTypes: [{ quote: "''", prefixes: ['N', 'X', 'U&'] }],
      identTypes: [`""`, '``'],
      positionalParams: true,
    });
  }
}
