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
});
