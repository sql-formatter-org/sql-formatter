// Only removes spaces, not newlines
export const trimSpacesEnd = (str) => str.replace(/[ \t]+$/u, '');

// Last element from array
export const last = (arr) => arr[arr.length - 1];

// True array is empty, or it's not an array at all
export const isEmpty = (arr) => !Array.isArray(arr) || arr.length === 0;

// Escapes regex special chars
export const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
