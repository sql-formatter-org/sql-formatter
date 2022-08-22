import { Token, TokenType } from 'src/lexer/token';

// Nearly type definitions say that Token must have a value field,
// which however is wrong.  Instead Nearley expects a text field.
type NearleyToken = Token & { value: string };

export default class LexerAdapter {
  private index = 0;
  private tokens: Token[] = [];

  constructor(private tokenize: (chunk: string) => Token[]) {}

  reset(chunk: string, _info: any) {
    this.index = 0;
    this.tokens = this.tokenize(chunk);
  }

  next(): NearleyToken | undefined {
    return this.tokens[this.index++] as NearleyToken | undefined;
  }

  save(): any {}

  formatError(token: NearleyToken) {
    return `Parse error at token: ${token.text}`;
  }

  has(name: string): boolean {
    return name in TokenType;
  }
}
