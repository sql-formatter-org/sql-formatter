import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from 'src/sqlFormatter';
import PlSqlFormatter from 'src/languages/plsql/plsql.formatter';
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
import supportsSetOperations from './features/setOperations';
import supportsLimiting from './features/limiting';
import supportsInsertInto from './features/insertInto';
import supportsUpdate from './features/update';
import supportsTruncateTable from './features/truncateTable';
import supportsMergeInto from './features/mergeInto';
import supportsCreateView from './features/createView';

describe('PlSqlFormatter', () => {
  const language = 'plsql';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format);
  supportsCreateView(format, { orReplace: true, materialized: true });
  supportsCreateTable(format);
  supportsDropTable(format);
  supportsConstraints(format);
  supportsAlterTable(format, {
    dropColumn: true,
    modify: true,
    renameTo: true,
    renameColumn: true,
  });
  supportsDeleteFrom(format);
  supportsInsertInto(format);
  supportsUpdate(format);
  supportsTruncateTable(format);
  supportsMergeInto(format);
  supportsStrings(format, ["''-qq", "N''"]);
  supportsIdentifiers(format, [`""`]);
  supportsBetween(format);
  supportsSchema(format);
  supportsOperators(format, PlSqlFormatter.operators, ['AND', 'OR', 'XOR']);
  supportsJoin(format, { supportsApply: true });
  supportsSetOperations(format, ['UNION', 'UNION ALL', 'EXCEPT', 'INTERSECT']);
  supportsReturning(format);
  supportsParams(format, { numbered: [':'], named: [':'] });
  supportsLimiting(format, { offset: true, fetchFirst: true, fetchNext: true });

  it('recognizes _, $, # as part of identifiers', () => {
    const result = format('SELECT my_col$1#, col.a$, type#, procedure$, user# FROM tbl;');
    expect(result).toBe(dedent`
      SELECT
        my_col$1#,
        col.a$,
        type#,
        procedure$,
        user#
      FROM
        tbl;
    `);
  });

  // Parameters don't allow the same characters as identifiers
  it('does not support #, $ in named parameters', () => {
    expect(format('SELECT :col$foo')).toBe(dedent`
      SELECT
        :col $ foo
    `);

    expect(format('SELECT :col#foo')).toBe(dedent`
      SELECT
        :col # foo
    `);
  });

  it('supports &name substitution variables', () => {
    const result = format('SELECT &name, &some$Special#Chars_, &hah123 FROM &&tbl');
    expect(result).toBe(dedent`
      SELECT
        &name,
        &some$Special#Chars_,
        &hah123
      FROM
        &&tbl
    `);
  });

  it('supports Q custom delimiter strings', () => {
    expect(format("q'<test string < > 'foo' bar >'")).toBe("q'<test string < > 'foo' bar >'");
    expect(format("NQ'[test string [ ] 'foo' bar ]'")).toBe("NQ'[test string [ ] 'foo' bar ]'");
    expect(format("nq'(test string ( ) 'foo' bar )'")).toBe("nq'(test string ( ) 'foo' bar )'");
    expect(format("nQ'{test string { } 'foo' bar }'")).toBe("nQ'{test string { } 'foo' bar }'");
    expect(format("Nq'%test string % % 'foo' bar %'")).toBe("Nq'%test string % % 'foo' bar %'");
    expect(format("Q'Xtest string X X 'foo' bar X'")).toBe("Q'Xtest string X X 'foo' bar X'");
    expect(format("q'$test string $'$''")).toBe("q'$test string $' $ ''");
    expect(format("Q'Stest string S'S''")).toBe("Q'Stest string S' S ''");
  });

  it('formats Oracle recursive sub queries', () => {
    const result = format(`
      WITH t1 AS (
        SELECT * FROM tbl
      ) SEARCH BREADTH FIRST BY id SET order1
      SELECT * FROM t1;
    `);
    expect(result).toBe(dedent`
      WITH
        t1 AS (
          SELECT
            *
          FROM
            tbl
        ) SEARCH BREADTH FIRST BY id SET order1
      SELECT
        *
      FROM
        t1;
    `);
  });

  // regression test for sql-formatter#338
  it('formats identifier with dblink', () => {
    const result = format('SELECT * FROM database.table@dblink WHERE id = 1;');
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        database.table@dblink
      WHERE
        id = 1;
    `);
  });

  // regression test for #340
  it('formats FOR UPDATE clause', () => {
    const result = format(`
      SELECT * FROM tbl FOR UPDATE;
      SELECT * FROM tbl FOR UPDATE OF tbl.salary;
    `);
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        tbl
      FOR UPDATE;

      SELECT
        *
      FROM
        tbl
      FOR UPDATE
        OF tbl.salary;
    `);
  });
});
