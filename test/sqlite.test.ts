import dedent from 'dedent-js';
import { format as originalFormat, FormatFn } from '../src/sqlFormatter';
import SqliteFormatter from '../src/languages/sqlite.formatter';
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
import supportsParams from './options/param';

describe('SqliteFormatter', () => {
  const language = 'sqlite';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(language, format);
  supportsCreateTable(language, format);
  supportsConstraints(language, format);
  supportsAlterTable(language, format);
  supportsDeleteFrom(language, format);
  supportsStrings(language, format, SqliteFormatter.stringTypes);
  supportsBetween(language, format);
  supportsSchema(language, format);
  supportsJoin(language, format, {
    without: ['FULL', 'RIGHT'],
    additionally: ['NATURAL LEFT JOIN', 'NATURAL LEFT OUTER JOIN'],
  });
  supportsOperators(language, format, SqliteFormatter.operators);
  supportsParams(language, format, { indexed: ['?'] });

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
