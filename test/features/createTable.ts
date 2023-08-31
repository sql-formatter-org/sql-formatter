import dedent from 'dedent-js';

import { FormatFn } from '../../src/sqlFormatter.js';

interface CreateTableConfig {
  orReplace?: boolean;
  ifNotExists?: boolean;
  columnComment?: boolean;
  tableComment?: boolean;
}

export default function supportsCreateTable(
  format: FormatFn,
  { orReplace, ifNotExists, columnComment, tableComment }: CreateTableConfig = {}
) {
  it('formats short CREATE TABLE', () => {
    expect(format('CREATE TABLE tbl (a INT PRIMARY KEY, b TEXT);')).toBe(dedent`
      CREATE TABLE
        tbl (a INT PRIMARY KEY, b TEXT);
    `);
  });

  // The decision to place it to multiple lines is made based on the length of text inside braces
  // ignoring the whitespace. (Which is not quite right :P)
  it('formats long CREATE TABLE', () => {
    expect(
      format('CREATE TABLE tbl (a INT PRIMARY KEY, b TEXT, c INT NOT NULL, doggie INT NOT NULL);')
    ).toBe(dedent`
      CREATE TABLE
        tbl (
          a INT PRIMARY KEY,
          b TEXT,
          c INT NOT NULL,
          doggie INT NOT NULL
        );
    `);
  });

  if (orReplace) {
    it('formats short CREATE OR REPLACE TABLE', () => {
      expect(format('CREATE OR REPLACE TABLE tbl (a INT PRIMARY KEY, b TEXT);')).toBe(dedent`
        CREATE OR REPLACE TABLE
          tbl (a INT PRIMARY KEY, b TEXT);
      `);
    });
  }

  if (ifNotExists) {
    it('formats short CREATE TABLE IF NOT EXISTS', () => {
      expect(format('CREATE TABLE IF NOT EXISTS tbl (a INT PRIMARY KEY, b TEXT);')).toBe(dedent`
        CREATE TABLE IF NOT EXISTS
          tbl (a INT PRIMARY KEY, b TEXT);
      `);
    });
  }

  if (columnComment) {
    it('formats short CREATE TABLE with column comments', () => {
      expect(
        format(`CREATE TABLE tbl (a INT COMMENT 'Hello world!', b TEXT COMMENT 'Here we are!');`)
      ).toBe(dedent`
        CREATE TABLE
          tbl (
            a INT COMMENT 'Hello world!',
            b TEXT COMMENT 'Here we are!'
          );
      `);
    });
  }

  if (tableComment) {
    it('formats short CREATE TABLE with comment', () => {
      expect(format(`CREATE TABLE tbl (a INT, b TEXT) COMMENT = 'Hello, world!';`)).toBe(dedent`
        CREATE TABLE
          tbl (a INT, b TEXT) COMMENT = 'Hello, world!';
      `);
    });
  }
}
