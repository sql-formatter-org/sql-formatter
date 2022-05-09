import { ParamItems } from './core/Params';

export type IndentStyle = 'standard' | 'tabularLeft' | 'tabularRight';

export type KeywordCase = 'preserve' | 'upper' | 'lower';

export type NewlineMode = 'always' | 'never' | 'expressionWidth';

export type AliasMode = 'preserve' | 'always' | 'never' | 'select';

export type CommaPosition = 'before' | 'after' | 'tabular';

export type LogicalOperatorNewline = 'before' | 'after';

export interface FormatOptions {
  indent: string;
  keywordCase: KeywordCase;
  indentStyle: IndentStyle;
  multilineLists: NewlineMode | number;
  logicalOperatorNewline: LogicalOperatorNewline;
  aliasAs: AliasMode;
  tabulateAlias: boolean;
  commaPosition: CommaPosition;
  newlineBeforeOpenParen: boolean;
  newlineBeforeCloseParen: boolean;
  expressionWidth: number;
  linesBetweenQueries: number;
  denseOperators: boolean;
  newlineBeforeSemicolon: boolean;
  params?: ParamItems | string[];
}
