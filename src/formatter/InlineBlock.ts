import { sum } from 'src/utils';
import { type Token, TokenType, isLogicalOperator } from 'src/lexer/token';
import { BetweenPredicate, NodeType, Parenthesis } from 'src/parser/ast';

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
        case NodeType.function_call:
          length += node.nameToken.text.length + this.inlineWidth(node.parenthesis);
          break;
        case NodeType.array_subscript:
          length += node.arrayToken.text.length + this.inlineWidth(node.parenthesis);
          break;
        case NodeType.parenthesis:
          length += this.inlineWidth(node);
          break;
        case NodeType.between_predicate:
          length += this.betweenWidth(node);
          break;
        case NodeType.clause:
        case NodeType.limit_clause:
        case NodeType.set_operation:
          return Infinity;
        case NodeType.all_columns_asterisk:
          length += 1;
          break;
        case NodeType.token:
          length += node.token.text.length;
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
    return sum(
      [node.betweenToken, node.expr1, node.andToken, node.expr2].map(token => token.text.length)
    );
  }

  // Reserved words that cause newlines, comments and semicolons
  // are not allowed inside inline parentheses block
  private isForbiddenToken(token: Token) {
    return (
      isLogicalOperator(token) ||
      token.type === TokenType.LINE_COMMENT ||
      token.type === TokenType.BLOCK_COMMENT ||
      token.type === TokenType.CASE // CASE cannot have inline blocks
    );
  }
}
