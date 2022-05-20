export const dedupe = (arr: string[]) => [...new Set(arr)];

// Last element from array
export const last = <T extends any>(arr: T[]) => arr[arr.length - 1];

// True array is empty, or it's not an array at all
export const isEmpty = (arr: any[]) => !Array.isArray(arr) || arr.length === 0;

// Escapes regex special chars
export const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');

// Sorts strings by length, so that longer ones are first
// Also sorts alphabetically after sorting by length.
export const sortByLengthDesc = (strings: string[]) =>
  strings.sort((a, b) => b.length - a.length || a.localeCompare(b));

/** Get length of longest string in list of strings */
export const maxLength = (strings: string[]) =>
  strings.reduce((max, cur) => Math.max(max, cur.length), 0);

export const isNumber = (value: any): value is number => typeof value === 'number';

// replaces long whitespace sequences with just one space
export const equalizeWhitespace = (s: string) => s.replace(/\s+/gu, ' ');

// identity function
export const id = <T>(x: T) => x;
