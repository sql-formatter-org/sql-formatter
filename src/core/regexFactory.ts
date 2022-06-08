import { escapeRegExp, isEmpty, sortByLengthDesc } from 'src/utils';

/**
 * Builds a RegExp containing all operators for a SQL dialect
 * @param {string} monadOperators - concatenated string of all 1-length operators
 * @param {string[]} polyadOperators - list of strings of all >1-length operators
 */
export const createOperatorRegex = (monadOperators: string, polyadOperators: string[]): RegExp =>
  new RegExp(
    `^(${sortByLengthDesc(polyadOperators).map(escapeRegExp).join('|')}|` +
      `[${monadOperators.split('').map(escapeRegExp).join('')}])`,
    'u'
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
  specialChars: IdentChars = {}
): RegExp => {
  if (reservedKeywords.length === 0) {
    return /^\b$/u;
  }

  // Negative lookahead to avoid matching a keyword that's actually part of identifier,
  // which can happen when identifier allows word-boundary characters inside it.
  //
  // For example "SELECT$ME" should be tokenized as:
  // - ["SELECT$ME"] when $ is allowed inside identifiers
  // - ["SELECT", "$", "ME"] when $ can't be part of identifiers.
  const avoidIdentChars = specialChars.any ? `(?![${escapeRegExp(specialChars.any)}])` : '';

  const reservedKeywordsPattern = sortByLengthDesc(reservedKeywords)
    .join('|')
    .replace(/ /gu, '\\s+');

  return new RegExp(`^(${reservedKeywordsPattern})${avoidIdentChars}\\b`, 'iu');
};

export interface IdentChars {
  // concatenated string of chars that can appear anywhere in a valid identifier
  any?: string;
  // concatenated string of chars that only appear at the beginning of a valid identifier
  prefix?: string;
}

/**
 * Builds a RegExp for valid identifiers in a SQL dialect
 */
export const createIdentRegex = (specialChars: IdentChars = {}): RegExp =>
  new RegExp(`^(${createIdentPattern(specialChars)})`, 'u');

/**
 * Builds a RegExp string for valid identifiers in a SQL dialect
 */
export const createIdentPattern = (specialChars: IdentChars = {}): string => {
  const prefix = specialChars.prefix ? `[${escapeRegExp(specialChars.prefix)}]*` : '';
  // Unicode letters, diacritical marks and underscore
  const letter = '\\p{Alphabetic}\\p{Mark}_';
  // Numbers 0..9, plus various unicode numbers
  const number = '\\p{Decimal_Number}';
  const specialWordChars = escapeRegExp(specialChars.any ?? '');

  const arrayAccessor = '\\[\\d\\]';
  const mapAccessor = `\\[['"][${letter}${number}]+['"]\\]`;

  return `(${prefix}([${letter}${number}${specialWordChars}]+))(${arrayAccessor}|${mapAccessor})?`;
};

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
    return '(' + quotePatterns[type] + ')';
  } else {
    return '(' + prefixesPattern(type) + quotePatterns[type.quote] + ')';
  }
};

/** Builds a quote-delimited pattern for matching all given quote types */
export const createQuotePattern = (quoteTypes: QuoteType[]): string =>
  quoteTypes.map(createSingleQuotePattern).join('|');

const createSingleVariablePattern = (type: VariableType): string => {
  if ('regex' in type) {
    return '(' + type.regex + ')';
  } else {
    return createSingleQuotePattern(type);
  }
};

const patternToRegex = (pattern: string): RegExp => new RegExp('^(' + pattern + ')', 'u');

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
  new RegExp('^(' + parens.map(escapeParen).join('|') + ')', 'iu');

/**
 * Builds a RegExp for placeholder patterns
 * @param {string[]} types - list of strings that denote placeholder types
 * @param {string} pattern - string that denotes placeholder pattern
 */
export const createPlaceholderRegex = (types: string[], pattern: string): RegExp | undefined => {
  if (isEmpty(types)) {
    return undefined;
  }
  const typesRegex = types.map(escapeRegExp).join('|');

  return new RegExp(`^((?:${typesRegex})(?:${pattern}))`, 'u');
};
