import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from 'src/sqlFormatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsAlterTable from './features/alterTable';
import supportsBetween from './features/between';
import supportsCreateTable from './features/createTable';
import supportsDropTable from './features/dropTable';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';
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

describe('Db2Formatter', () => {
  const language = 'db2';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format);
  supportsCreateView(format, { orReplace: true });
  supportsCreateTable(format);
  supportsDropTable(format);
  supportsConstraints(format);
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
    renameColumn: true,
  });
  supportsDeleteFrom(format);
  supportsInsertInto(format);
  supportsUpdate(format, { whereCurrentOf: true });
  supportsTruncateTable(format, { withoutTable: true });
  supportsMergeInto(format);
  supportsStrings(format, ["''-qq", "X''", "U&''", "N''"]);
  supportsIdentifiers(format, [`""-qq`]);
  supportsBetween(format);
  supportsSchema(format);
  supportsOperators(format, ['**', '¬=', '¬>', '¬<', '!>', '!<', '||']);
  supportsJoin(format, { without: ['NATURAL'], supportsUsing: false });
  supportsSetOperations(format, [
    'UNION',
    'UNION ALL',
    'EXCEPT',
    'EXCEPT ALL',
    'INTERSECT',
    'INTERSECT ALL',
  ]);
  supportsParams(format, { positional: true, named: [':'] });
  supportsLimiting(format, { fetchFirst: true });

  it('formats only -- as a line comment', () => {
    const result = format(`
      SELECT col FROM
      -- This is a comment
      MyTable;
    `);
    expect(result).toBe(dedent`
      SELECT
        col
      FROM
        -- This is a comment
        MyTable;
    `);
  });

  // DB2-specific string types
  it('supports strings with G, GX, BX, UX prefixes', () => {
    expect(format(`SELECT G'blah blah', GX'01AC', BX'0101', UX'CCF239' FROM foo`)).toBe(dedent`
      SELECT
        G'blah blah',
        GX'01AC',
        BX'0101',
        UX'CCF239'
      FROM
        foo
    `);
  });

  it('supports @, #, $ characters in named parameters', () => {
    expect(format(`SELECT :foo@bar, :foo#bar, :foo$bar, :@zip, :#zap, :$zop`)).toBe(dedent`
      SELECT
        :foo@bar,
        :foo#bar,
        :foo$bar,
        :@zip,
        :#zap,
        :$zop
    `);
  });

  it('supports WITH isolation level modifiers for UPDATE statement', () => {
    expect(format('UPDATE foo SET x = 10 WITH CS')).toBe(dedent`
      UPDATE
        foo
      SET
        x = 10
      WITH CS
    `);
  });

  it('formats ALTER TABLE ... ALTER COLUMN', () => {
    expect(
      format(
        `ALTER TABLE t ALTER COLUMN foo SET DATA TYPE VARCHAR;
         ALTER TABLE t ALTER COLUMN foo SET NOT NULL;`
      )
    ).toBe(dedent`
      ALTER TABLE
        t
      ALTER COLUMN
        foo
      SET DATA TYPE
        VARCHAR;

      ALTER TABLE
        t
      ALTER COLUMN
        foo
      SET NOT NULL;
    `);
  });
});
