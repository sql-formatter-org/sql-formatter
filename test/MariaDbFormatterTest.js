import * as sqlFormatter from '../src/sqlFormatter';
import MariaDbFormatter from '../src/languages/MariaDbFormatter';
import behavesLikeMariaDbFormatter from './behavesLikeMariaDbFormatter';

import supportsStrings from './features/strings';
import supportsOperators from './features/operators';

describe('MariaDbFormatter', () => {
	const format = (query, cfg = {}) => sqlFormatter.format(query, { ...cfg, language: 'mariadb' });

	behavesLikeMariaDbFormatter(format);

	supportsStrings(format, MariaDbFormatter.stringTypes);
	supportsOperators(format, MariaDbFormatter.operators, MariaDbFormatter.reservedLogicalOperators);
});
