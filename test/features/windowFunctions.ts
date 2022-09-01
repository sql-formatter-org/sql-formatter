import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter';

export default function supportsWindowFunctions(format: FormatFn) {
  it('supports ROWS BETWEEN in window functions', () => {
    expect(
      format(`
        SELECT
          RANK() OVER (
            PARTITION BY explosion
            ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
          ) AS amount
        FROM
          tbl
      `)
    ).toBe(dedent`
      SELECT
        RANK() OVER (
          PARTITION BY
            explosion
          ORDER BY
            day ROWS BETWEEN 6 PRECEDING
            AND CURRENT ROW
        ) AS amount
      FROM
        tbl
    `);
  });
}
