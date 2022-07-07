import type { IndentStyle } from 'src/types';
import { Token, TokenType } from 'src/lexer/token';

/**
 * When tabular style enabled,
 * produces a 10-char wide version of token text.
 */
export default function toTabularFormat(tokenText: string, indentStyle: IndentStyle): string {
  if (indentStyle === 'standard') {
    return tokenText;
  }

  let tail = [] as string[]; // rest of keyword
  if (tokenText.length >= 10 && tokenText.includes(' ')) {
    // split for long keywords like INNER JOIN or UNION DISTINCT
    [tokenText, ...tail] = tokenText.split(' ');
  }

  if (indentStyle === 'tabularLeft') {
    tokenText = tokenText.padEnd(9, ' ');
  } else {
    tokenText = tokenText.padStart(9, ' ');
  }

  return tokenText + ['', ...tail].join(' ');
}

/**
 * True when the token can be formatted in tabular style
 */
export function isTabularToken(token: Token): boolean {
  return (
    token.type === TokenType.RESERVED_LOGICAL_OPERATOR ||
    token.type === TokenType.RESERVED_DEPENDENT_CLAUSE ||
    token.type === TokenType.RESERVED_COMMAND ||
    token.type === TokenType.RESERVED_BINARY_COMMAND ||
    token.type === TokenType.RESERVED_JOIN
  );
}
