import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from 'src/sqlFormatter';
import SqliteFormatter from 'src/languages/sqlite.formatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsCreateTable from './features/createTable';
import supportsAlterTable from './features/alterTable';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';
import supportsBetween from './features/between';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsConstraints from './features/constraints';
import supportsDeleteFrom from './features/deleteFrom';
import supportsComments from './features/comments';
import supportsParams from './options/param';

describe('SqliteFormatter', () => {
  const language = 'sqlite';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format);
  supportsCreateTable(format);
  supportsConstraints(format);
  supportsAlterTable(format);
  supportsDeleteFrom(format);
  supportsStrings(format, SqliteFormatter.stringTypes);
  supportsBetween(format);
  supportsSchema(format);
  supportsJoin(format, {
    without: ['FULL', 'RIGHT'],
    additionally: ['NATURAL LEFT JOIN', 'NATURAL LEFT OUTER JOIN'],
  });
  supportsOperators(format, SqliteFormatter.operators);
  supportsParams(format, { indexed: ['?'], named: [':', '$', '@', '@""'] });

  it('formats FETCH FIRST like LIMIT', () => {
    const result = format('SELECT * FETCH FIRST 2 ROWS ONLY;');
    expect(result).toBe(dedent`
      SELECT
        *
      FETCH FIRST
        2 ROWS ONLY;
    `);
  });
});
