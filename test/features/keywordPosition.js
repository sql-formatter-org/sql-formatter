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

	const standardResult = dedent(`
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
    `);

	const tenSpaceLeftResult = dedent(`
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
    `);

	const tenSpaceRightResult = [
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
	].join('\n');

	it('supports standard mode', () => {
		const result = format(baseQuery, { keywordPosition: 'standard' });
		expect(result).toBe(standardResult);
	});

	it('supports tenSpaceLeft mode', () => {
		const result = format(baseQuery, { keywordPosition: 'tenSpaceLeft' });
		expect(result).toBe(tenSpaceLeftResult);
	});

	it('accepts tenSpaceLeft mode', () => expect(format(tenSpaceLeftResult)).toBe(standardResult));

	it('supports tenSpaceRight mode', () => {
		const result = format(baseQuery, { keywordPosition: 'tenSpaceRight' });
		expect(result).toBe(tenSpaceRightResult);
	});

	it('accepts tenSpaceRight mode', () => expect(format(tenSpaceRightResult)).toBe(standardResult));

	it('handles long keyword', () => {
		expect(
			format(
				dedent`
          SELECT *
          FROM a
          UNION DISTINCT
          SELECT *
          FROM b
          LEFT OUTER JOIN c;
        `,
				{ keywordPosition: 'tenSpaceLeft' }
			)
		).toBe(dedent`
      SELECT    *
      FROM      a
      UNION     DISTINCT
      SELECT    *
      FROM      b
      LEFT      OUTER JOIN c;
    `);
	});
}
