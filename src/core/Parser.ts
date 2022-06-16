import { EOF_TOKEN, type Token, TokenType } from './token';
/* eslint-disable no-cond-assign */

export type Statement = {
  type: 'statement';
  children: AstNode[];
};

// Wrapper for plain nodes inside AST
export type TokenNode = {
  type: 'token';
  token: Token;
};

export type ParenthesizedExpr = {
  type: 'parenthesized_expr';
  children: AstNode[];
};

export type AstNode = ParenthesizedExpr | TokenNode;

export const isTokenNode = (node: AstNode): node is TokenNode => node.type === 'token';

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
    const tokens: TokenNode[] = [];
    while (true) {
      if (this.look().value === ';') {
        tokens.push({ type: 'token', token: this.next() });
        return { type: 'statement', children: tokens };
      } else if (this.look().type === TokenType.EOF) {
        if (tokens.length > 0) {
          return { type: 'statement', children: tokens };
        } else {
          return undefined;
        }
      } else {
        tokens.push({ type: 'token', token: this.next() });
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
