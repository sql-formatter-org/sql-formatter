import Indentation from './Indentation';
import InlineBlock from './InlineBlock';
import Params from './Params';
import { trimSpacesEnd } from '../utils';
import { isReserved, isCommand, isToken, Token, TokenType, ZWS } from './token';
import Tokenizer from './Tokenizer';
import {
  AliasMode,
  CommaPosition,
  FormatOptions,
  KeywordCase,
  KeywordMode,
  NewlineMode,
} from '../types';
import formatCommaPositions from './formatCommaPositions';
import formatAliasPositions from './formatAliasPositions';

/** Main formatter class that produces a final output string from list of tokens */
export default class Formatter {
  private cfg: FormatOptions;
  private indentation: Indentation;
  private inlineBlock: InlineBlock;
  private params: Params;

  private currentNewline = true;
  protected previousReservedToken?: Token;
  private withinSelect = false;
  protected tokens: Token[] = [];
  protected index = -1;

  constructor(cfg: FormatOptions) {
    this.cfg = cfg;
    this.indentation = new Indentation(this.cfg.indent);
    this.inlineBlock = new InlineBlock(this.cfg.lineWidth);
    this.params = new Params(this.cfg.params);
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
    if (this.cfg.commaPosition !== CommaPosition.after) {
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
        if (token.type !== TokenType.RESERVED_KEYWORD) {
          token = this.tenSpacedToken(token); // convert Reserved Command or Logical Operator to tenSpace format if needed
        }
        if (token.type === TokenType.RESERVED_COMMAND) {
          this.withinSelect = isToken.SELECT(token); // set withinSelect flag if entering a SELECT clause, else reset
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
      } else if (token.type === TokenType.RESERVED_LOGICAL_OPERATOR) {
        formattedQuery = this.formatLogicalOperator(token, formattedQuery);
      } else if (token.type === TokenType.RESERVED_KEYWORD) {
        formattedQuery = this.formatKeyword(token, formattedQuery);
        this.previousReservedToken = token;
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
    return formattedQuery.replace(new RegExp(ZWS, 'ugim'), ' '); // replace all ZWS with whitespace for TenSpace formats
  }

  /**
   * Formats word tokens + any potential AS tokens for aliases
   */
  private formatWord(token: Token, query: string): string {
    const prevToken = this.tokenLookBehind();
    const nextToken = this.tokenLookAhead();
    const asToken = {
      type: TokenType.RESERVED_KEYWORD,
      value: this.cfg.keywordCase === KeywordCase.upper ? 'AS' : 'as',
    };

    const missingTableAlias = // if table alias is missing and alias is always
      this.cfg.aliasAs === AliasMode.always &&
      token.type === TokenType.WORD &&
      prevToken?.value === ')';

    const missingSelectColumnAlias = // if select column alias is missing and alias is always or select
      (this.cfg.aliasAs === AliasMode.always || this.cfg.aliasAs === AliasMode.select) &&
      this.withinSelect &&
      token.type === TokenType.WORD &&
      (isToken.END(prevToken) || // isAs(prevToken) ||
        ((prevToken?.type === TokenType.WORD || prevToken?.type === TokenType.NUMBER) &&
          (nextToken?.value === ',' || isCommand(nextToken))));

    // bandaid fix until Nearley tree
    const missingCastTypeAs =
      this.cfg.aliasAs === AliasMode.never && // checks for CAST(«expression» [AS] type)
      this.withinSelect &&
      isToken.CAST(this.previousReservedToken) &&
      isToken.AS(nextToken) &&
      (this.tokenLookAhead(2)?.type === TokenType.WORD ||
        this.tokenLookAhead(2)?.type === TokenType.RESERVED_KEYWORD) &&
      this.tokenLookAhead(3)?.value === ')';

    const isEdgeCaseCTE = // checks for WITH `table` [AS] (
      this.cfg.aliasAs === AliasMode.never &&
      isToken.WITH(prevToken) &&
      (nextToken?.value === '(' ||
        (isToken.AS(nextToken) && this.tokenLookAhead(2)?.value === '('));

    const isEdgeCaseCreateTable = // checks for CREATE TABLE `table` [AS] WITH (
      this.cfg.aliasAs === AliasMode.never &&
      (isToken.TABLE(prevToken) || prevToken?.value.endsWith('TABLE')) &&
      (isToken.WITH(nextToken) || (isToken.AS(nextToken) && isToken.WITH(this.tokenLookAhead(2))));

    let finalQuery = query;
    if (missingTableAlias || missingSelectColumnAlias) {
      // insert AS before word
      finalQuery = this.formatWithSpaces(asToken, finalQuery);
    }

    // insert word
    finalQuery = this.formatWithSpaces(token, finalQuery);

    if (isEdgeCaseCTE || isEdgeCaseCreateTable || missingCastTypeAs) {
      // insert AS after word
      finalQuery = this.formatWithSpaces(asToken, finalQuery);
    }

    return finalQuery;
  }

  /**
   * Checks if a newline should currently be inserted
   */
  private checkNewline(token: Token): boolean {
    const nextTokens = this.tokensUntilNextCommandOrQueryEnd();

    // auto break if SELECT includes CASE statements
    if (this.withinSelect && nextTokens.some(isToken.CASE)) {
      return true;
    }

    switch (this.cfg.newline) {
      case NewlineMode.always:
        return true;
      case NewlineMode.never:
        return false;
      case NewlineMode.lineWidth:
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
   * XXX: We're not correctly balancing braces here (BLOCK_START / BLOCK_END)
   */
  private countClauses(tokens: Token[]): number {
    return tokens.reduce(
      (acc, { type, value }) => {
        if (value === ',' && !acc.inParen) {
          return { ...acc, count: acc.count + 1 };
        }
        if (type === TokenType.BLOCK_START) {
          return { ...acc, inParen: true };
        }
        if (type === TokenType.BLOCK_END) {
          return { ...acc, inParen: false };
        }
        return acc;
      },
      { count: 1, inParen: false }
    ).count;
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

    // indent TenSpace formats, except when preceding a (
    if (this.isTenSpace()) {
      if (this.tokenLookAhead()?.value !== '(') {
        this.indentation.increaseTopLevel();
      }
      // indent standard format, except when is [FROM] (
    } else if (!(this.tokenLookAhead()?.value === '(' && isToken.FROM(token))) {
      this.indentation.increaseTopLevel();
    }

    query += this.equalizeWhitespace(this.show(token)); // print token onto query
    if (this.currentNewline && !this.isTenSpace()) {
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
    if (!isJoin || this.isTenSpace()) {
      // decrease for boolean set operators or in tenSpace modes
      this.indentation.decreaseTopLevel();
    }
    query = this.addNewline(query) + this.equalizeWhitespace(this.show(token));
    return isJoin ? query + ' ' : this.addNewline(query);
  }

  /**
   * Formats a Reserved Keyword onto query, skipping AS if disabled
   */
  private formatKeyword(token: Token, query: string): string {
    if (
      isToken.AS(token) &&
      (this.cfg.aliasAs === AliasMode.never || // skip all AS if never
        (this.cfg.aliasAs === AliasMode.select &&
          this.tokenLookBehind()?.value === ')' && // ) [AS] alias but not SELECT (a) [AS] alpha
          !this.withinSelect && // skip WITH foo [AS] ( ...
          this.tokenLookAhead()?.value !== '('))
    ) {
      // do not format if skipping AS
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
    if (this.cfg.denseOperators && this.tokenLookBehind()?.type !== TokenType.RESERVED_COMMAND) {
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

    if (this.isTenSpace()) {
      this.indentation.decreaseTopLevel();
    }

    if (this.cfg.breakBeforeBooleanOperator) {
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
        !preserveWhitespaceFor.includes(this.tokenLookBehind()?.type)
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
      if (!isToken.CASE(token) || this.cfg.newline === NewlineMode.always) {
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

      if (this.isTenSpace()) {
        query = this.addNewline(query) + this.cfg.indent;
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
    } else if (isToken.LIMIT(this.previousReservedToken)) {
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

  /**
   * Format Delimiter token onto query, adding newlines accoring to `this.cfg.linesBetweenQueries`
   */
  private formatQuerySeparator(token: Token, query: string): string {
    this.indentation.resetIndentation();
    query = trimSpacesEnd(query);

    // move delimiter to new line if specified
    if (this.cfg.semicolonNewline) {
      query += '\n';
      if (this.isTenSpace()) {
        query += this.cfg.indent;
      }
    }
    return query + this.show(token) + '\n'.repeat(this.cfg.linesBetweenQueries + 1);
  }

  /** Converts token to string, uppercasing if enabled */
  private show(token: Token): string {
    if (
      isReserved(token) ||
      token.type === TokenType.BLOCK_START ||
      token.type === TokenType.BLOCK_END
    ) {
      switch (this.cfg.keywordCase) {
        case KeywordCase.preserve:
          return token.value;
        case KeywordCase.upper:
          return token.value.toUpperCase();
        case KeywordCase.lower:
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

  /** Produces a 10-char wide version of reserved token for TenSpace modes */
  private tenSpacedToken(token: Token): Token {
    const addBuffer = (string: string, bufferLength = 9) =>
      ZWS.repeat(Math.max(bufferLength - string.length, 0));
    if (this.isTenSpace()) {
      let bufferItem = token.value; // store which part of keyword receives 10-space buffer
      let tail = [] as string[]; // rest of keyword
      if (bufferItem.length >= 10 && bufferItem.includes(' ')) {
        // split for long keywords like INNER JOIN or UNION DISTINCT
        [bufferItem, ...tail] = bufferItem.split(' ');
      }

      if (this.cfg.keywordPosition === KeywordMode.tenSpaceLeft) {
        bufferItem += addBuffer(bufferItem);
      } else {
        bufferItem = addBuffer(bufferItem) + bufferItem;
      }

      token.value = bufferItem + ['', ...tail].join(' ');
    }
    return token;
  }

  private isTenSpace(): boolean {
    return (
      this.cfg.keywordPosition === KeywordMode.tenSpaceLeft ||
      this.cfg.keywordPosition === KeywordMode.tenSpaceRight
    );
  }

  /** Fetches nth previous token from the token stream */
  protected tokenLookBehind(n = 1) {
    return this.tokens[this.index - n];
  }

  /** Fetches nth next token from the token stream */
  protected tokenLookAhead(n = 1) {
    return this.tokens[this.index + n];
  }
}
