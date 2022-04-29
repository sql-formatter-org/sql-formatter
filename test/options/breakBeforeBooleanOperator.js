import dedent from 'dedent-js';

export default function supportsBreakBeforeBooleanOperator(language, format) {
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
