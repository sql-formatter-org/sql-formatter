import { KeywordMode } from '../types';
import { Token, ZWS } from './token';

/**
 * When tenSpace mode enabled,
 * produces a 10-char wide version of reserved token.
 *
 * It'll be padded by zero-width space characters
 * instead of normal spaces, so that these spaces will survive
 * trimming of spaces in other parts of formatter.
 * They'll be converted to normal spaces in the end of
 * all the normal formatting with the replaceTenSpacePlaceholders()
 */
export default function toTenSpaceToken(
  token: Token,
  keywordPosition: KeywordMode | keyof typeof KeywordMode
): Token {
  if (keywordPosition === KeywordMode.standard) {
    return token;
  }

  let bufferItem = token.value; // store which part of keyword receives 10-space buffer
  let tail = [] as string[]; // rest of keyword
  if (bufferItem.length >= 10 && bufferItem.includes(' ')) {
    // split for long keywords like INNER JOIN or UNION DISTINCT
    [bufferItem, ...tail] = bufferItem.split(' ');
  }

  if (keywordPosition === KeywordMode.tenSpaceLeft) {
    bufferItem = bufferItem.padEnd(9, ZWS);
  } else {
    bufferItem = bufferItem.padStart(9, ZWS);
  }

  return {
    ...token,
    value: bufferItem + ['', ...tail].join(' '),
  };
}

/**
 * Replaces zero-width-spaces added by the above function
 */
export function replaceTenSpacePlaceholders(query: string): string {
  return query.replace(new RegExp(ZWS, 'ugim'), ' ');
}
