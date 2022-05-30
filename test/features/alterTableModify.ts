import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter';

export default function supportsAlterTableModify(format: FormatFn) {
  it('formats ALTER TABLE ... MODIFY statement', () => {
    const result = format('ALTER TABLE supplier MODIFY supplier_name char(100) NOT NULL;');
    expect(result).toBe(dedent`
      ALTER TABLE
        supplier
      MODIFY
        supplier_name char(100) NOT NULL;
    `);
  });
}
