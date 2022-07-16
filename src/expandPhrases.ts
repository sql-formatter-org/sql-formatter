/**
 * Performs expandSinglePhrase() on array
 */
export const expandPhrases = (phrases: string[]): string[] => phrases.flatMap(expandSinglePhrase);

/**
 * Expands a syntax description like "CREATE [OR REPLACE] TABLE"
 * into an array of all possible combination like:
 * ["CREATE TABLE", "CREATE OR REPLACE TABLE"]
 */
export const expandSinglePhrase = (phrase: string): string[] =>
  buildCombinations(parsePhrase(phrase)).map(text => text.trim());

type PhrasePart = { type: 'required' | 'optional'; text: string };

const REQUIRED_PART = /[^[]*/y;
const OPTIONAL_PART = /\[.*?\]/y;

const parsePhrase = (text: string): PhrasePart[] => {
  let index = 0;
  const result: PhrasePart[] = [];
  while (index < text.length) {
    REQUIRED_PART.lastIndex = index;
    const requiredMatch = REQUIRED_PART.exec(text);
    if (requiredMatch) {
      result.push({ type: 'required', text: requiredMatch[0].trim() });
      index += requiredMatch[0].length;
    }

    OPTIONAL_PART.lastIndex = index;
    const optionalMatch = OPTIONAL_PART.exec(text);
    if (optionalMatch) {
      result.push({ type: 'optional', text: optionalMatch[0].slice(1, -1).trim() });
      index += optionalMatch[0].length;
    }
  }
  return result;
};

const buildCombinations = ([first, ...rest]: PhrasePart[]): string[] => {
  if (first === undefined) {
    return [''];
  }
  if (first.type === 'required') {
    return buildCombinations(rest).map(tail => first.text.trim() + ' ' + tail.trim());
  } else {
    return buildCombinations(rest).flatMap(tail => [tail, first.text.trim() + ' ' + tail.trim()]);
  }
};
