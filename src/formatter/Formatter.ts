import { FormatOptions } from '../FormatOptions.js';
import { indentString } from './config.js';
import Params from './Params.js';
import Tokenizer from '../lexer/Tokenizer.js';

import { createParser } from '../parser/createParser.js';
import { StatementNode } from '../parser/ast.js';
import { cacheInClassField } from '../utils.js';

import formatCommaPositions from './formatCommaPositions.js';
import formatAliasPositions from './formatAliasPositions.js';
import ExpressionFormatter, {
  DialectFormatOptions,
  ProcessedDialectFormatOptions,
} from './ExpressionFormatter.js';
import Layout, { WS } from './Layout.js';
import Indentation from './Indentation.js';

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
    return cacheInClassField(this.constructor, 'cachedTokenizer', () => this.tokenizer());
  }

  /**
   * Dialect-specific formatting configuration, provided by subclass.
   */
  protected formatOptions(): DialectFormatOptions {
    throw new Error('formatOptions() not implemented by sybclass');
  }

  private cachedFormatOptions(): ProcessedDialectFormatOptions {
    return cacheInClassField(this.constructor, 'cachedFormatOptions', () => {
      const opts = this.formatOptions();
      return {
        alwaysDenseOperators: opts.alwaysDenseOperators || [],
        onelineClauses: Object.fromEntries(opts.onelineClauses.map(name => [name, true])),
      };
    });
  }

  /**
   * Formats an SQL query.
   * @param {string} query - The SQL query string to be formatted
   * @return {string} The formatter query
   */
  public format(query: string): string {
    const ast = this.parse(query);
    const formattedQuery = this.formatAst(ast);
    const finalQuery = this.postFormat(formattedQuery);

    return finalQuery.trimEnd();
  }

  private parse(query: string): StatementNode[] {
    return createParser(this.cachedTokenizer()).parse(query, this.cfg.paramTypes || {});
  }

  private formatAst(statements: StatementNode[]): string {
    return statements
      .map(stat => this.formatStatement(stat))
      .join('\n'.repeat(this.cfg.linesBetweenQueries + 1));
  }

  private formatStatement(statement: StatementNode): string {
    const layout = new ExpressionFormatter({
      cfg: this.cfg,
      dialectCfg: this.cachedFormatOptions(),
      params: this.params,
      layout: new Layout(new Indentation(indentString(this.cfg))),
    }).format(statement.children);

    if (!statement.hasSemicolon) {
      // do nothing
    } else if (this.cfg.newlineBeforeSemicolon) {
      layout.add(WS.NEWLINE, ';');
    } else {
      layout.add(WS.NO_NEWLINE, ';');
    }
    return layout.toString();
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
