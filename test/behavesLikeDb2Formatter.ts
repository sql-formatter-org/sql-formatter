import dedent from 'dedent-js';

import { FormatFn } from '../src/sqlFormatter.js';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter.js';

import supportsAlterTable from './features/alterTable.js';
import supportsBetween from './features/between.js';
import supportsOperators from './features/operators.js';
import supportsSchema from './features/schema.js';
import supportsStrings from './features/strings.js';
import supportsConstraints from './features/constraints.js';
import supportsDeleteFrom from './features/deleteFrom.js';
import supportsComments from './features/comments.js';
import supportsCommentOn from './features/commentOn.js';
import supportsIdentifiers from './features/identifiers.js';
import supportsSetOperations from './features/setOperations.js';
import supportsLimiting from './features/limiting.js';
import supportsInsertInto from './features/insertInto.js';
import supportsUpdate from './features/update.js';
import supportsTruncateTable from './features/truncateTable.js';
import supportsMergeInto from './features/mergeInto.js';
import supportsCreateView from './features/createView.js';

/**
 * Shared tests for DB2 and DB2i
 */
export default function behavesLikeDb2Formatter(format: FormatFn) {
  behavesLikeSqlFormatter(format);
  supportsComments(format);
  supportsCommentOn(format);
  supportsCreateView(format, { orReplace: true });
  supportsConstraints(format, ['NO ACTION', 'RESTRICT', 'CASCADE', 'SET NULL']);
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
  supportsStrings(format, ["''-qq", "X''", "N''"]);
  supportsIdentifiers(format, [`""-qq`]);
  supportsBetween(format);
  supportsSchema(format);
  supportsOperators(format, ['**', '¬=', '¬>', '¬<', '!>', '!<', '||']);
  supportsSetOperations(format, [
    'UNION',
    'UNION ALL',
    'EXCEPT',
    'EXCEPT ALL',
    'INTERSECT',
    'INTERSECT ALL',
  ]);
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

  it('supports @, #, $ characters anywhere inside identifiers', () => {
    expect(format(`SELECT @foo, #bar, $zap, fo@o, ba#2, za$3`)).toBe(dedent`
      SELECT
        @foo,
        #bar,
        $zap,
        fo@o,
        ba#2,
        za$3
    `);
  });

  it('supports WITH isolation level modifiers for UPDATE statement', () => {
    expect(format('UPDATE foo SET x = 10 WITH CS')).toBe(dedent`
      UPDATE foo
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
      ALTER TABLE t
      ALTER COLUMN foo
      SET DATA TYPE VARCHAR;

      ALTER TABLE t
      ALTER COLUMN foo
      SET NOT NULL;
    `);
  });
}
