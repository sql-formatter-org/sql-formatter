import dedent from 'dedent-js';
import { FormatFn } from '../../src/sqlFormatter';

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
    const result = format('select distinct * frOM foo left JOIN bar WHERe cola > 1 and colb = 3', {
      keywordCase: 'upper',
    });
    expect(result).toBe(dedent`
      SELECT
        DISTINCT *
      FROM
        foo
        LEFT JOIN bar
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
    const result = format('select "distinct" as foo', {
      keywordCase: 'upper',
    });
    expect(result).toBe(dedent`
      SELECT
        "distinct" AS foo
    `);
  });
}
