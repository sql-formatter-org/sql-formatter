import { FormatOptions } from '../FormatOptions.js';
import { equalizeWhitespace, isMultiline, last } from '../utils.js';

import Params from './Params.js';
import { isTabularStyle } from './config.js';
import { TokenType } from '../lexer/token.js';
import {
  AllColumnsAsteriskNode,
  ArraySubscriptNode,
  AstNode,
  BetweenPredicateNode,
  SetOperationNode,
  ClauseNode,
  FunctionCallNode,
  LimitClauseNode,
  NodeType,
  ParenthesisNode,
  LiteralNode,
  IdentifierNode,
  ParameterNode,
  OperatorNode,
  LineCommentNode,
  BlockCommentNode,
  CommaNode,
  KeywordNode,
  PropertyAccessNode,
  CommentNode,
  CaseExpressionNode,
  CaseWhenNode,
  CaseElseNode,
  DataTypeNode,
  ParameterizedDataTypeNode,
  DisableCommentNode,
} from '../parser/ast.js';

import Layout, { WS } from './Layout.js';
import toTabularFormat, { isTabularToken } from './tabularStyle.js';
import InlineLayout, { InlineLayoutError } from './InlineLayout.js';

/**
 * Matches the canonical (upper-cased, whitespace-equalized) text of a
 * CREATE TABLE clause keyword phrase.
 *
 * Matches:
 *   CREATE TABLE
 *   CREATE OR REPLACE TABLE
 *   CREATE TEMP TABLE / CREATE TEMPORARY TABLE
 *   CREATE EXTERNAL TABLE / CREATE FOREIGN TABLE / CREATE SNAPSHOT TABLE
 *   CREATE TABLE IF NOT EXISTS (and the "OR REPLACE / TEMP / ..." variants)
 *
 * Does NOT match:
 *   CREATE TABLESPACE        (no column list)
 *   CREATE VIEW              (uses formatCreateView, different layout)
 *   CREATE FUNCTION / CREATE INDEX / CREATE SCHEMA / CREATE DATABASE
 */
const CREATE_TABLE_CLAUSE_REGEX = /^CREATE\b.*\bTABLE(?:\s+IF\s+NOT\s+EXISTS)?$/;

/**
 * Keywords that introduce a table-level constraint inside a CREATE TABLE
 * column list (e.g. `PRIMARY KEY (a)`, `CONSTRAINT uc UNIQUE (b)`, ...).
 *
 * Used by isCreateTableColumnDefinition() to avoid misclassifying such
 * constraints as column definitions when the first token happens to be
 * a keyword (some SQL dialects don't reserve common words like NAME, so
 * we have to accept keyword tokens as candidate column names too).
 */
const TABLE_CONSTRAINT_START_KEYWORDS = new Set([
  'CONSTRAINT',
  'PRIMARY',
  'FOREIGN',
  'UNIQUE',
  'CHECK',
  'INDEX',
  'KEY',
  'FULLTEXT',
  'SPATIAL',
  'LIKE',
  'EXCLUDE', // PostgreSQL EXCLUDE USING ...
  'CLUSTER', // some dialects
]);

/**
 * Keywords that introduce a column-level constraint or modifier inside a
 * CREATE TABLE column list (e.g. `col_name DEFAULT 0`,
 * `col_name REFERENCES other(col)`, `col_name PRIMARY KEY`).
 *
 * Used by isCreateTableColumnDefinition() to avoid misclassifying the
 * constraint keyword as the column's data type. Note that some of these
 * words (e.g. PRIMARY, FOREIGN, UNIQUE, CHECK, CONSTRAINT) also appear in
 * TABLE_CONSTRAINT_START_KEYWORDS, but we list them here too because a
 * column entry could in principle start with `col_name <constraint-kw>`
 * (some dialects allow omitting the type).
 */
const COLUMN_CONSTRAINT_KEYWORDS = new Set([
  'DEFAULT',
  'NULL',
  'NOT',
  'PRIMARY',
  'FOREIGN',
  'UNIQUE',
  'CHECK',
  'REFERENCES',
  'AUTO_INCREMENT',
  'COMMENT',
  'COLLATE',
  'GENERATED',
  'AS',
  'KEY',
]);

