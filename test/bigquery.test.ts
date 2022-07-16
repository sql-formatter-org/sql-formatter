import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from 'src/sqlFormatter';
import BigQueryFormatter from 'src/languages/bigquery/bigquery.formatter';
import { flatKeywordList } from 'src/utils';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsCreateTable from './features/createTable';
import supportsStrings from './features/strings';
import supportsArrayLiterals from './features/arrayLiterals';
import supportsBetween from './features/between';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsDeleteFrom from './features/deleteFrom';
import supportsComments from './features/comments';
import supportsIdentifiers from './features/identifiers';
import supportsParams from './options/param';
import supportsWindow from './features/window';

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
  supportsJoin(format, { without: ['NATURAL JOIN'] });
  supportsOperators(format, BigQueryFormatter.operators);
  supportsParams(format, { positional: true, named: ['@'], quoted: ['@``'] });
  supportsWindow(format);

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
        STRUCT ("Alpha" as name, [23.4, 26.3, 26.4, 26.1] as splits)
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

  describe('BigQuery DDL Create Statements', () => {
    const createCmds = {
      schema: ['CREATE SCHEMA', 'CREATE SCHEMA IF NOT EXISTS'],
      table: ['CREATE TABLE', 'CREATE TABLE IF NOT EXISTS', 'CREATE OR REPLACE TABLE'],
      tempTable: [
        'CREATE TEMP TABLE',
        'CREATE TEMP TABLE IF NOT EXISTS',
        'CREATE TEMPORARY TABLE',
        'CREATE TEMPORARY TABLE IF NOT EXISTS',
        'CREATE OR REPLACE TEMP TABLE',
        'CREATE OR REPLACE TEMPORARY TABLE',
      ],
      snapshotTable: ['CREATE SNAPSHOT TABLE', 'CREATE SNAPSHOT TABLE IF NOT EXISTS'],
      view: ['CREATE VIEW', 'CREATE OR REPLACE VIEW', 'CREATE VIEW IF NOT EXISTS'],
      materializedView: [
        'CREATE MATERIALIZED VIEW',
        'CREATE OR REPLACE MATERIALIZED VIEW',
        'CREATE MATERIALIZED VIEW IF NOT EXISTS',
      ],
      externalTable: [
        'CREATE EXTERNAL TABLE',
        'CREATE OR REPLACE EXTERNAL TABLE',
        'CREATE EXTERNAL TABLE IF NOT EXISTS',
      ],
      function: ['CREATE FUNCTION', 'CREATE OR REPLACE FUNCTION', 'CREATE FUNCTION IF NOT EXISTS'],
      tempFunction: [
        'CREATE TEMP FUNCTION',
        'CREATE OR REPLACE TEMP FUNCTION',
        'CREATE TEMP FUNCTION IF NOT EXISTS',
        'CREATE TEMPORARY FUNCTION',
        'CREATE OR REPLACE TEMPORARY FUNCTION',
        'CREATE TEMPORARY FUNCTION IF NOT EXISTS',
      ],
      tableFunction: [
        'CREATE TABLE FUNCTION',
        'CREATE OR REPLACE TABLE FUNCTION',
        'CREATE TABLE FUNCTION IF NOT EXISTS',
      ],
      procedure: [
        'CREATE PROCEDURE',
        'CREATE OR REPLACE PROCEDURE',
        'CREATE PROCEDURE IF NOT EXISTS',
      ],
      rowAccessPolicy: [
        'CREATE ROW ACCESS POLICY',
        'CREATE ROW ACCESS POLICY IF NOT EXISTS',
        'CREATE OR REPLACE ROW ACCESS POLICY',
      ],
      searchIndex: ['CREATE SEARCH INDEX', 'CREATE SEARCH INDEX IF NOT EXISTS'],
    };

    createCmds.schema.forEach(createSchema => {
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
        expect(format(input)).toBe(expected);
      });
    });

    createCmds.table.concat(createCmds.tempTable).forEach((createTable: string) => {
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

        // TODO: need to fix the formatting of y STRUCT<a ARRAY<STRING>OPTIONS(description ="desc2"), b BOOL>
        const expected = dedent`
          ${createTable}
            mydataset.newtable (
              x INT64 OPTIONS(description = "desc1"),
              y STRUCT<a ARRAY<STRING>OPTIONS(description ="desc2"), b BOOL>
            )
          PARTITION BY
            _PARTITIONDATE OPTIONS(
              expiration_timestamp = TIMESTAMP "2025-01-01 00:00:00 UTC",
              partition_expiration_days = 1
            )`;

        expect(format(input)).toBe(expected);
      });
    });

    it(`Supports CREATE TABLE LIKE`, () => {
      const input = `
        CREATE TABLE mydataset.newtable
        LIKE mydataset.sourcetable
        AS (SELECT * FROM mydataset.myothertable)`;
      const expected = dedent`
        CREATE TABLE
          mydataset.newtable LIKE mydataset.sourcetable AS (
            SELECT
              *
            FROM
              mydataset.myothertable
          )`;

      expect(format(input)).toBe(expected);
    });

    it(`Supports CREATE TABLE COPY`, () => {
      const input = `
        CREATE TABLE mydataset.newtable
        COPY mydataset.sourcetable`;
      const expected = dedent`
        CREATE TABLE
          mydataset.newtable COPY mydataset.sourcetable`;

      expect(format(input)).toBe(expected);
    });

    it(`Supports CREATE TABLE CLONE`, () => {
      const input = `
        CREATE TABLE mydataset.newtable
        CLONE mydataset.sourcetable`;
      const expected = dedent`
        CREATE TABLE
          mydataset.newtable CLONE mydataset.sourcetable`;

      expect(format(input)).toBe(expected);
    });

    createCmds.snapshotTable.forEach(createSnapshotTable => {
      it(`Supports ${createSnapshotTable}`, () => {
        const input = `
          ${createSnapshotTable} mydataset.mytablesnapshot
          CLONE mydataset.mytable`;
        const expected = dedent`
          ${createSnapshotTable}
            mydataset.mytablesnapshot CLONE mydataset.mytable`;

        expect(format(input)).toBe(expected);
      });
    });

    createCmds.view.concat(createCmds.materializedView).forEach(createView => {
      it(`Supports ${createView}`, () => {
        const input = `
          ${createView} my_dataset.my_view AS (
          SELECT t1.col1, t1.col2 FROM my_dataset.my_table)`;
        const expected = dedent`
          ${createView}
            my_dataset.my_view AS (
              SELECT
                t1.col1,
                t1.col2
              FROM
                my_dataset.my_table
            )`;
        expect(format(input)).toBe(expected);
      });
    });

    createCmds.externalTable.forEach(createExternalTable => {
      it(`Supports ${createExternalTable}`, () => {
        const input = `
          ${createExternalTable} dataset.CsvTable
          WITH PARTITION COLUMNS (
            field_1 STRING,
            field_2 INT64
          )
          OPTIONS(
            format = 'CSV',
            uris = ['gs://bucket/path1.csv']
          )`;
        const expected = dedent`
          ${createExternalTable}
            dataset.CsvTable
          WITH PARTITION COLUMNS
            (field_1 STRING, field_2 INT64) OPTIONS(format = 'CSV', uris = ['gs://bucket/path1.csv'])`;
        expect(format(input)).toBe(expected);
      });
    });

    createCmds.function.concat(createCmds.tempFunction).forEach(createFunction => {
      it(`Supports ${createFunction}`, () => {
        const input = `
          ${createFunction} mydataset.myFunc(x FLOAT64, y FLOAT64)
          RETURNS FLOAT64
          AS (x * y);`;
        const expected = dedent`
          ${createFunction}
            mydataset.myFunc (x FLOAT64, y FLOAT64) RETURNS FLOAT64 AS (x * y);`;
        expect(format(input)).toBe(expected);

        // Regression test for issue #309
        expect(format(input, { aliasAs: 'always' })).toBe(expected);
      });
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
        CREATE FUNCTION
          myFunc (x FLOAT64, y FLOAT64) RETURNS FLOAT64 LANGUAGE js AS r"""
            return x*y;
          """;`;
      expect(format(input)).toBe(expected);
    });

    createCmds.tableFunction.forEach(createTableFunc => {
      it(`Supports ${createTableFunc}`, () => {
        const input = `
          ${createTableFunc} mydataset.names_by_year(y INT64)
          RETURNS TABLE<name STRING, year INT64>
          AS (
            SELECT year, name
            FROM mydataset.mytable
            WHERE year = y
          )`;

        // TODO: formatting for <name STRING, year INT64> can be improved
        const expected = dedent`
          ${createTableFunc}
            mydataset.names_by_year (y INT64)
          RETURNS TABLE
            < name STRING,
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
    });

    // not correctly supported yet
    createCmds.procedure.forEach(createProcedure => {
      it(`Supports ${createProcedure}`, () => {
        const input = `
          ${createProcedure} myDataset.QueryTable()
          BEGIN
            SELECT * FROM anotherDataset.myTable;
          END;`;
        const expected = dedent`
          ${createProcedure}
            myDataset.QueryTable ()
          BEGIN
          SELECT
            *
          FROM
            anotherDataset.myTable;

          END;`;
        expect(format(input)).toBe(expected);
      });
    });

    createCmds.rowAccessPolicy.forEach(createRowAccessPolicy => {
      it(`Supports ${createRowAccessPolicy}`, () => {
        const input = `
          ${createRowAccessPolicy} us_filter
          ON mydataset.table1
          GRANT TO ("group:abc@example.com", "user:hello@example.com")
          FILTER USING (Region="US")`;
        const expected = dedent`
          ${createRowAccessPolicy}
            us_filter ON mydataset.table1
          GRANT TO
            ("group:abc@example.com", "user:hello@example.com")
          FILTER USING
            (Region = "US")`;
        expect(format(input)).toBe(expected);
      });
    });

    it(`Supports CREATE CAPACITY`, () => {
      const input = dedent`
        CREATE CAPACITY admin_project.region-us.my-commitment
        AS JSON """{
            "slot_count": 100,
            "plan": "FLEX"
          }"""`;
      const expected = dedent`
        CREATE CAPACITY
          admin_project.region-us.my-commitment
        AS JSON
          """{
            "slot_count": 100,
            "plan": "FLEX"
          }"""`;
      expect(format(input)).toBe(expected);
    });

    it(`Supports CREATE RESERVATION`, () => {
      const input = dedent`
        CREATE RESERVATION admin_project.region-us.prod
        AS JSON """{
            "slot_capacity": 100
          }"""`;
      const expected = dedent`
        CREATE RESERVATION
          admin_project.region-us.prod
        AS JSON
          """{
            "slot_capacity": 100
          }"""`;
      expect(format(input)).toBe(expected);
    });

    it(`Supports CREATE ASSIGNMENT`, () => {
      const input = dedent`
        CREATE ASSIGNMENT admin_project.region-us.prod.my_assignment
        AS JSON """{
            "assignee": "projects/my_project",
            "job_type": "QUERY"
          }"""`;
      const expected = dedent`
        CREATE ASSIGNMENT
          admin_project.region-us.prod.my_assignment
        AS JSON
          """{
            "assignee": "projects/my_project",
            "job_type": "QUERY"
          }"""`;
      expect(format(input)).toBe(expected);
    });

    createCmds.searchIndex.forEach(createSearchIndex => {
      it(`Supports ${createSearchIndex}`, () => {
        const input = `
          ${createSearchIndex} my_index
          ON dataset.my_table(ALL COLUMNS);`;
        const expected = dedent`
          ${createSearchIndex}
            my_index ON dataset.my_table (ALL COLUMNS);`;
        expect(format(input)).toBe(expected);
      });
    });
  });

  describe('BigQuery DDL Alter Statements', () => {
    const alterCmds = {
      schema: ['ALTER SCHEMA', 'ALTER SCHEMA IF EXISTS'],
      table: ['ALTER TABLE', 'ALTER TABLE IF EXISTS'],
      column: ['ALTER COLUMN', 'ALTER COLUMN IF EXISTS'],
      view: ['ALTER VIEW', 'ALTER VIEW IF EXISTS'],
      materializedView: ['ALTER MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW IF EXISTS'],
    };

    alterCmds.schema.forEach(alterSchema => {
      it(`Supports ${alterSchema} - SET DEFAULT COLLATE`, () => {
        const input = `
          ${alterSchema} mydataset
          SET DEFAULT COLLATE 'und:ci'`;
        const expected = dedent`
          ${alterSchema}
            mydataset
          SET DEFAULT COLLATE
            'und:ci'`;
        expect(format(input)).toBe(expected);
      });
    });

    it(`Supports ALTER SCHEMA - SET OPTIONS`, () => {
      const input = `
        ALTER SCHEMA mydataset
        SET OPTIONS(
          default_table_expiration_days=3.75
          )`;
      const expected = dedent`
        ALTER SCHEMA
          mydataset
        SET OPTIONS
          (default_table_expiration_days = 3.75)`;
      expect(format(input)).toBe(expected);
    });

    alterCmds.table.forEach(alterTable => {
      it(`Supports ${alterTable} - SET OPTIONS`, () => {
        const input = `
          ${alterTable} mydataset.mytable
          SET OPTIONS(
            expiration_timestamp=TIMESTAMP_ADD(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
          )`;
        const expected = dedent`
          ${alterTable}
            mydataset.mytable
          SET OPTIONS
            (
              expiration_timestamp = TIMESTAMP_ADD(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
            )`;
        expect(format(input)).toBe(expected);
      });
    });

    it(`Supports ALTER TABLE - ADD COLUMN`, () => {
      const input = `
        ALTER TABLE mydataset.mytable
        ADD COLUMN col1 STRING,
        ADD COLUMN IF NOT EXISTS col2 GEOGRAPHY`;
      const expected = dedent`
        ALTER TABLE
          mydataset.mytable
        ADD COLUMN
          col1 STRING,
        ADD COLUMN IF NOT EXISTS
          col2 GEOGRAPHY`;
      expect(format(input)).toBe(expected);
    });

    it(`Supports ALTER TABLE - RENAME TO`, () => {
      const input = `
        ALTER TABLE mydataset.mytable RENAME TO mynewtable`;
      const expected = dedent`
        ALTER TABLE
          mydataset.mytable
        RENAME TO
          mynewtable`;
      expect(format(input)).toBe(expected);
    });

    it(`Supports ALTER TABLE - DROP COLUMN`, () => {
      const input = `
        ALTER TABLE mydataset.mytable
        DROP COLUMN col1,
        DROP COLUMN IF EXISTS col2`;
      const expected = dedent`
        ALTER TABLE
          mydataset.mytable
        DROP COLUMN
          col1,
        DROP COLUMN IF EXISTS
          col2`;
      expect(format(input)).toBe(expected);
    });

    it(`Supports ALTER TABLE - SET DEFAULT COLLATE`, () => {
      const input = `
        ALTER TABLE mydataset.mytable
        SET DEFAULT COLLATE 'und:ci'`;
      const expected = dedent`
        ALTER TABLE
          mydataset.mytable
        SET DEFAULT COLLATE
          'und:ci'`;
      expect(format(input)).toBe(expected);
    });

    alterCmds.column.forEach(alterColumn => {
      it(`Supports ${alterColumn} - SET OPTIONS`, () => {
        const input = `
          ALTER TABLE mydataset.mytable
          ${alterColumn} price
          SET OPTIONS (
            description="Price per unit"
          )`;
        const expected = dedent`
          ALTER TABLE
            mydataset.mytable
          ${alterColumn}
            price
          SET OPTIONS
            (description = "Price per unit")`;
        expect(format(input)).toBe(expected);
      });
    });

    it(`Supports ALTER COLUMN - DROP NOT NULL`, () => {
      const input = `
        ALTER TABLE mydataset.mytable
        ALTER COLUMN price
        DROP NOT NULL`;
      const expected = dedent`
        ALTER TABLE
          mydataset.mytable
        ALTER COLUMN
          price
        DROP NOT NULL`;
      expect(format(input)).toBe(expected);
    });

    it(`Supports ALTER COLUMN - SET DATA TYPE`, () => {
      const input = `
        ALTER TABLE mydataset.mytable
        ALTER COLUMN price
        SET DATA TYPE NUMERIC`;
      const expected = dedent`
        ALTER TABLE
          mydataset.mytable
        ALTER COLUMN
          price
        SET DATA TYPE
          NUMERIC`;
      expect(format(input)).toBe(expected);
    });

    alterCmds.view.concat(alterCmds.materializedView).forEach(alterView => {
      it(`Supports ${alterView} - SET OPTIONS`, () => {
        const input = `
          ${alterView} mydataset.myview
          SET OPTIONS (
            expiration_timestamp=TIMESTAMP_ADD(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
          )`;
        const expected = dedent`
          ${alterView}
            mydataset.myview
          SET OPTIONS
            (
              expiration_timestamp = TIMESTAMP_ADD(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
            )`;
        expect(format(input)).toBe(expected);
      });
    });

    it(`Supports ALTER BI_CAPACITY - SET OPTIONS`, () => {
      const input = `
        ALTER BI_CAPACITY my-project.region-us.default
        SET OPTIONS(
          size_gb = 250
        )`;
      const expected = dedent`
        ALTER BI_CAPACITY
          my-project.region-us.default
        SET OPTIONS
          (size_gb = 250)`;
      expect(format(input)).toBe(expected);
    });
  });

  describe('BigQuery DDL Drop Statements', () => {
    const dropCmds = {
      schema: ['DROP SCHEMA', 'DROP SCHEMA IF EXISTS'],
      table: ['DROP TABLE', 'DROP TABLE IF EXISTS'],
      snapshotTable: ['DROP SNAPSHOT TABLE', 'DROP SNAPSHOT TABLE IF EXISTS'],
      externalTable: ['DROP EXTERNAL TABLE', 'DROP EXTERNAL TABLE IF EXISTS'],
      view: ['DROP VIEW', 'DROP VIEW IF EXISTS'],
      materializedViews: ['DROP MATERIALIZED VIEW', 'DROP MATERIALIZED VIEW IF EXISTS'],
      function: ['DROP FUNCTION', 'DROP FUNCTION IF EXISTS'],
      tableFunction: ['DROP TABLE FUNCTION', 'DROP TABLE FUNCTION IF EXISTS'],
      procedure: ['DROP PROCEDURE', 'DROP PROCEDURE IF EXISTS'],
      reservation: ['DROP RESERVATION', 'DROP RESERVATION IF EXISTS'],
      assignment: ['DROP ASSIGNMENT', 'DROP ASSIGNMENT IF EXISTS'],
    };

    flatKeywordList(dropCmds).forEach(drop => {
      it(`Supports ${drop}`, () => {
        const input = `
          ${drop} mydataset.name`;
        const expected = dedent`
          ${drop}
            mydataset.name`;
        expect(format(input)).toBe(expected);
      });
    });

    it(`Supports DROP SCHEMA - CASCADE`, () => {
      const input = `
        DROP SCHEMA mydataset CASCADE`;
      const expected = dedent`
        DROP SCHEMA
          mydataset CASCADE`;
      expect(format(input)).toBe(expected);
    });

    it(`Supports DROP SCHEMA - RESTRICT`, () => {
      const input = `
        DROP SCHEMA mydataset RESTRICT`;
      const expected = dedent`
        DROP SCHEMA
          mydataset RESTRICT`;
      expect(format(input)).toBe(expected);
    });

    const dropSearchIndices = ['DROP SEARCH INDEX', 'DROP SEARCH INDEX IF EXISTS'];
    dropSearchIndices.forEach(dropSearchIndex => {
      it(`Supports ${dropSearchIndex}`, () => {
        const input = `
          ${dropSearchIndex} index2 ON mydataset.mytable`;
        const expected = dedent`
          ${dropSearchIndex}
            index2 ON mydataset.mytable`;
        expect(format(input)).toBe(expected);
      });
    });

    it(`Supports DROP ROW ACCESS POLICY`, () => {
      const input = `
        DROP mypolicy ON mydataset.mytable`;
      const expected = dedent`
        DROP
          mypolicy ON mydataset.mytable`;
      expect(format(input)).toBe(expected);
    });

    it(`Supports DROP ROW ACCESS POLICY IF EXISTS`, () => {
      const input = `
        DROP IF EXISTS mypolicy ON mydataset.mytable`;
      const expected = dedent`
        DROP IF EXISTS
          mypolicy ON mydataset.mytable`;
      expect(format(input)).toBe(expected);
    });

    it(`Supports DROP ALL ROW ACCESS POLICIES`, () => {
      const input = `
        DROP ALL ROW ACCESS POLICIES ON table_name`;
      const expected = dedent`
        DROP ALL ROW ACCESS POLICIES
          ON table_name`;
      expect(format(input)).toBe(expected);
    });
  });
});
