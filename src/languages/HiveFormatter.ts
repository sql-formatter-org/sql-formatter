import Formatter from '../core/Formatter';
import Tokenizer from '../core/Tokenizer';
import type { StringPatternType } from '../core/regexFactory';

/**
 * Priority 5 (last)
 * Full list of reserved functions
 * distinct from Keywords due to interaction with parentheses
 */
const reservedFunctions = [] as string[];

/**
 * Priority 5 (last)
 * Full list of reserved words
 * any words that are in a higher priority are removed
 */
const reservedKeywords = [] as string[];

/**
 * Priority 1 (first)
 * keywords that begin a new statement
 * will begin new indented block
 */
const reservedCommands = [] as string[];

/**
 * Priority 2
 * commands that operate on two tables or subqueries
 * two main categories: joins and boolean set operators
 */
const reservedBinaryCommands = [
	// set booleans
	'INTERSECT',
	'INTERSECT ALL',
	'INTERSECT DISTINCT',
	'UNION',
	'UNION ALL',
	'UNION DISTINCT',
	'EXCEPT',
	'EXCEPT ALL',
	'EXCEPT DISTINCT',
	// joins
	'JOIN',
	'INNER JOIN',
	'LEFT JOIN',
	'LEFT OUTER JOIN',
	'RIGHT JOIN',
	'RIGHT OUTER JOIN',
	'FULL JOIN',
	'FULL OUTER JOIN',
	'CROSS JOIN',
	'NATURAL JOIN',
];

/**
 * Priority 3
 * keywords that follow a previous Statement, must be attached to subsequent data
 * can be fully inline or on newline with optional indent
 */
const reservedDependentClauses = ['ON', 'WHEN', 'THEN', 'ELSE'];

export default class HiveFormatter extends Formatter {
	static reservedCommands = reservedCommands;
	static reservedBinaryCommands = reservedBinaryCommands;
	static reservedDependentClauses = reservedDependentClauses;
	static reservedLogicalOperators = ['AND', 'OR'];
	static fullReservedWords = [...reservedFunctions, ...reservedKeywords];

	static stringTypes: StringPatternType[] = [];
	static blockStart = ['('];
	static blockEnd = [')'];
	static indexedPlaceholderTypes = [];
	static namedPlaceholderTypes = [];
	static lineCommentTypes = ['--'];
	static specialWordChars = {};
	static operators = [];

	tokenizer() {
		return new Tokenizer({
			reservedCommands: HiveFormatter.reservedCommands,
			reservedBinaryCommands: HiveFormatter.reservedBinaryCommands,
			reservedDependentClauses: HiveFormatter.reservedDependentClauses,
			reservedLogicalOperators: HiveFormatter.reservedLogicalOperators,
			reservedKeywords: HiveFormatter.fullReservedWords,
			stringTypes: HiveFormatter.stringTypes,
			blockStart: HiveFormatter.blockStart,
			blockEnd: HiveFormatter.blockEnd,
			indexedPlaceholderTypes: HiveFormatter.indexedPlaceholderTypes,
			namedPlaceholderTypes: HiveFormatter.namedPlaceholderTypes,
			lineCommentTypes: HiveFormatter.lineCommentTypes,
			specialWordChars: HiveFormatter.specialWordChars,
			operators: HiveFormatter.operators,
		});
	}
}
