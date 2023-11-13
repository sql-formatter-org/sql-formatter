import { TokenType } from '../lexer/token.js';

export enum NodeType {
  statement = 'statement',
  clause = 'clause',
  set_operation = 'set_operation',
  function_call = 'function_call',
  array_subscript = 'array_subscript',
  property_access = 'property_access',
  parenthesis = 'parenthesis',
  between_predicate = 'between_predicate',
  case_expression = 'case_expression',
  case_when = 'case_when',
  case_else = 'case_else',
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
  nameKw: KeywordNode;
  children: AstNode[];
}

export interface SetOperationNode extends BaseNode {
  type: NodeType.set_operation;
  nameKw: KeywordNode;
  children: AstNode[];
}

export interface FunctionCallNode extends BaseNode {
  type: NodeType.function_call;
  nameKw: KeywordNode;
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
  betweenKw: KeywordNode;
  expr1: AstNode[];
  andKw: KeywordNode;
  expr2: AstNode[];
}

export interface CaseExpressionNode extends BaseNode {
  type: NodeType.case_expression;
  caseKw: KeywordNode;
  endKw: KeywordNode;
  expr: AstNode[];
  clauses: (CaseWhenNode | CaseElseNode)[];
}

export interface CaseWhenNode extends BaseNode {
  type: NodeType.case_when;
  whenKw: KeywordNode;
  thenKw: KeywordNode;
  condition: AstNode[];
  result: AstNode[];
}

export interface CaseElseNode extends BaseNode {
  type: NodeType.case_else;
  elseKw: KeywordNode;
  result: AstNode[];
}

// LIMIT <count>
// LIMIT <offset>, <count>
export interface LimitClauseNode extends BaseNode {
  type: NodeType.limit_clause;
  limitKw: KeywordNode;
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
  tokenType: TokenType;
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
  precedingWhitespace: string;
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
  | CaseExpressionNode
  | CaseWhenNode
  | CaseElseNode
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
