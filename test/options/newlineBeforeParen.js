import dedent from 'dedent-js';

export default function supportsNewlineBeforeParen(language, format) {
  it('defaults to newline before opening and closing parenthesis', () => {
    const result = format('SELECT a FROM ( SELECT b FROM c );');
    expect(result).toBe(dedent`
      SELECT
        a
      FROM
      (
        SELECT
          b
        FROM
          c
      );
    `);
  });

  it('supports opening parenthesis on same line', () => {
    const result = format('SELECT a FROM ( SELECT b FROM c );', {
      newlineBeforeOpenParen: false,
    });
    expect(result).toBe(dedent`
      SELECT
        a
      FROM (
        SELECT
          b
        FROM
          c
      );
    `);
  });

  it('supports closing parenthesis on same line', () => {
    const result = format('SELECT a FROM ( SELECT b FROM c );', {
      newlineBeforeCloseParen: false,
    });
    expect(result).toBe(dedent`
      SELECT
        a
      FROM
      (
        SELECT
          b
        FROM
          c );
    `);
  });

  it('supports both opening and closing parenthesis on same line', () => {
    const result = format('SELECT a FROM ( SELECT b FROM c );', {
      newlineBeforeOpenParen: false,
      newlineBeforeCloseParen: false,
    });
    expect(result).toBe(dedent`
      SELECT
        a
      FROM (
        SELECT
          b
        FROM
          c );
    `);
  });
}