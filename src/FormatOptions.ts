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
  /**
   * Number of spaces per indentation level. Defaults to `2`
   */
  tabWidth: number;
  /**
   * Use tabs for indentation instead of spaces. Defaults to `false`
   */
  useTabs: boolean;
  /**
   * Transform case of keywords. Defaults to `"preserve"`
   */
  keywordCase: KeywordCase;
  /**
   * Transform case of identifiers. Defaults to `"preserve"`
   */
  identifierCase: IdentifierCase;
  /**
   * Transform case of data types. Defaults to `"preserve"`
   */
  dataTypeCase: DataTypeCase;
  /**
   * Transform case of function names. Defaults to `"preserve"`
   */
  functionCase: FunctionCase;
  /**
   * Indentation style. Defaults to `"standard"`
   */
  indentStyle: IndentStyle;
  /**
   * Position of logical operators in multiline conditions. Defaults to `"before"`
   */
  logicalOperatorNewline: LogicalOperatorNewline;
  /**
   * Maximum length of expressions before breaking into multiple lines. Defaults to `50`
   */
  expressionWidth: number;
  /**
   * Number of blank lines between queries. Defaults to `1`
   */
  linesBetweenQueries: number;
  /**
   * Remove spaces around operators. Defaults to `false`
   */
  denseOperators: boolean;
  /**
   * Place semicolon on new line. Defaults to `false`
   */
  newlineBeforeSemicolon: boolean;

  params?: ParamItems | string[];
  paramTypes?: ParamTypes;
}

export const defaultFormatOptions: FormatOptions = {
  tabWidth: 2,
  useTabs: false,
  keywordCase: 'preserve',
  identifierCase: 'preserve',
  dataTypeCase: 'preserve',
  functionCase: 'preserve',
  indentStyle: 'standard',
  logicalOperatorNewline: 'before',
  expressionWidth: 50,
  linesBetweenQueries: 1,
  denseOperators: false,
  newlineBeforeSemicolon: false,
};
