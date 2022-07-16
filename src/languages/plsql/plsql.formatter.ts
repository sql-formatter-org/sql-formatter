import Formatter from 'src/formatter/Formatter';
import Tokenizer from 'src/lexer/Tokenizer';
import { EOF_TOKEN, isReserved, isToken, type Token, TokenType } from 'src/lexer/token';
import { keywords } from './plsql.keywords';
import { functions } from './plsql.functions';

const reservedCommands = [
  'ADD',
  'ALTER COLUMN',
  'ALTER TABLE',
  'BEGIN',
  'CONNECT BY',
  'CREATE TABLE', // verify
  'DROP TABLE', // verify
  'DECLARE',
  'DELETE',
  'DELETE FROM',
  'EXCEPT',
  'EXCEPTION',
  'FETCH FIRST',
  'FROM',
  'GROUP BY',
  'HAVING',
  'INSERT INTO',
  'INSERT',
  'LIMIT',
  'OFFSET',
  'LOOP',
  'MODIFY',
  'ORDER BY',
  'RETURNING',
  'SELECT',
  'SET CURRENT SCHEMA',
  'SET SCHEMA',
  'SET',
  'START WITH',
  'UPDATE',
  'VALUES',
  'WHERE',
  'WITH',
];

const reservedBinaryCommands = [
  // set booleans
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
  // apply
  'CROSS APPLY',
  'OUTER APPLY',
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
      reservedBinaryCommands,
      reservedJoins,
      reservedDependentClauses: ['WHEN', 'ELSE'],
      reservedLogicalOperators: ['AND', 'OR', 'XOR'],
      reservedKeywords: keywords,
      reservedFunctionNames: functions,
      // TODO: support custom-delimited strings: Q'{..}' q'<..>' etc
      stringTypes: [{ quote: "''", prefixes: ['N'] }],
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
