import { format, SqlLanguage } from 'src/sqlFormatter';

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

  it('throws error when multilineLists config option used', () => {
    expect(() => {
      format('SELECT *', { multilineLists: 'always' } as any);
    }).toThrow('multilineLists config is no more supported.');
  });

  it('throws error when newlineBeforeOpenParen config option used', () => {
    expect(() => {
      format('SELECT *', { newlineBeforeOpenParen: true } as any);
    }).toThrow('newlineBeforeOpenParen config is no more supported.');
  });

  it('throws error when newlineBeforeCloseParen config option used', () => {
    expect(() => {
      format('SELECT *', { newlineBeforeCloseParen: true } as any);
    }).toThrow('newlineBeforeCloseParen config is no more supported.');
  });
});
