// import only type to avoid ESLint no-cycle rule producing an error
import { ParamItems } from './formatter/Params.js';
import { ParamTypes } from './lexer/TokenizerOptions.js';

export type IndentStyle = 'standard' | 'tabularLeft' | 'tabularRight';

export type KeywordCase = 'preserve' | 'upper' | 'lower';
export type IdentifierCase = KeywordCase;
export type DataTypeCase = KeywordCase;
export type FunctionCase = KeywordCase;

export type LogicalOperatorNewline = 'before' | 'after';

export interface FormatOptions {
  tabWidth: number;
  useTabs: boolean;
  keywordCase: KeywordCase;
  identifierCase: IdentifierCase;
  dataTypeCase: DataTypeCase;
  functionCase: FunctionCase;
  indentStyle: IndentStyle;
  logicalOperatorNewline: LogicalOperatorNewline;
  expressionWidth: number;
  linesBetweenQueries: number;
  denseOperators: boolean;
  newlineBeforeSemicolon: boolean;
  params?: ParamItems | string[];
  paramTypes?: ParamTypes;
  /**
   * When true, formats CREATE TABLE column definitions in a column-aligned
   * layout: column name in the first column, column definition (data type)
   * in the second column, and the remaining clauses (constraints, comments,
   * defaults, ...) in the third column. All three columns are left-aligned
   * and padded so the start of each column lines up across rows.
   *
   * Defaults to false (preserves the legacy single-space layout).
   *
   * Table-level constraints (e.g. PRIMARY KEY (...), FOREIGN KEY (...),
   * CONSTRAINT ...) are not column definitions, so they are emitted on their
   * own line without column padding.
   */
  createTableColumnAlignment?: boolean;
  /**
   * Maximum character length of the "other" (third) column in a CREATE TABLE
   * column-definition entry when `createTableColumnAlignment` is enabled.
   *
   * When the "other" part of a column (constraints, comments, defaults,
   * ...) is shorter than or equal to this width, it is placed on the same
   * line as the column name and data type:
   *
   *   col_name  data_type  NOT NULL DEFAULT 1 COMMENT 'short'
   *
   * When it exceeds this width, it is wrapped to a new line, indented to
   * align with the start of the "other" column (i.e. after the padded
   * col_name + col_def + two separator spaces):
   *
   *   col_name  data_type
   *                       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE
   *                       CURRENT_TIMESTAMP COMMENT 'a very long comment'
   *
   * Defaults to `Infinity`, meaning the "other" part is always kept on the
   * same line regardless of length (matches the v1 behavior of the option).
   * Set to `0` to always wrap the "other" part to a new line.
   *
   * Only takes effect when `createTableColumnAlignment: true`. Ignored
   * otherwise.
   */
  createTableColumnAlignment_breakwidth?: number;
}
