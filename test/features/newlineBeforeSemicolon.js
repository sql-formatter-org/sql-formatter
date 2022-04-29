import dedent from 'dedent-js';

export default function supportsNewlineBeforeSemicolon(language, format) {
  it('defaults to semicolon on end of last line', () => {
    const result = format(`SELECT a FROM b;`);
    expect(result).toBe(dedent`
      SELECT
        a
      FROM
        b;
    `);
  });

  it('supports semicolon on separate line', () => {
    const result = format(`SELECT a FROM b;`, { newlineBeforeSemicolon: true });
    expect(result).toBe(dedent`
      SELECT
        a
      FROM
        b
      ;
    `);
  });
}
