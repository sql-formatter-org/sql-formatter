/** Token type enum for all possible Token categories */
export enum TokenType {
  IDENT = 'IDENT',
  STRING = 'STRING',
  VARIABLE = 'VARIABLE',
  RESERVED_KEYWORD = 'RESERVED_KEYWORD',
  RESERVED_LOGICAL_OPERATOR = 'RESERVED_LOGICAL_OPERATOR',
  RESERVED_DEPENDENT_CLAUSE = 'RESERVED_DEPENDENT_CLAUSE',
  RESERVED_BINARY_COMMAND = 'RESERVED_BINARY_COMMAND',
  RESERVED_COMMAND = 'RESERVED_COMMAND',
  RESERVED_JOIN_CONDITION = 'RESERVED_JOIN_CONDITION',
  RESERVED_CASE_START = 'RESERVED_CASE_START',
  RESERVED_CASE_END = 'RESERVED_CASE_END',
  OPERATOR = 'OPERATOR',
  BLOCK_START = 'BLOCK_START',
  BLOCK_END = 'BLOCK_END',
  LINE_COMMENT = 'LINE_COMMENT',
  BLOCK_COMMENT = 'BLOCK_COMMENT',
  NUMBER = 'NUMBER',
  PARAMETER = 'PARAMETER',
  EOF = 'EOF',
}

/** Struct to store the most basic cohesive unit of language grammar */
export interface Token {
  type: TokenType;
  text: string; // The raw original text that was matched
  value: string; // Cleaned up `text` e.g. keyword converted to uppercase and extra spaces removed
  key?: string;
  whitespaceBefore?: string;
}

/**
 * For use as a "missing token"
 * e.g. in lookAhead and lookBehind to avoid dealing with null values
 */
export const EOF_TOKEN = { type: TokenType.EOF, text: '«EOF»', value: '«EOF»' };

/** Checks if two tokens are equivalent */
export const testToken =
  (compareToken: { type: TokenType; value: string }) =>
  (token: Token): boolean =>
    token.type === compareToken.type && token.value === compareToken.value;

/** Util object that allows for easy checking of Reserved Keywords */
export const isToken = {
  AS: testToken({ value: 'AS', type: TokenType.RESERVED_KEYWORD }),
  AND: testToken({ value: 'AND', type: TokenType.RESERVED_LOGICAL_OPERATOR }),
  BETWEEN: testToken({ value: 'BETWEEN', type: TokenType.RESERVED_KEYWORD }),
  CASE: testToken({ value: 'CASE', type: TokenType.RESERVED_CASE_START }),
  CAST: testToken({ value: 'CAST', type: TokenType.RESERVED_KEYWORD }),
  BY: testToken({ value: 'BY', type: TokenType.RESERVED_KEYWORD }),
  END: testToken({ value: 'END', type: TokenType.RESERVED_CASE_END }),
  FROM: testToken({ value: 'FROM', type: TokenType.RESERVED_COMMAND }),
  LIMIT: testToken({ value: 'LIMIT', type: TokenType.RESERVED_COMMAND }),
  SELECT: testToken({ value: 'SELECT', type: TokenType.RESERVED_COMMAND }),
  SET: testToken({ value: 'SET', type: TokenType.RESERVED_COMMAND }),
  TABLE: testToken({ value: 'TABLE', type: TokenType.RESERVED_KEYWORD }),
  WINDOW: testToken({ value: 'WINDOW', type: TokenType.RESERVED_COMMAND }),
  WITH: testToken({ value: 'WITH', type: TokenType.RESERVED_COMMAND }),
};

/** Checks if token is a Reserved Command or Reserved Binary Command */
export const isCommand = (token: Token): boolean =>
  token.type === TokenType.RESERVED_COMMAND || token.type === TokenType.RESERVED_BINARY_COMMAND;

/** Checks if token is any Reserved Keyword or Command */
export const isReserved = (token: Token): boolean =>
  token.type === TokenType.RESERVED_KEYWORD ||
  token.type === TokenType.RESERVED_LOGICAL_OPERATOR ||
  token.type === TokenType.RESERVED_DEPENDENT_CLAUSE ||
  token.type === TokenType.RESERVED_JOIN_CONDITION ||
  token.type === TokenType.RESERVED_COMMAND ||
  token.type === TokenType.RESERVED_BINARY_COMMAND ||
  token.type === TokenType.RESERVED_CASE_START ||
  token.type === TokenType.RESERVED_CASE_END;
