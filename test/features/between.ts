import { FormatFn } from 'src/sqlFormatter';

export default function supportsBetween(format: FormatFn) {
  it('formats BETWEEN _ AND _ on single line', () => {
    expect(format('foo BETWEEN bar AND baz')).toBe('foo BETWEEN bar AND baz');
  });

  it('supports qualified.names as BETWEEN expression values', () => {
    expect(format('foo BETWEEN t.bar AND t.baz')).toBe('foo BETWEEN t.bar AND t.baz');
  });
}
