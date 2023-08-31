import dedent from 'dedent-js';

import { FormatFn } from '../../src/sqlFormatter.js';

export default function supportsCommentOn(format: FormatFn) {
  it('formats COMMENT ON ...', () => {
    expect(format(`COMMENT ON TABLE my_table IS 'This is an awesome table.';`)).toBe(dedent`
      COMMENT ON TABLE my_table IS 'This is an awesome table.';
    `);

    expect(format(`COMMENT ON COLUMN my_table.ssn IS 'Social Security Number';`)).toBe(dedent`
      COMMENT ON COLUMN my_table.ssn IS 'Social Security Number';
    `);
  });
}
