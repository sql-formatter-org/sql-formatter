import { bigquery } from './languages/bigquery/bigquery.formatter.js';
import { db2 } from './languages/db2/db2.formatter.js';
import { hive } from './languages/hive/hive.formatter.js';
import { mariadb } from './languages/mariadb/mariadb.formatter.js';
import { mysql } from './languages/mysql/mysql.formatter.js';
import { n1ql } from './languages/n1ql/n1ql.formatter.js';
import { plsql } from './languages/plsql/plsql.formatter.js';
import { postgresql } from './languages/postgresql/postgresql.formatter.js';
import { redshift } from './languages/redshift/redshift.formatter.js';
import { spark } from './languages/spark/spark.formatter.js';
import { sqlite } from './languages/sqlite/sqlite.formatter.js';
import { sql } from './languages/sql/sql.formatter.js';
import { trino } from './languages/trino/trino.formatter.js';
import { transactsql } from './languages/transactsql/transactsql.formatter.js';
import { singlestoredb } from './languages/singlestoredb/singlestoredb.formatter.js';
import { snowflake } from './languages/snowflake/snowflake.formatter.js';

import { FormatOptions } from './FormatOptions.js';
import { ParamItems } from './formatter/Params.js';
import { createDialect, DialectOptions } from './dialect.js';
import Formatter from './formatter/Formatter.js';

export const formatters = {
  bigquery,
  db2,
  hive,
  mariadb,
  mysql,
  n1ql,
  plsql,
  postgresql,
  redshift,
  singlestoredb,
  snowflake,
  spark,
  sql,
  sqlite,
  transactsql,
  trino,
  tsql: transactsql, // alias for transactsql
};
export type SqlLanguage = keyof typeof formatters;
export const supportedDialects = Object.keys(formatters);

export interface FormatOptionsWithLanguage extends FormatOptions {
  language: SqlLanguage | DialectOptions;
}

const defaultOptions: FormatOptionsWithLanguage = {
  language: 'sql',
  tabWidth: 2,
  useTabs: false,
  keywordCase: 'preserve',
  indentStyle: 'standard',
  logicalOperatorNewline: 'before',
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
 * @param {Partial<FormatOptionsWithLanguage>} cfg Configuration options (see docs in README)
 * @return {string} formatted query
 */
export const format = (query: string, cfg: Partial<FormatOptionsWithLanguage> = {}): string => {
  if (typeof query !== 'string') {
    throw new Error('Invalid query argument. Expected string, instead got ' + typeof query);
  }

  const options = validateConfig({
    ...defaultOptions,
    ...cfg,
  });

  const dialectOptions: DialectOptions =
    typeof options.language === 'string' ? formatters[options.language] : options.language;

  return new Formatter(createDialect(dialectOptions), options).format(query);
};

export class ConfigError extends Error {}

function validateConfig(cfg: FormatOptionsWithLanguage): FormatOptionsWithLanguage {
  if (typeof cfg.language === 'string' && !supportedDialects.includes(cfg.language)) {
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
  if ('aliasAs' in cfg) {
    throw new ConfigError('aliasAs config is no more supported.');
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
