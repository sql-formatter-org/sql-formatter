import type { FormatOptions } from 'src/FormatOptions';
import { equalizeWhitespace } from 'src/utils';

import Params from 'src/formatter/Params';
import { isTabularStyle } from 'src/formatter/config';
import { isReserved, type Token, TokenType } from 'src/lexer/token';
import {
  AllColumnsAsterisk,
  ArraySubscript,
  AstNode,
  BetweenPredicate,
  SetOperation,
  Clause,
  FunctionCall,
  LimitClause,
  NodeType,
  Parenthesis,
  Literal,
  Identifier,
  Parameter,
  Operator,
  LineComment,
  BlockComment,
  Comma,
  Keyword,
} from 'src/parser/ast';

import InlineBlock from './InlineBlock';
import Layout, { WS } from './Layout';
import toTabularFormat, { isTabularToken } from './tabularStyle';

interface ExpressionFormatterParams {
  cfg: FormatOptions;
  params: Params;
  layout: Layout;
  inline?: boolean;
}

/** Formats a generic SQL expression */
export default class ExpressionFormatter {
  private cfg: FormatOptions;
  private inlineBlock: InlineBlock;
  private params: Params;
  private layout: Layout;

  private inline = false;
  private nodes: AstNode[] = [];
  private index = -1;

  constructor({ cfg, params, layout, inline = false }: ExpressionFormatterParams) {
    this.cfg = cfg;
    this.inline = inline;
    this.inlineBlock = new InlineBlock(this.cfg.expressionWidth);
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

  private formatFunctionCall(node: FunctionCall) {
    this.layout.add(this.show(node.nameToken));
    this.formatParenthesis(node.parenthesis);
  }

  private formatArraySubscript(node: ArraySubscript) {
    this.layout.add(this.show(node.arrayToken));
    this.formatParenthesis(node.parenthesis);
  }

  private formatParenthesis(node: Parenthesis) {
    const inline = this.inlineBlock.isInlineBlock(node);

    if (inline) {
      this.layout.add(node.openParen);
      this.layout = this.formatSubExpression(node.children, inline);
      this.layout.add(WS.NO_SPACE, node.closeParen, WS.SPACE);
    } else {
      this.layout.add(node.openParen, WS.NEWLINE);

      if (isTabularStyle(this.cfg)) {
        this.layout.add(WS.INDENT);
        this.layout = this.formatSubExpression(node.children, inline);
      } else {
        this.layout.indentation.increaseBlockLevel();
        this.layout.add(WS.INDENT);
        this.layout = this.formatSubExpression(node.children, inline);
        this.layout.indentation.decreaseBlockLevel();
      }

      this.layout.add(WS.NEWLINE, WS.INDENT, node.closeParen, WS.SPACE);
    }
  }

  private formatBetweenPredicate(node: BetweenPredicate) {
    this.layout.add(this.show(node.betweenToken), WS.SPACE);
    this.layout = this.formatSubExpression(node.expr1);
    this.layout.add(WS.NO_SPACE, WS.SPACE, this.showNonTabular(node.andToken), WS.SPACE);
    this.layout = this.formatSubExpression(node.expr2);
    this.layout.add(WS.SPACE);
  }

  private formatClause(node: Clause) {
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

  private formatSetOperation(node: SetOperation) {
    this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node.name), WS.NEWLINE);

    this.layout.add(WS.INDENT);
    this.layout = this.formatSubExpression(node.children);
  }

  private formatLimitClause(node: LimitClause) {
    this.layout.add(WS.NEWLINE, WS.INDENT, this.show(node.limitToken));
    this.layout.indentation.increaseTopLevel();

    if (node.offset) {
      this.layout.add(WS.NEWLINE, WS.INDENT);
      this.layout = this.formatSubExpression(node.offset);
      this.layout.add(WS.NO_SPACE, ',', WS.SPACE);
      this.layout = this.formatSubExpression(node.count);
    } else {
      this.layout.add(WS.NEWLINE, WS.INDENT);
      this.layout = this.formatSubExpression(node.count);
    }
    this.layout.indentation.decreaseTopLevel();
  }

