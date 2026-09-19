import dedent from 'dedent-js';

import { format, formatDialect, SqlLanguage, sqlite, DialectOptions } from '../src/index.js';

describe('sqlFormatter', () => {
  it('throws error when unsupported language parameter specified', () => {
    expect(() => {
      format('SELECT *', { language: 'blah' as SqlLanguage });
    }).toThrow('Unsupported SQL dialect: blah');
  });

  describe('when encountering unsupported characters with default dialect', () => {
    it('throws error suggesting a use of a more specific dialect', () => {
      expect(() => {
        format('SELECT «weird-stuff»');
      }).toThrow(
        `Parse error: Unexpected "«weird-stu" at line 1 column 8.\n` +
          `This likely happens because you're using the default "sql" dialect.\n` +
          `If possible, please select a more specific dialect (like sqlite, postgresql, etc).`
      );
    });
  });

  describe('when encountering unsupported characters with sqlite dialect', () => {
    it('throws error including the name of the used dialect', () => {
      expect(() => {
        format('SELECT «weird-stuff»', { language: 'sqlite' });
      }).toThrow(
        `Parse error: Unexpected "«weird-stu" at line 1 column 8.\nSQL dialect used: "sqlite".`
      );
    });
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
  describe('when a custom dialect would match zero-length tokens', () => {
    // A quote type that resolves to no pattern at all yields a regex matching
    // the empty string, which never advances the tokenizer. It used to loop
    // forever instead of reporting the problem. Issue #754 was the same failure
    // for paramTypes.
    const dialectWith = (
      tokenizerOptions: Partial<typeof sqlite.tokenizerOptions>
    ): DialectOptions => ({
      name: 'myCustomDialect',
      tokenizerOptions: { ...sqlite.tokenizerOptions, ...tokenizerOptions },
      formatOptions: sqlite.formatOptions,
    });

    const expectConfigError = (dialect: DialectOptions, message: RegExp) => {
      expect(() => formatDialect('SELECT 1;', { dialect })).toThrow(message);
    };

    it('rejects an empty quote type list', () => {
      const empty = (field: string) =>
        new RegExp(`Empty ${field} given for dialect "myCustomDialect"\\.`);
      expectConfigError(dialectWith({ stringTypes: [] }), empty('stringTypes'));
      expectConfigError(dialectWith({ identTypes: [] }), empty('identTypes'));
      expectConfigError(dialectWith({ variableTypes: [] }), empty('variableTypes'));
    });

    it('rejects a quote type name that has no pattern', () => {
      // The types only allow known names, so this covers plain JavaScript
      // callers. quotePatterns has no plain "''" key; the real keys are
      // "''-qq", "''-bs", "''-raw" and so on.
      const unknown = (quote: string) =>
        new RegExp(`Unknown quote type ${JSON.stringify(quote)} given in stringTypes`);

      expectConfigError(dialectWith({ stringTypes: ["''"] } as never), unknown("''"));

      const prefixed = { stringTypes: [{ quote: '""', prefixes: ['X'] }] } as never;
      expectConfigError(dialectWith(prefixed), unknown('""'));
    });

    it('rejects an empty regex quote type', () => {
      expectConfigError(
        dialectWith({ stringTypes: [{ regex: '' }] }),
        /Empty regex given in stringTypes of dialect "myCustomDialect"\./
      );
    });

    it('still allows a valid custom quote type list', () => {
      expect(
        formatDialect('SELECT 1;', {
          dialect: dialectWith({ stringTypes: [...sqlite.tokenizerOptions.stringTypes] }),
        })
      ).toBe(dedent`
        SELECT
          1;
      `);
    });
  });
});
