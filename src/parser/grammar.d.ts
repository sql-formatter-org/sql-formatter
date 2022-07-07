// eslint-disable-next-line import/prefer-default-export
export declare const parser: {
  parse(text: string): any;
  lexer: Lexer;
};

export type Lexer = {
  yytext?: string;
  yyloc?: LexerLocation;
  yylloc?: LexerLocation;
  lex(): string;
  setInput(text: string): void;
};

export type LexerLocation = {
  first_column: number;
  first_line: number;
  last_line: number;
  last_column: number;
};
