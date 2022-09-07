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
  return tokens
    .map(dotKeywordToIdent)
    .map(funcNameToKeyword)
    .map(identToArrayIdent)
    .map(keywordToArrayKeyword);
}

const dotKeywordToIdent = (token: Token, i: number, tokens: Token[]): Token => {
  if (isReserved(token.type)) {
    const prevToken = tokens[i - 1];
    if (prevToken && prevToken.text === '.') {
      return { ...token, type: TokenType.IDENTIFIER, text: token.raw };
    }
  }
  return token;
};

const funcNameToKeyword = (token: Token, i: number, tokens: Token[]): Token => {
  if (token.type === TokenType.RESERVED_FUNCTION_NAME) {
    const nextToken = nextNonCommentToken(tokens, i);
    if (!nextToken || !isOpenParen(nextToken)) {
      return { ...token, type: TokenType.RESERVED_KEYWORD };
    }
  }
  return token;
};

const identToArrayIdent = (token: Token, i: number, tokens: Token[]): Token => {
  if (token.type === TokenType.IDENTIFIER) {
    const nextToken = nextNonCommentToken(tokens, i);
    if (nextToken && isOpenBracket(nextToken)) {
      return { ...token, type: TokenType.ARRAY_IDENTIFIER };
    }
  }
  return token;
};

const keywordToArrayKeyword = (token: Token, i: number, tokens: Token[]): Token => {
  if (token.type === TokenType.RESERVED_KEYWORD) {
    const nextToken = nextNonCommentToken(tokens, i);
    if (nextToken && isOpenBracket(nextToken)) {
      return { ...token, type: TokenType.ARRAY_KEYWORD };
    }
  }
  return token;
};

const nextNonCommentToken = (tokens: Token[], index: number): Token | undefined => {
  let i = 1;
  while (tokens[index + i] && isComment(tokens[index + i])) {
    i++;
  }
  return tokens[index + i];
};

const isOpenParen = (t: Token): boolean => t.type === TokenType.OPEN_PAREN && t.text === '(';

const isOpenBracket = (t: Token): boolean => t.type === TokenType.OPEN_PAREN && t.text === '[';

const isComment = (t: Token): boolean =>
  t.type === TokenType.BLOCK_COMMENT || t.type === TokenType.LINE_COMMENT;
