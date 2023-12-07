import Tokenizer from '../../src/lexer/Tokenizer.js';

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

  it('tokenizes single line SQL tokens', () => {
    expect(tokenize('SELECT * FROM foo;')).toMatchSnapshot();
  });

  it('tokenizes multiline SQL tokens', () => {
    expect(tokenize('SELECT "foo\n bar" /* \n\n\n */;')).toMatchSnapshot();
  });
});
