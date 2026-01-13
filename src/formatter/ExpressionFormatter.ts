import { FormatOptions } from '../FormatOptions.js';
import { equalizeWhitespace, isMultiline, last } from '../utils.js';

import Params from './Params.js';
import { isTabularStyle } from './config.js';
import { TokenType } from '../lexer/token.js';
import {
  AllColumnsAsteriskNode,
  ArraySubscriptNode,
  AstNode,
  BetweenPredicateNode,
  SetOperationNode,
  ClauseNode,
  FunctionCallNode,
  LimitClauseNode,
  NodeType,
  ParenthesisNode,
  LiteralNode,
  IdentifierNode,
  ParameterNode,
  OperatorNode,
  LineCommentNode,
  BlockCommentNode,
  CommaNode,
  KeywordNode,
  PropertyAccessNode,
  CommentNode,
  CaseExpressionNode,
  CaseWhenNode,
  CaseElseNode,
  DataTypeNode,
  ParameterizedDataTypeNode,
  DisableCommentNode,
} from '../parser/ast.js';

import Layout, { WS } from './Layout.js';
import toTabularFormat, { isTabularToken } from './tabularStyle.js';
import InlineLayout, { InlineLayoutError } from './InlineLayout.js';

interface ExpressionFormatterParams {
  cfg: FormatOptions;
  dialectCfg: ProcessedDialectFormatOptions;
  params: Params;
  layout: Layout;
  inline?: boolean;
}

export interface DialectFormatOptions {
  // List of operators that should always be formatted without surrounding spaces
  alwaysDenseOperators?: string[];
  // List of clauses that should be formatted on a single line
  onelineClauses: string[];
  // List of clauses that should be formatted on a single line in tabular style
  tabularOnelineClauses?: string[];
}

// Contains the same data as DialectFormatOptions,
// but optimized for faster and more conventient lookup.
export interface ProcessedDialectFormatOptions {
  alwaysDenseOperators: string[];
  onelineClauses: Record<string, boolean>;
  tabularOnelineClauses: Record<string, boolean>;
}

/** Formats a generic SQL expression */
export default class ExpressionFormatter {
  private cfg: FormatOptions;
  private dialectCfg: ProcessedDialectFormatOptions;
  private params: Params;
  private layout: Layout;

  private inline = false;
  private nodes: AstNode[] = [];
  private index = -1;

  constructor({ cfg, dialectCfg, params, layout, inline = false }: ExpressionFormatterParams) {
    this.cfg = cfg;
    this.dialectCfg = dialectCfg;
    this.inline = inline;
    this.params = params;
    this.layout = layout;
  }

  public format(nodes: AstNode[]): Layout {
    this.nodes = nodes;

    for (this.index = 0; this.index < this.nodes.length; this.index++) {
      this.formatNode(this.nodes[this.index]);
    }
    return this.layout;
  }

  private formatNode(node: AstNode) {
    this.formatComments(node.leadingComments);
    this.formatNodeWithoutComments(node);
    this.formatComments(node.trailingComments);
  }

  private formatNodeWithoutComments(node: AstNode) {
    switch (node.type) {
      case NodeType.function_call:
        return this.formatFunctionCall(node);
      case NodeType.parameterized_data_type:
        return this.formatParameterizedDataType(node);
      case NodeType.array_subscript:
        return this.formatArraySubscript(node);
      case NodeType.property_access:
        return this.formatPropertyAccess(node);
      case NodeType.parenthesis:
        return this.formatParenthesis(node);
      case NodeType.between_predicate:
        return this.formatBetweenPredicate(node);
      case NodeType.case_expression:
        return this.formatCaseExpression(node);
      case NodeType.case_when:
        return this.formatCaseWhen(node);
      case NodeType.case_else:
        return this.formatCaseElse(node);
      case NodeType.clause:
        return this.formatClause(node);
      case NodeType.set_operation:
        return this.formatSetOperation(node);
      case NodeType.limit_clause:
        return this.formatLimitClause(node);
      case NodeType.all_columns_asterisk:
        return this.formatAllColumnsAsterisk(node);
      case NodeType.literal:
        return this.formatLiteral(node);
      case NodeType.identifier:
        return this.formatIdentifier(node);
      case NodeType.parameter:
        return this.formatParameter(node);
      case NodeType.operator:
        return this.formatOperator(node);
      case NodeType.comma:
        return this.formatComma(node);
      case NodeType.line_comment:
        return this.formatLineComment(node);
      case NodeType.block_comment:
        return this.formatBlockComment(node);
      case NodeType.disable_comment:
        return this.formatBlockComment(node);
      case NodeType.data_type:
        return this.formatDataType(node);
      case NodeType.keyword:
        return this.formatKeywordNode(node);
    }
  }

