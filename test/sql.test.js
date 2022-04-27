import dedent from 'dedent-js';
import * as sqlFormatter from '../src/sqlFormatter';
import StandardSqlFormatter from '../src/languages/standardsql.formatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsCase from './features/case';
import supportsCreateTable from './features/createTable';
import supportsAlterTable from './features/alterTable';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';
import supportsBetween from './features/between';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';

describe('StandardSqlFormatter', () => {
	const language = 'sql';
	const format = (query, cfg = {}) => sqlFormatter.format(query, { ...cfg, language });

	behavesLikeSqlFormatter(language, format);
	supportsCase(language, format);
	supportsCreateTable(language, format);
	supportsAlterTable(language, format);
	supportsStrings(language, format, StandardSqlFormatter.stringTypes);
	supportsBetween(language, format);
	supportsSchema(language, format);
	supportsJoin(language, format);
	supportsOperators(
		language,
		format,
		StandardSqlFormatter.operators,
		StandardSqlFormatter.reservedLogicalOperators
	);

	it('replaces ? indexed placeholders with param values', () => {
		const result = format('SELECT ?, ?, ?;', {
			params: ['first', 'second', 'third'],
		});
		expect(result).toBe(dedent`
      SELECT
        first,
        second,
        third;
    `);
	});

	it('formats FETCH FIRST like LIMIT', () => {
		const result = format('SELECT * FETCH FIRST 2 ROWS ONLY;');
		expect(result).toBe(dedent`
      SELECT
        *
      FETCH FIRST
        2 ROWS ONLY;
    `);
	});
});
