import { sortByLengthDesc } from 'src/utils.js';

import { IdentChars, QuoteType, VariableType } from './TokenizerOptions.js';
import { escapeRegExp, patternToRegex, prefixesPattern, withDashes } from './regexUtil.js';

/**
 * Builds a RegExp for valid line comments in a SQL dialect
 * @param {string[]} lineCommentTypes - list of character strings that denote line comments
 */
export const lineComment = (lineCommentTypes: string[]) =>
  new RegExp(`(?:${lineCommentTypes.map(escapeRegExp).join('|')}).*?(?=\r\n|\r|\n|$)`, 'uy');

/**
 * Builds a RegExp for matching either open- or close-parenthesis patterns
 */
export const parenthesis = (kind: 'open' | 'close', extraParens: ('[]' | '{}')[] = []): RegExp => {
  const index = kind === 'open' ? 0 : 1;
  const parens = ['()', ...extraParens].map(pair => pair[index]);
  return patternToRegex(parens.map(escapeRegExp).join('|'));
};

/**
 * Builds a RegExp containing all operators for a SQL dialect
 */
export const operator = (operators: string[]) =>
  patternToRegex(`${sortByLengthDesc(operators).map(escapeRegExp).join('|')}`);

// Negative lookahead to avoid matching a keyword that's actually part of identifier,
// which can happen when identifier allows word-boundary characters inside it.
//
// For example "SELECT$ME" should be tokenized as:
// - ["SELECT$ME"] when $ is allowed inside identifiers
// - ["SELECT", "$", "ME"] when $ can't be part of identifiers.
const rejectIdentCharsPattern = ({ rest, dashes }: IdentChars): string =>
  rest || dashes ? `(?![${rest || ''}${dashes ? '-' : ''}])` : '';

/**
 * Builds a RegExp for all Reserved Keywords in a SQL dialect
 */
export const reservedWord = (reservedKeywords: string[], identChars: IdentChars = {}): RegExp => {
  if (reservedKeywords.length === 0) {
    return /^\b$/u;
  }

  const avoidIdentChars = rejectIdentCharsPattern(identChars);

  const reservedKeywordsPattern = sortByLengthDesc(reservedKeywords)
    .map(escapeRegExp)
    .join('|')
    .replace(/ /gu, '\\s+');

  return new RegExp(`(?:${reservedKeywordsPattern})${avoidIdentChars}\\b`, 'iuy');
};

/**
 * Builds a RegExp for parameter placeholder patterns
 * @param {string[]} paramTypes - list of strings that denote placeholder types
 * @param {string} pattern - string that denotes placeholder pattern
 */
export const parameter = (paramTypes: string[], pattern: string): RegExp | undefined => {
  if (!paramTypes.length) {
    return undefined;
  }
  const typesRegex = paramTypes.map(escapeRegExp).join('|');

  return patternToRegex(`(?:${typesRegex})(?:${pattern})`);
};

const buildQStringPatterns = () => {
  const specialDelimiterMap = {
    '<': '>',
    '[': ']',
    '(': ')',
    '{': '}',
  };

  // base pattern for special delimiters, left must correspond with right
  const singlePattern = "{left}(?:(?!{right}').)*?{right}";

  // replace {left} and {right} with delimiters, collect as array
  const patternList = Object.entries(specialDelimiterMap).map(([left, right]) =>
    singlePattern.replace(/{left}/g, escapeRegExp(left)).replace(/{right}/g, escapeRegExp(right))
  );

  const specialDelimiters = escapeRegExp(Object.keys(specialDelimiterMap).join(''));
  // standard pattern for common delimiters, ignores special delimiters
  const standardDelimiterPattern = String.raw`(?<tag>[^\s${specialDelimiters}])(?:(?!\k<tag>').)*?\k<tag>`;

  // constructs final pattern by joining all cases
  const qStringPattern = `[Qq]'(?:${standardDelimiterPattern}|${patternList.join('|')})'`;

  return qStringPattern;
};

