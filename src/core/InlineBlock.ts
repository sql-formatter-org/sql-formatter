import { BetweenPredicate, Parenthesis } from './ast';
import { isToken, type Token, TokenType } from './token';

/**
 * Bookkeeper for inline blocks.
 *
 * Inline blocks are parenthesised expressions that are shorter than INLINE_MAX_LENGTH.
 * These blocks are formatted on a single line, unlike longer parenthesised
 * expressions where open-parenthesis causes newline and increase of indentation.
 */
export default class InlineBlock {
  constructor(private expressionWidth: number) {}

  /**
   * Check if this should be an inline parentheses block
   * Examples are "NOW()", "COUNT(*)", "int(10)", key(`somecolumn`), DECIMAL(7,2)
   */
  public isInlineBlock(parenthesis: Parenthesis): boolean {
    return this.inlineWidth(parenthesis) <= this.expressionWidth;
  }

  private inlineWidth(parenthesis: Parenthesis): number {
    let length = 2; // two parenthesis

    for (const node of parenthesis.children) {
      switch (node.type) {
        case 'parenthesis':
          length += this.inlineWidth(node);
          break;
        case 'between_predicate':
          length += this.betweenWidth(node);
          break;
        case 'limit_clause':
          return Infinity;
        case 'token':
          length += node.token.value.length;
          if (this.isForbiddenToken(node.token)) {
            return Infinity;
          }
          break;
      }

      // Overran max length
      if (length > this.expressionWidth) {
        return length;
      }
    }
    return length;
  }

  private betweenWidth(node: BetweenPredicate): number {
    return [node.betweenToken, node.expr1, node.andToken, node.expr2]
      .map(token => token.value.length)
      .reduce((a, b) => a + b);
  }

  // Reserved words that cause newlines, comments and semicolons
  // are not allowed inside inline parentheses block
  private isForbiddenToken(token: Token) {
    return (
      token.type === TokenType.RESERVED_COMMAND ||
      token.type === TokenType.RESERVED_LOGICAL_OPERATOR ||
      token.type === TokenType.LINE_COMMENT ||
      token.type === TokenType.BLOCK_COMMENT ||
      token.value === ';' ||
      isToken.CASE(token) // CASE cannot have inline blocks
    );
  }
}