/**
 * Identifies a "column definition" entry inside a CREATE TABLE column list.
 *
 * A column definition has the shape:
 *
 *   <col-name> <data-type-or-type-like> [other...]
 *
 * where the first node is the column name and the second node is the
 * column's data type. We accept any of the following as the column name:
 *
 *   - identifier                    (the common case: id, name, email, ...)
 *   - keyword                       (some dialects reserve common words like
 *                                    NAME, DATE, NUMBER, ... and the parser
 *                                    emits them as keyword nodes; we still
 *                                    want to treat them as column names)
 *
 * ...and any of the following as the data type:
 *
 *   - data_type                     (e.g. INT, DATE, VARCHAR)
 *   - parameterized_data_type       (e.g. VARCHAR(100), DECIMAL(10,2))
 *   - identifier                    (e.g. TEXT, JSON, UUID, custom types -
 *                                    many SQL dialects don't reserve these
 *                                    as data type keywords, so the parser
 *                                    sees them as plain identifiers)
 *   - keyword                       (some dialects reserve type names like
 *                                    TEXT, STRING, ... as keywords rather
 *                                    than as data types; we still want to
 *                                    treat them as data types here, as long
 *                                    as they're not column-level constraint
 *                                    keywords like DEFAULT, NULL, ...)
 *
 * Table-level constraints (CONSTRAINT, PRIMARY KEY, FOREIGN KEY, UNIQUE,
 * CHECK, INDEX, ...) start with a known constraint keyword, so we exclude
 * those even when the first node is a keyword token.
 */
function isCreateTableColumnDefinition(entry: AstNode[]): boolean {
  if (entry.length < 2) {
    return false;
  }
  const colNameNode = entry[0];
  // First node must be a candidate column name: identifier or keyword.
  if (colNameNode.type !== NodeType.identifier && colNameNode.type !== NodeType.keyword) {
    return false;
  }
  // ...but not a known table-constraint starter. We check the text on both
  // identifier and keyword nodes because some dialects (e.g. PL/SQL) don't
  // reserve words like CONSTRAINT, so the parser emits them as identifiers.
  const colNameText = (colNameNode as { text: string }).text.toUpperCase();
  if (TABLE_CONSTRAINT_START_KEYWORDS.has(colNameText)) {
    return false;
  }
  // The second node must look like a data type.
  const colDefNode = entry[1];
  if (
    colDefNode.type === NodeType.data_type ||
    colDefNode.type === NodeType.parameterized_data_type ||
    colDefNode.type === NodeType.identifier
  ) {
    return true;
  }
  // A keyword is also acceptable as a data type, as long as it's not a
  // known column-level constraint keyword (DEFAULT, NULL, REFERENCES, ...).
  if (colDefNode.type === NodeType.keyword) {
    const colDefText = (colDefNode as KeywordNode).text.toUpperCase();
    return !COLUMN_CONSTRAINT_KEYWORDS.has(colDefText);
  }
  return false;
}

interface ExpressionFormatterParams {
  cfg: FormatOptions;
  dialectCfg: ProcessedDialectFormatOptions;
  params: Params;
  layout: Layout;
  inline?: boolean;
  // openParen of the nearest enclosing bracket ("(", "[" or "{"), if any
  enclosingParenthesis?: string;
  // Canonical (upper-cased) text of the enclosing SQL clause (e.g. "CREATE TABLE",
  // "SELECT", "WHERE"). Used by formatParenthesis() to detect when a parenthesis
  // is the column-list of a CREATE TABLE statement, so column-alignment can be
  // applied. Cleared (undefined) for nested expressions so the alignment only
  // triggers on the direct column-list paren of the CREATE TABLE clause.
  enclosingClauseName?: string;
}

export interface DialectFormatOptions {
  // List of operators that should always be formatted without surrounding spaces
  alwaysDenseOperators?: string[];
  // List of clauses that should be formatted on a single line
  onelineClauses: string[];
  // List of clauses that should be formatted on a single line in tabular style
  tabularOnelineClauses?: string[];
}

// Contains the same data as DialectFormatOptions,
// but optimized for faster and more conventient lookup.
export interface ProcessedDialectFormatOptions {
  alwaysDenseOperators: string[];
  onelineClauses: Record<string, boolean>;
  tabularOnelineClauses: Record<string, boolean>;
  // True when the dialect allows dashes inside identifiers (e.g. BigQuery).
  // In such dialects the "-" operator must keep its surrounding spaces,
  // otherwise "a - b" densed to "a-b" would re-parse as a single identifier.
  identifierDashes: boolean;
}

/** Formats a generic SQL expression */
export default class ExpressionFormatter {
  private cfg: FormatOptions;
  private dialectCfg: ProcessedDialectFormatOptions;
  private params: Params;
  private layout: Layout;

  private inline = false;
  private nodes: AstNode[] = [];
  private index = -1;
  private enclosingParenthesis?: string;
  private enclosingClauseName?: string;

  constructor({
    cfg,
    dialectCfg,
    params,
    layout,
    inline = false,
    enclosingParenthesis,
    enclosingClauseName,
  }: ExpressionFormatterParams) {
    this.cfg = cfg;
    this.dialectCfg = dialectCfg;
    this.inline = inline;
    this.params = params;
    this.layout = layout;
    this.enclosingParenthesis = enclosingParenthesis;
    this.enclosingClauseName = enclosingClauseName;
  }

  public format(nodes: AstNode[]): Layout {
    this.nodes = nodes;

    for (this.index = 0; this.index < this.nodes.length; this.index++) {
      this.formatNode(this.nodes[this.index]);
    }
    return this.layout;
  }

