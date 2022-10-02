import dedent from 'dedent-js';

import { FormatFn } from '../../src/sqlFormatter.js';

export default function supportsTabWidth(format: FormatFn) {
  it('indents with 2 spaces by default', () => {
    const result = format('SELECT count(*),Column1 FROM Table1;');

    expect(result).toBe(dedent`
      SELECT
        count(*),
        Column1
      FROM
        Table1;
    `);
  });

  it('supports indenting with 4 spaces', () => {
    const result = format('SELECT count(*),Column1 FROM Table1;', {
      tabWidth: 4,
    });

    expect(result).toBe(dedent`
      SELECT
          count(*),
          Column1
      FROM
          Table1;
    `);
  });
}
