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
import supportsDeleteFrom from './features/deleteFrom.js';
import supportsComments from './features/comments.js';
import supportsIdentifiers from './features/identifiers.js';
import supportsArrayAndMapAccessors from './features/arrayAndMapAccessors.js';
import supportsSetOperations from './features/setOperations.js';
import supportsLimiting from './features/limiting.js';
import supportsInsertInto from './features/insertInto.js';
import supportsUpdate from './features/update.js';
import supportsTruncateTable from './features/truncateTable.js';
import supportsCreateView from './features/createView.js';
import supportsConstraints from './features/constraints.js';
import supportsDataTypeCase from './options/dataTypeCase.js';

describe('SnowflakeFormatter', () => {
  const language = 'snowflake';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format, { doubleSlashComments: true });
  supportsCreateView(format, { orReplace: true, ifNotExists: true });
  supportsCreateTable(format, {
    orReplace: true,
    ifNotExists: true,
    columnComment: true,
    tableComment: true,
  });
  supportsConstraints(format, ['CASCADE', 'SET NULL', 'SET DEFAULT', 'RESTRICT', 'NO ACTION']);
  supportsDropTable(format, { ifExists: true });
  supportsArrayAndMapAccessors(format);
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
    modify: true,
    renameTo: true,
    renameColumn: true,
  });
  supportsDeleteFrom(format);
  supportsInsertInto(format);
  supportsUpdate(format);
  supportsTruncateTable(format, { withoutTable: true });
  supportsStrings(format, ["''-bs", "''-qq"]);
  supportsIdentifiers(format, [`""-qq`]);
  supportsBetween(format);
  // ':' and '::' are tested later, since they should always be dense
  supportsOperators(format, ['%', '||', '=>', ':='], { any: true });
  supportsJoin(format, { without: ['NATURAL INNER JOIN'] });
  supportsSetOperations(format, ['UNION', 'UNION ALL', 'MINUS', 'EXCEPT', 'INTERSECT']);
  supportsLimiting(format, { limit: true, offset: true, fetchFirst: true, fetchNext: true });
  supportsDataTypeCase(format);

  it('allows $ character as part of unquoted identifiers', () => {
    expect(format('SELECT foo$')).toBe(dedent`
      SELECT
        foo$
    `);
  });

  describe(`formats traversal of semi structured data`, () => {
    it(`formats ':' path-operator without spaces`, () => {
      expect(format(`SELECT foo : bar`)).toBe(dedent`
        SELECT
          foo:bar
      `);
    });
    it(`formats ':' path-operator followed by dots without spaces`, () => {
      expect(format(`SELECT foo : bar . baz`)).toBe(dedent`
        SELECT
          foo:bar.baz
      `);
    });
    it(`formats ':' path-operator when followed by reserved keyword`, () => {
      expect(format(`SELECT foo : from`)).toBe(dedent`
        SELECT
          foo:from
      `);
    });
  });

  it('formats type-cast operator without spaces', () => {
    expect(format('SELECT 2 :: numeric AS foo;')).toBe(dedent`
      SELECT
        2::numeric AS foo;
    `);
  });

  it('supports $$-quoted strings', () => {
    expect(format(`SELECT $$foo' JOIN"$bar$$, $$foo$$$$bar$$`)).toBe(dedent`
      SELECT
        $$foo' JOIN"$bar$$,
        $$foo$$ $$bar$$
    `);
  });

  it('supports QUALIFY clause', () => {
    expect(format(`SELECT * FROM tbl QUALIFY ROW_NUMBER() OVER my_window = 1`)).toBe(dedent`
      SELECT
        *
      FROM
        tbl
      QUALIFY
        ROW_NUMBER() OVER my_window = 1
    `);
  });

  it('formats ALTER TABLE ... ALTER COLUMN', () => {
    expect(
      format(
        `ALTER TABLE t ALTER COLUMN foo SET DATA TYPE VARCHAR;
         ALTER TABLE t ALTER COLUMN foo SET DEFAULT 5;
         ALTER TABLE t ALTER COLUMN foo DROP DEFAULT;
         ALTER TABLE t ALTER COLUMN foo SET NOT NULL;
         ALTER TABLE t ALTER COLUMN foo DROP NOT NULL;
         ALTER TABLE t ALTER COLUMN foo COMMENT 'blah';
         ALTER TABLE t ALTER COLUMN foo UNSET COMMENT;
         ALTER TABLE t ALTER COLUMN foo SET MASKING POLICY polis;
         ALTER TABLE t ALTER COLUMN foo UNSET MASKING POLICY;
         ALTER TABLE t ALTER COLUMN foo SET TAG tname = 10;
         ALTER TABLE t ALTER COLUMN foo UNSET TAG tname;`
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

      ALTER TABLE t
      ALTER COLUMN foo COMMENT 'blah';

      ALTER TABLE t
      ALTER COLUMN foo
      UNSET COMMENT;

      ALTER TABLE t
      ALTER COLUMN foo
      SET MASKING POLICY polis;

      ALTER TABLE t
      ALTER COLUMN foo
      UNSET MASKING POLICY;

      ALTER TABLE t
      ALTER COLUMN foo
      SET TAG tname = 10;

      ALTER TABLE t
      ALTER COLUMN foo
      UNSET TAG tname;
    `);
  });

  it('detects data types', () => {
    expect(
      format(
        `CREATE TABLE tbl (first_column double Precision, second_column numBer (38, 0), third String);`,
        {
          dataTypeCase: 'upper',
        }
      )
    ).toBe(dedent`
    CREATE TABLE tbl (
      first_column DOUBLE PRECISION,
      second_column NUMBER(38, 0),
      third STRING
    );`);
  });

  // Issue #771
  it('allows TYPE to be used as an identifier', () => {
    expect(format(`SELECT CASE WHEN type = 'upgrade' THEN amount ELSE 0 END FROM items;`))
      .toBe(dedent`
      SELECT
        CASE
          WHEN type = 'upgrade' THEN amount
          ELSE 0
        END
      FROM
        items;
    `);
  });

  // Issue #771
  it('supports lambda expressions', () => {
    expect(format(`SELECT FILTER(my_arr, a -> a:value >= 50);`)).toBe(dedent`
      SELECT
        FILTER(my_arr, a -> a:value >= 50);
    `);
  });
});