// Regex patterns for all supported quote styles.
//
// Most of them have a single escaping-style built in,
// but "" and '' support multiple versions of escapes,
// which must be selected with suffixes: -qq, -bs, -qq-bs, -raw
export const quotePatterns = {
  // - backtick quoted (using `` to escape)
  '``': '(?:`[^`]*`)+',
  // - Transact-SQL square bracket quoted (using ]] to escape)
  '[]': String.raw`(?:\[[^\]]*\])(?:\][^\]]*\])*`,
  // double-quoted
  '""-qq': String.raw`(?:"[^"]*")+`, // with repeated quote escapes
  '""-bs': String.raw`(?:"[^"\\]*(?:\\.[^"\\]*)*")`, // with backslash escapes
  '""-qq-bs': String.raw`(?:"[^"\\]*(?:\\.[^"\\]*)*")+`, // with repeated quote or backslash escapes
  '""-raw': String.raw`(?:"[^"]*")`, // no escaping
  // single-quoted
  "''-qq": String.raw`(?:'[^']*')+`, // with repeated quote escapes
  "''-bs": String.raw`(?:'[^'\\]*(?:\\.[^'\\]*)*')`, // with backslash escapes
  "''-qq-bs": String.raw`(?:'[^'\\]*(?:\\.[^'\\]*)*')+`, // with repeated quote or backslash escapes
  "''-raw": String.raw`(?:'[^']*')`, // no escaping
  // PostgreSQL dollar-quoted
  '$$': String.raw`(?<tag>\$\w*\$)[\s\S]*?\k<tag>`,
  // BigQuery '''triple-quoted''' (using \' to escape)
  "'''..'''": String.raw`'''[^\\]*?(?:\\.[^\\]*?)*?'''`,
  // BigQuery """triple-quoted""" (using \" to escape)
  '""".."""': String.raw`"""[^\\]*?(?:\\.[^\\]*?)*?"""`,
  // Hive and Spark variables: ${name}
  '{}': String.raw`(?:\{[^\}]*\})`,
  // Oracle q'' strings: q'<text>' q'|text|' ...
  "q''": buildQStringPatterns(),
};

const singleQuotePattern = (quoteTypes: QuoteType): string => {
  if (typeof quoteTypes === 'string') {
    return quotePatterns[quoteTypes];
  } else {
    return prefixesPattern(quoteTypes) + quotePatterns[quoteTypes.quote];
  }
};

/** Builds a RegExp for matching variables */
export const variable = (varTypes: VariableType[]): RegExp =>
  patternToRegex(
    varTypes
      .map(varType => ('regex' in varType ? varType.regex : singleQuotePattern(varType)))
      .join('|')
  );

/** Builds a quote-delimited pattern for matching all given quote types */
export const stringPattern = (quoteTypes: QuoteType[]): string =>
  quoteTypes.map(singleQuotePattern).join('|');

/** Builds a RegExp for matching quote-delimited patterns */
export const string = (quoteTypes: QuoteType[]): RegExp =>
  patternToRegex(stringPattern(quoteTypes));

/**
 * Builds a RegExp for valid identifiers in a SQL dialect
 */
export const identifier = (specialChars: IdentChars = {}): RegExp =>
  patternToRegex(identifierPattern(specialChars));

/**
 * Builds a RegExp string for valid identifiers in a SQL dialect
 */
export const identifierPattern = ({
  first,
  rest,
  dashes,
  allowFirstCharNumber,
}: IdentChars = {}): string => {
  // Unicode letters, diacritical marks and underscore
  const letter = '\\p{Alphabetic}\\p{Mark}_';
  // Numbers 0..9, plus various unicode numbers
  const number = '\\p{Decimal_Number}';

  const firstChars = escapeRegExp(first ?? '');
  const restChars = escapeRegExp(rest ?? '');

  const pattern = allowFirstCharNumber
    ? `[${letter}${number}${firstChars}][${letter}${number}${restChars}]*`
    : `[${letter}${firstChars}][${letter}${number}${restChars}]*`;

  return dashes ? withDashes(pattern) : pattern;
};
