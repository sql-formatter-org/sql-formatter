import { TokenType } from 'src/lexer/token';

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

type BaseNode = {
  leadingComments?: CommentNode[];
  trailingComments?: CommentNode[];
};

export type StatementNode = BaseNode & {
  type: NodeType.statement;
  children: AstNode[];
  hasSemicolon: boolean;
};

export type ClauseNode = BaseNode & {
  type: NodeType.clause;
  name: KeywordNode;
  children: AstNode[];
};

export type SetOperationNode = BaseNode & {
  type: NodeType.set_operation;
  name: KeywordNode;
  children: AstNode[];
};

export type FunctionCallNode = BaseNode & {
  type: NodeType.function_call;
  name: KeywordNode;
  parenthesis: ParenthesisNode;
};

// <ident>[<expr>]
export type ArraySubscriptNode = BaseNode & {
  type: NodeType.array_subscript;
  array: IdentifierNode | KeywordNode;
  parenthesis: ParenthesisNode;
};

export type ParenthesisNode = BaseNode & {
  type: NodeType.parenthesis;
  children: AstNode[];
  openParen: string;
  closeParen: string;
};

// BETWEEN <expr1> AND <expr2>
export type BetweenPredicateNode = BaseNode & {
  type: NodeType.between_predicate;
  between: KeywordNode;
  expr1: AstNode[];
  and: KeywordNode;
  expr2: AstNode[];
};

// LIMIT <count>
// LIMIT <offset>, <count>
export type LimitClauseNode = BaseNode & {
  type: NodeType.limit_clause;
  name: KeywordNode;
  count: AstNode[];
  offset?: AstNode[];
};

// The "*" operator used in SELECT *
export type AllColumnsAsteriskNode = BaseNode & {
  type: NodeType.all_columns_asterisk;
};

export type LiteralNode = BaseNode & {
  type: NodeType.literal;
  text: string;
};

export type PropertyAccessNode = BaseNode & {
  type: NodeType.property_access;
  object: AstNode;
  property: IdentifierNode | ArraySubscriptNode | AllColumnsAsteriskNode;
};

export type IdentifierNode = BaseNode & {
  type: NodeType.identifier;
  text: string;
};

export type KeywordNode = BaseNode & {
  type: NodeType.keyword;
  tokenType: TokenType;
  text: string;
  raw: string;
};

export type ParameterNode = BaseNode & {
  type: NodeType.parameter;
  key?: string;
  text: string;
};

export type OperatorNode = BaseNode & {
  type: NodeType.operator;
  text: string;
};

export type CommaNode = BaseNode & {
  type: NodeType.comma;
};

export type LineCommentNode = BaseNode & {
  type: NodeType.line_comment;
  text: string;
  precedingWhitespace: string;
};

export type BlockCommentNode = BaseNode & {
  type: NodeType.block_comment;
  text: string;
};

export type CommentNode = LineCommentNode | BlockCommentNode;

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
