import dedent from 'dedent-js';

import { FormatFn } from '../../src/sqlFormatter.js';

export default function supportsOnConflict(format: FormatFn) {
  // Regression test for issue #535
  it('supports INSERT .. ON CONFLICT syntax', () => {
    expect(format(`INSERT INTO tbl VALUES (1,'Blah') ON CONFLICT DO NOTHING;`)).toBe(dedent`
      INSERT INTO
        tbl
      VALUES
        (1, 'Blah')
      ON CONFLICT DO NOTHING;
    `);
  });
}
