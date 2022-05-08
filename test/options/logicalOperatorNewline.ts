import dedent from 'dedent-js';
import { LogicalOperatorNewline } from '../../src/types';
import { FormatFn, SqlLanguage } from '../../src/sqlFormatter';

export default function supportsLogicalOperatorNewline(language: SqlLanguage, format: FormatFn) {
  it('by default adds newline before logical operator', () => {
    const result = format('SELECT a WHERE true AND false;');
    expect(result).toBe(dedent`
      SELECT
        a
      WHERE
        true
        AND false;
    `);
  });

  it('supports newline after logical operator', () => {
    const result = format('SELECT a WHERE true AND false;', {
      logicalOperatorNewline: LogicalOperatorNewline.after,
    });
    expect(result).toBe(dedent`
      SELECT
        a
      WHERE
        true AND
        false;
    `);
  });
}
