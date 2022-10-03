import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter.js';

import supportsCreateTable from './features/createTable.js';
import supportsDropTable from './features/dropTable.js';
import supportsAlterTable from './features/alterTable.js';
import supportsSchema from './features/schema.js';
import supportsStrings from './features/strings.js';
import supportsBetween from './features/between.js';
import supportsJoin from './features/join.js';
import supportsOperators from './features/operators.js';
import supportsConstraints from './features/constraints.js';
import supportsDeleteFrom from './features/deleteFrom.js';
import supportsComments from './features/comments.js';
import supportsIdentifiers from './features/identifiers.js';
import supportsParams from './options/param.js';
import supportsWindow from './features/window.js';
import supportsSetOperations from './features/setOperations.js';
import supportsLimiting from './features/limiting.js';
import supportsInsertInto from './features/insertInto.js';
import supportsUpdate from './features/update.js';
import supportsTruncateTable from './features/truncateTable.js';
import supportsCreateView from './features/createView.js';

describe('SqlFormatter', () => {
  const language = 'sql';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format);
  supportsCreateView(format);
  supportsCreateTable(format);
  supportsDropTable(format);
  supportsConstraints(format, ['CASCADE', 'SET NULL', 'SET DEFAULT', 'RESTRICT', 'NO ACTION']);
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
    renameTo: true,
    renameColumn: true,
  });
  supportsDeleteFrom(format);
  supportsInsertInto(format);
  supportsUpdate(format, { whereCurrentOf: true });
  supportsTruncateTable(format);
  supportsStrings(format, ["''-qq", "''-bs", "X''", "N''", "U&''"]);
  supportsIdentifiers(format, [`""-qq`, '``']);
  supportsBetween(format);
  supportsSchema(format);
  supportsJoin(format);
  supportsSetOperations(format);
  supportsOperators(format, ['||']);
  supportsParams(format, { positional: true });
  supportsWindow(format);
  supportsLimiting(format, { limit: true, offset: true, fetchFirst: true, fetchNext: true });

  it('throws error when encountering characters or operators it does not recognize', () => {
    expect(() => format('SELECT @name, :bar FROM foo;')).toThrowError(
      `Parse error: Unexpected "@name, :ba" at line 1 column 8`
    );
  });

  it('crashes when encountering unsupported curly braces', () => {
    expect(() =>
      format(dedent`
        SELECT
          {foo};
      `)
    ).toThrowError('Parse error: Unexpected "{foo};" at line 2 column 3');
  });

  it('formats ALTER TABLE ... ALTER COLUMN', () => {
    expect(
      format(
        `ALTER TABLE t ALTER COLUMN foo SET DEFAULT 5;
         ALTER TABLE t ALTER COLUMN foo DROP DEFAULT;
         ALTER TABLE t ALTER COLUMN foo DROP SCOPE CASCADE;
         ALTER TABLE t ALTER COLUMN foo RESTART WITH 10;`
      )
    ).toBe(dedent`
      ALTER TABLE
        t
      ALTER COLUMN
        foo
      SET DEFAULT
        5;

      ALTER TABLE
        t
      ALTER COLUMN
        foo
      DROP DEFAULT;

      ALTER TABLE
        t
      ALTER COLUMN
        foo
      DROP SCOPE CASCADE;

      ALTER TABLE
        t
      ALTER COLUMN
        foo
      RESTART WITH
        10;
    `);
  });
});
