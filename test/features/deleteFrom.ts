import dedent from 'dedent-js';
import { FormatFn, SqlLanguage } from '../../src/sqlFormatter';

export default function supportsDeleteFrom(language: SqlLanguage, format: FormatFn) {
  it('formats simple DELETE FROM statement', () => {
    const result = format("DELETE FROM Customers WHERE CustomerName='Alfred' AND Phone=5002132;");
    expect(result).toBe(dedent`
      DELETE FROM
        Customers
      WHERE
        CustomerName = 'Alfred'
        AND Phone = 5002132;
    `);
  });
}
