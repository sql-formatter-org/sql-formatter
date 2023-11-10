import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';
import behavesLikeDb2Formatter from './behavesLikeDb2Formatter.js';
import supportsComments from './features/comments.js';

import supportsCreateTable from './features/createTable.js';
import supportsDropTable from './features/dropTable.js';
import supportsJoin from './features/join.js';
import supportsParams from './options/param.js';

describe('Db2iFormatter', () => {
  const language = 'db2i';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeDb2Formatter(format);

  supportsComments(format, { nestedBlockComments: true });
  supportsCreateTable(format, { orReplace: true });
  supportsDropTable(format, { ifExists: true });
  supportsJoin(format, { without: ['NATURAL'], supportsUsing: true });
  supportsParams(format, { positional: true });
});
