import dedent from 'dedent-js';
import { format as originalFormat, FormatFn } from '../src/sqlFormatter';
import SparkSqlFormatter from '../src/languages/sparksql.formatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsAlterTable from './features/alterTable';
import supportsBetween from './features/between';
import supportsCreateTable from './features/createTable';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';
import supportsArray from './features/array';

describe('SparkSqlFormatter', () => {
  const language = 'spark';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(language, format);
  supportsCreateTable(language, format);
  supportsAlterTable(language, format);
  supportsStrings(language, format, SparkSqlFormatter.stringTypes);
  supportsBetween(language, format);
  supportsSchema(language, format);
  supportsOperators(
    language,
    format,
    SparkSqlFormatter.operators,
    SparkSqlFormatter.reservedLogicalOperators
  );
  supportsArray(language, format);
  supportsJoin(language, format, {
    additionally: [
      'ANTI JOIN',
      'SEMI JOIN',
      'LEFT ANTI JOIN',
      'LEFT SEMI JOIN',
      'RIGHT OUTER JOIN',
      'RIGHT SEMI JOIN',
      'NATURAL ANTI JOIN',
      'NATURAL FULL OUTER JOIN',
      'NATURAL INNER JOIN',
      'NATURAL LEFT ANTI JOIN',
      'NATURAL LEFT OUTER JOIN',
      'NATURAL LEFT SEMI JOIN',
      'NATURAL OUTER JOIN',
      'NATURAL RIGHT OUTER JOIN',
      'NATURAL RIGHT SEMI JOIN',
      'NATURAL SEMI JOIN',
    ],
  });

  it('formats WINDOW specification as top level', () => {
    const result = format(
      'SELECT *, LAG(value) OVER wnd AS next_value FROM tbl WINDOW wnd as (PARTITION BY id ORDER BY time);'
    );
    expect(result).toBe(dedent`
      SELECT
        *,
        LAG(value) OVER wnd AS next_value
      FROM
        tbl
      WINDOW
        wnd as (
          PARTITION BY
            id
          ORDER BY
            time
        );
    `);
  });

  it('formats window function and end as inline', () => {
    const result = format(
      'SELECT window(time, "1 hour").start AS window_start, window(time, "1 hour").end AS window_end FROM tbl;'
    );
    expect(result).toBe(dedent`
      SELECT
        window(time, "1 hour").start AS window_start,
        window(time, "1 hour").end AS window_end
      FROM
        tbl;
    `);
  });

  // eslint-disable-next-line no-template-curly-in-string
  it('does not add spaces around ${value} params', () => {
    // eslint-disable-next-line no-template-curly-in-string
    const result = format('SELECT ${var_name};');
    expect(result).toBe(dedent`
      SELECT
        \${var_name};
    `);
  });

  // eslint-disable-next-line no-template-curly-in-string
  it('replaces $variables and ${variables} with param values', () => {
    // eslint-disable-next-line no-template-curly-in-string
    const result = format('SELECT $var1, ${var2};', {
      params: {
        var1: "'var one'",
        var2: "'var two'",
      },
    });
    expect(result).toBe(dedent`
      SELECT
        'var one',
        'var two';
    `);
  });
});
