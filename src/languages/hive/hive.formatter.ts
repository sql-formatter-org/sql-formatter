import { expandPhrases } from 'src/expandPhrases';
import Formatter from 'src/formatter/Formatter';
import type { QuoteType } from 'src/lexer/regexTypes';
import Tokenizer from 'src/lexer/Tokenizer';
import { functions } from './hive.functions';
import { keywords } from './hive.keywords';

const reservedCommands = [
  // commands
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
  'FROM',
  'GROUP BY',
  'HAVING',
  'INSERT',
  'INSERT INTO', // added
  'LIMIT',
  'OFFSET',
  'ORDER BY',
  'SELECT',
  'SET',
  'SET SCHEMA', // added
  'SHOW',
  'SORT BY',
  'TRUNCATE',
  'UPDATE',
  'VALUES',
  'WHERE',
  'WITH',
  'WINDOW',
  'PARTITION BY',

  // newline keywords
  'STORED AS',
  'STORED BY',
  'ROW FORMAT',
];

const reservedBinaryCommands = expandPhrases(['UNION [ALL | DISTINCT]']);

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
  static stringTypes: QuoteType[] = [
    { quote: '""', escapes: ['\\\\'] },
    { quote: "''", escapes: ['\\\\'] },
  ];

  tokenizer() {
    return new Tokenizer({
      reservedCommands,
      reservedBinaryCommands,
      reservedJoins,
      reservedDependentClauses: ['WHEN', 'ELSE'],
      reservedKeywords: keywords,
      reservedFunctionNames: functions,
      openParens: ['(', '['],
      closeParens: [')', ']'],
      stringTypes: HiveFormatter.stringTypes,
      identTypes: ['``'],
      variableTypes: [{ quote: '{}', prefixes: ['$'], requirePrefix: true }],
      operators: HiveFormatter.operators,
    });
  }
}
