import { Token, TokenType } from 'src/lexer/token';
import { WHITESPACE_REGEX } from './regexUtil';

export interface TokenRule {
  regex: RegExp;
  key?: (token: string) => string;
  value?: (token: string) => string;
}

export default class TokenizerEngine {
  private rules: Partial<Record<TokenType, TokenRule>>;

  // The input SQL string to process
  private input = '';
  // Current position in string
  private index = 0;

  constructor(rules: Partial<Record<TokenType, TokenRule>>) {
    this.rules = rules;
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
      // skip any preceding whitespace
      this.skipWhitespace();

      if (this.index < this.input.length) {
        // Get the next token and the token type
        token = this.getNextToken(token);
        if (!token) {
          throw new Error(`Parse error: Unexpected "${input.slice(this.index, 100)}"`);
        }

        tokens.push(token);
      }
    }
    return tokens;
  }

  private skipWhitespace(): void {
    WHITESPACE_REGEX.lastIndex = this.index;
    const matches = WHITESPACE_REGEX.exec(this.input);
    if (matches) {
      // Advance current position by matched whitespace length
      this.index += matches[0].length;
    }
  }

  private getNextToken(previousToken?: Token): Token | undefined {
    return (
      this.matchToken(TokenType.BLOCK_COMMENT) ||
      this.matchToken(TokenType.LINE_COMMENT) ||
      this.matchToken(TokenType.COMMA) ||
      this.matchToken(TokenType.OPEN_PAREN) ||
      this.matchToken(TokenType.CLOSE_PAREN) ||
      this.matchToken(TokenType.QUOTED_IDENTIFIER) ||
      this.matchToken(TokenType.NUMBER) ||
      this.matchReservedWordToken(previousToken) ||
      this.matchPlaceholderToken(TokenType.NAMED_PARAMETER) ||
      this.matchPlaceholderToken(TokenType.QUOTED_PARAMETER) ||
      this.matchPlaceholderToken(TokenType.INDEXED_PARAMETER) ||
      this.matchPlaceholderToken(TokenType.POSITIONAL_PARAMETER) ||
      this.matchToken(TokenType.VARIABLE) ||
      this.matchToken(TokenType.STRING) ||
      this.matchToken(TokenType.IDENTIFIER) ||
      this.matchToken(TokenType.DELIMITER) ||
      this.matchToken(TokenType.OPERATOR)
    );
  }

  private matchPlaceholderToken(tokenType: TokenType): Token | undefined {
    if (tokenType in this.rules) {
      const token = this.matchToken(tokenType);
      const tokenRule = this.rules[tokenType];
      if (token) {
        if (tokenRule?.key) {
          return { ...token, key: tokenRule.key(token.value) };
        }
        return token; // POSITIONAL_PARAMETER does not have a key transform function
      }
    }
    return undefined;
  }

  private matchReservedWordToken(previousToken?: Token): Token | undefined {
    // A reserved word cannot be preceded by a '.'
    // this makes it so in "mytable.from", "from" is not considered a reserved word
    if (previousToken?.value === '.') {
      return undefined;
    }

    // prioritised list of Reserved token types
    return (
      this.matchToken(TokenType.RESERVED_CASE_START) ||
      this.matchToken(TokenType.RESERVED_CASE_END) ||
      this.matchToken(TokenType.RESERVED_COMMAND) ||
      this.matchToken(TokenType.RESERVED_SET_OPERATION) ||
      this.matchToken(TokenType.RESERVED_DEPENDENT_CLAUSE) ||
      this.matchToken(TokenType.RESERVED_JOIN) ||
      this.matchToken(TokenType.RESERVED_PHRASE) ||
      this.matchToken(TokenType.RESERVED_LOGICAL_OPERATOR) ||
      this.matchToken(TokenType.RESERVED_FUNCTION_NAME) ||
      this.matchToken(TokenType.RESERVED_KEYWORD)
    );
  }

  // Shorthand for `match` that looks up regex from rules
  private matchToken(tokenType: TokenType): Token | undefined {
    const rule = this.rules[tokenType];
    if (!rule) {
      return undefined;
    }
    return this.match({
      type: tokenType,
      regex: rule.regex,
      transform: rule.value,
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
    transform?: (s: string) => string;
  }): Token | undefined {
    regex.lastIndex = this.index;
    const matches = regex.exec(this.input);
    if (matches) {
      const matchedToken = matches[0];

      // Advance current position by matched token length
      this.index += matchedToken.length;
      return {
        type,
        text: matchedToken,
        value: transform ? transform(matchedToken) : matchedToken,
      };
    }
    return undefined;
  }
}
