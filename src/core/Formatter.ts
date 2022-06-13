import type { FormatOptions } from 'src/types';
import Params from './Params';
import Tokenizer from './Tokenizer';
import formatCommaPositions from './formatCommaPositions';
import formatAliasPositions from './formatAliasPositions';
import AsTokenFactory from './AsTokenFactory';
import Parser, { type Statement } from './Parser';
import StatementFormatter from './StatementFormatter';
import { type Token } from './token';
import { indentString } from './config';

/** Main formatter class that produces a final output string from list of tokens */
export default class Formatter {
  private cfg: FormatOptions;
  private params: Params;

  constructor(cfg: FormatOptions) {
    this.cfg = cfg;
    this.params = new Params(this.cfg.params);
  }

  /**
   * SQL Tokenizer for this formatter, provided by subclasses.
   */
  protected tokenizer(): Tokenizer {
    throw new Error('tokenizer() not implemented by subclass');
  }

  // Cache the tokenizer for each class (each SQL dialect)
  // So we wouldn't need to recreate the tokenizer, which is kinda expensive,
  // for each call to format() function.
  private cachedTokenizer(): Tokenizer {
    const cls: Function & { cachedTokenizer?: Tokenizer } = this.constructor;
    if (!cls.cachedTokenizer) {
      cls.cachedTokenizer = this.tokenizer();
    }
    return cls.cachedTokenizer;
  }

  /**
   * Formats an SQL query.
   * @param {string} query - The SQL query string to be formatted
   * @return {string} The formatter query
   */
  public format(query: string): string {
    const tokens = this.cachedTokenizer().tokenize(query);
    const ast = new Parser(tokens).parse();
    const formattedQuery = this.formatAst(ast, tokens);
    const finalQuery = this.postFormat(formattedQuery);

    return finalQuery.trimEnd();
  }

  private formatAst(statements: Statement[], tokens: Token[]): string {
    const asTokenFactory = new AsTokenFactory(this.cfg.keywordCase, tokens);

    return statements
      .map(stat => new StatementFormatter(this.cfg, this.params, asTokenFactory).format(stat))
      .join('\n'.repeat(this.cfg.linesBetweenQueries + 1));
  }

  private postFormat(query: string): string {
    if (this.cfg.tabulateAlias) {
      query = formatAliasPositions(query);
    }
    if (this.cfg.commaPosition === 'before' || this.cfg.commaPosition === 'tabular') {
      query = formatCommaPositions(query, this.cfg.commaPosition, indentString(this.cfg));
    }

    return query;
  }
}
