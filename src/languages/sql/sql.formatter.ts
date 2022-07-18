import { expandPhrases } from 'src/expandPhrases';
import Formatter from 'src/formatter/Formatter';
import Tokenizer from 'src/lexer/Tokenizer';
import { functions } from './sql.functions';
import { keywords } from './sql.keywords';

const reservedCommands = [
  'ADD',
  'ALTER COLUMN',
  'ALTER TABLE',
  'CREATE TABLE',
  'DROP TABLE',
  'DELETE FROM',
  'FETCH FIRST',
  'FETCH NEXT',
  'FETCH PRIOR',
  'FETCH LAST',
  'FETCH ABSOLUTE',
  'FETCH RELATIVE',
  'FROM',
  'GROUP BY',
  'HAVING',
  'INSERT INTO',
  'LIMIT',
  'OFFSET',
  'ORDER BY',
  'SELECT',
  'SET SCHEMA',
  'SET',
  'UPDATE',
  'VALUES',
  'WHERE',
  'WITH',
  'WINDOW',
  'PARTITION BY',
];

const reservedBinaryCommands = expandPhrases([
  'INTERSECT [ALL | DISTINCT]',
  'UNION [ALL | DISTINCT]',
  'EXCEPT [ALL | DISTINCT]',
]);

const reservedJoins = expandPhrases([
  '[LEFT | RIGHT | FULL] [OUTER] JOIN',
  'INNER JOIN',
  'CROSS JOIN',
  'NATURAL JOIN',
]);

export default class SqlFormatter extends Formatter {
  static operators = [];

  tokenizer() {
    return new Tokenizer({
      reservedCommands,
      reservedBinaryCommands,
      reservedJoins,
      reservedDependentClauses: ['WHEN', 'ELSE'],
      reservedKeywords: keywords,
      reservedFunctionNames: functions,
      stringTypes: [{ quote: "''", prefixes: ['N', 'X', 'U&'] }],
      identTypes: [`""`, '``'],
      positionalParams: true,
    });
  }
}
