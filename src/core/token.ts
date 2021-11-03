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

const testTokens = {
	AS: TokenType.RESERVED_KEYWORD,
	AND: TokenType.RESERVED_LOGICAL_OPERATOR,
	BETWEEN: TokenType.RESERVED_KEYWORD,
	CASE: TokenType.BLOCK_START,
	BY: TokenType.RESERVED_KEYWORD,
	END: TokenType.BLOCK_END,
	FROM: TokenType.RESERVED_COMMAND,
	LATERAL: TokenType.RESERVED_DEPENDENT_CLAUSE,
	LIMIT: TokenType.RESERVED_COMMAND,
	SELECT: TokenType.RESERVED_COMMAND,
	SET: TokenType.RESERVED_COMMAND,
	WINDOW: TokenType.RESERVED_COMMAND,
};

export const isToken = (testToken: keyof typeof testTokens) => (token: Token) =>
	token?.type === testTokens[testToken] &&
	new RegExp(`^${spaces}*${testToken}${spaces}*$`, 'iu').test(token?.value);

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
