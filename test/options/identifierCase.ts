import dedent from 'dedent-js';

import { FormatFn } from '../../src/sqlFormatter.js';

export default function supportsIdentifierCase(format: FormatFn) {
  it('preserves identifier case by default', () => {
    const result = format('select Abc from tBl1 left join Tbl2 where colA > 1 and colB = 3');
    expect(result).toBe(dedent`
      select
        Abc
      from
        tBl1
        left join Tbl2
      where
        colA > 1
        and colB = 3
    `);
  });

  it('converts identifiers to uppercase', () => {
    const result = format('select Abc from tBl1 left join Tbl2 where colA > 1 and colB = 3', {
      identifierCase: 'upper',
    });
    expect(result).toBe(dedent`
      select
        ABC
      from
        TBL1
        left join TBL2
      where
        COLA > 1
        and COLB = 3
    `);
  });

  it('converts identifiers to lowercase', () => {
    const result = format('select Abc from tBl1 left join Tbl2 where colA > 1 and colB = 3', {
      identifierCase: 'lower',
    });
    expect(result).toBe(dedent`
      select
        abc
      from
        tbl1
        left join tbl2
      where
        cola > 1
        and colb = 3
    `);
  });

  it('does not uppercase identifiers inside strings', () => {
    const result = format(`select 'abc' as foo`, {
      identifierCase: 'upper',
    });
    expect(result).toBe(dedent`
      select
        'abc' as FOO
    `);
  });

  it('does not uppercase identifiers inside quotes', () => {
    const result = format(`select "abc" as foo`, {
      identifierCase: 'upper',
    });
    expect(result).toBe(dedent`
      select
        "abc" as FOO
    `);
  });
}
