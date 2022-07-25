import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter';

interface Options {
  without?: string[];
  additionally?: string[];
  supportsUsing?: boolean;
  supportsApply?: boolean;
}

export default function supportsJoin(
  format: FormatFn,
  { without, additionally, supportsUsing = true, supportsApply }: Options = {}
) {
  const unsupportedJoinRegex = without ? new RegExp(without.join('|'), 'u') : /^whateve_!%&$/u;
  const isSupportedJoin = (join: string) => !unsupportedJoinRegex.test(join);

  [
    'JOIN',
    'INNER JOIN',
    'CROSS JOIN',
    'LEFT JOIN',
    'LEFT OUTER JOIN',
    'RIGHT JOIN',
    'RIGHT OUTER JOIN',
    'FULL JOIN',
    'FULL OUTER JOIN',
    'NATURAL JOIN',
    'NATURAL INNER JOIN',
    'NATURAL LEFT JOIN',
    'NATURAL LEFT OUTER JOIN',
    'NATURAL RIGHT JOIN',
    'NATURAL RIGHT OUTER JOIN',
    'NATURAL FULL JOIN',
    'NATURAL FULL OUTER JOIN',
    ...(additionally || []),
  ]
    .filter(isSupportedJoin)
    .forEach(join => {
      it(`supports ${join}`, () => {
        const result = format(`
          SELECT * FROM customers
          ${join} orders ON customers.customer_id = orders.customer_id
          ${join} items ON items.id = orders.id;
        `);
        expect(result).toBe(dedent`
          SELECT
            *
          FROM
            customers
            ${join} orders ON customers.customer_id = orders.customer_id
            ${join} items ON items.id = orders.id;
        `);
      });
    });

  it('properly uppercases JOIN ... ON', () => {
    const result = format(`select * from customers join foo on foo.id = customers.id;`, {
      keywordCase: 'upper',
    });
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        customers
        JOIN foo ON foo.id = customers.id;
    `);
  });

  if (supportsUsing) {
    it('properly uppercases JOIN ... USING', () => {
      const result = format(`select * from customers join foo using (id);`, {
        keywordCase: 'upper',
      });
      expect(result).toBe(dedent`
        SELECT
          *
        FROM
          customers
          JOIN foo USING (id);
      `);
    });
  }

  if (supportsApply) {
    ['CROSS APPLY', 'OUTER APPLY'].forEach(apply => {
      // TODO: improve formatting of custom functions
      it(`supports ${apply}`, () => {
        const result = format(`SELECT * FROM customers ${apply} fn(customers.id)`);
        expect(result).toBe(dedent`
          SELECT
            *
          FROM
            customers
            ${apply} fn (customers.id)
        `);
      });
    });
  }
}
