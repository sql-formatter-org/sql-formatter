/** Token type enum for all possible Token categories */
export enum TokenType {
  QUOTED_IDENTIFIER = 'QUOTED_IDENTIFIER',
  IDENTIFIER = 'IDENTIFIER',
  STRING = 'STRING',
  VARIABLE = 'VARIABLE',
  RESERVED_KEYWORD = 'RESERVED_KEYWORD',
  RESERVED_FUNCTION_NAME = 'RESERVED_FUNCTION_NAME',
  RESERVED_PHRASE = 'RESERVED_PHRASE',
  RESERVED_DEPENDENT_CLAUSE = 'RESERVED_DEPENDENT_CLAUSE',
  RESERVED_SET_OPERATION = 'RESERVED_SET_OPERATION',
  RESERVED_COMMAND = 'RESERVED_COMMAND',
  RESERVED_SELECT = 'RESERVED_SELECT',
  RESERVED_JOIN = 'RESERVED_JOIN',
  CASE = 'CASE',
  END = 'END',
  LIMIT = 'LIMIT',
  BETWEEN = 'BETWEEN',
  AND = 'AND',
  OR = 'OR',
  XOR = 'XOR',
  OPERATOR = 'OPERATOR',
  COMMA = 'COMMA',
  OPEN_PAREN = 'OPEN_PAREN',
  CLOSE_PAREN = 'CLOSE_PAREN',
  LINE_COMMENT = 'LINE_COMMENT',
  BLOCK_COMMENT = 'BLOCK_COMMENT',
  NUMBER = 'NUMBER',
  NAMED_PARAMETER = 'NAMED_PARAMETER',
  QUOTED_PARAMETER = 'QUOTED_PARAMETER',
  NUMBERED_PARAMETER = 'NUMBERED_PARAMETER',
  POSITIONAL_PARAMETER = 'POSITIONAL_PARAMETER',
  DELIMITER = 'DELIMITER',
  EOF = 'EOF',
}

/** Struct to store the most basic cohesive unit of language grammar */
export interface Token {
  type: TokenType;
  raw: string; // The raw original text that was matched
  text: string; // Cleaned up text e.g. keyword converted to uppercase and extra spaces removed
  key?: string;
  start: number; // 0-based index of the token in the whole query string
  end: number; // 0-based index of where the token ends in the query string
  precedingWhitespace?: string; // Whitespace before this token, if any
}

/**
 * For use as a "missing token"
 * e.g. in lookAhead and lookBehind to avoid dealing with null values
 */
export const EOF_TOKEN: Token = {
  type: TokenType.EOF,
  raw: '«EOF»',
  text: '«EOF»',
  start: Infinity,
  end: Infinity,
};

/** Checks if two tokens are equivalent */
export const testToken =
  (compareToken: { type: TokenType; text: string }) =>
  (token: Token): boolean =>
    token.type === compareToken.type && token.text === compareToken.text;

/** Util object that allows for easy checking of Reserved Keywords */
export const isToken = {
  ARRAY: testToken({ text: 'ARRAY', type: TokenType.RESERVED_KEYWORD }),
  BY: testToken({ text: 'BY', type: TokenType.RESERVED_KEYWORD }),
  SET: testToken({ text: 'SET', type: TokenType.RESERVED_COMMAND }),
  STRUCT: testToken({ text: 'STRUCT', type: TokenType.RESERVED_KEYWORD }),
  WINDOW: testToken({ text: 'WINDOW', type: TokenType.RESERVED_COMMAND }),
};

/** Checks if token is any Reserved Keyword or Command */
export const isReserved = (token: Token): boolean =>
  token.type === TokenType.RESERVED_KEYWORD ||
  token.type === TokenType.RESERVED_FUNCTION_NAME ||
  token.type === TokenType.RESERVED_PHRASE ||
  token.type === TokenType.RESERVED_DEPENDENT_CLAUSE ||
  token.type === TokenType.RESERVED_COMMAND ||
  token.type === TokenType.RESERVED_SELECT ||
  token.type === TokenType.RESERVED_SET_OPERATION ||
  token.type === TokenType.RESERVED_JOIN ||
  token.type === TokenType.CASE ||
  token.type === TokenType.END ||
  token.type === TokenType.LIMIT ||
  token.type === TokenType.BETWEEN ||
  token.type === TokenType.AND ||
  token.type === TokenType.OR ||
  token.type === TokenType.XOR;

/** checks if token is one of the parameter tokens */
export const isParameter = (token: Token): boolean =>
  token.type === TokenType.NUMBERED_PARAMETER ||
  token.type === TokenType.NAMED_PARAMETER ||
  token.type === TokenType.POSITIONAL_PARAMETER ||
  token.type === TokenType.QUOTED_PARAMETER;

export const isLogicalOperator = (token: Token): boolean =>
  token.type === TokenType.AND || token.type === TokenType.OR || token.type === TokenType.XOR;
