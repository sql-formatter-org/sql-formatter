import dedent from 'dedent-js';
import { AliasMode, KeywordCase } from '../../src/types';
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
    it('adds AS keywords to columns', () => {
      expect(
        format('SELECT a a_column, b AS bColumn, c cColumn FROM foo;', {
          aliasAs: AliasMode.always,
        })
      ).toBe(
        dedent(`
          SELECT
            a AS a_column,
            b AS bColumn,
            c AS cColumn
          FROM
            foo;
        `)
      );
    });

    // XXX: this is not correct
    it('does not add AS keywords to table names', () => {
      expect(
        format('SELECT * FROM table1 t1 JOIN table2 t2;', {
          aliasAs: AliasMode.always,
        })
      ).toBe(
        dedent(`
          SELECT
            *
          FROM
            table1 t1
            JOIN table2 t2;
        `)
      );
    });

    it('adds AS keywords to (subquery) AS name', () => {
      expect(
        format('SELECT * FROM ( SELECT * FROM x ) y;', {
          aliasAs: AliasMode.always,
        })
      ).toBe(
        dedent(`
          SELECT
            *
          FROM
            (
              SELECT
                *
              FROM
                x
            ) as y;
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

    it('inserts lowercase AS when existing code mostly uses lowercase AS', () => {
      expect(
        format('SELECT first_name as fname, last_name lname, full_age as age, occupation AS pos', {
          aliasAs: AliasMode.always,
        })
      ).toBe(
        dedent(`
          SELECT
            first_name as fname,
            last_name as lname,
            full_age as age,
            occupation AS pos
        `)
      );
    });

    it('inserts uppercase AS when existing code mostly uses uppercase AS', () => {
      expect(
        format('SELECT first_name AS fname, last_name lname, full_age as age, occupation AS pos', {
          aliasAs: AliasMode.always,
        })
      ).toBe(
        dedent(`
          SELECT
            first_name AS fname,
            last_name AS lname,
            full_age as age,
            occupation AS pos
        `)
      );
    });

    it('inserts uppercase AS when keywordCase: upper', () => {
      expect(
        format('SELECT first_name as fname, last_name lname, full_age age, occupation as pos', {
          aliasAs: AliasMode.always,
          keywordCase: KeywordCase.upper,
        })
      ).toBe(
        dedent(`
          SELECT
            first_name AS fname,
            last_name AS lname,
            full_age AS age,
            occupation AS pos
        `)
      );
    });

    it('inserts lowercase AS when keywordCase: lower', () => {
      expect(
        format('SELECT first_name AS fname, last_name lname, full_age age, occupation AS pos', {
          aliasAs: AliasMode.always,
          keywordCase: KeywordCase.lower,
        })
      ).toBe(
        dedent(`
          select
            first_name as fname,
            last_name as lname,
            full_age as age,
            occupation as pos
        `)
      );
    });
  });

  describe('aliasAs: never', () => {
    it('removes AS keywords from column names', () => {
      expect(
        format('SELECT a AS a_column, b AS bColumn, c cColumn;', {
          aliasAs: AliasMode.never,
        })
      ).toBe(
        dedent(`
          SELECT
            a a_column,
            b bColumn,
            c cColumn;
        `)
      );
    });

    it('removes AS keywords from (subquery) aliases', () => {
      expect(
        format('SELECT * FROM ( SELECT * FROM x ) AS y;', {
          aliasAs: AliasMode.never,
        })
      ).toBe(
        dedent(`
          SELECT
            *
          FROM
            (
              SELECT
                *
              FROM
                x
            ) y;
        `)
      );
    });

    it('removes AS keywords from tablename aliases', () => {
      expect(
        format('SELECT * FROM table1 AS t1 JOIN table2 AS t2;', {
          aliasAs: AliasMode.never,
        })
      ).toBe(
        dedent(`
          SELECT
            *
          FROM
            table1 t1
            JOIN table2 t2;
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
          'test.example_table' AS
        WITH
          cte AS (
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
          CAST(0 AS BIT),
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
            a AS a_column,
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
