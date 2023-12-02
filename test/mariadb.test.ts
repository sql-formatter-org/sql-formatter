import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';
import behavesLikeMariaDbFormatter from './behavesLikeMariaDbFormatter.js';

import supportsJoin from './features/join.js';
import supportsOperators from './features/operators.js';
import supportsReturning from './features/returning.js';
import supportsSetOperations, { standardSetOperations } from './features/setOperations.js';
import supportsLimiting from './features/limiting.js';
import supportsCreateTable from './features/createTable.js';
import supportsParams from './options/param.js';
import supportsCreateView from './features/createView.js';
import supportsAlterTable from './features/alterTable.js';
import supportsStrings from './features/strings.js';
import supportsConstraints from './features/constraints.js';
import supportsDataTypeCase from './options/dataTypeCase.js';

describe('MariaDbFormatter', () => {
  const language = 'mariadb';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeMariaDbFormatter(format);

  // in addition to string types listed in behavesLikeMariaDbFormatter
  supportsStrings(format, ["B''"]);

  supportsJoin(format, {
    without: ['FULL', 'NATURAL INNER JOIN'],
    additionally: ['STRAIGHT_JOIN'],
  });
  supportsSetOperations(format, [...standardSetOperations, 'MINUS', 'MINUS ALL', 'MINUS DISTINCT']);
  supportsOperators(
    format,
    ['%', ':=', '&', '|', '^', '~', '<<', '>>', '<=>', '&&', '||', '!'],
    ['AND', 'OR', 'XOR']
  );
  supportsReturning(format);
  supportsLimiting(format, { limit: true, offset: true, fetchFirst: true, fetchNext: true });
  supportsCreateTable(format, {
    orReplace: true,
    ifNotExists: true,
    columnComment: true,
    tableComment: true,
  });
  supportsConstraints(format, ['RESTRICT', 'CASCADE', 'SET NULL', 'NO ACTION', 'SET DEFAULT']);
  supportsParams(format, { positional: true });
  supportsCreateView(format, { orReplace: true, ifNotExists: true });
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
    modify: true,
    renameTo: true,
    renameColumn: true,
  });
  supportsDataTypeCase(format);

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
      ALTER TABLE t
      ALTER COLUMN foo
      SET DEFAULT 10;

      ALTER TABLE t
      ALTER COLUMN foo
      DROP DEFAULT;
    `);
  });
});
