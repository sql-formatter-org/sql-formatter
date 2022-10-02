import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter.js';

export default function supportsArrayLiterals(format: FormatFn) {
  it('supports array literals', () => {
    const result = format(`SELECT [1, 2, 3] FROM ['John', 'Doe'];`);
    expect(result).toBe(dedent`
      SELECT
        [1, 2, 3]
      FROM
        ['John', 'Doe'];
    `);
  });
}
