import tokenTypes from './tokenTypes';
import Indentation from './Indentation';
import InlineBlock from './InlineBlock';
import Params from './Params';
import { trimSpacesEnd } from '../utils';
import { isAnd, isBetween, isLimit } from './token';

export default class Formatter {
  /**
   * @param {Object} cfg
   *  @param {String} cfg.language
   *  @param {String} cfg.indent
   *  @param {Boolean} cfg.uppercase
   *  @param {Integer} cfg.linesBetweenQueries
   *  @param {Object} cfg.params
   */
  constructor(cfg) {
    this.cfg = cfg;
    this.indentation = new Indentation(this.cfg.indent);
    this.inlineBlock = new InlineBlock();
    this.params = new Params(this.cfg.params);
    this.previousReservedToken = {};
    this.tokens = [];
    this.index = 0;
  }

  /**
   * SQL Tokenizer for this formatter, provided by subclasses.
   */
  tokenizer() {
    throw new Error('tokenizer() not implemented by subclass');
  }

  /**
   * Reprocess and modify a token based on parsed context.
   *
   * @param {Object} token The token to modify
   *  @param {String} token.type
   *  @param {String} token.value
   * @return {Object} new token or the original
   *  @return {String} token.type
   *  @return {String} token.value
   */
  tokenOverride(token) {
    // subclasses can override this to modify tokens during formatting
    return token;
  }

  /**
   * Formats whitespace in a SQL string to make it easier to read.
   *
   * @param {String} query The SQL query string
   * @return {String} formatted query
   */
  format(query) {
    this.tokens = this.tokenizer().tokenize(query);
    const formattedQuery = this.getFormattedQueryFromTokens();

    return formattedQuery.trim();
  }

  getFormattedQueryFromTokens() {
    let formattedQuery = '';

    this.tokens.forEach((token, index) => {
      this.index = index;

      token = this.tokenOverride(token);

      if (token.type === tokenTypes.LINE_COMMENT) {
        formattedQuery = this.formatLineComment(token, formattedQuery);
      } else if (token.type === tokenTypes.BLOCK_COMMENT) {
        formattedQuery = this.formatBlockComment(token, formattedQuery);
      } else if (token.type === tokenTypes.RESERVED_TOP_LEVEL) {
        formattedQuery = this.formatTopLevelReservedWord(token, formattedQuery);
        this.previousReservedToken = token;
      } else if (token.type === tokenTypes.RESERVED_TOP_LEVEL_NO_INDENT) {
        formattedQuery = this.formatTopLevelReservedWordNoIndent(token, formattedQuery);
        this.previousReservedToken = token;
      } else if (token.type === tokenTypes.RESERVED_NEWLINE) {
        formattedQuery = this.formatNewlineReservedWord(token, formattedQuery);
        this.previousReservedToken = token;
      } else if (token.type === tokenTypes.RESERVED) {
        formattedQuery = this.formatWithSpaces(token, formattedQuery);
        this.previousReservedToken = token;
      } else if (token.type === tokenTypes.OPEN_PAREN) {
        formattedQuery = this.formatOpeningParentheses(token, formattedQuery);
      } else if (token.type === tokenTypes.CLOSE_PAREN) {
        formattedQuery = this.formatClosingParentheses(token, formattedQuery);
      } else if (token.type === tokenTypes.PLACEHOLDER) {
        formattedQuery = this.formatPlaceholder(token, formattedQuery);
      } else if (token.value === ',') {
        formattedQuery = this.formatComma(token, formattedQuery);
      } else if (token.value === ':') {
        formattedQuery = this.formatWithSpaceAfter(token, formattedQuery);
      } else if (token.value === '.') {
        formattedQuery = this.formatWithoutSpaces(token, formattedQuery);
      } else if (token.value === ';') {
        formattedQuery = this.formatQuerySeparator(token, formattedQuery);
      } else {
        formattedQuery = this.formatWithSpaces(token, formattedQuery);
      }
    });
    return formattedQuery;
  }

  formatLineComment(token, query) {
    return this.addNewline(query + this.show(token));
  }

  formatBlockComment(token, query) {
    return this.addNewline(this.addNewline(query) + this.indentComment(token.value));
  }

