import { lineColFromIndex } from 'src/lexer/lineColFromIndex.js';
import { Token, TokenType } from 'src/lexer/token.js';

// Nearly type definitions say that Token must have a value field,
// which however is wrong.  Instead Nearley expects a text field.
type NearleyToken = Token & { value: string };

export default class LexerAdapter {
  private index = 0;
  private tokens: Token[] = [];
  private input = '';

  constructor(private tokenize: (chunk: string) => Token[]) {}

  reset(chunk: string, _info: any) {
    this.input = chunk;
    this.index = 0;
    this.tokens = this.tokenize(chunk);
  }

  next(): NearleyToken | undefined {
    return this.tokens[this.index++] as NearleyToken | undefined;
  }

  save(): any {}

  formatError(token: NearleyToken) {
    const { line, col } = lineColFromIndex(this.input, token.start);
    return `Parse error at token: ${token.text} at line ${line} column ${col}`;
  }

  has(name: string): boolean {
    return name in TokenType;
  }
}
