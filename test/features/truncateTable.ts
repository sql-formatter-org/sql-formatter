import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter.js';

interface TruncateTableConfig {
  withoutTable?: boolean;
}

export default function supportsTruncateTable(
  format: FormatFn,
  { withoutTable }: TruncateTableConfig = {}
) {
  it('formats TRUNCATE TABLE statement', () => {
    const result = format('TRUNCATE TABLE Customers;');
    expect(result).toBe(dedent`
      TRUNCATE TABLE
        Customers;
    `);
  });

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
