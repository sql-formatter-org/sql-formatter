import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter';

interface DeleteFromConfig {
  withoutFrom?: boolean;
}

export default function supportsDeleteFrom(
  format: FormatFn,
  { withoutFrom }: DeleteFromConfig = {}
) {
  it('formats DELETE FROM statement', () => {
    const result = format("DELETE FROM Customers WHERE CustomerName='Alfred' AND Phone=5002132;");
    expect(result).toBe(dedent`
      DELETE FROM
        Customers
      WHERE
        CustomerName = 'Alfred'
        AND Phone = 5002132;
    `);
  });

  if (withoutFrom) {
    it('formats DELETE statement (without FROM)', () => {
      const result = format("DELETE Customers WHERE CustomerName='Alfred';");
      expect(result).toBe(dedent`
        DELETE
          Customers
        WHERE
          CustomerName = 'Alfred';
      `);
    });
  }
}
