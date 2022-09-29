import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from 'src/sqlFormatter';

import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';
import supportsAlterTable from './features/alterTable';
import supportsBetween from './features/between';
import supportsCreateTable from './features/createTable';
import supportsDropTable from './features/dropTable';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsStrings from './features/strings';
import supportsDeleteFrom from './features/deleteFrom';
import supportsComments from './features/comments';
import supportsIdentifiers from './features/identifiers';
import supportsArrayAndMapAccessors from './features/arrayAndMapAccessors';
import supportsSetOperations from './features/setOperations';
import supportsLimiting from './features/limiting';
import supportsInsertInto from './features/insertInto';
import supportsUpdate from './features/update';
import supportsTruncateTable from './features/truncateTable';
import supportsCreateView from './features/createView';
import supportsConstraints from './features/constraints';

describe('SnowflakeFormatter', () => {
  const language = 'snowflake';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format, { doubleSlashComments: true });
  supportsCreateView(format, { orReplace: true, ifNotExists: true });
  supportsCreateTable(format, { orReplace: true, ifNotExists: true });
  supportsConstraints(format, ['CASCADE', 'SET NULL', 'SET DEFAULT', 'RESTRICT', 'NO ACTION']);
  supportsDropTable(format, { ifExists: true });
  supportsArrayAndMapAccessors(format);
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
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
  supportsOperators(format, ['%', '||', '=>']);
  supportsJoin(format, { without: ['NATURAL INNER JOIN'] });
  supportsSetOperations(format, ['UNION', 'UNION ALL', 'MINUS', 'EXCEPT', 'INTERSECT']);
  supportsLimiting(format, { limit: true, offset: true, fetchFirst: true, fetchNext: true });

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
});
