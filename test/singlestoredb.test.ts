import { format as originalFormat, FormatFn } from 'src/sqlFormatter';
import SingleStoreDbFormatter from 'src/languages/singlestoredb/singlestoredb.formatter';
import behavesLikeMariaDbFormatter from './behavesLikeMariaDbFormatter';

import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsSetOperations from './features/setOperations';
import supportsLimiting from './features/limiting';
import supportsCreateTable from './features/createTable';
import supportsCreateView from './features/createView';
import supportsAlterTable from './features/alterTable';
import supportsStrings from './features/strings';

describe('SingleStoreDbFormatter', () => {
  const language = 'singlestoredb';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeMariaDbFormatter(format);

  // in addition to string types listed in behavesLikeMariaDbFormatter
  supportsStrings(format, ["B''"]);

  supportsJoin(format, {
    without: ['NATURAL INNER JOIN', 'NATURAL FULL', 'NATURAL JOIN'],
    additionally: ['STRAIGHT_JOIN'],
  });
  supportsSetOperations(format, [
    'UNION',
    'UNION ALL',
    'UNION DISTINCT',
    'EXCEPT',
    'INTERSECT',
    'MINUS',
  ]);
  supportsOperators(format, SingleStoreDbFormatter.operators, ['AND', 'OR']);
  supportsLimiting(format, { limit: true, offset: true });
  supportsCreateTable(format, { ifNotExists: true });
  supportsCreateView(format);
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
    modify: true,
    renameTo: true,
  });
});
