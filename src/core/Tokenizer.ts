import { equalizeWhitespace, escapeRegExp, id } from 'src/utils';

import * as regexFactory from './regexFactory';
import { type Token, TokenType } from './token';

// A note about regular expressions
//
// We're using a sticky flag "y" in all tokenizing regexes.
// This works a bit like ^, anchoring the regex to the start,
// but when ^ anchores the regex to the start of string (or line),
// the sticky flag anchors it to search start position, which we
// can change by setting RegExp.lastIndex.
//
// This allows us to avoid slicing off tokens from the start of input string
// (which we used in the past) and just move the match start position forward,
// which is much more performant on long strings.

const WHITESPACE_REGEX = /(\s+)/uy;
const NULL_REGEX = /(?!)/uy; // zero-width negative lookahead, matches nothing

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
  identTypes: regexFactory.QuoteType[];
  // Types of quotes to use for variables
  variableTypes?: regexFactory.VariableType[];
  // Open-parenthesis characters, like: (, [, {
  openParens?: string[];
  // Close-parenthesis characters, like: ), ], }
  closeParens?: string[];
  // True to allow for positional "?" parameter placeholders
  positionalParams?: boolean;
  // Prefixes for numbered parameter placeholders to support, e.g. :1, :2, :3
  numberedParamTypes?: ('?' | ':' | '$')[];
  // Prefixes for named parameter placeholders to support, e.g. :name
  namedParamTypes?: (':' | '@' | '$')[];
  // Prefixes for quoted parameter placeholders to support, e.g. :"name"
  // The type of quotes will depend on `identifierTypes` option.
  quotedParamTypes?: (':' | '@' | '$')[];
  // Line comment types to support, defaults to --
  lineCommentTypes?: string[];
  // Additional characters to support in identifiers
  identChars?: regexFactory.IdentChars;
  // Additional characters to support in named parameters
  // Use this when parameters allow different characters from identifiers
  // Defaults to `identChars`.
  paramChars?: regexFactory.IdentChars;
  // Additional multi-character operators to support, in addition to <=, >=, <>, !=
  operators?: string[];
  // Allows custom modifications on the token array.
  // Called after the whole input string has been split into tokens.
  // The result of this will be the output of the tokenizer.
  preprocess?: (tokens: Token[]) => Token[];
}

interface ParamPattern {
  regex: RegExp;
  parseKey: (s: string) => string;
}

/** Converts SQL language string into a token stream */
export default class Tokenizer {
  private REGEX_MAP: Record<TokenType, RegExp>;
  private quotedIdentRegex: RegExp;
  private paramPatterns: ParamPattern[];
  // The input SQL string to process
  private input = '';
  // Current position in string
  private index = 0;

  private preprocess = (tokens: Token[]) => tokens;

  constructor(cfg: TokenizerOptions) {
    if (cfg.preprocess) {
      this.preprocess = cfg.preprocess;
    }

    this.quotedIdentRegex = regexFactory.createQuoteRegex(cfg.identTypes);

    this.REGEX_MAP = {
      [TokenType.IDENT]: regexFactory.createIdentRegex(cfg.identChars),
      [TokenType.STRING]: regexFactory.createQuoteRegex(cfg.stringTypes),
      [TokenType.VARIABLE]: cfg.variableTypes
        ? regexFactory.createVariableRegex(cfg.variableTypes)
        : NULL_REGEX,
      [TokenType.RESERVED_KEYWORD]: regexFactory.createReservedWordRegex(
        cfg.reservedKeywords,
        cfg.identChars
      ),
      [TokenType.RESERVED_DEPENDENT_CLAUSE]: regexFactory.createReservedWordRegex(
        cfg.reservedDependentClauses ?? [],
        cfg.identChars
      ),
      [TokenType.RESERVED_LOGICAL_OPERATOR]: regexFactory.createReservedWordRegex(
        cfg.reservedLogicalOperators ?? ['AND', 'OR'],
        cfg.identChars
      ),
      [TokenType.RESERVED_COMMAND]: regexFactory.createReservedWordRegex(
        cfg.reservedCommands,
        cfg.identChars
      ),
      [TokenType.RESERVED_BINARY_COMMAND]: regexFactory.createReservedWordRegex(
        cfg.reservedBinaryCommands,
        cfg.identChars
      ),
      [TokenType.RESERVED_JOIN_CONDITION]: regexFactory.createReservedWordRegex(
        cfg.reservedJoinConditions ?? ['ON', 'USING'],
        cfg.identChars
      ),
      [TokenType.OPERATOR]: regexFactory.createOperatorRegex('+-/*%&|^><=.,;[]{}`:$@', [
        '<>',
        '<=',
        '>=',
        '!=',
        ...(cfg.operators ?? []),
      ]),
      [TokenType.OPEN_PAREN]: regexFactory.createParenRegex(cfg.openParens ?? ['(']),
      [TokenType.CLOSE_PAREN]: regexFactory.createParenRegex(cfg.closeParens ?? [')']),
      [TokenType.RESERVED_CASE_START]: /(CASE)\b/iuy,
      [TokenType.RESERVED_CASE_END]: /(END)\b/iuy,
      [TokenType.LINE_COMMENT]: regexFactory.createLineCommentRegex(cfg.lineCommentTypes ?? ['--']),
      [TokenType.BLOCK_COMMENT]: /(\/\*[^]*?(?:\*\/|$))/uy,
      [TokenType.NUMBER]:
        /(0x[0-9a-fA-F]+|0b[01]+|(-\s*)?[0-9]+(\.[0-9]*)?([eE][-+]?[0-9]+(\.[0-9]+)?)?)/uy,
      [TokenType.PARAMETER]: NULL_REGEX, // matches nothing
      [TokenType.EOF]: NULL_REGEX, // matches nothing
    };

    this.paramPatterns = this.excludePatternsWithoutRegexes([
      {
        // :name placeholders
        regex: regexFactory.createParameterRegex(
          cfg.namedParamTypes ?? [],
          regexFactory.createIdentPattern(cfg.paramChars || cfg.identChars)
        ),
        parseKey: v => v.slice(1),
      },
      {
        // :"name" placeholders
        regex: regexFactory.createParameterRegex(
          cfg.quotedParamTypes ?? [],
          regexFactory.createQuotePattern(cfg.identTypes)
        ),
        parseKey: v =>
          this.getEscapedPlaceholderKey({ key: v.slice(2, -1), quoteChar: v.slice(-1) }),
      },
      {
        // :1, :2, :3 placeholders
        regex: regexFactory.createParameterRegex(cfg.numberedParamTypes ?? [], '[0-9]+'),
        parseKey: v => v.slice(1),
      },
      {
        // ? placeholders
        regex: cfg.positionalParams ? /(\?)/uy : undefined,
        parseKey: v => v.slice(1),
      },
    ]);
  }

