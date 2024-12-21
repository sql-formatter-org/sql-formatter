import dedent from 'dedent-js';

import { FormatFn } from '../../src/sqlFormatter.js';

export default function supportsKeywordCase(format: FormatFn) {
  it('preserves keyword case by default', () => {
    const result = format('select distinct * frOM foo left JOIN bar WHERe cola > 1 and colb = 3');
    expect(result).toBe(dedent`
      select distinct
        *
      frOM
        foo
        left JOIN bar
      WHERe
        cola > 1
        and colb = 3
    `);
  });

  it('converts keywords to uppercase', () => {
    const result = format(
      'select distinct * frOM foo left JOIN mycol WHERe cola > 1 and colb = 3',
      {
        keywordCase: 'upper',
      }
    );
    expect(result).toBe(dedent`
      SELECT DISTINCT
        *
      FROM
        foo
        LEFT JOIN mycol
      WHERE
        cola > 1
        AND colb = 3
    `);
  });

  it('converts keywords to lowercase', () => {
    const result = format('select distinct * frOM foo left JOIN bar WHERe cola > 1 and colb = 3', {
      keywordCase: 'lower',
    });
    expect(result).toBe(dedent`
      select distinct
        *
      from
        foo
        left join bar
      where
        cola > 1
        and colb = 3
    `);
  });

  it('does not uppercase keywords inside strings', () => {
    const result = format(`select 'distinct' as foo`, {
      keywordCase: 'upper',
    });
    expect(result).toBe(dedent`
      SELECT
        'distinct' AS foo
    `);
  });

  it('treats dot-seperated keywords as plain identifiers', () => {
    const result = format('select table.and from set.select', {
      keywordCase: 'upper',
    });
    expect(result).toBe(dedent`
      SELECT
        table.and
      FROM
        set.select
    `);
  });

  // regression test for #356
  it('formats multi-word reserved clauses into single line', () => {
    const result = format(
      `select * from mytable
      inner
      join
      mytable2 on mytable1.col1 = mytable2.col1
      where mytable2.col1 = 5
      group
      bY mytable1.col2
      order
      by
      mytable2.col3;`,
      { keywordCase: 'upper' }
    );
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        mytable
        INNER JOIN mytable2 ON mytable1.col1 = mytable2.col1
      WHERE
        mytable2.col1 = 5
      GROUP BY
        mytable1.col2
      ORDER BY
        mytable2.col3;
    `);
  });
}
