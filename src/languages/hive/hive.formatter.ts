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

const reservedBinaryCommands = [
  'INTERSECT',
  'INTERSECT ALL',
  'INTERSECT DISTINCT',
  'UNION',
  'UNION ALL',
  'UNION DISTINCT',
];

const reservedJoins = [
  'JOIN',
  'INNER JOIN',
  'LEFT JOIN',
  'LEFT OUTER JOIN',
  'RIGHT JOIN',
  'RIGHT OUTER JOIN',
  'FULL JOIN',
  'FULL OUTER JOIN',
  'CROSS JOIN',
];

// https://cwiki.apache.org/confluence/display/Hive/LanguageManual
export default class HiveFormatter extends Formatter {
  static operators = ['<=>', '==', '||'];
  static stringTypes: QuoteType[] = ['""', "''"];

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
