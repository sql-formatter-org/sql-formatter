import { Token, TokenType } from 'src/core/token';

export default class LexerAdapter {
  private index = 0;
  private tokens: Token[] = [];

  constructor(private tokenize: (chunk: string) => Token[]) {}

  reset(chunk: string, _info: any) {
    this.index = 0;
    this.tokens = this.tokenize(chunk);
  }

  next(): Token {
    return this.tokens[this.index++];
  }

  save(): any {}

  formatError(token: Token) {
    return `Parse error at token: ${token.value}`;
  }

  has(name: string): boolean {
    return name in TokenType;
  }
}
