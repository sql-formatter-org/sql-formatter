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

	it('supports # line comment', () => {
		const result = format('SELECT alpha # commment\nFROM beta');
		expect(result).toBe(dedent`
	    SELECT
	      alpha # commment
	    FROM
	      beta
		`);
	});

	it('supports STRUCT types', () => {
		const result = format(
			'SELECT STRUCT("Alpha" as name, [23.4, 26.3, 26.4, 26.1] as splits) FROM beta'
		);
		expect(result).toBe(dedent`
	    SELECT
	      STRUCT("Alpha" AS name, [23.4, 26.3, 26.4, 26.1] AS splits)
	    FROM
	      beta
		`);
	});

	it('supports parametric ARRAY and STRUCT', () => {
		const result = format('SELECT STRUCT<ARRAY<INT64>>([]), ARRAY<FLOAT>[1] FROM tbl');
		// TODO, v6: ARRAY<FLOAT> [] should be ARRAY<FLOAT>[]
		expect(result).toBe(dedent`
      SELECT
        STRUCT<ARRAY<INT64>>([]),
        ARRAY<FLOAT> [1]
      FROM
        tbl
		`);
	});

	it('supports parameterised types', () => {
		const result = format(`
			DECLARE varString STRING(11) '11charswide';
			DECLARE varBytes BYTES(8);
			DECLARE varNumeric NUMERIC(1,1);
			DECLARE varDecimal DECIMAL(1,1);
			DECLARE varBignumeric BIGNUMERIC(1,1);
			DECLARE varBigdecimal BIGDECIMAL(1,1);
		`);
		expect(result).toBe(dedent`
	    DECLARE
	      varString STRING(11) '11charswide';
	    DECLARE
	      varBytes BYTES(8);
	    DECLARE
	      varNumeric NUMERIC(1, 1);
	    DECLARE
	      varDecimal DECIMAL(1, 1);
	    DECLARE
	      varBignumeric BIGNUMERIC(1, 1);
	    DECLARE
	      varBigdecimal BIGDECIMAL(1, 1);
		`);
	});
});
