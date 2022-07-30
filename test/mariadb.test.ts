import { format as originalFormat, FormatFn } from 'src/sqlFormatter';
import MariaDbFormatter from 'src/languages/mariadb/mariadb.formatter';
import behavesLikeMariaDbFormatter from './behavesLikeMariaDbFormatter';

import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsReturning from './features/returning';
import supportsSetOperations, { standardSetOperations } from './features/setOperations';
import supportsLimit from './features/limit';

describe('MariaDbFormatter', () => {
  const language = 'mariadb';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeMariaDbFormatter(format);

  supportsJoin(format, {
    without: ['FULL', 'NATURAL INNER JOIN'],
    additionally: ['STRAIGHT_JOIN'],
  });
  supportsSetOperations(format, [...standardSetOperations, 'MINUS', 'MINUS ALL', 'MINUS DISTINCT']);
  supportsOperators(format, MariaDbFormatter.operators, ['AND', 'OR', 'XOR']);
  supportsReturning(format);
  supportsLimit(format, { limit: true, offset: true, fetchFirst: true, fetchNext: true });
});
