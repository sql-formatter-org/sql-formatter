import { isToken, Token, TokenType } from './token';

/**
 * Bookkeeper for inline blocks.
 *
 * Inline blocks are parenthesised expressions that are shorter than INLINE_MAX_LENGTH.
 * These blocks are formatted on a single line, unlike longer parenthesised
 * expressions where open-parenthesis causes newline and increase of indentation.
 */
export default class InlineBlock {
  level: number;
  expressionWidth: number;

  constructor(expressionWidth: number) {
    this.level = 0;
    this.expressionWidth = expressionWidth;
  }

  /**
   * Begins inline block when lookahead through upcoming tokens determines
   * that the block would be smaller than INLINE_MAX_LENGTH.
   * @param  {Token[]} tokens Array of all tokens
   * @param  {Number} index Current token position
   */
  beginIfPossible(tokens: Token[], index: number) {
    if (this.level === 0 && this.isInlineBlock(tokens, index)) {
      this.level = 1;
    } else if (this.level > 0) {
      this.level++;
    } else {
      this.level = 0;
    }
  }

  /**
   * Finishes current inline block.
   * There might be several nested ones.
   */
  end() {
    this.level--;
  }

  /**
   * True when inside an inline block
   */
  isActive(): boolean {
    return this.level > 0;
  }

  /**
   * Check if this should be an inline parentheses block
   * Examples are "NOW()", "COUNT(*)", "int(10)", key(`somecolumn`), DECIMAL(7,2)
   */
  isInlineBlock(tokens: Token[], index: number): boolean {
    let length = 0;
    let level = 0;

    for (let i = index; i < tokens.length; i++) {
      const token = tokens[i];
      length += token.value.length;

      if (this.isForbiddenToken(token)) {
        return false;
      }

      // Overran max length
      if (length > this.expressionWidth) {
        return false;
      }

      if (token.type === TokenType.BLOCK_START) {
        level++;
      } else if (token.type === TokenType.BLOCK_END) {
        level--;
        if (level === 0) {
          return true;
        }
      }
    }
    return false;
  }

  // Reserved words that cause newlines, comments and semicolons
  // are not allowed inside inline parentheses block
  isForbiddenToken({ type, value }: Token) {
    return (
      type === TokenType.RESERVED_COMMAND ||
      type === TokenType.RESERVED_LOGICAL_OPERATOR ||
      // type === TokenType.LINE_COMMENT ||
      type === TokenType.BLOCK_COMMENT ||
      value === ';' ||
      isToken.CASE({ type, value }) // CASE cannot have inline blocks
    );
  }
}
