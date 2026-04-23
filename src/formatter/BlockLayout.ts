import Indentation from './Indentation.js';
import Layout, { WS } from './Layout.js';

export default class BlockLayout extends Layout {
  private line = 0;
  private length = 0;

  // internal buffer for service tokens
  private buffer: (WS | string)[] = [];

  constructor(indentation: Indentation, private expressionWidth: number) {
    super(indentation);
  }

  public add(...items: (WS | string)[]) {
    for (const item of items) {
      // We add a comma as a service token so that the transfer of a comma to
      // a new line is not a matter of chance, and it always
      // remains on the same line as the element before it.
      if (typeof item !== 'string' || item === ',') {
        this.buffer.push(item);
        continue;
      }

      const forceInsert = this.length === 0;
      const insertCurrLineBuff = this.buffer.reduce(
        (ret, service_item) => this.addLengthCurrentLine(service_item) && ret,
        true
      );
      const insertCurrLine = this.addLengthCurrentLine(item) && insertCurrLineBuff;

      if (insertCurrLine || forceInsert) {
        super.add(...this.buffer, item);
      } else {
        super.add(...this.buffer, WS.NEWLINE, WS.INDENT, item);
      }

      this.buffer = [];

      if (!insertCurrLine) {
        this.line++;
        this.length = 0;
      }
    }
  }

  private addLengthCurrentLine(item: WS | string) {
    if (typeof item === 'string') {
      this.length += item.length;
      return this.length <= this.expressionWidth;
    }

    if (item === WS.NO_NEWLINE || item === WS.NO_SPACE) {
      this.length--;
      return true;
    }

    this.length++;
    return this.length <= this.expressionWidth;
  }
}