  private formatNode(node: AstNode) {
    this.formatComments(node.leadingComments);
    this.formatNodeWithoutComments(node);
    this.formatComments(node.trailingComments);
  }

  private formatNodeWithoutComments(node: AstNode) {
    switch (node.type) {
      case NodeType.function_call:
        return this.formatFunctionCall(node);
      case NodeType.parameterized_data_type:
        return this.formatParameterizedDataType(node);
      case NodeType.array_subscript:
        return this.formatArraySubscript(node);
      case NodeType.property_access:
        return this.formatPropertyAccess(node);
      case NodeType.parenthesis:
        return this.formatParenthesis(node);
      case NodeType.between_predicate:
        return this.formatBetweenPredicate(node);
      case NodeType.case_expression:
        return this.formatCaseExpression(node);
      case NodeType.case_when:
        return this.formatCaseWhen(node);
      case NodeType.case_else:
        return this.formatCaseElse(node);
      case NodeType.clause:
        return this.formatClause(node);
      case NodeType.set_operation:
        return this.formatSetOperation(node);
      case NodeType.limit_clause:
        return this.formatLimitClause(node);
      case NodeType.all_columns_asterisk:
        return this.formatAllColumnsAsterisk(node);
      case NodeType.literal:
        return this.formatLiteral(node);
      case NodeType.identifier:
        return this.formatIdentifier(node);
      case NodeType.parameter:
        return this.formatParameter(node);
      case NodeType.operator:
        return this.formatOperator(node);
      case NodeType.comma:
        return this.formatComma(node);
      case NodeType.line_comment:
        return this.formatLineComment(node);
      case NodeType.block_comment:
        return this.formatBlockComment(node);
      case NodeType.disable_comment:
        return this.formatBlockComment(node);
      case NodeType.data_type:
        return this.formatDataType(node);
      case NodeType.keyword:
        return this.formatKeywordNode(node);
    }
  }

  private formatFunctionCall(node: FunctionCallNode) {
    this.withComments(node.nameKw, () => {
      this.layout.add(this.showFunctionKw(node.nameKw));
    });
    this.formatNode(node.parenthesis);
  }

  private formatParameterizedDataType(node: ParameterizedDataTypeNode) {
    this.withComments(node.dataType, () => {
      this.layout.add(this.showDataType(node.dataType));
    });
    this.formatNode(node.parenthesis);
  }

  private formatArraySubscript(node: ArraySubscriptNode) {
    let formattedArray: string;

    switch (node.array.type) {
      case NodeType.data_type:
        formattedArray = this.showDataType(node.array);
        break;
      case NodeType.keyword:
        formattedArray = this.showKw(node.array);
        break;
      default:
        formattedArray = this.showIdentifier(node.array);
        break;
    }

    this.withComments(node.array, () => {
      this.layout.add(formattedArray);
    });

    this.formatNode(node.parenthesis);
  }

  private formatPropertyAccess(node: PropertyAccessNode) {
    this.formatNode(node.object);
    this.layout.add(WS.NO_SPACE, node.operator);
    this.formatNode(node.property);
  }

  private formatParenthesis(node: ParenthesisNode) {
    const inlineLayout = this.formatInlineExpression(node.children, node.openParen);

    if (inlineLayout) {
      this.layout.add(node.openParen);
      this.layout.add(...inlineLayout.getLayoutItems());
      this.layout.add(WS.NO_SPACE, node.closeParen, WS.SPACE);
    } else if (this.shouldAlignCreateTableColumns()) {
      this.formatCreateTableColumns(node);
    } else {
      this.layout.add(node.openParen, WS.NEWLINE);

      if (isTabularStyle(this.cfg)) {
        this.layout.add(WS.INDENT);
        this.layout = this.formatSubExpression(node.children, node.openParen);
      } else {
        this.layout.indentation.increaseBlockLevel();
        this.layout.add(WS.INDENT);
        this.layout = this.formatSubExpression(node.children, node.openParen);
        this.layout.indentation.decreaseBlockLevel();
      }

      this.layout.add(WS.NEWLINE, WS.INDENT, node.closeParen, WS.SPACE);
    }
  }

  /**
   * True when the current parenthesis is the direct column-list of a CREATE TABLE
   * clause and the createTableColumnAlignment option is enabled.
   *
   * We only align the *direct* column-list paren of a CREATE TABLE clause, not
   * any nested parens. The enclosingClauseName is cleared when recursing into a
   * parenthesis (see formatSubExpression), so this returns false for inner
   * parens such as the (100) in VARCHAR(100).
   */
  private shouldAlignCreateTableColumns(): boolean {
    return (
      Boolean(this.cfg.createTableColumnAlignment) &&
      Boolean(this.enclosingClauseName) &&
      CREATE_TABLE_CLAUSE_REGEX.test(this.enclosingClauseName as string)
    );
  }

