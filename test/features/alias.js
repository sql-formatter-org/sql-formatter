import dedent from 'dedent-js';

/**
 * Tests support for alias options
 * @param {Function} format
 */
export default function supportsAliases(format) {
	it('supports always mode', () => {
		expect(
			format('SELECT a a_column, b AS bColumn FROM ( SELECT * FROM x ) y WHERE z;', {
				aliasAs: 'always',
			})
		).toBe(
			dedent(`
			SELECT
			  a AS a_column,
			  b AS bColumn
			FROM
			(
			  SELECT
			    *
			  FROM
			    x
			) AS y
			WHERE
			  z;
			`)
		);
	});

	it('supports never mode', () => {
		expect(
			format('SELECT a a_column, b AS bColumn FROM ( SELECT * FROM x ) y WHERE z;', {
				aliasAs: 'never',
			})
		).toBe(
			dedent(`
			SELECT
			  a a_column,
			  b bColumn
			FROM
			(
			  SELECT
			    *
			  FROM
			    x
			) y
			WHERE
			  z;
			`)
		);
	});

	it('supports select only mode', () => {
		expect(
			format('SELECT a a_column, b AS bColumn FROM ( SELECT * FROM x ) y WHERE z;', {
				aliasAs: 'select',
			})
		).toBe(
			dedent(`
			SELECT
			  a AS a_column,
			  b AS bColumn
			FROM
			(
			  SELECT
			    *
			  FROM
			    x
			) y
			WHERE
			  z;
			`)
		);
	});

	it('does not format non select clauses', () => {
		expect(format('CREATE TABLE items (a INT PRIMARY KEY, b TEXT);')).toBe(
			'CREATE TABLE items (a INT PRIMARY KEY, b TEXT);'
		);
	});

	it('tabulates alias with aliasAs on', () => {
		const result = format(
			'SELECT alpha AS A, MAX(beta), epsilon E FROM ( SELECT mu AS m, iota i FROM gamma );',
			{ tabulateAlias: true }
		);

		expect(result).toBe(
			dedent`
				SELECT
				  alpha     AS A,
				  MAX(beta),
				  epsilon   AS E
				FROM
				  (
				    SELECT
				      mu   AS m,
				      iota AS i
				    FROM
				      gamma
				  );
			`
		);
	});

	it('accepts tabular alias with aliasAs on', () => {
		const result = format(
			dedent`
				SELECT
				  alpha     AS A,
				  MAX(beta),
				  epsilon   AS E
				FROM
				  (
				    SELECT
				      mu   AS m,
				      iota AS i
				    FROM
				      gamma
				  );
			`
		);

		expect(result).toBe(
			dedent`
				SELECT
				  alpha AS A,
				  MAX(beta),
				  epsilon AS E
				FROM
				  (
				    SELECT
				      mu AS m,
				      iota AS i
				    FROM
				      gamma
				  );
			`
		);
	});

	it('tabulates alias with aliasAs off', () => {
		const result = format(
			'SELECT alpha AS A, MAX(beta), epsilon E FROM ( SELECT mu AS m, iota i FROM gamma );',
			{ tabulateAlias: true, aliasAs: 'never' }
		);

		expect(result).toBe(
			dedent`
				SELECT
				  alpha     A,
				  MAX(beta),
				  epsilon   E
				FROM
				  (
				    SELECT
				      mu   m,
				      iota i
				    FROM
				      gamma
				  );
			`
		);
	});

	it('accepts tabular alias with aliasAs off', () => {
		const result = format(
			dedent`
				SELECT
				  alpha     A,
				  MAX(beta),
				  epsilon   E
				FROM
				  (
				    SELECT
				      mu   m,
				      iota i
				    FROM
				      gamma
				  );
			`
		);

		expect(result).toBe(
			dedent`
				SELECT
				  alpha AS A,
				  MAX(beta),
				  epsilon AS E
				FROM
				  (
				    SELECT
				      mu AS m,
				      iota AS i
				    FROM
				      gamma
				  );
			`
		);
	});
}
