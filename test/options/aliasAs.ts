import dedent from 'dedent-js';
import { AliasMode } from '../../src/types';
import { FormatFn, SqlLanguage } from '../../src/sqlFormatter';

export default function supportsAliasAs(language: SqlLanguage, format: FormatFn) {
  describe('by default', () => {
    it('preserves original uses of AS', () => {
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
  });

  describe('aliasAs: always', () => {
    it('adds AS keywords where missing', () => {
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

    it('only adds AS keyword to columns with a name', () => {
      expect(format('SELECT a + b name1, a + b', { aliasAs: AliasMode.always })).toBe(
        dedent(`
          SELECT
            a + b as name1,
            a + b
        `)
      );
    });
  });

  describe('aliasAs: never', () => {
    it('removes AS keywords where present', () => {
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

    it('does not remove AS keyword when "AS WITH" or "AS ("', () => {
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

    it('does not remove AS keywords from CAST(... AS ...)', () => {
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
  });

  describe('aliasAs: select', () => {
    it('adds AS keywords to columns aliases, removes them from table aliases', () => {
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
  });
}
