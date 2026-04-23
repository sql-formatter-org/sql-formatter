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
}
