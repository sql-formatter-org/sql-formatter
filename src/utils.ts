// Only removes spaces, not newlines
export const trimSpacesEnd = (str: string) => str.replace(/[ \t]+$/u, '');

// Last element from array
export const last = <T extends any>(arr: T[]) => arr[arr.length - 1];

// True array is empty, or it's not an array at all
export const isEmpty = (arr: any[]) => !Array.isArray(arr) || arr.length === 0;

// Escapes regex special chars
export const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');

// Sorts strings by length, so that longer ones are first
// Also sorts alphabetically after sorting by length.
export const sortByLengthDesc = (strings: string[]) =>
	strings.sort((a, b) => {
		return b.length - a.length || a.localeCompare(b);
	});
