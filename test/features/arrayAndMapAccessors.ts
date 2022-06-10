import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter';

export default function supportsArrayAndMapAccessors(format: FormatFn) {
  it('supports square brackets for array indexing', () => {
    const result = format(`SELECT arr[1], order_lines[5].productId;`);
    expect(result).toBe(dedent`
      SELECT
        arr[1],
        order_lines[5].productId;
    `);
  });

  // The check for yota['foo.bar-baz'] is for Issue #230
  it('supports square brackets for map lookup', () => {
    const result = format(`SELECT alpha['a'], beta['gamma'].zeta, yota['foo.bar-baz'];`);
    expect(result).toBe(dedent`
      SELECT
        alpha['a'],
        beta['gamma'].zeta,
        yota['foo.bar-baz'];
    `);
  });
}
