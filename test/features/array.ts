import dedent from 'dedent-js';
import { SqlLanguage, FormatFn } from '../../src/sqlFormatter';

export default function supportsArray(language: SqlLanguage, format: FormatFn) {
  it('supports square brackets for array indexing', () => {
    const result = format(`SELECT order_lines[5].productId;`);
    expect(result).toBe(dedent`
      SELECT
        order_lines[5].productId;
    `);
  });
}
