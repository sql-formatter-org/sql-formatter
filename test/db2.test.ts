import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';
import behavesLikeDb2Formatter from './behavesLikeDb2Formatter.js';

import supportsCreateTable from './features/createTable.js';
import supportsAlterTable from './features/alterTable.js';
import supportsDropTable from './features/dropTable.js';
import supportsJoin from './features/join.js';
import supportsStrings from './features/strings.js';
import supportsComments from './features/comments.js';
import supportsOperators from './features/operators.js';
import supportsLimiting from './features/limiting.js';
import supportsDataTypeCase from './options/dataTypeCase.js';

describe('Db2Formatter', () => {
  const language = 'db2';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeDb2Formatter(format);

  supportsComments(format);
  supportsLimiting(format, { limit: true, fetchNext: true, offset: true });
  supportsCreateTable(format);
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
    renameColumn: true,
  });
  supportsDropTable(format);
  supportsJoin(format, { without: ['NATURAL'] });
  supportsOperators(
    format,
    [
      '**',
      '%',
      '&',
      '|',
      '^',
      '~',
      '¬=',
      '¬>',
      '¬<',
      '!>',
      '!<',
      '^=',
      '^>',
      '^<',
      '||',
      '->',
      '=>',
    ],
    { any: true }
  );
  // Additional U& string type in addition to others shared by all DB2 implementations
  supportsStrings(format, ["U&''"]);
  supportsDataTypeCase(format);

  it('supports non-standard FOR clause', () => {
    expect(format('SELECT * FROM tbl FOR UPDATE OF other_tbl FOR RS USE AND KEEP EXCLUSIVE LOCKS'))
      .toBe(dedent`
      SELECT
        *
      FROM
        tbl
      FOR UPDATE OF
        other_tbl
      FOR RS USE AND KEEP EXCLUSIVE LOCKS
    `);
  });
});
