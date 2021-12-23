import dedent from 'dedent-js';
import { format as originalFormat, FormatFn } from '../src/sqlFormatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';
import supportsCase from './features/case';
import supportsCreateTable from './features/createTable';
import supportsAlterTable from './features/alterTable';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';
import supportsBetween from './features/between';
import supportsJoin from './features/join';

describe('SqliteFormatter', () => {
  const language = 'sqlite';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(language, format);
  supportsCase(language, format);
  supportsCreateTable(language, format);
  supportsAlterTable(language, format);
  supportsStrings(language, format, ['""', "''"]);
  supportsBetween(language, format);
  supportsSchema(language, format);
  supportsJoin(language, format, {
    without: ['FULL', 'RIGHT'],
    additionally: ['NATURAL LEFT JOIN', 'NATURAL LEFT OUTER JOIN'],
  });

  it('replaces ? indexed placeholders with param values', () => {
    const result = format('SELECT ?, ?, ?;', {
      params: ['first', 'second', 'third'],
    });
    expect(result).toBe(dedent`
      SELECT
        first,
        second,
        third;
    `);
  });

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
