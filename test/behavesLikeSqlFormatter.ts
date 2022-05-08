import dedent from 'dedent-js';

import { FormatFn, SqlLanguage } from '../src/sqlFormatter';
import { AliasMode } from '../src/types';
import supportsComments from './features/comments';
import supportsIndent from './options/indent';
import supportsAliasAs from './options/aliasAs';
import supportsNewline from './options/newline';
import supportsLineWidth from './options/lineWidth';
import supportsKeywordCase from './options/keywordCase';
import supportsIndentStyle from './options/indentStyle';
import supportsNewlineBeforeParen from './options/newlineBeforeParen';
import supportsCommaPosition from './options/commaPosition';
import supportsLinesBetweenQueries from './options/linesBetweenQueries';
import supportsNewlineBeforeSemicolon from './options/newlineBeforeSemicolon';
import supportsLogicalOperatorNewline from './options/logicalOperatorNewline';
import supportsTabulateAlias from './options/tabulateAlias';

/**
 * Core tests for all SQL formatters
 */
export default function behavesLikeSqlFormatter(language: SqlLanguage, format: FormatFn) {
  supportsComments(language, format);

  supportsAliasAs(language, format);
  supportsTabulateAlias(language, format);
  supportsIndent(language, format);
  supportsKeywordCase(language, format);
  supportsIndentStyle(language, format);
  supportsLinesBetweenQueries(language, format);
  supportsNewline(language, format);
  supportsLineWidth(language, format);
  supportsNewlineBeforeParen(language, format);
  supportsNewlineBeforeSemicolon(language, format);
  supportsCommaPosition(language, format);
  supportsLogicalOperatorNewline(language, format);

  it('does nothing with empty input', () => {
    const result = format('');

    expect(result).toBe('');
  });

  it('throws error when query argument is not string', () => {
    expect(() => format(undefined as unknown as string)).toThrow(
      'Invalid query argument. Expected string, instead got undefined'
    );
  });

  it('formats lonely semicolon', () => {
    expect(format(';')).toBe(';');
  });

  it('formats simple SELECT query', () => {
    const result = format('SELECT count(*),Column1 FROM Table1;');
    expect(result).toBe(dedent`
      SELECT
        count(*),
        Column1
      FROM
        Table1;
    `);
  });

  it('formats complex SELECT', () => {
    const result = format(
      "SELECT DISTINCT [name], ROUND(age/7) field1, 18 + 20 AS field2, 'some string' FROM foo;"
    );
    expect(result).toBe(dedent`
      SELECT
        DISTINCT [name],
        ROUND(age / 7) field1,
        18 + 20 AS field2,
        'some string'
      FROM
        foo;
    `);
  });

  it('formats SELECT with complex WHERE', () => {
    const result = format(`
      SELECT * FROM foo WHERE Column1 = 'testing'
      AND ( (Column2 = Column3 OR Column4 >= NOW()) );
    `);
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        foo
      WHERE
        Column1 = 'testing'
        AND (
          (
            Column2 = Column3
            OR Column4 >= NOW()
          )
        );
    `);
  });

  it('formats SELECT with top level reserved words', () => {
    const result = format(`
      SELECT * FROM foo WHERE name = 'John' GROUP BY some_column
      HAVING column > 10 ORDER BY other_column LIMIT 5;
    `);
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        foo
      WHERE
        name = 'John'
      GROUP BY
        some_column
      HAVING
        column > 10
      ORDER BY
        other_column
      LIMIT
        5;
    `);
  });

  it('allows keywords as column names in tbl.col syntax', () => {
    const result = format(
      'SELECT mytable.update, mytable.select FROM mytable WHERE mytable.from > 10;'
    );
    expect(result).toBe(dedent`
      SELECT
        mytable.update,
        mytable.select
      FROM
        mytable
      WHERE
        mytable.from > 10;
    `);
  });

  it('formats LIMIT with two comma-separated values on single line', () => {
    const result = format('LIMIT 5, 10;');
    expect(result).toBe(dedent`
      LIMIT
        5, 10;
    `);
  });

  it('formats LIMIT of single value followed by another SELECT using commas', () => {
    const result = format('LIMIT 5; SELECT foo, bar;');
    expect(result).toBe(dedent`
      LIMIT
        5;

      SELECT
        foo,
        bar;
    `);
  });

  it('formats LIMIT of single value and OFFSET', () => {
    const result = format('LIMIT 5 OFFSET 8;');
    expect(result).toBe(dedent`
      LIMIT
        5
      OFFSET
        8;
    `);
  });

  it('formats SELECT query with SELECT query inside it', () => {
    const result = format(
      'SELECT *, SUM(*) AS total FROM (SELECT * FROM Posts LIMIT 30) WHERE a > b'
    );
    expect(result).toBe(dedent`
      SELECT
        *,
        SUM(*) AS total
      FROM
        (
          SELECT
            *
          FROM
            Posts
          LIMIT
            30
        )
      WHERE
        a > b
    `);
  });

  it('formats simple INSERT query', () => {
    const result = format(
      "INSERT INTO Customers (ID, MoneyBalance, Address, City) VALUES (12,-123.4, 'Skagen 2111','Stv');"
    );
    expect(result).toBe(dedent`
      INSERT INTO
        Customers (ID, MoneyBalance, Address, City)
      VALUES
        (12, -123.4, 'Skagen 2111', 'Stv');
    `);
  });

  it('formats open paren after comma', () => {
    const result = format(
      'WITH TestIds AS (VALUES (4),(5), (6),(7),(9),(10),(11)) SELECT * FROM TestIds;'
    );
    expect(result).toBe(dedent/* sql */ `
      WITH
        TestIds AS (
          VALUES
            (4),
            (5),
            (6),
            (7),
            (9),
            (10),
            (11)
        )
      SELECT
        *
      FROM
        TestIds;
    `);
  });

  it('keeps short parenthesized list with nested parenthesis on single line', () => {
    const result = format('SELECT (a + b * (c - NOW()));');
    expect(result).toBe(dedent`
      SELECT
        (a + b * (c - NOW()));
    `);
  });

  it('breaks long parenthesized lists to multiple lines', () => {
    const result = format(`
      INSERT INTO some_table (id_product, id_shop, id_currency, id_country, id_registration) (
      SELECT IF(dq.id_discounter_shopping = 2, dq.value, dq.value / 100),
      IF (dq.id_discounter_shopping = 2, 'amount', 'percentage') FROM foo);
    `);
    expect(result).toBe(dedent`
      INSERT INTO
        some_table (
          id_product,
          id_shop,
          id_currency,
          id_country,
          id_registration
        ) (
          SELECT
            IF(
              dq.id_discounter_shopping = 2,
              dq.value,
              dq.value / 100
            ),
            IF (
              dq.id_discounter_shopping = 2,
              'amount',
              'percentage'
            )
          FROM
            foo
        );
    `);
  });

  it('formats simple UPDATE query', () => {
    const result = format(
      "UPDATE Customers SET ContactName='Alfred Schmidt', City='Hamburg' WHERE CustomerName='Alfreds Futterkiste';"
    );
    expect(result).toBe(dedent`
      UPDATE
        Customers
      SET
        ContactName = 'Alfred Schmidt',
        City = 'Hamburg'
      WHERE
        CustomerName = 'Alfreds Futterkiste';
    `);
  });

  it('formats simple DELETE query', () => {
    const result = format("DELETE FROM Customers WHERE CustomerName='Alfred' AND Phone=5002132;");
    expect(result).toBe(dedent`
      DELETE
      FROM
        Customers
      WHERE
        CustomerName = 'Alfred'
        AND Phone = 5002132;
    `);
  });

  it('formats simple DROP query', () => {
    const result = format('DROP TABLE IF EXISTS admin_role;');
    expect(result).toBe(dedent`
      DROP TABLE
        IF EXISTS admin_role;
    `);
  });

  it('formats incomplete query', () => {
    const result = format('SELECT count(');
    expect(result).toBe(dedent`
      SELECT
        count(
    `);
  });

  it('formats UPDATE query with AS part', () => {
    const result = format(
      'UPDATE customers SET total_orders = order_summary.total  FROM ( SELECT * FROM bank) AS order_summary',
      { aliasAs: AliasMode.always }
    );
    expect(result).toBe(dedent`
      UPDATE
        customers
      SET
        total_orders = order_summary.total
      FROM
        (
          SELECT
            *
          FROM
            bank
        ) AS order_summary
    `);
  });

  it('formats top-level and newline multi-word reserved words with inconsistent spacing', () => {
    const result = format('SELECT * FROM foo LEFT \t   \n JOIN bar ORDER \n BY blah');
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        foo
        LEFT JOIN bar
      ORDER BY
        blah
    `);
  });

  it('formats long double parenthized queries to multiple lines', () => {
    const result = format("((foo = '0123456789-0123456789-0123456789-0123456789'))");
    expect(result).toBe(dedent`
      (
        (
          foo = '0123456789-0123456789-0123456789-0123456789'
        )
      )
    `);
  });

  it('formats short double parenthized queries to one line', () => {
    const result = format("((foo = 'bar'))");
    expect(result).toBe("((foo = 'bar'))");
  });

  it('formats logical operators', () => {
    expect(format('foo ALL bar')).toBe('foo ALL bar');
    expect(format('foo = ANY (1, 2, 3)')).toBe('foo = ANY (1, 2, 3)');
    expect(format('EXISTS bar')).toBe('EXISTS bar');
    expect(format('foo IN (1, 2, 3)')).toBe('foo IN (1, 2, 3)');
    expect(format("foo LIKE 'hello%'")).toBe("foo LIKE 'hello%'");
    expect(format('foo IS NULL')).toBe('foo IS NULL');
    expect(format('UNIQUE foo')).toBe('UNIQUE foo');
  });

  it('formats AND/OR operators', () => {
    expect(format('foo AND bar')).toBe('foo\nAND bar');
    expect(format('foo OR bar')).toBe('foo\nOR bar');
  });

  it('keeps separation between multiple statements', () => {
    expect(format('foo;bar;')).toBe('foo;\n\nbar;');
    expect(format('foo\n;bar;')).toBe('foo;\n\nbar;');
    expect(format('foo\n\n\n;bar;\n\n')).toBe('foo;\n\nbar;');

    const result = format(`
      SELECT count(*),Column1 FROM Table1;
      SELECT count(*),Column1 FROM Table2;
    `);
    expect(result).toBe(dedent`
      SELECT
        count(*),
        Column1
      FROM
        Table1;

      SELECT
        count(*),
        Column1
      FROM
        Table2;
    `);
  });

  it('formats unicode correctly', () => {
    const result = format('SELECT 结合使用, тест FROM töörõõm;');
    expect(result).toBe(dedent`
      SELECT
        结合使用,
        тест
      FROM
        töörõõm;
    `);
  });

  it('supports decimal numbers', () => {
    const result = format('SELECT 42, -35.04, 105., 2.53E+3, 1.085E-5;');
    expect(result).toBe(dedent`
      SELECT
        42,
        -35.04,
        105.,
        2.53E+3,
        1.085E-5;
    `);
  });

  it('supports hex and binary numbers', () => {
    const result = format('SELECT 0xAE, 0x10F, 0b1010001;');
    expect(result).toBe(dedent`
      SELECT
        0xAE,
        0x10F,
        0b1010001;
    `);
  });

  it('correctly indents create statement after select', () => {
    const result = format(`
      SELECT * FROM test;
      CREATE TABLE test(id NUMBER NOT NULL, col1 VARCHAR2(20), col2 VARCHAR2(20));
    `);
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        test;

      CREATE TABLE
        test(
          id NUMBER NOT NULL,
          col1 VARCHAR2(20),
          col2 VARCHAR2(20)
        );
    `);
  });

  it('correctly handles floats as single tokens', () => {
    const result = format('SELECT 1e-9 AS a, 1.5e+10 AS b, 3.5E12 AS c, 3.5e12 AS d;');
    expect(result).toBe(dedent`
      SELECT
        1e-9 AS a,
        1.5e+10 AS b,
        3.5E12 AS c,
        3.5e12 AS d;
    `);
  });

  it('correctly handles floats with trailing point', () => {
    let result = format('SELECT 1000. AS a;');
    expect(result).toBe(dedent`
      SELECT
        1000. AS a;
    `);

    result = format('SELECT a, b / 1000. AS a_s, 100. * b / SUM(a_s);');
    expect(result).toBe(dedent`
      SELECT
        a,
        b / 1000. AS a_s,
        100. * b / SUM(a_s);
    `);
  });

  it('does not split UNION ALL in half', () => {
    const result = format(`
      SELECT * FROM tbl1
      UNION ALL
      SELECT * FROM tbl2;
    `);
    expect(result).toBe(dedent/* sql */ `
      SELECT
        *
      FROM
        tbl1
      UNION ALL
      SELECT
        *
      FROM
        tbl2;
    `);
  });

  it('handles array and map accessor', () => {
    const result = format(`SELECT alpha[1], beta['gamma'], epsilon["zeta"] FROM eta;`);
    expect(result).toBe(dedent`
      SELECT
        alpha[1],
        beta['gamma'],
        epsilon["zeta"]
      FROM
        eta;
    `);
  });
}
