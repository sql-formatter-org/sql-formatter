import { TokenType, Loc } from 'src/lexer/token';

export enum NodeType {
  statement = 'statement',
  clause = 'clause',
  set_operation = 'set_operation',
  function_call = 'function_call',
  array_subscript = 'array_subscript',
  property_access = 'property_access',
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

export type StatementNode = {
  type: NodeType.statement;
  children: AstNode[];
  hasSemicolon: boolean;
};

export type ClauseNode = {
  type: NodeType.clause;
  name: KeywordNode;
  children: AstNode[];
};

export type SetOperationNode = {
  type: NodeType.set_operation;
  name: KeywordNode;
  children: AstNode[];
};

export type FunctionCallNode = {
  type: NodeType.function_call;
  name: KeywordNode;
  parenthesis: ParenthesisNode;
};

// <ident>[<expr>]
export type ArraySubscriptNode = {
  type: NodeType.array_subscript;
  array: IdentifierNode | KeywordNode;
  parenthesis: ParenthesisNode;
};

export type ParenthesisNode = {
  type: NodeType.parenthesis;
  children: AstNode[];
  openParen: string;
  closeParen: string;
  loc: Loc;
};

// BETWEEN <expr1> AND <expr2>
export type BetweenPredicateNode = {
  type: NodeType.between_predicate;
  between: KeywordNode;
  expr1: AstNode[];
  and: KeywordNode;
  expr2: AstNode[];
};

// LIMIT <count>
// LIMIT <offset>, <count>
export type LimitClauseNode = {
  type: NodeType.limit_clause;
  name: KeywordNode;
  count: AstNode[];
  offset?: AstNode[];
};

// The "*" operator used in SELECT *
export type AllColumnsAsteriskNode = {
  type: NodeType.all_columns_asterisk;
  loc: Loc;
};

export type LiteralNode = {
  type: NodeType.literal;
  text: string;
  loc: Loc;
};

export type PropertyAccessNode = {
  type: NodeType.property_access;
  object: AstNode;
  property: IdentifierNode;
};

export type IdentifierNode = {
  type: NodeType.identifier;
  text: string;
  loc: Loc;
};

export type KeywordNode = {
  type: NodeType.keyword;
  tokenType: TokenType;
  text: string;
  raw: string;
  loc: Loc;
};

export type ParameterNode = {
  type: NodeType.parameter;
  key?: string;
  text: string;
  loc: Loc;
};

export type OperatorNode = {
  type: NodeType.operator;
  text: string;
  loc: Loc;
};

export type CommaNode = {
  type: NodeType.comma;
  loc: Loc;
};

export type LineCommentNode = {
  type: NodeType.line_comment;
  text: string;
  precedingWhitespace: string;
  loc: Loc;
};

export type BlockCommentNode = {
  type: NodeType.block_comment;
  text: string;
  loc: Loc;
};

export type AstNode =
  | ClauseNode
  | SetOperationNode
  | FunctionCallNode
  | ArraySubscriptNode
  | PropertyAccessNode
  | ParenthesisNode
  | BetweenPredicateNode
  | LimitClauseNode
  | AllColumnsAsteriskNode
  | LiteralNode
  | IdentifierNode
  | KeywordNode
  | ParameterNode
  | OperatorNode
  | CommaNode
  | LineCommentNode
  | BlockCommentNode;
