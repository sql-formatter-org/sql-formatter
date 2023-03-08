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

describe('PostgreSqlFormatter', () => {
  const language = 'postgresql';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format, { nestedBlockComments: true });
  supportsCreateView(format, { orReplace: true, materialized: true, ifNotExists: true });
  supportsCreateTable(format, { ifNotExists: true });
  supportsDropTable(format, { ifExists: true });
  supportsConstraints(format, ['NO ACTION', 'RESTRICT', 'CASCADE', 'SET NULL', 'SET DEFAULT']);
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
  supportsOperators(format, [
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
    // Trigram/trigraph
    '<%',
    '<<%',
    '%>',
    '%>>',
    '<<->',
    '<->>',
    '<<<->',
    '<->>>',
  ]);
  supportsIsDistinctFrom(format);
  supportsJoin(format);
  supportsSetOperations(format);
  supportsReturning(format);
  supportsParams(format, { numbered: ['$'] });
  supportsWindow(format);
  supportsLimiting(format, { limit: true, offset: true, fetchFirst: true, fetchNext: true });

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

  it('supports ARRAY literals', () => {
    expect(format('SELECT ARRAY[1, 2, 3]')).toBe(dedent`
      SELECT
        ARRAY[1, 2, 3]
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

  // Regression test for issue #391
  it('formats TIMESTAMP WITH TIME ZONE syntax', () => {
    expect(
      format(
        'CREATE TABLE time_table (id INT, created_at TIMESTAMP WITH TIME ZONE, deleted_at TIME WITH TIME ZONE);'
      )
    ).toBe(dedent`
      CREATE TABLE
        time_table (
          id INT,
          created_at TIMESTAMP WITH TIME ZONE,
          deleted_at TIME WITH TIME ZONE
        );
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

  it('formats FOR UPDATE clauses', () => {
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
});
