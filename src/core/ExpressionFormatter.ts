import type { FormatOptions } from 'src/types';
import { equalizeWhitespace } from 'src/utils';

import Indentation from './Indentation';
import InlineBlock from './InlineBlock';
import Params from './Params';
import { isReserved, type Token, TokenType } from './token';
import {
  AllColumnsAsterisk,
  ArraySubscript,
  AstNode,
  BetweenPredicate,
  BinaryClause,
  Clause,
  FunctionCall,
  LimitClause,
  Parenthesis,
} from './ast';
import { indentString } from './config';
import WhitespaceBuilder, { WS } from './WhitespaceBuilder';

/** Formats a generic SQL expression */
export default class ExpressionFormatter {
  private cfg: FormatOptions;
  private indentation: Indentation;
  private inlineBlock: InlineBlock;
  private params: Params;
  private query: WhitespaceBuilder;

  private inline = false;
  private nodes: AstNode[] = [];
  private index = -1;

  constructor(cfg: FormatOptions, params: Params, { inline = false }: { inline?: boolean } = {}) {
    this.cfg = cfg;
    this.inline = inline;
    this.indentation = new Indentation(indentString(cfg));
    this.inlineBlock = new InlineBlock(this.cfg.expressionWidth);
    this.params = params;
    this.query = new WhitespaceBuilder(this.indentation);
  }

  public format(nodes: AstNode[]): WhitespaceBuilder {
    this.nodes = nodes;

    for (this.index = 0; this.index < this.nodes.length; this.index++) {
      const node = this.nodes[this.index];
      switch (node.type) {
        case 'function_call':
          this.formatFunctionCall(node);
          break;
        case 'array_subscript':
          this.formatArraySubscript(node);
          break;
        case 'parenthesis':
          this.formatParenthesis(node);
          break;
        case 'between_predicate':
          this.formatBetweenPredicate(node);
          break;
        case 'clause':
          this.formatClause(node);
          break;
        case 'binary_clause':
          this.formatBinaryClause(node);
          break;
        case 'limit_clause':
          this.formatLimitClause(node);
          break;
        case 'all_columns_asterisk':
          this.formatAllColumnsAsterisk(node);
          break;
        case 'token':
          this.formatToken(node.token);
          break;
      }
    }
    return this.query;
  }

  private formatFunctionCall(node: FunctionCall) {
    this.query.add(this.show(node.nameToken));
    this.formatParenthesis(node.parenthesis);
  }

  private formatArraySubscript(node: ArraySubscript) {
    this.query.add(this.show(node.arrayToken));
    this.formatParenthesis(node.parenthesis);
  }

  private formatParenthesis(node: Parenthesis) {
    const inline = this.inlineBlock.isInlineBlock(node);

    const formattedSql = new ExpressionFormatter(this.cfg, this.params, {
      inline,
    })
      .format(node.children)
      .toString()
      .trimEnd();

    if (inline) {
      this.query.add(node.openParen, formattedSql, node.closeParen, WS.SPACE);
    } else {
      this.query.add(node.openParen);

      formattedSql.split(/\n/).forEach(line => {
        this.query.add(WS.NEWLINE, WS.INDENT, WS.SINGLE_INDENT, line);
      });

      this.query.add(WS.NEWLINE, WS.INDENT, node.closeParen, WS.SPACE);
    }
  }

