import { PrefixedQuoteType } from './TokenizerOptions.js';

// Escapes regex special chars
export const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');

// \s covers ordinary Unicode whitespace (including NBSP and BOM), but not
// U+200B ZERO WIDTH SPACE, which word processors often insert around quotes.
export const WHITESPACE_REGEX = /[\s\u200B]+/uy;

export const patternToRegex = (pattern: string): RegExp => new RegExp(`(?:${pattern})`, 'uy');

// Converts "ab" to "[Aa][Bb]"
export const toCaseInsensitivePattern = (prefix: string): string =>
  prefix
    .split('')
    .map(char => (/ /gu.test(char) ? '\\s+' : `[${char.toUpperCase()}${char.toLowerCase()}]`))
    .join('');

export const withDashes = (pattern: string): string => pattern + '(?:-' + pattern + ')*';

// Converts ["a", "b"] to "(?:[Aa]|[Bb]|)" or "(?:[Aa]|[Bb])" when required = true
export const prefixesPattern = ({ prefixes, requirePrefix }: PrefixedQuoteType): string =>
  `(?:${prefixes.map(toCaseInsensitivePattern).join('|')}${requirePrefix ? '' : '|'})`;
