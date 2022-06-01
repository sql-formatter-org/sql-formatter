import { type ParamItems } from './core/Params';

export type IndentStyle = 'standard' | 'tabularLeft' | 'tabularRight';

export type KeywordCase = 'preserve' | 'upper' | 'lower';

export type MultilineListsMode = 'always' | 'avoid' | 'expressionWidth';

export type AliasMode = 'preserve' | 'always' | 'never' | 'select';

export type CommaPosition = 'before' | 'after' | 'tabular';

export type LogicalOperatorNewline = 'before' | 'after';

export interface FormatOptions {
  tabWidth: number;
  useTabs: boolean;
  keywordCase: KeywordCase;
  indentStyle: IndentStyle;
  multilineLists: MultilineListsMode | number;
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
