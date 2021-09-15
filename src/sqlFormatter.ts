/* eslint-disable @typescript-eslint/naming-convention */

import { ParamItems } from './core/Params';
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

const formatters = {
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

export interface NewlineOptions {
	mode: 'always' | 'never' | 'lineWidth' | 'itemCount' | 'hybrid';
	itemCount?: number;
}

export interface FormatOptions {
	language: keyof typeof formatters;
	params?: ParamItems | string[];
	indent: string;
	uppercase: boolean;
	newline: NewlineOptions;
	lineWidth: number;
	linesBetweenQueries: number;
}
/**
 * Format whitespace in a query to make it easier to read.
 *
 * @param {String} query
 * @param {FormatOptions} cfg
 *  @param {String} cfg.language Query language, default is Standard SQL
 *  @param {String} cfg.indent Characters used for indentation, default is "  " (2 spaces)
 *  @param {NewlineOptions} cfg.newline Determines when to break words onto a newline;
 *  	@param {String} cfg.newline.mode always | never | lineWidth (break only when > line width) | itemCount (break when > itemCount) | hybrid (lineWidth OR itemCount)
 *  	@param {Integer} cfg.newline.itemCount Used when mode is itemCount or hybrid, must be >=0
 *  @param {Boolean} cfg.uppercase Converts keywords to uppercase
 *  @param {Integer} cfg.lineWidth Number of characters in each line before breaking, default: 50
 *  @param {Integer} cfg.linesBetweenQueries How many line breaks between queries
 *  @param {ParamItems} cfg.params Collection of params for placeholder replacement
 * @return {String}
 */
export const format = (query: string, cfg: Partial<FormatOptions> = {}): string => {
	if (typeof query !== 'string')
		throw new Error('Invalid query argument. Expected string, instead got ' + typeof query);

	if (cfg.language && !supportedDialects.includes(cfg.language))
		throw Error(`Unsupported SQL dialect: ${cfg.language}`);

	if (cfg.newline && (cfg.newline.mode === 'itemCount' || cfg.newline.mode === 'hybrid')) {
		if ((cfg.newline.itemCount ?? 0) < 0)
			throw new Error('Error: newline.itemCount must be a positive number.');
		if (cfg.newline.itemCount === 0) {
			if (cfg.newline.mode === 'hybrid') cfg.newline.mode = 'lineWidth';
			else if (cfg.newline.mode === 'itemCount') cfg.newline = { mode: 'always' };
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
		linesBetweenQueries: 1,
		newline: { mode: 'always' },
		lineWidth: 50,
	};
	cfg = { ...defaultOptions, ...cfg };

	const Formatter = formatters[cfg.language!];
	return new Formatter(cfg as FormatOptions).format(query);
};

export const supportedDialects = Object.keys(formatters);
