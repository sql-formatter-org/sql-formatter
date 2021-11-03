import dedent from 'dedent-js';
import * as sqlFormatter from '../src/sqlFormatter';
import N1qlFormatter from '../src/languages/N1qlFormatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsBetween from './features/between';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';

describe('N1qlFormatter', () => {
	const format = (query, cfg = {}) => sqlFormatter.format(query, { ...cfg, language: 'n1ql' });

	behavesLikeSqlFormatter(format);
	supportsStrings(format, N1qlFormatter.stringTypes);
	supportsBetween(format);
	supportsSchema(format);
	supportsOperators(format, N1qlFormatter.operators, N1qlFormatter.reservedLogicalOperators);
	supportsJoin(format, { without: ['FULL', 'CROSS', 'NATURAL'] });

	it('formats SELECT query with element selection expression', () => {
		const result = format('SELECT order_lines[0].productId FROM orders;');
		expect(result).toBe(dedent`
      SELECT
        order_lines[0].productId
      FROM
        orders;
    `);
	});

	it('formats SELECT query with primary key querying', () => {
		const result = format("SELECT fname, email FROM tutorial USE KEYS ['dave', 'ian'];");
		expect(result).toBe(dedent`
      SELECT
        fname,
        email
      FROM
        tutorial
      USE KEYS
        ['dave', 'ian'];
    `);
	});

	it('formats INSERT with {} object literal', () => {
		const result = format(
			"INSERT INTO heroes (KEY, VALUE) VALUES ('123', {'id':1,'type':'Tarzan'});"
		);
		expect(result).toBe(dedent`
      INSERT INTO
        heroes (KEY, VALUE)
      VALUES
        ('123', {'id': 1, 'type': 'Tarzan'});
    `);
	});

	it('formats INSERT with large object and array literals', () => {
		const result = format(`
      INSERT INTO heroes (KEY, VALUE) VALUES ('123', {'id': 1, 'type': 'Tarzan',
      'array': [123456789, 123456789, 123456789, 123456789, 123456789], 'hello': 'world'});
    `);
		expect(result).toBe(dedent`
      INSERT INTO
        heroes (KEY, VALUE)
      VALUES
        (
          '123',
          {
            'id': 1,
            'type': 'Tarzan',
            'array': [
              123456789,
              123456789,
              123456789,
              123456789,
              123456789
            ],
            'hello': 'world'
          }
        );
    `);
	});

	it('formats SELECT query with UNNEST top level reserver word', () => {
		const result = format('SELECT * FROM tutorial UNNEST tutorial.children c;');
		expect(result).toBe(dedent`
      SELECT
        *
      FROM
        tutorial
      UNNEST
        tutorial.children c;
    `);
	});

	it('formats SELECT query with NEST and USE KEYS', () => {
		const result = format(`
      SELECT * FROM usr
      USE KEYS 'Elinor_33313792' NEST orders_with_users orders
      ON KEYS ARRAY s.order_id FOR s IN usr.shipped_order_history END;
    `);
		expect(result).toBe(dedent`
      SELECT
        *
      FROM
        usr
      USE KEYS
        'Elinor_33313792'
      NEST
        orders_with_users orders
        ON KEYS ARRAY s.order_id FOR s IN usr.shipped_order_history
      END;
    `);
	});

	it('formats explained DELETE query with USE KEYS and RETURNING', () => {
		const result = format("EXPLAIN DELETE FROM tutorial t USE KEYS 'baldwin' RETURNING t");
		expect(result).toBe(dedent`
      EXPLAIN
      DELETE
      FROM
        tutorial t
      USE KEYS
        'baldwin' RETURNING t
    `);
	});

	it('formats UPDATE query with USE KEYS and RETURNING', () => {
		const result = format(
			"UPDATE tutorial USE KEYS 'baldwin' SET type = 'actor' RETURNING tutorial.type"
		);
		expect(result).toBe(dedent`
      UPDATE
        tutorial
      USE KEYS
        'baldwin'
      SET
        type = 'actor' RETURNING tutorial.type
    `);
	});

	it('recognizes $variables', () => {
		const result = format('SELECT $variable, $\'var name\', $"var name", $`var name`;');
		expect(result).toBe(dedent`
      SELECT
        $variable,
        $'var name',
        $"var name",
        $\`var name\`;
    `);
	});

	it('replaces $variables with param values', () => {
		const result = format('SELECT $variable, $\'var name\', $"var name", $`var name`;', {
			params: {
				variable: '"variable value"',
				'var name': "'var value'",
			},
		});
		expect(result).toBe(dedent`
      SELECT
        "variable value",
        'var value',
        'var value',
        'var value';
    `);
	});

	it('replaces $ numbered placeholders with param values', () => {
		const result = format('SELECT $1, $2, $0;', {
			params: {
				0: 'first',
				1: 'second',
				2: 'third',
			},
		});
		expect(result).toBe(dedent`
      SELECT
        second,
        third,
        first;
    `);
	});
});
