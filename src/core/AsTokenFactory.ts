import { KeywordCase } from '../types';
import { isToken, Token, TokenType } from './token';

export default class AsTokenFactory {
  private detectedCase: KeywordCase;

  constructor(private keywordCase: KeywordCase | keyof typeof KeywordCase, tokens: Token[] = []) {
    this.detectedCase = this.autoDetectCase(tokens);
  }

  private autoDetectCase(tokens: Token[]) {
    const asTokens = tokens.filter(isToken.AS);
    const upperAsTokens = asTokens.filter(({ value }) => value === 'AS');
    return upperAsTokens.length > asTokens.length / 2 ? KeywordCase.upper : KeywordCase.lower;
  }

  /** Returns AS token with either upper- or lowercase text */
  public token(): Token {
    return {
      type: TokenType.RESERVED_KEYWORD,
      value: this.asTokenValue(),
    };
  }

  private asTokenValue(): 'AS' | 'as' {
    const keywordCase =
      this.keywordCase === KeywordCase.preserve ? this.detectedCase : this.keywordCase;
    return keywordCase === KeywordCase.upper ? 'AS' : 'as';
  }
}
