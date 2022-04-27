import dedent from 'dedent-js';

import { itIf } from '../utils';

/**
 * Tests support for ALTER TABLE syntax
 * @param {string} language
 * @param {Function} format
 */
export default function supportsAlterTable(language, format) {
  itIf(language !== 'bigquery')('formats ALTER TABLE ... ALTER COLUMN query', () => {
    const result = format('ALTER TABLE supplier ALTER COLUMN supplier_name VARCHAR(100) NOT NULL;');
    expect(result).toBe(dedent`
      ALTER TABLE
        supplier
      ALTER COLUMN
        supplier_name VARCHAR(100) NOT NULL;
    `);
  });
}
