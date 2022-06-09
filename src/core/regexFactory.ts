import { escapeRegExp, isEmpty, sortByLengthDesc } from 'src/utils';

// This enables the following quote styles:
// 1. backtick quoted using `` to escape
// 2. square bracket quoted (SQL Server) using ]] to escape
// 3. double quoted using "" or \" to escape
// 4. single quoted using '' or \' to escape
// 5. PostgreSQL dollar-quoted
// 6. BigQuery '''triple-quoted'''
// 7. BigQuery """triple-quoted"""
// 8. Hive and Spark variables: ${name}
const quotePatterns = {
  '``': '(`[^`]*($|`))+',
  '[]': '(\\[[^\\]]*($|\\]))(\\][^\\]]*($|\\]))*',
  '""': '("[^"\\\\]*(?:\\\\.[^"\\\\]*)*("|$))+',
  "''": "('[^'\\\\]*(?:\\\\.[^'\\\\]*)*('|$))+",
  '$$': '(?<tag>\\$\\w*\\$)[\\s\\S]*?(?:\\k<tag>|$)',
  "'''..'''": "'''[^\\\\]*?(?:\\\\.[^\\\\]*?)*?('''|$)",
  '""".."""': '"""[^\\\\]*?(?:\\\\.[^\\\\]*?)*?("""|$)',
  '{}': '(\\{[^\\}]*($|\\}))',
};
export type PlainQuoteType = keyof typeof quotePatterns;

export type PrefixedQuoteType = {
  quote: PlainQuoteType;
  prefixes: string[];
  required?: boolean; // True when prefix is required
};

export type QuoteType = PlainQuoteType | PrefixedQuoteType;

export interface VariableRegex {
  regex: string;
}

export type VariableType = VariableRegex | PrefixedQuoteType;

export interface IdentChars {
  // Additional characters that can be used as first character of an identifier.
  // That is: in addition to letters and underscore.
  first?: string;
  // Additional characters that can appear after the first character of identifier.
  // That is: in addition to letters, numbers and underscore.
  rest?: string;
  // True to allow single dashes (-) inside identifiers, but not at the beginning or end
  dashes?: boolean;
}

/**
 * Builds a RegExp containing all operators for a SQL dialect
 * @param {string} monadOperators - concatenated string of all 1-length operators
 * @param {string[]} polyadOperators - list of strings of all >1-length operators
 */
export const createOperatorRegex = (monadOperators: string, polyadOperators: string[]): RegExp =>
  patternToRegex(
    `${sortByLengthDesc(polyadOperators).map(escapeRegExp).join('|')}|` +
      `[${monadOperators.split('').map(escapeRegExp).join('')}]`
  );

/**
 * Builds a RegExp for valid line comments in a SQL dialect
 * @param {string[]} lineCommentTypes - list of character strings that denote line comments
 */
export const createLineCommentRegex = (lineCommentTypes: string[]): RegExp =>
  new RegExp(
    `^((?:${lineCommentTypes.map(c => escapeRegExp(c)).join('|')}).*?)(?:\r\n|\r|\n|$)`,
    'u'
  );

/**
 * Builds a RegExp for all Reserved Keywords in a SQL dialect
 */
export const createReservedWordRegex = (
  reservedKeywords: string[],
  identChars: IdentChars = {}
): RegExp => {
  if (reservedKeywords.length === 0) {
    return /^\b$/u;
  }

  const avoidIdentChars = rejectIdentCharsPattern(identChars);

  const reservedKeywordsPattern = sortByLengthDesc(reservedKeywords)
    .join('|')
    .replace(/ /gu, '\\s+');

  return new RegExp(`^(${reservedKeywordsPattern})${avoidIdentChars}\\b`, 'iu');
};

