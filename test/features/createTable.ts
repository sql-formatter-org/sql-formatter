import dedent from 'dedent-js';

import { FormatFn } from '../../src/sqlFormatter.js';

interface CreateTableConfig {
  orReplace?: boolean;
  ifNotExists?: boolean;
  columnComment?: boolean;
  tableComment?: boolean;
  /**
   * True when the dialect parses table-level constraints (CONSTRAINT name
   * UNIQUE (...), PRIMARY KEY (...), FOREIGN KEY (...) REFERENCES ...,
   * CHECK (...)) as keyword-led expressions. When false, the dialect may
   * parse these as identifier-led function calls (e.g. BigQuery parses
   * UNIQUE (col) as a function call to a UNIQUE function), which produces
   * different spacing in the output. We only run the constraint-related
   * alignment test when this is true.
   */
  tableConstraints?: boolean;
}

export default function supportsCreateTable(format: FormatFn, cfg: CreateTableConfig = {}) {
  it('formats short CREATE TABLE', () => {
    expect(format('CREATE TABLE tbl (a INT PRIMARY KEY, b TEXT);')).toBe(dedent`
      CREATE TABLE tbl (a INT PRIMARY KEY, b TEXT);
    `);
  });

  // The decision to place it to multiple lines is made based on the length of text inside braces
  // ignoring the whitespace. (Which is not quite right :P)
  it('formats long CREATE TABLE', () => {
    expect(
      format('CREATE TABLE tbl (a INT PRIMARY KEY, b TEXT, c INT NOT NULL, doggie INT NOT NULL);')
    ).toBe(dedent`
      CREATE TABLE tbl (
        a INT PRIMARY KEY,
        b TEXT,
        c INT NOT NULL,
        doggie INT NOT NULL
      );
    `);
  });

  if (cfg.orReplace) {
    it('formats short CREATE OR REPLACE TABLE', () => {
      expect(format('CREATE OR REPLACE TABLE tbl (a INT PRIMARY KEY, b TEXT);')).toBe(dedent`
        CREATE OR REPLACE TABLE tbl (a INT PRIMARY KEY, b TEXT);
      `);
    });
  }

  if (cfg.ifNotExists) {
    it('formats short CREATE TABLE IF NOT EXISTS', () => {
      expect(format('CREATE TABLE IF NOT EXISTS tbl (a INT PRIMARY KEY, b TEXT);')).toBe(dedent`
        CREATE TABLE IF NOT EXISTS tbl (a INT PRIMARY KEY, b TEXT);
      `);
    });
  }

  if (cfg.columnComment) {
    it('formats short CREATE TABLE with column comments', () => {
      expect(
        format(`CREATE TABLE tbl (a INT COMMENT 'Hello world!', b TEXT COMMENT 'Here we are!');`)
      ).toBe(dedent`
        CREATE TABLE tbl (
          a INT COMMENT 'Hello world!',
          b TEXT COMMENT 'Here we are!'
        );
      `);
    });
  }

  if (cfg.tableComment) {
    it('formats short CREATE TABLE with comment', () => {
      expect(format(`CREATE TABLE tbl (a INT, b TEXT) COMMENT = 'Hello, world!';`)).toBe(dedent`
        CREATE TABLE tbl (a INT, b TEXT) COMMENT = 'Hello, world!';
      `);
    });
  }

  it('correctly indents CREATE TABLE in tabular style', () => {
    expect(
      format(
        `CREATE TABLE foo (
          id INT PRIMARY KEY NOT NULL,
          fname VARCHAR NOT NULL
        );`,
        { indentStyle: 'tabularLeft' }
      )
    ).toBe(dedent`
      CREATE    TABLE foo (
                id INT PRIMARY KEY NOT NULL,
                fname VARCHAR NOT NULL
                );
    `);
  });

  // ---------- createTableColumnAlignment option ----------
  //
  // When createTableColumnAlignment is enabled, each column definition inside
  // a CREATE TABLE column list is laid out in three left-aligned columns:
  //
  //   <col_name> <col_def> <other...>
  //
  // where col_name is the column identifier, col_def is the data type (which
  // may be parameterized, e.g. VARCHAR(100)), and "other" is everything else
  // (NOT NULL, PRIMARY KEY, DEFAULT, COMMENT, ...). All three columns are
  // padded to the maximum width of their respective column across all
  // column-definition entries, so the starts of the columns line up across
  // rows.
  //
  // Table-level constraints (PRIMARY KEY (...), FOREIGN KEY (...),
  // CONSTRAINT ...) do not have a column name / data type pattern, so they
  // are emitted on their own line without padding.
  describe('createTableColumnAlignment', () => {
    it('aligns columns when option is enabled', () => {
      expect(
        format(
          'CREATE TABLE tbl (a INT PRIMARY KEY, b TEXT, c INT NOT NULL, doggie INT NOT NULL);',
          { createTableColumnAlignment: true }
        )
      ).toBe(dedent`
        CREATE TABLE tbl (
          a      INT  PRIMARY KEY,
          b      TEXT,
          c      INT  NOT NULL,
          doggie INT  NOT NULL
        );
      `);
    });

    it('is a no-op when option is disabled (default behavior preserved)', () => {
      expect(
        format('CREATE TABLE tbl (a INT PRIMARY KEY, b TEXT, c INT NOT NULL, doggie INT NOT NULL);')
      ).toBe(dedent`
        CREATE TABLE tbl (
          a INT PRIMARY KEY,
          b TEXT,
          c INT NOT NULL,
          doggie INT NOT NULL
        );
      `);
    });

    it('aligns parameterized data types like VARCHAR(100)', () => {
      expect(
        format(
          `CREATE TABLE users (
            id INT PRIMARY KEY NOT NULL,
            name VARCHAR(100) NOT NULL,
            age INT,
            email VARCHAR(255) UNIQUE
          );`,
          { createTableColumnAlignment: true }
        )
      ).toBe(dedent`
        CREATE TABLE users (
          id    INT          PRIMARY KEY NOT NULL,
          name  VARCHAR(100) NOT NULL,
          age   INT,
          email VARCHAR(255) UNIQUE
        );
      `);
    });

    if (cfg.tableConstraints) {
      it('leaves table-level constraints on their own line without padding', () => {
        expect(
          format(
            `CREATE TABLE users (
              id INT PRIMARY KEY,
              name VARCHAR(100),
              CONSTRAINT uc_email UNIQUE (name)
            );`,
            { createTableColumnAlignment: true }
          )
        ).toBe(dedent`
          CREATE TABLE users (
            id   INT          PRIMARY KEY,
            name VARCHAR(100),
            CONSTRAINT uc_email UNIQUE (name)
          );
        `);
      });
    }

    it('keeps short CREATE TABLE on a single line', () => {
      expect(
        format('CREATE TABLE tbl (a INT PRIMARY KEY, b TEXT);', {
          createTableColumnAlignment: true,
        })
      ).toBe(dedent`
        CREATE TABLE tbl (a INT PRIMARY KEY, b TEXT);
      `);
    });

    if (cfg.orReplace) {
      it('aligns CREATE OR REPLACE TABLE', () => {
        expect(
          format(
            'CREATE OR REPLACE TABLE tbl (a INT PRIMARY KEY, b VARCHAR(20) NOT NULL, c INT NOT NULL);',
            { createTableColumnAlignment: true }
          )
        ).toBe(dedent`
          CREATE OR REPLACE TABLE tbl (
            a INT         PRIMARY KEY,
            b VARCHAR(20) NOT NULL,
            c INT         NOT NULL
          );
        `);
      });
    }

    if (cfg.ifNotExists) {
      it('aligns CREATE TABLE IF NOT EXISTS', () => {
        expect(
          format(
            'CREATE TABLE IF NOT EXISTS tbl (a INT PRIMARY KEY, b VARCHAR(20) NOT NULL, c INT NOT NULL);',
            { createTableColumnAlignment: true }
          )
        ).toBe(dedent`
          CREATE TABLE IF NOT EXISTS tbl (
            a INT         PRIMARY KEY,
            b VARCHAR(20) NOT NULL,
            c INT         NOT NULL
          );
        `);
      });
    }

    // ---------- createTableColumnAlignment_breakwidth option ----------
    //
    // When the "other" part of a column entry (constraints, comments,
    // defaults, ...) exceeds this width, it is wrapped onto a new
    // continuation line indented to align with the start of the third
    // column. Defaults to Infinity (never wrap).
    describe('createTableColumnAlignment_breakwidth', () => {
      it('defaults to Infinity (never wraps)', () => {
        // Even a very long "other" part stays on one line.
        expect(
          format(
            'CREATE TABLE tbl (a INT NOT NULL DEFAULT 1 COMMENT "a very long comment that exceeds the default expression width", b INT NOT NULL DEFAULT 1);',
            { createTableColumnAlignment: true }
          )
        ).toBe(dedent`
          CREATE TABLE tbl (
            a INT NOT NULL DEFAULT 1 COMMENT "a very long comment that exceeds the default expression width",
            b INT NOT NULL DEFAULT 1
          );
        `);
      });

      it('wraps "other" to a new line when it exceeds the configured width', () => {
        // breakwidth=30 -> the long "other" of column `a` wraps; the short
        // "other" of column `b` does not.
        //
        // The continuation line is indented to align with the start of the
        // third column. With maxColName=1 ("a"), maxColDef=3 ("INT") and a
        // 2-space block indent, that's 2 + 1 + 1 + 3 + 1 = 8 spaces.
        expect(
          format(
            'CREATE TABLE tbl (a INT NOT NULL DEFAULT 1 COMMENT "a very long comment that exceeds the default expression width", b INT NOT NULL DEFAULT 1);',
            { createTableColumnAlignment: true, createTableColumnAlignment_breakwidth: 30 }
          )
        ).toBe(dedent`
          CREATE TABLE tbl (
            a INT
                  NOT NULL DEFAULT 1 COMMENT "a very long comment that exceeds the default expression width",
            b INT NOT NULL DEFAULT 1
          );
        `);
      });

      it('set to 0 to always wrap "other" to a new line', () => {
        // Use a SQL long enough to force the column list onto multiple lines
        // even without breakwidth, so we can see the wrap behavior.
        expect(
          format(
            'CREATE TABLE tbl (a INT NOT NULL DEFAULT 1, b INT NOT NULL DEFAULT 2, c INT NOT NULL DEFAULT 3);',
            { createTableColumnAlignment: true, createTableColumnAlignment_breakwidth: 0 }
          )
        ).toBe(dedent`
          CREATE TABLE tbl (
            a INT
                  NOT NULL DEFAULT 1,
            b INT
                  NOT NULL DEFAULT 2,
            c INT
                  NOT NULL DEFAULT 3
          );
        `);
      });

      it('is ignored when createTableColumnAlignment is disabled', () => {
        // breakwidth has no effect when alignment is off.
        expect(
          format(
            'CREATE TABLE tbl (a INT PRIMARY KEY, b TEXT, c INT NOT NULL, doggie INT NOT NULL);',
            {
              createTableColumnAlignment: false,
              createTableColumnAlignment_breakwidth: 0,
            }
          )
        ).toBe(dedent`
          CREATE TABLE tbl (
            a INT PRIMARY KEY,
            b TEXT,
            c INT NOT NULL,
            doggie INT NOT NULL
          );
        `);
      });
    });
  });
}
