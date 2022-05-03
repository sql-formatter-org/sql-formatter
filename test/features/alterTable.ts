import dedent from 'dedent-js';
import { FormatFn, SqlLanguage } from '../../src/sqlFormatter';

export default function supportsAlterTable(language: SqlLanguage, format: FormatFn) {
  it('formats ALTER TABLE ... ALTER COLUMN query', () => {
    const result = format('ALTER TABLE supplier ALTER COLUMN supplier_name VARCHAR(100) NOT NULL;');
    expect(result).toBe(dedent`
      ALTER TABLE
        supplier
      ALTER COLUMN
        supplier_name VARCHAR(100) NOT NULL;
    `);
  });
}
