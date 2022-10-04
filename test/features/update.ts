import dedent from 'dedent-js';

import { FormatFn } from '../../src/sqlFormatter.js';

interface UpdateConfig {
  whereCurrentOf?: boolean;
}

export default function supportsUpdate(format: FormatFn, { whereCurrentOf }: UpdateConfig = {}) {
  it('formats simple UPDATE statement', () => {
    const result = format(
      "UPDATE Customers SET ContactName='Alfred Schmidt', City='Hamburg' WHERE CustomerName='Alfreds Futterkiste';"
    );
    expect(result).toBe(dedent`
      UPDATE Customers
      SET
        ContactName = 'Alfred Schmidt',
        City = 'Hamburg'
      WHERE
        CustomerName = 'Alfreds Futterkiste';
    `);
  });

  it('formats UPDATE statement with AS part', () => {
    const result = format(
      'UPDATE customers SET total_orders = order_summary.total  FROM ( SELECT * FROM bank) AS order_summary'
    );
    expect(result).toBe(dedent`
      UPDATE customers
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

  if (whereCurrentOf) {
    it('formats UPDATE statement with cursor position', () => {
      const result = format("UPDATE Customers SET Name='John' WHERE CURRENT OF my_cursor;");
      expect(result).toBe(dedent`
        UPDATE Customers
        SET
          Name = 'John'
        WHERE CURRENT OF my_cursor;
      `);
    });
  }
}
