import type { PrefixedQuoteType } from './regexTypes';

// Escapes regex special chars
export const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');

export const WHITESPACE_REGEX = /\s+/uy;
export const LINEBREAK_REGEX = /\v|\n|\r\n/g;

export const patternToRegex = (pattern: string): RegExp => new RegExp(`(?:${pattern})`, 'uy');

// Converts "ab" to "[Aa][Bb]"
export const toCaseInsensitivePattern = (prefix: string): string =>
  prefix
    .split('')
    .map(char => (/ /gu.test(char) ? '\\s+' : `[${char.toUpperCase()}${char.toLowerCase()}]`))
    .join('');

/** Escapes paren characters for RegExp patterns */
export const escapeParen = (paren: string): string => {
  if (paren.length === 1) {
    // A single punctuation character
    return escapeRegExp(paren);
  } else {
    // longer word
    return '\\b' + escapeRegExp(paren) + '\\b';
  }
};

export const withDashes = (pattern: string): string => pattern + '(?:-' + pattern + ')*';

// Converts ["a", "b"] to "(?:[Aa]|[Bb]|)" or "(?:[Aa]|[Bb])" when required = true
export const prefixesPattern = ({ prefixes, requirePrefix }: PrefixedQuoteType): string =>
  `(?:${prefixes.map(toCaseInsensitivePattern).join('|')}${requirePrefix ? '' : '|'})`;
