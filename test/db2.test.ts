import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';
import behavesLikeDb2Formatter from './behavesLikeDb2Formatter.js';

import supportsCreateTable from './features/createTable.js';
import supportsAlterTable from './features/alterTable.js';
import supportsDropTable from './features/dropTable.js';
import supportsJoin from './features/join.js';
import supportsStrings from './features/strings.js';
import supportsComments from './features/comments.js';
import supportsOperators from './features/operators.js';

describe('Db2Formatter', () => {
  const language = 'db2';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeDb2Formatter(format);

  supportsComments(format);
  supportsCreateTable(format);
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
    renameColumn: true,
  });
  supportsDropTable(format);
  supportsJoin(format, { without: ['NATURAL'] });
  supportsOperators(format, [
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
  ]);
  // Additional U& string type in addition to others shared by all DB2 implementations
  supportsStrings(format, ["U&''"]);
});
