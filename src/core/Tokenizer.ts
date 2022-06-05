import { equalizeWhitespace, escapeRegExp, id } from 'src/utils';

import * as regexFactory from './regexFactory';
import { type Token, TokenType } from './token';

export const WHITESPACE_REGEX = /^(\s+)/u;
const NULL_REGEX = /(?!)/; // zero-width negative lookahead, matches nothing

const toCanonicalKeyword = (text: string) => equalizeWhitespace(text.toUpperCase());

/** Struct that defines how a SQL language can be broken into tokens */
interface TokenizerOptions {
  // Main clauses that start new block, like: SELECT, FROM, WHERE, ORDER BY
  reservedCommands: string[];
  // Logical operator keywords, defaults to: [AND, OR]
  reservedLogicalOperators?: string[];
  // Keywords in CASE expressions that begin new line, like: WHEN, ELSE
  reservedDependentClauses: string[];
  // Keywords that create newline but no indentaion of their body.
  // These contain set operations like UNION and various joins like LEFT OUTER JOIN
  reservedBinaryCommands: string[];
  // keywords used for JOIN conditions, defaults to: [ON, USING]
  reservedJoinConditions?: string[];
  // all other reserved words (not included to any of the above lists)
  reservedKeywords: string[];
  // Types of quotes to use for strings
  stringTypes: regexFactory.QuoteType[];
  // Types of quotes to use for quoted identifiers
  identifierTypes: regexFactory.QuoteType[];
  // Open-parenthesis characters, like: (, [, {
  blockStart?: string[];
  // Close-parenthesis characters, like: ), ], }
  blockEnd?: string[];
  // True to allow for positional "?" parameter placeholders
  positionalPlaceholders?: boolean;
  // Prefixes for numbered parameter placeholders to support, e.g. :1, :2, :3
  numberedPlaceholderTypes?: ('?' | ':' | '$')[];
  // Prefixes for named parameter placeholders to support, e.g. :name
  namedPlaceholderTypes?: (':' | '@' | '$')[];
  // Prefixes for quoted parameter placeholders to support, e.g. :"name"
  // The type of quotes will depend on `identifierTypes` option.
  quotedPlaceholderTypes?: (':' | '@' | '$')[];
  // Line comment types to support, defaults to --
  lineCommentTypes?: string[];
  // Additional characters to support in identifiers
  specialIdentChars?: regexFactory.IdentChars;
  // Additional multi-character operators to support, in addition to <=, >=, <>, !=
  operators?: string[];
  // Allows custom modifications on the token array.
  // Called after the whole input string has been split into tokens.
  // The result of this will be the output of the tokenizer.
  preprocess?: (tokens: Token[]) => Token[];
}

interface PlaceholderPattern {
  regex: RegExp;
  parseKey: (s: string) => string;
}

/** Converts SQL language string into a token stream */
export default class Tokenizer {
  private REGEX_MAP: Record<TokenType, RegExp>;
  private quotedIdentRegex: RegExp;
  private placeholderPatterns: PlaceholderPattern[];

  private preprocess = (tokens: Token[]) => tokens;

