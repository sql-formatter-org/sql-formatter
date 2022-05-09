import dedent from 'dedent-js';
import { FormatFn, SqlLanguage } from '../../src/sqlFormatter';

export default function supportsIndentStyle(language: SqlLanguage, format: FormatFn) {
  const baseQuery = `
    SELECT COUNT(a.column1), MAX(b.column2 + b.column3), b.column4 AS four
    FROM ( SELECT column1, column5 FROM table1 ) a
    JOIN table2 b ON a.column5 = b.column5
    WHERE column6 AND column7
    GROUP BY column4;
  `;

  it('supports standard mode', () => {
    const result = format(baseQuery, { indentStyle: 'standard' });
    expect(result).toBe(dedent`
      SELECT
        COUNT(a.column1),
        MAX(b.column2 + b.column3),
        b.column4 AS four
      FROM
        (
          SELECT
            column1,
            column5
          FROM
            table1
        ) a
        JOIN table2 b ON a.column5 = b.column5
      WHERE
        column6
        AND column7
      GROUP BY
        column4;
    `);
  });

  describe('indentStyle: tabularLeft', () => {
    it('aligns command keywords to left', () => {
      const result = format(baseQuery, { indentStyle: 'tabularLeft' });
      expect(result).toBe(dedent`
        SELECT    COUNT(a.column1),
                  MAX(b.column2 + b.column3),
                  b.column4 AS four
        FROM      (
                  SELECT    column1,
                            column5
                  FROM      table1
                  ) a
        JOIN      table2 b ON a.column5 = b.column5
        WHERE     column6
        AND       column7
        GROUP BY  column4;
      `);
    });

    it('handles long keywords', () => {
      expect(
        format(
          dedent`
            SELECT *
            FROM a
            UNION DISTINCT
            SELECT *
            FROM b
            LEFT OUTER JOIN c;
          `,
          { indentStyle: 'tabularLeft' }
        )
      ).toBe(dedent`
        SELECT    *
        FROM      a
        UNION     DISTINCT
        SELECT    *
        FROM      b
        LEFT      OUTER JOIN c;
      `);
    });

    it('handles multiple levels of nested queries', () => {
      expect(
        format(
          'SELECT age FROM (SELECT fname, lname, age FROM (SELECT fname, lname FROM persons) JOIN (SELECT age FROM ages)) as mytable;',
          {
            indentStyle: 'tabularLeft',
          }
        )
      ).toBe(dedent`
        SELECT    age
        FROM      (
                  SELECT    fname,
                            lname,
                            age
                  FROM      (
                            SELECT    fname,
                                      lname
                            FROM      persons
                            )
                  JOIN      (
                            SELECT    age
                            FROM      ages
                            )
                  ) as mytable;
      `);
    });

    it('does not indent semicolon when newlineBeforeSemicolon:true used', () => {
      expect(
        format('SELECT firstname, lastname, age FROM customers;', {
          indentStyle: 'tabularLeft',
          newlineBeforeSemicolon: true,
        })
      ).toBe(dedent`
        SELECT    firstname,
                  lastname,
                  age
        FROM      customers
        ;
      `);
    });
  });

  describe('indentStyle: tabularRight', () => {
    it('aligns command keywords to right', () => {
      const result = format(baseQuery, { indentStyle: 'tabularRight' });
      expect(result).toBe(
        [
          '   SELECT COUNT(a.column1),',
          '          MAX(b.column2 + b.column3),',
          '          b.column4 AS four',
          '     FROM (',
          '             SELECT column1,',
          '                    column5',
          '               FROM table1',
          '          ) a',
          '     JOIN table2 b ON a.column5 = b.column5',
          '    WHERE column6',
          '      AND column7',
          ' GROUP BY column4;',
        ].join('\n')
      );
    });

    it('handles long keywords', () => {
      expect(
        format(
          dedent`
            SELECT *
            FROM a
            UNION DISTINCT
            SELECT *
            FROM b
            LEFT OUTER JOIN c;
          `,
          { indentStyle: 'tabularRight' }
        )
      ).toBe(
        [
          '   SELECT *',
          '     FROM a',
          '    UNION DISTINCT',
          '   SELECT *',
          '     FROM b',
          '     LEFT OUTER JOIN c;',
        ].join('\n')
      );
    });
  });
}
