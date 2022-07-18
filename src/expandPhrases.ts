/**
 * Performs expandSinglePhrase() on array
 */
export const expandPhrases = (phrases: string[]): string[] => phrases.flatMap(expandSinglePhrase);

/**
 * Expands a syntax description like
 *
 *     "CREATE [OR REPLACE] [TEMP|TEMPORARY] TABLE"
 *
 * into an array of all possible combinations like:
 *
 *     [ "CREATE TABLE",
 *       "CREATE TEMP TABLE",
 *       "CREATE TEMPORARY TABLE",
 *       "CREATE OR REPLACE TABLE",
 *       "CREATE OR REPLACE TEMP TABLE",
 *       "CREATE OR REPLACE TEMPORARY TABLE" ]
 */
export const expandSinglePhrase = (phrase: string): string[] =>
  buildCombinations(parsePhrase(phrase)).map(text => text.trim());

// This data type holds variants of a single part in whole phrase.
// Corresponding to syntax as follows:
//
//   "TABLE"            --> ["TABLE"]
//   "[TABLE]"          --> ["", "TABLE"]
//   "[TEMP|TEMPORARY]" --> ["", "TEMP", "TEMPORARY"]
//
type PhrasePart = string[];

const REQUIRED_PART = /[^[\]]+/y;
const OPTIONAL_PART = /\[.*?\]/y;

const parsePhrase = (text: string): PhrasePart[] => {
  let index = 0;
  const result: PhrasePart[] = [];
  while (index < text.length) {
    REQUIRED_PART.lastIndex = index;
    const requiredMatch = REQUIRED_PART.exec(text);
    if (requiredMatch) {
      result.push([requiredMatch[0].trim()]);
      index += requiredMatch[0].length;
    }

    OPTIONAL_PART.lastIndex = index;
    const optionalMatch = OPTIONAL_PART.exec(text);
    if (optionalMatch) {
      const choices = optionalMatch[0]
        .slice(1, -1)
        .split('|')
        .map(s => s.trim());
      result.push(['', ...choices]);
      index += optionalMatch[0].length;
    }

    if (!requiredMatch && !optionalMatch) {
      throw new Error(`Unbalanced parenthesis in: ${text}`);
    }
  }
  return result;
};

const buildCombinations = ([first, ...rest]: PhrasePart[]): string[] => {
  if (first === undefined) {
    return [''];
  }
  return buildCombinations(rest).flatMap(tail =>
    first.map(head => head.trim() + ' ' + tail.trim())
  );
};
