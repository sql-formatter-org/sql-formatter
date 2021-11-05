import dedent from 'dedent-js';
import * as sqlFormatter from '../src/sqlFormatter';
import PlSqlFormatter from '../src/languages/PlSqlFormatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsAlterTable from './features/alterTable';
import supportsAlterTableModify from './features/alterTableModify';
import supportsBetween from './features/between';
import supportsCase from './features/case';
import supportsCreateTable from './features/createTable';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';

describe('PlSqlFormatter', () => {
	const format = (query, cfg = {}) => sqlFormatter.format(query, { ...cfg, language: 'plsql' });

	behavesLikeSqlFormatter(format);
	supportsCase(format);
	supportsCreateTable(format);
	supportsAlterTable(format);
	supportsAlterTableModify(format);
	supportsStrings(format, PlSqlFormatter.stringTypes);
	supportsBetween(format);
	supportsSchema(format);
	supportsOperators(format, PlSqlFormatter.operators, PlSqlFormatter.reservedLogicalOperators);
	supportsJoin(format);

	it('formats FETCH FIRST like LIMIT', () => {
		expect(format('SELECT col1 FROM tbl ORDER BY col2 DESC FETCH FIRST 20 ROWS ONLY;')).toBe(dedent`
      SELECT
        col1
      FROM
        tbl
      ORDER BY
        col2 DESC
      FETCH FIRST
        20 ROWS ONLY;
    `);
	});

	it('formats only -- as a line comment', () => {
		const result = format('SELECT col FROM\n-- This is a comment\nMyTable;\n');
		expect(result).toBe(dedent`
      SELECT
        col
      FROM
        -- This is a comment
        MyTable;
    `);
	});

	it('recognizes _, $, #, . and @ as part of identifiers', () => {
		const result = format('SELECT my_col$1#, col.2@ FROM tbl\n');
		expect(result).toBe(dedent`
      SELECT
        my_col$1#,
        col.2@
      FROM
        tbl
    `);
	});

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

	it('recognizes ?[0-9]* placeholders', () => {
		const result = format('SELECT ?1, ?25, ?;');
		expect(result).toBe(dedent`
      SELECT
        ?1,
        ?25,
        ?;
    `);
	});

	it('replaces ? numbered placeholders with param values', () => {
		const result = format('SELECT ?1, ?2, ?0;', {
			params: {
				0: 'first',
				1: 'second',
				2: 'third',
			},
		});
		expect(result).toBe('SELECT\n' + '  second,\n' + '  third,\n' + '  first;');
	});

	it('replaces ? indexed placeholders with param values', () => {
		const result = format('SELECT ?, ?, ?;', {
			params: ['first', 'second', 'third'],
		});
		expect(result).toBe('SELECT\n' + '  first,\n' + '  second,\n' + '  third;');
	});

	it('formats SELECT query with CROSS APPLY', () => {
		const result = format('SELECT a, b FROM t CROSS APPLY fn(t.id)');
		expect(result).toBe(dedent`
      SELECT
        a,
        b
      FROM
        t
      CROSS APPLY
      fn(t.id)
    `);
	});

	it('formats simple SELECT', () => {
		const result = format('SELECT N, M FROM t');
		expect(result).toBe(dedent`
      SELECT
        N,
        M
      FROM
        t
    `);
	});

	it('formats simple SELECT with national characters', () => {
		const result = format("SELECT N'value'");
		expect(result).toBe(dedent`
      SELECT
        N'value'
    `);
	});

	it('formats SELECT query with OUTER APPLY', () => {
		const result = format('SELECT a, b FROM t OUTER APPLY fn(t.id)');
		expect(result).toBe(dedent`
      SELECT
        a,
        b
      FROM
        t
      OUTER APPLY
      fn(t.id)
    `);
	});

	it('formats Oracle recursive sub queries', () => {
		const result = format(`
      WITH t1(id, parent_id) AS (
        -- Anchor member.
        SELECT
          id,
          parent_id
        FROM
          tab1
        WHERE
          parent_id IS NULL
        MINUS
          -- Recursive member.
        SELECT
          t2.id,
          t2.parent_id
        FROM
          tab1 t2,
          t1
        WHERE
          t2.parent_id = t1.id
      ) SEARCH BREADTH FIRST BY id SET order1,
      another AS (SELECT * FROM dual)
      SELECT id, parent_id FROM t1 ORDER BY order1;
    `);
		expect(result).toBe(dedent`
      WITH
        t1(id, parent_id) AS (
          -- Anchor member.
          SELECT
            id,
            parent_id
          FROM
            tab1
          WHERE
            parent_id IS NULL
          MINUS
          -- Recursive member.
          SELECT
            t2.id,
            t2.parent_id
          FROM
            tab1 t2,
            t1
          WHERE
            t2.parent_id = t1.id
        ) SEARCH BREADTH FIRST BY id SET order1,
        another AS (
          SELECT
            *
          FROM
            dual
        )
      SELECT
        id,
        parent_id
      FROM
        t1
      ORDER BY
        order1;
    `);
	});

	it('formats Oracle recursive sub queries regardless of capitalization', () => {
		const result = format(/* sql */ `
      WITH t1(id, parent_id) AS (
        -- Anchor member.
        SELECT
          id,
          parent_id
        FROM
          tab1
        WHERE
          parent_id IS NULL
        MINUS
          -- Recursive member.
        SELECT
          t2.id,
          t2.parent_id
        FROM
          tab1 t2,
          t1
        WHERE
          t2.parent_id = t1.id
      ) SEARCH BREADTH FIRST by id set order1,
      another AS (SELECT * FROM dual)
      SELECT id, parent_id FROM t1 ORDER BY order1;
    `);
		expect(result).toBe(dedent/* sql */ `
      WITH
        t1(id, parent_id) AS (
          -- Anchor member.
          SELECT
            id,
            parent_id
          FROM
            tab1
          WHERE
            parent_id IS NULL
          MINUS
          -- Recursive member.
          SELECT
            t2.id,
            t2.parent_id
          FROM
            tab1 t2,
            t1
          WHERE
            t2.parent_id = t1.id
        ) SEARCH BREADTH FIRST BY id SET order1,
        another AS (
          SELECT
            *
          FROM
            dual
        )
      SELECT
        id,
        parent_id
      FROM
        t1
      ORDER BY
        order1;
    `);
	});
});
