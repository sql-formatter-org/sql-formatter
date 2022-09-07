import { FormatOptions } from 'src/FormatOptions';
import { equalizeWhitespace } from 'src/utils';

import Params from 'src/formatter/Params';
import { isTabularStyle } from 'src/formatter/config';
import { TokenType } from 'src/lexer/token';
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
} from 'src/parser/ast';

import Layout, { WS } from './Layout';
import toTabularFormat, { isTabularToken } from './tabularStyle';
import InlineLayout, { InlineLayoutError } from './InlineLayout';

interface ExpressionFormatterParams {
  cfg: FormatOptions;
  params: Params;
  layout: Layout;
  inline?: boolean;
}

/** Formats a generic SQL expression */
export default class ExpressionFormatter {
  private cfg: FormatOptions;
  private params: Params;
  private layout: Layout;

  private inline = false;
  private nodes: AstNode[] = [];
  private index = -1;

  constructor({ cfg, params, layout, inline = false }: ExpressionFormatterParams) {
    this.cfg = cfg;
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
    switch (node.type) {
      case NodeType.function_call:
        return this.formatFunctionCall(node);
      case NodeType.array_subscript:
        return this.formatArraySubscript(node);
      case NodeType.property_access:
        return this.formatPropertyAccess(node);
      case NodeType.parenthesis:
        return this.formatParenthesis(node);
      case NodeType.between_predicate:
        return this.formatBetweenPredicate(node);
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
      case NodeType.keyword:
        return this.formatKeywordNode(node);
    }
  }

  private formatFunctionCall({ name, parenthesis }: FunctionCallNode) {
    this.withComments(name, () => {
      this.layout.add(this.showKw(name));
    });
    this.formatParenthesis(parenthesis);
  }

  private formatArraySubscript(node: ArraySubscriptNode) {
    this.withComments(node, () => {
      this.withComments(node.array, () => {
        this.layout.add(
          node.array.type === NodeType.keyword ? this.showKw(node.array) : node.array.text
        );
      });
      this.formatParenthesis(node.parenthesis);
    });
  }

  private formatPropertyAccess({ object, property }: PropertyAccessNode) {
    this.formatNode(object);
    this.layout.add(WS.NO_SPACE, '.');
    this.formatNode(property);
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
    this.layout.add(this.showKw(node.between), WS.SPACE);
    this.layout = this.formatSubExpression(node.expr1);
    this.layout.add(WS.NO_SPACE, WS.SPACE, this.showNonTabularKw(node.and), WS.SPACE);
    this.layout = this.formatSubExpression(node.expr2);
    this.layout.add(WS.SPACE);
  }

  private formatClause(node: ClauseNode) {
    if (isTabularStyle(this.cfg)) {
      this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node.name), WS.SPACE);
    } else {
      this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node.name), WS.NEWLINE);
    }
    this.layout.indentation.increaseTopLevel();

    if (!isTabularStyle(this.cfg)) {
      this.layout.add(WS.INDENT);
    }
    this.layout = this.formatSubExpression(node.children);

    this.layout.indentation.decreaseTopLevel();
  }

  private formatSetOperation(node: SetOperationNode) {
    this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node.name), WS.NEWLINE);
    this.layout.add(WS.INDENT);
    this.layout = this.formatSubExpression(node.children);
  }

  private formatLimitClause(node: LimitClauseNode) {
    this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node.name));
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

  private formatAllColumnsAsterisk(node: AllColumnsAsteriskNode) {
    this.withComments(node, () => {
      this.layout.add('*', WS.SPACE);
    });
  }

  private formatLiteral(node: LiteralNode) {
    this.layout.add(node.text, WS.SPACE);
  }

  private formatIdentifier(node: IdentifierNode) {
    this.withComments(node, () => {
      this.layout.add(node.text, WS.SPACE);
    });
  }

  private formatParameter(node: ParameterNode) {
    this.layout.add(this.params.get(node), WS.SPACE);
  }

  private formatOperator({ text }: OperatorNode) {
    // special operator
    if (text === ':') {
      this.layout.add(WS.NO_SPACE, text, WS.SPACE);
      return;
    } else if (text === '::') {
      this.layout.add(WS.NO_SPACE, text);
      return;
    }
    // special case for PLSQL @ dblink syntax
    else if (text === '@' && this.cfg.language === 'plsql') {
      this.layout.add(WS.NO_SPACE, text);
      return;
    }

    // other operators
    if (this.cfg.denseOperators) {
      this.layout.add(WS.NO_SPACE, text);
    } else {
      this.layout.add(text, WS.SPACE);
    }
  }

  private formatComma(_node: CommaNode) {
    if (!this.inline) {
      this.layout.add(WS.NO_SPACE, ',', WS.NEWLINE, WS.INDENT);
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
    if (/\n/.test(node.precedingWhitespace || '')) {
      this.layout.add(WS.NEWLINE, WS.INDENT, node.text, WS.MANDATORY_NEWLINE, WS.INDENT);
    } else {
      this.layout.add(WS.NO_NEWLINE, WS.SPACE, node.text, WS.MANDATORY_NEWLINE, WS.INDENT);
    }
  }

  private formatBlockComment(node: BlockCommentNode) {
    this.splitBlockComment(node.text).forEach(line => {
      this.layout.add(WS.NEWLINE, WS.INDENT, line);
    });
    this.layout.add(WS.NEWLINE, WS.INDENT);
  }

  // Breaks up block comment to multiple lines.
  // For example this comment (dots representing leading whitespace):
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
  private splitBlockComment(comment: string): string[] {
    return comment.split(/\n/).map(line => {
      if (/^\s*\*/.test(line)) {
        return ' ' + line.replace(/^\s*/, '');
      } else {
        return line.replace(/^\s*/, '');
      }
    });
  }

  private formatSubExpression(nodes: AstNode[]): Layout {
    return new ExpressionFormatter({
      cfg: this.cfg,
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
      case TokenType.RESERVED_DEPENDENT_CLAUSE:
        return this.formatDependentClause(node);
      case TokenType.AND:
      case TokenType.OR:
      case TokenType.XOR:
        return this.formatLogicalOperator(node);
      case TokenType.RESERVED_KEYWORD:
      case TokenType.RESERVED_FUNCTION_NAME:
      case TokenType.RESERVED_PHRASE:
        return this.formatKeyword(node);
      case TokenType.CASE:
        return this.formatCaseStart(node);
      case TokenType.END:
        return this.formatCaseEnd(node);
      default:
        throw new Error(`Unexpected token type: ${node.tokenType}`);
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

  private formatDependentClause(node: KeywordNode) {
    this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node), WS.SPACE);
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

  private formatCaseStart(node: KeywordNode) {
    this.layout.indentation.increaseBlockLevel();
    this.layout.add(this.showKw(node), WS.NEWLINE, WS.INDENT);
  }

  private formatCaseEnd(node: KeywordNode) {
    this.formatMultilineBlockEnd(node);
  }

  private formatMultilineBlockEnd(node: KeywordNode) {
    this.layout.indentation.decreaseBlockLevel();

    this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node), WS.SPACE);
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
}
