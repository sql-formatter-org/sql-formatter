import Formatter from 'src/formatter/Formatter';
import Tokenizer from 'src/lexer/Tokenizer';
import { functions } from './n1ql.functions';
import { keywords } from './n1ql.keywords';

/**
 * Priority 1 (first)
 * keywords that begin a new statement
 * will begin new indented block
 */
// https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/reservedwords.html
const reservedCommands = [
  'ADVISE',
  'ALTER INDEX',
  'BEGIN TRANSACTION',
  'BUILD INDEX',
  'COMMIT TRANSACTION',
  'CREATE COLLECTION',
  'CREATE FUNCTION',
  'CREATE INDEX',
  'CREATE PRIMARY INDEX',
  'CREATE SCOPE',
  'CREATE TABLE', // verify
  'DELETE',
  'DELETE FROM',
  'DROP COLLECTION',
  'DROP FUNCTION',
  'DROP INDEX',
  'DROP PRIMARY INDEX',
  'DROP SCOPE',
  'EXECUTE',
  'EXECUTE FUNCTION',
  'EXPLAIN',
  'GRANT',
  'INFER',
  'INSERT',
  'MERGE',
  'PREPARE',
  'RETURNING',
  'REVOKE',
  'ROLLBACK TRANSACTION',
  'SAVEPOINT',
  'SELECT',
  'SET TRANSACTION',
  'UPDATE',
  'UPDATE STATISTICS',
  'UPSERT',
  // other
  'DROP TABLE', // verify,
  'FROM',
  'GROUP BY',
  'HAVING',
  'INSERT INTO',
  'LET',
  'LIMIT',
  'OFFSET',
  'NEST',
  'ORDER BY',
  'SET CURRENT SCHEMA',
  'SET SCHEMA',
  'SET',
  'SHOW',
  'UNNEST',
  'USE KEYS',
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
  'MINUS',
  'MINUS ALL',
  'MINUS DISTINCT',
];

const reservedJoins = [
  'JOIN',
  'INNER JOIN',
  'LEFT JOIN',
  'LEFT OUTER JOIN',
  'RIGHT JOIN',
  'RIGHT OUTER JOIN',
];

/**
 * Priority 3
 * keywords that follow a previous Statement, must be attached to subsequent data
 * can be fully inline or on newline with optional indent
 */
const reservedDependentClauses = ['WHEN', 'ELSE'];

// For reference: http://docs.couchbase.com.s3-website-us-west-1.amazonaws.com/server/6.0/n1ql/n1ql-language-reference/index.html
export default class N1qlFormatter extends Formatter {
  static operators = ['==', '||'];

  tokenizer() {
    return new Tokenizer({
      reservedCommands,
      reservedBinaryCommands,
      reservedJoins,
      reservedDependentClauses,
      reservedLogicalOperators: ['AND', 'OR', 'XOR'],
      reservedKeywords: keywords,
      reservedFunctionNames: functions,
      // NOTE: single quotes are actually not supported in N1QL,
      // but we support them anyway as all other SQL dialects do,
      // which simplifies writing tests that are shared between all dialects.
      stringTypes: [`""`, "''"],
      identTypes: ['``'],
      openParens: ['(', '[', '{'],
      closeParens: [')', ']', '}'],
      positionalParams: true,
      numberedParamTypes: ['$'],
      namedParamTypes: ['$'],
      lineCommentTypes: ['#', '--'],
      operators: N1qlFormatter.operators,
    });
  }
}
