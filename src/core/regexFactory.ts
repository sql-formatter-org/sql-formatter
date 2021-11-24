import { escapeRegExp, isEmpty, sortByLengthDesc } from '../utils';

export function createOperatorRegex(monadOperators: string, polyadOperators: string[]) {
	return new RegExp(
		`^(${sortByLengthDesc(polyadOperators).map(escapeRegExp).join('|')}|` +
			`[${monadOperators.split('').map(escapeRegExp).join('')}])`,
		'u'
	);
}

export function createLineCommentRegex(lineCommentTypes: string[]) {
	return new RegExp(
		`^((?:${lineCommentTypes.map(c => escapeRegExp(c)).join('|')}).*?)(?:\r\n|\r|\n|$)`,
		'u'
	);
}

export function createReservedWordRegex(reservedKeywords: string[], specialWordChars = '') {
	if (reservedKeywords.length === 0) {
		return new RegExp(`^\b$`, 'u');
	}
	const reservedKeywordsPattern = sortByLengthDesc(reservedKeywords)
		.join('|')
		.replace(/ /gu, '\\s+');
	return new RegExp(
		`^(${reservedKeywordsPattern})(?![${escapeRegExp(specialWordChars)}]+)\\b`,
		'iu'
	);
}

export function createWordRegex(
	specialChars: { any?: string; suffix?: string; prefix?: string } = {}
) {
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
}

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
	'``': '((`[^`]*($|`))+)',
	'{}': '((\\{[^\\}]*($|\\}))+)',
	'[]': '((\\[[^\\]]*($|\\]))(\\][^\\]]*($|\\]))*)',
	'""': '(("[^"\\\\]*(?:\\\\.[^"\\\\]*)*("|$))+)',
	"''": "(('[^'\\\\]*(?:\\\\.[^'\\\\]*)*('|$))+)",
	"N''": "((N'[^'\\\\]*(?:\\\\.[^'\\\\]*)*('|$))+)",
	"x''": "((x'[^'\\\\]*(?:\\\\.[^'\\\\]*)*('|$))+)",
	"U&''": "((U&'[^'\\\\]*(?:\\\\.[^'\\\\]*)*('|$))+)",
	'U&""': '((U&"[^"\\\\]*(?:\\\\.[^"\\\\]*)*("|$))+)',
	'$$': '((?<tag>\\$\\w*\\$)[\\s\\S]*?(?:\\k<tag>|$))',
};
export type StringPatternType = keyof typeof patterns;
export function createStringPattern(stringTypes: StringPatternType[]) {
	return stringTypes.map(t => patterns[t]).join('|');
}

export function createStringRegex(stringTypes: StringPatternType[]) {
	return new RegExp('^(' + createStringPattern(stringTypes) + ')', 'u');
}

function escapeParen(paren: string) {
	if (paren.length === 1) {
		// A single punctuation character
		return escapeRegExp(paren);
	} else {
		// longer word
		return '\\b' + paren + '\\b';
	}
}

export function createParenRegex(parens: string[]) {
	return new RegExp('^(' + parens.map(escapeParen).join('|') + ')', 'iu');
}

export function createPlaceholderRegex(types: string[], pattern: string) {
	if (isEmpty(types)) {
		return undefined;
	}
	const typesRegex = types.map(escapeRegExp).join('|');

	return new RegExp(`^((?:${typesRegex})(?:${pattern}))`, 'u');
}
