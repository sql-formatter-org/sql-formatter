import dedent from 'dedent-js';
import * as sqlFormatter from './../src/sqlFormatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

describe('RedshiftFormatter', () => {
  behavesLikeSqlFormatter('redshift');

  it('formats LIMIT', () => {
    expect(
      sqlFormatter.format('SELECT col1 FROM tbl ORDER BY col2 DESC LIMIT 10;', {
        language: 'pl/sql',
      })
    ).toBe(dedent`
      SELECT
        col1
      FROM
        tbl
      ORDER BY
        col2 DESC
      LIMIT
        10;
    `);
  });

  it('formats only -- as a line comment', () => {
    const result = sqlFormatter.format(
      `
      SELECT col FROM
      -- This is a comment
      MyTable;
      `,
      { language: 'redshift' }
    );
    expect(result).toBe(dedent`
      SELECT
        col
      FROM
        -- This is a comment
        MyTable;
    `);
  });

  it('recognizes @ as part of identifiers', () => {
    const result = sqlFormatter.format('SELECT @col1 FROM tbl', {
      language: 'pl/sql',
    });
    expect(result).toBe(dedent`
      SELECT
        @col1
      FROM
        tbl
    `);
  });

  it('formats short CREATE TABLE', () => {
    expect(sqlFormatter.format('CREATE TABLE items (a INT, b TEXT);')).toBe(
      'CREATE TABLE items (a INT, b TEXT);'
    );
  });

  it.skip('formats long CREATE TABLE', () => {
    expect(
      sqlFormatter.format(
        'CREATE TABLE items (a INT PRIMARY KEY, b TEXT, c INT NOT NULL, d INT NOT NULL) DISTKEY(created_at) SORTKEY(created_at);',
        { language: 'redshift' }
      )
    ).toBe(dedent`
      CREATE TABLE items (
        a INT PRIMARY KEY,
        b TEXT,
        c INT NOT NULL,
        d INT NOT NULL
      )
      DISTKEY(created_at)
      SORTKEY(created_at);
    `);
  });

  it('formats COPY', () => {
    expect(
      sqlFormatter.format(
        `
        COPY schema.table
        FROM 's3://bucket/file.csv'
        IAM_ROLE 'arn:aws:iam::123456789:role/rolename'
        FORMAT AS CSV DELIMITER ',' QUOTE '"'
        REGION AS 'us-east-1'
        `,
        { language: 'redshift' }
      )
    ).toBe(dedent`
      COPY
        schema.table
      FROM
        's3://bucket/file.csv'
      IAM_ROLE
        'arn:aws:iam::123456789:role/rolename'
      FORMAT
        AS CSV
      DELIMITER
        ',' QUOTE '"'
      REGION
        AS 'us-east-1'
    `);
  });
});
