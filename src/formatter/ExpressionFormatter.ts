import type { FormatOptions } from 'src/types';
import { equalizeWhitespace } from 'src/utils';

import Params from 'src/formatter/Params';
import { isTabularStyle } from 'src/formatter/config';
import { isReserved, type Token, TokenType } from 'src/lexer/token';
import {
  AllColumnsAsterisk,
  ArraySubscript,
  AstNode,
  BetweenPredicate,
  BinaryClause,
  Clause,
  FunctionCall,
  LimitClause,
  NodeType,
  Parenthesis,
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
      const node = this.nodes[this.index];
      switch (node.type) {
        case NodeType.function_call:
          this.formatFunctionCall(node);
          break;
        case NodeType.array_subscript:
          this.formatArraySubscript(node);
          break;
        case NodeType.parenthesis:
          this.formatParenthesis(node);
          break;
        case NodeType.between_predicate:
          this.formatBetweenPredicate(node);
          break;
        case NodeType.clause:
          this.formatClause(node);
          break;
        case NodeType.binary_clause:
          this.formatBinaryClause(node);
          break;
        case NodeType.limit_clause:
          this.formatLimitClause(node);
          break;
        case NodeType.all_columns_asterisk:
          this.formatAllColumnsAsterisk(node);
          break;
        case NodeType.token:
          this.formatToken(node.token);
          break;
      }
    }
    return this.layout;
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
    this.layout.add(
      this.show(node.betweenToken),
      WS.SPACE,
      this.show(node.expr1),
      WS.SPACE,
      this.show(node.andToken),
      WS.SPACE,
      this.show(node.expr2),
      WS.SPACE
    );
  }

  private formatClause(node: Clause) {
    if (isTabularStyle(this.cfg)) {
      this.layout.add(WS.NEWLINE, WS.INDENT, this.show(node.nameToken), WS.SPACE);
    } else {
      this.layout.add(WS.NEWLINE, WS.INDENT, this.show(node.nameToken), WS.NEWLINE);
    }
    this.layout.indentation.increaseTopLevel();

    if (!isTabularStyle(this.cfg)) {
      this.layout.add(WS.INDENT);
    }
    this.layout = this.formatSubExpression(node.children);

    this.layout.indentation.decreaseTopLevel();
  }

  private formatBinaryClause(node: BinaryClause) {
    this.layout.indentation.decreaseTopLevel();
    this.layout.add(WS.NEWLINE, WS.INDENT, this.show(node.nameToken), WS.NEWLINE);

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

  private formatSubExpression(nodes: AstNode[], inline = this.inline): Layout {
    return new ExpressionFormatter({
      cfg: this.cfg,
      params: this.params,
      layout: this.layout,
      inline,
    }).format(nodes);
  }

  private formatToken(token: Token): void {
    switch (token.type) {
      case TokenType.LINE_COMMENT:
        return this.formatLineComment(token);
      case TokenType.BLOCK_COMMENT:
        return this.formatBlockComment(token);
      case TokenType.RESERVED_JOIN:
        return this.formatJoin(token);
      case TokenType.RESERVED_DEPENDENT_CLAUSE:
        return this.formatDependentClause(token);
      case TokenType.RESERVED_LOGICAL_OPERATOR:
        return this.formatLogicalOperator(token);
      case TokenType.RESERVED_KEYWORD:
      case TokenType.RESERVED_FUNCTION_NAME:
        return this.formatKeyword(token);
      case TokenType.RESERVED_CASE_START:
        return this.formatCaseStart(token);
      case TokenType.RESERVED_CASE_END:
        return this.formatCaseEnd(token);
      case TokenType.NAMED_PARAMETER:
      case TokenType.QUOTED_PARAMETER:
      case TokenType.INDEXED_PARAMETER:
      case TokenType.POSITIONAL_PARAMETER:
        return this.formatParameter(token);
      case TokenType.COMMA:
        return this.formatComma(token);
      case TokenType.OPERATOR:
        return this.formatOperator(token);
      case TokenType.IDENTIFIER:
      case TokenType.QUOTED_IDENTIFIER:
      case TokenType.STRING:
      case TokenType.NUMBER:
      case TokenType.VARIABLE:
        return this.formatWord(token);
      default:
        throw new Error(`Unexpected token type: ${token.type}`);
    }
  }

  /**
   * Formats ident/string/number/variable tokens
   */
  private formatWord(token: Token) {
    this.layout.add(this.show(token), WS.SPACE);
  }

  /** Formats a line comment onto query */
  private formatLineComment(token: Token) {
    this.layout.add(this.show(token), WS.NEWLINE, WS.INDENT);
  }

  /** Formats a block comment onto query */
  private formatBlockComment(token: Token) {
    this.splitBlockComment(token.value).forEach(line => {
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

  private formatJoin(token: Token) {
    if (isTabularStyle(this.cfg)) {
      // in tabular style JOINs are at the same level as clauses
      this.layout.indentation.decreaseTopLevel();
      this.layout.add(WS.NEWLINE, WS.INDENT, this.show(token), WS.SPACE);
      this.layout.indentation.increaseTopLevel();
    } else {
      this.layout.add(WS.NEWLINE, WS.INDENT, this.show(token), WS.SPACE);
    }
  }

  /**
   * Formats a Reserved Keyword onto query
   */
  private formatKeyword(token: Token) {
    this.layout.add(this.show(token), WS.SPACE);
  }

  /**
   * Formats a Reserved Dependent Clause token onto query, supporting the keyword that precedes it
   */
  private formatDependentClause(token: Token) {
    this.layout.add(WS.NEWLINE, WS.INDENT, this.show(token), WS.SPACE);
  }

  /**
   * Formats an Operator onto query, following rules for specific characters
   */
  private formatOperator(token: Token) {
    // special operator
    if (token.value === ':') {
      this.layout.add(WS.NO_SPACE, this.show(token), WS.SPACE);
      return;
    } else if (token.value === '.' || token.value === '::') {
      this.layout.add(WS.NO_SPACE, this.show(token));
      return;
    }

    // other operators
    if (this.cfg.denseOperators) {
      this.layout.add(WS.NO_SPACE, this.show(token));
    } else {
      this.layout.add(this.show(token), WS.SPACE);
    }
  }

  /**
   * Formats a Logical Operator onto query, joining boolean conditions
   */
  private formatLogicalOperator(token: Token) {
    if (this.cfg.logicalOperatorNewline === 'before') {
      if (isTabularStyle(this.cfg)) {
        // In tabular style AND/OR is placed on the same level as clauses
        this.layout.indentation.decreaseTopLevel();
        this.layout.add(WS.NEWLINE, WS.INDENT, this.show(token), WS.SPACE);
        this.layout.indentation.increaseTopLevel();
      } else {
        this.layout.add(WS.NEWLINE, WS.INDENT, this.show(token), WS.SPACE);
      }
    } else {
      this.layout.add(this.show(token), WS.NEWLINE, WS.INDENT);
    }
  }

  private formatCaseStart(token: Token) {
    this.layout.indentation.increaseBlockLevel();
    this.layout.add(this.show(token), WS.NEWLINE, WS.INDENT);
  }

  private formatCaseEnd(token: Token) {
    this.formatMultilineBlockEnd(token);
  }

  private formatMultilineBlockEnd(token: Token) {
    this.layout.indentation.decreaseBlockLevel();

    this.layout.add(WS.NEWLINE, WS.INDENT, this.show(token), WS.SPACE);
  }

  /**
   * Formats a parameter placeholder item onto query, to be replaced with the value of the placeholder
   */
  private formatParameter(token: Token) {
    this.layout.add(this.params.get(token), WS.SPACE);
  }

  /**
   * Formats a comma Operator onto query, ending line unless in an Inline Block
   */
  private formatComma(token: Token) {
    if (!this.inline) {
      this.layout.add(WS.NO_SPACE, this.show(token), WS.NEWLINE, WS.INDENT);
    } else {
      this.layout.add(WS.NO_SPACE, this.show(token), WS.SPACE);
    }
  }

  private show(token: Token): string {
    if (isTabularToken(token)) {
      return toTabularFormat(this.showToken(token), this.cfg.indentStyle);
    } else {
      return this.showToken(token);
    }
  }

  // don't call this directly, always use show() instead.
  private showToken(token: Token): string {
    if (isReserved(token)) {
      switch (this.cfg.keywordCase) {
        case 'preserve':
          return equalizeWhitespace(token.text);
        case 'upper':
          return token.value;
        case 'lower':
          return token.value.toLowerCase();
      }
    } else {
      return token.value;
    }
  }
}
