import { expandPhrases } from 'src/expandPhrases';
import Formatter from 'src/formatter/Formatter';
import Tokenizer from 'src/lexer/Tokenizer';
import { EOF_TOKEN, isReserved, isToken, Token, TokenType } from 'src/lexer/token';
import { keywords } from './plsql.keywords';
import { functions } from './plsql.functions';

const reservedSelect = expandPhrases(['SELECT [ALL | DISTINCT | UNIQUE]']);

const reservedCommands = expandPhrases([
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
  'FOR UPDATE',
  // Data manipulation
  // - insert:
  'INSERT [INTO | ALL INTO]',
  'VALUES',
  // - update:
  'UPDATE [ONLY]',
  'SET',
  // - delete:
  'DELETE FROM [ONLY]',
  // - truncate:
  'TRUNCATE TABLE',
  // - merge:
  'MERGE [INTO]',
  'WHEN [NOT] MATCHED [THEN]',
  'UPDATE SET',
  // Data definition
  'CREATE [OR REPLACE] [NO FORCE | FORCE] [EDITIONING | EDITIONABLE | EDITIONABLE EDITIONING | NONEDITIONABLE] VIEW',
  'CREATE MATERIALIZED VIEW',
  'CREATE [GLOBAL TEMPORARY | PRIVATE TEMPORARY | SHARDED | DUPLICATED | IMMUTABLE BLOCKCHAIN | BLOCKCHAIN | IMMUTABLE] TABLE',
  'DROP TABLE',
  // - alter table:
  'ALTER TABLE',
  'ADD',
  'DROP {COLUMN | UNUSED COLUMNS | COLUMNS CONTINUE}',
  'MODIFY',
  'RENAME TO',
  'RENAME COLUMN',

  // other
  'BEGIN',
  'CONNECT BY',
  'DECLARE',
  'EXCEPT',
  'EXCEPTION',
  'LOOP',
  'RETURNING',
  'START WITH',
  'SET SCHEMA',
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
  'ON DELETE',
  'ON UPDATE',
  'ON COMMIT',
  '{ROWS | RANGE} BETWEEN',
]);

export default class PlSqlFormatter extends Formatter {
  static operators = [
    '||',
    '**',
    ':=',
    '~=',
    '^=',
    '>>',
    '<<',
    '=>',
    //  '..' // breaks operator test, handled by .
  ];

  tokenizer() {
    return new Tokenizer({
      reservedCommands,
      reservedSelect,
      reservedSetOperations,
      reservedJoins,
      reservedDependentClauses: ['WHEN', 'ELSE'],
      reservedPhrases,
      supportsXor: true,
      reservedKeywords: keywords,
      reservedFunctionNames: functions,
      stringTypes: [
        { quote: "''", prefixes: ['N'] },
        { quote: "q''", prefixes: ['N'] },
      ],
      identTypes: [`""`],
      identChars: { rest: '$#' },
      variableTypes: [{ regex: '&{1,2}[A-Za-z][A-Za-z0-9_$#]*' }],
      paramTypes: { numbered: [':'], named: [':'] },
      paramChars: {}, // Empty object used on purpose to not allow $ and # chars as specified in identChars
      operators: PlSqlFormatter.operators,
      postProcess,
    });
  }
}

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
