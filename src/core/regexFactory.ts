import { escapeRegExp, isEmpty, sortByLengthDesc } from '../utils';

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
 * @param {string[]} reservedKeywords - list of strings of all Reserved Keywords
 * @param {string} specialWordChars - concatenated string of all special chars that can appear in valid identifiers (and not in Reserved Keywords)
 */
export const createReservedWordRegex = (
  reservedKeywords: string[],
  specialWordChars: string = ''
): RegExp => {
  if (reservedKeywords.length === 0) {
    return /^\b$/u;
  }
  const reservedKeywordsPattern = sortByLengthDesc(reservedKeywords)
    .join('|')
    .replace(/ /gu, '\\s+');
  return new RegExp(
    `^(${reservedKeywordsPattern})(?![${escapeRegExp(specialWordChars)}]+)\\b`,
    'iu'
  );
};

/**
 * Builds a RegExp for valid identifiers in a SQL dialect
 * @param {Object} specialChars
 * @param {string} specialChars.any - concatenated string of chars that can appear anywhere in a valid identifier
 * @param {string} specialChars.prefix - concatenated string of chars that only appear at the beginning of a valid identifier
 * @param {string} specialChars.suffix - concatenated string of chars that only appear at the end of a valid identifier
 */
export const createWordRegex = (
  specialChars: { any?: string; prefix?: string; suffix?: string } = {}
): RegExp => {
  const prefixLookBehind = `[${escapeRegExp(specialChars.prefix ?? '')}]*`;
  const suffixLookAhead = `[${escapeRegExp(specialChars.suffix ?? '')}]*`;
  const unicodeWordChar =
    '\\p{Alphabetic}\\p{Mark}\\p{Decimal_Number}\\p{Connector_Punctuation}\\p{Join_Control}';
  const specialWordChars = `${escapeRegExp(specialChars.any ?? '')}`;

  const arrayAccessor = '\\[\\d\\]';
  const mapAccessor = `\\[['"][${unicodeWordChar}]+['"]\\]`;

  return new RegExp(
    `^((${prefixLookBehind}([${unicodeWordChar}${specialWordChars}]+)${suffixLookAhead})(${arrayAccessor}|${mapAccessor})?)`,
    'u'
  );
};

// This enables the following string patterns:
// 1. backtick quoted string using `` to escape
// 2. square bracket quoted string (SQL Server) using ]] to escape
// 3. double quoted string using "" or \" to escape
// 4. single quoted string using '' or \' to escape
// 5. national character quoted string using N'' or N\' to escape
// 6. Unicode single-quoted string using \' to escape
// 7. Unicode double-quoted string using \" to escape
// 8. PostgreSQL dollar-quoted strings
const patterns = {
  '``': '(`[^`]*($|`))+',
  '[]': '(\\[[^\\]]*($|\\]))(\\][^\\]]*($|\\]))*',
  '""': '("[^"\\\\]*(?:\\\\.[^"\\\\]*)*("|$))+',
  "''": "('[^'\\\\]*(?:\\\\.[^'\\\\]*)*('|$))+",
  "N''": "(N'[^'\\\\]*(?:\\\\.[^'\\\\]*)*('|$))+",
  "X''": "([xX]'[^'\\\\]*(?:\\\\.[^'\\\\]*)*('|$))+",
  "E''": "(E'[^'\\\\]*(?:\\\\.[^'\\\\]*)*('|$))+",
  "U&''": "(U&'[^'\\\\]*(?:\\\\.[^'\\\\]*)*('|$))+",
  'U&""': '(U&"[^"\\\\]*(?:\\\\.[^"\\\\]*)*("|$))+',
  '$$': '(?<tag>\\$\\w*\\$)[\\s\\S]*?(?:\\k<tag>|$)',
};
export type StringPatternType = keyof typeof patterns;

const createQuotePattern = (type: StringPatternType): string => '(' + patterns[type] + ')';

/**
 * Builds a string pattern for matching string patterns for all given string types
 * @param {StringPatternType[]} stringTypes - list of strings that denote string patterns
 */
export const createStringPattern = (stringTypes: StringPatternType[]): string =>
  stringTypes.map(createQuotePattern).join('|');

/**
 * Builds a RegExp for matching string patterns using `createStringPattern`
 * @param {StringPatternType[]} stringTypes - list of strings that denote string patterns
 */
export const createStringRegex = (stringTypes: StringPatternType[]): RegExp =>
  new RegExp('^(' + createStringPattern(stringTypes) + ')', 'u');

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
