import * as allDialects from './allDialects.js';

import { FormatOptions } from './FormatOptions.js';
import { createDialect, DialectOptions } from './dialect.js';
import Formatter from './formatter/Formatter.js';
import { ConfigError, validateConfig } from './validateConfig.js';

const formatters = {
  ...allDialects,
  tsql: allDialects.transactsql, // alias for transactsql
};
export type SqlLanguage = keyof typeof formatters;
export const supportedDialects = Object.keys(formatters);

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
 * @param {FormatOptionsWithLanguage} cfg Configuration options (see docs in README)
 * @return {string} formatted query
 */
export const format = (query: string, cfg: FormatOptionsWithLanguage = {}): string => {
  if (typeof cfg.language === 'string' && !supportedDialects.includes(cfg.language)) {
    throw new ConfigError(`Unsupported SQL dialect: ${cfg.language}`);
  }

  return formatDialect(query, {
    ...cfg,
    dialect: formatters[cfg.language || 'sql'],
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
