import { format as originalFormat, FormatFn } from '../src/sqlFormatter';
import MariaDbFormatter from '../src/languages/mariadb.formatter';
import behavesLikeMariaDbFormatter from './behavesLikeMariaDbFormatter';

import supportsStrings from './features/strings';
import supportsOperators from './features/operators';
import supportsReturning from './features/returning';
import supportsIdentifiers from './features/identifiers';

describe('MariaDbFormatter', () => {
  const language = 'mariadb';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeMariaDbFormatter(format);

  supportsStrings(format, ["''", '""']);
  supportsIdentifiers(format, ['``']);
  supportsOperators(format, MariaDbFormatter.operators, ['AND', 'OR', 'XOR']);
  supportsReturning(format);
});
