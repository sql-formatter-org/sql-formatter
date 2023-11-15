import dedent from 'dedent-js';

import { format, formatDialect, SqlLanguage, sqlite, DialectOptions } from '../src/index.js';

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

  it('throws error when tabulateAlias config option used', () => {
    expect(() => {
      format('SELECT *', { tabulateAlias: false } as any);
    }).toThrow('tabulateAlias config is no more supported.');
  });

  it('throws error when commaPosition config option used', () => {
    expect(() => {
      format('SELECT *', { commaPosition: 'before' } as any);
    }).toThrow('commaPosition config is no more supported.');
  });

  describe('formatDialect()', () => {
    it('allows passing Dialect config object as a dialect parameter', () => {
      expect(formatDialect('SELECT [foo], `bar`;', { dialect: sqlite })).toBe(dedent`
        SELECT
          [foo],
          \`bar\`;
      `);
    });

    it('allows use of regex-based custom string type', () => {
      // Extend SQLite dialect with additional string type
      const sqliteWithTemplates: DialectOptions = {
        name: 'myCustomDialect',
        tokenizerOptions: {
          ...sqlite.tokenizerOptions,
          stringTypes: [...sqlite.tokenizerOptions.stringTypes, { regex: String.raw`\{\{.*?\}\}` }],
        },
        formatOptions: sqlite.formatOptions,
      };

      expect(
        formatDialect(`SELECT {{template item}}, 'normal string' FROM {{tbl}};`, {
          dialect: sqliteWithTemplates,
        })
      ).toBe(dedent`
        SELECT
          {{template item}},
          'normal string'
        FROM
          {{tbl}};
      `);
    });
  });
});
