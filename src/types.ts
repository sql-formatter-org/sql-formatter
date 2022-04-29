import { ParamItems } from './core/Params';

/**
 * Enum for the different keyword formats
 * @enum {string}
 * @property {string} standard - Standard keyword format
 * @property {string} tenSpaceLeft - Central aligned keyword format, keywords left-aligned
 * @property {string} tenSpaceRight - Central aligned keyword format, keywords right-aligned
 */
export enum KeywordMode {
  standard = 'standard',
  tenSpaceLeft = 'tenSpaceLeft',
  tenSpaceRight = 'tenSpaceRight',
}

export enum KeywordCase {
  preserve = 'preserve',
  upper = 'upper',
  lower = 'lower',
}

/**
 * Enum for the different newline modes
 * @enum {string}
 * @property {string} always - Always use newlines
 * @property {string} never - Never use newlines
 * @property {string} lineWidth - Use newlines when line width is greater than the specified number
 */
export enum NewlineMode {
  always = 'always',
  never = 'never',
  lineWidth = 'lineWidth',
}

/**
 * Enum for when to place AS for column aliases
 * @enum {string}
 * @property {string} preserve - Don't change, keep like in original
 * @property {string} always - Always use AS
 * @property {string} never - Never use AS
 * @property {string} select - Only use AS for SELECT clauses
 */
export enum AliasMode {
  preserve = 'preserve',
  always = 'always',
  never = 'never',
  select = 'select',
}

/**
 * Enum for when to place commas in listed clauses
 * @enum {string}
 * @property {string} after - Place after each item
 * @property {string} before - Place before each item
 * @property {string} tabular - Place commas at end of line, right-justified
 */
export enum CommaPosition {
  before = 'before',
  after = 'after',
  tabular = 'tabular',
}

export interface ParenOptions {
  openParenNewline?: boolean;
  closeParenNewline?: boolean;
}

export interface FormatOptions {
  indent: string;
  keywordCase: KeywordCase;
  keywordPosition: KeywordMode;
  newline: NewlineMode | number;
  breakBeforeBooleanOperator: boolean;
  aliasAs: AliasMode;
  tabulateAlias: boolean;
  commaPosition: CommaPosition;
  parenOptions: ParenOptions;
  lineWidth: number;
  linesBetweenQueries: number;
  denseOperators: boolean;
  semicolonNewline: boolean;
  params?: ParamItems | string[];
}
