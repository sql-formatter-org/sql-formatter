import { escapeRegExp, sortByLengthDesc } from '../utils';

export const lineCommentRegex = (lineCommentTypes: string[]) =>
	new RegExp(`^(?:${lineCommentTypes.map(escapeRegExp).join('|')}.*?)(?:\r\n|\r|\n|$)`, 'u');

export const operatorRegex = (monadOperators: string, polyadOperators: string[]) =>
	new RegExp(
		`^${sortByLengthDesc(polyadOperators).map(escapeRegExp).join('|')}|` +
			`[${monadOperators.split('').map(escapeRegExp).join('')}]`,
		'u'
	);

// This enables the following string patterns:
// 1. backtick quoted string using `` to escape
// 2. square bracket quoted string (SQL Server) using ]] to escape
// 3. double quoted string using "" or \" to escape, with optional prefix for format-specific strings
// 4. single quoted string using '' or \' to escape, with optional prefix for format-specific strings
// 8. PostgreSQL dollar-quoted strings (does not check for matching tags due to moo not allowing capturing groups)

const stringPrefixList = ['[Nn]', '_utf8', 'U&', 'x'];
const createStringPattern = (stringPrefixes: string) => ({
	'``': '(?:`[^`]*(?:$|`))+',
	'{}': '(?:\\{[^\\}]*(?:$|\\}))+',
	'[]': '(?:\\[[^\\]]*(?:$|\\]))(\\][^\\]]*(?:$|\\]))*',
	'""': `(?:${stringPrefixes}"[^"\\\\]*(?:\\\\.[^"\\\\]*)*(?:"|$))+`,
	"''": `(?:${stringPrefixes}'[^'\\\\]*(?:\\\\.[^'\\\\]*)*(?:'|$))+`,
	// '$$': '(?<tag>\\$\\w*\\$)[\\s\\S]*?(?:\\k<tag>|$)', // does not work with moo
	'$$': '(?:\\$\\w*\\$)[\\s\\S]*?(?:\\$\\w*\\$)',
});
export type StringPatternType = keyof ReturnType<typeof createStringPattern>;
export type StringPatternPrefix = typeof stringPrefixList[number];

export const stringRegex = ({
	stringTypes,
	stringPrefixes,
}: {
	stringTypes: StringPatternType[];
	stringPrefixes?: StringPatternPrefix[];
}) => {
	const stringPrefix = stringPrefixes?.length ? `(?:${stringPrefixes.join('|')})?` : '';
	const stringPatternMap = createStringPattern(stringPrefix);
	const stringPattern = stringTypes.map(stringType => stringPatternMap[stringType]).join('|');
	return new RegExp(`^${stringPattern}`, 'u');
};

export const wordRegex = (
	specialChars: { any?: string; suffix?: string; prefix?: string } = {}
) => {
	// lookbehind for specialChars that only appear at start
	const prefixLookBehind = specialChars.prefix?.length
		? `[${escapeRegExp(specialChars.prefix)}]*`
		: '';
	// lookahead for specialChars that only appear at end
	const suffixLookAhead = specialChars.suffix?.length
		? `[${escapeRegExp(specialChars.suffix)}]*`
		: '';

	// unicode character categories + specialChars
	const wordChar = [
		'\\p{Alphabetic}',
		'\\p{Mark}',
		'\\p{Decimal_Number}',
		'\\p{Connector_Punctuation}',
		'\\p{Join_Control}',
		...(specialChars.any?.length ? [`[${escapeRegExp(specialChars.any)}]`] : []),
	].join('|');

	return new RegExp(`${prefixLookBehind}(?:${wordChar})+${suffixLookAhead}`, 'iu');
};

export const reservedWordRegex = (reservedKeywords: string[], specialWordChars: string) => {
	if (reservedKeywords.length === 0) {
		return new RegExp(`^\b$`, 'u');
	}
	const reservedKeywordsPattern = sortByLengthDesc(reservedKeywords)
		.map(keyword =>
			keyword
				.split('')
				.map(char => (/ /gu.test(char) ? '\\s+' : `[${char.toUpperCase()}${char.toLowerCase()}]`))
				.join('')
		)
		.join('|')
		.replace(/ /gu, '\\s+');

	const specialCharPattern = specialWordChars.length
		? `(?![${escapeRegExp(specialWordChars)}]+)`
		: '';
	return new RegExp(`^${reservedKeywordsPattern}${specialCharPattern}\\b`, 'iu');
};
