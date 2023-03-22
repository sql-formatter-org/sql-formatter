import { quotePatterns } from './regexFactory.js';
import { Token } from './token.js';

export interface IdentChars {
  // Additional characters that can be used as first character of an identifier.
  // That is: in addition to letters and underscore.
  first?: string;
  // Additional characters that can appear after the first character of identifier.
  // That is: in addition to letters, numbers and underscore.
  rest?: string;
  // True to allow single dashes (-) inside identifiers, but not at the beginning or end
  dashes?: boolean;
  // Allows identifier to begin with number
  allowFirstCharNumber?: boolean;
}

export type PlainQuoteType = keyof typeof quotePatterns;

export interface PrefixedQuoteType {
  quote: PlainQuoteType;
  prefixes: string[];
  requirePrefix?: boolean; // True when prefix is required
}

export interface RegexPattern {
  regex: string;
}

export type QuoteType = PlainQuoteType | PrefixedQuoteType | RegexPattern;

export type VariableType = RegexPattern | PrefixedQuoteType;

export interface ParamTypes {
  // True to allow for positional "?" parameter placeholders
  positional?: boolean;
  // Prefixes for numbered parameter placeholders to support, e.g. :1, :2, :3
  numbered?: ('?' | ':' | '$')[];
  // Prefixes for named parameter placeholders to support, e.g. :name
  named?: (':' | '@' | '$')[];
  // Prefixes for quoted parameter placeholders to support, e.g. :"name"
  // The type of quotes will depend on `identifierTypes` option.
  quoted?: (':' | '@' | '$')[];
  // Array of regular expressions
  custom?: RegexPattern[];
}

export interface TokenizerOptions {
  // SELECT clause and its variations
  reservedSelect: string[];
  // Main clauses that start new block, like: WITH, FROM, WHERE, ORDER BY
  reservedClauses: string[];
  // True to support XOR in addition to AND and OR
  supportsXor?: boolean;
  // Keywords that create newline but no indentaion of their body.
  // These contain set operations like UNION
  reservedSetOperations: string[];
  // Various joins like LEFT OUTER JOIN
  reservedJoins: string[];
  // These are essentially multi-word sequences of keywords,
  // that we prioritize over all other keywords (RESERVED_* tokens)
  reservedPhrases?: string[];
  // built in function names
  reservedFunctionNames: string[];
  // all other reserved words (not included to any of the above lists)
  reservedKeywords: string[];
  // Types of quotes to use for strings
  stringTypes: QuoteType[];
  // Types of quotes to use for quoted identifiers
  identTypes: QuoteType[];
  // Types of quotes to use for variables
  variableTypes?: VariableType[];
  // Types of additional parenthesis types to support
  extraParens?: ('[]' | '{}')[];
  // Types of parameter placeholders supported with prepared statements
  paramTypes?: ParamTypes;
  // Line comment types to support, defaults to --
  lineCommentTypes?: string[];
  // True to allow for nested /* /* block comments */ */
  nestedBlockComments?: boolean;
  // Additional characters to support in identifiers
  identChars?: IdentChars;
  // Additional characters to support in named parameters
  // Use this when parameters allow different characters from identifiers
  // Defaults to `identChars`.
  paramChars?: IdentChars;
  // Additional multi-character operators to support, in addition to <=, >=, <>, !=
  operators?: string[];
  // Allows custom modifications on the token array.
  // Called after the whole input string has been split into tokens.
  // The result of this will be the output of the tokenizer.
  postProcess?: (tokens: Token[]) => Token[];
}
