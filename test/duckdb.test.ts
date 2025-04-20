import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';

import behavesLikeSqlFormatter from './behavesLikeSqlFormatter.js';
import supportsAlterTable from './features/alterTable.js';
import supportsBetween from './features/between.js';
import supportsCreateTable from './features/createTable.js';
import supportsDropTable from './features/dropTable.js';
import supportsJoin from './features/join.js';
import supportsOperators from './features/operators.js';
import supportsStrings from './features/strings.js';
import supportsReturning from './features/returning.js';
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
import supportsCreateView from './features/createView.js';
import supportsOnConflict from './features/onConflict.js';
import supportsIsDistinctFrom from './features/isDistinctFrom.js';
import supportsArrayLiterals from './features/arrayLiterals.js';
import supportsDataTypeCase from './options/dataTypeCase.js';
import supportsTruncateTable from './features/truncateTable.js';

describe('DuckDBFormatter', () => {
  const language = 'duckdb';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format, { nestedBlockComments: true });
  supportsCommentOn(format);
  supportsCreateView(format, { orReplace: true, ifNotExists: true });
  supportsCreateTable(format, { orReplace: true, ifNotExists: true });
  supportsDropTable(format, { ifExists: true });
  supportsArrayLiterals(format, { withoutArrayPrefix: true });
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
  supportsUpdate(format);
  supportsTruncateTable(format, { withTable: false, withoutTable: true });
  supportsStrings(format, ["''-qq", "X''", "B''"]);
  supportsIdentifiers(format, [`""-qq`]);
  supportsBetween(format);
  // Missing: '::' type cast (tested separately)
  supportsOperators(
    format,
    [
      // Arithmetic:
      '//',
      '%',
      '**',
      '^',
      '!',
      // Bitwise:
      '&',
      '|',
      '~',
      '<<',
      '>>',
      // Comparison:
      '==',
      // Lambda:
      '->',
      // Named function params:
      ':=',
      '=>',
      // Pattern matching:
      '~~',
      '!~~',
      '~~*',
      '!~~*',
      '~~~',
      // Regular expressions:
      '~',
      '!~',
      '~*',
      '!~*',
      // String:
      '^@',
      '||',
      // INET extension:
      '>>=',
      '<<=',
    ],
    { any: true }
  );
  supportsIsDistinctFrom(format);
  supportsJoin(format, {
    additionally: [
      'ASOF JOIN',
      'ASOF INNER JOIN',
      'ASOF LEFT JOIN',
      'ASOF LEFT OUTER JOIN',
      'ASOF RIGHT JOIN',
      'ASOF RIGHT OUTER JOIN',
      'ASOF FULL JOIN',
      'ASOF FULL OUTER JOIN',
      'POSITIONAL JOIN',
    ],
  });
  supportsSetOperations(format, [
    'UNION',
    'UNION ALL',
    'UNION BY NAME',
    'EXCEPT',
    'EXCEPT ALL',
    'INTERSECT',
    'INTERSECT ALL',
  ]);
  supportsReturning(format);
  supportsParams(format, { positional: true, numbered: ['$'], named: ['$'], quoted: ['$""'] });
  supportsWindow(format);
  supportsLimiting(format, { limit: true, offset: true });
  supportsDataTypeCase(format);

  it('allows $ character as part of identifiers', () => {
    expect(format('SELECT foo$, some$$ident')).toBe(dedent`
      SELECT
        foo$,
        some$$ident
    `);
  });

  // DuckDB-specific string types
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

  it('supports basic dollar-quoted strings', () => {
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

  // TODO: this conflicts with named parameter syntax: $foo
  it.skip('supports tagged dollar-quoted strings', () => {
    expect(format('$xxx$foo $$ LEFT JOIN $yyy$ bar$xxx$')).toBe(
      '$xxx$foo $$ LEFT JOIN $yyy$ bar$xxx$'
    );
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

  it('formats TIMESTAMP WITH TIME ZONE syntax', () => {
    expect(
      format(`
        CREATE TABLE time_table (id INT PRIMARY KEY NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE);`)
    ).toBe(dedent`
      CREATE TABLE time_table (
        id INT PRIMARY KEY NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE
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

  it('formats JSON data type', () => {
    expect(
      format(`CREATE TABLE foo (bar json, baz json);`, {
        dataTypeCase: 'upper',
      })
    ).toBe('CREATE TABLE foo (bar JSON, baz JSON);');
  });
});