  /**
   * Formats the column-list parenthesis of a CREATE TABLE statement with
   * three-column alignment:
   *
   *   <col_name> <col_def> <other...>
   *
   * where col_name is the column identifier, col_def is the data type (e.g.
   * INT or VARCHAR(100)), and "other" is everything else (constraints, comments,
   * defaults, ...). All three columns are left-aligned and padded to the
   * maximum width of their respective column across all column-definition
   * entries. Table-level constraints (PRIMARY KEY (...), FOREIGN KEY (...),
   * CONSTRAINT ...) do not follow the col_name/col_def/other pattern, so they
   * are emitted on their own line without padding.
   *
   * If any entry cannot be formatted as a single line (e.g. it contains
   * comments that force a newline, or it exceeds expressionWidth), the whole
   * parenthesis is formatted using the legacy multi-line layout instead.
   */
  private formatCreateTableColumns(node: ParenthesisNode): void {
    // Split children by commas into separate column entries.
    const entries = this.splitByComma(node.children);

    interface FormattedEntry {
      isColumn: boolean;
      colName?: string;
      colDef?: string;
      other?: string;
      raw?: string;
    }

    const formattedEntries: FormattedEntry[] = [];

    for (const entry of entries) {
      const isColumnDef = isCreateTableColumnDefinition(entry);

      if (isColumnDef) {
        const colName = this.formatInlineString([entry[0]]);
        // The data type may span one or two AST nodes:
        //   - one node:  data_type, parameterized_data_type, or a bare
        //                identifier (e.g. TEXT, JSON, custom types)
        //   - two nodes: an identifier (the type name) immediately followed
        //                by a parenthesis (the parameter list), e.g. the
        //                BigQuery-style VARCHAR(100), which the BigQuery
        //                tokenizer doesn't recognize as a reserved data type
        //                and therefore parses as identifier + parenthesis
        //                rather than as a single parameterized_data_type.
        const colDefNodes = [entry[1]];
        if (entry.length >= 3 && entry[2].type === NodeType.parenthesis) {
          colDefNodes.push(entry[2]);
        }
        const colDef = this.formatColDef(colDefNodes);
        const otherNodes = entry.slice(1 + colDefNodes.length);
        // For the "other" part (constraints, comments, defaults, ...), we use
        // a very large expression width so that long constraint lists like
        // "NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '...'"
        // don't trigger a fallback to the legacy layout. The "other" part is
        // meant to be on a single line by design (that's the whole point of
        // the column-alignment feature), so we only fall back when it truly
        // can't be inlined (e.g. it contains a multi-line comment).
        const other = otherNodes.length > 0 ? this.formatInlineString(otherNodes, true) : '';
        if (colName === undefined || colDef === undefined || other === undefined) {
          this.formatCreateTableFallback(node);
          return;
        }
        formattedEntries.push({ isColumn: true, colName, colDef, other });
      } else {
        // Table-level constraint or other non-column entry.
        // Same as above: use a large expression width to avoid spurious
        // fallbacks for long constraint expressions.
        const raw = this.formatInlineString(entry, true);
        if (raw === undefined) {
          this.formatCreateTableFallback(node);
          return;
        }
        formattedEntries.push({ isColumn: false, raw });
      }
    }

    // Compute max widths only across column-definition entries.
    const columnEntries = formattedEntries.filter(e => e.isColumn);
    const maxColName = columnEntries.reduce((m, e) => Math.max(m, (e.colName as string).length), 0);
    const maxColDef = columnEntries.reduce((m, e) => Math.max(m, (e.colDef as string).length), 0);

    // Output the open paren and indent.
    this.layout.add(node.openParen, WS.NEWLINE);

    if (isTabularStyle(this.cfg)) {
      this.layout.add(WS.INDENT);
    } else {
      this.layout.indentation.increaseBlockLevel();
      this.layout.add(WS.INDENT);
    }

    // Output each entry on its own line, comma-separated.
    // When the "other" part of a column entry exceeds the configured
    // createTableColumnAlignment_breakwidth, it is wrapped onto a new
    // continuation line. The continuation line is indented by the current
    // block-level indentation (which WS.INDENT produces) plus an extra
    // inter-column padding so the "other" content aligns with the start
    // of the third column on the previous line.
    const breakWidth = this.cfg.createTableColumnAlignment_breakwidth ?? Infinity;
    const thirdColPad = maxColName + 1 + maxColDef + 1;

    formattedEntries.forEach((entry, i) => {
      if (entry.isColumn) {
        const colName = (entry.colName as string).padEnd(maxColName);
        const colDef = (entry.colDef as string).padEnd(maxColDef);
        const other = entry.other as string;
        if (other) {
          // Wrap "other" to a continuation line when it exceeds breakWidth.
          // Note: breakWidth === Infinity keeps everything on one line
          // (matches the v1 behavior). breakWidth === 0 forces every
          // non-empty "other" onto its own line.
          if (other.length > breakWidth) {
            // First line: colName + colDef (no third column)
            this.layout.add(`${colName} ${colDef}`.trimEnd());
            // Continuation line: WS.INDENT produces the block-level
            // indentation, then we add the inter-column padding so the
            // "other" content visually aligns under the third column.
            this.layout.add(WS.MANDATORY_NEWLINE, WS.INDENT);
            this.layout.add(' '.repeat(thirdColPad) + other);
          } else {
            this.layout.add(`${colName} ${colDef} ${other}`);
          }
        } else {
          // No third-column content: trim trailing whitespace so we don't
          // leak spaces at end of line.
          this.layout.add(`${colName} ${colDef}`.trimEnd());
        }
      } else {
        this.layout.add(entry.raw as string);
      }

      if (i < formattedEntries.length - 1) {
        this.layout.add(WS.NO_SPACE, ',', WS.NEWLINE, WS.INDENT);
      }
    });

    if (!isTabularStyle(this.cfg)) {
      this.layout.indentation.decreaseBlockLevel();
    }

    this.layout.add(WS.NEWLINE, WS.INDENT, node.closeParen, WS.SPACE);
  }

