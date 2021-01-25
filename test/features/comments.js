import dedent from 'dedent-js';

/**
 * Tests for standard -- and /* *\/ comments
 * @param {Function} format
 */
export default function supportsComments(format) {
  it('formats SELECT query with different comments', () => {
    const result = format(dedent`
      SELECT
      /*
       * This is a block comment
       */
      * FROM
      -- This is another comment
      MyTable -- One final comment
      WHERE 1 = 2;
    `);
    expect(result).toBe(dedent`
      SELECT
        /*
         * This is a block comment
         */
        *
      FROM
        -- This is another comment
        MyTable -- One final comment
      WHERE
        1 = 2;
    `);
  });

  it('maintains block comment indentation', () => {
    const sql = dedent`
      SELECT
        /*
         * This is a block comment
         */
        *
      FROM
        MyTable
      WHERE
        1 = 2;
    `;
    expect(format(sql)).toBe(sql);
  });

  it('formats tricky line comments', () => {
    expect(format('SELECT a--comment, here\nFROM b--comment')).toBe(dedent`
      SELECT
        a --comment, here
      FROM
        b --comment
    `);
  });

  it('formats line comments followed by semicolon', () => {
    expect(
      format(`
      SELECT a FROM b
      --comment
      ;
    `)
    ).toBe(dedent`
      SELECT
        a
      FROM
        b --comment
      ;
    `);
  });

  it('formats line comments followed by comma', () => {
    expect(
      format(dedent`
      SELECT a --comment
      , b
    `)
    ).toBe(dedent`
      SELECT
        a --comment
      ,
        b
    `);
  });

  it('formats line comments followed by close-paren', () => {
    expect(format('SELECT ( a --comment\n )')).toBe(dedent`
      SELECT
        (a --comment
      )
    `);
  });

  it('formats line comments followed by open-paren', () => {
    expect(format('SELECT a --comment\n()')).toBe(dedent`
      SELECT
        a --comment
        ()
    `);
  });

  it('recognizes line-comments with Windows line-endings (converts them to UNIX)', () => {
    const result = format('SELECT * FROM\r\n-- line comment 1\r\nMyTable -- line comment 2\r\n');
    expect(result).toBe('SELECT\n  *\nFROM\n  -- line comment 1\n  MyTable -- line comment 2');
  });

  it('formats query that ends with open comment', () => {
    const result = format(`
      SELECT count(*)
      /*Comment
    `);
    expect(result).toBe(dedent`
      SELECT
        count(*)
        /*Comment
    `);
  });
}
