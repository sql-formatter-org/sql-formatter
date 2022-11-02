export {
  SqlLanguage,
  supportedDialects,
  FormatOptionsWithLanguage,
  FormatOptionsWithDialect,
  format,
  formatDialect,
  ConfigError,
} from './sqlFormatter.js';
export type {
  IndentStyle,
  KeywordCase,
  CommaPosition,
  LogicalOperatorNewline,
  FormatOptions,
} from './FormatOptions.js';
export type { DialectOptions } from './dialect.js';
export { expandPhrases } from './expandPhrases.js';
