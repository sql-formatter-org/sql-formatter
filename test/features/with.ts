import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter.js';

export default function supportsWith(format: FormatFn) {
  it('formats WITH clause with multiple Common Table Expressions (CTE)', () => {
    const result = format(`
      WITH
      cte_1 AS (
        SELECT a FROM b WHERE c = 1
      ),
      cte_2 AS (
        SELECT c FROM d WHERE e = 2
      ),
      final AS (
        SELECT * FROM cte_1 LEFT JOIN cte_2 ON b = d
      )
      SELECT * FROM final;
    `);
    expect(result).toBe(dedent`
      WITH
        cte_1 AS (
          SELECT
            a
          FROM
            b
          WHERE
            c = 1
        ),
        cte_2 AS (
          SELECT
            c
          FROM
            d
          WHERE
            e = 2
        ),
        final AS (
          SELECT
            *
          FROM
            cte_1
            LEFT JOIN cte_2 ON b = d
        )
      SELECT
        *
      FROM
        final;
    `);
  });

  it('formats WITH clause with parameterized CTE', () => {
    const result = format(`
      WITH cte_1(id, parent_id) AS (
        SELECT id, parent_id
        FROM tab1
        WHERE parent_id IS NULL
      )
      SELECT id, parent_id FROM cte_1;
    `);
    expect(result).toBe(dedent`
      WITH
        cte_1 (id, parent_id) AS (
          SELECT
            id,
            parent_id
          FROM
            tab1
          WHERE
            parent_id IS NULL
        )
      SELECT
        id,
        parent_id
      FROM
        cte_1;
    `);
  });
}
