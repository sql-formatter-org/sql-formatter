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
}
