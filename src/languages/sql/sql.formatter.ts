import Formatter from 'src/formatter/Formatter';
import Tokenizer from 'src/lexer/Tokenizer';
import type { QuoteType } from 'src/lexer/regexTypes';
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

const reservedBinaryCommands = [
  'INTERSECT',
  'INTERSECT ALL',
  'INTERSECT DISTINCT',
  'UNION',
  'UNION ALL',
  'UNION DISTINCT',
  'EXCEPT',
  'EXCEPT ALL',
  'EXCEPT DISTINCT',
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
  'NATURAL JOIN',
];

export default class SqlFormatter extends Formatter {
  static operators = [];
  static stringTypes: QuoteType[] = [{ quote: "''", prefixes: ['N', 'X', 'U&'], escapes: ["'"] }];

  tokenizer() {
    return new Tokenizer({
      reservedCommands,
      reservedBinaryCommands,
      reservedJoins,
      reservedDependentClauses: ['WHEN', 'ELSE'],
      reservedKeywords: keywords,
      reservedFunctionNames: functions,
      stringTypes: SqlFormatter.stringTypes,
      identTypes: [`""`, '``'],
      positionalParams: true,
    });
  }
}
