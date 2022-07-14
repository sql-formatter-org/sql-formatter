import Formatter from 'src/formatter/Formatter';
import Tokenizer from 'src/lexer/Tokenizer';
import { functions } from './sql.functions';
import { keywords } from './sql.keywords';

/**
 * Priority 1 (first)
 * keywords that begin a new statement
 * will begin new indented block
 */
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

/**
 * Priority 3
 * keywords that follow a previous Statement, must be attached to subsequent data
 * can be fully inline or on newline with optional indent
 */
const reservedDependentClauses = ['WHEN', 'ELSE'];

export default class SqlFormatter extends Formatter {
  static operators = [];

  tokenizer() {
    return new Tokenizer({
      reservedCommands,
      reservedBinaryCommands,
      reservedJoins,
      reservedDependentClauses,
      reservedKeywords: keywords,
      reservedFunctionNames: functions,
      stringTypes: [{ quote: "''", prefixes: ['X'] }],
      identTypes: [`""`, '``'],
      positionalParams: true,
    });
  }
}
