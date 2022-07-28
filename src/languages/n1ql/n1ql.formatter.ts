import { expandPhrases } from 'src/expandPhrases';
import Formatter from 'src/formatter/Formatter';
import Tokenizer from 'src/lexer/Tokenizer';
import { functions } from './n1ql.functions';
import { keywords } from './n1ql.keywords';

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

const reservedSetOperations = expandPhrases(['UNION [ALL]', 'EXCEPT [ALL]', 'INTERSECT [ALL]']);

const reservedJoins = expandPhrases(['JOIN', '{LEFT | RIGHT} [OUTER] JOIN', 'INNER JOIN']);

// For reference: http://docs.couchbase.com.s3-website-us-west-1.amazonaws.com/server/6.0/n1ql/n1ql-language-reference/index.html
export default class N1qlFormatter extends Formatter {
  static operators = ['==', '||'];

  tokenizer() {
    return new Tokenizer({
      reservedCommands,
      reservedSetOperations,
      reservedJoins,
      reservedDependentClauses: ['WHEN', 'ELSE'],
      reservedLogicalOperators: ['AND', 'OR', 'XOR'],
      reservedKeywords: keywords,
      reservedFunctionNames: functions,
      // NOTE: single quotes are actually not supported in N1QL,
      // but we support them anyway as all other SQL dialects do,
      // which simplifies writing tests that are shared between all dialects.
      stringTypes: ['""', "''"],
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
