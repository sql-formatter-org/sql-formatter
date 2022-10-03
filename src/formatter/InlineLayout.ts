// eslint-disable-next-line max-classes-per-file
import Indentation from './Indentation.js';
import Layout, { WS } from './Layout.js';

/**
 * Like Layout, but only formats single-line expressions.
 *
 * Throws InlineLayoutError:
 * - when encountering a newline
 * - when exceeding configured expressionWidth
 */
export default class InlineLayout extends Layout {
  private length = 0;
  // Keeps track of the trailing whitespace,
  // so that we can decrease length when encountering WS.NO_SPACE,
  // but only when there actually is a space to remove.
  private trailingSpace = false;

  constructor(private expressionWidth: number) {
    super(new Indentation('')); // no indentation in inline layout
  }

  public add(...items: (WS | string)[]) {
    items.forEach(item => this.addToLength(item));
    if (this.length > this.expressionWidth) {
      // We have exceeded the allowable width
      throw new InlineLayoutError();
    }
    super.add(...items);
  }

  private addToLength(item: WS | string) {
    if (typeof item === 'string') {
      this.length += item.length;
      this.trailingSpace = false;
    } else if (item === WS.MANDATORY_NEWLINE || item === WS.NEWLINE) {
      // newlines not allowed within inline block
      throw new InlineLayoutError();
    } else if (item === WS.INDENT || item === WS.SINGLE_INDENT || item === WS.SPACE) {
      if (!this.trailingSpace) {
        this.length++;
        this.trailingSpace = true;
      }
    } else if (item === WS.NO_NEWLINE || item === WS.NO_SPACE) {
      if (this.trailingSpace) {
        this.trailingSpace = false;
        this.length--;
      }
    }
  }
}

/**
 * Thrown when block of SQL can't be formatted as a single line.
 */
export class InlineLayoutError extends Error {}
