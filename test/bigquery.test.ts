import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from 'src/sqlFormatter';
import BigQueryFormatter from 'src/languages/bigquery.formatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsCreateTable from './features/createTable';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';
import supportsArrayLiterals from './features/arrayLiterals';
import supportsBetween from './features/between';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsDeleteFrom from './features/deleteFrom';
import supportsComments from './features/comments';
import supportsIdentifiers from './features/identifiers';
import supportsParams from './options/param';

describe('BigQueryFormatter', () => {
  const language = 'bigquery';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format, { hashComments: true });
  supportsCreateTable(format);
  supportsDeleteFrom(format);
  supportsStrings(format, ['""', "''"]);
  supportsIdentifiers(format, ['``']);
  supportsArrayLiterals(format);
  supportsBetween(format);
  supportsSchema(format);
  supportsJoin(format, { without: ['NATURAL JOIN'] });
  supportsOperators(format, BigQueryFormatter.operators);
  supportsParams(format, { positional: true, named: ['@'], quoted: ['@``'] });

  // Note: BigQuery supports single dashes inside identifiers, so my-ident would be
  // detected as identifier, while other SQL dialects would detect it as
  // "my" <minus> "ident"
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/lexical
  it('supports dashes inside identifiers', () => {
    const result = format('SELECT alpha-foo, where-long-identifier\nFROM beta');
    expect(result).toBe(dedent`
      SELECT
        alpha-foo,
        where-long-identifier
      FROM
        beta
    `);
  });

  // BigQuery-specific string types
  it('supports strings with r, b and rb prefixes', () => {
    expect(format(`SELECT R'blah', B'sah', rb"huh", br'bulu bulu', r"haha", BR'la la' FROM foo`))
      .toBe(dedent`
      SELECT
        R'blah',
        B'sah',
        rb"huh",
        br'bulu bulu',
        r"haha",
        BR'la la'
      FROM
        foo
    `);
  });

  it('supports triple-quoted strings', () => {
    expect(
      format(`SELECT '''hello 'my' world''', """hello "my" world""", """\\"quoted\\"""" FROM foo`)
    ).toBe(dedent`
      SELECT
        '''hello 'my' world''',
        """hello "my" world""",
        """\\"quoted\\""""
      FROM
        foo
    `);
  });

  it('supports strings with r, b and rb prefixes with triple-quoted strings', () => {
    expect(
      format(
        `SELECT R'''blah''', B'''sah''', rb"""hu"h""", br'''bulu bulu''', r"""haha""", BR'''la' la''' FROM foo`
      )
    ).toBe(dedent`
      SELECT
        R'''blah''',
        B'''sah''',
        rb"""hu"h""",
        br'''bulu bulu''',
        r"""haha""",
        BR'''la' la'''
      FROM
        foo
    `);
  });

  it('supports STRUCT types', () => {
    const result = format(
      'SELECT STRUCT("Alpha" as name, [23.4, 26.3, 26.4, 26.1] as splits) FROM beta'
    );
    expect(result).toBe(dedent`
      SELECT
        STRUCT("Alpha" as name, [23.4, 26.3, 26.4, 26.1] as splits)
      FROM
        beta
    `);
  });

  it('supports parametric ARRAY', () => {
    expect(format('SELECT ARRAY<FLOAT>[1]')).toBe(dedent`
      SELECT
        ARRAY<FLOAT>[1]
    `);
  });

  it('supports parametric STRUCT', () => {
    expect(format('SELECT STRUCT<ARRAY<INT64>>([])')).toBe(dedent`
      SELECT
        STRUCT<ARRAY<INT64>>([])
    `);
  });

  it('supports parameterised types', () => {
    const result = format(
      `
      DECLARE varString STRING(11) '11charswide';
      DECLARE varBytes BYTES(8);
      DECLARE varNumeric NUMERIC(1,1);
      DECLARE varDecimal DECIMAL(1,1);
      DECLARE varBignumeric BIGNUMERIC(1,1);
      DECLARE varBigdecimal BIGDECIMAL(1,1);
    `,
      { linesBetweenQueries: 0 }
    );
    expect(result).toBe(dedent`
      DECLARE
        varString STRING(11) '11charswide';
      DECLARE
        varBytes BYTES(8);
      DECLARE
        varNumeric NUMERIC(1, 1);
      DECLARE
        varDecimal DECIMAL(1, 1);
      DECLARE
        varBignumeric BIGNUMERIC(1, 1);
      DECLARE
        varBigdecimal BIGDECIMAL(1, 1);
    `);
  });

  // Regression test for issue #243
  it('supports array subscript operator', () => {
    expect(
      format(`
      SELECT item_array[OFFSET(1)] AS item_offset,
      item_array[ORDINAL(1)] AS item_ordinal,
      item_array[SAFE_OFFSET(6)] AS item_safe_offset,
      item_array[SAFE_ORDINAL(6)] AS item_safe_ordinal
      FROM Items;
    `)
    ).toBe(dedent`
      SELECT
        item_array[OFFSET(1)] AS item_offset,
        item_array[ORDINAL(1)] AS item_ordinal,
        item_array[SAFE_OFFSET(6)] AS item_safe_offset,
        item_array[SAFE_ORDINAL(6)] AS item_safe_ordinal
      FROM
        Items;
    `);
  });
});
