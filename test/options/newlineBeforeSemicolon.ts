import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter';

export default function supportsNewlineBeforeSemicolon(format: FormatFn) {
  it('formats lonely semicolon', () => {
    expect(format(';')).toBe(';');
  });

  it('does not add newline before lonely semicolon when newlineBeforeSemicolon:true', () => {
    expect(format(';', { newlineBeforeSemicolon: true })).toBe(';');
  });

  it('defaults to semicolon on end of last line', () => {
    const result = format(`SELECT a FROM b;`);
    expect(result).toBe(dedent`
      SELECT
        a
      FROM
        b;
    `);
  });

  // A regression test for semicolon placement in single-line clauses like:
  //
  //   ALTER TABLE
  //     my_table
  //   ALTER COLUMN
  //     foo
  //   DROP DEFAULT;  <-- here
  //
  // Unfortunately there's really no such single-line clause that exists in all dialects,
  // so our test resorts to using somewhat invalid SQL.
  it('places semicolon on the same line as a single-line clause', () => {
    const result = format(`SELECT a FROM;`);
    expect(result).toBe(dedent`
      SELECT
        a
      FROM;
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

  // the nr of empty lines here depends on linesBetweenQueries option
  it('formats multiple lonely semicolons', () => {
    expect(format(';;;')).toBe(dedent`
      ;

      ;

      ;
    `);
  });

  it('does not introduce extra empty lines between semicolons when newlineBeforeSemicolon:true', () => {
    expect(format(';;;', { newlineBeforeSemicolon: true })).toBe(dedent`
      ;

      ;

      ;
    `);
  });
}