  private formatFunctionCall(node: FunctionCallNode) {
    this.withComments(node.nameKw, () => {
      this.layout.add(this.showFunctionKw(node.nameKw));
    });
    this.formatNode(node.parenthesis);
  }

  private formatParameterizedDataType(node: ParameterizedDataTypeNode) {
    this.withComments(node.dataType, () => {
      this.layout.add(this.showDataType(node.dataType));
    });
    this.formatNode(node.parenthesis);
  }

  private formatArraySubscript(node: ArraySubscriptNode) {
    let formattedArray: string;

    switch (node.array.type) {
      case NodeType.data_type:
        formattedArray = this.showDataType(node.array);
        break;
      case NodeType.keyword:
        formattedArray = this.showKw(node.array);
        break;
      default:
        formattedArray = this.showIdentifier(node.array);
        break;
    }

    this.withComments(node.array, () => {
      this.layout.add(formattedArray);
    });

    this.formatNode(node.parenthesis);
  }

  private formatPropertyAccess(node: PropertyAccessNode) {
    this.formatNode(node.object);
    this.layout.add(WS.NO_SPACE, node.operator);
    this.formatNode(node.property);
  }

  private formatParenthesis(node: ParenthesisNode) {
    const inlineLayout = this.formatInlineExpression(node.children);

    if (inlineLayout) {
      this.layout.add(node.openParen);
      this.layout.add(...inlineLayout.getLayoutItems());
      this.layout.add(WS.NO_SPACE, node.closeParen, WS.SPACE);
    } else {
      this.layout.add(node.openParen, WS.NEWLINE);

      if (isTabularStyle(this.cfg)) {
        this.layout.add(WS.INDENT);
        this.layout = this.formatSubExpression(node.children);
      } else {
        this.layout.indentation.increaseBlockLevel();
        this.layout.add(WS.INDENT);
        this.layout = this.formatSubExpression(node.children);
        this.layout.indentation.decreaseBlockLevel();
      }

      this.layout.add(WS.NEWLINE, WS.INDENT, node.closeParen, WS.SPACE);
    }
  }

  private formatBetweenPredicate(node: BetweenPredicateNode) {
    this.layout.add(this.showKw(node.betweenKw), WS.SPACE);
    this.layout = this.formatSubExpression(node.expr1);
    this.layout.add(WS.NO_SPACE, WS.SPACE, this.showNonTabularKw(node.andKw), WS.SPACE);
    this.layout = this.formatSubExpression(node.expr2);
    this.layout.add(WS.SPACE);
  }

  private formatCaseExpression(node: CaseExpressionNode) {
    this.formatNode(node.caseKw);

    this.layout.indentation.increaseBlockLevel();
    this.layout = this.formatSubExpression(node.expr);
    this.layout = this.formatSubExpression(node.clauses);
    this.layout.indentation.decreaseBlockLevel();

    this.layout.add(WS.NEWLINE, WS.INDENT);
    this.formatNode(node.endKw);
  }

