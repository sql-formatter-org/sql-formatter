import dedent from 'dedent-js';
import { format as originalFormat, FormatFn } from '../src/sqlFormatter';
import Db2Formatter from '../src/languages/db2.formatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsAlterTable from './features/alterTable';
import supportsBetween from './features/between';
import supportsCreateTable from './features/createTable';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';
import supportsConstraints from './features/constraints';
import supportsDeleteFrom from './features/deleteFrom';

describe('Db2Formatter', () => {
  const language = 'db2';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(language, format);
  supportsCreateTable(language, format);
  supportsConstraints(language, format);
  supportsAlterTable(language, format);
  supportsDeleteFrom(language, format);
  supportsStrings(language, format, Db2Formatter.stringTypes);
  supportsBetween(language, format);
  supportsSchema(language, format);
  supportsOperators(language, format, Db2Formatter.operators);
  supportsJoin(language, format);

  it('formats FETCH FIRST like LIMIT', () => {
    expect(format('SELECT col1 FROM tbl ORDER BY col2 DESC FETCH FIRST 20 ROWS ONLY;')).toBe(dedent`
        SELECT
          col1
        FROM
          tbl
        ORDER BY
          col2 DESC
        FETCH FIRST
          20 ROWS ONLY;
      `);
  });

  it('formats only -- as a line comment', () => {
    const result = format(`
      SELECT col FROM
      -- This is a comment
      MyTable;
    `);
    expect(result).toBe(dedent`
      SELECT
        col
      FROM
        -- This is a comment
        MyTable;
    `);
  });

  it('recognizes @ and # as part of identifiers', () => {
    const result = format('SELECT col#1, @col2 FROM tbl');
    expect(result).toBe(dedent`
      SELECT
        col#1,
        @col2
      FROM
        tbl
    `);
  });

  it('recognizes :variables', () => {
    expect(format('SELECT :variable;')).toBe(dedent`
      SELECT
        :variable;
    `);
  });

  it('replaces :variables with param values', () => {
    const result = format('SELECT :variable', {
      params: { variable: '"variable value"' },
    });
    expect(result).toBe(dedent`
      SELECT
        "variable value"
    `);
  });
});
