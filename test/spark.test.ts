import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from 'src/sqlFormatter';
import SparkFormatter from 'src/languages/spark/spark.formatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsAlterTable from './features/alterTable';
import supportsBetween from './features/between';
import supportsCreateTable from './features/createTable';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';
import supportsArrayAndMapAccessors from './features/arrayAndMapAccessors';
import supportsComments from './features/comments';
import supportsIdentifiers from './features/identifiers';
import supportsSetOperations from './features/setOperations';
import supportsLimit from './features/limit';

describe('SparkFormatter', () => {
  const language = 'spark';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format);
  supportsCreateTable(format);
  supportsAlterTable(format);
  supportsStrings(format, ["''", "X''"]);
  supportsIdentifiers(format, ['``']);
  supportsBetween(format);
  supportsSchema(format);
  supportsOperators(format, SparkFormatter.operators, ['AND', 'OR', 'XOR']);
  supportsArrayAndMapAccessors(format);
  supportsJoin(format, {
    additionally: [
      // non-standard anti-join:
      'ANTI JOIN',
      'LEFT ANTI JOIN',
      'NATURAL ANTI JOIN',
      'NATURAL LEFT ANTI JOIN',
      // non-standard semi-join
      'SEMI JOIN',
      'LEFT SEMI JOIN',
      'NATURAL SEMI JOIN',
      'NATURAL LEFT SEMI JOIN',
    ],
  });
  supportsSetOperations(format);
  supportsLimit(format);

  it('formats basic WINDOW clause', () => {
    const result = format(`SELECT * FROM tbl WINDOW win1, WINDOW win2, WINDOW win3;`);
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        tbl
      WINDOW
        win1,
      WINDOW
        win2,
      WINDOW
        win3;
    `);
  });

  it('formats window function and end as inline', () => {
    const result = format(
      `SELECT window(time, '1 hour').start AS window_start, window(time, '1 hour').end AS window_end FROM tbl;`
    );
    expect(result).toBe(dedent`
      SELECT
        window(time, '1 hour').start AS window_start,
        window(time, '1 hour').end AS window_end
      FROM
        tbl;
    `);
  });

  it('throws error when params option used', () => {
    expect(() => format('SELECT *', { params: ['1', '2', '3'] })).toThrow(
      'Unexpected "params" option. Prepared statement placeholders not supported for Spark.'
    );
  });

  // eslint-disable-next-line no-template-curly-in-string
  it('recognizes ${name} substitution variables', () => {
    const result = format(
      // eslint-disable-next-line no-template-curly-in-string
      "SELECT ${var1}, ${ var 2 } FROM ${table_name} WHERE name = '${name}';"
    );
    expect(result).toBe(dedent`
      SELECT
        \${var1},
        \${ var 2 }
      FROM
        \${table_name}
      WHERE
        name = '\${name}';
    `);
  });
});
