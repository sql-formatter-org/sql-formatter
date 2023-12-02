import dedent from 'dedent-js';

import { FormatFn } from '../../src/sqlFormatter.js';

export default function supportsFunctionCase(format: FormatFn) {
  it('preserves function name case by default', () => {
    const result = format('SELECT MiN(price) AS min_price FROM products');
    expect(result).toBe(dedent`
      SELECT
        MiN(price) AS min_price
      FROM
        products
    `);
  });

  it('converts function names to uppercase', () => {
    const result = format('SELECT MiN(price) AS min_price FROM products', {
      functionCase: 'upper',
    });
    expect(result).toBe(dedent`
      SELECT
        MIN(price) AS min_price
      FROM
        products
    `);
  });

  it('converts function names to lowercase', () => {
    const result = format('SELECT MiN(price) AS min_price FROM products', {
      functionCase: 'lower',
    });
    expect(result).toBe(dedent`
      SELECT
        min(price) AS min_price
      FROM
        products
    `);
  });
}