  /**
   * Legacy multi-line formatting of a parenthesis, used as a fallback when
   * the column-alignment code can't apply (e.g. because some entry contains
   * a comment that forces a newline).
   */
  private formatCreateTableFallback(node: ParenthesisNode): void {
    this.layout.add(node.openParen, WS.NEWLINE);

    if (isTabularStyle(this.cfg)) {
      this.layout.add(WS.INDENT);
      this.layout = this.formatSubExpression(node.children, node.openParen);
    } else {
      this.layout.indentation.increaseBlockLevel();
      this.layout.add(WS.INDENT);
      this.layout = this.formatSubExpression(node.children, node.openParen);
      this.layout.indentation.decreaseBlockLevel();
    }

    this.layout.add(WS.NEWLINE, WS.INDENT, node.closeParen, WS.SPACE);
  }

  /**
   * Splits a flat list of AST nodes (the children of a parenthesis) into
   * groups separated by comma nodes. The comma nodes themselves are not
   * included in the returned groups.
   *
   * Example: [id, INT, PRIMARY, KEY, COMMA, name, VARCHAR_PAREN, NOT, NULL]
   * becomes [[id, INT, PRIMARY, KEY], [name, VARCHAR_PAREN, NOT, NULL]]
   */
  private splitByComma(nodes: AstNode[]): AstNode[][] {
    const entries: AstNode[][] = [];
    let current: AstNode[] = [];
    for (const node of nodes) {
      if (node.type === NodeType.comma) {
        entries.push(current);
        current = [];
      } else {
        current.push(node);
      }
    }
    if (current.length > 0) {
      entries.push(current);
    }
    return entries;
  }

  /**
   * Formats the given nodes as a single-line expression and returns the
   * resulting string. Returns undefined when the nodes cannot be formatted
   * inline (e.g. because they contain a newline or, when `unlimited` is
   * false, exceed expressionWidth).
   *
   * When `unlimited` is true, the expressionWidth limit is lifted — the
   * only thing that can cause undefined to be returned is encountering an
   * actual newline (e.g. from a multi-line comment). This is used by the
   * CREATE TABLE column-alignment code for the "other" part of column
   * definitions, which is meant to be on a single line by design even
   * when it's long (e.g. "NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE
   * CURRENT_TIMESTAMP COMMENT '...'").
   */
  private formatInlineString(nodes: AstNode[], unlimited = false): string | undefined {
    const inlineLayout = this.formatInlineExpression(nodes, undefined, unlimited);
    return inlineLayout?.toString().trim();
  }

  /**
   * Formats the column-definition (data type) part of a CREATE TABLE column
   * entry. The data type can span one or two AST nodes (see the comment in
   * formatCreateTableColumns for details).
   *
   * When the data type is a single node (the common case: data_type or
   * parameterized_data_type), we format it inline as-is.
   *
   * When the data type spans two nodes (identifier + parenthesis, as produced
   * by dialects that don't reserve the type name as a data type keyword,
   * e.g. BigQuery's VARCHAR(100)), we format each part separately and join
   * them without whitespace. This avoids the spurious space that would
   * otherwise appear between the type name and its parameter list (e.g.
   * "VARCHAR (100)" instead of "VARCHAR(100)"), keeping the column-alignment
   * layout consistent across dialects.
   */
  private formatColDef(nodes: AstNode[]): string | undefined {
    if (nodes.length === 1) {
      return this.formatInlineString(nodes);
    }
    const parts = nodes.map(n => this.formatInlineString([n]));
    if (parts.some(p => p === undefined)) {
      return undefined;
    }
    return parts.join('').trim();
  }

