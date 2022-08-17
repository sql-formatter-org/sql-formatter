import Tokenizer from 'src/lexer/Tokenizer';
import { Parser, Grammar } from 'nearley';

import grammar from 'src/grammar/grammar';
import LexerAdapter from 'src/grammar/LexerAdapter';

describe('Nearley integration', () => {
  const parse = (sql: string) => {
    const tokenizer = new Tokenizer({
      reservedCommands: ['FROM', 'WHERE', 'LIMIT', 'CREATE TABLE'],
      reservedSelect: ['SELECT'],
      reservedDependentClauses: ['WHEN', 'ELSE'],
      reservedSetOperations: ['UNION', 'UNION ALL'],
      reservedJoins: ['JOIN'],
      reservedFunctionNames: ['SQRT'],
      reservedKeywords: ['BETWEEN', 'LIKE', 'ON', 'USING'],
      openParens: ['(', '['],
      closeParens: [')', ']'],
      stringTypes: ["''"],
      identTypes: ['""'],
    });

    const lexer = new LexerAdapter(chunk => tokenizer.tokenize(chunk, {}));
    const parser = new Parser(Grammar.fromCompiled(grammar), { lexer });
    const { results } = parser.feed(sql);

    if (results.length === 1) {
      return results[0];
    } else {
      throw new Error('Ambiguous grammar');
    }
  };

  it('parses empty list of tokens', () => {
    expect(parse('')).toEqual([]);
  });

  it('parses list of statements', () => {
    expect(parse('foo; bar')).toMatchSnapshot();
  });

  it('parses array subscript', () => {
    expect(parse('SELECT my_array[5]')).toMatchSnapshot();
  });

  it('parses parenthesized expressions', () => {
    expect(parse('SELECT (birth_year - (CURRENT_DATE + 1))')).toMatchSnapshot();
  });

  it('parses function call', () => {
    expect(parse('SELECT sqrt(2)')).toMatchSnapshot();
  });

  it('parses LIMIT clause with count', () => {
    expect(parse('LIMIT 15;')).toMatchSnapshot();
  });

  it('parses LIMIT clause with offset and count', () => {
    expect(parse('LIMIT 100, 15;')).toMatchSnapshot();
  });

  it('parses LIMIT clause with longer expressions', () => {
    expect(parse('LIMIT 50 + 50, 3 * 2;')).toMatchSnapshot();
  });

  it('parses BETWEEN expression', () => {
    expect(parse('WHERE age BETWEEN 18 AND 63')).toMatchSnapshot();
  });

  it('parses set operations', () => {
    expect(parse('SELECT foo FROM bar UNION ALL SELECT foo FROM baz')).toMatchSnapshot();
  });
});
