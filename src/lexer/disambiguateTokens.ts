import { isReserved, Token, TokenType } from 'src/lexer/token';

/**
 * Ensures that no keyword token (RESERVED_*) is preceded by dot (.).
 *
 * Ensures that all RESERVED_FUNCTION_NAME tokens are followed by "(".
 * If they're not, converts the token to RESERVED_KEYWORD.
 *
 * When IDENTIFIER and RESERVED_KEYWORD token is followed by "["
 * converts it to ARRAY_IDENTIFIER or ARRAY_KEYWORD accordingly.
 *
 * This is needed to avoid ambiguity in parser which expects function names
 * to always be followed by open-paren, and to distinguish between
 * array accessor `foo[1]` and array literal `[1, 2, 3]`.
 */
export function disambiguateTokens(tokens: Token[]): Token[] {
  return tokens.map((token, i) => {
    if (isReserved(token.type)) {
      const prevToken = tokens[i - 1];
      if (prevToken && prevToken.text === '.') {
        return { ...token, type: TokenType.IDENTIFIER, text: token.raw };
      }
    }
    if (token.type === TokenType.RESERVED_FUNCTION_NAME) {
      const nextToken = tokens[i + 1];
      if (!nextToken || !isOpenParen(nextToken)) {
        return { ...token, type: TokenType.RESERVED_KEYWORD };
      }
    }
    if (token.type === TokenType.IDENTIFIER) {
      const nextToken = tokens[i + 1];
      if (nextToken && isOpenBracket(nextToken)) {
        return { ...token, type: TokenType.ARRAY_IDENTIFIER };
      }
    }
    if (token.type === TokenType.RESERVED_KEYWORD) {
      const nextToken = tokens[i + 1];
      if (nextToken && isOpenBracket(nextToken)) {
        return { ...token, type: TokenType.ARRAY_KEYWORD };
      }
    }
    return token;
  });
}

const isOpenParen = (t: Token): boolean => t.type === TokenType.OPEN_PAREN && t.text === '(';

const isOpenBracket = (t: Token): boolean => t.type === TokenType.OPEN_PAREN && t.text === '[';
