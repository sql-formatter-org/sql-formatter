import dedent from 'dedent-js';

import supportsComments from './features/comments';
import supportsConfigOptions from './features/configOptions';
import supportsAliases from './features/alias';
import supportsNewlineOptions from './features/newline';
import supportsKeywordPositions from './features/keywordPosition';
import supportsParenthesesOptions from './features/parenthesis';

/**
 * Core tests for all SQL formatters
 * @param {Function} format
 */
export default function behavesLikeSqlFormatter(format) {
	supportsAliases(format);
	supportsComments(format);
	supportsConfigOptions(format);
	supportsKeywordPositions(format);
	supportsNewlineOptions(format);
	supportsParenthesesOptions(format);

	it('does nothing with empty input', () => {
		const result = format('');

		expect(result).toBe('');
	});

	it('throws error when query argument is not string', () => {
		expect(() => format(undefined)).toThrow(
			'Invalid query argument. Expected string, instead got undefined'
		);
	});

	it('formats lonely semicolon', () => {
		expect(format(';')).toBe(';');
	});

	it('formats simple SELECT query', () => {
		const result = format('SELECT count(*),Column1 FROM Table1;');
		expect(result).toBe(dedent`
      SELECT
        COUNT(*),
        Column1
      FROM
        Table1;
    `);
	});

	it('formats complex SELECT', () => {
		const result = format(
			"SELECT DISTINCT [name], ROUND(age/7) field1, 18 + 20 AS field2, 'some string' FROM foo;"
		);
		expect(result).toBe(dedent`
      SELECT
        DISTINCT [name],
        ROUND(age / 7) field1,
        18 + 20 AS field2,
        'some string'
      FROM
        foo;
    `);
	});

	it('formats SELECT with complex WHERE', () => {
		const result = format(`
      SELECT * FROM foo WHERE Column1 = 'testing'
      AND ( (Column2 = Column3 OR Column4 >= NOW()) );
    `);
		expect(result).toBe(dedent`
      SELECT
        *
      FROM
        foo
      WHERE
        Column1 = 'testing'
        AND (
          (
            Column2 = Column3
            OR Column4 >= NOW()
          )
        );
    `);
	});

	it('formats SELECT with top level reserved words', () => {
		const result = format(`
      SELECT "select", \`from\`, [Where], foo.else FROM foo WHERE "name" = 'John' GROUP BY some_column
      HAVING [column] > 10 ORDER BY other_column LIMIT 5;
    `);
		expect(result).toBe(dedent`
      SELECT
        "select",
        \`from\`,
        [Where],
        foo.else
      FROM
        foo
      WHERE
        "name" = 'John'
      GROUP BY
        some_column
      HAVING
        [column] > 10
      ORDER BY
        other_column
      LIMIT
        5;
    `);
	});

	it('formats LIMIT with two comma-separated values on single line', () => {
		const result = format('LIMIT 5, 10;');
		expect(result).toBe(dedent`
      LIMIT
        5, 10;
    `);
	});

	it('formats LIMIT of single value followed by another SELECT using commas', () => {
		const result = format('LIMIT 5; SELECT foo, bar;');
		expect(result).toBe(dedent`
      LIMIT
        5;
      SELECT
        foo,
        bar;
    `);
	});

	it('formats LIMIT of single value and OFFSET', () => {
		const result = format('LIMIT 5 OFFSET 8;');
		expect(result).toBe(dedent`
      LIMIT
        5
      OFFSET
        8;
    `);
	});

	it('recognizes LIMIT in lowercase', () => {
		const result = format('limit 5, 10;', { uppercase: false });
		expect(result).toBe(dedent`
      limit
        5, 10;
    `);
	});

	// it('preserves case of keywords', () => {
	// 	const result = format('select distinct * frOM foo WHERe a > 1 and b = 3');
	// 	expect(result).toBe(dedent`
	//     select
	//       distinct *
	//     frOM
	//       foo
	//     WHERe
	//       a > 1
	//       and b = 3
	//   `);
	// });

	it('formats SELECT query with SELECT query inside it', () => {
		const result = format(
			'SELECT *, SUM(*) AS total FROM (SELECT * FROM Posts LIMIT 30) WHERE a > b'
		);
		expect(result).toBe(dedent`
      SELECT
        *,
        SUM(*) AS total
      FROM
      (
        SELECT
          *
        FROM
          Posts
        LIMIT
          30
      )
      WHERE
        a > b
    `);
	});

	it('formats simple INSERT query', () => {
		const result = format(
			"INSERT INTO Customers (ID, MoneyBalance, Address, City) VALUES (12,-123.4, 'Skagen 2111','Stv');"
		);
		expect(result).toBe(dedent`
      INSERT INTO
        Customers (ID, MoneyBalance, Address, City)
      VALUES
        (12, -123.4, 'Skagen 2111', 'Stv');
    `);
	});

	it('formats open paren after comma', () => {
		const result = format(
			'WITH TestIds AS (VALUES (4),(5), (6),(7),(9),(10),(11)) SELECT * FROM TestIds;'
		);
		expect(result).toBe(dedent/* sql */ `
      WITH
        TestIds AS (
          VALUES
            (4),
            (5),
            (6),
            (7),
            (9),
            (10),
            (11)
        )
      SELECT
        *
      FROM
        TestIds;
    `);
	});

	it('keeps short parenthesized list with nested parenthesis on single line', () => {
		const result = format('SELECT (a + b * (c - NOW()));');
		expect(result).toBe(dedent`
      SELECT
        (a + b * (c - NOW()));
    `);
	});

	it('breaks long parenthesized lists to multiple lines', () => {
		const result = format(`
      INSERT INTO some_table (id_product, id_shop, id_currency, id_country, id_registration) (
      SELECT IF(dq.id_discounter_shopping = 2, dq.value, dq.value / 100),
      IF (dq.id_discounter_shopping = 2, 'amount', 'percentage') FROM foo);
    `);
		expect(result).toBe(dedent`
      INSERT INTO
        some_table (
          id_product,
          id_shop,
          id_currency,
          id_country,
          id_registration
        ) (
          SELECT
            IF(
              dq.id_discounter_shopping = 2,
              dq.value,
              dq.value / 100
            ),
            IF (
              dq.id_discounter_shopping = 2,
              'amount',
              'percentage'
            )
          FROM
            foo
        );
    `);
	});

	it('formats simple UPDATE query', () => {
		const result = format(
			"UPDATE Customers SET ContactName='Alfred Schmidt', City='Hamburg' WHERE CustomerName='Alfreds Futterkiste';"
		);
		expect(result).toBe(dedent`
      UPDATE
        Customers
      SET
        ContactName = 'Alfred Schmidt',
        City = 'Hamburg'
      WHERE
        CustomerName = 'Alfreds Futterkiste';
    `);
	});

	it('formats simple DELETE query', () => {
		const result = format("DELETE FROM Customers WHERE CustomerName='Alfred' AND Phone=5002132;");
		expect(result).toBe(dedent`
      DELETE
      FROM
        Customers
      WHERE
        CustomerName = 'Alfred'
        AND Phone = 5002132;
    `);
	});

	it('formats simple DROP query', () => {
		const result = format('DROP TABLE IF EXISTS admin_role;');
		expect(result).toBe(dedent`
      DROP TABLE
        IF EXISTS admin_role;
		`);
	});

	it('formats incomplete query', () => {
		const result = format('SELECT count(');
		expect(result).toBe(dedent`
      SELECT
        COUNT(
    `);
	});

	it('formats UPDATE query with AS part', () => {
		const result = format(
			'UPDATE customers SET total_orders = order_summary.total  FROM ( SELECT * FROM bank) AS order_summary'
		);
		expect(result).toBe(dedent`
      UPDATE
        customers
      SET
        total_orders = order_summary.total
      FROM
      (
        SELECT
          *
        FROM
          bank
      ) AS order_summary
    `);
	});

	it('formats top-level and newline multi-word reserved words with inconsistent spacing', () => {
		const result = format('SELECT * FROM foo LEFT \t   \n JOIN bar ORDER \n BY blah');
		expect(result).toBe(dedent`
      SELECT
        *
      FROM
        foo
        LEFT JOIN bar
      ORDER BY
        blah
    `);
	});

	it('formats long double parenthized queries to multiple lines', () => {
		const result = format("((foo = '0123456789-0123456789-0123456789-0123456789'))");
		expect(result).toBe(dedent`
      (
        (
          foo = '0123456789-0123456789-0123456789-0123456789'
        )
      )
    `);
	});

	it('formats short double parenthized queries to one line', () => {
		const result = format("((foo = 'bar'))");
		expect(result).toBe("((foo = 'bar'))");
	});

	it('formats logical operators', () => {
		expect(format('foo ALL bar')).toBe('foo ALL bar');
		expect(format('foo = ANY (1, 2, 3)')).toBe('foo = ANY (1, 2, 3)');
		expect(format('EXISTS bar')).toBe('EXISTS bar');
		expect(format('foo IN (1, 2, 3)')).toBe('foo IN (1, 2, 3)');
		expect(format("foo LIKE 'hello%'")).toBe("foo LIKE 'hello%'");
		expect(format('foo IS NULL')).toBe('foo IS NULL');
		expect(format('UNIQUE foo')).toBe('UNIQUE foo');
	});

	it('formats AND/OR operators', () => {
		expect(format('foo AND bar')).toBe('foo\nAND bar');
		expect(format('foo OR bar')).toBe('foo\nOR bar');
	});

	it('keeps separation between multiple statements', () => {
		expect(format('foo;bar;')).toBe('foo;\nbar;');
		expect(format('foo\n;bar;')).toBe('foo;\nbar;');
		expect(format('foo\n\n\n;bar;\n\n')).toBe('foo;\nbar;');

		const result = format(`
      SELECT count(*),Column1 FROM Table1;
      SELECT count(*),Column1 FROM Table2;
    `);
		expect(result).toBe(dedent`
      SELECT
        COUNT(*),
        Column1
      FROM
        Table1;
      SELECT
        COUNT(*),
        Column1
      FROM
        Table2;
    `);
	});

	it('formats unicode correctly', () => {
		const result = format('SELECT 结合使用, тест FROM [table];');
		expect(result).toBe(dedent`
      SELECT
        结合使用,
        тест
      FROM
        [table];
    `);
	});

	it('correctly indents create statement after select', () => {
		const result = format(`
      SELECT * FROM test;
      CREATE TABLE test(id NUMBER NOT NULL, col1 VARCHAR2(20), col2 VARCHAR2(20));
    `);
		expect(result).toBe(dedent`
      SELECT
        *
      FROM
        test;
      CREATE TABLE
        test(
          id NUMBER NOT NULL,
          col1 VARCHAR2(20),
          col2 VARCHAR2(20)
        );
    `);
	});

	it('correctly handles floats as single tokens', () => {
		const result = format('SELECT 1e-9 AS a, 1.5e-10 AS b, 3.5E12 AS c, 3.5e12 AS d;');
		expect(result).toBe(dedent`
      SELECT
        1e-9 AS a,
        1.5e-10 AS b,
        3.5E12 AS c,
        3.5e12 AS d;
    `);
	});

	it('does not split UNION ALL in half', () => {
		const result = format(`
      SELECT * FROM tbl1
      UNION ALL
      SELECT * FROM tbl2;
    `);
		expect(result).toBe(dedent/* sql */ `
      SELECT
        *
      FROM
        tbl1
      UNION ALL
      SELECT
        *
      FROM
        tbl2;
    `);
	});
}
