export { supportedDialects, format } from './sqlFormatter.js';
export { expandPhrases } from './expandPhrases.js';
export { ConfigError } from './validateConfig.js';

// NB! To re-export types the "export type" syntax is required by webpack.
// Otherwise webpack build will fail.
export type { SqlLanguage, FormatOptionsWithLanguage } from './sqlFormatter.js';
export type {
  IndentStyle,
  KeywordCase,
  DataTypeCase,
  FunctionCase,
  IdentifierCase,
  LogicalOperatorNewline,
  FormatOptions,
} from './FormatOptions.js';
export type { ParamItems } from './formatter/Params.js';
export type { ParamTypes } from './lexer/TokenizerOptions.js';
