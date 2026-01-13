import * as allDialects from './allDialects.js';

import { FormatOptions } from './FormatOptions.js';
import { createDialect, DialectOptions } from './dialect.js';
import Formatter from './formatter/Formatter.js';
import { ConfigError, validateConfig } from './validateConfig.js';

const dialectNameMap: Record<keyof typeof allDialects | 'tsql', keyof typeof allDialects> = {
  bigquery: 'bigquery',
  db2: 'db2',
  db2i: 'db2i',
  duckdb: 'duckdb',
  hive: 'hive',
  mariadb: 'mariadb',
  mysql: 'mysql',
  n1ql: 'n1ql',
  plsql: 'plsql',
  postgresql: 'postgresql',
  redshift: 'redshift',
  spark: 'spark',
  sqlite: 'sqlite',
  sql: 'sql',
  tidb: 'tidb',
  trino: 'trino',
  transactsql: 'transactsql',
  tsql: 'transactsql', // alias for transactsq
  singlestoredb: 'singlestoredb',
  snowflake: 'snowflake',
};

export const supportedDialects = Object.keys(dialectNameMap);
export type SqlLanguage = keyof typeof dialectNameMap;

export type FormatOptionsWithLanguage = Partial<FormatOptions> & {
  language?: SqlLanguage;
};

export type FormatOptionsWithDialect = Partial<FormatOptions> & {
  dialect: DialectOptions;
};

const defaultOptions: FormatOptions = {
  tabWidth: 2,
  useTabs: false,
  keywordCase: 'preserve',
  identifierCase: 'preserve',
  dataTypeCase: 'preserve',
  functionCase: 'preserve',
  indentStyle: 'standard',
  logicalOperatorNewline: 'before',
  commaNewline: 'after',
  expressionWidth: 50,
  linesBetweenQueries: 1,
  denseOperators: false,
  newlineBeforeSemicolon: false,
};

/**
 * Format whitespace in a query to make it easier to read.
 *
 * @param {string} query - input SQL query string
 * @param {FormatOptionsWithLanguage} cfg Configuration options (see docs in README)
 * @return {string} formatted query
 */
export const format = (query: string, cfg: FormatOptionsWithLanguage = {}): string => {
  if (typeof cfg.language === 'string' && !supportedDialects.includes(cfg.language)) {
    throw new ConfigError(`Unsupported SQL dialect: ${cfg.language}`);
  }

  const canonicalDialectName = dialectNameMap[cfg.language || 'sql'];

  return formatDialect(query, {
    ...cfg,
    dialect: allDialects[canonicalDialectName],
  });
};

/**
 * Like the above format(), but language parameter is mandatory
 * and must be a Dialect object instead of a string.
 *
 * @param {string} query - input SQL query string
 * @param {FormatOptionsWithDialect} cfg Configuration options (see docs in README)
 * @return {string} formatted query
 */
export const formatDialect = (
  query: string,
  { dialect, ...cfg }: FormatOptionsWithDialect
): string => {
  if (typeof query !== 'string') {
    throw new Error('Invalid query argument. Expected string, instead got ' + typeof query);
  }

  const options = validateConfig({
    ...defaultOptions,
    ...cfg,
  });

  return new Formatter(createDialect(dialect), options).format(query);
};

export type FormatFn = typeof format;
