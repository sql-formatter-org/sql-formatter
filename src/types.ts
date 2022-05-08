import { ParamItems } from './core/Params';

export enum IndentStyle {
  standard = 'standard',
  tabularLeft = 'tabularLeft',
  tabularRight = 'tabularRight',
}

export enum KeywordCase {
  preserve = 'preserve',
  upper = 'upper',
  lower = 'lower',
}

export enum NewlineMode {
  always = 'always',
  never = 'never',
  lineWidth = 'lineWidth',
}

export enum AliasMode {
  preserve = 'preserve',
  always = 'always',
  never = 'never',
  select = 'select',
}

export enum CommaPosition {
  before = 'before',
  after = 'after',
  tabular = 'tabular',
}

export enum LogicalOperatorNewline {
  before = 'before',
  after = 'after',
}

// The `keyof typeof Enum` expansions are used to allow this API
// to be called in two ways:
//
//   keywordCase: "upper"
//   keywordCase: KeywordCase.upper
//
export interface FormatOptions {
  indent: string;
  keywordCase: KeywordCase | keyof typeof KeywordCase;
  indentStyle: IndentStyle | keyof typeof IndentStyle;
  newline: NewlineMode | keyof typeof NewlineMode | number;
  logicalOperatorNewline: LogicalOperatorNewline | keyof typeof LogicalOperatorNewline;
  aliasAs: AliasMode | keyof typeof AliasMode;
  tabulateAlias: boolean;
  commaPosition: CommaPosition | keyof typeof CommaPosition;
  newlineBeforeOpenParen: boolean;
  newlineBeforeCloseParen: boolean;
  lineWidth: number;
  linesBetweenQueries: number;
  denseOperators: boolean;
  newlineBeforeSemicolon: boolean;
  params?: ParamItems | string[];
}
