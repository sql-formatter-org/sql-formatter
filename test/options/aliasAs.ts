import dedent from 'dedent-js';
import { AliasMode } from '../../src/types';
import { FormatFn, SqlLanguage } from '../../src/sqlFormatter';

export default function supportsAliasAs(language: SqlLanguage, format: FormatFn) {
  it('defaults to preserving original uses of AS', () => {
    expect(
      format('SELECT a a_column, b AS bColumn FROM table1 t1 JOIN table2 as t2 WHERE z;')
    ).toBe(
      dedent(`
        SELECT
          a a_column,
          b AS bColumn
        FROM
          table1 t1
          JOIN table2 as t2
        WHERE
          z;
      `)
    );
  });

  it('supports always mode', () => {
    expect(
      format('SELECT a a_column, b AS bColumn FROM ( SELECT * FROM x ) y WHERE z;', {
        aliasAs: AliasMode.always,
      })
    ).toBe(
      dedent(`
        SELECT
          a as a_column,
          b AS bColumn
        FROM
          (
            SELECT
              *
            FROM
              x
          ) as y
        WHERE
          z;
      `)
    );
  });

  it('supports never mode', () => {
    expect(
      format('SELECT a a_column, b AS bColumn FROM ( SELECT * FROM x ) y WHERE z;', {
        aliasAs: AliasMode.never,
      })
    ).toBe(
      dedent(`
        SELECT
          a a_column,
          b bColumn
        FROM
          (
            SELECT
              *
            FROM
              x
          ) y
        WHERE
          z;
      `)
    );
  });

  it('only adds AS keyword to columns with a name', () => {
    expect(format('SELECT a + b name1, a + b', { aliasAs: AliasMode.always })).toBe(
      dedent(`
        SELECT
          a + b as name1,
          a + b
      `)
    );
  });

  it('supports select only mode', () => {
    expect(
      format('SELECT a a_column, b AS bColumn FROM ( SELECT * FROM x ) AS y WHERE z;', {
        aliasAs: AliasMode.select,
      })
    ).toBe(
      dedent(`
        SELECT
          a as a_column,
          b AS bColumn
        FROM
          (
            SELECT
              *
            FROM
              x
          ) y
        WHERE
          z;
      `)
    );
  });

  it('handles edge case of never + CTE', () => {
    const result = format(
      dedent`CREATE TABLE 'test.example_table' AS WITH cte AS (SELECT a AS alpha)`,
      { aliasAs: AliasMode.never }
    );

    expect(result).toBe(dedent`
      CREATE TABLE
        'test.example_table' as
      WITH
        cte as (
          SELECT
            a alpha
        )
    `);
  });

  it('handles edge case of never + CAST', () => {
    const result = format(
      dedent`SELECT
      CAST(0 AS BIT),
      'foo' AS bar`,
      { aliasAs: AliasMode.never }
    );

    expect(result).toBe(dedent`
      SELECT
        CAST(0 as BIT),
        'foo' bar
    `);
  });
}
