import dedent from 'dedent-js';
import { FormatFn } from '../../src/sqlFormatter.js';

export default function supportsBetween(format: FormatFn) {
  it('formats BETWEEN _ AND _ on single line', () => {
    expect(format('foo BETWEEN bar AND baz')).toBe('foo BETWEEN bar AND baz');
  });

  it('supports qualified.names as BETWEEN expression values', () => {
    expect(format('foo BETWEEN t.bar AND t.baz')).toBe('foo BETWEEN t.bar AND t.baz');
  });

  it('formats BETWEEN with comments inside', () => {
    expect(format('WHERE foo BETWEEN /*C1*/ t.bar /*C2*/ AND /*C3*/ t.baz')).toBe(dedent`
      WHERE
        foo BETWEEN /*C1*/ t.bar /*C2*/ AND /*C3*/ t.baz
    `);
  });

  it('supports complex expressions inside BETWEEN', () => {
    // Not ideal, but better than crashing
    expect(format('foo BETWEEN 1+2 AND 3+4')).toBe('foo BETWEEN 1 + 2 AND 3  + 4');
  });

  it('supports CASE inside BETWEEN', () => {
    expect(format('foo BETWEEN CASE x WHEN 1 THEN 2 END AND 3')).toBe(dedent`
      foo BETWEEN CASE x
        WHEN 1 THEN 2
      END AND 3
    `);
  });

  // Regression test for #534
  it('supports AND after BETWEEN', () => {
    expect(format('SELECT foo BETWEEN 1 AND 2 AND x > 10')).toBe(dedent`
      SELECT
        foo BETWEEN 1 AND 2
        AND x > 10
    `);
  });
}
