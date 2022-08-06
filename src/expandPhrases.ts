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
//   "{TEMP|TEMPORARY}" --> ["TEMP", "TEMPORARY"]
//
type PhrasePart = string[];

const REQUIRED_PART = /[^[\]{}]+/y;
const REQUIRED_BLOCK = /\{.*?\}/y;
const OPTIONAL_BLOCK = /\[.*?\]/y;

const parsePhrase = (text: string): PhrasePart[] => {
  let index = 0;
  const result: PhrasePart[] = [];
  while (index < text.length) {
    // Match everything else outside of "[...]" or "{...}" blocks
    REQUIRED_PART.lastIndex = index;
    const requiredMatch = REQUIRED_PART.exec(text);
    if (requiredMatch) {
      result.push([requiredMatch[0].trim()]);
      index += requiredMatch[0].length;
    }

    // Match "[...]" block
    OPTIONAL_BLOCK.lastIndex = index;
    const optionalBlockMatch = OPTIONAL_BLOCK.exec(text);
    if (optionalBlockMatch) {
      const choices = optionalBlockMatch[0]
        .slice(1, -1)
        .split('|')
        .map(s => s.trim());
      result.push(['', ...choices]);
      index += optionalBlockMatch[0].length;
    }

    // Match "{...}" block
    REQUIRED_BLOCK.lastIndex = index;
    const requiredBlockMatch = REQUIRED_BLOCK.exec(text);
    if (requiredBlockMatch) {
      const choices = requiredBlockMatch[0]
        .slice(1, -1)
        .split('|')
        .map(s => s.trim());
      result.push(choices);
      index += requiredBlockMatch[0].length;
    }

    if (!requiredMatch && !optionalBlockMatch && !requiredBlockMatch) {
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
