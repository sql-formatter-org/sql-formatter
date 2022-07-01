import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter';

import supportsCase from './features/case';
import supportsNumbers from './features/numbers';
import supportsTabWidth from './options/tabWidth';
import supportsUseTabs from './options/useTabs';
import supportsAliasAs from './options/aliasAs';
import supportsExpressionWidth from './options/expressionWidth';
import supportsKeywordCase from './options/keywordCase';
import supportsIndentStyle from './options/indentStyle';
import supportsCommaPosition from './options/commaPosition';
import supportsLinesBetweenQueries from './options/linesBetweenQueries';
import supportsNewlineBeforeSemicolon from './options/newlineBeforeSemicolon';
import supportsLogicalOperatorNewline from './options/logicalOperatorNewline';
import supportsTabulateAlias from './options/tabulateAlias';

/**
 * Core tests for all SQL formatters
 */
export default function behavesLikeSqlFormatter(format: FormatFn) {
  supportsCase(format);
  supportsNumbers(format);

  supportsAliasAs(format);
  supportsTabulateAlias(format);
  supportsTabWidth(format);
  supportsUseTabs(format);
  supportsKeywordCase(format);
  supportsIndentStyle(format);
  supportsLinesBetweenQueries(format);
  supportsExpressionWidth(format);
  supportsNewlineBeforeSemicolon(format);
  supportsCommaPosition(format);
  supportsLogicalOperatorNewline(format);

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
      "SELECT DISTINCT name, ROUND(age/7) field1, 18 + 20 AS field2, 'some string' FROM foo;"
    );
    expect(result).toBe(dedent`
      SELECT
        DISTINCT name,
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
      { aliasAs: 'always' }
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

  it('supports unicode letters in identifiers', () => {
    const result = format('SELECT 结合使用, тест FROM töörõõm;');
    expect(result).toBe(dedent`
      SELECT
        结合使用,
        тест
      FROM
        töörõõm;
    `);
  });

  // Using Myanmar and Tibetan digits 1, 2, 3
  it('supports unicode numbers in identifiers', () => {
    const result = format('SELECT my၁၂၃ FROM tbl༡༢༣;');
    expect(result).toBe(dedent`
      SELECT
        my၁၂၃
      FROM
        tbl༡༢༣;
    `);
  });

  it('supports unicode diacritical marks in identifiers', () => {
    const COMBINING_TILDE = String.fromCodePoint(0x0303);
    const result = format('SELECT o' + COMBINING_TILDE + ' FROM tbl;');
    expect(result).toBe(dedent`
      SELECT
        õ
      FROM
        tbl;
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
}
