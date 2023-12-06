import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';
import behavesLikeDb2Formatter from './behavesLikeDb2Formatter.js';
import supportsComments from './features/comments.js';

import supportsCreateTable from './features/createTable.js';
import supportsAlterTable from './features/alterTable.js';
import supportsDropTable from './features/dropTable.js';
import supportsJoin from './features/join.js';
import supportsOperators from './features/operators.js';
import supportsLimiting from './features/limiting.js';
import supportsDataTypeCase from './options/dataTypeCase.js';

describe('Db2iFormatter', () => {
  const language = 'db2i';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeDb2Formatter(format);

  supportsComments(format, { nestedBlockComments: true });
  supportsLimiting(format, { limit: true, fetchNext: true, fetchFirst: true, offset: true });
  supportsCreateTable(format, { orReplace: true });
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
  });
  supportsDropTable(format, { ifExists: true });
  supportsJoin(format, {
    without: ['NATURAL'],
    additionally: ['EXCEPTION JOIN', 'LEFT EXCEPTION JOIN', 'RIGHT EXCEPTION JOIN'],
  });
  supportsOperators(format, ['**', '¬=', '¬>', '¬<', '!>', '!<', '||', '=>'], { any: true });
  supportsDataTypeCase(format);
});
