import { Token } from 'src/lexer/token';

export enum NodeType {
  statement = 'statement',
  clause = 'clause',
  set_operation = 'set_operation',
  function_call = 'function_call',
  array_subscript = 'array_subscript',
  parenthesis = 'parenthesis',
  between_predicate = 'between_predicate',
  limit_clause = 'limit_clause',
  all_columns_asterisk = 'all_columns_asterisk',
  literal = 'literal',
  identifier = 'identifier',
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

export type SetOperation = {
  type: NodeType.set_operation;
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
  expr1: AstNode[];
  andToken: Token;
  expr2: AstNode[];
};

// LIMIT <count>
// LIMIT <offset>, <count>
export type LimitClause = {
  type: NodeType.limit_clause;
  limitToken: Token;
  count: AstNode[];
  offset?: AstNode[];
};

// The "*" operator used in SELECT *
export type AllColumnsAsterisk = {
  type: NodeType.all_columns_asterisk;
};

export type Literal = {
  type: NodeType.literal;
  text: string;
};

export type Identifier = {
  type: NodeType.identifier;
  text: string;
};

export type AstNode =
  | Clause
  | SetOperation
  | FunctionCall
  | ArraySubscript
  | Parenthesis
  | BetweenPredicate
  | LimitClause
  | AllColumnsAsterisk
  | Literal
  | Identifier
  | TokenNode;

export const isTokenNode = (node: AstNode): node is TokenNode => node.type === 'token';
