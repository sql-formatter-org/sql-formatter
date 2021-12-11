import dedent from 'dedent-js';
import { NewlineMode } from '../../src/types';

/**
 * Tests support for alias options
 * @param {Function} format
 */
export default function supportsAliases(format) {
	const baseQuery = 'SELECT a a_column, b AS bColumn FROM ( SELECT * FROM x ) y WHERE z;';

	it('supports always mode', () => {
		expect(format(baseQuery, { aliasAs: 'always' })).toBe(
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
		expect(format(baseQuery, { aliasAs: 'never' })).toBe(
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
		expect(format(baseQuery, { aliasAs: 'select' })).toBe(
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
		expect(
			format('CREATE TABLE tbl (a INT PRIMARY KEY, b TEXT);', {
				newline: { mode: NewlineMode.never },
			})
		).toBe('CREATE TABLE tbl (a INT PRIMARY KEY, b TEXT);');
	});

	const tabularBaseQueryWithAlias =
		'SELECT alpha AS A, MAX(beta), epsilon E FROM ( SELECT mu AS m, iota i FROM gamma );';

	const tabularFinalQueryWithAlias = dedent`
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
  `;

	const finalQueryWithAlias = dedent`
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
  `;

	const tabularFinalQueryNoAlias = dedent`
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
  `;

	it('tabulates alias with aliasAs on', () => {
		const result = format(tabularBaseQueryWithAlias, { tabulateAlias: true });
		expect(result).toBe(tabularFinalQueryWithAlias);
	});

	it('accepts tabular alias with aliasAs on', () => {
		const result = format(tabularFinalQueryWithAlias);

		expect(result).toBe(finalQueryWithAlias);
	});

	it('tabulates alias with aliasAs off', () => {
		const result = format(tabularBaseQueryWithAlias, { tabulateAlias: true, aliasAs: 'never' });

		expect(result).toBe(tabularFinalQueryNoAlias);
	});

	it('accepts tabular alias with aliasAs off', () => {
		const result = format(tabularFinalQueryNoAlias);

		expect(result).toBe(finalQueryWithAlias);
	});

	it('handles edge case of newline.never', () => {
		const result = format(
			dedent`SELECT alpha AS A, MAX(beta), epsilon E FROM ( SELECT mu AS m, iota i FROM gamma );`,
			{ newline: { mode: 'never' }, tabulateAlias: true }
		);

		expect(result).toBe(dedent`
      SELECT alpha AS A, MAX(beta), epsilon AS E
      FROM (
        SELECT mu AS m, iota AS i
        FROM gamma
      );
    `);
	});

	it('handles edge case of tenSpaceLeft', () => {
		const result = format(
			dedent`SELECT alpha AS A, MAX(beta), epsilon E FROM ( SELECT mu AS m, iota i FROM gamma );`,
			{ keywordPosition: 'tenSpaceLeft', tabulateAlias: true }
		);

		expect(result).toBe(dedent`
      SELECT    alpha     AS A,
                MAX(beta),
                epsilon   AS E
      FROM      (
                SELECT    mu   AS m,
                          iota AS i
                FROM      gamma
                );
    `);
	});

	it('handles edge case of tenSpaceRight', () => {
		const result = format(
			dedent`SELECT alpha AS A, MAX(beta), epsilon E FROM ( SELECT mu AS m, iota i FROM gamma );`,
			{ keywordPosition: 'tenSpaceRight', tabulateAlias: true }
		);

		expect(result).toBe(
			[
				'   SELECT alpha     AS A,',
				'          MAX(beta),',
				'          epsilon   AS E',
				'     FROM (',
				'             SELECT mu   AS m,',
				'                    iota AS i',
				'               FROM gamma',
				'          );',
			].join('\n')
		);
	});
}
