import { EOF_TOKEN, isToken, Token, TokenType } from '../../lexer/token.js';

// Shared functionality used by all MariaDB-like SQL dialects.

export function postProcess(tokens: Token[]) {
  return tokens.map((token, i) => {
    const nextToken = tokens[i + 1] || EOF_TOKEN;
    if (isToken.SET(token) && nextToken.text === '(') {
      // This is SET datatype, not SET statement
      return { ...token, type: TokenType.RESERVED_FUNCTION_NAME };
    }
    const prevToken = tokens[i - 1] || EOF_TOKEN;
    if (isToken.VALUES(token) && prevToken.text === '=') {
      // This is VALUES() function, not VALUES clause
      return { ...token, type: TokenType.RESERVED_FUNCTION_NAME };
    }
    // INTERVAL is both a comparison function (INTERVAL(N, ...)) and a
    // duration keyword (INTERVAL n DAY). Without '(', keep it as a keyword
    // so keywordCase applies; otherwise disambiguateTokens would demote it
    // to IDENTIFIER (see #985).
    if (token.type === TokenType.RESERVED_FUNCTION_NAME && token.text === 'INTERVAL') {
      if (nextToken.text !== '(') {
        return { ...token, type: TokenType.RESERVED_KEYWORD };
      }
    }
    return token;
  });
}
