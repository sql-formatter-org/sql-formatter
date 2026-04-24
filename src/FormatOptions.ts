// import only type to avoid ESLint no-cycle rule producing an error
import { ParamItems } from './formatter/Params.js';
import { ParamTypes } from './lexer/TokenizerOptions.js';

export type IndentStyle = 'standard' | 'tabularLeft' | 'tabularRight';

export type KeywordCase = 'preserve' | 'upper' | 'lower';
export type IdentifierCase = KeywordCase;
export type DataTypeCase = KeywordCase;
export type FunctionCase = KeywordCase;

export type LogicalOperatorNewline = 'before' | 'after';

export type ColorKeys =
  | 'keyword'
  | 'operator'
  | 'comment'
  | 'string'
  | 'number'
  | 'function'
  | 'parenthesis'
  | 'identifier'
  | 'dataType';

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
  compactParenthesis: boolean;
  maxLengthInParenthesis?: number;
  colors: boolean;
  colorsMap: Record<ColorKeys, (input: string) => string>;
}
