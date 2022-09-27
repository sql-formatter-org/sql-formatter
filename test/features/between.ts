import dedent from 'dedent-js';
import { FormatFn } from 'src/sqlFormatter';

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
}
