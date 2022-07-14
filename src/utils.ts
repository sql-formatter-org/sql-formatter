export const dedupe = (arr: string[]) => [...new Set(arr)];

// Last element from array
export const last = <T>(arr: T[]): T | undefined => arr[arr.length - 1];

// Sorts strings by length, so that longer ones are first
// Also sorts alphabetically after sorting by length.
export const sortByLengthDesc = (strings: string[]) =>
  strings.sort((a, b) => b.length - a.length || a.localeCompare(b));

/** Get length of longest string in list of strings */
export const maxLength = (strings: string[]) =>
  strings.reduce((max, cur) => Math.max(max, cur.length), 0);

// replaces long whitespace sequences with just one space
export const equalizeWhitespace = (s: string) => s.replace(/\s+/gu, ' ');

// Adds up all values in array
export const sum = (arr: number[]): number => {
  let total = 0;
  for (const x of arr) {
    total += x;
  }
  return total;
};

// Used for flattening keyword lists
export const flatKeywordList = (obj: Record<string, string[]>): string[] =>
  dedupe(Object.values(obj).flat());
