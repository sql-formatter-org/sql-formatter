import dedent from 'dedent-js';

import { FormatFn } from '../src/sqlFormatter.js';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter.js';

import supportsDropTable from './features/dropTable.js';
import supportsBetween from './features/between.js';
import supportsDeleteFrom from './features/deleteFrom.js';
import supportsComments from './features/comments.js';
import supportsStrings from './features/strings.js';
import supportsIdentifiers from './features/identifiers.js';
import supportsInsertInto from './features/insertInto.js';
import supportsUpdate from './features/update.js';
import supportsTruncateTable from './features/truncateTable.js';

/**
 * Shared tests for MySQL and MariaDB
 */
export default function behavesLikeMariaDbFormatter(format: FormatFn) {
  behavesLikeSqlFormatter(format);
  supportsComments(format, { hashComments: true });
  supportsStrings(format, ["''-qq", "''-bs", '""-qq', '""-bs', "X''"]);
  supportsIdentifiers(format, ['``']);
  supportsDropTable(format, { ifExists: true });
  supportsDeleteFrom(format);
  supportsInsertInto(format, { withoutInto: true });
  supportsUpdate(format);
  supportsTruncateTable(format, { withoutTable: true });
  supportsBetween(format);

  it('allows $ character as part of identifiers', () => {
    expect(format('SELECT $foo, some$$ident')).toBe(dedent`
      SELECT
        $foo,
        some$$ident
    `);
  });

  // regression test for sql-formatter#334
  it('supports identifiers that start with numbers', () => {
    expect(format('SELECT 4four, 12345e, 12e45, $567 FROM tbl')).toBe(
      dedent`
        SELECT
          4four,
          12345e,
          12e45,
          $567
        FROM
          tbl
      `
    );
  });

  // regression test for sql-formatter#651
  it('supports unicode identifiers that start with numbers', () => {
    expect(format('SELECT 1ä FROM tbl')).toBe(
      dedent`
        SELECT
          1ä
        FROM
          tbl
      `
    );
  });

  it('supports @variables', () => {
    expect(format('SELECT @foo, @some_long.var$with$special.chars')).toBe(dedent`
      SELECT
        @foo,
        @some_long.var$with$special.chars
    `);
  });

  it('supports @`name` variables', () => {
    expect(format('SELECT @`baz zaz` FROM tbl;')).toBe(dedent`
      SELECT
        @\`baz zaz\`
      FROM
        tbl;
    `);
  });

  it('supports setting variables: @var :=', () => {
    expect(format('SET @foo := 10;')).toBe(dedent`
      SET
        @foo := 10;
    `);
  });

  it('supports setting variables: @`var` :=', () => {
    expect(format('SET @`foo` := (SELECT * FROM tbl);')).toBe(dedent`
      SET
        @\`foo\` := (
          SELECT
            *
          FROM
            tbl
        );
    `);
  });

  it('supports @@ system variables', () => {
    const result = format('SELECT @@GLOBAL.time, @@SYSTEM.date, @@hour FROM foo;');
    expect(result).toBe(dedent`
      SELECT
        @@GLOBAL.time,
        @@SYSTEM.date,
        @@hour
      FROM
        foo;
    `);
  });

  // Issue #181
  it('does not wrap CHARACTER SET to multiple lines', () => {
    expect(format('ALTER TABLE t MODIFY col1 VARCHAR(50) CHARACTER SET greek')).toBe(dedent`
      ALTER TABLE t
      MODIFY col1 VARCHAR(50) CHARACTER SET greek
    `);
  });

  it('supports REPLACE INTO syntax', () => {
    expect(format(`REPLACE INTO tbl VALUES (1,'Leopard'),(2,'Dog');`)).toBe(dedent`
      REPLACE INTO
        tbl
      VALUES
        (1, 'Leopard'),
        (2, 'Dog');
    `);
  });

  // Issue #605
  it('supports INSERT ... ON DUPLICATE KEY UPDATE', () => {
    expect(
      format(`INSERT INTO customer VALUES ('John','Doe') ON DUPLICATE KEY UPDATE fname='Untitled';`)
    ).toBe(dedent`
      INSERT INTO
        customer
      VALUES
        ('John', 'Doe')
      ON DUPLICATE KEY UPDATE
        fname = 'Untitled';
    `);
  });

  it('supports INSERT ... ON DUPLICATE KEY UPDATE + VALUES() function', () => {
    expect(
      format(`INSERT INTO customer VALUES ('John','Doe') ON DUPLICATE KEY UPDATE col=VALUES(col2);`)
    ).toBe(dedent`
      INSERT INTO
        customer
      VALUES
        ('John', 'Doe')
      ON DUPLICATE KEY UPDATE
        col = VALUES(col2);
    `);
  });

  // Issue #629
  it('uppercases only reserved keywords', () => {
    expect(
      format(
        `create table account (id int comment 'the most important column');
        select * from mysql.user;
        insert into user (id, name) values (1, 'Blah');`,
        { keywordCase: 'upper' }
      )
    ).toBe(dedent`
      CREATE TABLE account (id INT comment 'the most important column');

      SELECT
        *
      FROM
        mysql.user;

      INSERT INTO
        user (id, name)
      VALUES
        (1, 'Blah');
    `);
  });
}
