import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter';

export default function supportsLogicalOperatorNewline(format: FormatFn) {
  it('by default adds newline before logical operator', () => {
    const result = format('SELECT a WHERE true AND false;');
    expect(result).toBe(dedent`
      SELECT
        a
      WHERE
        true
        AND false;
    `);
  });

  it('supports newline after logical operator', () => {
    const result = format('SELECT a WHERE true AND false;', {
      logicalOperatorNewline: 'after',
    });
    expect(result).toBe(dedent`
      SELECT
        a
      WHERE
        true AND
        false;
    `);
  });
}
