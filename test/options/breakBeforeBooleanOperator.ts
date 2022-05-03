import dedent from 'dedent-js';
import { FormatFn, SqlLanguage } from '../../src/sqlFormatter';

export default function supportsBreakBeforeBooleanOperator(
  language: SqlLanguage,
  format: FormatFn
) {
  it('by default adds newline before boolean operator', () => {
    const result = format('SELECT a WHERE true AND false;');
    expect(result).toBe(dedent`
      SELECT
        a
      WHERE
        true
        AND false;
    `);
  });

  it('supports newline after boolean operator', () => {
    const result = format('SELECT a WHERE true AND false;', {
      breakBeforeBooleanOperator: false,
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
