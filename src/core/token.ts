export enum TokenType {
	WORD = 'WORD',
	STRING = 'STRING',
	RESERVED_KEYWORD = 'RESERVED_KEYWORD',
	RESERVED_LOGICAL_OPERATOR = 'RESERVED_LOGICAL_OPERATOR',
	RESERVED_DEPENDENT_CLAUSE = 'RESERVED_DEPENDENT_CLAUSE',
	RESERVED_BINARY_COMMAND = 'RESERVED_BINARY_COMMAND',
	RESERVED_COMMAND = 'RESERVED_COMMAND',
	OPERATOR = 'OPERATOR',
	BLOCK_START = 'BLOCK_START',
	BLOCK_END = 'BLOCK_END',
	LINE_COMMENT = 'LINE_COMMENT',
	BLOCK_COMMENT = 'BLOCK_COMMENT',
	NUMBER = 'NUMBER',
	PLACEHOLDER = 'PLACEHOLDER',
}

export interface Token {
	value: string;
	type: TokenType;
	key?: string;
	whitespaceBefore?: string;
}

export const ZWS = '​'; // uses zero-width space (&#8203; / U+200B)
const ZWS_REGEX = '\u200b';
const spaces = `[${ZWS_REGEX}\\s]`;

export const testToken = (compareToken: Token) => (token: Token) =>
	token?.type === compareToken.type &&
	new RegExp(`^${spaces}*${compareToken.value}${spaces}*$`, 'iu').test(token?.value);

export const isToken = {
	AS: testToken({ value: 'AS', type: TokenType.RESERVED_KEYWORD }),
	AND: testToken({ value: 'AND', type: TokenType.RESERVED_LOGICAL_OPERATOR }),
	BETWEEN: testToken({ value: 'BETWEEN', type: TokenType.RESERVED_KEYWORD }),
	CASE: testToken({ value: 'CASE', type: TokenType.BLOCK_START }),
	BY: testToken({ value: 'BY', type: TokenType.RESERVED_KEYWORD }),
	END: testToken({ value: 'END', type: TokenType.BLOCK_END }),
	FROM: testToken({ value: 'FROM', type: TokenType.RESERVED_COMMAND }),
	LATERAL: testToken({ value: 'LATERAL', type: TokenType.RESERVED_DEPENDENT_CLAUSE }),
	LIMIT: testToken({ value: 'LIMIT', type: TokenType.RESERVED_COMMAND }),
	SELECT: testToken({ value: 'SELECT', type: TokenType.RESERVED_COMMAND }),
	SET: testToken({ value: 'SET', type: TokenType.RESERVED_COMMAND }),
	TABLE: testToken({ value: 'TABLE', type: TokenType.RESERVED_KEYWORD }),
	WINDOW: testToken({ value: 'WINDOW', type: TokenType.RESERVED_COMMAND }),
	WITH: testToken({ value: 'WITH', type: TokenType.RESERVED_COMMAND }),
};

export const isCommand = (token: Token) =>
	token &&
	(token.type === TokenType.RESERVED_COMMAND || token.type === TokenType.RESERVED_BINARY_COMMAND);

export const isReserved = (token: Token) =>
	token &&
	(token.type === TokenType.RESERVED_KEYWORD ||
		token.type === TokenType.RESERVED_LOGICAL_OPERATOR ||
		token.type === TokenType.RESERVED_DEPENDENT_CLAUSE ||
		token.type === TokenType.RESERVED_COMMAND ||
		token.type === TokenType.RESERVED_BINARY_COMMAND);
