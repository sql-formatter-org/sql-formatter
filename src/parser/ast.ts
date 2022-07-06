import { Token } from 'src/core/token';

export enum NodeType {
  statement = 'statement',
  clause = 'clause',
  binary_clause = 'binary_clause',
  function_call = 'function_call',
  array_subscript = 'array_subscript',
  parenthesis = 'parenthesis',
  between_predicate = 'between_predicate',
  limit_clause = 'limit_clause',
  all_columns_asterisk = 'all_columns_asterisk',
  token = 'token',
}

export type Statement = {
  type: NodeType.statement;
  children: AstNode[];
  hasSemicolon: boolean;
};

export type Clause = {
  type: NodeType.clause;
  nameToken: Token;
  children: AstNode[];
};

export type BinaryClause = {
  type: NodeType.binary_clause;
  nameToken: Token;
  children: AstNode[];
};

// Wrapper for plain nodes inside AST
export type TokenNode = {
  type: NodeType.token;
  token: Token;
};

export type FunctionCall = {
  type: NodeType.function_call;
  nameToken: Token;
  parenthesis: Parenthesis;
};

// <ident>[<expr>]
export type ArraySubscript = {
  type: NodeType.array_subscript;
  arrayToken: Token;
  parenthesis: Parenthesis;
};

export type Parenthesis = {
  type: NodeType.parenthesis;
  children: AstNode[];
  openParen: string;
  closeParen: string;
};

// BETWEEN <expr1> AND <expr2>
export type BetweenPredicate = {
  type: NodeType.between_predicate;
  betweenToken: Token;
  expr1: Token;
  andToken: Token;
  expr2: Token;
};

// LIMIT <count>
// LIMIT <offset>, <count>
export type LimitClause = {
  type: NodeType.limit_clause;
  limitToken: Token;
  countToken: Token;
  offsetToken?: Token;
};

// The "*" operator used in SELECT *
export type AllColumnsAsterisk = {
  type: NodeType.all_columns_asterisk;
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
