import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter.js';

export default function supportsLinesBetweenQueries(format: FormatFn) {
  it('defaults to single empty line between queries', () => {
    const result = format('SELECT * FROM foo; SELECT * FROM bar;');
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        foo;

      SELECT
        *
      FROM
        bar;
    `);
  });

  it('supports more empty lines between queries', () => {
    const result = format('SELECT * FROM foo; SELECT * FROM bar;', { linesBetweenQueries: 2 });
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        foo;


      SELECT
        *
      FROM
        bar;
    `);
  });

  it('supports no empty lines between queries', () => {
    const result = format('SELECT * FROM foo; SELECT * FROM bar;', { linesBetweenQueries: 0 });
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        foo;
      SELECT
        *
      FROM
        bar;
    `);
  });
}
