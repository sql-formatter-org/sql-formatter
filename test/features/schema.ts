import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter';

export default function supportsSchema(format: FormatFn) {
  it('formats simple SET SCHEMA statements', () => {
    const result = format('SET SCHEMA schema1;');
    expect(result).toBe(dedent`
      SET SCHEMA schema1;
    `);
  });
}
