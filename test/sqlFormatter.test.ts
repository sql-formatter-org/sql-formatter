import dedent from 'dedent-js';
import { format, SqlLanguage } from '../src/sqlFormatter';

describe('sqlFormatter', () => {
  it('throws error when unsupported language parameter specified', () => {
    expect(() => {
      format('SELECT *', { language: 'blah' as SqlLanguage });
    }).toThrow('Unsupported SQL dialect: blah');
  });

  it('supports strings in place of enum keys in option values', () => {
    expect(format('SELECT *', { keywordCase: 'lower' })).toBe(dedent`
      select
        *
    `);
  });
});
