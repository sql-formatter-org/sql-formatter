import {
  DialectFormatOptions,
  ProcessedDialectFormatOptions,
} from './formatter/ExpressionFormatter.js';
import Tokenizer from './lexer/Tokenizer.js';
import { TokenizerOptions } from './lexer/TokenizerOptions.js';

import { defaultFormatOptions, FormatOptions } from './FormatOptions.js';
import Formatter from './formatter/Formatter.js';
import { validateConfig } from './validateConfig.js';

export interface DialectOptions {
  name: string;
  tokenizerOptions: TokenizerOptions;
  formatOptions: DialectFormatOptions;
}

export interface Dialect {
  tokenizer: Tokenizer;
  formatOptions: ProcessedDialectFormatOptions;
}

const cache = new Map<DialectOptions, Dialect>();

/**
 * Factory function for building Dialect objects.
 * When called repeatedly with same options object returns the cached Dialect,
 * to avoid the cost of creating it again.
 */
export const createDialect = (options: DialectOptions): Dialect => {
  let dialect = cache.get(options);
  if (!dialect) {
    dialect = dialectFromOptions(options);
    cache.set(options, dialect);
  }
  return dialect;
};

const dialectFromOptions = (dialectOptions: DialectOptions): Dialect => ({
  tokenizer: new Tokenizer(dialectOptions.tokenizerOptions, dialectOptions.name),
  formatOptions: processDialectFormatOptions(dialectOptions.formatOptions),
});

const processDialectFormatOptions = (
  options: DialectFormatOptions
): ProcessedDialectFormatOptions => ({
  alwaysDenseOperators: options.alwaysDenseOperators || [],
  onelineClauses: Object.fromEntries(options.onelineClauses.map(name => [name, true])),
  tabularOnelineClauses: Object.fromEntries(
    (options.tabularOnelineClauses ?? options.onelineClauses).map(name => [name, true])
  ),
});

export type FormatOptionsWithDialect = Partial<FormatOptions> & {
  dialect: DialectOptions;
};

/**
 * Formats and SQL query string similar to `format` function, however it works directly with dialect objects instead of dialect names.
 * Provides better bundling performance and control over the formatting process.
 *
 * @param {string} query - The SQL query string to format
 * @param {FormatOptionsWithDialect} options - Configuration options
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
    ...defaultFormatOptions,
    ...cfg,
  });

  return new Formatter(createDialect(dialect), options).format(query);
};
