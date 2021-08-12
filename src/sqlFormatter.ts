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

export interface FormatOptions {
	language?: keyof typeof formatters;
	params?: ParamItems | string[];
	indent?: string;
	uppercase?: boolean;
	linesBetweenQueries?: number;
}
/**
 * Format whitespace in a query to make it easier to read.
 *
 * @param {String} query
 * @param {FormatOptions} cfg
 *  @param {String} cfg.language Query language, default is Standard SQL
 *  @param {String} cfg.indent Characters used for indentation, default is "  " (2 spaces)
 *  @param {Boolean} cfg.uppercase Converts keywords to uppercase
 *  @param {Integer} cfg.linesBetweenQueries How many line breaks between queries
 *  @param {ParamItems} cfg.params Collection of params for placeholder replacement
 * @return {String}
 */
export const format = (query: string, cfg: FormatOptions = {}): string => {
	if (typeof query !== 'string') {
		throw new Error('Invalid query argument. Extected string, instead got ' + typeof query);
	}

	let Formatter = StandardSqlFormatter;
	if (cfg.language !== undefined) {
		Formatter = formatters[cfg.language];
	}
	if (Formatter === undefined) {
		throw Error(`Unsupported SQL dialect: ${cfg.language}`);
	}
	return new Formatter(cfg).format(query);
};

export const supportedDialects = Object.keys(formatters);