  indentComment(comment) {
    return comment.replace(/\n[ \t]*/gu, '\n' + this.indentation.getIndent() + ' ');
  }

  formatTopLevelReservedWordNoIndent(token, query) {
    this.indentation.decreaseTopLevel();
    query = this.addNewline(query) + this.equalizeWhitespace(this.show(token));
    return this.addNewline(query);
  }

  formatTopLevelReservedWord(token, query) {
    this.indentation.decreaseTopLevel();

    query = this.addNewline(query);

    this.indentation.increaseTopLevel();

    query += this.equalizeWhitespace(this.show(token));
    return this.addNewline(query);
  }

  formatNewlineReservedWord(token, query) {
    if (isAnd(token) && isBetween(this.tokenLookBehind(2))) {
      return this.formatWithSpaces(token, query);
    }
    return this.addNewline(query) + this.equalizeWhitespace(this.show(token)) + ' ';
  }

  // Replace any sequence of whitespace characters with single space
  equalizeWhitespace(string) {
    return string.replace(/\s+/gu, ' ');
  }

  // Opening parentheses increase the block indent level and start a new line
  formatOpeningParentheses(token, query) {
    // Take out the preceding space unless there was whitespace there in the original query
    // or another opening parens or line comment
    const preserveWhitespaceFor = {
      [tokenTypes.OPEN_PAREN]: true,
      [tokenTypes.LINE_COMMENT]: true,
      [tokenTypes.OPERATOR]: true,
    };
    if (
      token.whitespaceBefore.length === 0 &&
      !preserveWhitespaceFor[this.tokenLookBehind()?.type]
    ) {
      query = trimSpacesEnd(query);
    }
    query += this.show(token);

    this.inlineBlock.beginIfPossible(this.tokens, this.index);

    if (!this.inlineBlock.isActive()) {
      this.indentation.increaseBlockLevel();
      query = this.addNewline(query);
    }
    return query;
  }

  // Closing parentheses decrease the block indent level
  formatClosingParentheses(token, query) {
    if (this.inlineBlock.isActive()) {
      this.inlineBlock.end();
      return this.formatWithSpaceAfter(token, query);
    } else {
      this.indentation.decreaseBlockLevel();
      return this.formatWithSpaces(token, this.addNewline(query));
    }
  }

  formatPlaceholder(token, query) {
    return query + this.params.get(token) + ' ';
  }

  // Commas start a new line (unless within inline parentheses or SQL "LIMIT" clause)
  formatComma(token, query) {
    query = trimSpacesEnd(query) + this.show(token) + ' ';

    if (this.inlineBlock.isActive()) {
      return query;
    } else if (isLimit(this.previousReservedToken)) {
      return query;
    } else {
      return this.addNewline(query);
    }
  }

  formatWithSpaceAfter(token, query) {
    return trimSpacesEnd(query) + this.show(token) + ' ';
  }

  formatWithoutSpaces(token, query) {
    return trimSpacesEnd(query) + this.show(token);
  }

  formatWithSpaces(token, query) {
    return query + this.show(token) + ' ';
  }

  formatQuerySeparator(token, query) {
    this.indentation.resetIndentation();
    return trimSpacesEnd(query) + this.show(token) + '\n'.repeat(this.cfg.linesBetweenQueries || 1);
  }

  // Converts token to string (uppercasing it if needed)
  show({ type, value }) {
    if (
      this.cfg.uppercase &&
      (type === tokenTypes.RESERVED ||
        type === tokenTypes.RESERVED_TOP_LEVEL ||
        type === tokenTypes.RESERVED_TOP_LEVEL_NO_INDENT ||
        type === tokenTypes.RESERVED_NEWLINE ||
        type === tokenTypes.OPEN_PAREN ||
        type === tokenTypes.CLOSE_PAREN)
    ) {
      return value.toUpperCase();
    } else {
      return value;
    }
  }

  addNewline(query) {
    query = trimSpacesEnd(query);
    if (!query.endsWith('\n')) {
      query += '\n';
    }
    return query + this.indentation.getIndent();
  }

  tokenLookBehind(n = 1) {
    return this.tokens[this.index - n];
  }

  tokenLookAhead(n = 1) {
    return this.tokens[this.index + n];
  }
}
