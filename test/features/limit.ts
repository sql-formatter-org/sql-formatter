import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter';

export default function supportsLimit(format: FormatFn) {
  it('formats LIMIT with two comma-separated values on single line', () => {
    const result = format('LIMIT 5, 10;');
    expect(result).toBe(dedent`
      LIMIT
        5, 10;
    `);
  });

  it('formats LIMIT of single value and OFFSET', () => {
    const result = format('LIMIT 5 OFFSET 8;');
    expect(result).toBe(dedent`
      LIMIT
        5
      OFFSET
        8;
    `);
  });

  // Regression test for #303
  it('formats LIMIT with complex expressions', () => {
    const result = format('LIMIT abs(-5) - 1, (2 + 3) * 5;');
    expect(result).toBe(dedent`
      LIMIT
        abs(-5) - 1, (2 + 3) * 5;
    `);
  });

  // Regression test for #301
  it('formats LIMIT with comments', () => {
    const result = format('LIMIT --comment\n 5,--comment\n6;');
    expect(result).toBe(dedent`
      LIMIT
        --comment
        5, --comment
        6;
    `);
  });
}
