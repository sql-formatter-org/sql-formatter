import * as regexFactory from './regexFactory';
import { escapeRegExp } from '../utils';
import { Token, TokenType } from './token'; // convert to partial type import in TS 4.5

export const WHITESPACE_REGEX = /^(\s+)/u;
const NULL_REGEX = /(?!)/; // zero-width negative lookahead, matches nothing

/** Struct that defines how a SQL language can be broken into tokens */
interface TokenizerOptions {
  reservedKeywords: string[];
  reservedCommands: string[];
  reservedLogicalOperators: string[];
  reservedDependentClauses: string[];
  reservedBinaryCommands: string[];
  reservedJoinConditions: string[];
  stringTypes: regexFactory.StringPatternType[];
  blockStart: string[];
  blockEnd: string[];
  supportsCase?: boolean;
  indexedPlaceholderTypes?: string[];
  namedPlaceholderTypes: string[];
  lineCommentTypes: string[];
  specialWordChars?: { prefix?: string; any?: string; suffix?: string };
  operators?: string[];
  preprocess?: (tokens: Token[]) => Token[];
}

/** Converts SQL language string into a token stream */
export default class Tokenizer {
  REGEX_MAP: { [tokenType in TokenType]: RegExp };

  INDEXED_PLACEHOLDER_REGEX?: RegExp;
  IDENT_NAMED_PLACEHOLDER_REGEX?: RegExp;
  STRING_NAMED_PLACEHOLDER_REGEX?: RegExp;

  private preprocess = (tokens: Token[]) => tokens;

