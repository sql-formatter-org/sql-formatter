import dedent from 'dedent-js';
import { FormatFn } from '../../src/sqlFormatter.js';

export default function supportsIsDistinctFrom(format: FormatFn) {
  // Regression test for #564
  it('formats IS [NOT] DISTINCT FROM operator', () => {
    expect(format('SELECT x IS DISTINCT FROM y, x IS NOT DISTINCT FROM y')).toBe(dedent`
      SELECT
        x IS DISTINCT FROM y,
        x IS NOT DISTINCT FROM y
    `);
  });
}
