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
  ARRAY_IDENTIFIER = 'ARRAY_IDENTIFIER', // IDENTIFIER token in front of [
  ARRAY_KEYWORD = 'ARRAY_KEYWORD', // RESERVED_KEYWORD token in front of [
  CASE = 'CASE',
  END = 'END',
  LIMIT = 'LIMIT',
  BETWEEN = 'BETWEEN',
  AND = 'AND',
  OR = 'OR',
  XOR = 'XOR',
  OPERATOR = 'OPERATOR',
  COMMA = 'COMMA',
  ASTERISK = 'ASTERISK', // *
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
export const isReserved = (type: TokenType): boolean =>
  type === TokenType.RESERVED_KEYWORD ||
  type === TokenType.RESERVED_FUNCTION_NAME ||
  type === TokenType.RESERVED_PHRASE ||
  type === TokenType.RESERVED_DEPENDENT_CLAUSE ||
  type === TokenType.RESERVED_COMMAND ||
  type === TokenType.RESERVED_SELECT ||
  type === TokenType.RESERVED_SET_OPERATION ||
  type === TokenType.RESERVED_JOIN ||
  type === TokenType.ARRAY_KEYWORD ||
  type === TokenType.CASE ||
  type === TokenType.END ||
  type === TokenType.LIMIT ||
  type === TokenType.BETWEEN ||
  type === TokenType.AND ||
  type === TokenType.OR ||
  type === TokenType.XOR;

export const isLogicalOperator = (token: { type: TokenType }): boolean =>
  token.type === TokenType.AND || token.type === TokenType.OR || token.type === TokenType.XOR;
