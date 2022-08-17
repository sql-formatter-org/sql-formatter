import { Token, TokenType } from 'src/lexer/token';

/**
 * Ensures that all RESERVED_FUNCTION_NAME tokens are followed by "(".
 * If they're not, converts the token to RESERVED_KEYWORD.
 *
 * This is needed to avoid ambiguity in parser which expects function names
 * to always be followed by open-paren.
 */
export function correctFunctionNameTokens(tokens: Token[]): Token[] {
  return tokens.map((token, i) => {
    if (token.type === TokenType.RESERVED_FUNCTION_NAME) {
      const nextToken = tokens[i + 1];
      if (!nextToken || !isOpenParen(nextToken)) {
        return { ...token, type: TokenType.RESERVED_KEYWORD };
      }
    }
    return token;
  });
}

const isOpenParen = (t: Token): boolean => t.type === TokenType.OPEN_PAREN && t.text === '(';