  constructor(cfg: TokenizerOptions) {
    if (cfg.preprocess) {
      this.preprocess = cfg.preprocess;
    }

    this.quotedIdentRegex = regexFactory.createQuoteRegex(cfg.identifierTypes);

    this.REGEX_MAP = {
      [TokenType.IDENT]: regexFactory.createIdentRegex(cfg.specialIdentChars),
      [TokenType.STRING]: regexFactory.createQuoteRegex(cfg.stringTypes),
      [TokenType.RESERVED_KEYWORD]: regexFactory.createReservedWordRegex(
        cfg.reservedKeywords,
        cfg.specialIdentChars
      ),
      [TokenType.RESERVED_DEPENDENT_CLAUSE]: regexFactory.createReservedWordRegex(
        cfg.reservedDependentClauses ?? [],
        cfg.specialIdentChars
      ),
      [TokenType.RESERVED_LOGICAL_OPERATOR]: regexFactory.createReservedWordRegex(
        cfg.reservedLogicalOperators ?? ['AND', 'OR'],
        cfg.specialIdentChars
      ),
      [TokenType.RESERVED_COMMAND]: regexFactory.createReservedWordRegex(
        cfg.reservedCommands,
        cfg.specialIdentChars
      ),
      [TokenType.RESERVED_BINARY_COMMAND]: regexFactory.createReservedWordRegex(
        cfg.reservedBinaryCommands,
        cfg.specialIdentChars
      ),
      [TokenType.RESERVED_JOIN_CONDITION]: regexFactory.createReservedWordRegex(
        cfg.reservedJoinConditions ?? ['ON', 'USING'],
        cfg.specialIdentChars
      ),
      [TokenType.OPERATOR]: regexFactory.createOperatorRegex('+-/*%&|^><=.,;[]{}`:$@', [
        '<>',
        '<=',
        '>=',
        '!=',
        ...(cfg.operators ?? []),
      ]),
      [TokenType.BLOCK_START]: regexFactory.createParenRegex(cfg.blockStart ?? ['(']),
      [TokenType.BLOCK_END]: regexFactory.createParenRegex(cfg.blockEnd ?? [')']),
      [TokenType.RESERVED_CASE_START]: /^(CASE)\b/iu,
      [TokenType.RESERVED_CASE_END]: /^(END)\b/iu,
      [TokenType.LINE_COMMENT]: regexFactory.createLineCommentRegex(cfg.lineCommentTypes ?? ['--']),
      [TokenType.BLOCK_COMMENT]: /^(\/\*[^]*?(?:\*\/|$))/u,
      [TokenType.NUMBER]:
        /^(0x[0-9a-fA-F]+|0b[01]+|(-\s*)?[0-9]+(\.[0-9]*)?([eE][-+]?[0-9]+(\.[0-9]+)?)?)/u,
      [TokenType.PLACEHOLDER]: NULL_REGEX, // matches nothing
      [TokenType.EOF]: NULL_REGEX, // matches nothing
    };

    this.placeholderPatterns = this.excludePatternsWithoutRegexes([
      {
        // :name placeholders
        regex: regexFactory.createPlaceholderRegex(
          cfg.namedPlaceholderTypes ?? [],
          regexFactory.createIdentPattern(cfg.specialIdentChars)
        ),
        parseKey: v => v.slice(1),
      },
      {
        // :"name" placeholders
        regex: regexFactory.createPlaceholderRegex(
          cfg.quotedPlaceholderTypes ?? [],
          regexFactory.createQuotePattern(cfg.identifierTypes)
        ),
        parseKey: v =>
          this.getEscapedPlaceholderKey({ key: v.slice(2, -1), quoteChar: v.slice(-1) }),
      },
      {
        // :1, :2, :3 placeholders
        regex: regexFactory.createPlaceholderRegex(cfg.numberedPlaceholderTypes ?? [], '[0-9]+'),
        parseKey: v => v.slice(1),
      },
      {
        // ? placeholders
        regex: cfg.positionalPlaceholders ? /^(\?)/ : undefined,
        parseKey: v => v.slice(1),
      },
    ]);
  }

  private excludePatternsWithoutRegexes(
    patterns: { regex?: RegExp; parseKey: (s: string) => string }[]
  ) {
    return patterns.filter((p): p is PlaceholderPattern => p.regex !== undefined);
  }

  /**
   * Takes a SQL string and breaks it into tokens.
   * Each token is an object with type and value.
   *
   * @param {string} input - The SQL string
   * @returns {Token[]} output token stream
   */
  public tokenize(input: string): Token[] {
    const tokens: Token[] = [];
    let token: Token | undefined;

    // Keep processing the string until it is empty
    while (input.length) {
      // grab any preceding whitespace
      const whitespaceBefore = this.getWhitespace(input);
      input = input.substring(whitespaceBefore.length);

      if (input.length) {
        // Get the next token and the token type
        token = this.getNextToken(input, token);
        if (!token) {
          throw new Error(`Parse error: Unexpected "${input.slice(0, 100)}"`);
        }
        // Advance the string
        input = input.substring(token.text.length);

        tokens.push({ ...token, whitespaceBefore });
      }
    }
    return this.preprocess(tokens);
  }

  /** Matches preceding whitespace if present */
  private getWhitespace(input: string): string {
    const matches = input.match(WHITESPACE_REGEX);
    return matches ? matches[1] : '';
  }

