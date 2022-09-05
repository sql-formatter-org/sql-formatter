import Tokenizer from 'src/lexer/Tokenizer';
import { createParser } from 'src/parser/createParser';

describe('Parser', () => {
  const parse = (sql: string) => {
    const tokenizer = new Tokenizer({
      reservedCommands: ['FROM', 'WHERE', 'LIMIT', 'CREATE TABLE'],
      reservedSelect: ['SELECT'],
      reservedDependentClauses: ['WHEN', 'ELSE'],
      reservedSetOperations: ['UNION', 'UNION ALL'],
      reservedJoins: ['JOIN'],
      reservedFunctionNames: ['SQRT', 'CURRENT_TIME'],
      reservedKeywords: ['BETWEEN', 'LIKE', 'ON', 'USING'],
      operators: [':'],
      extraParens: ['[]', '{}'],
      stringTypes: ["''-qq"],
      identTypes: ['""-qq'],
    });

    return createParser(tokenizer).parse(sql, {});
  };

  it('parses empty list of tokens', () => {
    expect(parse('')).toEqual([]);
  });

  it('throws error when parsing invalid SQL expression', () => {
    expect(() => parse('SELECT (')).toThrow('Parse error at token: «EOF»');
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

  it('parses SELECT ident.*', () => {
    expect(parse('SELECT ident.*')).toMatchSnapshot();
  });

  it('parses function name with and without parameters', () => {
    expect(parse('SELECT CURRENT_TIME a, CURRENT_TIME() b;')).toMatchSnapshot();
  });

  it('parses curly braces', () => {
    expect(parse('SELECT {foo: bar};')).toMatchSnapshot();
  });

  it('parses square brackets', () => {
    expect(parse('SELECT [1, 2, 3];')).toMatchSnapshot();
  });

  it('parses qualified.identifier.sequence', () => {
    expect(parse('SELECT foo.bar.baz;')).toMatchSnapshot();
  });
});
