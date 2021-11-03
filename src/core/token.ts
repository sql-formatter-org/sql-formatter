import tokenTypes from './tokenTypes';

export type TokenType = typeof tokenTypes[keyof typeof tokenTypes];
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
	tokenTypes.RESERVED_KEYWORD,
	new RegExp(`^${spaces}*AS${spaces}*$`, 'iu')
);
export const isAnd = isToken(
	tokenTypes.RESERVED_LOGICAL_OPERATOR,
	new RegExp(`^${spaces}*AND${spaces}*$`, 'iu')
);
export const isBetween = isToken(
	tokenTypes.RESERVED_KEYWORD,
	new RegExp(`^${spaces}*BETWEEN${spaces}*$`, 'iu')
);
export const isCase = isToken(
	tokenTypes.BLOCK_START,
	new RegExp(`^${spaces}*CASE${spaces}*$`, 'iu')
);
export const isBy = isToken(
	tokenTypes.RESERVED_KEYWORD,
	new RegExp(`^${spaces}*BY${spaces}*$`, 'iu')
);
export const isEnd = isToken(tokenTypes.BLOCK_END, new RegExp(`^${spaces}*END${spaces}*$`, 'iu'));
export const isFrom = isToken(
	tokenTypes.RESERVED_COMMAND,
	new RegExp(`^${spaces}*FROM${spaces}*$`, 'iu')
);
export const isLateral = isToken(
	tokenTypes.RESERVED_DEPENDENT_CLAUSE,
	new RegExp(`^${spaces}*LATERAL${spaces}*$`, 'iu')
);
export const isLimit = isToken(
	tokenTypes.RESERVED_COMMAND,
	new RegExp(`^${spaces}*LIMIT${spaces}*$`, 'iu')
);
export const isSelect = isToken(
	tokenTypes.RESERVED_COMMAND,
	new RegExp(`^${spaces}*SELECT${spaces}*$`, 'iu')
);
export const isSet = isToken(
	tokenTypes.RESERVED_COMMAND,
	new RegExp(`^${spaces}*SET${spaces}*$`, 'iu')
);
export const isWindow = isToken(
	tokenTypes.RESERVED_COMMAND,
	new RegExp(`^${spaces}*WINDOW${spaces}*$`, 'iu')
);

export const isTopLevel = (token: Token) =>
	token &&
	(token.type === tokenTypes.RESERVED_COMMAND || token.type === tokenTypes.RESERVED_BINARY_COMMAND);

export const isReserved = (token: Token) =>
	token &&
	(token.type === tokenTypes.RESERVED_KEYWORD ||
		token.type === tokenTypes.RESERVED_LOGICAL_OPERATOR ||
		token.type === tokenTypes.RESERVED_DEPENDENT_CLAUSE ||
		token.type === tokenTypes.RESERVED_COMMAND ||
		token.type === tokenTypes.RESERVED_BINARY_COMMAND);