  /** Attempts to match next token from input string, tests RegExp patterns in decreasing priority */
  private getNextToken(input: string, previousToken?: Token): Token | undefined {
    return (
      this.matchToken(TokenType.LINE_COMMENT, input) ||
      this.matchToken(TokenType.BLOCK_COMMENT, input) ||
      this.matchToken(TokenType.STRING, input) ||
      this.matchQuotedIdentToken(input) ||
      this.matchToken(TokenType.BLOCK_START, input) ||
      this.matchToken(TokenType.BLOCK_END, input) ||
      this.matchPlaceholderToken(input) ||
      this.matchToken(TokenType.NUMBER, input) ||
      this.matchReservedWordToken(input, previousToken) ||
      this.matchToken(TokenType.IDENT, input) ||
      this.matchToken(TokenType.OPERATOR, input)
    );
  }

  /**
   * Attempts to match a placeholder token pattern
   * @return {Token | undefined} - The placeholder token if found, otherwise undefined
   */
  private matchPlaceholderToken(input: string): Token | undefined {
    for (const { regex, parseKey } of this.placeholderPatterns) {
      const token = this.match({
        input,
        regex,
        type: TokenType.PLACEHOLDER,
        transform: id,
      });
      if (token) {
        return { ...token, key: parseKey(token.value) };
      }
    }
    return undefined;
  }

  private getEscapedPlaceholderKey({ key, quoteChar }: { key: string; quoteChar: string }): string {
    return key.replace(new RegExp(escapeRegExp('\\' + quoteChar), 'gu'), quoteChar);
  }

  private matchQuotedIdentToken(input: string): Token | undefined {
    return this.match({
      input,
      regex: this.quotedIdentRegex,
      type: TokenType.IDENT,
      transform: id,
    });
  }

  /**
   * Attempts to match a Reserved word token pattern, avoiding edge cases of Reserved words within string tokens
   * @return {Token | undefined} - The Reserved word token if found, otherwise undefined
   */
  private matchReservedWordToken(input: string, previousToken?: Token): Token | undefined {
    // A reserved word cannot be preceded by a '.'
    // this makes it so in "mytable.from", "from" is not considered a reserved word
    if (previousToken?.value === '.') {
      return undefined;
    }

    // prioritised list of Reserved token types
    return (
      this.matchReservedToken(TokenType.RESERVED_CASE_START, input) ||
      this.matchReservedToken(TokenType.RESERVED_CASE_END, input) ||
      this.matchReservedToken(TokenType.RESERVED_COMMAND, input) ||
      this.matchReservedToken(TokenType.RESERVED_BINARY_COMMAND, input) ||
      this.matchReservedToken(TokenType.RESERVED_DEPENDENT_CLAUSE, input) ||
      this.matchReservedToken(TokenType.RESERVED_LOGICAL_OPERATOR, input) ||
      this.matchReservedToken(TokenType.RESERVED_KEYWORD, input) ||
      this.matchReservedToken(TokenType.RESERVED_JOIN_CONDITION, input)
    );
  }

  // Helper for matching RESERVED_* tokens which need to be transformed to canonical form
  private matchReservedToken(tokenType: TokenType, input: string): Token | undefined {
    return this.match({
      input,
      type: tokenType,
      regex: this.REGEX_MAP[tokenType],
      transform: toCanonicalKeyword,
    });
  }

  // Shorthand for `match` that looks up regex from REGEX_MAP
  private matchToken(tokenType: TokenType, input: string): Token | undefined {
    return this.match({
      input,
      type: tokenType,
      regex: this.REGEX_MAP[tokenType],
      transform: id,
    });
  }

  /**
   * Attempts to match RegExp from head of input, returning undefined if not found
   * @param {string} _.input - The string to match
   * @param {TokenType} _.type - The type of token to match against
   * @param {RegExp} _.regex - The regex to match
   * @return {Token | undefined} - The matched token if found, otherwise undefined
   */
  private match({
    input,
    type,
    regex,
    transform,
  }: {
    input: string;
    type: TokenType;
    regex: RegExp;
    transform: (s: string) => string;
  }): Token | undefined {
    const matches = input.match(regex);
    if (matches) {
      return {
        type,
        text: matches[1],
        value: transform(matches[1]),
      };
    }
    return undefined;
  }
}
