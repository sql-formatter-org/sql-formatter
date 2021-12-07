import dedent from 'dedent-js';
import * as sqlFormatter from '../src/sqlFormatter';
import BigQueryFormatter from '../src/languages/BigQueryFormatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsCase from './features/case';
import supportsCreateTable from './features/createTable';
import supportsAlterTable from './features/alterTable';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';
import supportsBetween from './features/between';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';

describe('BigQueryFormatter', () => {
	const format = (query, cfg = {}) => sqlFormatter.format(query, { ...cfg, language: 'bigquery' });

	behavesLikeSqlFormatter(format);
	supportsCase(format);
	supportsCreateTable(format);
	supportsAlterTable(format);
	supportsStrings(format, BigQueryFormatter.stringTypes);
	supportsBetween(format);
	supportsSchema(format);
	supportsJoin(format, { without: ['NATURAL JOIN'] });
	supportsOperators(
		format,
		BigQueryFormatter.operators,
		BigQueryFormatter.reservedLogicalOperators
	);
});
