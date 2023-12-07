import dedent from 'dedent-js';

import { FormatFn } from '../../src/sqlFormatter.js';

export default function supportsDataTypeCase(format: FormatFn) {
  it('preserves data type keyword case by default', () => {
    const result = format(
      'CREATE TABLE users ( user_id iNt PRIMARY KEY, total_earnings Decimal(5, 2) NOT NULL )'
    );
    expect(result).toBe(dedent`
      CREATE TABLE users (
        user_id iNt PRIMARY KEY,
        total_earnings Decimal(5, 2) NOT NULL
      )
    `);
  });

  it('converts data type keyword case to uppercase', () => {
    const result = format(
      'CREATE TABLE users ( user_id iNt PRIMARY KEY, total_earnings Decimal(5, 2) NOT NULL )',
      {
        dataTypeCase: 'upper',
      }
    );
    expect(result).toBe(dedent`
      CREATE TABLE users (
        user_id INT PRIMARY KEY,
        total_earnings DECIMAL(5, 2) NOT NULL
      )
    `);
  });

  it('converts data type keyword case to lowercase', () => {
    const result = format(
      'CREATE TABLE users ( user_id iNt PRIMARY KEY, total_earnings Decimal(5, 2) NOT NULL )',
      {
        dataTypeCase: 'lower',
      }
    );
    expect(result).toBe(dedent`
      CREATE TABLE users (
        user_id int PRIMARY KEY,
        total_earnings decimal(5, 2) NOT NULL
      )
    `);
  });
}