  private formatBetweenPredicate(node: BetweenPredicateNode) {
    this.layout.add(this.showKw(node.betweenKw), WS.SPACE);
    this.layout = this.formatSubExpression(node.expr1);
    this.layout.add(WS.NO_SPACE, WS.SPACE, this.showNonTabularKw(node.andKw), WS.SPACE);
    this.layout = this.formatSubExpression(node.expr2);
    this.layout.add(WS.NO_SPACE, WS.SPACE);
  }

  private formatCaseExpression(node: CaseExpressionNode) {
    this.formatNode(node.caseKw);

    this.layout.indentation.increaseBlockLevel();
    this.layout = this.formatSubExpression(node.expr);
    this.layout = this.formatSubExpression(node.clauses);
    this.layout.indentation.decreaseBlockLevel();

    this.layout.add(WS.NEWLINE, WS.INDENT);
    this.formatNode(node.endKw);
  }

  private formatCaseWhen(node: CaseWhenNode) {
    this.layout.add(WS.NEWLINE, WS.INDENT);
    this.formatNode(node.whenKw);
    this.layout = this.formatSubExpression(node.condition);
    this.formatNode(node.thenKw);
    this.layout = this.formatSubExpression(node.result);
  }

  private formatCaseElse(node: CaseElseNode) {
    this.layout.add(WS.NEWLINE, WS.INDENT);
    this.formatNode(node.elseKw);
    this.layout = this.formatSubExpression(node.result);
  }

  private formatClause(node: ClauseNode) {
    if (this.isOnelineClause(node)) {
      this.formatClauseInOnelineStyle(node);
    } else if (isTabularStyle(this.cfg)) {
      this.formatClauseInTabularStyle(node);
    } else {
      this.formatClauseInIndentedStyle(node);
    }
  }

  private isOnelineClause(node: ClauseNode): boolean {
    if (isTabularStyle(this.cfg)) {
      return this.dialectCfg.tabularOnelineClauses[node.nameKw.text];
    } else {
      return this.dialectCfg.onelineClauses[node.nameKw.text];
    }
  }

