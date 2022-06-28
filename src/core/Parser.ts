/* eslint-disable no-cond-assign */
import {
  AllColumnsAsterisk,
  ArraySubscript,
  AstNode,
  BetweenPredicate,
  BinaryClause,
  Clause,
  FunctionCall,
  LimitClause,
  Parenthesis,
  Statement,
  TokenNode,
} from './ast';
import { EOF_TOKEN, type Token, TokenType, isToken } from './token';

/**
 * A rudimentary parser that slices token stream into list of SQL statements
 * and groups of parenthesis.
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
    const children: AstNode[] = [];
    while (true) {
      if (this.look().value === ';') {
        children.push(this.nextTokenNode());
        return { type: 'statement', children };
      } else if (this.look().type === TokenType.EOF) {
        if (children.length > 0) {
          return { type: 'statement', children };
        } else {
          return undefined;
        }
      } else {
        children.push(this.expression());
      }
    }
  }

  private expression(): AstNode {
    return (
      this.limitClause() ||
      this.clause() ||
      this.binaryClause() ||
      this.functionCall() ||
      this.arraySubscript() ||
      this.parenthesis() ||
      this.betweenPredicate() ||
      this.allColumnsAsterisk() ||
      this.nextTokenNode()
    );
  }

  private clause(): Clause | undefined {
    if (this.look().type === TokenType.RESERVED_COMMAND) {
      const name = this.next();
      const children: AstNode[] = [];
      while (
        this.look().type !== TokenType.RESERVED_COMMAND &&
        this.look().type !== TokenType.RESERVED_BINARY_COMMAND &&
        this.look().type !== TokenType.EOF &&
        this.look().type !== TokenType.CLOSE_PAREN &&
        this.look().value !== ';'
      ) {
        children.push(this.expression());
      }
      return { type: 'clause', nameToken: name, children };
    }
    return undefined;
  }

  private binaryClause(): BinaryClause | undefined {
    if (this.look().type === TokenType.RESERVED_BINARY_COMMAND) {
      const name = this.next();
      const children: AstNode[] = [];
      while (
        this.look().type !== TokenType.RESERVED_COMMAND &&
        this.look().type !== TokenType.RESERVED_BINARY_COMMAND &&
        this.look().type !== TokenType.EOF &&
        this.look().type !== TokenType.CLOSE_PAREN &&
        this.look().value !== ';'
      ) {
        children.push(this.expression());
      }
      return { type: 'binary_clause', nameToken: name, children };
    }
    return undefined;
  }

  private functionCall(): FunctionCall | undefined {
    if (
      (this.look().type === TokenType.RESERVED_KEYWORD || this.look().type === TokenType.IDENT) &&
      this.look(1).value === '(' &&
      !this.look(1).whitespaceBefore
    ) {
      return {
        type: 'function_call',
        nameToken: this.next(),
        parenthesis: this.parenthesis() as Parenthesis,
      };
    }
    return undefined;
  }

  private arraySubscript(): ArraySubscript | undefined {
    if (
      (this.look().type === TokenType.RESERVED_KEYWORD || this.look().type === TokenType.IDENT) &&
      this.look(1).value === '['
    ) {
      return {
        type: 'array_subscript',
        arrayToken: this.next(),
        parenthesis: this.parenthesis() as Parenthesis,
      };
    }
    return undefined;
  }

  private parenthesis(): Parenthesis | undefined {
    if (this.look().type === TokenType.OPEN_PAREN) {
      const children: AstNode[] = [];
      const token = this.next();
      const openParen = token.value;
      let closeParen = '';
      while (this.look().type !== TokenType.CLOSE_PAREN && this.look().type !== TokenType.EOF) {
        children.push(this.expression());
      }
      if (this.look().type === TokenType.CLOSE_PAREN) {
        closeParen = this.next().value;
      }
      return { type: 'parenthesis', children, openParen, closeParen };
    }
    return undefined;
  }

  private betweenPredicate(): BetweenPredicate | undefined {
    if (isToken.BETWEEN(this.look()) && isToken.AND(this.look(2))) {
      return {
        type: 'between_predicate',
        betweenToken: this.next(),
        expr1: this.next(),
        andToken: this.next(),
        expr2: this.next(),
      };
    }
    return undefined;
  }

  private limitClause(): LimitClause | undefined {
    if (isToken.LIMIT(this.look()) && this.look(2).value === ',') {
      return {
        type: 'limit_clause',
        limitToken: this.next(),
        offsetToken: this.next(),
        countToken: this.next() && this.next(), // Discard comma token
      };
    }
    if (isToken.LIMIT(this.look())) {
      return {
        type: 'limit_clause',
        limitToken: this.next(),
        countToken: this.next(),
      };
    }
    return undefined;
  }

  private allColumnsAsterisk(): AllColumnsAsterisk | undefined {
    if (this.look().value === '*' && isToken.SELECT(this.look(-1))) {
      this.next();
      return { type: 'all_columns_asterisk' };
    }
    return undefined;
  }

  // Returns current token without advancing the pointer
  private look(ahead = 0): Token {
    return this.tokens[this.index + ahead] || EOF_TOKEN;
  }

  // Returns current token and advances the pointer to next token
  private next(): Token {
    return this.tokens[this.index++] || EOF_TOKEN;
  }

  private nextTokenNode(): TokenNode {
    return { type: 'token', token: this.next() };
  }
}
