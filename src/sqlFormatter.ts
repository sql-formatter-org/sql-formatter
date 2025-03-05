import * as allDialects from './allDialects.js';

import { formatDialect } from './dialect.js';
import { FormatOptions } from './FormatOptions.js';
import { ConfigError } from './validateConfig.js';

const dialectNameMap: Record<keyof typeof allDialects | 'tsql', keyof typeof allDialects> = {
  bigquery: 'bigquery',
  db2: 'db2',
  db2i: 'db2i',
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
  /**
   * SQL dialect to use (e.g. 'postgresql', 'mysql'). Defaults to 'sql'
   */
  language?: SqlLanguage;
};

/**
 * Formats an SQL query string with consistent whitespace and indentation.
 *
 * @param {string} query - The SQL query string to format
 * @param {FormatOptionsWithLanguage} options - Configuration options
 * @returns {string} The formatted SQL query
 * @throws {ConfigError} If an unsupported SQL dialect is specified
 *
 * @example
 * format('SELECT * FROM   users WHERE  id = 1');
 * // Returns:
 * // SELECT *
 * // FROM users
 * // WHERE id = 1
 */
export const format = (query: string, options: FormatOptionsWithLanguage = {}): string => {
  if (typeof options.language === 'string' && !supportedDialects.includes(options.language)) {
    throw new ConfigError(`Unsupported SQL dialect: ${options.language}`);
  }

  const canonicalDialectName = dialectNameMap[options.language || 'sql'];

  return formatDialect(query, {
    ...options,
    dialect: allDialects[canonicalDialectName],
  });
};

export type FormatFn = typeof format;
