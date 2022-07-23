import { format as originalFormat, FormatFn } from 'src/sqlFormatter';
import MariaDbFormatter from 'src/languages/mariadb/mariadb.formatter';
import behavesLikeMariaDbFormatter from './behavesLikeMariaDbFormatter';

import supportsOperators from './features/operators';
import supportsReturning from './features/returning';
import supportsStrings from './features/strings';

describe('MariaDbFormatter', () => {
  const language = 'mariadb';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeMariaDbFormatter(format);

  supportsOperators(format, MariaDbFormatter.operators, ['AND', 'OR', 'XOR']);
  supportsReturning(format);
  supportsStrings(format, MariaDbFormatter.stringTypes);
});
