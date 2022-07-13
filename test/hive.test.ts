import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from 'src/sqlFormatter';

import HiveFormatter from 'src/languages/hive.formatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsCreateTable from './features/createTable';
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

describe('HiveFormatter', () => {
  const language = 'hive';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format);
  supportsCreateTable(format);
  supportsAlterTable(format);
  supportsStrings(format, ['""', "''"]);
  supportsIdentifiers(format, ['``']);
  supportsBetween(format);
  supportsSchema(format);
  supportsJoin(format, { without: ['NATURAL JOIN'] });
  supportsOperators(format, HiveFormatter.operators);
  supportsArrayAndMapAccessors(format);
  supportsWindow(format);

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
});
