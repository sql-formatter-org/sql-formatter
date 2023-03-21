export { supportedDialects, format, formatDialect } from './sqlFormatter.js';
export { expandPhrases } from './expandPhrases.js';
export { ConfigError } from './validateConfig.js';

// Intentionally use "export *" syntax here to make sure when adding a new SQL dialect
// we wouldn't forget to expose it in our public API.
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
export type { ParamItems } from './formatter/Params.js';
export type { ParamTypes } from './lexer/TokenizerOptions.js';
export type { DialectOptions } from './dialect.js';
