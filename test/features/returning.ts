import dedent from 'dedent-js';

import { FormatFn } from '../../src/sqlFormatter.js';

export default function supportsReturning(format: FormatFn) {
  it('places RETURNING to new line', () => {
    const result = format(
      "INSERT INTO users (firstname, lastname) VALUES ('Joe', 'Cool') RETURNING id, firstname;"
    );
    expect(result).toBe(dedent`
      INSERT INTO
        users (firstname, lastname)
      VALUES
        ('Joe', 'Cool')
      RETURNING
        id,
        firstname;
    `);
  });
}
