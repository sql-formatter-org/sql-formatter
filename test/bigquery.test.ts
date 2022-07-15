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

  behavesLikeSqlFormatter(format, language);
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
      'CREATE OR REPLACE TABLE',
    ];
    const createTempTableVariations = [
      'CREATE TEMP TABLE',
      'CREATE TEMP TABLE IF NOT EXISTS',
      'CREATE TEMPORARY TABLE',
      'CREATE TEMPORARY TABLE IF NOT EXISTS',
      'CREATE OR REPLACE TEMP TABLE',
      'CREATE OR REPLACE TEMPORARY TABLE',
    ];

    createTableVariations.concat(createTempTableVariations).forEach((createTable: string) => {
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

    createTableVariations.forEach(createTable => {
      it(`Supports ${createTable} LIKE`, () => {
        const input = `
          ${createTable} mydataset.newtable
          LIKE mydataset.sourcetable
          AS (SELECT * FROM mydataset.myothertable)`;
        const expected = dedent`
          ${createTable}
            mydataset.newtable LIKE mydataset.sourcetable AS (
              SELECT
                *
              FROM
                mydataset.myothertable
            )`;

        expect(format(input)).toBe(expected);
      });
    });

    createTableVariations.forEach(createTable => {
      it(`Supports ${createTable} COPY`, () => {
        const input = `
          ${createTable} mydataset.newtable
          COPY mydataset.sourcetable`;
        const expected = dedent`
          ${createTable}
            mydataset.newtable
          COPY
            mydataset.sourcetable`;

        expect(format(input)).toBe(expected);
      });
    });

    createTableVariations.forEach(createTable => {
      it(`Supports ${createTable} CLONE`, () => {
        const input = `
          ${createTable} mydataset.newtable
          CLONE mydataset.sourcetable`;
        const expected = dedent`
          ${createTable}
            mydataset.newtable
          CLONE
            mydataset.sourcetable`;

        expect(format(input)).toBe(expected);
      });
    });

    const createSnapTableVariations = [
      'CREATE SNAPSHOT TABLE',
      'CREATE SNAPSHOT TABLE IF NOT EXISTS',
    ];
    createSnapTableVariations.forEach(createSnap => {
      it(`Supports ${createSnap}`, () => {
        const input = `
          ${createSnap} mydataset.mytablesnapshot
          CLONE mydataset.mytable`;
        const expected = dedent`
          ${createSnap}
            mydataset.mytablesnapshot
          CLONE
            mydataset.mytable`;

        expect(format(input)).toBe(expected);
      });
    });

    const createViewVariations = [
      'CREATE VIEW',
      'CREATE OR REPLACE VIEW',
      'CREATE VIEW IF NOT EXISTS',
    ];
    const createMaterializedView = [
      'CREATE MATERIALIZED VIEW',
      'CREATE OR REPLACE MATERIALIZED VIEW',
      'CREATE MATERIALIZED VIEW IF NOT EXISTS',
    ];

    createViewVariations.concat(createMaterializedView).forEach(createView => {
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

    const createExternalTableVariations = [
      'CREATE EXTERNAL TABLE',
      'CREATE OR REPLACE EXTERNAL TABLE',
      'CREATE EXTERNAL TABLE IF NOT EXISTS',
    ];
    createExternalTableVariations.forEach(createTable => {
      it(`Supports ${createTable}`, () => {
        const input = `
          ${createTable} dataset.CsvTable
          WITH PARTITION COLUMNS (
            field_1 STRING,
            field_2 INT64
          )
          OPTIONS(
            format = 'CSV',
            uris = ['gs://bucket/path1.csv']
          )`;
        const expected = dedent`
          ${createTable}
            dataset.CsvTable
          WITH PARTITION COLUMNS
            (field_1 STRING, field_2 INT64) OPTIONS(format = 'CSV', uris = ['gs://bucket/path1.csv'])`;
        expect(format(input)).toBe(expected);
      });
    });

    const createFunctions = [
      'CREATE FUNCTION',
      'CREATE OR REPLACE FUNCTION',
      'CREATE FUNCTION IF NOT EXISTS',
    ];
    const createTempFunctions = [
      'CREATE TEMP FUNCTION',
      'CREATE OR REPLACE TEMP FUNCTION',
      'CREATE TEMP FUNCTION IF NOT EXISTS',
      'CREATE TEMPORARY FUNCTION',
      'CREATE OR REPLACE TEMPORARY FUNCTION',
      'CREATE TEMPORARY FUNCTION IF NOT EXISTS',
    ];

    createFunctions.concat(createTempFunctions).forEach(createFunction => {
      it(`Supports ${createFunction}`, () => {
        const input = `
          ${createFunction} mydataset.myFunc(x FLOAT64, y FLOAT64)
          RETURNS FLOAT64
          AS (x * y);`;
        const expected = dedent`
          ${createFunction}
            mydataset.myFunc(x FLOAT64, y FLOAT64) RETURNS FLOAT64 AS (x * y);`;
        expect(format(input)).toBe(expected);
        expect(format(input, { aliasAs: 'always' })).toBe(expected);
      });

      // it shouldn't format the js code
      it(`Supports ${createFunction} - js`, () => {
        const input = `
          ${createFunction} myFunc(x FLOAT64, y FLOAT64)
          RETURNS FLOAT64
          LANGUAGE js
          AS r"""
            return x*y;
          """;`;
        const expected = dedent`
          ${createFunction}
            myFunc(x FLOAT64, y FLOAT64) RETURNS FLOAT64 LANGUAGE js AS r"""
                      return x*y;
                    """;`;
        expect(format(input)).toBe(expected);
      });
    });

    const createTableFuncVariations = [
      'CREATE TABLE FUNCTION',
      'CREATE OR REPLACE TABLE FUNCTION',
      'CREATE TABLE FUNCTION IF NOT EXISTS',
    ];
    createTableFuncVariations.forEach(createTableFunc => {
      it(`Supports ${createTableFunc}`, () => {
        const input = `
          ${createTableFunc} mydataset.names_by_year(y INT64)
          RETURNS TABLE<name STRING, year INT64>
          AS (
            SELECT year, name
            FROM mydataset.mytable
            WHERE year = y
          )`;
        const expected = dedent`
          ${createTableFunc}
            mydataset.names_by_year(y INT64)
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
    const createProcedureVariations = [
      'CREATE PROCEDURE',
      'CREATE OR REPLACE PROCEDURE',
      'CREATE PROCEDURE IF NOT EXISTS',
    ];
    createProcedureVariations.forEach(createProcedure => {
      it(`Supports ${createProcedure}`, () => {
        const input = `
          ${createProcedure} myDataset.QueryTable()
          BEGIN
            SELECT * FROM anotherDataset.myTable;
          END;`;
        const expected = dedent`
          ${createProcedure}
            myDataset.QueryTable()
          BEGIN
          SELECT
            *
          FROM
            anotherDataset.myTable;

          END;`;
        expect(format(input)).toBe(expected);
      });
    });

    const createRowAccessPolicies = [
      'CREATE ROW ACCESS POLICY',
      'CREATE ROW ACCESS POLICY IF NOT EXISTS',
      'CREATE OR REPLACE ROW ACCESS POLICY',
    ];
    createRowAccessPolicies.forEach(createRowAccessPolicy => {
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

    // it shouldn't format json here
    it(`Supports CREATE CAPACITY`, () => {
      const input = `
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

    // it shouldn't format json here
    it(`Supports CREATE RESERVATION`, () => {
      const input = `
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

    // it shouldn't format json here
    it(`Supports CREATE ASSIGNMENT`, () => {
      const input = `
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

    const createSearchIndices = ['CREATE SEARCH INDEX', 'CREATE SEARCH INDEX IF NOT EXISTS'];
    createSearchIndices.forEach(createSearchIndex => {
      it(`Supports ${createSearchIndex}`, () => {
        const input = `
          ${createSearchIndex} my_index
          ON dataset.my_table(ALL COLUMNS);`;
        const expected = dedent`
          ${createSearchIndex}
            my_index ON dataset.my_table(ALL COLUMNS);`;
        expect(format(input)).toBe(expected);
      });
    });
  });

  describe('BigQuery DDL Alter Statements', () => {
    const alterSchemas = ['ALTER SCHEMA', 'ALTER SCHEMA IF EXISTS'];
    alterSchemas.forEach(alterSchema => {
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

    alterSchemas.forEach(alterSchema => {
      it(`Supports ${alterSchema} - SET OPTIONS`, () => {
        const input = `
          ${alterSchema} mydataset
          SET OPTIONS(
            default_table_expiration_days=3.75
            )`;
        const expected = dedent`
          ${alterSchema}
            mydataset
          SET OPTIONS
            (default_table_expiration_days = 3.75)`;
        expect(format(input)).toBe(expected);
      });
    });

    const alterTables = ['ALTER TABLE', 'ALTER TABLE IF EXISTS'];
    const alterColumns = ['ALTER COLUMN', 'ALTER COLUMN IF EXISTS'];
    alterTables.forEach(alterTable => {
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

      it(`Supports ${alterTable} - ADD COLUMN`, () => {
        const input = `
          ${alterTable} mydataset.mytable
          ADD COLUMN col1 STRING,
          ADD COLUMN IF NOT EXISTS col2 GEOGRAPHY`;
        const expected = dedent`
          ${alterTable}
            mydataset.mytable
          ADD COLUMN
            col1 STRING,
          ADD COLUMN IF NOT EXISTS
            col2 GEOGRAPHY`;
        expect(format(input)).toBe(expected);
      });

      it(`Supports ${alterTable} - RENAME TO`, () => {
        const input = `
          ${alterTable} mydataset.mytable RENAME TO mynewtable`;
        const expected = dedent`
          ${alterTable}
            mydataset.mytable
          RENAME TO
            mynewtable`;
        expect(format(input)).toBe(expected);
      });

      it(`Supports ${alterTable} - DROP COLUMN`, () => {
        const input = `
          ${alterTable} mydataset.mytable
          DROP COLUMN col1,
          DROP COLUMN IF EXISTS col2`;
        const expected = dedent`
          ${alterTable}
            mydataset.mytable
          DROP COLUMN
            col1,
          DROP COLUMN IF EXISTS
            col2`;
        expect(format(input)).toBe(expected);
      });

      it(`Supports ${alterTable} - SET DEFAULT COLLATE`, () => {
        const input = `
          ${alterTable} mydataset.mytable
          SET DEFAULT COLLATE 'und:ci'`;
        const expected = dedent`
          ${alterTable}
            mydataset.mytable
          SET DEFAULT COLLATE
            'und:ci'`;
        expect(format(input)).toBe(expected);
      });

      alterColumns.forEach(alterColumn => {
        it(`Supports ${alterTable} - ${alterColumn} - SET OPTIONS`, () => {
          const input = `
            ${alterTable} mydataset.mytable
            ${alterColumn} price
            SET OPTIONS (
              description="Price per unit"
            )`;
          const expected = dedent`
            ${alterTable}
              mydataset.mytable
            ${alterColumn}
              price
            SET OPTIONS
              (description = "Price per unit")`;
          expect(format(input)).toBe(expected);
        });

        it(`Supports ${alterTable} - ${alterColumn} - DROP NOT NULL`, () => {
          const input = `
            ${alterTable} mydataset.mytable
            ${alterColumn} price
            DROP NOT NULL`;
          const expected = dedent`
            ${alterTable}
              mydataset.mytable
            ${alterColumn}
              price
            DROP NOT NULL`;
          expect(format(input)).toBe(expected);
        });

        it(`Supports ${alterTable} - ${alterColumn} - SET DATA TYPE`, () => {
          const input = `
            ${alterTable} mydataset.mytable
            ${alterColumn} price
            SET DATA TYPE NUMERIC`;
          const expected = dedent`
            ${alterTable}
              mydataset.mytable
            ${alterColumn}
              price
            SET DATA TYPE
              NUMERIC`;
          expect(format(input)).toBe(expected);
        });
      });
    });

    const alterViews = ['ALTER VIEW', 'ALTER VIEW IF EXISTS'];
    const alterMaterializedViews = ['ALTER MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW IF EXISTS'];
    alterViews.concat(alterMaterializedViews).forEach(alterView => {
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
    const dropSchemas = ['DROP SCHEMA', 'DROP SCHEMA IF EXISTS'];
    dropSchemas.forEach(dropSchema => {
      it(`Supports ${dropSchema}`, () => {
        const testSqls = [
          {
            input: `${dropSchema} mydataset`,
            expected: dedent`
              ${dropSchema}
                mydataset`,
          },
          {
            input: `${dropSchema} mydataset CASCADE`,
            expected: dedent`
              ${dropSchema}
                mydataset CASCADE`,
          },
          {
            input: `${dropSchema} mydataset RESTRICT`,
            expected: dedent`
              ${dropSchema}
                mydataset RESTRICT`,
          },
        ];

        testSqls.forEach(testSql => expect(format(testSql.input)).toBe(testSql.expected));
      });
    });

    const dropTables = ['DROP TABLE', 'DROP TABLE IF EXISTS'];
    const dropSnapTables = ['DROP SNAPSHOT TABLE', 'DROP SNAPSHOT TABLE IF EXISTS'];
    const dropExternalTables = ['DROP EXTERNAL TABLE', 'DROP EXTERNAL TABLE IF EXISTS'];
    const dropViews = ['DROP VIEW', 'DROP VIEW IF EXISTS'];
    const dropMaterializedViews = ['DROP MATERIALIZED VIEW', 'DROP MATERIALIZED VIEW IF EXISTS'];
    const dropFuncs = ['DROP FUNCTION', 'DROP FUNCTION IF EXISTS'];
    const dropTableFuncs = ['DROP TABLE FUNCTION', 'DROP TABLE FUNCTION IF EXISTS'];
    const dropProcedures = ['DROP PROCEDURE', 'DROP PROCEDURE IF EXISTS'];
    const dropReservation = ['DROP RESERVATION', 'DROP RESERVATION IF EXISTS'];
    const dropAssignment = ['DROP ASSIGNMENT', 'DROP ASSIGNMENT IF EXISTS'];

    dropTables
      .concat(dropSnapTables)
      .concat(dropExternalTables)
      .concat(dropViews)
      .concat(dropMaterializedViews)
      .concat(dropFuncs)
      .concat(dropTableFuncs)
      .concat(dropProcedures)
      .concat(dropReservation)
      .concat(dropAssignment)
      .forEach(drop => {
        it(`Supports ${drop}`, () => {
          const input = `
            ${drop} mydataset.name`;
          const expected = dedent`
            ${drop}
              mydataset.name`;
          expect(format(input)).toBe(expected);
        });
      });

    const dropSearchIndices = ['DROP SEARCH INDEX', 'DROP SEARCH INDEX IF EXISTS'];
    dropSearchIndices.forEach(drop => {
      it(`Supports ${drop}`, () => {
        const input = `
          ${drop} index2 ON mydataset.mytable`;
        const expected = dedent`
          ${drop}
            index2 ON mydataset.mytable`;
        expect(format(input)).toBe(expected);
      });
    });

    it(`Supports DROP ROW ACCESS POLICY`, () => {
      const testSqls = [
        {
          input: `DROP mypolicy ON mydataset.mytable`,
          expected: dedent`
            DROP
              mypolicy ON mydataset.mytable`,
        },
        {
          input: `DROP IF EXISTS mypolicy ON mydataset.mytable`,
          expected: dedent`
            DROP IF EXISTS
              mypolicy ON mydataset.mytable`,
        },
        {
          input: `DROP ALL ROW ACCESS POLICIES ON table_name`,
          expected: dedent`
            DROP ALL ROW ACCESS POLICIES
              ON table_name`,
        },
      ];

      testSqls.forEach(testSql => expect(format(testSql.input)).toBe(testSql.expected));
    });
  });
});
