import { FormatOptions } from '../FormatOptions.js';
import { indentString } from './config.js';
import Params from './Params.js';

import { createParser } from '../parser/createParser.js';
import { StatementNode } from '../parser/ast.js';
import { Dialect } from '../dialect.js';

import formatCommaPositions from './formatCommaPositions.js';
import ExpressionFormatter from './ExpressionFormatter.js';
import Layout, { WS } from './Layout.js';
import Indentation from './Indentation.js';

/** Main formatter class that produces a final output string from list of tokens */
export default class Formatter {
  private dialect: Dialect;
  private cfg: FormatOptions;
  private params: Params;

  constructor(dialect: Dialect, cfg: FormatOptions) {
    this.dialect = dialect;
    this.cfg = cfg;
    this.params = new Params(this.cfg.params);
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
    return createParser(this.dialect.tokenizer).parse(query, this.cfg.paramTypes || {});
  }

  private formatAst(statements: StatementNode[]): string {
    return statements
      .map(stat => this.formatStatement(stat))
      .join('\n'.repeat(this.cfg.linesBetweenQueries + 1));
  }

  private formatStatement(statement: StatementNode): string {
    const layout = new ExpressionFormatter({
      cfg: this.cfg,
      dialectCfg: this.dialect.formatOptions,
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
    if (this.cfg.commaPosition === 'before' || this.cfg.commaPosition === 'tabular') {
      query = formatCommaPositions(query, this.cfg.commaPosition, indentString(this.cfg));
    }

    return query;
  }
}
