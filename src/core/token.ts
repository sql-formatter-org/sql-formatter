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

const isToken = (type: TokenType, regex: RegExp) => (token: Token) =>
	token?.type === type && regex.test(token?.value);

export const isAs = isToken(
	TokenType.RESERVED_KEYWORD,
	new RegExp(`^${spaces}*AS${spaces}*$`, 'iu')
);
export const isAnd = isToken(
	TokenType.RESERVED_LOGICAL_OPERATOR,
	new RegExp(`^${spaces}*AND${spaces}*$`, 'iu')
);
export const isBetween = isToken(
	TokenType.RESERVED_KEYWORD,
	new RegExp(`^${spaces}*BETWEEN${spaces}*$`, 'iu')
);
export const isCase = isToken(
	TokenType.BLOCK_START,
	new RegExp(`^${spaces}*CASE${spaces}*$`, 'iu')
);
export const isBy = isToken(
	TokenType.RESERVED_KEYWORD,
	new RegExp(`^${spaces}*BY${spaces}*$`, 'iu')
);
export const isEnd = isToken(TokenType.BLOCK_END, new RegExp(`^${spaces}*END${spaces}*$`, 'iu'));
export const isFrom = isToken(
	TokenType.RESERVED_COMMAND,
	new RegExp(`^${spaces}*FROM${spaces}*$`, 'iu')
);
export const isLateral = isToken(
	TokenType.RESERVED_DEPENDENT_CLAUSE,
	new RegExp(`^${spaces}*LATERAL${spaces}*$`, 'iu')
);
export const isLimit = isToken(
	TokenType.RESERVED_COMMAND,
	new RegExp(`^${spaces}*LIMIT${spaces}*$`, 'iu')
);
export const isSelect = isToken(
	TokenType.RESERVED_COMMAND,
	new RegExp(`^${spaces}*SELECT${spaces}*$`, 'iu')
);
export const isSet = isToken(
	TokenType.RESERVED_COMMAND,
	new RegExp(`^${spaces}*SET${spaces}*$`, 'iu')
);
export const isWindow = isToken(
	TokenType.RESERVED_COMMAND,
	new RegExp(`^${spaces}*WINDOW${spaces}*$`, 'iu')
);

export const isTopLevel = (token: Token) =>
	token &&
	(token.type === TokenType.RESERVED_COMMAND || token.type === TokenType.RESERVED_BINARY_COMMAND);

export const isReserved = (token: Token) =>
	token &&
	(token.type === TokenType.RESERVED_KEYWORD ||
		token.type === TokenType.RESERVED_LOGICAL_OPERATOR ||
		token.type === TokenType.RESERVED_DEPENDENT_CLAUSE ||
		token.type === TokenType.RESERVED_COMMAND ||
		token.type === TokenType.RESERVED_BINARY_COMMAND);
