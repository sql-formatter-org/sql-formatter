/* eslint-disable no-cond-assign */
import { RegExpLike } from './TokenizerEngine.js';

const START = /\/\*/uy; // matches: /*
const ANY_CHAR = /[\s\S]/uy; // matches single character
const END = /\*\//uy; // matches: */

/**
 * An object mimicking a regular expression,
 * for matching nested block-comments.
 */
export class NestedComment implements RegExpLike {
  public lastIndex: number = 0;

  public exec(input: string): string[] | null {
    let result = '';
    let match: string | null;
    let nestLevel = 0;

    if ((match = this.matchSection(START, input))) {
      result += match;
      nestLevel++;
    } else {
      return null;
    }

    while (nestLevel > 0) {
      if ((match = this.matchSection(START, input))) {
        result += match;
        nestLevel++;
      } else if ((match = this.matchSection(END, input))) {
        result += match;
        nestLevel--;
      } else if ((match = this.matchSection(ANY_CHAR, input))) {
        result += match;
      } else {
        return null;
      }
    }

    return [result];
  }

  private matchSection(regex: RegExp, input: string): string | null {
    regex.lastIndex = this.lastIndex;
    const matches = regex.exec(input);
    if (matches) {
      this.lastIndex += matches[0].length;
    }
    return matches ? matches[0] : null;
  }
}
