import { format as originalFormat, FormatFn } from 'src/sqlFormatter';
import SingleStoreDbFormatter from 'src/languages/singlestoredb/singlestoredb.formatter';
import behavesLikeMariaDbFormatter from './behavesLikeMariaDbFormatter';

import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsWindow from './features/window';
import supportsSetOperations from './features/setOperations';
import supportsLimiting from './features/limiting';
import supportsCreateTable from './features/createTable';
import supportsCreateView from './features/createView';
import supportsAlterTable from './features/alterTable';

describe('SingleStoreDbFormatter', () => {
  const language = 'singlestoredb';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeMariaDbFormatter(format);

  supportsJoin(format, {
    without: ['NATURAL'],
    additionally: ['STRAIGHT_JOIN'],
  });
  supportsSetOperations(format, ['UNION', 'UNION ALL', 'UNION DISTINCT']);
  supportsOperators(format, SingleStoreDbFormatter.operators, ['AND', 'OR']);
  supportsWindow(format);
  supportsLimiting(format, { limit: true, offset: true });
  supportsCreateTable(format, { ifNotExists: true });
  supportsCreateView(format, { orReplace: false });
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
    modify: true,
    renameTo: true,
    renameColumn: false,
  });
});
