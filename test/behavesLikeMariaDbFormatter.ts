import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsDropTable from './features/dropTable';
import supportsAlterTable from './features/alterTable';
import supportsBetween from './features/between';
import supportsConstraints from './features/constraints';
import supportsDeleteFrom from './features/deleteFrom';
import supportsComments from './features/comments';
import supportsStrings from './features/strings';
import supportsIdentifiers from './features/identifiers';
import supportsParams from './options/param';
import supportsInsertInto from './features/insertInto';
import supportsUpdate from './features/update';
import supportsTruncateTable from './features/truncateTable';
import supportsCreateView from './features/createView';

/**
 * Shared tests for MySQL and MariaDB
 */
export default function behavesLikeMariaDbFormatter(format: FormatFn) {
  behavesLikeSqlFormatter(format);
  supportsComments(format, { hashComments: true });
  supportsStrings(format, ["''", '""', "X''"]);
  supportsIdentifiers(format, ['``']);
  supportsCreateView(format, { orReplace: true });
  supportsDropTable(format, { ifExists: true });
  supportsConstraints(format);
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
    alterColumn: true,
    modify: true,
    renameTo: true,
    renameColumn: true,
  });
  supportsDeleteFrom(format);
  supportsInsertInto(format, { withoutInto: true });
  supportsUpdate(format);
  supportsTruncateTable(format, { withoutTable: true });
  supportsBetween(format);
  supportsParams(format, { positional: true });

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

  it('supports @variables', () => {
    expect(format('SELECT @foo, @some_long.var$with$special.chars')).toBe(dedent`
      SELECT
        @foo,
        @some_long.var$with$special.chars
    `);
  });

  it('supports setting variables: @var :=', () => {
    expect(format('SET @foo := 10;')).toBe(dedent`
      SET
        @foo := 10;
    `);
  });

  it('supports @"name", @\'name\', @`name` variables', () => {
    expect(format(`SELECT @"foo fo", @'bar ar', @\`baz zaz\` FROM tbl;`)).toBe(dedent`
      SELECT
        @"foo fo",
        @'bar ar',
        @\`baz zaz\`
      FROM
        tbl;
    `);
  });

  it('supports setting variables: @"var" :=', () => {
    expect(format('SET @"foo" := (SELECT * FROM tbl);')).toBe(dedent`
      SET
        @"foo" := (
          SELECT
            *
          FROM
            tbl
        );
    `);
  });

  // Issue #181
  it('does not wrap CHARACTER SET to multiple lines', () => {
    expect(format('ALTER TABLE t MODIFY col1 VARCHAR(50) CHARACTER SET greek')).toBe(dedent`
      ALTER TABLE
        t
      MODIFY
        col1 VARCHAR(50) CHARACTER SET greek
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
}
