import BigQueryFormatter from 'src/languages/bigquery/bigquery.formatter';
import Db2Formatter from 'src/languages/db2/db2.formatter';
import HiveFormatter from 'src/languages/hive/hive.formatter';
import MariaDbFormatter from 'src/languages/mariadb/mariadb.formatter';
import MySqlFormatter from 'src/languages/mysql/mysql.formatter';
import N1qlFormatter from 'src/languages/n1ql/n1ql.formatter';
import PlSqlFormatter from 'src/languages/plsql/plsql.formatter';
import PostgreSqlFormatter from 'src/languages/postgresql/postgresql.formatter';
import RedshiftFormatter from 'src/languages/redshift/redshift.formatter';
import SparkFormatter from 'src/languages/spark/spark.formatter';
import SqliteFormatter from 'src/languages/sqlite/sqlite.formatter';
import SqlFormatter from 'src/languages/sql/sql.formatter';
import TSqlFormatter from 'src/languages/tsql/tsql.formatter';

import type { FormatOptions } from './types';
import { ParamItems } from './formatter/Params';

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
  spark: SparkFormatter,
  sql: SqlFormatter,
  sqlite: SqliteFormatter,
  tsql: TSqlFormatter,
};
export type SqlLanguage = keyof typeof formatters;
export const supportedDialects = Object.keys(formatters);

export type FormatFnOptions = FormatOptions & { language: SqlLanguage };

const defaultOptions: FormatFnOptions = {
  language: 'sql',
  tabWidth: 2,
  useTabs: false,
  keywordCase: 'preserve',
  indentStyle: 'standard',
  logicalOperatorNewline: 'before',
  aliasAs: 'preserve',
  tabulateAlias: false,
  commaPosition: 'after',
  expressionWidth: 50,
  linesBetweenQueries: 1,
  denseOperators: false,
  newlineBeforeSemicolon: false,
};

/**
 * Format whitespace in a query to make it easier to read.
 *
 * @param {string} query - input SQL query string
 * @param {FormatOptions} cfg Configuration options (see docs in README)
 * @return {string} formatted query
 */
export const format = (query: string, cfg: Partial<FormatFnOptions> = {}): string => {
  if (typeof query !== 'string') {
    throw new Error('Invalid query argument. Expected string, instead got ' + typeof query);
  }

  const options = validateConfig({
    ...defaultOptions,
    ...cfg,
  });

  const Formatter = formatters[options.language];
  return new Formatter(options).format(query);
};

export class ConfigError extends Error {}

function validateConfig(cfg: FormatFnOptions): FormatFnOptions {
  if (!supportedDialects.includes(cfg.language)) {
    throw new ConfigError(`Unsupported SQL dialect: ${cfg.language}`);
  }

  if ('multilineLists' in cfg) {
    throw new ConfigError('multilineLists config is no more supported.');
  }
  if ('newlineBeforeOpenParen' in cfg) {
    throw new ConfigError('newlineBeforeOpenParen config is no more supported.');
  }
  if ('newlineBeforeCloseParen' in cfg) {
    throw new ConfigError('newlineBeforeCloseParen config is no more supported.');
  }

  if (cfg.expressionWidth <= 0) {
    throw new ConfigError(
      `expressionWidth config must be positive number. Received ${cfg.expressionWidth} instead.`
    );
  }

  if (cfg.commaPosition === 'before' && cfg.useTabs) {
    throw new ConfigError(
      'commaPosition: before does not work when tabs are used for indentation.'
    );
  }

  if (cfg.language === 'hive' && cfg.params !== undefined) {
    throw new ConfigError(
      'Unexpected "params" option. Prepared statement placeholders not supported for Hive.'
    );
  }

  if (cfg.language === 'spark' && cfg.params !== undefined) {
    throw new ConfigError(
      'Unexpected "params" option. Prepared statement placeholders not supported for Spark.'
    );
  }

  if (cfg.params && !validateParams(cfg.params)) {
    // eslint-disable-next-line no-console
    console.warn('WARNING: All "params" option values should be strings.');
  }

  return cfg;
}

function validateParams(params: ParamItems | string[]): boolean {
  const paramValues = params instanceof Array ? params : Object.values(params);
  return paramValues.every(p => typeof p === 'string');
}

export type FormatFn = typeof format;
