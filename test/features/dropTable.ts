import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter';

export default function supportsDropTable(format: FormatFn) {
  it('formats DROP TABLE statement', () => {
    const result = format('DROP TABLE admin_role;');
    expect(result).toBe(dedent`
      DROP TABLE
        admin_role;
    `);
  });
}
