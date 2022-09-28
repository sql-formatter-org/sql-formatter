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
import supportsReturning from './features/returning';
import supportsConstraints from './features/constraints';
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
  supportsComments(format, { nestedBlockComments: false });
  supportsCreateView(format, { orReplace: true, materialized: true });
  supportsCreateTable(format, { ifNotExists: true });
  supportsDropTable(format, { ifExists: true });
  supportsConstraints(format);
  supportsArrayAndMapAccessors(format);
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
    renameTo: true,
    renameColumn: true,
  });
  supportsDeleteFrom(format);
  supportsInsertInto(format);
  supportsUpdate(format, { whereCurrentOf: true });
  supportsTruncateTable(format, { withoutTable: true });
  supportsStrings(format, ["''-qq", "U&''", "X''", "B''"]);
  supportsIdentifiers(format, [`""-qq`, 'U&""']);
  supportsBetween(format);
  supportsSchema(format);
  supportsOperators(format, [
    // Modulo
    '%',
    // Type cast
    '::',
    // String concat
    '||',
    // Get Path
    ':',
    // Generators: https://docs.snowflake.com/en/sql-reference/functions/generator.html#generator
    '=>',
  ]);
  supportsJoin(format);
  supportsSetOperations(format);
  supportsReturning(format);
  supportsLimiting(format, { limit: true, offset: true, fetchFirst: true, fetchNext: true });

  it('allows $ character as part of identifiers if inclosed by "', () => {
    expect(format('SELECT "foo$"')).toBe(dedent`
      SELECT
        "foo$"
    `);
  });
});
