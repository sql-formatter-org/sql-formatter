import { DialectOptions } from '../../dialect.js';
import { expandPhrases } from '../../expandPhrases.js';
import { functions } from './n1ql.functions.js';
import { keywords } from './n1ql.keywords.js';

const reservedSelect = expandPhrases(['SELECT [ALL | DISTINCT]']);

const reservedClauses = expandPhrases([
  // queries
  'WITH',
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
  'INSERT INTO',
  'VALUES',
  // - update:
  'SET',
  // - merge:
  'MERGE INTO',
  'WHEN [NOT] MATCHED THEN',
  'UPDATE SET',
  'INSERT',
  // other
  'NEST',
  'UNNEST',
  'RETURNING',
]);

const onelineClauses = expandPhrases([
  // - update:
  'UPDATE',
  // - delete:
  'DELETE FROM',
  // - set schema:
  'SET SCHEMA',
  // https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/reservedwords.html
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
  'PREPARE',
  'REVOKE',
  'ROLLBACK TRANSACTION',
  'SAVEPOINT',
  'SET TRANSACTION',
  'UPDATE STATISTICS',
  'UPSERT',
  // other
  'LET',
  'SET CURRENT SCHEMA',
  'SHOW',
  'USE [PRIMARY] KEYS',
]);

const reservedSetOperations = expandPhrases(['UNION [ALL]', 'EXCEPT [ALL]', 'INTERSECT [ALL]']);

const reservedJoins = expandPhrases(['JOIN', '{LEFT | RIGHT} [OUTER] JOIN', 'INNER JOIN']);

const reservedPhrases = expandPhrases(['{ROWS | RANGE | GROUPS} BETWEEN']);

// For reference: http://docs.couchbase.com.s3-website-us-west-1.amazonaws.com/server/6.0/n1ql/n1ql-language-reference/index.html
export const n1ql: DialectOptions = {
  tokenizer: {
    reservedSelect,
    reservedClauses: [...reservedClauses, ...onelineClauses],
    reservedSetOperations,
    reservedJoins,
    reservedPhrases,
    supportsXor: true,
    reservedKeywords: keywords,
    reservedFunctionNames: functions,
    // NOTE: single quotes are actually not supported in N1QL,
    // but we support them anyway as all other SQL dialects do,
    // which simplifies writing tests that are shared between all dialects.
    stringTypes: ['""-bs', "''-bs"],
    identTypes: ['``'],
    extraParens: ['[]', '{}'],
    paramTypes: { positional: true, numbered: ['$'], named: ['$'] },
    lineCommentTypes: ['#', '--'],
    operators: ['%', '==', ':', '||'],
  },
  formatOptions: {
    onelineClauses,
  },
};
