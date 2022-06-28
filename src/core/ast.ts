import { Token } from './token';

export type Statement = {
  type: 'statement';
  children: AstNode[];
  hasSemicolon: boolean;
};

export type Clause = {
  type: 'clause';
  nameToken: Token;
  children: AstNode[];
};

export type BinaryClause = {
  type: 'binary_clause';
  nameToken: Token;
  children: AstNode[];
};

// Wrapper for plain nodes inside AST
export type TokenNode = {
  type: 'token';
  token: Token;
};

export type FunctionCall = {
  type: 'function_call';
  nameToken: Token;
  parenthesis: Parenthesis;
};

// <ident>[<expr>]
export type ArraySubscript = {
  type: 'array_subscript';
  arrayToken: Token;
  parenthesis: Parenthesis;
};

export type Parenthesis = {
  type: 'parenthesis';
  children: AstNode[];
  openParen: string;
  closeParen: string;
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

// The "*" operator used in SELECT *
export type AllColumnsAsterisk = {
  type: 'all_columns_asterisk';
};

export type AstNode =
  | Clause
  | BinaryClause
  | FunctionCall
  | ArraySubscript
  | Parenthesis
  | BetweenPredicate
  | LimitClause
  | AllColumnsAsterisk
  | TokenNode;

export const isTokenNode = (node: AstNode): node is TokenNode => node.type === 'token';
