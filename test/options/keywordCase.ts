import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter';

export default function supportsKeywordCase(format: FormatFn) {
  it('preserves keyword case by default', () => {
    const result = format('select distinct * frOM foo left JOIN bar WHERe cola > 1 and colb = 3');
    expect(result).toBe(dedent`
      select
        distinct *
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
      SELECT
        DISTINCT *
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
      select
        distinct *
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

  // regression test for #356
  it('formats multi-word commands into single line', () => {
    const input = `
      INSERT
      INTO
      Customers (ID, MoneyBalance, Address, City) VALUES (12,-123.4, 'Skagen 2111','Stv');`;
    const expected = dedent`
      INSERT INTO
        Customers (ID, MoneyBalance, Address, City)
      VALUES
        (12, -123.4, 'Skagen 2111', 'Stv');
    `;

    expect(format(input, { keywordCase: 'upper' })).toBe(expected);
  });

  // regression test for #356
  it('formats multi-word joins into single line', () => {
    const input = `
      SELECT * FROM mytable
      INNER
      JOIN
      mytable2 ON mytable1.col1 = mytable2.col1 WHERE mytable2.col1 = 5;`;
    const expected = dedent`
      SELECT
        *
      FROM
        mytable
        INNER JOIN mytable2 ON mytable1.col1 = mytable2.col1
      WHERE
        mytable2.col1 = 5;
    `;

    expect(format(input, { keywordCase: 'upper' })).toBe(expected);
  });
}
