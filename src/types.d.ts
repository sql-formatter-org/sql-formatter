import type { SqlLanguage } from './sqlFormatter';
import { type ParamItems } from './formatter/Params';

export type IndentStyle = 'standard' | 'tabularLeft' | 'tabularRight';

export type KeywordCase = 'preserve' | 'upper' | 'lower';

export type AliasMode = 'preserve' | 'always' | 'never' | 'select';

export type CommaPosition = 'before' | 'after' | 'tabular';

export type LogicalOperatorNewline = 'before' | 'after';

export interface FormatOptions {
  language: SqlLanguage;
  tabWidth: number;
  useTabs: boolean;
  keywordCase: KeywordCase;
  indentStyle: IndentStyle;
  logicalOperatorNewline: LogicalOperatorNewline;
  aliasAs: AliasMode;
  tabulateAlias: boolean;
  commaPosition: CommaPosition;
  expressionWidth: number;
  linesBetweenQueries: number;
  denseOperators: boolean;
  newlineBeforeSemicolon: boolean;
  params?: ParamItems | string[];
}