// Negative lookahead to avoid matching a keyword that's actually part of identifier,
// which can happen when identifier allows word-boundary characters inside it.
//
// For example "SELECT$ME" should be tokenized as:
// - ["SELECT$ME"] when $ is allowed inside identifiers
// - ["SELECT", "$", "ME"] when $ can't be part of identifiers.
const rejectIdentCharsPattern = ({ rest, dashes }: IdentChars): string =>
  rest || dashes ? `(?![${rest || ''}${dashes ? '-' : ''}])` : '';

/**
 * Builds a RegExp for valid identifiers in a SQL dialect
 */
export const createIdentRegex = (specialChars: IdentChars = {}): RegExp =>
  patternToRegex(createIdentPattern(specialChars));

/**
 * Builds a RegExp string for valid identifiers in a SQL dialect
 */
export const createIdentPattern = ({ first, rest, dashes }: IdentChars = {}): string => {
  // Unicode letters, diacritical marks and underscore
  const letter = '\\p{Alphabetic}\\p{Mark}_';
  // Numbers 0..9, plus various unicode numbers
  const number = '\\p{Decimal_Number}';

  const firstChars = escapeRegExp(first ?? '');
  const restChars = escapeRegExp(rest ?? '');

  const pattern = `[${letter}${firstChars}][${letter}${number}${restChars}]*`;

  return dashes ? withDashes(pattern) : pattern;
};

const withDashes = (pattern: string): string => pattern + '(?:-' + pattern + ')*';

// Converts "ab" to "[Aa][Bb]"
const toCaseInsensitivePattern = (prefix: string): string =>
  prefix
    .split('')
    .map(char => '[' + char.toUpperCase() + char.toLowerCase() + ']')
    .join('');

// Converts ["a", "b"] to "(?:[Aa]|[Bb]|)" or "(?:[Aa]|[Bb])" when required = true
const prefixesPattern = ({ prefixes, required }: PrefixedQuoteType): string =>
  '(?:' + prefixes.map(toCaseInsensitivePattern).join('|') + (required ? '' : '|') + ')';

const createSingleQuotePattern = (type: QuoteType): string => {
  if (typeof type === 'string') {
    return quotePatterns[type];
  } else {
    return prefixesPattern(type) + quotePatterns[type.quote];
  }
};

/** Builds a quote-delimited pattern for matching all given quote types */
export const createQuotePattern = (quoteTypes: QuoteType[]): string =>
  quoteTypes.map(createSingleQuotePattern).join('|');

const createSingleVariablePattern = (type: VariableType): string => {
  if ('regex' in type) {
    return type.regex;
  } else {
    return createSingleQuotePattern(type);
  }
};

/** Builds a RegExp for matching variables */
export const createVariableRegex = (varTypes: VariableType[]): RegExp =>
  patternToRegex(varTypes.map(createSingleVariablePattern).join('|'));

/** Builds a RegExp for matching quote-delimited patterns */
export const createQuoteRegex = (quoteTypes: QuoteType[]): RegExp =>
  patternToRegex(createQuotePattern(quoteTypes));

/** Escapes paren characters for RegExp patterns */
const escapeParen = (paren: string): string => {
  if (paren.length === 1) {
    // A single punctuation character
    return escapeRegExp(paren);
  } else {
    // longer word
    return '\\b' + paren + '\\b';
  }
};

/**
 * Builds a RegExp for matching parenthesis patterns, escaping them with `escapeParen`
 * @param {string[]} parens - list of strings that denote parenthesis patterns
 */
export const createParenRegex = (parens: string[]): RegExp =>
  patternToRegex(parens.map(escapeParen).join('|'));

/**
 * Builds a RegExp for parameter placeholder patterns
 * @param {string[]} types - list of strings that denote placeholder types
 * @param {string} pattern - string that denotes placeholder pattern
 */
export const createParameterRegex = (types: string[], pattern: string): RegExp | undefined => {
  if (isEmpty(types)) {
    return undefined;
  }
  const typesRegex = types.map(escapeRegExp).join('|');

  return patternToRegex(`(?:${typesRegex})(?:${pattern})`);
};

const patternToRegex = (pattern: string): RegExp => new RegExp('^(' + pattern + ')', 'u');
