import type { SqlLanguage } from './sqlFormatter';
import { type ParamItems } from './formatter/Params';
import Formatter from './formatter/Formatter';
import { ParamTypes } from './lexer/TokenizerOptions';

export type IndentStyle = 'standard' | 'tabularLeft' | 'tabularRight';

export type KeywordCase = 'preserve' | 'upper' | 'lower';

export type CommaPosition = 'before' | 'after' | 'tabular';

export type LogicalOperatorNewline = 'before' | 'after';

export interface FormatOptions {
  language: SqlLanguage | typeof Formatter;
  tabWidth: number;
  useTabs: boolean;
  keywordCase: KeywordCase;
  indentStyle: IndentStyle;
  logicalOperatorNewline: LogicalOperatorNewline;
  tabulateAlias: boolean;
  commaPosition: CommaPosition;
  expressionWidth: number;
  linesBetweenQueries: number;
  denseOperators: boolean;
  newlineBeforeSemicolon: boolean;
  params?: ParamItems | string[];
  paramTypes?: ParamTypes;
}
