import dedent from 'dedent-js';
import { format as originalFormat, FormatFn } from '../src/sqlFormatter';
import SparkFormatter from '../src/languages/spark.formatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsAlterTable from './features/alterTable';
import supportsBetween from './features/between';
import supportsCreateTable from './features/createTable';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';
import supportsArray from './features/array';
import supportsParams from './options/param';
import supportsComments from './features/comments';

describe('SparkFormatter', () => {
  const language = 'spark';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format);
  supportsCreateTable(format);
  supportsAlterTable(format);
  supportsStrings(format, SparkFormatter.stringTypes);
  supportsBetween(format);
  supportsSchema(format);
  supportsOperators(format, SparkFormatter.operators, ['AND', 'OR', 'XOR']);
  supportsArray(format);
  supportsJoin(format, {
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
  supportsParams(format, { indexed: ['?'], named: ['$', '${}'] });

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
});
