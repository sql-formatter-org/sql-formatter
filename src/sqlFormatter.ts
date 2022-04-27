import BigQueryFormatter from './languages/bigquery.formatter';
import Db2Formatter from './languages/db2.formatter';
import HiveFormatter from './languages/hive.formatter';
import MariaDbFormatter from './languages/mariadb.formatter';
import MySqlFormatter from './languages/mysql.formatter';
import N1qlFormatter from './languages/n1ql.formatter';
import PlSqlFormatter from './languages/plsql.formatter';
import PostgreSqlFormatter from './languages/postgresql.formatter';
import RedshiftFormatter from './languages/redshift.formatter';
import SparkSqlFormatter from './languages/sparksql.formatter';
import StandardSqlFormatter from './languages/standardsql.formatter';
import TSqlFormatter from './languages/tsql.formatter';

import { AliasMode, CommaPosition, FormatOptions, KeywordMode, NewlineMode } from './types';

export const formatters = {
  bigquery: BigQueryFormatter,
  db2: Db2Formatter,
  hive: HiveFormatter,
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

export type FormatFnOptions = FormatOptions & { language: FormatterLanguage };

/**
 * Format whitespace in a query to make it easier to read.
 *
 * @param {string} query - input SQL query string
 * @param {FormatOptions} cfg
 *  @param {string} cfg.language - Query language, default is Standard SQL
 *  @param {string} cfg.indent - Characters used for indentation, default is "  " (2 spaces)
 *  @param {Boolean} cfg.uppercase - Converts keywords to uppercase
 *  @param {KeywordMode} cfg.keywordPosition - Sets main keyword position style, see keywordPosition.md for examples
 *  @param {NewlineMode} cfg.newline - Determines when to break words onto a newline; always | never | lineWidth (break only when > line width) | number (break when > n)
 *  @param {Boolean} cfg.breakBeforeBooleanOperator - Break before boolean operator (AND, OR, XOR) ?
 *  @param {AliasMode} cfg.aliasAs - Whether to use AS in column aliases in only SELECT clause, both SELECT and table aliases, or never
 *  @param {Boolean} cfg.tabulateAlias - Whether to have alias following clause or aligned to right
 *  @param {CommaPosition} cfg.commaPosition - Where to place the comma in listed clauses
 *  @param {ParenOptions} cfg.parenOptions - Various options for parentheses
 *  	@param {Boolean} cfg.parenOptions -.openParenNewline Whether to place opening parenthesis on same line or newline
 *  	@param {Boolean} cfg.parenOptions -.closeParenNewline Whether to place closing parenthesis on same line or newline
 *  @param {Integer} cfg.lineWidth - Number of characters in each line before breaking, default: 50
 *  @param {Integer} cfg.linesBetweenQueries - How many line breaks between queries
 *  @param {Boolean} cfg.denseOperators - whether to format operators with spaces
 *  @param {ParamItems} cfg.params - Collection of params for placeholder replacement
 *  @param {Boolean} cfg.semicolonNewline - Whether to place semicolon on newline
 * @return {string} formatted query
 */
export const format = (query: string, cfg: Partial<FormatFnOptions> = {}): string => {
  if (typeof query !== 'string') {
    throw new Error('Invalid query argument. Expected string, instead got ' + typeof query);
  }

  if (cfg.language && !supportedDialects.includes(cfg.language)) {
    throw new Error(`Unsupported SQL dialect: ${cfg.language}`);
  }

  if (
    cfg.keywordPosition === KeywordMode.tenSpaceLeft ||
    cfg.keywordPosition === KeywordMode.tenSpaceRight
  ) {
    cfg.indent = ' '.repeat(10);
  }

  if (cfg.newline && !Number.isNaN(+cfg.newline)) {
    if ((cfg.newline ?? 0) < 0) {
      throw new Error('Error: newline must be a positive number.');
    }
    if (cfg.newline === 0) {
      cfg.newline = NewlineMode.always;
    }
  }

  if (cfg.lineWidth && cfg.lineWidth <= 0) {
    throw new Error(`lineWidth must be > 0. Received ${cfg.lineWidth} instead.`);
  }

  const defaultOptions: FormatFnOptions = {
    language: 'sql',
    indent: '  ',
    uppercase: undefined,
    keywordPosition: KeywordMode.standard,
    newline: NewlineMode.always,
    breakBeforeBooleanOperator: true,
    aliasAs: AliasMode.select,
    tabulateAlias: false,
    commaPosition: CommaPosition.after,
    parenOptions: {
      openParenNewline: true,
      closeParenNewline: true,
    },
    lineWidth: 50,
    linesBetweenQueries: 1,
    denseOperators: false,
    semicolonNewline: false,
  };
  cfg = {
    ...defaultOptions,
    ...cfg,
    parenOptions: { ...defaultOptions.parenOptions, ...cfg.parenOptions },
  };

  const Formatter = formatters[cfg.language!];
  return new Formatter(cfg as FormatOptions).format(query);
};
