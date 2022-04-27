import dedent from 'dedent-js';

/**
 * Tests support for various joins
 * @param {Function} format
 * @param {Object} opts
 * @param {String[]} opts.without
 * @param {String[]} opts.additionally
 */
export default function supportsJoin(format, { without, additionally } = {}) {
	const unsupportedJoinRegex = without ? new RegExp(without.join('|'), 'u') : /^whateve_!%&$/u;
	const isSupportedJoin = join => !unsupportedJoinRegex.test(join);

	['CROSS JOIN', 'NATURAL JOIN'].filter(isSupportedJoin).forEach(join => {
		it(`supports ${join}`, () => {
			const result = format(`SELECT * FROM tbl1 ${join} tbl2`);
			expect(result).toBe(dedent`
        SELECT
          *
        FROM
          tbl1
          ${join} tbl2
      `);
		});
	});

	// <join> ::= [ <join type> ] JOIN
	//
	// <join type> ::= INNER | <outer join type> [ OUTER ]
	//
	// <outer join type> ::= LEFT | RIGHT | FULL

	[
		'JOIN',
		'INNER JOIN',
		'LEFT JOIN',
		'LEFT OUTER JOIN',
		'RIGHT JOIN',
		'RIGHT OUTER JOIN',
		'FULL JOIN',
		'FULL OUTER JOIN',
		...(additionally || []),
	]
		.filter(isSupportedJoin)
		.forEach(join => {
			it(`supports ${join}`, () => {
				const result = format(`
          SELECT customer_id.from, COUNT(order_id) AS total FROM customers
          ${join} orders ON customers.customer_id = orders.customer_id;
        `);
				expect(result).toBe(dedent`
          SELECT
            customer_id.from,
            COUNT(order_id) AS total
          FROM
            customers
            ${join} orders
            ON customers.customer_id = orders.customer_id;
        `);
			});
		});
}
