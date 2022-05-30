import { format, SqlLanguage } from '../src/sqlFormatter';

describe('sqlFormatter', () => {
  it('throws error when unsupported language parameter specified', () => {
    expect(() => {
      format('SELECT *', { language: 'blah' as SqlLanguage });
    }).toThrow('Unsupported SQL dialect: blah');
  });

  it('throws error when encountering unsupported characters', () => {
    expect(() => {
      format('SELECT «weird-stuff»');
    }).toThrow('Parse error: Unexpected "«weird-stuff»"');
  });

  it('does nothing with empty input', () => {
    const result = format('');

    expect(result).toBe('');
  });

  it('throws error when query argument is not string', () => {
    expect(() => format(undefined as unknown as string)).toThrow(
      'Invalid query argument. Expected string, instead got undefined'
    );
  });
});
