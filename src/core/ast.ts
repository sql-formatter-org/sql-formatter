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

export type AstNode = Parenthesis | TokenNode;

export const isTokenNode = (node: AstNode): node is TokenNode => node.type === 'token';
