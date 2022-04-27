import * as sqlFormatter from '../src/sqlFormatter';
import MariaDbFormatter from '../src/languages/mariadb.formatter';
import behavesLikeMariaDbFormatter from './behavesLikeMariaDbFormatter';

import supportsStrings from './features/strings';
import supportsOperators from './features/operators';

describe('MariaDbFormatter', () => {
  const language = 'mariadb';
  const format = (query, cfg = {}) => sqlFormatter.format(query, { ...cfg, language });

  behavesLikeMariaDbFormatter(language, format);

  supportsStrings(language, format, MariaDbFormatter.stringTypes);
  supportsOperators(
    language,
    format,
    MariaDbFormatter.operators,
    MariaDbFormatter.reservedLogicalOperators
  );
});
