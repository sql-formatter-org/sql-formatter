import { SqlLanguage, FormatFn } from '../../src/sqlFormatter';

export default function supportsBetween(language: SqlLanguage, format: FormatFn) {
  it('formats BETWEEN _ AND _ on single line', () => {
    expect(format('foo BETWEEN bar AND baz')).toBe('foo BETWEEN bar AND baz');
  });
}
