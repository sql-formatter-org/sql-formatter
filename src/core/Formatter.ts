import Indentation from './Indentation';
import InlineBlock from './InlineBlock';
import Params from './Params';
import { trimSpacesEnd } from '../utils';
import { isReserved, isCommand, isToken, Token, TokenType, EOF_TOKEN } from './token';
import Tokenizer from './Tokenizer';
import { FormatOptions } from '../types';
import formatCommaPositions from './formatCommaPositions';
import formatAliasPositions from './formatAliasPositions';
import { toTabularToken, replaceTabularPlaceholders } from './tabularStyle';
import AliasAs from './AliasAs';
import AsTokenFactory from './AsTokenFactory';

const TABULAR_INDENT = ' '.repeat(10);

/** Main formatter class that produces a final output string from list of tokens */
export default class Formatter {
  private cfg: FormatOptions;
  private indentation: Indentation;
  private inlineBlock: InlineBlock;
  private aliasAs: AliasAs;
  private params: Params;
  private asTokenFactory: AsTokenFactory;

  private currentNewline = true;
  private previousReservedToken: Token = EOF_TOKEN;
  private previousCommandToken: Token = EOF_TOKEN;
  protected tokens: Token[] = [];
  protected index = -1;

  constructor(cfg: FormatOptions) {
    this.cfg = cfg;
    this.indentation = new Indentation(this.isTabularStyle() ? TABULAR_INDENT : this.cfg.indent);
    this.inlineBlock = new InlineBlock(this.cfg.lineWidth);
    this.aliasAs = new AliasAs(this.cfg.aliasAs, this);
    this.params = new Params(this.cfg.params);
    this.asTokenFactory = new AsTokenFactory(this.cfg.keywordCase);
  }

  /**
   * SQL Tokenizer for this formatter, provided by subclasses.
   */
  protected tokenizer(): Tokenizer {
    throw new Error('tokenizer() not implemented by subclass');
  }

  /**
   * Reprocess and modify a token based on parsed context.
   * Subclasses can override this to modify tokens during formatting.
   * @param {Token} token - The token to modify
   * @return {Token} new token or the original
   */
  protected tokenOverride(token: Token): Token {
    return token;
  }

  /**
   * Formats an SQL query.
   * @param {string} query - The SQL query string to be formatted
   * @return {string} The formatter query
   */
  public format(query: string): string {
    this.tokens = this.tokenizer().tokenize(query);
    this.asTokenFactory = new AsTokenFactory(this.cfg.keywordCase, this.tokens);
    const formattedQuery = this.getFormattedQueryFromTokens();
    const finalQuery = this.postFormat(formattedQuery);

    return finalQuery.replace(/^\n*/u, '').trimEnd();
  }

  /**
   * Does post-processing on the formatted query.
   */
  private postFormat(query: string): string {
    if (this.cfg.tabulateAlias) {
      query = formatAliasPositions(query);
    }
    if (this.cfg.commaPosition === 'before' || this.cfg.commaPosition === 'tabular') {
      query = formatCommaPositions(query, this.cfg);
    }

    return query;
  }

