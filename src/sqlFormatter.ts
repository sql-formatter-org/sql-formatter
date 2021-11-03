import type { ParamItems } from './core/Params';
import Db2Formatter from './languages/Db2Formatter';
import MariaDbFormatter from './languages/MariaDbFormatter';
import MySqlFormatter from './languages/MySqlFormatter';
import N1qlFormatter from './languages/N1qlFormatter';
import PlSqlFormatter from './languages/PlSqlFormatter';
import PostgreSqlFormatter from './languages/PostgreSqlFormatter';
import RedshiftFormatter from './languages/RedshiftFormatter';
import SparkSqlFormatter from './languages/SparkSqlFormatter';
import StandardSqlFormatter from './languages/StandardSqlFormatter';
import TSqlFormatter from './languages/TSqlFormatter';

import type { NewlineOptions } from './types';
import { AliasMode, CommaPosition, KeywordMode, NewlineMode } from './types';

export const formatters = {
	db2: Db2Formatter,
	mariadb: MariaDbFormatter,
	mysql: MySqlFormatter,
	n1ql: N1qlFormatter,
	plsql: PlSqlFormatter,
	postgresql: PostgreSqlFormatter,
	redshift: RedshiftFormatter,
	spark: SparkSqlFormatter,
	sql: StandardSqlFormatter,
	tsql: TSqlFormatter,
};
export type FormatterLanguage = keyof typeof formatters;
export const supportedDialects = Object.keys(formatters);

export interface FormatOptions {
	language: FormatterLanguage;
	indent: string;
	uppercase: boolean;
	keywordPosition: KeywordMode | keyof typeof KeywordMode;
	newline: NewlineOptions;
	breakBeforeBooleanOperator: boolean;
	aliasAs: AliasMode | keyof typeof AliasMode;
	commaPosition: CommaPosition | keyof typeof CommaPosition;
	tabulateAlias: boolean;
	lineWidth: number;
	linesBetweenQueries: number;
	denseOperators: boolean;
	semicolonNewline: false;
	params?: ParamItems | string[];
}
/**
 * Format whitespace in a query to make it easier to read.
 *
 * @param {String} query
 * @param {FormatOptions} cfg
 *  @param {String} cfg.language Query language, default is Standard SQL
 *  @param {String} cfg.indent Characters used for indentation, default is "  " (2 spaces)
 *  @param {Boolean} cfg.uppercase Converts keywords to uppercase
 *  @param {KeywordMode} cfg.keywordPosition Sets main keyword position style, see keywordPosition.md for examples
 *  @param {NewlineOptions} cfg.newline Determines when to break words onto a newline;
 *  	@param {NewlineMode} cfg.newline.mode always | never | lineWidth (break only when > line width) | itemCount (break when > itemCount) | hybrid (lineWidth OR itemCount)
 *  	@param {Integer} cfg.newline.itemCount Used when mode is itemCount or hybrid, must be >=0
 *  @param {Boolean} cfg.breakBeforeBooleanOperator Break before boolean operator (AND, OR, XOR) ?
 *  @param {AliasMode} cfg.aliasAs Whether to use AS in column aliases in only SELECT clause, both SELECT and table aliases, or never
 *  @param {CommaPosition} cfg.commaPosition Where to place the comma in listed clauses
 *  @param {Boolean} cfg.tabulateAlias Whether to have alias following clause or aligned to right
 *  @param {Integer} cfg.lineWidth Number of characters in each line before breaking, default: 50
 *  @param {Integer} cfg.linesBetweenQueries How many line breaks between queries
 *  @param {Boolean} cfg.denseOperators whether to format operators with spaces
 *  @param {ParamItems} cfg.params Collection of params for placeholder replacement
 *  @param {Boolean} cfg.semicolonNewline Whether to place semicolon on newline
 * @return {String}
 */
export const format = (query: string, cfg: Partial<FormatOptions> = {}): string => {
	if (typeof query !== 'string') {
		throw new Error('Invalid query argument. Expected string, instead got ' + typeof query);
	}

	if (cfg.language && !supportedDialects.includes(cfg.language)) {
		throw Error(`Unsupported SQL dialect: ${cfg.language}`);
	}

	if (
		cfg.keywordPosition === KeywordMode.tenSpaceLeft ||
		cfg.keywordPosition === KeywordMode.tenSpaceRight
	) {
		cfg.indent = ' '.repeat(10);
	}

	if (
		cfg.newline &&
		(cfg.newline.mode === NewlineMode.itemCount || cfg.newline.mode === NewlineMode.hybrid)
	) {
		if ((cfg.newline.itemCount ?? 0) < 0) {
			throw new Error('Error: newline.itemCount must be a positive number.');
		}
		if (cfg.newline.itemCount === 0) {
			if (cfg.newline.mode === NewlineMode.hybrid) {
				cfg.newline.mode = NewlineMode.lineWidth;
			} else if (cfg.newline.mode === NewlineMode.itemCount) {
				cfg.newline = { mode: NewlineMode.always };
			}
		}
	}

	if (cfg.lineWidth && cfg.lineWidth <= 0) {
		console.warn('Warning: cfg.linewidth was <=0, reset to default value');
		cfg.lineWidth = undefined;
	}

	const defaultOptions: FormatOptions = {
		language: 'sql',
		indent: '  ',
		uppercase: true,
		keywordPosition: KeywordMode.standard,
		newline: { mode: NewlineMode.always },
		breakBeforeBooleanOperator: true,
		aliasAs: AliasMode.select,
		commaPosition: CommaPosition.after,
		tabulateAlias: false,
		lineWidth: 50,
		linesBetweenQueries: 1,
		denseOperators: false,
		semicolonNewline: false,
	};
	cfg = { ...defaultOptions, ...cfg };

	const Formatter = formatters[cfg.language!];
	return new Formatter(cfg as FormatOptions).format(query);
};
