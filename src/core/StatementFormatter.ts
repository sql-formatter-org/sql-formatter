import type { FormatOptions } from 'src/types';
import { equalizeWhitespace } from 'src/utils';

import Indentation from './Indentation';
import InlineBlock from './InlineBlock';
import Params from './Params';
import { isReserved, isCommand, isToken, type Token, TokenType, EOF_TOKEN } from './token';
import toTabularFormat from './tabularStyle';
import AliasAs from './AliasAs';
import AsTokenFactory from './AsTokenFactory';
import { type Statement } from './Parser';
import { indentString, isTabularStyle } from './config';
import WhitespaceBuilder, { WS } from './WhitespaceBuilder';

/** Formats single SQL statement */
export default class StatementFormatter {
  private cfg: FormatOptions;
  private indentation: Indentation;
  private inlineBlock: InlineBlock;
  private aliasAs: AliasAs;
  private params: Params;
  private asTokenFactory: AsTokenFactory;
  private query: WhitespaceBuilder;

  private currentNewline = true;
  private previousReservedToken: Token = EOF_TOKEN;
  private previousCommandToken: Token = EOF_TOKEN;
  private tokens: Token[] = [];
  private index = -1;

  constructor(cfg: FormatOptions, params: Params, asTokenFactory: AsTokenFactory) {
    this.cfg = cfg;
    this.indentation = new Indentation(indentString(cfg));
    this.inlineBlock = new InlineBlock(this.cfg.expressionWidth);
    this.aliasAs = new AliasAs(this.cfg.aliasAs, this);
    this.params = params;
    this.asTokenFactory = asTokenFactory;
    this.query = new WhitespaceBuilder(this.indentation);
  }

