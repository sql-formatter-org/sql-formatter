import dedent from 'dedent-js';

import { FormatFn } from '../../src/sqlFormatter.js';

export default function supportsDataTypeCase(format: FormatFn) {
  it('preserves data type keyword case by default', () => {
    const result = format('CREATE TABLE users ( id iNt PRIMARY KEY )');
    expect(result).toBe(dedent`
      CREATE TABLE users (id iNt PRIMARY KEY)
    `);
  });

  it('converts data type keyword case to uppercase', () => {
    const result = format('CREATE TABLE users ( id iNt PRIMARY KEY )', {
      dataTypeCase: 'upper',
    });
    expect(result).toBe(dedent`
      CREATE TABLE users (id INT PRIMARY KEY)
    `);
  });

  it('converts data type keyword case to lowercase', () => {
    const result = format('CREATE TABLE users ( id iNt PRIMARY KEY )', {
      dataTypeCase: 'lower',
    });
    expect(result).toBe(dedent`
      CREATE TABLE users (id int PRIMARY KEY)
    `);
  });

  it('preserves data type keyword case in cast by default', () => {
    const result = format('SELECT CAST(quantity AS InT) FROM orders');
    expect(result).toBe(dedent`
      SELECT
        CAST(quantity AS InT)
      FROM
        orders
    `);
  });

  it('converts data type keyword case in cast to uppercase', () => {
    const result = format('SELECT CAST(quantity AS InT) FROM orders', {
      dataTypeCase: 'upper',
    });
    expect(result).toBe(dedent`
      SELECT
        CAST(quantity AS INT)
      FROM
        orders
    `);
  });

  it('converts data type keyword case in cast to lowercase', () => {
    const result = format('SELECT CAST(quantity AS InT) FROM orders', {
      dataTypeCase: 'lower',
    });
    expect(result).toBe(dedent`
      SELECT
        CAST(quantity AS int)
      FROM
        orders
    `);
  });
}
