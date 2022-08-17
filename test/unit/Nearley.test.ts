import Tokenizer from 'src/lexer/Tokenizer';
import { correctFunctionNameTokens } from 'src/lexer/correctFunctionNameTokens';
import { Parser, Grammar } from 'nearley';

import grammar from 'src/parser/grammar';
import LexerAdapter from 'src/parser/LexerAdapter';

describe('Nearley integration', () => {
  const parse = (sql: string) => {
    const tokenizer = new Tokenizer({
      reservedCommands: ['FROM', 'WHERE', 'LIMIT', 'CREATE TABLE'],
      reservedSelect: ['SELECT'],
      reservedDependentClauses: ['WHEN', 'ELSE'],
      reservedSetOperations: ['UNION', 'UNION ALL'],
      reservedJoins: ['JOIN'],
      reservedFunctionNames: ['SQRT', 'CURRENT_TIME'],
      reservedKeywords: ['BETWEEN', 'LIKE', 'ON', 'USING'],
      openParens: ['(', '['],
      closeParens: [')', ']'],
      stringTypes: ["''"],
      identTypes: ['""'],
    });

    const lexer = new LexerAdapter(chunk =>
      correctFunctionNameTokens(tokenizer.tokenize(chunk, {}))
    );
    const parser = new Parser(Grammar.fromCompiled(grammar), { lexer });
    const { results } = parser.feed(sql);

    if (results.length === 1) {
      return results[0];
    } else if (results.length === 0) {
      throw new Error('Parse error: Invalid SQL');
    } else {
      throw new Error('Ambiguous grammar');
    }
  };

  it('parses empty list of tokens', () => {
    expect(parse('')).toEqual([]);
  });

  // Ideally we would report a line number where the parser failed,
  // but I haven't found a way to get this info from Nearley :(
  it('throws error when parsing invalid SQL expression', () => {
    expect(() => parse('SELECT (')).toThrow('Parse error: Invalid SQL');
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

  it('parses SELECT *', () => {
    expect(parse('SELECT *')).toMatchSnapshot();
  });

  it('parses function name with and without parameters', () => {
    expect(parse('SELECT CURRENT_TIME a, CURRENT_TIME() b;')).toMatchSnapshot();
  });
});
