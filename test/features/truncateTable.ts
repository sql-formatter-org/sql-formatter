import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter';

interface TruncateTableConfig {
  ifExists?: boolean;
  withoutTable?: boolean;
}

export default function supportsTruncateTable(
  format: FormatFn,
  { ifExists, withoutTable }: TruncateTableConfig = {}
) {
  it('formats TRUNCATE TABLE statement', () => {
    const result = format('TRUNCATE TABLE Customers;');
    expect(result).toBe(dedent`
      TRUNCATE TABLE
        Customers;
    `);
  });

  if (ifExists) {
    it('formats TRUNCATE TABLE IF EXISTS statments', () => {
      const result = format('TRUNCATE TABLE IF EXISTS Customers;');
      expect(result).toBe(dedent`
        TRUNCATE TABLE IF EXISTS
          Customers;
      `);
    });
  }

  if (withoutTable) {
    it('formats TRUNCATE statement (without TABLE)', () => {
      const result = format('TRUNCATE Customers;');
      expect(result).toBe(dedent`
        TRUNCATE
          Customers;
      `);
    });
  }
}
