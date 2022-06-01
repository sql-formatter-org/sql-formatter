import { EOF_TOKEN, type Token, TokenType } from './token';
/* eslint-disable no-cond-assign */

export type Statement = {
  type: 'statement';
  tokens: Token[];
};

/**
 * A rudimentary parser that slices token stream into list of SQL statements.
 */
export default class Parser {
  private index = 0;

  constructor(private tokens: Token[]) {}

  public parse(): Statement[] {
    const statements: Statement[] = [];
    let stat: Statement | undefined;
    while ((stat = this.statement())) {
      statements.push(stat);
    }
    return statements;
  }

  private statement(): Statement | undefined {
    const tokens: Token[] = [];
    while (true) {
      if (this.look().value === ';') {
        tokens.push(this.next());
        return { type: 'statement', tokens };
      } else if (this.look().type === TokenType.EOF) {
        if (tokens.length > 0) {
          return { type: 'statement', tokens };
        } else {
          return undefined;
        }
      } else {
        tokens.push(this.next());
      }
    }
  }

  // Returns current token without advancing the pointer
  private look(): Token {
    return this.tokens[this.index] || EOF_TOKEN;
  }

  // Returns current token and advances the pointer to next token
  private next(): Token {
    return this.tokens[this.index++] || EOF_TOKEN;
  }
}