  /**
   * Performs main construction of query from token list, delegates to other methods for formatting based on token criteria
   */
  private getFormattedQueryFromTokens(): string {
    let formattedQuery = '';

    for (this.index = 0; this.index < this.tokens.length; this.index++) {
      let token = this.tokenOverride(this.tokens[this.index]);

      // if token is a Reserved Keyword, Command, Binary Command, Dependent Clause, Logical Operator
      if (isReserved(token)) {
        this.previousReservedToken = token;
        if (
          token.type !== TokenType.RESERVED_KEYWORD &&
          token.type !== TokenType.RESERVED_JOIN_CONDITION
        ) {
          // convert Reserved Command or Logical Operator to tabular format if needed
          token = toTabularToken(token, this.cfg.indentStyle);
        }
        if (token.type === TokenType.RESERVED_COMMAND) {
          this.previousCommandToken = token;
        }
      }

      if (token.type === TokenType.LINE_COMMENT) {
        formattedQuery = this.formatLineComment(token, formattedQuery);
      } else if (token.type === TokenType.BLOCK_COMMENT) {
        formattedQuery = this.formatBlockComment(token, formattedQuery);
      } else if (token.type === TokenType.RESERVED_COMMAND) {
        this.currentNewline = this.checkNewline(token);
        formattedQuery = this.formatCommand(token, formattedQuery);
      } else if (token.type === TokenType.RESERVED_BINARY_COMMAND) {
        formattedQuery = this.formatBinaryCommand(token, formattedQuery);
      } else if (token.type === TokenType.RESERVED_DEPENDENT_CLAUSE) {
        formattedQuery = this.formatDependentClause(token, formattedQuery);
      } else if (token.type === TokenType.RESERVED_JOIN_CONDITION) {
        formattedQuery = this.formatJoinCondition(token, formattedQuery);
      } else if (token.type === TokenType.RESERVED_LOGICAL_OPERATOR) {
        formattedQuery = this.formatLogicalOperator(token, formattedQuery);
      } else if (token.type === TokenType.RESERVED_KEYWORD) {
        formattedQuery = this.formatKeyword(token, formattedQuery);
      } else if (token.type === TokenType.BLOCK_START) {
        formattedQuery = this.formatBlockStart(token, formattedQuery);
      } else if (token.type === TokenType.BLOCK_END) {
        formattedQuery = this.formatBlockEnd(token, formattedQuery);
      } else if (token.type === TokenType.PLACEHOLDER) {
        formattedQuery = this.formatPlaceholder(token, formattedQuery);
      } else if (token.type === TokenType.OPERATOR) {
        formattedQuery = this.formatOperator(token, formattedQuery);
      } else {
        formattedQuery = this.formatWord(token, formattedQuery);
      }
    }
    return replaceTabularPlaceholders(formattedQuery);
  }

