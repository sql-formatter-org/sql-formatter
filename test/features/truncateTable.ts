import dedent from 'dedent-js';

import { FormatFn } from '../../src/sqlFormatter.js';

interface TruncateTableConfig {
  withTable?: boolean;
  withoutTable?: boolean;
}

export default function supportsTruncateTable(
  format: FormatFn,
  { withTable = true, withoutTable }: TruncateTableConfig = {}
) {
  if (withTable) {
    it('formats TRUNCATE TABLE statement', () => {
      const result = format('TRUNCATE TABLE Customers;');
      expect(result).toBe(dedent`
        TRUNCATE TABLE Customers;
      `);
    });
  }

  if (withoutTable) {
    it('formats TRUNCATE statement (without TABLE)', () => {
      const result = format('TRUNCATE Customers;');
      expect(result).toBe(dedent`
        TRUNCATE Customers;
      `);
    });
  }
}