  /**
   * @param {TokenizerOptions} cfg
   *  @param {string[]} cfg.reservedKeywords - Reserved words in SQL
   *  @param {string[]} cfg.reservedDependentClauses - Words that following a specific Statement and must have data attached
   *  @param {string[]} cfg.reservedLogicalOperators - Words that are set to newline
   *  @param {string[]} cfg.reservedCommands - Words that are set to new line separately
   *  @param {string[]} cfg.reservedBinaryCommands - Words that are top level but have no indentation
   *  @param {string[]} cfg.reservedJoinConditions - ON and USING
   *  @param {string[]} cfg.stringTypes - string types to enable - "", '', ``, [], N''
   *  @param {string[]} cfg.blockStart - Opening parentheses to enable, like (, [
   *  @param {string[]} cfg.blockEnd - Closing parentheses to enable, like ), ]
   *  @param {boolean} cfg.supportsCase - True when the dialect supports CASE..END expressions
   *  @param {string[]} cfg.indexedPlaceholderTypes - Prefixes for indexed placeholders, like ?
   *  @param {string[]} cfg.namedPlaceholderTypes - Prefixes for named placeholders, like @ and :
   *  @param {string[]} cfg.lineCommentTypes - Line comments to enable, like # and --
   *  @param {string[]} cfg.specialWordChars - Special chars that can be found inside of words, like @ and #
   *  @param {string[]} cfg.operators - Additional operators to recognize
   *  @param {Function} cfg.preprocess - Optional function to process tokens before emitting
   */
  constructor(cfg: TokenizerOptions) {
    if (cfg.preprocess) {
      this.preprocess = cfg.preprocess;
    }

    const specialWordCharsAll = Object.values(cfg.specialWordChars ?? {}).join('');
    this.REGEX_MAP = {
      [TokenType.WORD]: regexFactory.createWordRegex(cfg.specialWordChars),
      [TokenType.STRING]: regexFactory.createStringRegex(cfg.stringTypes),
      [TokenType.RESERVED_KEYWORD]: regexFactory.createReservedWordRegex(
        cfg.reservedKeywords,
        specialWordCharsAll
      ),
      [TokenType.RESERVED_DEPENDENT_CLAUSE]: regexFactory.createReservedWordRegex(
        cfg.reservedDependentClauses ?? [],
        specialWordCharsAll
      ),
      [TokenType.RESERVED_LOGICAL_OPERATOR]: regexFactory.createReservedWordRegex(
        cfg.reservedLogicalOperators,
        specialWordCharsAll
      ),
      [TokenType.RESERVED_COMMAND]: regexFactory.createReservedWordRegex(
        cfg.reservedCommands,
        specialWordCharsAll
      ),
      [TokenType.RESERVED_BINARY_COMMAND]: regexFactory.createReservedWordRegex(
        cfg.reservedBinaryCommands,
        specialWordCharsAll
      ),
      [TokenType.RESERVED_JOIN_CONDITION]: regexFactory.createReservedWordRegex(
        cfg.reservedJoinConditions,
        specialWordCharsAll
      ),
      [TokenType.OPERATOR]: regexFactory.createOperatorRegex('+-/*%&|^><=.,;[]{}`:$@', [
        '<>',
        '<=',
        '>=',
        '!=',
        ...(cfg.operators ?? []),
      ]),
      [TokenType.BLOCK_START]: regexFactory.createParenRegex(cfg.blockStart),
      [TokenType.BLOCK_END]: regexFactory.createParenRegex(cfg.blockEnd),
      [TokenType.RESERVED_CASE_START]: cfg.supportsCase ? /^(CASE)\b/iu : NULL_REGEX,
      [TokenType.RESERVED_CASE_END]: cfg.supportsCase ? /^(END)\b/iu : NULL_REGEX,
      [TokenType.LINE_COMMENT]: regexFactory.createLineCommentRegex(cfg.lineCommentTypes),
      [TokenType.BLOCK_COMMENT]: /^(\/\*[^]*?(?:\*\/|$))/u,
      [TokenType.NUMBER]:
        /^(0x[0-9a-fA-F]+|0b[01]+|(-\s*)?[0-9]+(\.[0-9]*)?([eE][-+]?[0-9]+(\.[0-9]+)?)?)/u,
      [TokenType.PLACEHOLDER]: NULL_REGEX, // matches nothing
      [TokenType.EOF]: NULL_REGEX, // matches nothing
    };

    this.INDEXED_PLACEHOLDER_REGEX = regexFactory.createPlaceholderRegex(
      cfg.indexedPlaceholderTypes ?? [],
      '[0-9]*'
    );
    this.IDENT_NAMED_PLACEHOLDER_REGEX = regexFactory.createPlaceholderRegex(
      cfg.namedPlaceholderTypes,
      '[a-zA-Z0-9._$]+'
    );
    this.STRING_NAMED_PLACEHOLDER_REGEX = regexFactory.createPlaceholderRegex(
      cfg.namedPlaceholderTypes,
      regexFactory.createStringPattern(cfg.stringTypes)
    );
  }

