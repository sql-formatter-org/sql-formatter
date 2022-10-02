import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from 'src/sqlFormatter.js';

import behavesLikeSqlFormatter from './behavesLikeSqlFormatter.js';

import supportsCreateTable from './features/createTable.js';
import supportsDropTable from './features/dropTable.js';
import supportsAlterTable from './features/alterTable.js';
import supportsSchema from './features/schema.js';
import supportsStrings from './features/strings.js';
import supportsBetween from './features/between.js';
import supportsJoin from './features/join.js';
import supportsOperators from './features/operators.js';
import supportsArrayAndMapAccessors from './features/arrayAndMapAccessors.js';
import supportsComments from './features/comments.js';
import supportsIdentifiers from './features/identifiers.js';
import supportsWindow from './features/window.js';
import supportsSetOperations from './features/setOperations.js';
import supportsLimiting from './features/limiting.js';
import supportsUpdate from './features/update.js';
import supportsDeleteFrom from './features/deleteFrom.js';
import supportsTruncateTable from './features/truncateTable.js';
import supportsMergeInto from './features/mergeInto.js';
import supportsCreateView from './features/createView.js';

describe('HiveFormatter', () => {
  const language = 'hive';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format);
  supportsCreateView(format, { materialized: true, ifNotExists: true });
  supportsCreateTable(format, { ifNotExists: true });
  supportsDropTable(format, { ifExists: true });
  supportsAlterTable(format, { renameTo: true });
  supportsUpdate(format);
  supportsDeleteFrom(format);
  supportsTruncateTable(format, { withoutTable: true });
  supportsMergeInto(format);
  supportsStrings(format, ['""-bs', "''-bs"]);
  supportsIdentifiers(format, ['``']);
  supportsBetween(format);
  supportsSchema(format);
  supportsJoin(format, {
    without: ['NATURAL'],
    additionally: ['LEFT SEMI JOIN'],
    supportsUsing: false,
  });
  supportsSetOperations(format, ['UNION', 'UNION ALL', 'UNION DISTINCT']);
  supportsOperators(format, ['%', '~', '^', '|', '&', '<=>', '==', '!', '||']);
  supportsArrayAndMapAccessors(format);
  supportsWindow(format);
  supportsLimiting(format, { limit: true });

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
