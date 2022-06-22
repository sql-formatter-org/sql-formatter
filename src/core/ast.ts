import { Token } from './token';

export type Statement = {
  type: 'statement';
  children: AstNode[];
};

// Wrapper for plain nodes inside AST
export type TokenNode = {
  type: 'token';
  token: Token;
};

export type Parenthesis = {
  type: 'parenthesis';
  children: AstNode[];
  openParen: string;
  closeParen: string;
  hasWhitespaceBefore: boolean;
};

// BETWEEN <expr1> AND <expr2>
export type BetweenPredicate = {
  type: 'between_predicate';
  betweenToken: Token;
  expr1: Token;
  andToken: Token;
  expr2: Token;
};

// LIMIT <count>
// LIMIT <offset>, <count>
export type LimitClause = {
  type: 'limit_clause';
  limitToken: Token;
  countToken: Token;
  offsetToken?: Token;
};

export type AstNode = Parenthesis | BetweenPredicate | LimitClause | TokenNode;

export const isTokenNode = (node: AstNode): node is TokenNode => node.type === 'token';