  private formatCaseWhen(node: CaseWhenNode) {
    this.layout.add(WS.NEWLINE, WS.INDENT);
    this.formatNode(node.whenKw);
    this.layout = this.formatSubExpression(node.condition);
    this.formatNode(node.thenKw);
    this.layout = this.formatSubExpression(node.result);
  }

  private formatCaseElse(node: CaseElseNode) {
    this.layout.add(WS.NEWLINE, WS.INDENT);
    this.formatNode(node.elseKw);
    this.layout = this.formatSubExpression(node.result);
  }

  private formatClause(node: ClauseNode) {
    if (this.isOnelineClause(node)) {
      this.formatClauseInOnelineStyle(node);
    } else if (isTabularStyle(this.cfg)) {
      this.formatClauseInTabularStyle(node);
    } else {
      this.formatClauseInIndentedStyle(node);
    }
  }

  private isOnelineClause(node: ClauseNode): boolean {
    if (isTabularStyle(this.cfg)) {
      return this.dialectCfg.tabularOnelineClauses[node.nameKw.text];
    } else {
      return this.dialectCfg.onelineClauses[node.nameKw.text];
    }
  }

  private formatClauseInIndentedStyle(node: ClauseNode) {
    this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node.nameKw), WS.NEWLINE);
    this.layout.indentation.increaseTopLevel();
    this.layout.add(WS.INDENT);
    this.layout = this.formatSubExpression(node.children);
    this.layout.indentation.decreaseTopLevel();
  }

  private formatClauseInOnelineStyle(node: ClauseNode) {
    this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node.nameKw), WS.SPACE);
    this.layout = this.formatSubExpression(node.children);
  }

  private formatClauseInTabularStyle(node: ClauseNode) {
    this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node.nameKw), WS.SPACE);
    this.layout.indentation.increaseTopLevel();
    this.layout = this.formatSubExpression(node.children);
    this.layout.indentation.decreaseTopLevel();
  }

  private formatSetOperation(node: SetOperationNode) {
    this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node.nameKw), WS.NEWLINE);
    this.layout.add(WS.INDENT);
    this.layout = this.formatSubExpression(node.children);
  }

  private formatLimitClause(node: LimitClauseNode) {
    this.withComments(node.limitKw, () => {
      this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node.limitKw));
    });
    this.layout.indentation.increaseTopLevel();

    if (isTabularStyle(this.cfg)) {
      this.layout.add(WS.SPACE);
    } else {
      this.layout.add(WS.NEWLINE, WS.INDENT);
    }

    if (node.offset) {
      this.layout = this.formatSubExpression(node.offset);
      this.layout.add(WS.NO_SPACE, ',', WS.SPACE);
      this.layout = this.formatSubExpression(node.count);
    } else {
      this.layout = this.formatSubExpression(node.count);
    }
    this.layout.indentation.decreaseTopLevel();
  }

  private formatAllColumnsAsterisk(_node: AllColumnsAsteriskNode) {
    this.layout.add('*', WS.SPACE);
  }

  private formatLiteral(node: LiteralNode) {
    this.layout.add(node.text, WS.SPACE);
  }

  private formatIdentifier(node: IdentifierNode) {
    this.layout.add(this.showIdentifier(node), WS.SPACE);
  }

  private formatParameter(node: ParameterNode) {
    this.layout.add(this.params.get(node), WS.SPACE);
  }

  private formatOperator({ text }: OperatorNode) {
    if (this.cfg.denseOperators || this.dialectCfg.alwaysDenseOperators.includes(text)) {
      this.layout.add(WS.NO_SPACE, text);
    } else if (text === ':') {
      this.layout.add(WS.NO_SPACE, text, WS.SPACE);
    } else {
      this.layout.add(text, WS.SPACE);
    }
  }

  private formatComma(_node: CommaNode) {
    if (!this.inline) {
      if (this.cfg.commaNewline === 'before') {
        this.layout.add(WS.NEWLINE, WS.INDENT, ',', WS.SPACE);
      } else {
        this.layout.add(WS.NO_SPACE, ',', WS.NEWLINE, WS.INDENT);
      }
    } else {
      this.layout.add(WS.NO_SPACE, ',', WS.SPACE);
    }
  }

  private withComments(node: AstNode, fn: () => void) {
    this.formatComments(node.leadingComments);
    fn();
    this.formatComments(node.trailingComments);
  }

  private formatComments(comments: CommentNode[] | undefined) {
    if (!comments) {
      return;
    }
    comments.forEach(com => {
      if (com.type === NodeType.line_comment) {
        this.formatLineComment(com);
      } else {
        this.formatBlockComment(com);
      }
    });
  }

  private formatLineComment(node: LineCommentNode) {
    if (isMultiline(node.precedingWhitespace || '')) {
      this.layout.add(WS.NEWLINE, WS.INDENT, node.text, WS.MANDATORY_NEWLINE, WS.INDENT);
    } else if (this.layout.getLayoutItems().length > 0) {
      this.layout.add(WS.NO_NEWLINE, WS.SPACE, node.text, WS.MANDATORY_NEWLINE, WS.INDENT);
    } else {
      // comment is the first item in code - no need to add preceding spaces
      this.layout.add(node.text, WS.MANDATORY_NEWLINE, WS.INDENT);
    }
  }

  private formatBlockComment(node: BlockCommentNode | DisableCommentNode) {
    if (node.type === NodeType.block_comment && this.isMultilineBlockComment(node)) {
      this.splitBlockComment(node.text).forEach(line => {
        this.layout.add(WS.NEWLINE, WS.INDENT, line);
      });
      this.layout.add(WS.NEWLINE, WS.INDENT);
    } else {
      this.layout.add(node.text, WS.SPACE);
    }
  }

  private isMultilineBlockComment(node: BlockCommentNode): boolean {
    return isMultiline(node.text) || isMultiline(node.precedingWhitespace || '');
  }

  private isDocComment(comment: string): boolean {
    const lines = comment.split(/\n/);
    return (
      // first line starts with /* or /**
      /^\/\*\*?$/.test(lines[0]) &&
      // intermediate lines start with *
      lines.slice(1, lines.length - 1).every(line => /^\s*\*/.test(line)) &&
      // last line ends with */
      /^\s*\*\/$/.test(last(lines) as string)
    );
  }

  // Breaks up block comment to multiple lines.
  // For example this doc-comment (dots representing leading whitespace):
  //
  //   ..../**
  //   .....* Some description here
  //   .....* and here too
  //   .....*/
  //
  // gets broken to this array (note the leading single spaces):
  //
  //   [ '/**',
  //     '.* Some description here',
  //     '.* and here too',
  //     '.*/' ]
  //
  // However, a normal comment (non-doc-comment) like this:
  //
  //   ..../*
  //   ....Some description here
  //   ....*/
  //
  // gets broken to this array (no leading spaces):
  //
  //   [ '/*',
  //     'Some description here',
  //     '*/' ]
  //
  private splitBlockComment(comment: string): string[] {
    if (this.isDocComment(comment)) {
      return comment.split(/\n/).map(line => {
        if (/^\s*\*/.test(line)) {
          return ' ' + line.replace(/^\s*/, '');
        } else {
          return line;
        }
      });
    } else {
      return comment.split(/\n/).map(line => line.replace(/^\s*/, ''));
    }
  }

  private formatSubExpression(nodes: AstNode[]): Layout {
    return new ExpressionFormatter({
      cfg: this.cfg,
      dialectCfg: this.dialectCfg,
      params: this.params,
      layout: this.layout,
      inline: this.inline,
    }).format(nodes);
  }

  private formatInlineExpression(nodes: AstNode[]): Layout | undefined {
    const oldParamIndex = this.params.getPositionalParameterIndex();
    try {
      return new ExpressionFormatter({
        cfg: this.cfg,
        dialectCfg: this.dialectCfg,
        params: this.params,
        layout: new InlineLayout(this.cfg.expressionWidth),
        inline: true,
      }).format(nodes);
    } catch (e) {
      if (e instanceof InlineLayoutError) {
        // While formatting, some of the positional parameters might have
        // been consumed, which increased the current parameter index.
        // We reset the index to an earlier state, so we can run the
        // formatting again and re-consume these parameters in non-inline mode.
        this.params.setPositionalParameterIndex(oldParamIndex);
        return undefined;
      } else {
        // forward all unexpected errors
        throw e;
      }
    }
  }

  private formatKeywordNode(node: KeywordNode): void {
    switch (node.tokenType) {
      case TokenType.RESERVED_JOIN:
        return this.formatJoin(node);
      case TokenType.AND:
      case TokenType.OR:
      case TokenType.XOR:
        return this.formatLogicalOperator(node);
      default:
        return this.formatKeyword(node);
    }
  }

  private formatJoin(node: KeywordNode) {
    if (isTabularStyle(this.cfg)) {
      // in tabular style JOINs are at the same level as clauses
      this.layout.indentation.decreaseTopLevel();
      this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node), WS.SPACE);
      this.layout.indentation.increaseTopLevel();
    } else {
      this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node), WS.SPACE);
    }
  }

  private formatKeyword(node: KeywordNode) {
    this.layout.add(this.showKw(node), WS.SPACE);
  }

  private formatLogicalOperator(node: KeywordNode) {
    if (this.cfg.logicalOperatorNewline === 'before') {
      if (isTabularStyle(this.cfg)) {
        // In tabular style AND/OR is placed on the same level as clauses
        this.layout.indentation.decreaseTopLevel();
        this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node), WS.SPACE);
        this.layout.indentation.increaseTopLevel();
      } else {
        this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node), WS.SPACE);
      }
    } else {
      this.layout.add(this.showKw(node), WS.NEWLINE, WS.INDENT);
    }
  }

  private formatDataType(node: DataTypeNode) {
    this.layout.add(this.showDataType(node), WS.SPACE);
  }

  private showKw(node: KeywordNode): string {
    if (isTabularToken(node.tokenType)) {
      return toTabularFormat(this.showNonTabularKw(node), this.cfg.indentStyle);
    } else {
      return this.showNonTabularKw(node);
    }
  }

  // Like showKw(), but skips tabular formatting
  private showNonTabularKw(node: KeywordNode): string {
    switch (this.cfg.keywordCase) {
      case 'preserve':
        return equalizeWhitespace(node.raw);
      case 'upper':
        return node.text;
      case 'lower':
        return node.text.toLowerCase();
    }
  }

  private showFunctionKw(node: KeywordNode): string {
    if (isTabularToken(node.tokenType)) {
      return toTabularFormat(this.showNonTabularFunctionKw(node), this.cfg.indentStyle);
    } else {
      return this.showNonTabularFunctionKw(node);
    }
  }

  // Like showFunctionKw(), but skips tabular formatting
  private showNonTabularFunctionKw(node: KeywordNode): string {
    switch (this.cfg.functionCase) {
      case 'preserve':
        return equalizeWhitespace(node.raw);
      case 'upper':
        return node.text;
      case 'lower':
        return node.text.toLowerCase();
    }
  }

  private showIdentifier(node: IdentifierNode): string {
    if (node.quoted) {
      return node.text;
    } else {
      switch (this.cfg.identifierCase) {
        case 'preserve':
          return node.text;
        case 'upper':
          return node.text.toUpperCase();
        case 'lower':
          return node.text.toLowerCase();
      }
    }
  }

  private showDataType(node: DataTypeNode): string {
    switch (this.cfg.dataTypeCase) {
      case 'preserve':
        return equalizeWhitespace(node.raw);
      case 'upper':
        return node.text;
      case 'lower':
        return node.text.toLowerCase();
    }
  }
}
