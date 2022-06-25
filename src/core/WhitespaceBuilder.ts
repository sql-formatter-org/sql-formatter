import { last } from 'src/utils';

import Indentation from './Indentation';

/** Whitespace modifiers to be used with add() method */
export enum WS {
  SPACE = 1, // Adds single space
  NO_SPACE = 2, // Removes preceding spaces (if any)
  NEWLINE = 3, // Adds single newline
  NO_NEWLINE = 4, // Removes all preceding whitespace (including newlines)
  INDENT = 5, // Adds indentation (as much as needed for current indentation level)
  SINGLE_INDENT = 6, // Adds whitespace for single indentation step
}

export type LayoutItem = WS.SPACE | WS.SINGLE_INDENT | WS.NEWLINE | string;

/**
 * API for constructing SQL string (especially the whitespace part).
 *
 * It hides the internal implementation.
 * Originally it used plain string concatenation, which was expensive.
 * Now it's storing items to array and builds the string only in the end.
 */
export default class WhitespaceBuilder {
  private layout: LayoutItem[] = [];

  constructor(private indentation: Indentation) {}

  /**
   * Appands an already constructed sub-layout
   * and indents each line in it by current level of indentation
   */
  public addLayout(layout: LayoutItem[]) {
    this.addIndentation();
    layout.forEach((item, i) => {
      this.layout.push(item);
      if (item === WS.NEWLINE && i < layout.length - 1) {
        this.addIndentation();
      }
    });
  }

  /**
   * Appends token strings and whitespace modifications to SQL string.
   */
  public add(...items: (WS | string)[]) {
    for (const item of items) {
      switch (item) {
        case WS.SPACE:
          this.layout.push(WS.SPACE);
          break;
        case WS.NO_SPACE:
          this.trimHorizontalWhitespace();
          break;
        case WS.NEWLINE:
          this.trimHorizontalWhitespace();
          this.addNewline();
          break;
        case WS.NO_NEWLINE:
          this.trimAllWhitespace();
          break;
        case WS.INDENT:
          this.addIndentation();
          break;
        case WS.SINGLE_INDENT:
          this.layout.push(WS.SINGLE_INDENT);
          break;
        default:
          this.layout.push(item);
      }
    }
  }

  private trimHorizontalWhitespace() {
    while (isHorizontalWhitespace(last(this.layout))) {
      this.layout.pop();
    }
  }

  private trimAllWhitespace() {
    while (isWhitespace(last(this.layout))) {
      this.layout.pop();
    }
  }

  private addNewline() {
    if (this.layout.length > 0 && last(this.layout) !== WS.NEWLINE) {
      this.layout.push(WS.NEWLINE);
    }
  }

  private addIndentation() {
    for (let i = 0; i < this.indentation.getLevel(); i++) {
      this.layout.push(WS.SINGLE_INDENT);
    }
  }

  /**
   * Returns the final SQL string.
   */
  public toString(): string {
    return this.layout.map(item => this.itemToString(item)).join('');
  }

  /**
   * Returns the constructed whitespace layout structure.
   */
  public toLayout(): LayoutItem[] {
    return this.layout;
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

const isWhitespace = (item: WS | string | undefined) =>
  item === WS.SPACE || item === WS.SINGLE_INDENT || item === WS.NEWLINE;
