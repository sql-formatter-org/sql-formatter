import dedent from 'dedent-js';

import { FormatFn } from '../../src/sqlFormatter.js';

export default function supportsWindow(format: FormatFn) {
  it('formats WINDOW clause at top level', () => {
    const result = format(
      'SELECT *, ROW_NUMBER() OVER wnd AS next_value FROM tbl WINDOW wnd AS (PARTITION BY id ORDER BY time);'
    );
    expect(result).toBe(dedent`
      SELECT
        *,
        ROW_NUMBER() OVER wnd AS next_value
      FROM
        tbl
      WINDOW
        wnd AS (
          PARTITION BY
            id
          ORDER BY
            time
        );
    `);
  });

  it('formats multiple WINDOW specifications', () => {
    const result = format(
      'SELECT * FROM table1 WINDOW w1 AS (PARTITION BY col1), w2 AS (PARTITION BY col1, col2);'
    );
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        table1
      WINDOW
        w1 AS (
          PARTITION BY
            col1
        ),
        w2 AS (
          PARTITION BY
            col1,
            col2
        );
    `);
  });
}
