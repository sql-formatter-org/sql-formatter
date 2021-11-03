import * as sqlFormatter from '../src/sqlFormatter';
import MySqlFormatter from '../src/languages/MySqlFormatter';
import behavesLikeMariaDbFormatter from './behavesLikeMariaDbFormatter';

import supportsStrings from './features/strings';
import supportsOperators from './features/operators';

describe('MySqlFormatter', () => {
	const format = (query, cfg = {}) => sqlFormatter.format(query, { ...cfg, language: 'mysql' });

	behavesLikeMariaDbFormatter(format);

	supportsStrings(format, MySqlFormatter.stringTypes);
	supportsOperators(format, MySqlFormatter.operators, MySqlFormatter.reservedLogicalOperators);
});
