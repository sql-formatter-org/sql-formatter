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

  // Issue #279
  it('supports parametric STRUCT with named fields', () => {
    expect(format('SELECT STRUCT<y INT64, z STRING>(1,"foo"), STRUCT<arr ARRAY<INT64>>([1,2,3]);'))
      .toBe(dedent`
      SELECT
        STRUCT<y INT64, z STRING>(1, "foo"),
        STRUCT<arr ARRAY<INT64>>([1, 2, 3]);
    `);
  });

  it('supports uppercasing of STRUCT', () => {
    expect(format('select struct<Nr int64, myName string>(1,"foo");', { keywordCase: 'upper' }))
      .toBe(dedent`
      SELECT
        STRUCT<Nr INT64, myName STRING>(1, "foo");
    `);
  });

  // XXX: This is hard to achieve with our current type-parameter processing hack.
  // At least we're preserving the case of identifier names here,
  // and lowercasing is luckily less used than uppercasing.
  it('does not support lowercasing of STRUCT', () => {
    expect(format('SELECT STRUCT<Nr INT64, myName STRING>(1,"foo");', { keywordCase: 'lower' }))
      .toBe(dedent`
      select
        STRUCT<Nr INT64, myName STRING>(1, "foo");
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
    const createViewVariations = [
      'CREATE VIEW',
      'CREATE OR REPLACE VIEW',
      'CREATE VIEW IF NOT EXISTS',
    ];

    createViewVariations.forEach((createViewVariation: string) => {
      expect(
        format(`
        ${createViewVariation} my_dataset.my_view AS (
          SELECT t1.col1, t1.col2 FROM my_dataset.my_table)`)
      ).toBe(dedent`
        ${createViewVariation}
          my_dataset.my_view AS (
            SELECT
              t1.col1,
              t1.col2
            FROM
              my_dataset.my_table
          )
      `);
    });
  });

  // Issue #279
  describe('supports FROM clause operators:', () => {
    it('UNNEST operator', () => {
      expect(format('SELECT * FROM UNNEST ([1, 2, 3]);')).toBe(dedent`
        SELECT
          *
        FROM
          UNNEST ([1, 2, 3]);
      `);
    });

    it('PIVOT operator', () => {
      expect(format(`SELECT * FROM Produce PIVOT(sales FOR quarter IN (Q1, Q2, Q3, Q4));`))
        .toBe(dedent`
        SELECT
          *
        FROM
          Produce PIVOT(
            sales
            FOR
              quarter IN (Q1, Q2, Q3, Q4)
          );
      `);
    });

    it('UNPIVOT operator', () => {
      expect(format(`SELECT * FROM Produce UNPIVOT(sales FOR quarter IN (Q1, Q2, Q3, Q4));`))
        .toBe(dedent`
        SELECT
          *
        FROM
          Produce UNPIVOT(
            sales
            FOR
              quarter IN (Q1, Q2, Q3, Q4)
          );
      `);
    });

    it('TABLESAMPLE SYSTEM operator', () => {
      expect(format(`SELECT * FROM dataset.my_table TABLESAMPLE SYSTEM (10 PERCENT);`)).toBe(dedent`
        SELECT
          *
        FROM
          dataset.my_table TABLESAMPLE SYSTEM (10 PERCENT);
      `);
    });
  });

  describe('BigQuery DDL', () => {
    const createSchemaVariants = ['CREATE SCHEMA', 'CREATE SCHEMA IF NOT EXISTS'];
    createSchemaVariants.forEach(createSchema => {
      it(`Supports ${createSchema}`, () => {
        const input = `
          ${createSchema} mydataset
            DEFAULT COLLATE 'und:ci'
            OPTIONS(
              location="us", labels=[("label1","value1"),("label2","value2")])`;
        const expected = dedent`
          ${createSchema}
            mydataset
          DEFAULT COLLATE
            'und:ci' OPTIONS(
              location = "us",
              labels = [("label1", "value1"), ("label2", "value2")]
            )
        `;
        expect(format(input, { keywordCase: 'upper' })).toBe(expected);
      });
    });

    const createTableVariations = [
      'CREATE TABLE',
      'CREATE TABLE IF NOT EXISTS',
      'CREATE TEMP TABLE',
      'CREATE TEMP TABLE IF NOT EXISTS',
      'CREATE TEMPORARY TABLE',
      'CREATE TEMPORARY TABLE IF NOT EXISTS',
      'CREATE OR REPLACE TABLE',
      'CREATE OR REPLACE TEMP TABLE',
      'CREATE OR REPLACE TEMPORARY TABLE',
    ];
    createTableVariations.forEach((createTable: string) => {
      it(`Supports ${createTable}`, () => {
        const input = `
          ${createTable} mydataset.newtable
          (
            x INT64 OPTIONS(description="desc1"),
            y STRUCT<
              a ARRAY<STRING> OPTIONS(description="desc2"),
              b BOOL
            >
          )
          PARTITION BY _PARTITIONDATE
          OPTIONS(
            expiration_timestamp=TIMESTAMP "2025-01-01 00:00:00 UTC",
            partition_expiration_days=1
          )`;

        // need to fix the formatting of y STRUCT<a ARRAY<STRING>OPTIONS(description ="desc2"), b BOOL>
        const expected = dedent`
          ${createTable}
            mydataset.newtable (
              x INT64 OPTIONS(description = "desc1"),
              y STRUCT<a ARRAY<STRING>OPTIONS(description ="desc2"), b BOOL>
            ) PARTITION BY _PARTITIONDATE OPTIONS(
              expiration_timestamp = TIMESTAMP "2025-01-01 00:00:00 UTC",
              partition_expiration_days = 1
            )`;

        expect(format(input)).toBe(expected);
      });
    });
  });
});
