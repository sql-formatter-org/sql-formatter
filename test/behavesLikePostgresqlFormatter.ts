import dedent from 'dedent-js';
import { FormatFn } from '../src/sqlFormatter.js';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter.js';
import supportsComments from './features/comments.js';
import supportsCommentOn from './features/commentOn.js';
import supportsArrayAndMapAccessors from './features/arrayAndMapAccessors.js';
import supportsAlterTable from './features/alterTable.js';
import supportsDeleteFrom from './features/deleteFrom.js';
import supportsInsertInto from './features/insertInto.js';
import supportsOnConflict from './features/onConflict.js';
import supportsBetween from './features/between.js';
import supportsIsDistinctFrom from './features/isDistinctFrom.js';
import supportsReturning from './features/returning.js';
import supportsWindow from './features/window.js';
import supportsDataTypeCase from './options/dataTypeCase.js';

/**
 * Shared tests for PostgreSQL and DuckDB
 */
export default function behavesLikePostgresqlFormatter(format: FormatFn) {
  behavesLikeSqlFormatter(format);
  supportsComments(format, { nestedBlockComments: true });
  supportsCommentOn(format);
  supportsArrayAndMapAccessors(format);
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
    renameTo: true,
    renameColumn: true,
  });
  supportsDeleteFrom(format);
  supportsInsertInto(format);
  supportsOnConflict(format);
  supportsBetween(format);
  supportsIsDistinctFrom(format);
  supportsReturning(format);
  supportsWindow(format);
  supportsDataTypeCase(format);

  it('allows $ character as part of identifiers', () => {
    expect(format('SELECT foo$, some$$ident')).toBe(dedent`
      SELECT
        foo$,
        some$$ident
    `);
  });

  it('formats type-cast operator without spaces', () => {
    expect(format('SELECT 2 :: numeric AS foo;')).toBe(dedent`
      SELECT
        2::numeric AS foo;
    `);
  });

  // issue #144 (unsolved)
  // This is currently far from ideal.
  it('formats SELECT DISTINCT ON () syntax', () => {
    expect(format('SELECT DISTINCT ON (c1, c2) c1, c2 FROM tbl;')).toBe(dedent`
      SELECT DISTINCT
        ON (c1, c2) c1,
        c2
      FROM
        tbl;
    `);
  });

  // Regression test for issue #624
  it('supports array slice operator', () => {
    expect(format('SELECT foo[:5], bar[1:], baz[1:5], zap[:];')).toBe(dedent`
      SELECT
        foo[:5],
        bar[1:],
        baz[1:5],
        zap[:];
    `);
  });

  it('formats ALTER TABLE ... ALTER COLUMN', () => {
    expect(
      format(
        `ALTER TABLE t ALTER COLUMN foo SET DATA TYPE VARCHAR;
         ALTER TABLE t ALTER COLUMN foo SET DEFAULT 5;
         ALTER TABLE t ALTER COLUMN foo DROP DEFAULT;
         ALTER TABLE t ALTER COLUMN foo SET NOT NULL;
         ALTER TABLE t ALTER COLUMN foo DROP NOT NULL;`
      )
    ).toBe(dedent`
      ALTER TABLE t
      ALTER COLUMN foo
      SET DATA TYPE VARCHAR;

      ALTER TABLE t
      ALTER COLUMN foo
      SET DEFAULT 5;

      ALTER TABLE t
      ALTER COLUMN foo
      DROP DEFAULT;

      ALTER TABLE t
      ALTER COLUMN foo
      SET NOT NULL;

      ALTER TABLE t
      ALTER COLUMN foo
      DROP NOT NULL;
    `);
  });

  // Issue #685
  it('allows TYPE to be used as an identifier', () => {
    expect(format(`SELECT type, modified_at FROM items;`)).toBe(dedent`
        SELECT
          type,
          modified_at
        FROM
          items;
      `);
  });

  // Issue #156, #709
  it('does not recognize common fields names as keywords', () => {
    expect(
      format(`SELECT id, type, name, location, label, password FROM release;`, {
        keywordCase: 'upper',
      })
    ).toBe(dedent`
        SELECT
          id,
          type,
          name,
          location,
          label,
          password
        FROM
          release;
      `);
  });

  it('formats DEFAULT VALUES clause', () => {
    expect(
      format(`INSERT INTO items default values RETURNING id;`, {
        keywordCase: 'upper',
      })
    ).toBe(dedent`
        INSERT INTO
          items
        DEFAULT VALUES
        RETURNING
          id;
      `);
  });

  // Issue #726
  it('treats TEXT as data-type (not as plain keyword)', () => {
    expect(
      format(`CREATE TABLE foo (items text);`, {
        dataTypeCase: 'upper',
      })
    ).toBe(dedent`
        CREATE TABLE foo (items TEXT);
      `);

    expect(
      format(`CREATE TABLE foo (text VARCHAR(100));`, {
        keywordCase: 'upper',
      })
    ).toBe(dedent`
        CREATE TABLE foo (text VARCHAR(100));
      `);
  });
}
