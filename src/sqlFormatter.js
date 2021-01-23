import Db2Formatter from './languages/Db2Formatter';
import N1qlFormatter from './languages/N1qlFormatter';
import PlSqlFormatter from './languages/PlSqlFormatter';
import RedshiftFormatter from './languages/RedshiftFormatter';
import SparkSqlFormatter from './languages/SparkSqlFormatter';
import StandardSqlFormatter from './languages/StandardSqlFormatter';

export const FORMATTERS = {
  db2: Db2Formatter,
  n1ql: N1qlFormatter,
  'pl/sql': PlSqlFormatter,
  plsql: PlSqlFormatter,
  redshift: RedshiftFormatter,
  spark: SparkSqlFormatter,
  sql: StandardSqlFormatter,
};

/**
 * Format whitespace in a query to make it easier to read.
 *
 * @param {String} query
 * @param {Object} cfg
 *  @param {String} cfg.language Query language, default is Standard SQL
 *  @param {String} cfg.indent Characters used for indentation, default is "  " (2 spaces)
 *  @param {Bool} cfg.uppercase Converts keywords to uppercase
 *  @param {Integer} cfg.linesBetweenQueries How many line breaks between queries
 *  @param {Object} cfg.params Collection of params for placeholder replacement
 * @return {String}
 */
export const format = (query, cfg = {}) => {
  if (typeof query !== 'string') {
    throw new Error('Invalid query argument. Extected string, instead got ' + typeof query);
  }

  let Formatter = StandardSqlFormatter;
  if (cfg.language !== undefined) {
    Formatter = FORMATTERS[cfg.language];
  }
  if (Formatter === undefined) {
    throw Error(`Unsupported SQL dialect: ${cfg.language}`);
  }
  return new Formatter(cfg).format(query);
};

export default { format, FORMATTERS };
