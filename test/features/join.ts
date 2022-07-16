import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter';

type Options = { without?: string[]; additionally?: string[] };

export default function supportsJoin(format: FormatFn, { without, additionally }: Options = {}) {
  const unsupportedJoinRegex = without ? new RegExp(without.join('|'), 'u') : /^whateve_!%&$/u;
  const isSupportedJoin = (join: string) => !unsupportedJoinRegex.test(join);

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
          SELECT * FROM customers
          ${join} orders ON customers.customer_id = orders.customer_id
          ${join} items USING (item_id, name);
        `);
        expect(result).toBe(dedent`
          SELECT
            *
          FROM
            customers
            ${join} orders ON customers.customer_id = orders.customer_id
            ${join} items USING (item_id, name);
        `);
      });
    });

  it('properly uppercases JOIN, ON and USING', () => {
    const result = format(
      `select * from customers join foo on foo.id = customers.id join foobar using (id);`,
      { keywordCase: 'upper' }
    );
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        customers
        JOIN foo ON foo.id = customers.id
        JOIN foobar USING (id);
    `);
  });
}