  private excludePatternsWithoutRegexes(
    patterns: { regex?: RegExp; parseKey: (s: string) => string }[]
  ) {
    return patterns.filter((p): p is ParamPattern => p.regex !== undefined);
  }

  /**
   * Takes a SQL string and breaks it into tokens.
   * Each token is an object with type and value.
   *
   * @param {string} input - The SQL string
   * @returns {Token[]} output token stream
   */
  public tokenize(input: string): Token[] {
    this.input = input;
    this.index = 0;
    const tokens: Token[] = [];
    let token: Token | undefined;

    // Keep processing the string until end is reached
    while (this.index < this.input.length) {
      // grab any preceding whitespace
      const whitespaceBefore = this.getWhitespace();

      if (this.index < this.input.length) {
        // Get the next token and the token type
        token = this.getNextToken(token);
        if (!token) {
          throw new Error(`Parse error: Unexpected "${input.slice(this.index, 100)}"`);
        }

        tokens.push({ ...token, whitespaceBefore });
      }
    }
    return this.preprocess(tokens);
  }

  private getWhitespace(): string {
    WHITESPACE_REGEX.lastIndex = this.index;
    const matches = this.input.match(WHITESPACE_REGEX);
    if (matches) {
      // Advance current position by matched whitespace length
      this.index += matches[1].length;
      return matches[1];
    } else {
      return '';
    }
  }

  private getNextToken(previousToken?: Token): Token | undefined {
    return (
      this.matchToken(TokenType.LINE_COMMENT) ||
      this.matchToken(TokenType.BLOCK_COMMENT) ||
      this.matchToken(TokenType.STRING) ||
      this.matchQuotedIdentToken() ||
      this.matchToken(TokenType.VARIABLE) ||
      this.matchToken(TokenType.OPEN_PAREN) ||
      this.matchToken(TokenType.CLOSE_PAREN) ||
      this.matchPlaceholderToken() ||
      this.matchToken(TokenType.NUMBER) ||
      this.matchReservedWordToken(previousToken) ||
      this.matchToken(TokenType.IDENT) ||
      this.matchToken(TokenType.OPERATOR)
    );
  }

  private matchPlaceholderToken(): Token | undefined {
    for (const { regex, parseKey } of this.paramPatterns) {
      const token = this.match({
        regex,
        type: TokenType.PARAMETER,
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

  private matchQuotedIdentToken(): Token | undefined {
    return this.match({
      regex: this.quotedIdentRegex,
      type: TokenType.IDENT,
      transform: id,
    });
  }

  private matchReservedWordToken(previousToken?: Token): Token | undefined {
    // A reserved word cannot be preceded by a '.'
    // this makes it so in "mytable.from", "from" is not considered a reserved word
    if (previousToken?.value === '.') {
      return undefined;
    }

    // prioritised list of Reserved token types
    return (
      this.matchReservedToken(TokenType.RESERVED_CASE_START) ||
      this.matchReservedToken(TokenType.RESERVED_CASE_END) ||
      this.matchReservedToken(TokenType.RESERVED_COMMAND) ||
      this.matchReservedToken(TokenType.RESERVED_BINARY_COMMAND) ||
      this.matchReservedToken(TokenType.RESERVED_DEPENDENT_CLAUSE) ||
      this.matchReservedToken(TokenType.RESERVED_LOGICAL_OPERATOR) ||
      this.matchReservedToken(TokenType.RESERVED_KEYWORD) ||
      this.matchReservedToken(TokenType.RESERVED_JOIN_CONDITION)
    );
  }

  // Helper for matching RESERVED_* tokens which need to be transformed to canonical form
  private matchReservedToken(tokenType: TokenType): Token | undefined {
    return this.match({
      type: tokenType,
      regex: this.REGEX_MAP[tokenType],
      transform: toCanonicalKeyword,
    });
  }

  // Shorthand for `match` that looks up regex from REGEX_MAP
  private matchToken(tokenType: TokenType): Token | undefined {
    return this.match({
      type: tokenType,
      regex: this.REGEX_MAP[tokenType],
      transform: id,
    });
  }

  // Attempts to match RegExp at current position in input
  private match({
    type,
    regex,
    transform,
  }: {
    type: TokenType;
    regex: RegExp;
    transform: (s: string) => string;
  }): Token | undefined {
    regex.lastIndex = this.index;
    const matches = this.input.match(regex);
    if (matches) {
      // Advance current position by matched token length
      this.index += matches[1].length;
      return {
        type,
        text: matches[1],
        value: transform(matches[1]),
      };
    }
    return undefined;
  }
}
