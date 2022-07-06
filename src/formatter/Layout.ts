import { last } from 'src/utils';

import Indentation from './Indentation';

/** Whitespace modifiers to be used with add() method */
export enum WS {
  SPACE, // Adds single space
  NO_SPACE, // Removes preceding horizontal whitespace (if any)
  NEWLINE, // Adds single newline (and removes any preceding whitespace)
  INDENT, // Adds indentation (as much as needed for current indentation level)
  SINGLE_INDENT, // Adds whitespace for single indentation step
}

export type LayoutItem = WS.SPACE | WS.SINGLE_INDENT | WS.NEWLINE | string;

/**
 * API for constructing SQL string (especially the whitespace part).
 *
 * It hides the internal implementation.
 * Originally it used plain string concatenation, which was expensive.
 * Now it's storing items to array and builds the string only in the end.
 */
export default class Layout {
  private items: LayoutItem[] = [];

  constructor(public indentation: Indentation) {}

  /**
   * Appends token strings and whitespace modifications to SQL string.
   */
  public add(...items: (WS | string)[]) {
    for (const item of items) {
      switch (item) {
        case WS.SPACE:
          this.items.push(WS.SPACE);
          break;
        case WS.NO_SPACE:
          this.trimHorizontalWhitespace();
          break;
        case WS.NEWLINE:
          this.trimHorizontalWhitespace();
          this.addNewline();
          break;
        case WS.INDENT:
          this.addIndentation();
          break;
        case WS.SINGLE_INDENT:
          this.items.push(WS.SINGLE_INDENT);
          break;
        default:
          this.items.push(item);
      }
    }
  }

  private trimHorizontalWhitespace() {
    while (isHorizontalWhitespace(last(this.items))) {
      this.items.pop();
    }
  }

  private addNewline() {
    if (this.items.length > 0 && last(this.items) !== WS.NEWLINE) {
      this.items.push(WS.NEWLINE);
    }
  }

  private addIndentation() {
    for (let i = 0; i < this.indentation.getLevel(); i++) {
      this.items.push(WS.SINGLE_INDENT);
    }
  }

  /**
   * Returns the final SQL string.
   */
  public toString(): string {
    return this.items.map(item => this.itemToString(item)).join('');
  }

  private itemToString(item: LayoutItem): string {
    switch (item) {
      case WS.SPACE:
        return ' ';
      case WS.NEWLINE:
        return '\n';
      case WS.SINGLE_INDENT:
        return this.indentation.getSingleIndent();
      default:
        return item;
    }
  }
}

const isHorizontalWhitespace = (item: WS | string | undefined) =>
  item === WS.SPACE || item === WS.SINGLE_INDENT;
