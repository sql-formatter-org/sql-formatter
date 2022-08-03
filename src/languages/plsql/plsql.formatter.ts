import { expandPhrases } from 'src/expandPhrases';
import Formatter from 'src/formatter/Formatter';
import Tokenizer from 'src/lexer/Tokenizer';
import { EOF_TOKEN, isReserved, isToken, type Token, TokenType } from 'src/lexer/token';
import { keywords } from './plsql.keywords';
import { functions } from './plsql.functions';

const reservedCommands = expandPhrases([
  // queries
  'WITH',
  'SELECT [ALL | DISTINCT | UNIQUE]',
  'FROM',
  'WHERE',
  'GROUP BY',
  'HAVING',
  'ORDER [SIBLINGS] BY',
  'OFFSET',
  'FETCH {FIRST | NEXT}',
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
  // other
  'ADD',
  'ALTER COLUMN',
  'ALTER TABLE',
  'BEGIN',
  'CONNECT BY',
  'CREATE TABLE',
  'DROP TABLE',
  'DECLARE',
  'EXCEPT',
  'EXCEPTION',
  'LOOP',
  'MODIFY',
  'RETURNING',
  'SET CURRENT SCHEMA',
  'SET SCHEMA',
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

const reservedPhrases = ['ON DELETE', 'ON UPDATE', 'ON COMMIT'];

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
      reservedSetOperations,
      reservedJoins,
      reservedDependentClauses: ['WHEN', 'ELSE'],
      reservedPhrases,
      reservedLogicalOperators: ['AND', 'OR', 'XOR'],
      reservedKeywords: keywords,
      reservedFunctionNames: functions,
      stringTypes: [
        { quote: "''", prefixes: ['N'] },
        { quote: "q''", prefixes: ['N'] },
      ],
      identTypes: [`""`],
      identChars: { rest: '$#' },
      variableTypes: [{ regex: '&{1,2}[A-Za-z][A-Za-z0-9_$#]*' }],
      numberedParamTypes: [':'],
      namedParamTypes: [':'],
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

    if (isReserved(token)) {
      previousReservedToken = token;
    }

    return token;
  });
}
