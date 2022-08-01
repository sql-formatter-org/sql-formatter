import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from 'src/sqlFormatter';
import PostgreSqlFormatter from 'src/languages/postgresql/postgresql.formatter';

import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';
import supportsAlterTable from './features/alterTable';
import supportsBetween from './features/between';
import supportsCreateTable from './features/createTable';
import supportsDropTable from './features/dropTable';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';
import supportsReturning from './features/returning';
import supportsConstraints from './features/constraints';
import supportsDeleteFrom from './features/deleteFrom';
import supportsComments from './features/comments';
import supportsIdentifiers from './features/identifiers';
import supportsParams from './options/param';
import supportsArrayAndMapAccessors from './features/arrayAndMapAccessors';
import supportsWindow from './features/window';
import supportsSetOperations from './features/setOperations';
import supportsLimiting from './features/limiting';

describe('PostgreSqlFormatter', () => {
  const language = 'postgresql';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format);
  supportsCreateTable(format);
  supportsDropTable(format);
  supportsConstraints(format);
  supportsArrayAndMapAccessors(format);
  supportsAlterTable(format);
  supportsDeleteFrom(format);
  supportsStrings(format, ["''", "U&''", "X''"]);
  supportsIdentifiers(format, [`""`, 'U&""']);
  supportsBetween(format);
  supportsSchema(format);
  supportsOperators(
    format,
    PostgreSqlFormatter.operators.filter(op => op !== '::')
  );
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
  it('supports bit strings', () => {
    expect(format(`SELECT B'0110010', B'1101000';`)).toBe(dedent`
      SELECT
        B'0110010',
        B'1101000';
    `);
  });

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
});
