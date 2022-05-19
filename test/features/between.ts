import { FormatFn } from '../../src/sqlFormatter';

export default function supportsBetween(format: FormatFn) {
  it('formats BETWEEN _ AND _ on single line', () => {
    expect(format('foo BETWEEN bar AND baz')).toBe('foo BETWEEN bar AND baz');
  });
}
