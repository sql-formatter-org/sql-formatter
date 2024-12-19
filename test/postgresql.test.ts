import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';

import behavesLikeSqlFormatter from './behavesLikeSqlFormatter.js';
import supportsAlterTable from './features/alterTable.js';
import supportsBetween from './features/between.js';
import supportsCreateTable from './features/createTable.js';
import supportsDropTable from './features/dropTable.js';
import supportsJoin from './features/join.js';
import supportsOperators from './features/operators.js';
import supportsSchema from './features/schema.js';
import supportsStrings from './features/strings.js';
import supportsReturning from './features/returning.js';
import supportsConstraints from './features/constraints.js';
import supportsDeleteFrom from './features/deleteFrom.js';
import supportsComments from './features/comments.js';
import supportsCommentOn from './features/commentOn.js';
import supportsIdentifiers from './features/identifiers.js';
import supportsParams from './options/param.js';
import supportsArrayAndMapAccessors from './features/arrayAndMapAccessors.js';
import supportsWindow from './features/window.js';
import supportsSetOperations from './features/setOperations.js';
import supportsLimiting from './features/limiting.js';
import supportsInsertInto from './features/insertInto.js';
import supportsUpdate from './features/update.js';
import supportsTruncateTable from './features/truncateTable.js';
import supportsCreateView from './features/createView.js';
import supportsOnConflict from './features/onConflict.js';
import supportsIsDistinctFrom from './features/isDistinctFrom.js';
import supportsArrayLiterals from './features/arrayLiterals.js';
import supportsDataTypeCase from './options/dataTypeCase.js';

describe('PostgreSqlFormatter', () => {
  const language = 'postgresql';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format, { nestedBlockComments: true });
  supportsCommentOn(format);
  supportsCreateView(format, { orReplace: true, materialized: true, ifNotExists: true });
  supportsCreateTable(format, { ifNotExists: true });
  supportsDropTable(format, { ifExists: true });
  supportsConstraints(format, ['NO ACTION', 'RESTRICT', 'CASCADE', 'SET NULL', 'SET DEFAULT']);
  supportsArrayLiterals(format, { withArrayPrefix: true });
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
  supportsUpdate(format, { whereCurrentOf: true });
  supportsTruncateTable(format, { withoutTable: true });
  supportsStrings(format, ["''-qq", "U&''", "X''", "B''"]);
  supportsIdentifiers(format, [`""-qq`, 'U&""']);
  supportsBetween(format);
  supportsSchema(format);
  // Missing: '::' type cast (tested separately)
  supportsOperators(
    format,
    [
      // Arithmetic
      '%',
      '^',
      '|/',
      '||/',
      '@',
      // Assignment
      ':=',
      // Bitwise
      '&',
      '|',
      '#',
      '~',
      '<<',
      '>>',
      // Byte comparison
      '~>~',
      '~<~',
      '~>=~',
      '~<=~',
      // Geometric
      '@-@',
      '@@',
      '##',
      '<->',
      '&&',
      '&<',
      '&>',
      '<<|',
      '&<|',
      '|>>',
      '|&>',
      '<^',
      '^>',
      '?#',
      '?-',
      '?|',
      '?-|',
      '?||',
      '@>',
      '<@',
      '~=',
      // JSON
      '?',
      '@?',
      '?&',
      '->',
      '->>',
      '#>',
      '#>>',
      '#-',
      // Named function params
      '=>',
      // Network address
      '>>=',
      '<<=',
      // Pattern matching
      '~~',
      '~~*',
      '!~~',
      '!~~*',
      // POSIX RegExp
      '~',
      '~*',
      '!~',
      '!~*',
      // Range/multirange
      '-|-',
      // String concatenation
      '||',
      // Text search
      '@@@',
      '!!',
      '^@',
      // Trigram/trigraph
      '<%',
      '<<%',
      '%>',
      '%>>',
      '<<->',
      '<->>',
      '<<<->',
      '<->>>',
      // Custom operators: from pgvector extension
      '<#>',
      '<=>',
      '<+>',
      '<~>',
      '<%>',
    ],
    { any: true }
  );
  supportsIsDistinctFrom(format);
  supportsJoin(format);
  supportsSetOperations(format);
  supportsReturning(format);
  supportsParams(format, { numbered: ['$'] });
  supportsWindow(format);
  supportsLimiting(format, { limit: true, offset: true, fetchFirst: true, fetchNext: true });
  supportsDataTypeCase(format);

  it('allows $ character as part of identifiers', () => {
    expect(format('SELECT foo$, some$$ident')).toBe(dedent`
      SELECT
        foo$,
        some$$ident
    `);
  });

  // Postgres-specific string types
  it("supports E'' strings with C-style escapes", () => {
    expect(format("E'blah blah'")).toBe("E'blah blah'");
    expect(format("E'some \\' FROM escapes'")).toBe("E'some \\' FROM escapes'");
    expect(format("SELECT E'blah' FROM foo")).toBe(dedent`
      SELECT
        E'blah'
      FROM
        foo
    `);
    expect(format("E'blah''blah'")).toBe("E'blah''blah'");
  });

  it('supports dollar-quoted strings', () => {
    expect(format('$xxx$foo $$ LEFT JOIN $yyy$ bar$xxx$')).toBe(
      '$xxx$foo $$ LEFT JOIN $yyy$ bar$xxx$'
    );
    expect(format('$$foo JOIN bar$$')).toBe('$$foo JOIN bar$$');
    expect(format('$$foo $ JOIN bar$$')).toBe('$$foo $ JOIN bar$$');
    expect(format('$$foo \n bar$$')).toBe('$$foo \n bar$$');
    expect(format('SELECT $$where$$ FROM $$update$$')).toBe(dedent`
      SELECT
        $$where$$
      FROM
        $$update$$
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

  // Regression test for issue #447
  it('formats empty SELECT', () => {
    expect(format('SELECT;')).toBe(dedent`
      SELECT;
    `);
  });

  // Regression test for issues #391 and #618
  it('formats TIMESTAMP WITH TIME ZONE syntax', () => {
    expect(
      format(`
        CREATE TABLE time_table (id INT,
          created_at TIMESTAMP WITH TIME ZONE,
          deleted_at TIME WITH TIME ZONE,
          modified_at TIMESTAMP(0) WITH TIME ZONE);`)
    ).toBe(dedent`
      CREATE TABLE time_table (
        id INT,
        created_at TIMESTAMP WITH TIME ZONE,
        deleted_at TIME WITH TIME ZONE,
        modified_at TIMESTAMP(0) WITH TIME ZONE
      );
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

  it('formats FOR UPDATE clause', () => {
    expect(
      format(`
        SELECT * FROM tbl FOR UPDATE;
        SELECT * FROM tbl FOR UPDATE OF tbl.salary;
      `)
    ).toBe(dedent`
      SELECT
        *
      FROM
        tbl
      FOR UPDATE;

      SELECT
        *
      FROM
        tbl
      FOR UPDATE OF
        tbl.salary;
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

  // Issue #711
  it('supports OPERATOR() syntax', () => {
    expect(format(`SELECT foo OPERATOR(public.===) bar;`)).toBe(dedent`
      SELECT
        foo OPERATOR(public.===) bar;
    `);
    expect(format(`SELECT foo operator ( !== ) bar;`)).toBe(dedent`
      SELECT
        foo operator ( !== ) bar;
    `);
  });
});
