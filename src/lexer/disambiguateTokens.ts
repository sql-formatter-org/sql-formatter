import { isReserved, Token, TokenType } from './token.js';

/**
 * Ensures that no keyword token (RESERVED_*) is preceded or followed by a dot (.)
 * or any other property-access operator.
 *
 * Ensures that all RESERVED_FUNCTION_NAME tokens are followed by "(".
 * If they're not, converts the token to IDENTIFIER.
 *
 * Converts RESERVED_DATA_TYPE tokens followed by "(" to RESERVED_PARAMETERIZED_DATA_TYPE.
 *
 * When IDENTIFIER or RESERVED_DATA_TYPE token is followed by "["
 * converts it to ARRAY_IDENTIFIER or ARRAY_KEYWORD accordingly.
 *
 * Converts a reserved word after AS to IDENTIFIER when that word cannot start
 * a clause there, leaving `CREATE TABLE t AS SELECT ...` alone.
 *
 * This is needed to avoid ambiguity in parser which expects function names
 * to always be followed by open-paren, and to distinguish between
 * array accessor `foo[1]` and array literal `[1, 2, 3]`.
 */
export function disambiguateTokens(tokens: Token[]): Token[] {
  return tokens
    .map(propertyNameKeywordToIdent)
    .map(keywordAliasAfterAs)
    .map(funcNameToIdent)
    .map(dataTypeToParameterizedDataType)
    .map(identToArrayIdent)
    .map(dataTypeToArrayKeyword);
}

const propertyNameKeywordToIdent = (token: Token, i: number, tokens: Token[]): Token => {
  if (isReserved(token.type)) {
    const prevToken = prevNonCommentToken(tokens, i);
    if (prevToken && prevToken.type === TokenType.PROPERTY_ACCESS_OPERATOR) {
      return { ...token, type: TokenType.IDENTIFIER, text: token.raw };
    }
    const nextToken = nextNonCommentToken(tokens, i);
    if (nextToken && nextToken.type === TokenType.PROPERTY_ACCESS_OPERATOR) {
      return { ...token, type: TokenType.IDENTIFIER, text: token.raw };
    }
  }
  return token;
};

/**
 * Some dialects allow reserved words as aliases, as in `SELECT id AS set FROM tbl`.
 * Such a word is tokenized as a RESERVED_* token, which the parser then treats as
 * the start of a clause. Directly after AS it can only be an alias name, so we
 * convert it to IDENTIFIER.
 *
 * Only the token types that cannot legitimately follow AS are converted, leaving
 * `CREATE TABLE t AS SELECT ...` and `PREPARE foo AS UPDATE ...` working.
 */
const keywordAliasAfterAs = (token: Token, i: number, tokens: Token[]): Token => {
  if (canBeAliasAfterAs(token)) {
    const prevToken = prevNonCommentToken(tokens, i);
    if (prevToken && isAsKeyword(prevToken)) {
      return { ...token, type: TokenType.IDENTIFIER, text: token.raw };
    }
  }
  return token;
};

const isAsKeyword = (token: Token): boolean =>
  token.type === TokenType.RESERVED_KEYWORD && token.text === 'AS';

const canBeAliasAfterAs = (token: Token): boolean =>
  token.type === TokenType.RESERVED_SET_OPERATION ||
  token.type === TokenType.RESERVED_JOIN ||
  token.type === TokenType.LIMIT ||
  token.type === TokenType.BETWEEN ||
  token.type === TokenType.CASE ||
  token.type === TokenType.END ||
  token.type === TokenType.WHEN ||
  token.type === TokenType.ELSE ||
  token.type === TokenType.THEN ||
  token.type === TokenType.AND ||
  token.type === TokenType.OR ||
  token.type === TokenType.XOR ||
  // SET is the clause keyword used as an alias in #801. The other
  // RESERVED_CLAUSE words can follow AS for real (SELECT, VALUES, WITH,
  // INSERT, UPDATE, DELETE, EXECUTE, ...), so they stay keywords.
  (token.type === TokenType.RESERVED_CLAUSE && token.text === 'SET');

const funcNameToIdent = (token: Token, i: number, tokens: Token[]): Token => {
  if (token.type === TokenType.RESERVED_FUNCTION_NAME) {
    const nextToken = nextNonCommentToken(tokens, i);
    if (!nextToken || !isOpenParen(nextToken)) {
      return { ...token, type: TokenType.IDENTIFIER, text: token.raw };
    }
  }
  return token;
};

const dataTypeToParameterizedDataType = (token: Token, i: number, tokens: Token[]): Token => {
  if (token.type === TokenType.RESERVED_DATA_TYPE) {
    const nextToken = nextNonCommentToken(tokens, i);
    if (nextToken && isOpenParen(nextToken)) {
      return { ...token, type: TokenType.RESERVED_PARAMETERIZED_DATA_TYPE };
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

const dataTypeToArrayKeyword = (token: Token, i: number, tokens: Token[]): Token => {
  if (token.type === TokenType.RESERVED_DATA_TYPE) {
    const nextToken = nextNonCommentToken(tokens, i);
    if (nextToken && isOpenBracket(nextToken)) {
      return { ...token, type: TokenType.ARRAY_KEYWORD };
    }
  }
  return token;
};

const prevNonCommentToken = (tokens: Token[], index: number): Token | undefined =>
  nextNonCommentToken(tokens, index, -1);

const nextNonCommentToken = (
  tokens: Token[],
  index: number,
  dir: -1 | 1 = 1
): Token | undefined => {
  let i = 1;
  while (tokens[index + i * dir] && isComment(tokens[index + i * dir])) {
    i++;
  }
  return tokens[index + i * dir];
};

const isOpenParen = (t: Token): boolean => t.type === TokenType.OPEN_PAREN && t.text === '(';

const isOpenBracket = (t: Token): boolean => t.type === TokenType.OPEN_PAREN && t.text === '[';

const isComment = (t: Token): boolean =>
  t.type === TokenType.BLOCK_COMMENT || t.type === TokenType.LINE_COMMENT;
