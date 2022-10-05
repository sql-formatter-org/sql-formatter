import dedent from 'dedent-js';

import { format, SqlLanguage } from '../src/sqlFormatter.js';
import { sqlite } from '../src/languages/sqlite/sqlite.formatter.js';

describe('sqlFormatter', () => {
  it('throws error when unsupported language parameter specified', () => {
    expect(() => {
      format('SELECT *', { language: 'blah' as SqlLanguage });
    }).toThrow('Unsupported SQL dialect: blah');
  });

  it('throws error when encountering unsupported characters', () => {
    expect(() => {
      format('SELECT «weird-stuff»');
    }).toThrow('Parse error: Unexpected "«weird-stu" at line 1 column 8');
  });

  it('throws error when encountering incorrect SQL grammar', () => {
    expect(() => format('SELECT foo.+;')).toThrow('Parse error at token: + at line 1 column 12');
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

  it('throws error when aliasAs config option used', () => {
    expect(() => {
      format('SELECT *', { aliasAs: 'always' } as any);
    }).toThrow('aliasAs config is no more supported.');
  });

  it('allows passing Dialect config object as a language parameter', () => {
    expect(format('SELECT [foo], `bar`;', { language: sqlite })).toBe(dedent`
      SELECT
        [foo],
        \`bar\`;
    `);
  });
});
