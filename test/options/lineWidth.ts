import dedent from 'dedent-js';
import { FormatFn, SqlLanguage } from '../../src/sqlFormatter';

export default function supportsLineWidth(language: SqlLanguage, format: FormatFn) {
  it('throws error when lineWidth negative number', () => {
    expect(() => {
      format('SELECT *', { lineWidth: -2 });
    }).toThrowErrorMatchingInlineSnapshot(
      `"lineWidth config must be positive number. Received -2 instead."`
    );
  });

  it('throws error when lineWidth is zero', () => {
    expect(() => {
      format('SELECT *', { lineWidth: 0 });
    }).toThrowErrorMatchingInlineSnapshot(
      `"lineWidth config must be positive number. Received 0 instead."`
    );
  });

  it('breaks paranthesize expressions to multiple lines when they exceed lineWidth', () => {
    const result = format('SELECT (price * tax) AS total FROM table_name WHERE (amount > 25);', {
      lineWidth: 10,
    });
    expect(result).toBe(dedent`
      SELECT
        (
          price * tax
        ) AS total
      FROM
        table_name
      WHERE
        (
          amount > 25
        );
    `);
  });
}
