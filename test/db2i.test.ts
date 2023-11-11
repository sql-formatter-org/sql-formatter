import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';
import behavesLikeDb2Formatter from './behavesLikeDb2Formatter.js';
import supportsComments from './features/comments.js';

import supportsCreateTable from './features/createTable.js';
import supportsAlterTable from './features/alterTable.js';
import supportsDropTable from './features/dropTable.js';
import supportsJoin from './features/join.js';
import supportsOperators from './features/operators.js';
import supportsParams from './options/param.js';

describe('Db2iFormatter', () => {
  const language = 'db2i';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeDb2Formatter(format);

  supportsComments(format, { nestedBlockComments: true });
  supportsCreateTable(format, { orReplace: true });
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
    renameColumn: false,
  });
  supportsDropTable(format, { ifExists: true });
  supportsJoin(format, {
    without: ['NATURAL'],
    additionally: ['EXCEPTION JOIN', 'LEFT EXCEPTION JOIN', 'RIGHT EXCEPTION JOIN'],
  });
  supportsParams(format, { positional: true });
  supportsOperators(format, ['**', '¬=', '¬>', '¬<', '!>', '!<', '||']);
});