  /**
   * Formats word tokens + any potential AS tokens for aliases
   */
  private formatWord(token: Token, query: string): string {
    let finalQuery = query;
    if (this.aliasAs.shouldAddBefore(token)) {
      finalQuery = this.formatWithSpaces(this.asTokenFactory.token(), finalQuery);
    }

    finalQuery = this.formatWithSpaces(token, finalQuery);

    if (this.aliasAs.shouldAddAfter()) {
      finalQuery = this.formatWithSpaces(this.asTokenFactory.token(), finalQuery);
    }

    return finalQuery;
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

    switch (this.cfg.newline) {
      case 'always':
        return true;
      case 'never':
        return false;
      case 'lineWidth':
        return this.inlineWidth(token, nextTokens) > this.cfg.lineWidth;
      default: // newline mode is a number
        return (
          this.countClauses(nextTokens) > this.cfg.newline ||
          this.inlineWidth(token, nextTokens) > this.cfg.lineWidth
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
      if (type === TokenType.BLOCK_START) {
        openBlocks++;
      }
      if (type === TokenType.BLOCK_END) {
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
  private formatLineComment(token: Token, query: string): string {
    return this.addNewline(query + this.show(token));
  }

  /** Formats a block comment onto query */
  private formatBlockComment(token: Token, query: string): string {
    return this.addNewline(this.addNewline(query) + this.indentComment(token.value));
  }

  /** Aligns comment to current indentation level */
  private indentComment(comment: string): string {
    return comment.replace(/\n[ \t]*/gu, '\n' + this.indentation.getIndent() + ' ');
  }

  /**
   * Formats a Reserved Command onto query, increasing indentation level where necessary
   */
  private formatCommand(token: Token, query: string): string {
    this.indentation.decreaseTopLevel();

    query = this.addNewline(query);

    // indent tabular formats, except when preceding a (
    if (this.isTabularStyle()) {
      if (this.tokenLookAhead().value !== '(') {
        this.indentation.increaseTopLevel();
      }
    } else {
      this.indentation.increaseTopLevel();
    }

    query += this.equalizeWhitespace(this.show(token)); // print token onto query
    if (this.currentNewline && !this.isTabularStyle()) {
      query = this.addNewline(query);
    } else {
      query += ' ';
    }
    return query;
  }

  /**
   * Formats a Reserved Binary Command onto query, joining neighbouring tokens
   */
  private formatBinaryCommand(token: Token, query: string): string {
    const isJoin = /JOIN/i.test(token.value); // check if token contains JOIN
    if (!isJoin || this.isTabularStyle()) {
      // decrease for boolean set operators or in tabular mode
      this.indentation.decreaseTopLevel();
    }
    query = this.addNewline(query) + this.equalizeWhitespace(this.show(token));
    return isJoin ? query + ' ' : this.addNewline(query);
  }

  /**
   * Formats a Reserved Keyword onto query, skipping AS if disabled
   */
  private formatKeyword(token: Token, query: string): string {
    if (isToken.AS(token) && this.aliasAs.shouldRemove()) {
      return query;
    }

    return this.formatWithSpaces(token, query);
  }

  /**
   * Formats a Reserved Dependent Clause token onto query, supporting the keyword that precedes it
   */
  private formatDependentClause(token: Token, query: string): string {
    return this.addNewline(query) + this.equalizeWhitespace(this.show(token)) + ' ';
  }

  // Formats ON and USING keywords
  private formatJoinCondition(token: Token, query: string): string {
    return query + this.equalizeWhitespace(this.show(token)) + ' ';
  }

  /**
   * Formats an Operator onto query, following rules for specific characters
   */
  private formatOperator(token: Token, query: string): string {
    // special operator
    if (token.value === ',') {
      return this.formatComma(token, query);
    } else if (token.value === ';') {
      return this.formatQuerySeparator(token, query);
    } else if (['$', '['].includes(token.value)) {
      return this.formatWithSpaces(token, query, 'before');
    } else if ([':', ']'].includes(token.value)) {
      return this.formatWithSpaces(token, query, 'after');
    } else if (['.', '{', '}', '`'].includes(token.value)) {
      return this.formatWithoutSpaces(token, query);
    }

    // regular operator
    if (this.cfg.denseOperators && this.tokenLookBehind().type !== TokenType.RESERVED_COMMAND) {
      // do not trim whitespace if SELECT *
      return this.formatWithoutSpaces(token, query);
    }
    return this.formatWithSpaces(token, query);
  }

  /**
   * Formats a Logical Operator onto query, joining boolean conditions
   */
  private formatLogicalOperator(token: Token, query: string): string {
    // ignore AND when BETWEEN x [AND] y
    if (isToken.AND(token) && isToken.BETWEEN(this.tokenLookBehind(2))) {
      return this.formatWithSpaces(token, query);
    }

    if (this.isTabularStyle()) {
      this.indentation.decreaseTopLevel();
    }

    if (this.cfg.logicalOperatorNewline === 'before') {
      return (
        (this.currentNewline ? this.addNewline(query) : query) +
        this.equalizeWhitespace(this.show(token)) +
        ' '
      );
    } else {
      query += this.show(token);
      return this.currentNewline ? this.addNewline(query) : query;
    }
  }

  /** Replace any sequence of whitespace characters with single space */
  private equalizeWhitespace(string: string): string {
    return string.replace(/\s+/gu, ' ');
  }

  /**
   * Formats a Block Start token (left paren/bracket/brace, CASE) onto query, beginning an Inline Block or increasing indentation where necessary
   */
  private formatBlockStart(token: Token, query: string): string {
    if (isToken.CASE(token)) {
      query = this.formatWithSpaces(token, query);
    } else {
      // Take out the preceding space unless there was whitespace there in the original query
      // or another opening parens or line comment
      const preserveWhitespaceFor = [
        TokenType.BLOCK_START,
        TokenType.LINE_COMMENT,
        TokenType.OPERATOR,
      ];
      if (
        token.whitespaceBefore?.length === 0 &&
        !preserveWhitespaceFor.includes(this.tokenLookBehind().type)
      ) {
        query = trimSpacesEnd(query);
      } else if (!this.cfg.newlineBeforeOpenParen) {
        query = query.trimEnd() + ' ';
      }
      query += this.show(token);
      this.inlineBlock.beginIfPossible(this.tokens, this.index);
    }

    if (!this.inlineBlock.isActive()) {
      this.indentation.increaseBlockLevel();
      if (!isToken.CASE(token) || this.cfg.newline === 'always') {
        query = this.addNewline(query);
      }
    }
    return query;
  }

  /**
   * Formats a Block End token (right paren/bracket/brace, END) onto query, closing an Inline Block or decreasing indentation where necessary
   */
  private formatBlockEnd(token: Token, query: string): string {
    if (this.inlineBlock.isActive()) {
      this.inlineBlock.end();
      if (isToken.END(token)) {
        return this.formatWithSpaces(token, query); // add space before END when closing inline block
      }
      return this.formatWithSpaces(token, query, 'after'); // do not add space before )
    } else {
      this.indentation.decreaseBlockLevel();

      if (this.isTabularStyle()) {
        // +1 extra indentation step for the closing paren
        query = this.addNewline(query) + this.indentation.getSingleIndent();
      } else if (this.cfg.newlineBeforeCloseParen) {
        query = this.addNewline(query);
      } else {
        query = query.trimEnd() + ' ';
      }

      return this.formatWithSpaces(token, query);
    }
  }

  /**
   * Formats a Placeholder item onto query, to be replaced with the value of the placeholder
   */
  formatPlaceholder(token: Token, query: string): string {
    return query + this.params.get(token) + ' ';
  }

  /**
   * Formats a comma Operator onto query, ending line unless in an Inline Block
   */
  private formatComma(token: Token, query: string): string {
    query = trimSpacesEnd(query) + this.show(token) + ' ';

    if (this.inlineBlock.isActive()) {
      return query;
    } else if (isToken.LIMIT(this.getPreviousReservedToken())) {
      return query;
    } else if (this.currentNewline) {
      return this.addNewline(query);
    } else {
      return query;
    }
  }

  /** Simple append of token onto query */
  private formatWithoutSpaces(token: Token, query: string): string {
    return trimSpacesEnd(query) + this.show(token);
  }

  /**
   * Add token onto query with spaces - either before, after, or both
   */
  private formatWithSpaces(
    token: Token,
    query: string,
    addSpace: 'before' | 'after' | 'both' = 'both'
  ): string {
    const before = addSpace === 'after' ? trimSpacesEnd(query) : query;
    const after = addSpace === 'before' ? '' : ' ';
    return before + this.show(token) + after;
  }

  private formatQuerySeparator(token: Token, query: string): string {
    this.indentation.resetIndentation();
    return [
      trimSpacesEnd(query),
      this.cfg.newlineBeforeSemicolon ? '\n' : '',
      this.show(token),
      '\n'.repeat(this.cfg.linesBetweenQueries + 1),
    ].join('');
  }

  /** Converts token to string, uppercasing if enabled */
  private show(token: Token): string {
    if (
      isReserved(token) ||
      token.type === TokenType.BLOCK_START ||
      token.type === TokenType.BLOCK_END
    ) {
      switch (this.cfg.keywordCase) {
        case 'preserve':
          return token.value;
        case 'upper':
          return token.value.toUpperCase();
        case 'lower':
          return token.value.toLowerCase();
      }
    } else {
      return token.value;
    }
  }

  /** Inserts a newline onto the query */
  private addNewline(query: string): string {
    query = trimSpacesEnd(query);
    if (!query.endsWith('\n')) {
      query += '\n';
    }
    return query + this.indentation.getIndent();
  }

  private isTabularStyle(): boolean {
    return this.cfg.indentStyle === 'tabularLeft' || this.cfg.indentStyle === 'tabularRight';
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
