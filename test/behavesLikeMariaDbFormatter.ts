import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsCreateTable from './features/createTable';
import supportsAlterTable from './features/alterTable';
import supportsBetween from './features/between';
import supportsJoin from './features/join';
import supportsConstraints from './features/constraints';
import supportsDeleteFrom from './features/deleteFrom';
import supportsComments from './features/comments';
import supportsStrings from './features/strings';
import supportsIdentifiers from './features/identifiers';
import supportsParams from './options/param';

/**
 * Shared tests for MySQL and MariaDB
 */
export default function behavesLikeMariaDbFormatter(format: FormatFn) {
  behavesLikeSqlFormatter(format);
  supportsComments(format, { hashComments: true });
  supportsStrings(format, ["''", '""', "X''"]);
  supportsIdentifiers(format, ['``']);
  supportsCreateTable(format);
  supportsConstraints(format);
  supportsAlterTable(format);
  supportsDeleteFrom(format);
  supportsBetween(format);
  supportsJoin(format, {
    without: ['FULL'],
    additionally: [
      'STRAIGHT_JOIN',
      'NATURAL LEFT JOIN',
      'NATURAL LEFT OUTER JOIN',
      'NATURAL RIGHT JOIN',
      'NATURAL RIGHT OUTER JOIN',
    ],
  });
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
    expect(format('SELECT 4four FROM tbl')).toBe(
      dedent`
        SELECT
          4four
        FROM
          tbl
      `
    );
    expect(format('SELECT 1, two, 3four FROM tbl')).toBe(
      dedent`
        SELECT
          1,
          two,
          3four
        FROM
          tbl
      `
    );
    expect(format('SELECT one + 2three, 4 + 5six FROM tbl')).toBe(
      dedent`
        SELECT
          one + 2three,
          4 + 5six
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
        t MODIFY col1 VARCHAR(50) CHARACTER SET greek
    `);
  });
}