  /**
   * Takes a SQL string and breaks it into tokens.
   * Each token is an object with type and value.
   *
   * @param {string} input - The SQL string
   * @returns {Token[]} output token stream
   */
  tokenize(input: string): Token[] {
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
        input = input.substring(token.value.length);

        tokens.push({ ...token, whitespaceBefore });
      }
    }
    return this.preprocess(tokens);
  }

  /** Matches preceding whitespace if present */
  getWhitespace(input: string): string {
    const matches = input.match(WHITESPACE_REGEX);
    return matches ? matches[1] : '';
  }

  /** Curried function of `getTokenOnFirstMatch` that allows token type to be passed first */
  matchToken =
    (tokenType: TokenType) =>
    (input: string): Token | undefined =>
      this.getTokenOnFirstMatch({
        input,
        type: tokenType,
        regex: this.REGEX_MAP[tokenType],
      });

  /** Attempts to match next token from input string, tests RegExp patterns in decreasing priority */
  getNextToken(input: string, previousToken?: Token): Token | undefined {
    return (
      this.matchToken(TokenType.LINE_COMMENT)(input) ||
      this.matchToken(TokenType.BLOCK_COMMENT)(input) ||
      this.matchToken(TokenType.STRING)(input) ||
      this.matchToken(TokenType.BLOCK_START)(input) ||
      this.matchToken(TokenType.BLOCK_END)(input) ||
      this.getPlaceholderToken(input) ||
      this.matchToken(TokenType.NUMBER)(input) ||
      this.getReservedWordToken(input, previousToken) ||
      this.matchToken(TokenType.WORD)(input) ||
      this.matchToken(TokenType.OPERATOR)(input)
    );
  }

  /**
   * Attempts to match a placeholder token pattern
   * @return {Token | undefined} - The placeholder token if found, otherwise undefined
   */
  getPlaceholderToken(input: string): Token | undefined {
    const placeholderTokenRegexMap: { regex: RegExp; parseKey: (s: string) => string }[] = [
      // pattern for placeholder with identifier name
      {
        regex: this.IDENT_NAMED_PLACEHOLDER_REGEX ?? NULL_REGEX,
        parseKey: v => v.slice(1),
      },
      // pattern for placeholder with string name
      {
        regex: this.STRING_NAMED_PLACEHOLDER_REGEX ?? NULL_REGEX,
        parseKey: v =>
          this.getEscapedPlaceholderKey({ key: v.slice(2, -1), quoteChar: v.slice(-1) }),
      },
      // pattern for placeholder with numeric index
      {
        regex: this.INDEXED_PLACEHOLDER_REGEX ?? NULL_REGEX,
        parseKey: v => v.slice(1),
      },
    ];

    return placeholderTokenRegexMap.reduce((acc, { regex, parseKey }) => {
      const token = this.getTokenOnFirstMatch({ input, regex, type: TokenType.PLACEHOLDER });
      return token ? { ...token, key: parseKey(token.value) } : acc;
    }, undefined as Token | undefined);
  }

  getEscapedPlaceholderKey({ key, quoteChar }: { key: string; quoteChar: string }): string {
    return key.replace(new RegExp(escapeRegExp('\\' + quoteChar), 'gu'), quoteChar);
  }

  /**
   * Attempts to match a Reserved word token pattern, avoiding edge cases of Reserved words within string tokens
   * @return {Token | undefined} - The Reserved word token if found, otherwise undefined
   */
  getReservedWordToken(input: string, previousToken?: Token): Token | undefined {
    // A reserved word cannot be preceded by a '.'
    // this makes it so in "mytable.from", "from" is not considered a reserved word
    if (previousToken?.value === '.') {
      return undefined;
    }

    // prioritised list of Reserved token types
    const reservedTokenList = [
      TokenType.RESERVED_CASE_START,
      TokenType.RESERVED_CASE_END,
      TokenType.RESERVED_COMMAND,
      TokenType.RESERVED_BINARY_COMMAND,
      TokenType.RESERVED_DEPENDENT_CLAUSE,
      TokenType.RESERVED_LOGICAL_OPERATOR,
      TokenType.RESERVED_KEYWORD,
      TokenType.RESERVED_JOIN_CONDITION,
    ];

    return reservedTokenList.reduce(
      (matchedToken, tokenType) => matchedToken || this.matchToken(tokenType)(input),
      undefined as Token | undefined
    );
  }

  /**
   * Attempts to match RegExp from head of input, returning undefined if not found
   * @param {string} _.input - The string to match
   * @param {TokenType} _.type - The type of token to match against
   * @param {RegExp} _.regex - The regex to match
   * @return {Token | undefined} - The matched token if found, otherwise undefined
   */
  getTokenOnFirstMatch({
    input,
    type,
    regex,
  }: {
    input: string;
    type: TokenType;
    regex: RegExp;
  }): Token | undefined {
    const matches = input.match(regex);
    return matches ? ({ type, value: matches[1] } as Token) : undefined;
  }
}
