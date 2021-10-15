import tokenTypes from './tokenTypes';

export type TokenType = typeof tokenTypes[keyof typeof tokenTypes];
export interface Token {
	value: string;
	type: TokenType;
	key?: string;
	whitespaceBefore?: string;
}

const isToken = (type: TokenType, regex: RegExp) => (token: Token) =>
	token?.type === type && regex.test(token?.value);

export const isAs = isToken(tokenTypes.RESERVED, /^AS$/iu);
export const isAnd = isToken(tokenTypes.RESERVED_NEWLINE, /^AND$/iu);
export const isBetween = isToken(tokenTypes.RESERVED, /^BETWEEN$/iu);
export const isBy = isToken(tokenTypes.RESERVED, /^BY$/iu);
export const isEnd = isToken(tokenTypes.CLOSE_PAREN, /^END$/iu);
export const isFrom = isToken(tokenTypes.RESERVED_TOP_LEVEL, /^FROM$/iu);
export const isLimit = isToken(tokenTypes.RESERVED_TOP_LEVEL, /^LIMIT$/iu);
export const isSelect = isToken(tokenTypes.RESERVED_TOP_LEVEL, /^SELECT$/iu);
export const isSet = isToken(tokenTypes.RESERVED_TOP_LEVEL, /^SET$/iu);
export const isWindow = isToken(tokenTypes.RESERVED_TOP_LEVEL, /^WINDOW$/iu);

export const isTopLevel = (token: Token) =>
	token &&
	(token.type === tokenTypes.RESERVED_TOP_LEVEL ||
		token.type === tokenTypes.RESERVED_TOP_LEVEL_NO_INDENT);

export const isReserved = (token: Token) =>
	token &&
	(token.type === tokenTypes.RESERVED ||
		token.type === tokenTypes.RESERVED_NEWLINE ||
		token.type === tokenTypes.RESERVED_TOP_LEVEL ||
		token.type === tokenTypes.RESERVED_TOP_LEVEL_NO_INDENT);
