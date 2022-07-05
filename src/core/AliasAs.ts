import type { AliasMode, FormatOptions } from 'src/types';
import AsTokenFactory from './AsTokenFactory';

import { isCommand, isToken, type Token, TokenType, EOF_TOKEN, isReserved } from './token';

/** Adds and removes AS tokens as configured by aliasAs option */
export default class AliasAs {
  private index = 0;
  private tokens: Token[] = [];
  private previousReservedToken: Token = EOF_TOKEN;
  private previousCommandToken: Token = EOF_TOKEN;
  private asTokenFactory: AsTokenFactory;
  private aliasAs: AliasMode;

  constructor(cfg: FormatOptions, tokens: Token[]) {
    this.aliasAs = cfg.aliasAs;
    this.asTokenFactory = new AsTokenFactory(cfg.keywordCase, tokens);
    this.tokens = tokens;
  }

  /** Returns tokens with AS tokens added/removed as needed */
  public process(): Token[] {
    const processedTokens: Token[] = [];

    for (this.index = 0; this.index < this.tokens.length; this.index++) {
      const token = this.tokens[this.index];

      if (isReserved(token)) {
        this.previousReservedToken = token;
        if (token.type === TokenType.RESERVED_COMMAND) {
          this.previousCommandToken = token;
        }
      }

      if (isToken.AS(token)) {
        if (!this.shouldRemove()) {
          processedTokens.push(token);
        }
      } else if (
        token.type === TokenType.IDENTIFIER ||
        token.type === TokenType.NUMBER ||
        token.type === TokenType.STRING ||
        token.type === TokenType.VARIABLE
      ) {
        if (this.shouldAddBefore(token)) {
          processedTokens.push(this.asTokenFactory.token());
        }

        processedTokens.push(token);

        if (this.shouldAddAfter()) {
          processedTokens.push(this.asTokenFactory.token());
        }
      } else {
        processedTokens.push(token);
      }
    }

    return processedTokens;
  }

  /** True when AS keyword should be added *before* current token */
  private shouldAddBefore(token: Token): boolean {
    return this.isMissingTableAlias(token) || this.isMissingSelectColumnAlias(token);
  }

  // if table alias is missing and should be added
  private isMissingTableAlias(token: Token): boolean {
    return (
      this.aliasAs === 'always' &&
      token.type === TokenType.IDENTIFIER &&
      this.lookBehind().value === ')'
    );
  }

  // if select column alias is missing and should be added
  private isMissingSelectColumnAlias(token: Token): boolean {
    const prevToken = this.lookBehind();
    const nextToken = this.lookAhead();
    return (
      (this.aliasAs === 'always' || this.aliasAs === 'select') &&
      this.isWithinSelect() &&
      token.type === TokenType.IDENTIFIER &&
      (isToken.END(prevToken) ||
        ((prevToken.type === TokenType.IDENTIFIER || prevToken.type === TokenType.NUMBER) &&
          (nextToken.type === TokenType.COMMA || isCommand(nextToken))))
    );
  }

  /** True when AS keyword should be added *after* current token */
  private shouldAddAfter(): boolean {
    return this.isEdgeCaseCTE() || this.isEdgeCaseCreateTable() || this.isMissingTypeCastAs();
  }

  // checks for CAST(«expression» [AS] type)
  private isMissingTypeCastAs(): boolean {
    return (
      this.aliasAs === 'never' &&
      this.isWithinSelect() &&
      isToken.CAST(this.getPreviousReservedToken()) &&
      isToken.AS(this.lookAhead()) &&
      (this.lookAhead(2).type === TokenType.IDENTIFIER ||
        this.lookAhead(2).type === TokenType.RESERVED_KEYWORD) &&
      this.lookAhead(3).value === ')'
    );
  }

  // checks for WITH `table` [AS] (
  private isEdgeCaseCTE(): boolean {
    const nextToken = this.lookAhead();
    return (
      this.aliasAs === 'never' &&
      isToken.WITH(this.lookBehind()) &&
      (nextToken.value === '(' || (isToken.AS(nextToken) && this.lookAhead(2).value === '('))
    );
  }

  // checks for CREATE TABLE `table` [AS] WITH (
  private isEdgeCaseCreateTable(): boolean {
    const prevToken = this.lookBehind();
    const nextToken = this.lookAhead();
    return (
      this.aliasAs === 'never' &&
      (isToken.TABLE(prevToken) || prevToken.value.endsWith('TABLE')) &&
      (isToken.WITH(nextToken) || (isToken.AS(nextToken) && isToken.WITH(this.lookAhead(2))))
    );
  }

  /* True when the current AS token should be discarded */
  private shouldRemove(): boolean {
    return this.aliasAs === 'never' || (this.aliasAs === 'select' && this.isRemovableNonSelectAs());
  }

  private isRemovableNonSelectAs(): boolean {
    return (
      this.lookBehind().value === ')' && // ) [AS] alias but not SELECT (a) [AS] alpha
      !this.isWithinSelect() &&
      this.lookAhead().value !== '(' // skip WITH foo [AS] ( ...
    );
  }

  public getPreviousReservedToken(): Token {
    return this.previousReservedToken;
  }

  public isWithinSelect(): boolean {
    return isToken.SELECT(this.previousCommandToken);
  }

  private lookBehind(n = 1): Token {
    return this.lookAhead(-n);
  }

  private lookAhead(n = 1): Token {
    return this.tokens[this.index + n] || EOF_TOKEN;
  }
}
