import { type Token, TokenType, isLogicalOperator } from 'src/lexer/token';
import { AstNode, BetweenPredicate, NodeType, Parenthesis } from 'src/parser/ast';

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
    return this.inlineParenthesisWidth(parenthesis) <= this.expressionWidth;
  }

  private inlineParenthesisWidth(parenthesis: Parenthesis): number {
    // +2 for the two parenthesis
    return this.inlineWidth(parenthesis.children) + 2;
  }

  private inlineWidth(nodes: AstNode[]): number {
    let length = 0;

    for (const node of nodes) {
      switch (node.type) {
        case NodeType.function_call:
          length += node.nameToken.text.length + this.inlineParenthesisWidth(node.parenthesis);
          break;
        case NodeType.array_subscript:
          length += node.arrayToken.text.length + this.inlineParenthesisWidth(node.parenthesis);
          break;
        case NodeType.parenthesis:
          length += this.inlineParenthesisWidth(node);
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
        case NodeType.literal:
          length += node.text.length;
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
    return (
      node.betweenToken.text.length +
      this.inlineWidth(node.expr1) +
      node.andToken.text.length +
      this.inlineWidth(node.expr2)
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
