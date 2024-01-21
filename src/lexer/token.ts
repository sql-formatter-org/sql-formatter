/** Token type enum for all possible Token categories */
export enum TokenType {
  QUOTED_IDENTIFIER = 'QUOTED_IDENTIFIER',
  IDENTIFIER = 'IDENTIFIER',
  STRING = 'STRING',
  VARIABLE = 'VARIABLE',
  RESERVED_DATA_TYPE = 'RESERVED_DATA_TYPE',
  RESERVED_PARAMETERIZED_DATA_TYPE = 'RESERVED_PARAMETERIZED_DATA_TYPE',
  RESERVED_KEYWORD = 'RESERVED_KEYWORD',
  RESERVED_FUNCTION_NAME = 'RESERVED_FUNCTION_NAME',
  RESERVED_PHRASE = 'RESERVED_PHRASE',
  RESERVED_SET_OPERATION = 'RESERVED_SET_OPERATION',
  RESERVED_CLAUSE = 'RESERVED_CLAUSE',
  RESERVED_SELECT = 'RESERVED_SELECT',
  RESERVED_JOIN = 'RESERVED_JOIN',
  ARRAY_IDENTIFIER = 'ARRAY_IDENTIFIER', // IDENTIFIER token in front of [
  ARRAY_KEYWORD = 'ARRAY_KEYWORD', // RESERVED_DATA_TYPE token in front of [
  CASE = 'CASE',
  END = 'END',
  WHEN = 'WHEN',
  ELSE = 'ELSE',
  THEN = 'THEN',
  LIMIT = 'LIMIT',
  BETWEEN = 'BETWEEN',
  AND = 'AND',
  OR = 'OR',
  XOR = 'XOR',
  OPERATOR = 'OPERATOR',
  COMMA = 'COMMA',
  ASTERISK = 'ASTERISK', // *
  DOT = 'DOT', // . (or .. in Transact-SQL)
  OPEN_PAREN = 'OPEN_PAREN',
  CLOSE_PAREN = 'CLOSE_PAREN',
  LINE_COMMENT = 'LINE_COMMENT',
  BLOCK_COMMENT = 'BLOCK_COMMENT',
  NUMBER = 'NUMBER',
  NAMED_PARAMETER = 'NAMED_PARAMETER',
  QUOTED_PARAMETER = 'QUOTED_PARAMETER',
  NUMBERED_PARAMETER = 'NUMBERED_PARAMETER',
  POSITIONAL_PARAMETER = 'POSITIONAL_PARAMETER',
  CUSTOM_PARAMETER = 'CUSTOM_PARAMETER',
  DELIMITER = 'DELIMITER',
  EOF = 'EOF',
}

/** Struct to store the most basic cohesive unit of language grammar */
export interface Token {
  type: TokenType;
  raw: string; // The raw original text that was matched
  text: string; // Cleaned up text e.g. keyword converted to uppercase and extra spaces removed
  key?: string;
  start: number;
  precedingWhitespace?: string; // Whitespace before this token, if any
}

/** Creates EOF token positioned at given location */
export const createEofToken = (index: number) => ({
  type: TokenType.EOF,
  raw: '«EOF»',
  text: '«EOF»',
  start: index,
});

/**
 * For use as a "missing token"
 * e.g. in lookAhead and lookBehind to avoid dealing with null values
 */
export const EOF_TOKEN = createEofToken(Infinity);

/** Checks if two tokens are equivalent */
export const testToken =
  (compareToken: { type: TokenType; text: string }) =>
  (token: Token): boolean =>
    token.type === compareToken.type && token.text === compareToken.text;

/** Util object that allows for easy checking of Reserved Keywords */
export const isToken = {
  ARRAY: testToken({ text: 'ARRAY', type: TokenType.RESERVED_DATA_TYPE }),
  BY: testToken({ text: 'BY', type: TokenType.RESERVED_KEYWORD }),
  SET: testToken({ text: 'SET', type: TokenType.RESERVED_CLAUSE }),
  STRUCT: testToken({ text: 'STRUCT', type: TokenType.RESERVED_DATA_TYPE }),
  WINDOW: testToken({ text: 'WINDOW', type: TokenType.RESERVED_CLAUSE }),
  VALUES: testToken({ text: 'VALUES', type: TokenType.RESERVED_CLAUSE }),
};

/** Checks if token is any Reserved Keyword or Clause */
export const isReserved = (type: TokenType): boolean =>
  type === TokenType.RESERVED_DATA_TYPE ||
  type === TokenType.RESERVED_KEYWORD ||
  type === TokenType.RESERVED_FUNCTION_NAME ||
  type === TokenType.RESERVED_PHRASE ||
  type === TokenType.RESERVED_CLAUSE ||
  type === TokenType.RESERVED_SELECT ||
  type === TokenType.RESERVED_SET_OPERATION ||
  type === TokenType.RESERVED_JOIN ||
  type === TokenType.ARRAY_KEYWORD ||
  type === TokenType.CASE ||
  type === TokenType.END ||
  type === TokenType.WHEN ||
  type === TokenType.ELSE ||
  type === TokenType.THEN ||
  type === TokenType.LIMIT ||
  type === TokenType.BETWEEN ||
  type === TokenType.AND ||
  type === TokenType.OR ||
  type === TokenType.XOR;

export const isLogicalOperator = (type: TokenType): boolean =>
  type === TokenType.AND || type === TokenType.OR || type === TokenType.XOR;
