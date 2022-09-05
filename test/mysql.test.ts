import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from 'src/sqlFormatter';
import behavesLikeMariaDbFormatter from './behavesLikeMariaDbFormatter';

import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsWindow from './features/window';
import supportsSetOperations from './features/setOperations';
import supportsLimiting from './features/limiting';
import supportsCreateTable from './features/createTable';
import supportsParams from './options/param';
import supportsCreateView from './features/createView';
import supportsAlterTable from './features/alterTable';
import supportsStrings from './features/strings';

describe('MySqlFormatter', () => {
  const language = 'mysql';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeMariaDbFormatter(format);

  // in addition to string types listed in behavesLikeMariaDbFormatter
  supportsStrings(format, ["N''"]);

  supportsJoin(format, {
    without: ['FULL'],
    additionally: ['STRAIGHT_JOIN'],
  });
  supportsSetOperations(format, ['UNION', 'UNION ALL', 'UNION DISTINCT']);
  supportsOperators(
    format,
    ['%', ':=', '&', '|', '^', '~', '<<', '>>', '<=>', '->', '->>', '&&', '||', '!'],
    ['AND', 'OR', 'XOR']
  );
  supportsWindow(format);
  supportsLimiting(format, { limit: true, offset: true });
  supportsCreateTable(format, { ifNotExists: true });
  supportsParams(format, { positional: true });
  supportsCreateView(format, { orReplace: true });
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
    modify: true,
    renameTo: true,
    renameColumn: true,
  });

  it(`supports @"name" variables`, () => {
    expect(format(`SELECT @"foo fo", @"foo\\"x", @"foo""y" FROM tbl;`)).toBe(dedent`
      SELECT
        @"foo fo",
        @"foo\\"x",
        @"foo""y"
      FROM
        tbl;
    `);
  });

  it(`supports @'name' variables`, () => {
    expect(format(`SELECT @'bar ar', @'bar\\'x', @'bar''y' FROM tbl;`)).toBe(dedent`
      SELECT
        @'bar ar',
        @'bar\\'x',
        @'bar''y'
      FROM
        tbl;
    `);
  });

  it('formats ALTER TABLE ... ALTER COLUMN', () => {
    expect(
      format(
        `ALTER TABLE t ALTER COLUMN foo SET DEFAULT 10;
         ALTER TABLE t ALTER COLUMN foo DROP DEFAULT;`
      )
    ).toBe(dedent`
      ALTER TABLE
        t
      ALTER COLUMN
        foo
      SET DEFAULT
        10;

      ALTER TABLE
        t
      ALTER COLUMN
        foo
      DROP DEFAULT;
    `);
  });
});