  private formatAllColumnsAsterisk(_node: AllColumnsAsterisk) {
    this.layout.add('*', WS.SPACE);
  }

  private formatLiteral(node: Literal) {
    this.layout.add(node.text, WS.SPACE);
  }

  private formatIdentifier(node: Identifier) {
    this.layout.add(node.text, WS.SPACE);
  }

  private formatParameter(node: Parameter) {
    this.layout.add(this.params.get(node), WS.SPACE);
  }

  /**
   * Formats an Operator onto query, following rules for specific characters
   */
  private formatOperator({ text }: Operator) {
    // special operator
    if (text === ':') {
      this.layout.add(WS.NO_SPACE, text, WS.SPACE);
      return;
    } else if (text === '.' || text === '::') {
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

  private formatComma(_node: Comma) {
    if (!this.inline) {
      this.layout.add(WS.NO_SPACE, ',', WS.NEWLINE, WS.INDENT);
    } else {
      this.layout.add(WS.NO_SPACE, ',', WS.SPACE);
    }
  }

  private formatLineComment(node: LineComment) {
    if (/\n/.test(node.precedingWhitespace || '')) {
      this.layout.add(WS.NEWLINE, WS.INDENT, node.text, WS.MANDATORY_NEWLINE, WS.INDENT);
    } else {
      this.layout.add(WS.NO_NEWLINE, WS.SPACE, node.text, WS.MANDATORY_NEWLINE, WS.INDENT);
    }
  }

  private formatBlockComment(node: BlockComment) {
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

  private formatSubExpression(nodes: AstNode[], inline = this.inline): Layout {
    return new ExpressionFormatter({
      cfg: this.cfg,
      params: this.params,
      layout: this.layout,
      inline,
    }).format(nodes);
  }

  private formatKeywordNode(node: Keyword): void {
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

  private formatJoin(node: Keyword) {
    if (isTabularStyle(this.cfg)) {
      // in tabular style JOINs are at the same level as clauses
      this.layout.indentation.decreaseTopLevel();
      this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node), WS.SPACE);
      this.layout.indentation.increaseTopLevel();
    } else {
      this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node), WS.SPACE);
    }
  }

  private formatKeyword(node: Keyword) {
    this.layout.add(this.showKw(node), WS.SPACE);
  }

  private formatDependentClause(node: Keyword) {
    this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node), WS.SPACE);
  }

  private formatLogicalOperator(node: Keyword) {
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

  private formatCaseStart(node: Keyword) {
    this.layout.indentation.increaseBlockLevel();
    this.layout.add(this.showKw(node), WS.NEWLINE, WS.INDENT);
  }

  private formatCaseEnd(node: Keyword) {
    this.formatMultilineBlockEnd(node);
  }

  private formatMultilineBlockEnd(node: Keyword) {
    this.layout.indentation.decreaseBlockLevel();

    this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node), WS.SPACE);
  }

  private showKw({ tokenType, text, raw }: Keyword): string {
    return this.show({ type: tokenType, text, raw, start: 0, end: Infinity });
  }

  private show(token: Token): string {
    if (isTabularToken(token)) {
      return toTabularFormat(this.showToken(token), this.cfg.indentStyle);
    } else {
      return this.showToken(token);
    }
  }

  // Like show(), but skips tabular formatting
  private showNonTabular(token: Token): string {
    return this.showToken(token);
  }

  // don't call this directly, always use show() or showNonTabular() instead.
  private showToken(token: Token): string {
    if (isReserved(token)) {
      switch (this.cfg.keywordCase) {
        case 'preserve':
          return equalizeWhitespace(token.raw);
        case 'upper':
          return token.text;
        case 'lower':
          return token.text.toLowerCase();
      }
    } else {
      return token.text;
    }
  }
}
