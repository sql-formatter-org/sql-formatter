import * as sqlFormatter from '../src/sqlFormatter';
import HiveFormatter from '../src/languages/hive.formatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsCase from './features/case';
import supportsCreateTable from './features/createTable';
import supportsAlterTable from './features/alterTable';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';
import supportsBetween from './features/between';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';

describe('HiveFormatter', () => {
	const language = 'hive';
	const format = (query, cfg = {}) => sqlFormatter.format(query, { ...cfg, language });

	behavesLikeSqlFormatter(language, format);
	supportsCase(language, format);
	supportsCreateTable(language, format);
	supportsAlterTable(language, format);
	supportsStrings(language, format, HiveFormatter.stringTypes);
	supportsBetween(language, format);
	supportsSchema(language, format);
	supportsJoin(language, format, { without: ['NATURAL JOIN'] });
	supportsOperators(
		language,
		format,
		HiveFormatter.operators,
		HiveFormatter.reservedLogicalOperators
	);
});
