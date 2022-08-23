import { TokenType, isLogicalOperator } from 'src/lexer/token';
import {
  AstNode,
  BetweenPredicateNode,
  KeywordNode,
  NodeType,
  ParenthesisNode,
} from 'src/parser/ast';

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
  public isInlineBlock(parenthesis: ParenthesisNode): boolean {
    return this.inlineParenthesisWidth(parenthesis) <= this.expressionWidth;
  }

  private inlineParenthesisWidth(parenthesis: ParenthesisNode): number {
    // +2 for the two parenthesis
    return this.inlineWidth(parenthesis.children) + 2;
  }

  private inlineWidth(nodes: AstNode[]): number {
    let length = 0;

    for (const node of nodes) {
      switch (node.type) {
        case NodeType.function_call:
          length += node.name.text.length + this.inlineParenthesisWidth(node.parenthesis);
          break;
        case NodeType.array_subscript:
          length += node.array.text.length + this.inlineParenthesisWidth(node.parenthesis);
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
        case NodeType.line_comment:
        case NodeType.block_comment:
          return Infinity;
        case NodeType.all_columns_asterisk:
        case NodeType.comma:
          length += 1;
          break;
        case NodeType.literal:
        case NodeType.identifier:
        case NodeType.parameter:
        case NodeType.operator:
          length += node.text.length;
          break;
        case NodeType.keyword:
          length += node.text.length;
          if (this.isForbiddenKeyword(node)) {
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

  private betweenWidth(node: BetweenPredicateNode): number {
    return (
      node.between.text.length +
      this.inlineWidth(node.expr1) +
      node.and.text.length +
      this.inlineWidth(node.expr2)
    );
  }

  // Reserved words that cause newlines are not allowed inside inline parentheses block
  private isForbiddenKeyword(node: KeywordNode) {
    return isLogicalOperator(node.tokenType) || node.tokenType === TokenType.CASE;
  }
}
