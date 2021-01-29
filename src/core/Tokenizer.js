import tokenTypes from './tokenTypes';
import * as regexFactory from './regexFactory';
import { escapeRegExp } from '../utils';

export default class Tokenizer {
  /**
   * @param {Object} cfg
   *  @param {String[]} cfg.reservedWords Reserved words in SQL
   *  @param {String[]} cfg.reservedTopLevelWords Words that are set to new line separately
   *  @param {String[]} cfg.reservedNewlineWords Words that are set to newline
   *  @param {String[]} cfg.reservedTopLevelWordsNoIndent Words that are top level but have no indentation
   *  @param {String[]} cfg.stringTypes String types to enable: "", '', ``, [], N''
   *  @param {String[]} cfg.openParens Opening parentheses to enable, like (, [
   *  @param {String[]} cfg.closeParens Closing parentheses to enable, like ), ]
   *  @param {String[]} cfg.indexedPlaceholderTypes Prefixes for indexed placeholders, like ?
   *  @param {String[]} cfg.namedPlaceholderTypes Prefixes for named placeholders, like @ and :
   *  @param {String[]} cfg.lineCommentTypes Line comments to enable, like # and --
   *  @param {String[]} cfg.specialWordChars Special chars that can be found inside of words, like @ and #
   *  @param {String[]} [cfg.operator] Additional operators to recognize
   */
  constructor(cfg) {
    this.WHITESPACE_REGEX = /^(\s+)/u;
    this.NUMBER_REGEX = /^((-\s*)?[0-9]+(\.[0-9]+)?([eE]-?[0-9]+(\.[0-9]+)?)?|0x[0-9a-fA-F]+|0b[01]+)\b/u;

    this.OPERATOR_REGEX = regexFactory.createOperatorRegex([
      '<>',
      '<=',
      '>=',
      ...(cfg.operators || []),
    ]);

    this.BLOCK_COMMENT_REGEX = /^(\/\*[^]*?(?:\*\/|$))/u;
    this.LINE_COMMENT_REGEX = regexFactory.createLineCommentRegex(cfg.lineCommentTypes);

    this.RESERVED_TOP_LEVEL_REGEX = regexFactory.createReservedWordRegex(cfg.reservedTopLevelWords);
    this.RESERVED_TOP_LEVEL_NO_INDENT_REGEX = regexFactory.createReservedWordRegex(
      cfg.reservedTopLevelWordsNoIndent
    );
    this.RESERVED_NEWLINE_REGEX = regexFactory.createReservedWordRegex(cfg.reservedNewlineWords);
    this.RESERVED_PLAIN_REGEX = regexFactory.createReservedWordRegex(cfg.reservedWords);

    this.WORD_REGEX = regexFactory.createWordRegex(cfg.specialWordChars);
    this.STRING_REGEX = regexFactory.createStringRegex(cfg.stringTypes);

    this.OPEN_PAREN_REGEX = regexFactory.createParenRegex(cfg.openParens);
    this.CLOSE_PAREN_REGEX = regexFactory.createParenRegex(cfg.closeParens);

    this.INDEXED_PLACEHOLDER_REGEX = regexFactory.createPlaceholderRegex(
      cfg.indexedPlaceholderTypes,
      '[0-9]*'
    );
    this.IDENT_NAMED_PLACEHOLDER_REGEX = regexFactory.createPlaceholderRegex(
      cfg.namedPlaceholderTypes,
      '[a-zA-Z0-9._$]+'
    );
    this.STRING_NAMED_PLACEHOLDER_REGEX = regexFactory.createPlaceholderRegex(
      cfg.namedPlaceholderTypes,
      regexFactory.createStringPattern(cfg.stringTypes)
    );
  }

  /**
   * Takes a SQL string and breaks it into tokens.
   * Each token is an object with type and value.
   *
   * @param {String} input The SQL string
   * @return {Object[]} tokens An array of tokens.
   *  @return {String} token.type
   *  @return {String} token.value
   *  @return {String} token.whitespaceBefore Preceding whitespace
   */
  tokenize(input) {
    const tokens = [];
    let token;

    // Keep processing the string until it is empty
    while (input.length) {
      // grab any preceding whitespace
      const whitespaceBefore = this.getWhitespace(input);
      input = input.substring(whitespaceBefore.length);

      if (input.length) {
        // Get the next token and the token type
        token = this.getNextToken(input, token);
        // Advance the string
        input = input.substring(token.value.length);

        tokens.push({ ...token, whitespaceBefore });
      }
    }
    return tokens;
  }

  getWhitespace(input) {
    const matches = input.match(this.WHITESPACE_REGEX);
    return matches ? matches[1] : '';
  }

  getNextToken(input, previousToken) {
    return (
      this.getCommentToken(input) ||
      this.getStringToken(input) ||
      this.getOpenParenToken(input) ||
      this.getCloseParenToken(input) ||
      this.getPlaceholderToken(input) ||
      this.getNumberToken(input) ||
      this.getReservedWordToken(input, previousToken) ||
      this.getWordToken(input) ||
      this.getOperatorToken(input)
    );
  }

