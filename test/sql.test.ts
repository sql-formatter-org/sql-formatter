import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from 'src/sqlFormatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsCreateTable from './features/createTable';
import supportsDropTable from './features/dropTable';
import supportsAlterTable from './features/alterTable';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';
import supportsBetween from './features/between';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsConstraints from './features/constraints';
import supportsDeleteFrom from './features/deleteFrom';
import supportsComments from './features/comments';
import supportsIdentifiers from './features/identifiers';
import supportsParams from './options/param';
import supportsWindow from './features/window';
import supportsSetOperations from './features/setOperations';
import supportsLimiting from './features/limiting';
import supportsInsertInto from './features/insertInto';
import supportsUpdate from './features/update';
import supportsTruncateTable from './features/truncateTable';
import supportsCreateView from './features/createView';

describe('SqlFormatter', () => {
  const language = 'sql';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format);
  supportsCreateView(format);
  supportsCreateTable(format);
  supportsDropTable(format);
  supportsConstraints(format);
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
