import tokenTypes from './tokenTypes';

const isToken = (type, regex) => (token) => token?.type === type && regex.test(token?.value);

export const isAnd = isToken(tokenTypes.RESERVED_NEWLINE, /^AND$/iu);

export const isBetween = isToken(tokenTypes.RESERVED, /^BETWEEN$/iu);

export const isLimit = isToken(tokenTypes.RESERVED_TOP_LEVEL, /^LIMIT$/iu);

export const isSet = isToken(tokenTypes.RESERVED_TOP_LEVEL, /^SET$/iu);

export const isBy = isToken(tokenTypes.RESERVED, /^BY$/iu);

export const isWindow = isToken(tokenTypes.RESERVED_TOP_LEVEL, /^WINDOW$/iu);

export const isEnd = isToken(tokenTypes.CLOSE_PAREN, /^END$/iu);
