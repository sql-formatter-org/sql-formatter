import { expandPhrases } from 'src/expandPhrases';
import Formatter from 'src/formatter/Formatter';
import Tokenizer from 'src/lexer/Tokenizer';
import { functions } from './hive.functions';
import { keywords } from './hive.keywords';

const reservedCommands = expandPhrases([
  // queries
  'WITH',
  'SELECT [ALL | DISTINCT]',
  'FROM',
  'WHERE',
  'GROUP BY',
  'HAVING',
  'WINDOW',
  'PARTITION BY',
  'ORDER BY',
  'SORT BY',
  'CLUSTER BY',
  'DISTRIBUTE BY',
  'LIMIT',
  // Data manipulation
  // Hive does not actually support plain INSERT INTO, only INSERT INTO TABLE
  // but it's a nuisance to not support it, as all other dialects do.
  'INSERT INTO [TABLE]',
  'VALUES',
  'UPDATE',
  'SET',
  // other
  'ALTER',
  'ALTER COLUMN', // added
  'ALTER TABLE', // added
  'CREATE',
  'CREATE TABLE', // added
  'USE',
  'DESCRIBE',
  'DROP',
  'DROP TABLE', // added
  'FETCH',
  'SET SCHEMA', // added
  'SHOW',
  'TRUNCATE',
  // newline keywords
  'STORED AS',
  'STORED BY',
  'ROW FORMAT',
]);

const reservedSetOperations = expandPhrases(['UNION [ALL | DISTINCT]']);

const reservedJoins = expandPhrases([
  'JOIN',
  '{LEFT | RIGHT | FULL} [OUTER] JOIN',
  '{INNER | CROSS} JOIN',
  // non-standard joins
  'LEFT SEMI JOIN',
]);

// https://cwiki.apache.org/confluence/display/Hive/LanguageManual
export default class HiveFormatter extends Formatter {
  static operators = ['<=>', '==', '||'];

  tokenizer() {
    return new Tokenizer({
      reservedCommands,
      reservedSetOperations,
      reservedJoins,
      reservedDependentClauses: ['WHEN', 'ELSE'],
      reservedKeywords: keywords,
      reservedFunctionNames: functions,
      openParens: ['(', '['],
      closeParens: [')', ']'],
      stringTypes: ['""', "''"],
      identTypes: ['``'],
      variableTypes: [{ quote: '{}', prefixes: ['$'], requirePrefix: true }],
      operators: HiveFormatter.operators,
    });
  }
}
