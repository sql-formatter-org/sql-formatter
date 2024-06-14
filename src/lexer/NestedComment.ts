/* eslint-disable no-cond-assign */
import { RegExpLike } from './TokenizerEngine.js';

const START = /\/\*/uy; // matches: /*

/**
 * An object mimicking a regular expression,
 * for matching nested block-comments.
 */
export class NestedComment implements RegExpLike {
  public lastIndex: number = 0;

  public exec(input: string): string[] | null {
    let result = '';
    let match: string | null;

    if ((match = this.matchSection(START, input))) {
      result += match;
    } else {
      return null;
    }

    let nestLevel = 1;
    // start at the last index, break if we find a closing */ that matches
    for (let i = this.lastIndex; i < input.length; i++) {
      if (input[i] === '*' && input[i + 1] === '/') {
        nestLevel--;
        result += '*/';
        i++;
        if (nestLevel === 0) {
          this.lastIndex = i;
          return [result];
        } else if (nestLevel < 0) {
          return null;
        }
      } else if (input[i] === '/' && input[i + 1] === '*') {
        nestLevel++;
        result += '/*';
        i++;
      } else {
        result += input[i];
      }
    }
    if (nestLevel > 0) {
      return null;
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
