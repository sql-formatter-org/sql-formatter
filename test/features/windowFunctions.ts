import dedent from 'dedent-js';

import { FormatFn } from '../../src/sqlFormatter.js';

export default function supportsWindowFunctions(format: FormatFn, frameOnSeparateLine = false) {
  it('supports ROWS BETWEEN in window functions', () => {
    const result = format(`
      SELECT
        RANK() OVER (
          PARTITION BY explosion
          ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ) AS amount
      FROM
        tbl
    `);
    expect(result).toBe(
      frameOnSeparateLine
        ? dedent`
      SELECT
        RANK() OVER (
          PARTITION BY
            explosion
          ORDER BY
            day
          ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ) AS amount
      FROM
        tbl
    `
        : dedent`
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
    `
    );
  });
}
