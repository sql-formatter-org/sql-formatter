import { Lexer, parser } from 'src/parser/grammar';

describe('Jison Parser', () => {
  const parse = (sql: string) => {
    const lexer = {
      yytext: '',
      index: 0,
      tokens: [] as string[],
      setInput(text: string) {
        this.tokens = text.split(/\s+/);
      },
      lex() {
        if (this.index >= this.tokens.length) {
          return 'EOF';
        }
        this.yytext = this.tokens[this.index];
        this.index++;
        if (['SELECT', 'FROM', 'CREATE', 'TABLE'].includes(this.yytext)) {
          return this.yytext;
        }
        if (/^[0-9]+$/.test(this.yytext)) {
          return 'NUMBER';
        }
        if (/^\w+$/.test(this.yytext)) {
          return 'IDENTIFIER';
        }
        if (['*', ';', '(', ')'].includes(this.yytext)) {
          return this.yytext;
        }
        return 'INVALID';
      },
    };
    parser.lexer = lexer as Lexer;
    return parser.parse(sql);
  };

  it('parses statements', () => {
    expect(parse('SELECT ( * ) FROM my_table ; CREATE TABLE foo')).toEqual([
      {
        type: 'statement',
        children: [
          { type: 'keyword', value: 'SELECT' },
          { type: 'parenthesis', children: [{ type: 'star' }] },
          { type: 'keyword', value: 'FROM' },
          { type: 'identifier', value: 'my_table' },
        ],
      },
      {
        type: 'statement',
        children: [
          { type: 'keyword', value: 'CREATE' },
          { type: 'keyword', value: 'TABLE' },
          { type: 'identifier', value: 'foo' },
        ],
      },
    ]);
  });
});