  private formatBetweenPredicate(node: BetweenPredicate) {
    this.query.add(
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
    const formattedSql = new ExpressionFormatter(this.cfg, this.params, { inline: this.inline })
      .format(node.children)
      .toString()
      .trimEnd();

    this.indentation.decreaseTopLevel();
    this.query.add(WS.NEWLINE, WS.INDENT, this.show(node.nameToken));
    this.indentation.increaseTopLevel();

    if (formattedSql.length > 0) {
      formattedSql.split(/\n/).forEach(line => {
        this.query.add(WS.NEWLINE, WS.INDENT, line);
      });
    }

    this.query.add(WS.SPACE);
  }

  private formatBinaryClause(node: BinaryClause) {
    const formattedSql = new ExpressionFormatter(this.cfg, this.params, { inline: this.inline })
      .format(node.children)
      .toString()
      .trimEnd();

    this.indentation.decreaseTopLevel();
    this.query.add(WS.NEWLINE, WS.INDENT, this.show(node.nameToken));

    if (formattedSql.length > 0) {
      formattedSql.split(/\n/).forEach(line => {
        this.query.add(WS.NEWLINE, WS.INDENT, line);
      });
    }

    this.query.add(WS.NEWLINE, WS.INDENT);
  }

  private formatLimitClause(node: LimitClause) {
    this.indentation.decreaseTopLevel();
    this.query.add(WS.NEWLINE, WS.INDENT, this.show(node.limitToken));
    this.indentation.increaseTopLevel();

    if (node.offsetToken) {
      this.query.add(
        WS.NEWLINE,
        WS.INDENT,
        this.show(node.offsetToken),
        ',',
        WS.SPACE,
        this.show(node.countToken),
        WS.SPACE
      );
    } else {
      this.query.add(WS.NEWLINE, WS.INDENT, this.show(node.countToken), WS.SPACE);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private formatAllColumnsAsterisk(node: AllColumnsAsterisk) {
    this.query.add('*', WS.SPACE);
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
      case TokenType.RESERVED_JOIN_CONDITION:
        return this.formatJoinCondition(token);
      case TokenType.RESERVED_LOGICAL_OPERATOR:
        return this.formatLogicalOperator(token);
      case TokenType.RESERVED_KEYWORD:
        return this.formatKeyword(token);
      case TokenType.RESERVED_CASE_START:
        return this.formatCaseStart(token);
      case TokenType.RESERVED_CASE_END:
        return this.formatCaseEnd(token);
      case TokenType.PARAMETER:
        return this.formatParameter(token);
      case TokenType.OPERATOR:
        return this.formatOperator(token);
      case TokenType.IDENT:
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
    this.query.add(this.show(token), WS.SPACE);
  }

  /** Formats a line comment onto query */
  private formatLineComment(token: Token) {
    this.query.add(this.show(token), WS.NEWLINE, WS.INDENT);
  }

  /** Formats a block comment onto query */
  private formatBlockComment(token: Token) {
    this.query.add(WS.NEWLINE, WS.INDENT, this.indentComment(token.value), WS.NEWLINE, WS.INDENT);
  }

  /** Aligns comment to current indentation level */
  private indentComment(comment: string): string {
    return comment.replace(/\n[ \t]*/gu, '\n' + this.indentation.getIndent() + ' ');
  }

  private formatJoin(token: Token) {
    this.query.add(WS.NEWLINE, WS.INDENT, this.show(token), WS.SPACE);
  }

  /**
   * Formats a Reserved Keyword onto query
   */
  private formatKeyword(token: Token) {
    this.query.add(this.show(token), WS.SPACE);
  }

  /**
   * Formats a Reserved Dependent Clause token onto query, supporting the keyword that precedes it
   */
  private formatDependentClause(token: Token) {
    this.query.add(WS.NEWLINE, WS.INDENT, this.show(token), WS.SPACE);
  }

  // Formats ON and USING keywords
  private formatJoinCondition(token: Token) {
    this.query.add(this.show(token), WS.SPACE);
  }

  /**
   * Formats an Operator onto query, following rules for specific characters
   */
  private formatOperator(token: Token) {
    // special operator
    if (token.value === ',') {
      this.formatComma(token);
      return;
    } else if (token.value === ':') {
      this.query.add(WS.NO_SPACE, this.show(token), WS.SPACE);
      return;
    } else if (token.value === '.') {
      this.query.add(WS.NO_SPACE, this.show(token));
      return;
    }

    // other operators
    if (this.cfg.denseOperators) {
      this.query.add(WS.NO_SPACE, this.show(token));
    } else {
      this.query.add(this.show(token), WS.SPACE);
    }
  }

  /**
   * Formats a Logical Operator onto query, joining boolean conditions
   */
  private formatLogicalOperator(token: Token) {
    if (this.cfg.logicalOperatorNewline === 'before') {
      this.query.add(WS.NEWLINE, WS.INDENT, this.show(token), WS.SPACE);
    } else {
      this.query.add(this.show(token), WS.NEWLINE, WS.INDENT);
    }
  }

  private formatCaseStart(token: Token) {
    this.indentation.increaseBlockLevel();
    this.query.add(this.show(token), WS.NEWLINE, WS.INDENT);
  }

  private formatCaseEnd(token: Token) {
    this.formatMultilineBlockEnd(token);
  }

  private formatMultilineBlockEnd(token: Token) {
    this.indentation.decreaseBlockLevel();

    this.query.add(WS.NEWLINE, WS.INDENT, this.show(token), WS.SPACE);
  }

  /**
   * Formats a parameter placeholder item onto query, to be replaced with the value of the placeholder
   */
  private formatParameter(token: Token) {
    this.query.add(this.params.get(token), WS.SPACE);
  }

  /**
   * Formats a comma Operator onto query, ending line unless in an Inline Block
   */
  private formatComma(token: Token) {
    if (!this.inline) {
      this.query.add(WS.NO_SPACE, this.show(token), WS.NEWLINE, WS.INDENT);
    } else {
      this.query.add(WS.NO_SPACE, this.show(token), WS.SPACE);
    }
  }

  private show(token: Token): string {
    return this.showToken(token);
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
