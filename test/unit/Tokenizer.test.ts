import Tokenizer from '../../src/lexer/Tokenizer.js';
import { TokenType } from '../../src/lexer/token.js';

describe('Tokenizer', () => {
  const tokenize = (sql: string) =>
    new Tokenizer(
      {
        reservedClauses: ['FROM', 'WHERE', 'LIMIT', 'CREATE TABLE'],
        reservedSelect: ['SELECT'],
        reservedSetOperations: ['UNION', 'UNION ALL'],
        reservedJoins: ['JOIN'],
        reservedFunctionNames: ['SQRT', 'CURRENT_TIME'],
        reservedKeywords: ['BETWEEN', 'LIKE', 'ON', 'USING'],
        reservedDataTypes: [],
        stringTypes: ["''-qq"],
        identTypes: ['""-qq'],
      },
      'sql'
    ).tokenize(sql, {});

  it('tokenizes whitespace to empty array', () => {
    expect(tokenize(' \t\n \n\r ')).toEqual([]);
  });

  it('treats zero-width space as whitespace', () => {
    expect(tokenize('\u200B \u200B')).toEqual([]);
  });

  it('tokenizes typographic single-quoted strings', () => {
    const tokens = tokenize('SELECT \u2018foo\u2019');
    expect(tokens.map(t => ({ type: t.type, text: t.text }))).toEqual([
      { type: TokenType.RESERVED_SELECT, text: 'SELECT' },
      { type: TokenType.STRING, text: '\u2018foo\u2019' },
    ]);
  });

  it('tokenizes single line SQL tokens', () => {
    expect(tokenize('SELECT * FROM foo;')).toMatchSnapshot();
  });

  it('tokenizes multiline SQL tokens', () => {
    expect(tokenize('SELECT "foo\n bar" /* \n\n\n */;')).toMatchSnapshot();
  });
});
