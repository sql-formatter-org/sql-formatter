import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter.js';

interface DropTableConfig {
  ifExists?: boolean;
}

export default function supportsDropTable(format: FormatFn, { ifExists }: DropTableConfig = {}) {
  it('formats DROP TABLE statement', () => {
    const result = format('DROP TABLE admin_role;');
    expect(result).toBe(dedent`
      DROP TABLE
        admin_role;
    `);
  });

  if (ifExists) {
    it('formats DROP TABLE IF EXISTS statement', () => {
      const result = format('DROP TABLE IF EXISTS admin_role;');
      expect(result).toBe(dedent`
        DROP TABLE IF EXISTS
          admin_role;
      `);
    });
  }
}
