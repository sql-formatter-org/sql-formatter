import type { FormatOptions } from 'src/types';
import { equalizeWhitespace } from 'src/utils';

import Indentation from './Indentation';
import InlineBlock from './InlineBlock';
import Params from './Params';
import { isReserved, isToken, type Token, TokenType, EOF_TOKEN } from './token';
import { AstNode, isTokenNode, Parenthesis } from './ast';
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
  private previousReservedToken: Token = EOF_TOKEN;
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

  public format(nodes: AstNode[]): string {
    this.nodes = nodes;

    for (this.index = 0; this.index < this.nodes.length; this.index++) {
      const node = this.nodes[this.index];
      if (isTokenNode(node)) {
        const { token } = node;
        // if token is a Reserved Keyword, Command, Binary Command, Dependent Clause, Logical Operator, CASE, END
        if (isReserved(token)) {
          this.previousReservedToken = token;
        }

        this.formatToken(token);
      } else {
        this.formatParenthesis(node);
      }
    }
    return this.query.toString();
  }

  private formatToken(token: Token): void {
    switch (token.type) {
      case TokenType.LINE_COMMENT:
        return this.formatLineComment(token);
      case TokenType.BLOCK_COMMENT:
        return this.formatBlockComment(token);
      case TokenType.RESERVED_COMMAND:
        return this.formatCommand(token);
      case TokenType.RESERVED_BINARY_COMMAND:
        return this.formatBinaryCommand(token);
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

  /**
   * Formats a Reserved Command onto query, increasing indentation level where necessary
   */
  private formatCommand(token: Token) {
    this.indentation.decreaseTopLevel();

    this.query.add(WS.NEWLINE, WS.INDENT);

    this.indentation.increaseTopLevel();

    this.query.add(this.show(token), WS.NEWLINE, WS.INDENT);
  }

  /**
   * Formats a Reserved Binary Command onto query, joining neighbouring tokens
   */
  private formatBinaryCommand(token: Token) {
    const isJoin = /JOIN/i.test(token.value); // check if token contains JOIN
    if (!isJoin) {
      // decrease for boolean set operators
      this.indentation.decreaseTopLevel();
    }
    if (isJoin) {
      this.query.add(WS.NEWLINE, WS.INDENT, this.show(token), WS.SPACE);
    } else {
      this.query.add(WS.NEWLINE, WS.INDENT, this.show(token), WS.NEWLINE, WS.INDENT);
    }
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
    } else if (token.value === ';') {
      this.formatQuerySeparator(token);
      return;
    } else if (['$', '['].includes(token.value)) {
      this.query.add(this.show(token));
      return;
    } else if ([':', ']'].includes(token.value)) {
      this.query.add(WS.NO_SPACE, this.show(token), WS.SPACE);
      return;
    } else if (['.', '{', '}', '`'].includes(token.value)) {
      this.query.add(WS.NO_SPACE, this.show(token));
      return;
    }

    // other operators
    // in dense operators mode do not trim whitespace if SELECT *
    if (this.cfg.denseOperators && this.tokenLookBehind().type !== TokenType.RESERVED_COMMAND) {
      this.query.add(WS.NO_SPACE, this.show(token));
    } else {
      this.query.add(this.show(token), WS.SPACE);
    }
  }

  /**
   * Formats a Logical Operator onto query, joining boolean conditions
   */
  private formatLogicalOperator(token: Token) {
    // ignore AND when BETWEEN x [AND] y
    if (isToken.AND(token) && isToken.BETWEEN(this.tokenLookBehind(2))) {
      this.query.add(this.show(token), WS.SPACE);
      return;
    }

    if (this.cfg.logicalOperatorNewline === 'before') {
      this.query.add(WS.NEWLINE, WS.INDENT, this.show(token), WS.SPACE);
    } else {
      this.query.add(this.show(token), WS.NEWLINE, WS.INDENT);
    }
  }

  private formatParenthesis(node: Parenthesis) {
    const inline = this.inlineBlock.isInlineBlock(node);

    const formattedSql = new ExpressionFormatter(this.cfg, this.params, {
      inline,
    })
      .format(node.children)
      .trimEnd();

    if (inline) {
      if (!this.isSpaceBeforeParenthesis(node)) {
        this.query.add(WS.NO_SPACE);
      }
      this.query.add(node.openParen, formattedSql, node.closeParen, WS.SPACE);
    } else {
      if (!this.isSpaceBeforeParenthesis(node)) {
        this.query.add(WS.NO_SPACE);
      }
      this.query.add(node.openParen);

      formattedSql.split(/\n/).forEach(line => {
        this.query.add(WS.NEWLINE, WS.INDENT, WS.SINGLE_INDENT, line);
      });

      this.query.add(WS.NEWLINE, WS.INDENT, node.closeParen, WS.SPACE);
    }
  }

  // We add space before parenthesis when:
  // - there's space in original SQL or
  // - there's operator or line comment before the parenthesis
  private isSpaceBeforeParenthesis(node: Parenthesis): boolean {
    return (
      node.hasWhitespaceBefore ||
      [TokenType.LINE_COMMENT, TokenType.OPERATOR].includes(this.tokenLookBehind().type)
    );
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
    if (!this.inline && !isToken.LIMIT(this.getPreviousReservedToken())) {
      this.query.add(WS.NO_SPACE, this.show(token), WS.NEWLINE, WS.INDENT);
    } else {
      this.query.add(WS.NO_SPACE, this.show(token), WS.SPACE);
    }
  }

  private formatQuerySeparator(token: Token) {
    if (this.cfg.newlineBeforeSemicolon) {
      this.query.add(WS.NEWLINE, this.show(token));
    } else {
      this.query.add(WS.NO_SPACE, this.show(token));
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

  /** Returns the latest encountered reserved keyword token */
  private getPreviousReservedToken(): Token {
    return this.previousReservedToken;
  }

  /** Fetches nth previous token from the token stream */
  private tokenLookBehind(n = 1): Token {
    return this.tokenLookAhead(-n);
  }

  /** Fetches nth next token from the token stream */
  private tokenLookAhead(n = 1): Token {
    const node: AstNode | undefined = this.nodes[this.index + n];
    if (node && isTokenNode(node)) {
      return node.token;
    } else {
      return EOF_TOKEN;
    }
  }
}
