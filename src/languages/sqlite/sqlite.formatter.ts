import { expandPhrases } from 'src/expandPhrases';
import Formatter from 'src/formatter/Formatter';
import Tokenizer from 'src/lexer/Tokenizer';
import { functions } from './sqlite.functions';
import { keywords } from './sqlite.keywords';

const reservedCommands = expandPhrases([
  // queries
  'WITH [RECURSIVE]',
  'SELECT [ALL | DISTINCT]',
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
  'UPDATE [OR ABORT | OR FAIL | OR IGNORE | OR REPLACE | OR ROLLBACK]',
  'SET',
  // - delete:
  'DELETE FROM',
  // DDL
  'CREATE [TEMPORARY | TEMP] VIEW [IF NOT EXISTS]',
  'CREATE [TEMPORARY | TEMP] TABLE [IF NOT EXISTS]',
  'DROP TABLE [IF EXISTS]',
  // - alter table:
  'ALTER TABLE',
  'ADD [COLUMN]',
  'DROP [COLUMN]',
  'RENAME [COLUMN]',
  'RENAME TO',

  // other
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

const reservedPhrases = ['ON DELETE', 'ON UPDATE'];

export default class SqliteFormatter extends Formatter {
  // https://www.sqlite.org/lang_expr.html
  static operators = ['~', '->', '->>', '||', '<<', '>>', '=='];

  tokenizer() {
    return new Tokenizer({
      reservedCommands,
      reservedSetOperations,
      reservedJoins,
      reservedDependentClauses: ['WHEN', 'ELSE'],
      reservedPhrases,
      reservedKeywords: keywords,
      reservedFunctionNames: functions,
      stringTypes: [
        { quote: "''", prefixes: ['X'] },
        // { quote: '""', prefixes: ['X'] }, // currently conflict with "" identifiers
      ],
      identTypes: [`""`, '``', '[]'],
      // https://www.sqlite.org/lang_expr.html#parameters
      positionalParams: true,
      numberedParamTypes: ['?'],
      namedParamTypes: [':', '@', '$'],
      operators: SqliteFormatter.operators,
    });
  }
}
