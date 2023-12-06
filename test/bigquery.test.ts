import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter.js';

import supportsCreateTable from './features/createTable.js';
import supportsDropTable from './features/dropTable.js';
import supportsStrings from './features/strings.js';
import supportsArrayLiterals from './features/arrayLiterals.js';
import supportsBetween from './features/between.js';
import supportsJoin from './features/join.js';
import supportsOperators from './features/operators.js';
import supportsDeleteFrom from './features/deleteFrom.js';
import supportsComments from './features/comments.js';
import supportsIdentifiers from './features/identifiers.js';
import supportsParams from './options/param.js';
import supportsWindow from './features/window.js';
import supportsSetOperations from './features/setOperations.js';
import supportsLimiting from './features/limiting.js';
import supportsInsertInto from './features/insertInto.js';
import supportsUpdate from './features/update.js';
import supportsTruncateTable from './features/truncateTable.js';
import supportsMergeInto from './features/mergeInto.js';
import supportsCreateView from './features/createView.js';
import supportsAlterTable from './features/alterTable.js';
import supportsIsDistinctFrom from './features/isDistinctFrom.js';
import supportsDataTypeCase from './options/dataTypeCase.js';

describe('BigQueryFormatter', () => {
  const language = 'bigquery';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format, { hashComments: true });
  supportsCreateView(format, { orReplace: true, materialized: true, ifNotExists: true });
  supportsCreateTable(format, {
    orReplace: true,
    ifNotExists: true,
    dialectDoesntHaveVarchar: true,
  });
  supportsDropTable(format, { ifExists: true });
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
    renameTo: true,
  });
  supportsDeleteFrom(format, { withoutFrom: true });
  supportsInsertInto(format, { withoutInto: true });
  supportsUpdate(format);
  supportsTruncateTable(format);
  supportsMergeInto(format);
  supportsStrings(format, ['""-bs', "''-bs", "R''", 'R""', "B''", 'B""']);
  supportsIdentifiers(format, ['``']);
  supportsArrayLiterals(format, { withArrayPrefix: true, withoutArrayPrefix: true });
  supportsBetween(format);
  supportsJoin(format, { without: ['NATURAL'] });
  supportsSetOperations(format, [
    'UNION ALL',
    'UNION DISTINCT',
    'EXCEPT DISTINCT',
    'INTERSECT DISTINCT',
  ]);
  supportsOperators(format, ['&', '|', '^', '~', '>>', '<<', '||', '=>'], { any: true });
  supportsIsDistinctFrom(format);
  supportsParams(format, { positional: true, named: ['@'], quoted: ['@``'] });
  supportsWindow(format);
  supportsLimiting(format, { limit: true, offset: true });
  supportsDataTypeCase(format);

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

  it('supports @@variables', () => {
    expect(format('SELECT @@error.message, @@time_zone')).toBe(dedent`
      SELECT
        @@error.message,
        @@time_zone
    `);
  });

  // BigQuery-specific string types
  it('supports strings with rb prefixes', () => {
    expect(format(`SELECT rb"huh", br'bulu bulu', BR'la la' FROM foo`)).toBe(dedent`
      SELECT
        rb"huh",
        br'bulu bulu',
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
    const result = format('SELECT STRUCT("Alpha" as name, [23.4, 26.3, 26.4] as splits) FROM beta');
    expect(result).toBe(dedent`
      SELECT
        STRUCT("Alpha" as name, [23.4, 26.3, 26.4] as splits)
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

  // TODO: Possibly incorrect formatting of STRUCT<>() and ARRAY<>()
  it('supports parametric STRUCT', () => {
    expect(format('SELECT STRUCT<ARRAY<INT64>>([])')).toBe(dedent`
      SELECT
        STRUCT<ARRAY<INT64>> ([])
    `);
  });

  // Issue #279
  it('supports parametric STRUCT with named fields', () => {
    expect(format('SELECT STRUCT<y INT64, z STRING>(1,"foo"), STRUCT<arr ARRAY<INT64>>([1,2,3]);'))
      .toBe(dedent`
      SELECT
        STRUCT<y INT64, z STRING> (1, "foo"),
        STRUCT<arr ARRAY<INT64>> ([1, 2, 3]);
    `);
  });

  it('supports uppercasing of STRUCT', () => {
    expect(format('select struct<Nr int64, myName string>(1,"foo");', { keywordCase: 'upper' }))
      .toBe(dedent`
      SELECT
        STRUCT<Nr INT64, myName STRING> (1, "foo");
    `);
  });

  // XXX: This is hard to achieve with our current type-parameter processing hack.
  // At least we're preserving the case of identifier names here,
  // and lowercasing is luckily less used than uppercasing.
  it('does not support lowercasing of STRUCT', () => {
    expect(format('SELECT STRUCT<Nr INT64, myName STRING>(1,"foo");', { keywordCase: 'lower' }))
      .toBe(dedent`
      select
        STRUCT<Nr INT64, myName STRING> (1, "foo");
    `);
  });

  it('supports QUALIFY clause', () => {
    expect(
      format(`
        SELECT
          item,
          RANK() OVER (PARTITION BY category ORDER BY purchases DESC) AS rank
        FROM Produce
        WHERE Produce.category = 'vegetable'
        QUALIFY rank <= 3
      `)
    ).toBe(dedent`
      SELECT
        item,
        RANK() OVER (
          PARTITION BY
            category
          ORDER BY
            purchases DESC
        ) AS rank
      FROM
        Produce
      WHERE
        Produce.category = 'vegetable'
      QUALIFY
        rank <= 3
    `);
  });

  it('supports parameterised types', () => {
    const sql = dedent`
      DECLARE varString STRING(11) '11charswide';
      DECLARE varBytes BYTES(8);
      DECLARE varNumeric NUMERIC(1, 1);
      DECLARE varDecimal DECIMAL(1, 1);
      DECLARE varBignumeric BIGNUMERIC(1, 1);
      DECLARE varBigdecimal BIGDECIMAL(1, 1);
    `;
    expect(format(sql, { linesBetweenQueries: 0 })).toBe(sql);
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

  it('supports named arguments', () => {
    expect(
      format(`
      SELECT MAKE_INTERVAL(1, day=>2, minute => 3)
      `)
    ).toBe(dedent`
      SELECT
        MAKE_INTERVAL(1, day => 2, minute => 3)
    `);
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
            FOR quarter IN (Q1, Q2, Q3, Q4)
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
            FOR quarter IN (Q1, Q2, Q3, Q4)
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

  it('supports trailing comma in SELECT clause', () => {
    expect(format(`SELECT foo, bar, FROM tbl;`)).toBe(dedent`
      SELECT
        foo,
        bar,
      FROM
        tbl;
    `);
  });

  describe('BigQuery DDL Create Statements', () => {
    it(`Supports CREATE SCHEMA`, () => {
      const input = `
        CREATE SCHEMA mydataset
          DEFAULT COLLATE 'und:ci'
          OPTIONS(
            location="us", labels=[("label1","value1"),("label2","value2")])`;
      const expected = dedent`
        CREATE SCHEMA mydataset
        DEFAULT COLLATE 'und:ci' OPTIONS(
          location = "us",
          labels = [("label1", "value1"), ("label2", "value2")]
        )
      `;
      expect(format(input)).toBe(expected);
    });

    it(`Supports CREATE EXTERNAL TABLE ... WITH PARTITION COLUMN`, () => {
      const input = `
        CREATE EXTERNAL TABLE dataset.CsvTable
        WITH PARTITION COLUMNS (
          field_1 STRING,
          field_2 INT64
        )
        OPTIONS(
          format = 'CSV',
          uris = ['gs://bucket/path1.csv']
        )`;
      const expected = dedent`
        CREATE EXTERNAL TABLE
          dataset.CsvTable
        WITH PARTITION COLUMNS
          (field_1 STRING, field_2 INT64) OPTIONS(format = 'CSV', uris = ['gs://bucket/path1.csv'])`;
      expect(format(input)).toBe(expected);
    });

    it(`Supports CREATE FUNCTION`, () => {
      const input = `
        CREATE FUNCTION mydataset.myFunc(x FLOAT64, y FLOAT64)
        RETURNS FLOAT64
        AS (x * y);`;
      const expected = dedent`
        CREATE FUNCTION mydataset.myFunc (x FLOAT64, y FLOAT64) RETURNS FLOAT64 AS (x * y);`;
      expect(format(input)).toBe(expected);
    });

    it(`Supports CREATE FUNCTION - LANGUAGE js`, () => {
      const input = dedent`
        CREATE FUNCTION myFunc(x FLOAT64, y FLOAT64)
        RETURNS FLOAT64
        LANGUAGE js
        AS r"""
            return x*y;
          """;`;
      const expected = dedent`
        CREATE FUNCTION myFunc (x FLOAT64, y FLOAT64) RETURNS FLOAT64 LANGUAGE js AS r"""
            return x*y;
          """;`;
      expect(format(input)).toBe(expected);
    });

    it(`Supports CREATE TABLE FUNCTION`, () => {
      const input = `
        CREATE TABLE FUNCTION mydataset.names_by_year(y INT64)
        RETURNS TABLE<name STRING, year INT64>
        AS (
          SELECT year, name
          FROM mydataset.mytable
          WHERE year = y
        )`;

      // TODO: formatting for <name STRING, year INT64> can be improved
      const expected = dedent`
        CREATE TABLE FUNCTION mydataset.names_by_year (y INT64) RETURNS TABLE < name STRING,
        year INT64 > AS (
          SELECT
            year,
            name
          FROM
            mydataset.mytable
          WHERE
            year = y
        )`;
      expect(format(input)).toBe(expected);
    });

    // not correctly supported yet
    it(`Supports CREATE PROCEDURE`, () => {
      const input = `
        CREATE PROCEDURE myDataset.QueryTable()
        BEGIN
          SELECT * FROM anotherDataset.myTable;
        END;`;
      const expected = dedent`
        CREATE PROCEDURE myDataset.QueryTable ()
        BEGIN
        SELECT
          *
        FROM
          anotherDataset.myTable;

        END;`;
      expect(format(input)).toBe(expected);
    });

    it(`Supports CREATE ROW ACCESS POLICY`, () => {
      const input = `
        CREATE ROW ACCESS POLICY us_filter
        ON mydataset.table1
        GRANT TO ("group:abc@example.com", "user:hello@example.com")
        FILTER USING (Region="US")`;
      const expected = dedent`
        CREATE ROW ACCESS POLICY us_filter ON mydataset.table1
        GRANT TO ("group:abc@example.com", "user:hello@example.com")
        FILTER USING (Region = "US")`;
      expect(format(input)).toBe(expected);
    });

    [
      // Create statements using "AS JSON"
      'CREATE CAPACITY',
      'CREATE RESERVATION',
      'CREATE ASSIGNMENT',
    ].forEach(create => {
      it(`Supports ${create}`, () => {
        const input = dedent`
          ${create} admin_project.region-us.my-commitment
          AS JSON """{
              "slot_count": 100,
              "plan": "FLEX"
            }"""`;
        const expected = dedent`
          ${create} admin_project.region-us.my-commitment
          AS JSON """{
              "slot_count": 100,
              "plan": "FLEX"
            }"""`;
        expect(format(input)).toBe(expected);
      });
    });

    it(`Supports CREATE SEARCH INDEX`, () => {
      const input = `
        CREATE SEARCH INDEX my_index
        ON dataset.my_table(ALL COLUMNS);`;
      const expected = dedent`
        CREATE SEARCH INDEX my_index ON dataset.my_table (ALL COLUMNS);`;
      expect(format(input)).toBe(expected);
    });
  });

  describe('BigQuery DDL Alter Statements', () => {
    it(`Supports ALTER SCHEMA - SET DEFAULT COLLATE`, () => {
      const input = `
        ALTER SCHEMA mydataset
        SET DEFAULT COLLATE 'und:ci'`;
      const expected = dedent`
        ALTER SCHEMA mydataset
        SET DEFAULT COLLATE 'und:ci'`;
      expect(format(input)).toBe(expected);
    });

    it(`Supports ALTER SCHEMA - SET OPTIONS`, () => {
      const input = `
        ALTER SCHEMA mydataset
        SET OPTIONS(
          default_table_expiration_days=3.75
          )`;
      const expected = dedent`
        ALTER SCHEMA mydataset
        SET OPTIONS (default_table_expiration_days = 3.75)`;
      expect(format(input)).toBe(expected);
    });

    it(`Supports ALTER TABLE - SET OPTIONS`, () => {
      const input = `
        ALTER TABLE mydataset.mytable
        SET OPTIONS(
          expiration_timestamp=TIMESTAMP_ADD(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
        )`;
      const expected = dedent`
        ALTER TABLE mydataset.mytable
        SET OPTIONS (
          expiration_timestamp = TIMESTAMP_ADD(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
        )`;
      expect(format(input)).toBe(expected);
    });

    it(`Supports ALTER TABLE - SET DEFAULT COLLATE`, () => {
      const input = `
        ALTER TABLE mydataset.mytable
        SET DEFAULT COLLATE 'und:ci'`;
      const expected = dedent`
        ALTER TABLE mydataset.mytable
        SET DEFAULT COLLATE 'und:ci'`;
      expect(format(input)).toBe(expected);
    });

    it(`Supports ALTER COLUMN - SET OPTIONS`, () => {
      const input = `
        ALTER TABLE mydataset.mytable
        ALTER COLUMN price
        SET OPTIONS (
          description="Price per unit"
        )`;
      const expected = dedent`
        ALTER TABLE mydataset.mytable
        ALTER COLUMN price
        SET OPTIONS (description = "Price per unit")`;
      expect(format(input)).toBe(expected);
    });

    it(`Supports ALTER COLUMN - DROP NOT NULL`, () => {
      const input = `
        ALTER TABLE mydataset.mytable
        ALTER COLUMN price
        DROP NOT NULL`;
      const expected = dedent`
        ALTER TABLE mydataset.mytable
        ALTER COLUMN price
        DROP NOT NULL`;
      expect(format(input)).toBe(expected);
    });

    it(`Supports ALTER COLUMN - SET DATA TYPE`, () => {
      const input = `
        ALTER TABLE mydataset.mytable
        ALTER COLUMN price
        SET DATA TYPE NUMERIC`;
      const expected = dedent`
        ALTER TABLE mydataset.mytable
        ALTER COLUMN price
        SET DATA TYPE NUMERIC`;
      expect(format(input)).toBe(expected);
    });

    it(`Supports ALTER VIEW - SET OPTIONS`, () => {
      const input = `
        ALTER VIEW mydataset.myview
        SET OPTIONS (
          expiration_timestamp=TIMESTAMP_ADD(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
        )`;
      const expected = dedent`
        ALTER VIEW mydataset.myview
        SET OPTIONS (
          expiration_timestamp = TIMESTAMP_ADD(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
        )`;
      expect(format(input)).toBe(expected);
    });

    it(`Supports ALTER BI_CAPACITY - SET OPTIONS`, () => {
      const input = `
        ALTER BI_CAPACITY my-project.region-us.default
        SET OPTIONS(
          size_gb = 250
        )`;
      const expected = dedent`
        ALTER BI_CAPACITY my-project.region-us.default
        SET OPTIONS (size_gb = 250)`;
      expect(format(input)).toBe(expected);
    });
  });

  describe('BigQuery DDL Drop Statements', () => {
    it(`Supports DROP clauses`, () => {
      const input = dedent`
        DROP SCHEMA mydataset.name;
        DROP VIEW mydataset.name;
        DROP FUNCTION mydataset.name;
        DROP TABLE FUNCTION mydataset.name;
        DROP PROCEDURE mydataset.name;
        DROP RESERVATION mydataset.name;
        DROP ASSIGNMENT mydataset.name;
        DROP SEARCH INDEX index2 ON mydataset.mytable;
        DROP mypolicy ON mydataset.mytable;
        DROP ALL ROW ACCESS POLICIES ON table_name;
      `;
      expect(format(input, { linesBetweenQueries: 0 })).toBe(input);
    });
  });
});
