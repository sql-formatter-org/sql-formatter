import Formatter from 'src/formatter/Formatter';
import Tokenizer from 'src/lexer/Tokenizer';
import type { QuoteType } from 'src/lexer/regexTypes';
import { functions } from './sqlite.functions';
import { keywords } from './sqlite.keywords';

const reservedCommands = [
  'ADD',
  'ALTER COLUMN',
  'ALTER TABLE',
  'CREATE TABLE',
  'DROP TABLE',
  'DELETE',
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

// joins - https://www.sqlite.org/syntax/join-operator.html
const reservedJoins = [
  'JOIN',
  'LEFT JOIN',
  'LEFT OUTER JOIN',
  'INNER JOIN',
  'CROSS JOIN',
  'NATURAL JOIN',
  'NATURAL LEFT JOIN',
  'NATURAL LEFT OUTER JOIN',
  'NATURAL INNER JOIN',
  'NATURAL CROSS JOIN',
];

export default class SqliteFormatter extends Formatter {
  // https://www.sqlite.org/lang_expr.html
  static operators = ['~', '->', '->>', '||', '<<', '>>', '=='];
  static stringTypes: QuoteType[] = [
    { quote: "''", prefixes: ['X'], escapes: ["'"] },
    // { quote: '""', prefixes: ['X'] }, // currently conflict with "" identifiers
  ];

  tokenizer() {
    return new Tokenizer({
      reservedCommands,
      reservedBinaryCommands,
      reservedJoins,
      reservedDependentClauses: ['WHEN', 'ELSE'],
      reservedKeywords: keywords,
      reservedFunctionNames: functions,
      stringTypes: SqliteFormatter.stringTypes,
      identTypes: [`""`, '``', '[]'],
      // https://www.sqlite.org/lang_expr.html#parameters
      positionalParams: true,
      numberedParamTypes: ['?'],
      namedParamTypes: [':', '@', '$'],
      operators: SqliteFormatter.operators,
    });
  }
}
