import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter';

interface CommentsConfig {
  hashComments?: boolean;
  nestedBlockComments?: boolean;
}

export default function supportsComments(format: FormatFn, opts: CommentsConfig = {}) {
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
      SELECT a FROM b --comment
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
        (
          a --comment
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

  it('preserves single-line comments at the end of lines', () => {
    expect(
      format(`
        SELECT
          a, --comment1
          b --comment2
        FROM --comment3
          my_table;
      `)
    ).toBe(dedent`
      SELECT
        a, --comment1
        b --comment2
      FROM --comment3
        my_table;
    `);
  });

  it('preserves single-line comments on separate lines', () => {
    expect(
      format(`
        SELECT
          --comment1
          a,
          --comment2
          b
        FROM
          --comment3
          my_table;
      `)
    ).toBe(dedent`
      SELECT
        --comment1
        a,
        --comment2
        b
      FROM
        --comment3
        my_table;
    `);
  });

  it('recognizes line-comments with Windows line-endings (converts them to UNIX)', () => {
    const result = format('SELECT * FROM\r\n-- line comment 1\r\nMyTable -- line comment 2\r\n');
    expect(result).toBe('SELECT\n  *\nFROM\n  -- line comment 1\n  MyTable -- line comment 2');
  });

  it('does not detect unclosed comment as a comment', () => {
    const result = format(`
      SELECT count(*)
      /*SomeComment
    `);
    expect(result).toBe(dedent`
      SELECT
        count(*) / * SomeComment
    `);
  });

  it('formats comments between function name and parenthesis', () => {
    const result = format(`
      SELECT count /* comment */ (*);
    `);
    expect(result).toBe(dedent`
      SELECT
        count
        /* comment */
        (*);
    `);
  });

  it('formats comments between qualified.names', () => {
    const result = format(`
      SELECT foo. /* com1 */ bar, foo. /* com2 */ *;
    `);
    expect(result).toBe(dedent`
      SELECT
        foo.
        /* com1 */
        bar,
        foo.
        /* com2 */
        *;
    `);
  });

  if (opts.hashComments) {
    it('supports # line comment', () => {
      const result = format('SELECT alpha # commment\nFROM beta');
      expect(result).toBe(dedent`
        SELECT
          alpha # commment
        FROM
          beta
      `);
    });
  }

  if (opts.nestedBlockComments) {
    it('supports nested block comments', () => {
      const result = format('SELECT alpha /* /* commment */ */ FROM beta');
      expect(result).toBe(dedent`
        SELECT
          alpha
          /* /* commment */ */
        FROM
          beta
      `);
    });
  }
}
