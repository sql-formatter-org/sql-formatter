import { parser } from 'src/parser/grammar';

describe('Jison Parser', () => {
  const parse = (sql: string) => parser.parse(sql);

  it('parses something', () => {
    expect(parse('SELECT * FROM my_table')).toEqual({
      type: 'select',
      cols: { type: 'star' },
      from: { type: 'identifier', value: 'my_table' },
    });
  });
});