  private formatClauseInIndentedStyle(node: ClauseNode) {
    this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node.nameKw), WS.NEWLINE);
    this.layout.indentation.increaseTopLevel();
    this.layout.add(WS.INDENT);
    this.layout = this.formatSubExpression(node.children, undefined, node.nameKw.text);
    this.layout.indentation.decreaseTopLevel();
  }

  private formatClauseInOnelineStyle(node: ClauseNode) {
    this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node.nameKw), WS.SPACE);
    this.layout = this.formatSubExpression(node.children, undefined, node.nameKw.text);
  }

  private formatClauseInTabularStyle(node: ClauseNode) {
    this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node.nameKw), WS.SPACE);
    this.layout.indentation.increaseTopLevel();
    this.layout = this.formatSubExpression(node.children, undefined, node.nameKw.text);
    this.layout.indentation.decreaseTopLevel();
  }

  private formatSetOperation(node: SetOperationNode) {
    this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node.nameKw), WS.NEWLINE);
    this.layout.add(WS.INDENT);
    this.layout = this.formatSubExpression(node.children);
  }

  private formatLimitClause(node: LimitClauseNode) {
    this.withComments(node.limitKw, () => {
      this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node.limitKw));
    });
    this.layout.indentation.increaseTopLevel();

    if (isTabularStyle(this.cfg)) {
      this.layout.add(WS.SPACE);
    } else {
      this.layout.add(WS.NEWLINE, WS.INDENT);
    }

    if (node.offset) {
      this.layout = this.formatSubExpression(node.offset);
      this.layout.add(WS.NO_SPACE, ',', WS.SPACE);
      this.layout = this.formatSubExpression(node.count);
    } else {
      this.layout = this.formatSubExpression(node.count);
    }
    this.layout.indentation.decreaseTopLevel();
  }

  private formatAllColumnsAsterisk(_node: AllColumnsAsteriskNode) {
    this.layout.add('*', WS.SPACE);
  }

  private formatLiteral(node: LiteralNode) {
    this.layout.add(node.text, WS.SPACE);
  }

  private formatIdentifier(node: IdentifierNode) {
    this.layout.add(this.showIdentifier(node), WS.SPACE);
  }

  private formatParameter(node: ParameterNode) {
    this.layout.add(this.params.get(node), WS.SPACE);
  }

  private formatOperator({ text }: OperatorNode) {
    // In dialects that allow dashes inside identifiers (e.g. BigQuery) the "-"
    // operator must keep its surrounding spaces. Densing "a - b" into "a-b"
    // would otherwise re-parse as a single dashed identifier.
    if (text === '-' && this.dialectCfg.identifierDashes) {
      this.layout.add(text, WS.SPACE);
    } else if (/^OPERATOR\s*\(/iu.test(text)) {
      // PostgreSQL's "OPERATOR(schema.+)" is a keyword-like operator. Densing it
      // would glue it to its operands ("aOPERATOR(...)b") and re-parse as invalid
      // SQL, so keep its surrounding spaces even with denseOperators.
      this.layout.add(text, WS.SPACE);
    } else if (this.cfg.denseOperators || this.dialectCfg.alwaysDenseOperators.includes(text)) {
      this.layout.add(WS.NO_SPACE, text);
    } else if (text === ':' && this.enclosingParenthesis === '[') {
      // Array slice colon (e.g. arr[1:5]) should be formatted as dense
      this.layout.add(WS.NO_SPACE, text);
    } else if (text === ':') {
      this.layout.add(WS.NO_SPACE, text, WS.SPACE);
    } else {
      this.layout.add(text, WS.SPACE);
    }
  }

  private formatComma(_node: CommaNode) {
    if (!this.inline) {
      this.layout.add(WS.NO_SPACE, ',', WS.NEWLINE, WS.INDENT);
    } else {
      this.layout.add(WS.NO_SPACE, ',', WS.SPACE);
    }
  }

  private withComments(node: AstNode, fn: () => void) {
    this.formatComments(node.leadingComments);
    fn();
    this.formatComments(node.trailingComments);
  }

  private formatComments(comments: CommentNode[] | undefined) {
    if (!comments) {
      return;
    }
    comments.forEach(com => {
      if (com.type === NodeType.line_comment) {
        this.formatLineComment(com);
      } else {
        this.formatBlockComment(com);
      }
    });
  }

  private formatLineComment(node: LineCommentNode) {
    if (isMultiline(node.precedingWhitespace || '')) {
      this.layout.add(WS.NEWLINE, WS.INDENT, node.text, WS.MANDATORY_NEWLINE, WS.INDENT);
    } else if (this.layout.getLayoutItems().length > 0) {
      this.layout.add(WS.NO_NEWLINE, WS.SPACE, node.text, WS.MANDATORY_NEWLINE, WS.INDENT);
    } else {
      // comment is the first item in code - no need to add preceding spaces
      this.layout.add(node.text, WS.MANDATORY_NEWLINE, WS.INDENT);
    }
  }

  private formatBlockComment(node: BlockCommentNode | DisableCommentNode) {
    if (node.type === NodeType.block_comment && this.isStandaloneBlockComment(node)) {
      this.splitBlockComment(node.text).forEach(line => {
        this.layout.add(WS.NEWLINE, WS.INDENT, line);
      });
      this.layout.add(WS.NEWLINE, WS.INDENT);
    } else {
      this.layout.add(node.text, WS.SPACE);
    }
  }

  // True when:
  //
  // - the source text had a newline before the comment
  // - the comment itself is multi-line
  // - we have already added a newline to output text (right before this to-be added comment)
  //
  // The last one will ensure the comment position stays idempotent - so that
  // re-formatting the same SQL won't result in comment position changing.
  private isStandaloneBlockComment(node: BlockCommentNode): boolean {
    return (
      isMultiline(node.text) ||
      isMultiline(node.precedingWhitespace || '') ||
      this.layout.isAtStartOfLine()
    );
  }

  private isDocComment(comment: string): boolean {
    const lines = comment.split(/\n/);
    return (
      // first line starts with /* or /**
      /^\/\*\*?$/.test(lines[0]) &&
      // intermediate lines start with *
      lines.slice(1, lines.length - 1).every(line => /^\s*\*/.test(line)) &&
      // last line ends with */
      /^\s*\*\/$/.test(last(lines) as string)
    );
  }

  // Breaks up block comment to multiple lines.
  // For example this doc-comment (dots representing leading whitespace):
  //
  //   ..../**
  //   .....* Some description here
  //   .....* and here too
  //   .....*/
  //
  // gets broken to this array (note the leading single spaces):
  //
  //   [ '/**',
  //     '.* Some description here',
  //     '.* and here too',
  //     '.*/' ]
  //
  // However, a normal comment (non-doc-comment) like this:
  //
  //   ..../*
  //   ....Some description here
  //   ....*/
  //
  // gets broken to this array (no leading spaces):
  //
  //   [ '/*',
  //     'Some description here',
  //     '*/' ]
  //
  private splitBlockComment(comment: string): string[] {
    if (this.isDocComment(comment)) {
      return comment.split(/\n/).map(line => {
        if (/^\s*\*/.test(line)) {
          return ' ' + line.replace(/^\s*/, '');
        } else {
          return line;
        }
      });
    } else {
      return comment.split(/\n/).map(line => line.replace(/^\s*/, ''));
    }
  }

  private formatSubExpression(
    nodes: AstNode[],
    enclosingParenthesis = this.enclosingParenthesis,
    // When passing a clause name here, the new sub-formatter will treat a
    // direct child parenthesis as the column-list of that clause (used to
    // trigger CREATE TABLE column-alignment). Pass undefined to clear the
    // context for nested expressions so alignment does not leak into
    // inner parens.
    enclosingClauseName: string | undefined = undefined
  ): Layout {
    return new ExpressionFormatter({
      cfg: this.cfg,
      dialectCfg: this.dialectCfg,
      params: this.params,
      layout: this.layout,
      inline: this.inline,
      enclosingParenthesis,
      enclosingClauseName,
    }).format(nodes);
  }

  private formatInlineExpression(
    nodes: AstNode[],
    enclosingParenthesis = this.enclosingParenthesis,
    // When true, lift the expressionWidth limit so that long single-line
    // expressions (e.g. the "other" part of a CREATE TABLE column
    // definition) don't cause an InlineLayoutError. The only thing that
    // can still cause undefined to be returned is encountering an actual
    // newline (e.g. from a multi-line comment).
    unlimited = false
  ): Layout | undefined {
    const oldParamIndex = this.params.getPositionalParameterIndex();
    try {
      return new ExpressionFormatter({
        cfg: this.cfg,
        dialectCfg: this.dialectCfg,
        params: this.params,
        layout: new InlineLayout(unlimited ? Number.MAX_SAFE_INTEGER : this.cfg.expressionWidth),
        inline: true,
        enclosingParenthesis,
      }).format(nodes);
    } catch (e) {
      if (e instanceof InlineLayoutError) {
        // While formatting, some of the positional parameters might have
        // been consumed, which increased the current parameter index.
        // We reset the index to an earlier state, so we can run the
        // formatting again and re-consume these parameters in non-inline mode.
        this.params.setPositionalParameterIndex(oldParamIndex);
        return undefined;
      } else {
        // forward all unexpected errors
        throw e;
      }
    }
  }

  private formatKeywordNode(node: KeywordNode): void {
    switch (node.tokenType) {
      case TokenType.RESERVED_JOIN:
        return this.formatJoin(node);
      case TokenType.AND:
      case TokenType.OR:
      case TokenType.XOR:
        return this.formatLogicalOperator(node);
      default:
        return this.formatKeyword(node);
    }
  }

  private formatJoin(node: KeywordNode) {
    if (isTabularStyle(this.cfg)) {
      // in tabular style JOINs are at the same level as clauses
      this.layout.indentation.decreaseTopLevel();
      this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node), WS.SPACE);
      this.layout.indentation.increaseTopLevel();
    } else {
      this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node), WS.SPACE);
    }
  }

  private formatKeyword(node: KeywordNode) {
    this.layout.add(this.showKw(node), WS.SPACE);
  }

  private formatLogicalOperator(node: KeywordNode) {
    if (this.cfg.logicalOperatorNewline === 'before') {
      if (isTabularStyle(this.cfg)) {
        // In tabular style AND/OR is placed on the same level as clauses
        this.layout.indentation.decreaseTopLevel();
        this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node), WS.SPACE);
        this.layout.indentation.increaseTopLevel();
      } else {
        this.layout.add(WS.NEWLINE, WS.INDENT, this.showKw(node), WS.SPACE);
      }
    } else {
      this.layout.add(this.showKw(node), WS.NEWLINE, WS.INDENT);
    }
  }

  private formatDataType(node: DataTypeNode) {
    this.layout.add(this.showDataType(node), WS.SPACE);
  }

  private showKw(node: KeywordNode): string {
    if (isTabularToken(node.tokenType)) {
      return toTabularFormat(this.showNonTabularKw(node), this.cfg.indentStyle);
    } else {
      return this.showNonTabularKw(node);
    }
  }

  // Like showKw(), but skips tabular formatting
  private showNonTabularKw(node: KeywordNode): string {
    switch (this.cfg.keywordCase) {
      case 'preserve':
        return equalizeWhitespace(node.raw);
      case 'upper':
        return node.text;
      case 'lower':
        return node.text.toLowerCase();
    }
  }

  private showFunctionKw(node: KeywordNode): string {
    if (isTabularToken(node.tokenType)) {
      return toTabularFormat(this.showNonTabularFunctionKw(node), this.cfg.indentStyle);
    } else {
      return this.showNonTabularFunctionKw(node);
    }
  }

  // Like showFunctionKw(), but skips tabular formatting
  private showNonTabularFunctionKw(node: KeywordNode): string {
    switch (this.cfg.functionCase) {
      case 'preserve':
        return equalizeWhitespace(node.raw);
      case 'upper':
        return node.text;
      case 'lower':
        return node.text.toLowerCase();
    }
  }

  private showIdentifier(node: IdentifierNode): string {
    if (node.quoted) {
      return node.text;
    } else {
      switch (this.cfg.identifierCase) {
        case 'preserve':
          return node.text;
        case 'upper':
          return node.text.toUpperCase();
        case 'lower':
          return node.text.toLowerCase();
      }
    }
  }

  private showDataType(node: DataTypeNode): string {
    switch (this.cfg.dataTypeCase) {
      case 'preserve':
        return equalizeWhitespace(node.raw);
      case 'upper':
        return node.text;
      case 'lower':
        return node.text.toLowerCase();
    }
  }
}
