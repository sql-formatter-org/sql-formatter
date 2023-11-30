import { DialectOptions } from '../../dialect.js';
import { expandPhrases } from '../../expandPhrases.js';
import { EOF_TOKEN, isReserved, isToken, Token, TokenType } from '../../lexer/token.js';
import { dataTypes, keywords } from './plsql.keywords.js';
import { functions } from './plsql.functions.js';

const reservedSelect = expandPhrases(['SELECT [ALL | DISTINCT | UNIQUE]']);

const reservedClauses = expandPhrases([
  // queries
  'WITH',
  'FROM',
  'WHERE',
  'GROUP BY',
  'HAVING',
  'PARTITION BY',
  'ORDER [SIBLINGS] BY',
  'OFFSET',
  'FETCH {FIRST | NEXT}',
  'FOR UPDATE [OF]',
  // Data manipulation
  // - insert:
  'INSERT [INTO | ALL INTO]',
  'VALUES',
  // - update:
  'SET',
  // - merge:
  'MERGE [INTO]',
  'WHEN [NOT] MATCHED [THEN]',
  'UPDATE SET',
  // Data definition
  'CREATE [OR REPLACE] [NO FORCE | FORCE] [EDITIONING | EDITIONABLE | EDITIONABLE EDITIONING | NONEDITIONABLE] VIEW',
  'CREATE MATERIALIZED VIEW',
  'CREATE [GLOBAL TEMPORARY | PRIVATE TEMPORARY | SHARDED | DUPLICATED | IMMUTABLE BLOCKCHAIN | BLOCKCHAIN | IMMUTABLE] TABLE',
  // other
  'RETURNING',
]);

const onelineClauses = expandPhrases([
  // - update:
  'UPDATE [ONLY]',
  // - delete:
  'DELETE FROM [ONLY]',
  // - drop table:
  'DROP TABLE',
  // - alter table:
  'ALTER TABLE',
  'ADD',
  'DROP {COLUMN | UNUSED COLUMNS | COLUMNS CONTINUE}',
  'MODIFY',
  'RENAME TO',
  'RENAME COLUMN',
  // - truncate:
  'TRUNCATE TABLE',
  // other
  'SET SCHEMA',
  'BEGIN',
  'CONNECT BY',
  'DECLARE',
  'EXCEPT',
  'EXCEPTION',
  'LOOP',
  'START WITH',
]);

const reservedSetOperations = expandPhrases(['UNION [ALL]', 'EXCEPT', 'INTERSECT']);

const reservedJoins = expandPhrases([
  'JOIN',
  '{LEFT | RIGHT | FULL} [OUTER] JOIN',
  '{INNER | CROSS} JOIN',
  'NATURAL [INNER] JOIN',
  'NATURAL {LEFT | RIGHT | FULL} [OUTER] JOIN',
  // non-standard joins
  '{CROSS | OUTER} APPLY',
]);

const reservedPhrases = expandPhrases([
  'ON {UPDATE | DELETE} [SET NULL]',
  'ON COMMIT',
  '{ROWS | RANGE} BETWEEN',
]);

export const plsql: DialectOptions = {
  name: 'plsql',
  tokenizerOptions: {
    reservedSelect,
    reservedClauses: [...reservedClauses, ...onelineClauses],
    reservedSetOperations,
    reservedJoins,
    reservedPhrases,
    supportsXor: true,
    reservedKeywords: keywords,
    reservedDataTypes: dataTypes,
    reservedFunctionNames: functions,
    stringTypes: [
      { quote: "''-qq", prefixes: ['N'] },
      { quote: "q''", prefixes: ['N'] },
    ],
    // PL/SQL doesn't actually support escaping of quotes in identifiers,
    // but for the sake of simpler testing we'll support this anyway
    // as all other SQL dialects with "identifiers" do.
    identTypes: [`""-qq`],
    identChars: { rest: '$#' },
    variableTypes: [{ regex: '&{1,2}[A-Za-z][A-Za-z0-9_$#]*' }],
    paramTypes: { numbered: [':'], named: [':'] },
    paramChars: {}, // Empty object used on purpose to not allow $ and # chars as specified in identChars
    operators: [
      '**',
      ':=',
      '%',
      '~=',
      '^=',
      // '..', // Conflicts with float followed by dot (so "2..3" gets parsed as ["2.", ".", "3"])
      '>>',
      '<<',
      '=>',
      '@',
      '||',
    ],
    postProcess,
  },
  formatOptions: {
    alwaysDenseOperators: ['@'],
    onelineClauses,
  },
};

function postProcess(tokens: Token[]) {
  let previousReservedToken: Token = EOF_TOKEN;

  return tokens.map(token => {
    // BY [SET]
    if (isToken.SET(token) && isToken.BY(previousReservedToken)) {
      return { ...token, type: TokenType.RESERVED_KEYWORD };
    }

    if (isReserved(token.type)) {
      previousReservedToken = token;
    }

    return token;
  });
}
