import { quotePatterns } from './regexFactory';

export interface IdentChars {
  // Additional characters that can be used as first character of an identifier.
  // That is: in addition to letters and underscore.
  first?: string;
  // Additional characters that can appear after the first character of identifier.
  // That is: in addition to letters, numbers and underscore.
  rest?: string;
  // True to allow single dashes (-) inside identifiers, but not at the beginning or end
  dashes?: boolean;
}

export type PlainQuoteType = keyof typeof quotePatterns;

export interface StringQuoteType {
  quote: PlainQuoteType;
  escapes?: ('\\\\' | '"' | "'")[];
}

export interface PrefixedQuoteType extends StringQuoteType {
  prefixes: string[];
  requirePrefix?: boolean; // True when prefix is required
}

export type QuoteType = PlainQuoteType | StringQuoteType | PrefixedQuoteType;

export interface VariableRegex {
  regex: string;
}

export type VariableType = VariableRegex | PrefixedQuoteType;
