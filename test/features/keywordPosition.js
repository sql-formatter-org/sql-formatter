import dedent from 'dedent-js';

/**
 * Tests support for keyword positions
 * @param {Function} format
 */
export default function supportsKeywordPositions(format) {
	const baseQuery = `
		SELECT COUNT(a.column1), MAX(b.column2 + b.column3), b.column4 AS four
		FROM ( SELECT column1, column5 FROM table1 ) a
		JOIN table2 b ON a.column5 = b.column5
		WHERE column6 AND column7
		GROUP BY column4;
	`;

	it('supports standard mode', () => {
		const result = format(baseQuery, {
			keywordPosition: 'standard',
		});
		expect(result).toBe(
			dedent(`
				SELECT
				  COUNT(a.column1),
				  MAX(b.column2 + b.column3),
				  b.column4 AS four
				FROM
				(
				  SELECT
				    column1,
				    column5
				  FROM
				    table1
				) a
				JOIN table2 b
				ON a.column5 = b.column5
				WHERE
				  column6
				  AND column7
				GROUP BY
				  column4;
			`)
		);
	});

	it('supports tenSpaceLeft mode', () => {
		const result = format(baseQuery, {
			keywordPosition: 'tenSpaceLeft',
		});
		expect(result).toBe(
			dedent(`
			SELECT    COUNT(a.column1),
			          MAX(b.column2 + b.column3),
			          b.column4 AS four
			FROM      (
			          SELECT    column1,
			                    column5
			          FROM      table1
			          ) a
			JOIN      table2 b
			ON        a.column5 = b.column5
			WHERE     column6
			AND       column7
			GROUP BY  column4;
			`)
		);
	});

	it('supports tenSpaceRight mode', () => {
		const result = format(baseQuery, {
			keywordPosition: 'tenSpaceRight',
		});
		expect(result).toBe(
			[
				'   SELECT COUNT(a.column1),',
				'          MAX(b.column2 + b.column3),',
				'          b.column4 AS four',
				'     FROM (',
				'             SELECT column1,',
				'                    column5',
				'               FROM table1',
				'          ) a',
				'     JOIN table2 b',
				'       ON a.column5 = b.column5',
				'    WHERE column6',
				'      AND column7',
				' GROUP BY column4;',
			].join('\n')
		);
	});
}
