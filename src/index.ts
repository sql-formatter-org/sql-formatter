export { supportedDialects, format, formatDialect } from './sqlFormatter.js';
export { expandPhrases } from './expandPhrases.js';
export * from './allDialects.js';

// NB! To re-export types the "export type" syntax is required by webpack.
// Otherwise webpack build will fail.
export type {
  SqlLanguage,
  FormatOptionsWithLanguage,
  FormatOptionsWithDialect,
} from './sqlFormatter.js';
export type {
  IndentStyle,
  KeywordCase,
  CommaPosition,
  LogicalOperatorNewline,
  FormatOptions,
} from './FormatOptions.js';
export type { DialectOptions } from './dialect.js';
export type { ConfigError } from './validateConfig.js';
