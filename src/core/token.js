const isTokenValue = (regex) => (token) => regex.test(token?.value);

export const isAnd = isTokenValue(/^AND$/iu);

export const isBetween = isTokenValue(/^BETWEEN$/iu);

export const isLimit = isTokenValue(/^LIMIT$/iu);

export const isSet = isTokenValue(/^SET$/iu);

export const isBy = isTokenValue(/^BY$/iu);

export const isWindow = isTokenValue(/^WINDOW$/iu);

export const isEnd = isTokenValue(/^END$/iu);