  getCommentToken(input) {
    return this.getLineCommentToken(input) || this.getBlockCommentToken(input);
  }

  getLineCommentToken(input) {
    return this.getTokenOnFirstMatch({
      input,
      type: tokenTypes.LINE_COMMENT,
      regex: this.LINE_COMMENT_REGEX,
    });
  }

  getBlockCommentToken(input) {
    return this.getTokenOnFirstMatch({
      input,
      type: tokenTypes.BLOCK_COMMENT,
      regex: this.BLOCK_COMMENT_REGEX,
    });
  }

  getStringToken(input) {
    return this.getTokenOnFirstMatch({
      input,
      type: tokenTypes.STRING,
      regex: this.STRING_REGEX,
    });
  }

  getOpenParenToken(input) {
    return this.getTokenOnFirstMatch({
      input,
      type: tokenTypes.OPEN_PAREN,
      regex: this.OPEN_PAREN_REGEX,
    });
  }

  getCloseParenToken(input) {
    return this.getTokenOnFirstMatch({
      input,
      type: tokenTypes.CLOSE_PAREN,
      regex: this.CLOSE_PAREN_REGEX,
    });
  }

  getPlaceholderToken(input) {
    return (
      this.getIdentNamedPlaceholderToken(input) ||
      this.getStringNamedPlaceholderToken(input) ||
      this.getIndexedPlaceholderToken(input)
    );
  }

  getIdentNamedPlaceholderToken(input) {
    return this.getPlaceholderTokenWithKey({
      input,
      regex: this.IDENT_NAMED_PLACEHOLDER_REGEX,
      parseKey: (v) => v.slice(1),
    });
  }

  getStringNamedPlaceholderToken(input) {
    return this.getPlaceholderTokenWithKey({
      input,
      regex: this.STRING_NAMED_PLACEHOLDER_REGEX,
      parseKey: (v) =>
        this.getEscapedPlaceholderKey({ key: v.slice(2, -1), quoteChar: v.slice(-1) }),
    });
  }

  getIndexedPlaceholderToken(input) {
    return this.getPlaceholderTokenWithKey({
      input,
      regex: this.INDEXED_PLACEHOLDER_REGEX,
      parseKey: (v) => v.slice(1),
    });
  }

  getPlaceholderTokenWithKey({ input, regex, parseKey }) {
    const token = this.getTokenOnFirstMatch({ input, regex, type: tokenTypes.PLACEHOLDER });
    if (token) {
      token.key = parseKey(token.value);
    }
    return token;
  }

  getEscapedPlaceholderKey({ key, quoteChar }) {
    return key.replace(new RegExp(escapeRegExp('\\' + quoteChar), 'gu'), quoteChar);
  }

  // Decimal, binary, or hex numbers
  getNumberToken(input) {
    return this.getTokenOnFirstMatch({
      input,
      type: tokenTypes.NUMBER,
      regex: this.NUMBER_REGEX,
    });
  }

  // Punctuation and symbols
  getOperatorToken(input) {
    return this.getTokenOnFirstMatch({
      input,
      type: tokenTypes.OPERATOR,
      regex: this.OPERATOR_REGEX,
    });
  }

  getReservedWordToken(input, previousToken) {
    // A reserved word cannot be preceded by a "."
    // this makes it so in "mytable.from", "from" is not considered a reserved word
    if (previousToken && previousToken.value && previousToken.value === '.') {
      return undefined;
    }
    return (
      this.getTopLevelReservedToken(input) ||
      this.getNewlineReservedToken(input) ||
      this.getTopLevelReservedTokenNoIndent(input) ||
      this.getPlainReservedToken(input)
    );
  }

  getTopLevelReservedToken(input) {
    return this.getTokenOnFirstMatch({
      input,
      type: tokenTypes.RESERVED_TOP_LEVEL,
      regex: this.RESERVED_TOP_LEVEL_REGEX,
    });
  }

  getNewlineReservedToken(input) {
    return this.getTokenOnFirstMatch({
      input,
      type: tokenTypes.RESERVED_NEWLINE,
      regex: this.RESERVED_NEWLINE_REGEX,
    });
  }

  getTopLevelReservedTokenNoIndent(input) {
    return this.getTokenOnFirstMatch({
      input,
      type: tokenTypes.RESERVED_TOP_LEVEL_NO_INDENT,
      regex: this.RESERVED_TOP_LEVEL_NO_INDENT_REGEX,
    });
  }

  getPlainReservedToken(input) {
    return this.getTokenOnFirstMatch({
      input,
      type: tokenTypes.RESERVED,
      regex: this.RESERVED_PLAIN_REGEX,
    });
  }

  getWordToken(input) {
    return this.getTokenOnFirstMatch({
      input,
      type: tokenTypes.WORD,
      regex: this.WORD_REGEX,
    });
  }

  getTokenOnFirstMatch({ input, type, regex }) {
    const matches = input.match(regex);

    return matches ? { type, value: matches[1] } : undefined;
  }
}
