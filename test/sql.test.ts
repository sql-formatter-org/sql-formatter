import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from 'src/sqlFormatter';
import SqlFormatter from 'src/languages/sql/sql.formatter';
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

describe('SqlFormatter', () => {
  const language = 'sql';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format);
  supportsCreateTable(format);
  supportsDropTable(format);
  supportsConstraints(format);
  supportsAlterTable(format);
  supportsDeleteFrom(format);
  supportsStrings(format, ["''", "X''"]);
  supportsIdentifiers(format, [`""`, '``']);
  supportsBetween(format);
  supportsSchema(format);
  supportsJoin(format);
  supportsSetOperations(format);
  supportsOperators(format, SqlFormatter.operators);
  supportsParams(format, { positional: true });
  supportsWindow(format);
  supportsLimiting(format, { limit: true, offset: true, fetchFirst: true, fetchNext: true });

  // This is a crappy behavior, but at least we don't crash
  it('does not crash when encountering characters or operators it does not recognize', () => {
    expect(
      format(`
        SELECT @name, :bar FROM {foo};
      `)
    ).toBe(dedent`
      SELECT
        @ name,
      : bar
      FROM
        { foo };
    `);
  });
});
