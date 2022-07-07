import { parser } from 'src/parser/grammar';

describe('Jison Parser', () => {
  const parse = (sql: string) => parser.parse(sql);

  it('parses something', () => {
    expect(parse('(1 + 2) * 3')).toEqual(9);
  });
});
