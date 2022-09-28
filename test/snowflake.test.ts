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

describe('SnowflakeFormatter', () => {
  const language = 'snowflake';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format, { doubleSlashComments: true });
  supportsCreateView(format, { orReplace: true, ifNotExists: true });
  supportsCreateTable(format, { orReplace: true, ifNotExists: true });
  supportsDropTable(format, { ifExists: true });
  supportsArrayAndMapAccessors(format);
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
    renameTo: true,
    renameColumn: true,
  });
  supportsDeleteFrom(format);
  supportsInsertInto(format, { withOverwrite: true });
  supportsUpdate(format);
  supportsTruncateTable(format, { withoutTable: true, ifExists: true });
  supportsStrings(format, ['$$', "''-bs", "''-qq"]);
  supportsIdentifiers(format, [`""-qq`]);
  supportsBetween(format);
  supportsSchema(format, 'USE');
  // ':' and '::' are tested later, since it is always dense
  supportsOperators(format, ['%', '||', '=>']);
  supportsJoin(format, { without: ['NATURAL INNER JOIN'] });
  supportsSetOperations(format, ['UNION', 'UNION ALL', 'MINUS', 'EXCEPT', 'INTERSECT']);
  supportsLimiting(format, { limit: true, offset: true, fetchFirst: true, fetchNext: true });

  it('allows $ character as part of identifiers if inclosed by "', () => {
    expect(format('SELECT "foo$"')).toBe(dedent`
      SELECT
        "foo$"
    `);
  });

  it(`formats ':' path-operator without spaces`, () => {
    expect(format(`SELECT foo:bar FROM test`)).toBe(dedent`
      SELECT
        foo:bar
      FROM
        test
    `);
  });

  it(`does not support ':' path-operator with spaces`, () => {
    expect(format(`SELECT foo : bar FROM test`)).toThrowError('Parse error');
  });

  it('formats type-cast operator without spaces', () => {
    expect(format('SELECT 2 :: numeric AS foo;')).toBe(dedent`
      SELECT
        2::numeric AS foo;
    `);
  });
});
