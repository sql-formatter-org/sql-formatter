import dedent from 'dedent-js';
import * as sqlFormatter from '../src/sqlFormatter';
import TSqlFormatter from '../src/languages/TSqlFormatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsCase from './features/case';
import supportsCreateTable from './features/createTable';
import supportsAlterTable from './features/alterTable';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';
import supportsBetween from './features/between';
import supportsOperators from './features/operators';
import supportsJoin from './features/join';

describe('TSqlFormatter', () => {
	const format = (query, cfg = {}) => sqlFormatter.format(query, { ...cfg, language: 'tsql' });

	behavesLikeSqlFormatter(format);
	supportsCase(format);
	supportsCreateTable(format);
	supportsAlterTable(format);
	supportsStrings(format, TSqlFormatter.stringTypes);
	supportsBetween(format);
	supportsSchema(format);
	supportsOperators(format, TSqlFormatter.operators, TSqlFormatter.reservedLogicalOperators);
	supportsJoin(format, { without: ['NATURAL'] });

	// TODO: The following are duplicated from StandardSQLFormatter test

	it('formats INSERT without INTO', () => {
		const result = format(
			"INSERT Customers (ID, MoneyBalance, Address, City) VALUES (12,-123.4, 'Skagen 2111','Stv');"
		);
		expect(result).toBe(dedent`
      INSERT
        Customers (ID, MoneyBalance, Address, City)
      VALUES
        (12, -123.4, 'Skagen 2111', 'Stv');
    `);
	});

	it('recognizes @variables', () => {
		const result = format('SELECT @variable, @"var name", @[var name];');
		expect(result).toBe(dedent`
      SELECT
        @variable,
        @"var name",
        @[var name];
    `);
	});

	it('replaces @variables with param values', () => {
		const result = format('SELECT @variable, @"var name1", @[var name2];', {
			params: {
				variable: "'var value'",
				'var name1': "'var value1'",
				'var name2': "'var value2'",
			},
		});
		expect(result).toBe(dedent`
      SELECT
        'var value',
        'var value1',
        'var value2';
    `);
	});

	it('formats SELECT query with CROSS JOIN', () => {
		const result = format('SELECT a, b FROM t CROSS JOIN t2 on t.id = t2.id_t');
		expect(result).toBe(dedent`
      SELECT
        a,
        b
      FROM
        t
        CROSS JOIN t2
        ON t.id = t2.id_t
    `);
	});
});
