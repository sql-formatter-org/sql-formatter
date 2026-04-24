import dedent from 'dedent-js';

import { FormatFn } from '../../src/sqlFormatter.js';

export default function supportsMaxOperatorArgsLength(format: FormatFn) {
  it('set max operator args limit to 30', () => {
    const result = format(`INSERT INTO user VALUES (${'?'.repeat(100).split('').join(',')})`, {
      maxLengthInParenthesis: 30,
    });
    expect(result).toBe(dedent`
      INSERT INTO
        user
      VALUES
        (
          ${'?'.repeat(30).split('').join(',\n    ')} /* ... 70 more items */
        )
    `);
  });

  it('max operator args limit and compactParenthesis', () => {
    const result = format(`INSERT INTO user VALUES (${'?'.repeat(100).split('').join(',')})`, {
      compactParenthesis: true,
      maxLengthInParenthesis: 30,
    });
    expect(result).toBe(dedent`
      INSERT INTO
        user
      VALUES
        ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
          /* ... 70 more items */
        )
    `);
  });

  it('check correctness with params and limit', () => {
    const result = format(
      dedent`
        INSERT INTO user VALUES
        (${'?'.repeat(10).split('').join(',')}),
        (${'?'.repeat(10).split('').join(',')})
      `,
      {
        compactParenthesis: true,
        maxLengthInParenthesis: 5,
        params: Array.from({ length: 20 }, (_, i) => i.toString()),
      }
    );
    expect(result).toBe(dedent`
      INSERT INTO
        user
      VALUES
        ( 0, 1, 2, 3, 4 /* ... 5 more items */),
        ( 10, 11, 12, 13, 14 /* ... 5 more items */)
    `);
  });
}
