import {
  DialectFormatOptions,
  ProcessedDialectFormatOptions,
} from './formatter/ExpressionFormatter.js';
import Tokenizer from './lexer/Tokenizer.js';
import { QuoteType, TokenizerOptions, VariableType } from './lexer/TokenizerOptions.js';
import { quotePatterns } from './lexer/regexFactory.js';
import { ConfigError } from './validateConfig.js';

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

// A quote type that resolves to no pattern at all yields a regex matching the
// empty string, which used to leave the tokenizer looping forever.
const validateQuoteTypes = (name: string, options: TokenizerOptions): void => {
  const unknownQuote = (field: string, quote: string): ConfigError =>
    new ConfigError(
      `Unknown quote type "${quote}" given in ${field} of dialect "${name}". ` +
        `Known ones are: ${Object.keys(quotePatterns).join(', ')}.`
    );

  const check = (field: string, types: (QuoteType | VariableType)[] | undefined) => {
    if (types === undefined) {
      return;
    }
    if (types.length === 0) {
      throw new ConfigError(
        `Empty ${field} given for dialect "${name}". That would result in matching zero-length tokens.`
      );
    }
    // A quote type is either a plain name, a name with prefixes, or a regex.
    for (const type of types) {
      if (typeof type === 'string') {
        if (!Object.prototype.hasOwnProperty.call(quotePatterns, type)) {
          throw unknownQuote(field, type);
        }
      } else if ('regex' in type) {
        if (type.regex === '') {
          throw new ConfigError(
            `Empty regex given in ${field} of dialect "${name}". That would result in matching zero-length tokens.`
          );
        }
      } else if (!Object.prototype.hasOwnProperty.call(quotePatterns, type.quote)) {
        throw unknownQuote(field, type.quote);
      }
    }
  };

  check('stringTypes', options.stringTypes);
  check('identTypes', options.identTypes);
  check('variableTypes', options.variableTypes);
};

/**
 * Factory function for building Dialect objects.
 * When called repeatedly with same options object returns the cached Dialect,
 * to avoid the cost of creating it again.
 */
export const createDialect = (options: DialectOptions): Dialect => {
  let dialect = cache.get(options);
  if (!dialect) {
    validateQuoteTypes(options.name, options.tokenizerOptions);
    dialect = dialectFromOptions(options);
    cache.set(options, dialect);
  }
  return dialect;
};

const dialectFromOptions = (dialectOptions: DialectOptions): Dialect => ({
  tokenizer: new Tokenizer(dialectOptions.tokenizerOptions, dialectOptions.name),
  formatOptions: processDialectFormatOptions(dialectOptions),
});

const processDialectFormatOptions = ({
  tokenizerOptions,
  formatOptions: options,
}: DialectOptions): ProcessedDialectFormatOptions => ({
  alwaysDenseOperators: options.alwaysDenseOperators || [],
  onelineClauses: Object.fromEntries(options.onelineClauses.map(name => [name, true])),
  tabularOnelineClauses: Object.fromEntries(
    (options.tabularOnelineClauses ?? options.onelineClauses).map(name => [name, true])
  ),
  identifierDashes: Boolean(tokenizerOptions.identChars?.dashes),
});
