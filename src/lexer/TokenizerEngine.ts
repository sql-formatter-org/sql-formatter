import { Token, TokenType } from './token.js';
import { lineColFromIndex } from './lineColFromIndex.js';
import { WHITESPACE_REGEX } from './regexUtil.js';

export interface RegExpLike {
  lastIndex: number;
  exec(input: string): string[] | null;
}

export interface TokenRule {
  type: TokenType;
  // Normally a RegExp object.
  // But to allow for more complex matching logic,
  // an object can be given that implements a RegExpLike interface.
  regex: RegExpLike;
  // Called with the raw string that was matched
  text?: (rawText: string) => string;
  key?: (rawText: string) => string;
}

export default class TokenizerEngine {
  private input = ''; // The input SQL string to process
  private index = 0; // Current position in string

  constructor(private rules: TokenRule[], private dialectName: string) {}

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
      const precedingWhitespace = this.getWhitespace();

      if (this.index < this.input.length) {
        // Get the next token and the token type
        token = this.getNextToken();
        if (!token) {
          throw this.createParseError();
        }

        tokens.push({ ...token, precedingWhitespace });
      }
    }
    return tokens;
  }

  private createParseError(): Error {
    const text = this.input.slice(this.index, this.index + 10);
    const { line, col } = lineColFromIndex(this.input, this.index);
    return new Error(
      `Parse error: Unexpected "${text}" at line ${line} column ${col}.\n${this.dialectInfo()}`
    );
  }

  private dialectInfo(): string {
    if (this.dialectName === 'sql') {
      return (
        `This likely happens because you're using the default "sql" dialect.\n` +
        `If possible, please select a more specific dialect (like sqlite, postgresql, etc).`
      );
    } else {
      return `SQL dialect used: "${this.dialectName}".`;
    }
  }

  private getWhitespace(): string | undefined {
    WHITESPACE_REGEX.lastIndex = this.index;

    const matches = WHITESPACE_REGEX.exec(this.input);
    if (matches) {
      // Advance current position by matched whitespace length
      this.index += matches[0].length;
      return matches[0];
    }
    return undefined;
  }

  private getNextToken(): Token | undefined {
    for (const rule of this.rules) {
      const token = this.match(rule);
      if (token) {
        return token;
      }
    }
    return undefined;
  }

  // Attempts to match token rule regex at current position in input
  private match(rule: TokenRule): Token | undefined {
    rule.regex.lastIndex = this.index;
    const matches = rule.regex.exec(this.input);
    if (matches) {
      const matchedText = matches[0];

      const token: Token = {
        type: rule.type,
        raw: matchedText,
        text: rule.text ? rule.text(matchedText) : matchedText,
        start: this.index,
      };

      if (rule.key) {
        token.key = rule.key(matchedText);
      }

      // Advance current position by matched token length
      this.index += matchedText.length;
      return token;
    }
    return undefined;
  }
}
