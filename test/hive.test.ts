import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from 'src/sqlFormatter';

import HiveFormatter from 'src/languages/hive/hive.formatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsCreateTable from './features/createTable';
import supportsDropTable from './features/dropTable';
import supportsAlterTable from './features/alterTable';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';
import supportsBetween from './features/between';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsArrayAndMapAccessors from './features/arrayAndMapAccessors';
import supportsComments from './features/comments';
import supportsIdentifiers from './features/identifiers';
import supportsWindow from './features/window';
import supportsSetOperations from './features/setOperations';
import supportsLimiting from './features/limiting';
import supportsUpdate from './features/update';
import supportsDeleteFrom from './features/deleteFrom';
import supportsTruncateTable from './features/truncateTable';

describe('HiveFormatter', () => {
  const language = 'hive';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format);
  supportsCreateTable(format);
  supportsDropTable(format);
  supportsAlterTable(format);
  supportsUpdate(format);
  supportsDeleteFrom(format);
  supportsTruncateTable(format, { withoutTable: true });
  supportsStrings(format, ['""', "''"]);
  supportsIdentifiers(format, ['``']);
  supportsBetween(format);
  supportsSchema(format);
  supportsJoin(format, {
    without: ['NATURAL'],
    additionally: ['LEFT SEMI JOIN'],
    supportsUsing: false,
  });
  supportsSetOperations(format, ['UNION', 'UNION ALL', 'UNION DISTINCT']);
  supportsOperators(format, HiveFormatter.operators);
  supportsArrayAndMapAccessors(format);
  supportsWindow(format);
  supportsLimiting(format, { limit: true });

  it('throws error when params option used', () => {
    expect(() => format('SELECT *', { params: ['1', '2', '3'] })).toThrow(
      'Unexpected "params" option. Prepared statement placeholders not supported for Hive.'
    );
  });

  // eslint-disable-next-line no-template-curly-in-string
  it('recognizes ${hivevar:name} substitution variables', () => {
    const result = format(
      // eslint-disable-next-line no-template-curly-in-string
      "SELECT ${var1}, ${ var 2 } FROM ${hivevar:table_name} WHERE name = '${hivevar:name}';"
    );
    expect(result).toBe(dedent`
      SELECT
        \${var1},
        \${ var 2 }
      FROM
        \${hivevar:table_name}
      WHERE
        name = '\${hivevar:name}';
    `);
  });

  it('supports SORT BY, CLUSTER BY, DISTRIBUTE BY', () => {
    const result = format(
      'SELECT value, count DISTRIBUTE BY count CLUSTER BY value SORT BY value, count;'
    );
    expect(result).toBe(dedent`
      SELECT
        value,
        count
      DISTRIBUTE BY
        count
      CLUSTER BY
        value
      SORT BY
        value,
        count;
    `);
  });

  it('formats INSERT INTO TABLE', () => {
    const result = format("INSERT INTO TABLE Customers VALUES (12,-123.4, 'Skagen 2111','Stv');");
    expect(result).toBe(dedent`
      INSERT INTO TABLE
        Customers
      VALUES
        (12, -123.4, 'Skagen 2111', 'Stv');
    `);
  });
});
