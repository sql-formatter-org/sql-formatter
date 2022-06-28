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

export type BetweenPredicate = {
  type: 'between_predicate';
  betweenToken: Token;
  expr1: Token;
  andToken: Token;
  expr2: Token;
};

export type AstNode = Parenthesis | BetweenPredicate | TokenNode;

export const isTokenNode = (node: AstNode): node is TokenNode => node.type === 'token';
