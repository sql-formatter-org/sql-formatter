export {
  SqlLanguage,
  supportedDialects,
  FormatOptionsWithLanguage,
  FormatOptionsWithDialect,
  format,
  formatDialect,
} from './sqlFormatter.js';
export type {
  IndentStyle,
  KeywordCase,
  CommaPosition,
  LogicalOperatorNewline,
  FormatOptions,
} from './FormatOptions.js';
export type { DialectOptions } from './dialect.js';
export { ConfigError } from './validateConfig.js';
export { expandPhrases } from './expandPhrases.js';
