import { Token, TokenType } from 'src/lexer/token';

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
  keyword = 'keyword',
  parameter = 'parameter',
  operator = 'operator',
  comma = 'comma',
  line_comment = 'line_comment',
  block_comment = 'block_comment',
}

export type Statement = {
  type: NodeType.statement;
  children: AstNode[];
  hasSemicolon: boolean;
};

export type Clause = {
  type: NodeType.clause;
  name: Keyword;
  children: AstNode[];
};

export type SetOperation = {
  type: NodeType.set_operation;
  name: Keyword;
  children: AstNode[];
};

export type FunctionCall = {
  type: NodeType.function_call;
  name: Keyword;
  parenthesis: Parenthesis;
};

// <ident>[<expr>]
export type ArraySubscript = {
  type: NodeType.array_subscript;
  array: Identifier | Keyword;
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

export type Keyword = {
  type: NodeType.keyword;
  tokenType: TokenType;
  text: string;
  raw: string;
};

export type Parameter = {
  type: NodeType.parameter;
  key?: string;
  text: string;
};

export type Operator = {
  type: NodeType.operator;
  text: string;
};

export type Comma = {
  type: NodeType.comma;
};

export type LineComment = {
  type: NodeType.line_comment;
  text: string;
  precedingWhitespace: string;
};

export type BlockComment = {
  type: NodeType.block_comment;
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
  | Keyword
  | Parameter
  | Operator
  | Comma
  | LineComment
  | BlockComment;
