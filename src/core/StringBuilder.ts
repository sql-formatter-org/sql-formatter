import { trimSpacesEnd } from '../utils';
import Indentation from './Indentation';

export enum WS {
  SPACE = 1,
  NO_SPACE = 2,
  NEWLINE = 3,
  NO_NEWLINE = 4,
  INDENT = 5,
}

export default class StringBuilder {
  private query = '';

  constructor(private indentation: Indentation) {}

  public add(...items: (WS | string)[]) {
    for (const item of items) {
      switch (item) {
        case WS.SPACE:
          this.query += ' ';
          break;
        case WS.NO_SPACE:
          this.query = trimSpacesEnd(this.query);
          break;
        case WS.NEWLINE:
          this.addNewline();
          break;
        case WS.NO_NEWLINE:
          this.query = this.query.trimEnd();
          break;
        case WS.INDENT:
          this.query += this.indentation.getIndent();
          break;
        default:
          this.query += item;
      }
    }
  }

  private addNewline() {
    this.query = trimSpacesEnd(this.query);
    if (!this.query.endsWith('\n') && this.query !== '') {
      this.query += '\n';
    }
  }

  public toString(): string {
    return this.query;
  }
}
