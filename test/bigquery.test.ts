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

  it('supports parametric ARRAY and STRUCT', () => {
    const result = format('SELECT STRUCT<ARRAY<INT64>>([]), ARRAY<FLOAT>[1] FROM tbl');
    expect(result).toBe(dedent`
      SELECT
        STRUCT<ARRAY<INT64>>([]),
        ARRAY<FLOAT>[1]
      FROM
        tbl
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

  it('supports create view optional arguments', () => {
    expect(
      format(`
      CREATE OR REPLACE VIEW my_dataset.my_view AS (
        SELECT t1.col1, t1.col2 FROM my_dataset.my_table)`)
    ).toBe(dedent`
      CREATE OR REPLACE VIEW
        my_dataset.my_view AS (
          SELECT
            t1.col1,
            t1.col2
          FROM
            my_dataset.my_table
        )
    `);

    expect(
      format(`
      CREATE VIEW IF NOT EXISTS my_dataset.my_view AS (
        SELECT t1.col1, t1.col2 FROM my_dataset.my_table)`)
    ).toBe(dedent`
      CREATE VIEW IF NOT EXISTS
        my_dataset.my_view AS (
          SELECT
            t1.col1,
            t1.col2
          FROM
            my_dataset.my_table
        )
    `);
  });

  it('supports create table optional arguments', () => {
    expect(
      format(`
      CREATE TABLE mydataset.newtable (
        a INT64 NOT NULL
      )`)
    ).toBe(dedent`
      CREATE TABLE
        mydataset.newtable (a INT64 NOT NULL)
    `);

    expect(
      format(`
      CREATE TABLE IF NOT EXISTS mydataset.newtable (
        a INT64 NOT NULL
      )`)
    ).toBe(dedent`
      CREATE TABLE IF NOT EXISTS
        mydataset.newtable (a INT64 NOT NULL)
    `);

    expect(
      format(`
      CREATE TEMP TABLE mydataset.newtable (
        a INT64 NOT NULL
      )`)
    ).toBe(dedent`
      CREATE TEMP TABLE
        mydataset.newtable (a INT64 NOT NULL)
    `);

    expect(
      format(`
      CREATE TEMP TABLE IF NOT EXISTS mydataset.newtable (
        a INT64 NOT NULL
      )`)
    ).toBe(dedent`
      CREATE TEMP TABLE IF NOT EXISTS
        mydataset.newtable (a INT64 NOT NULL)
    `);

    expect(
      format(`
      CREATE TEMPORARY TABLE mydataset.newtable (
        a INT64 NOT NULL
      )`)
    ).toBe(dedent`
      CREATE TEMPORARY TABLE
        mydataset.newtable (a INT64 NOT NULL)
    `);

    expect(
      format(`
      CREATE TEMPORARY TABLE IF NOT EXISTS mydataset.newtable (
        a INT64 NOT NULL
      )`)
    ).toBe(dedent`
      CREATE TEMPORARY TABLE IF NOT EXISTS
        mydataset.newtable (a INT64 NOT NULL)
    `);

    expect(
      format(`
      CREATE OR REPLACE TABLE mydataset.newtable (
        a INT64 NOT NULL
      )`)
    ).toBe(dedent`
      CREATE OR REPLACE TABLE
        mydataset.newtable (a INT64 NOT NULL)
    `);

    expect(
      format(`
      CREATE OR REPLACE TEMP TABLE mydataset.newtable (
        a INT64 NOT NULL
      )`)
    ).toBe(dedent`
      CREATE OR REPLACE TEMP TABLE
        mydataset.newtable (a INT64 NOT NULL)
    `);

    expect(
      format(`
      CREATE OR REPLACE TEMPORARY TABLE mydataset.newtable (
        a INT64 NOT NULL
      )`)
    ).toBe(dedent`
      CREATE OR REPLACE TEMPORARY TABLE
        mydataset.newtable (a INT64 NOT NULL)
    `);
  });
});