  public format(statement: Statement): string {
    this.tokens = statement.tokens;

    for (this.index = 0; this.index < this.tokens.length; this.index++) {
      const token = this.tokens[this.index];

      // if token is a Reserved Keyword, Command, Binary Command, Dependent Clause, Logical Operator, CASE, END
      if (isReserved(token)) {
        this.previousReservedToken = token;
        if (token.type === TokenType.RESERVED_COMMAND) {
          this.previousCommandToken = token;
        }
      }

      this.formatToken(token);
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
        this.currentNewline = this.checkNewline(token);
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
      case TokenType.OPEN_PAREN:
        return this.formatBlockStart(token);
      case TokenType.CLOSE_PAREN:
        return this.formatBlockEnd(token);
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
   * Formats word tokens + any potential AS tokens for aliases
   */
  private formatWord(token: Token) {
    if (this.aliasAs.shouldAddBefore(token)) {
      this.query.add(this.show(this.asTokenFactory.token()), WS.SPACE);
    }

    this.query.add(this.show(token), WS.SPACE);

    if (this.aliasAs.shouldAddAfter()) {
      this.query.add(this.show(this.asTokenFactory.token()), WS.SPACE);
    }
  }

  /**
   * Checks if a newline should currently be inserted
   */
  private checkNewline(token: Token): boolean {
    const nextTokens = this.tokensUntilNextCommandOrQueryEnd();

    // auto break if SELECT includes CASE statements
    if (this.isWithinSelect() && nextTokens.some(isToken.CASE)) {
      return true;
    }

    switch (this.cfg.multilineLists) {
      case 'always':
        return true;
      case 'avoid':
        return false;
      case 'expressionWidth':
        return this.inlineWidth(token, nextTokens) > this.cfg.expressionWidth;
      default: // multilineLists mode is a number
        return (
          this.countClauses(nextTokens) > this.cfg.multilineLists ||
          this.inlineWidth(token, nextTokens) > this.cfg.expressionWidth
        );
    }
  }

  private inlineWidth(token: Token, tokens: Token[]): number {
    const tokensString = tokens.map(({ value }) => (value === ',' ? value + ' ' : value)).join('');
    return `${token.whitespaceBefore}${token.value} ${tokensString}`.length;
  }

  /**
   * Counts comma-separated clauses (doesn't count commas inside blocks)
   * Note: There's always at least one clause.
   */
  private countClauses(tokens: Token[]): number {
    let count = 1;
    let openBlocks = 0;
    for (const { type, value } of tokens) {
      if (value === ',' && openBlocks === 0) {
        count++;
      }
      if (type === TokenType.OPEN_PAREN) {
        openBlocks++;
      }
      if (type === TokenType.CLOSE_PAREN) {
        openBlocks--;
      }
    }
    return count;
  }

  /** get all tokens between current token and next Reserved Command or query end */
  private tokensUntilNextCommandOrQueryEnd(): Token[] {
    const tail = this.tokens.slice(this.index + 1);
    return tail.slice(
      0,
      tail.length ? tail.findIndex(token => isCommand(token) || token.value === ';') : undefined
    );
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

    // indent tabular formats, except when preceding a (
    if (isTabularStyle(this.cfg)) {
      if (this.tokenLookAhead().value !== '(') {
        this.indentation.increaseTopLevel();
      }
    } else {
      this.indentation.increaseTopLevel();
    }

    if (this.currentNewline && !isTabularStyle(this.cfg)) {
      this.query.add(this.show(token), WS.NEWLINE, WS.INDENT);
    } else {
      this.query.add(this.show(token), WS.SPACE);
    }
  }

  /**
   * Formats a Reserved Binary Command onto query, joining neighbouring tokens
   */
  private formatBinaryCommand(token: Token) {
    const isJoin = /JOIN/i.test(token.value); // check if token contains JOIN
    if (!isJoin || isTabularStyle(this.cfg)) {
      // decrease for boolean set operators or in tabular mode
      this.indentation.decreaseTopLevel();
    }
    if (isJoin) {
      this.query.add(WS.NEWLINE, WS.INDENT, this.show(token), WS.SPACE);
    } else {
      this.query.add(WS.NEWLINE, WS.INDENT, this.show(token), WS.NEWLINE, WS.INDENT);
    }
  }

  /**
   * Formats a Reserved Keyword onto query, skipping AS if disabled
   */
  private formatKeyword(token: Token) {
    if (isToken.AS(token) && this.aliasAs.shouldRemove()) {
      return;
    }

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

    if (isTabularStyle(this.cfg)) {
      this.indentation.decreaseTopLevel();
    }

    if (this.cfg.logicalOperatorNewline === 'before') {
      if (this.currentNewline) {
        this.query.add(WS.NEWLINE, WS.INDENT, this.show(token), WS.SPACE);
      } else {
        this.query.add(this.show(token), WS.SPACE);
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (this.currentNewline) {
        this.query.add(this.show(token), WS.NEWLINE, WS.INDENT);
      } else {
        this.query.add(this.show(token));
      }
    }
  }

  private formatBlockStart(token: Token) {
    // Take out the preceding space unless there was whitespace there in the original query
    // or another opening parens or line comment
    const preserveWhitespaceFor = [
      TokenType.OPEN_PAREN,
      TokenType.LINE_COMMENT,
      TokenType.OPERATOR,
    ];
    if (
      token.whitespaceBefore?.length === 0 &&
      !preserveWhitespaceFor.includes(this.tokenLookBehind().type)
    ) {
      this.query.add(WS.NO_SPACE, this.show(token));
    } else if (!this.cfg.newlineBeforeOpenParen) {
      this.query.add(WS.NO_NEWLINE, WS.SPACE, this.show(token));
    } else {
      this.query.add(this.show(token));
    }
    this.inlineBlock.beginIfPossible(this.tokens, this.index);

    if (!this.inlineBlock.isActive()) {
      this.indentation.increaseBlockLevel();
      this.query.add(WS.NEWLINE, WS.INDENT);
    }
  }

  private formatBlockEnd(token: Token) {
    if (this.inlineBlock.isActive()) {
      this.inlineBlock.end();
      this.query.add(WS.NO_SPACE, this.show(token), WS.SPACE);
    } else {
      this.formatMultilineBlockEnd(token);
    }
  }

  private formatCaseStart(token: Token) {
    this.indentation.increaseBlockLevel();
    if (this.cfg.multilineLists === 'always') {
      this.query.add(this.show(token), WS.NEWLINE, WS.INDENT);
    } else {
      this.query.add(this.show(token), WS.SPACE);
    }
  }

  private formatCaseEnd(token: Token) {
    this.formatMultilineBlockEnd(token);
  }

  private formatMultilineBlockEnd(token: Token) {
    this.indentation.decreaseBlockLevel();

    if (isTabularStyle(this.cfg)) {
      // +1 extra indentation step for the closing paren
      this.query.add(WS.NEWLINE, WS.INDENT, WS.SINGLE_INDENT, this.show(token), WS.SPACE);
    } else if (this.cfg.newlineBeforeCloseParen) {
      this.query.add(WS.NEWLINE, WS.INDENT, this.show(token), WS.SPACE);
    } else {
      this.query.add(WS.NO_NEWLINE, WS.SPACE, this.show(token), WS.SPACE);
    }
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
    if (
      !this.inlineBlock.isActive() &&
      !isToken.LIMIT(this.getPreviousReservedToken()) &&
      this.currentNewline
    ) {
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
    if (this.isTabularToken(token)) {
      return toTabularFormat(this.showToken(token), this.cfg.indentStyle);
    } else {
      return this.showToken(token);
    }
  }

  // These token types can be formatted in tabular style
  private isTabularToken(token: Token): boolean {
    return (
      token.type === TokenType.RESERVED_LOGICAL_OPERATOR ||
      token.type === TokenType.RESERVED_DEPENDENT_CLAUSE ||
      token.type === TokenType.RESERVED_COMMAND ||
      token.type === TokenType.RESERVED_BINARY_COMMAND
    );
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
  public getPreviousReservedToken(): Token {
    return this.previousReservedToken;
  }

  /** True when currently within SELECT command */
  public isWithinSelect(): boolean {
    return isToken.SELECT(this.previousCommandToken);
  }

  /** Fetches nth previous token from the token stream */
  public tokenLookBehind(n = 1): Token {
    return this.tokens[this.index - n] || EOF_TOKEN;
  }

  /** Fetches nth next token from the token stream */
  public tokenLookAhead(n = 1): Token {
    return this.tokens[this.index + n] || EOF_TOKEN;
  }
}
