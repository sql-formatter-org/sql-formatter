import dedent from 'dedent-js';

import { FormatFn } from '../../src/sqlFormatter.js';

export default function supportsCommaNewline(format: FormatFn) {
  it('by default adds newline after comma', () => {
    const result = format(`SELECT id, first_name, last_name, email FROM users;`);
    expect(result).toBe(
      dedent`
      SELECT
        id,
        first_name,
        last_name,
        email
      FROM
        users;
    `
    );
  });

  it('supports newline before comma', () => {
    const result = format(`SELECT id, first_name, last_name, email FROM users;`, {
      commaNewline: 'before',
    });
    expect(result).toBe(
      dedent`
      SELECT
        id
        , first_name
        , last_name
        , email
      FROM
        users;
    `
    );
  });
}
