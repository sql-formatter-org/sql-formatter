import dedent from 'dedent-js';

import { FormatFn } from '../../src/sqlFormatter.js';

export default function supportsNumbers(
  format: FormatFn,
  { underscore }: { underscore?: boolean } = {}
) {
  it('supports decimal numbers', () => {
    const result = format('SELECT 42, -35.04, 105., 2.53E+3, 1.085E-5;');
    expect(result).toBe(dedent`
      SELECT
        42,
        -35.04,
        105.,
        2.53E+3,
        1.085E-5;
    `);
  });

  it('supports hex and binary numbers', () => {
    const result = format('SELECT 0xAE, 0x10F, 0b1010001;');
    expect(result).toBe(dedent`
      SELECT
        0xAE,
        0x10F,
        0b1010001;
    `);
  });

  it('correctly handles floats as single tokens', () => {
    const result = format('SELECT 1e-9 AS a, 1.5e+10 AS b, 3.5E12 AS c, 3.5e12 AS d;');
    expect(result).toBe(dedent`
      SELECT
        1e-9 AS a,
        1.5e+10 AS b,
        3.5E12 AS c,
        3.5e12 AS d;
    `);
  });

  it('correctly handles floats with trailing point', () => {
    let result = format('SELECT 1000. AS a;');
    expect(result).toBe(dedent`
      SELECT
        1000. AS a;
    `);

    result = format('SELECT a, b / 1000. AS a_s, 100. * b / SUM(a_s);');
    expect(result).toBe(dedent`
      SELECT
        a,
        b / 1000. AS a_s,
        100. * b / SUM(a_s);
    `);
  });

  it('supports decimal values without leading digits', () => {
    const result = format(`SELECT .456 AS foo;`);
    expect(result).toBe(dedent`
      SELECT
        .456 AS foo;
    `);
  });

  if (underscore) {
    it('supports underscore separators in numeric literals', () => {
      expect(format('SELECT 1_000_000, 3.14_159, 0x1A_2B_3C, 0b1010_0001, 1.5e+1_0;')).toBe(dedent`
        SELECT
          1_000_000,
          3.14_159,
          0x1A_2B_3C,
          0b1010_0001,
          1.5e+1_0;
      `);
    });
  }
}
