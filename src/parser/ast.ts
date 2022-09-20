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

interface BaseNode {
  leadingComments?: CommentNode[];
  trailingComments?: CommentNode[];
}

export interface StatementNode extends BaseNode {
  type: NodeType.statement;
  children: AstNode[];
  hasSemicolon: boolean;
}

export interface ClauseNode extends BaseNode {
  type: NodeType.clause;
  name: KeywordNode;
  children: AstNode[];
}

export interface SetOperationNode extends BaseNode {
  type: NodeType.set_operation;
  name: KeywordNode;
  children: AstNode[];
}

export interface FunctionCallNode extends BaseNode {
  type: NodeType.function_call;
  name: KeywordNode;
  parenthesis: ParenthesisNode;
}

// <ident>[<expr>]
export interface ArraySubscriptNode extends BaseNode {
  type: NodeType.array_subscript;
  array: IdentifierNode | KeywordNode;
  parenthesis: ParenthesisNode;
}

export interface ParenthesisNode extends BaseNode {
  type: NodeType.parenthesis;
  children: AstNode[];
  openParen: string;
  closeParen: string;
}

// BETWEEN <expr1> AND <expr2>
export interface BetweenPredicateNode extends BaseNode {
  type: NodeType.between_predicate;
  between: KeywordNode;
  expr1: AstNode[];
  and: KeywordNode;
  expr2: AstNode[];
}

// LIMIT <count>
// LIMIT <offset>, <count>
export interface LimitClauseNode extends BaseNode {
  type: NodeType.limit_clause;
  name: KeywordNode;
  count: AstNode[];
  offset?: AstNode[];
}

// The "*" operator used in SELECT *
export interface AllColumnsAsteriskNode extends BaseNode {
  type: NodeType.all_columns_asterisk;
}

export interface LiteralNode extends BaseNode {
  type: NodeType.literal;
  text: string;
}

export interface PropertyAccessNode extends BaseNode {
  type: NodeType.property_access;
  object: AstNode;
  property: IdentifierNode | ArraySubscriptNode | AllColumnsAsteriskNode;
}

export interface IdentifierNode extends BaseNode {
  type: NodeType.identifier;
  text: string;
}

export interface KeywordNode extends BaseNode {
  type: NodeType.keyword;
  tokenType: TokenType;
  text: string;
  raw: string;
}

export interface ParameterNode extends BaseNode {
  type: NodeType.parameter;
  key?: string;
  text: string;
}

export interface OperatorNode extends BaseNode {
  type: NodeType.operator;
  text: string;
}

export interface CommaNode extends BaseNode {
  type: NodeType.comma;
}

export interface LineCommentNode extends BaseNode {
  type: NodeType.line_comment;
  text: string;
  precedingWhitespace: string;
}

export interface BlockCommentNode extends BaseNode {
  type: NodeType.block_comment;
  text: string;
}

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
