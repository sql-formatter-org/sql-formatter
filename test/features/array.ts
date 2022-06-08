import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter';

export default function supportsArray(format: FormatFn) {
  // TODO: These accessors were implemented as part of identifiers,
  // resulting in "alpha[1]" being tokenized to single identifier token.
  // That's semantically not correct and quite a surprising behavior.

  it.skip('handles array and map accessors', () => {
    const result = format(`SELECT alpha[1], beta['gamma'], epsilon["zeta"] FROM eta;`);
    expect(result).toBe(dedent`
      SELECT
        alpha[1],
        beta['gamma'],
        epsilon["zeta"]
      FROM
        eta;
    `);
  });

  it.skip('supports square brackets for array indexing', () => {
    const result = format(`SELECT order_lines[5].productId;`);
    expect(result).toBe(dedent`
      SELECT
        order_lines[5].productId;
    `);
  });
}
