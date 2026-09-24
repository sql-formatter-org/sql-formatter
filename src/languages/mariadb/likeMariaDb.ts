import {
  isToken,
  nextNonCommentToken,
  prevNonCommentToken,
  Token,
  TokenType,
} from '../../lexer/token.js';

// Shared functionality used by all MariaDB-like SQL dialects.

export function postProcess(tokens: Token[]) {
  return tokens.map((token, i) => {
    const nextToken = nextNonCommentToken(tokens, i);
    if (isToken.SET(token) && nextToken.text === '(') {
      // This is SET datatype, not SET statement
      return { ...token, type: TokenType.RESERVED_FUNCTION_NAME };
    }
    const prevToken = prevNonCommentToken(tokens, i);
    if (isToken.VALUES(token) && prevToken.text === '=') {
      // This is VALUES() function, not VALUES clause
      return { ...token, type: TokenType.RESERVED_FUNCTION_NAME };
    }
    return token;
  });
}
