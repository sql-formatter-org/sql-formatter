import sqlFormatter from "./../src/sqlFormatter";
import dedent from "dedent-js";

/**
 * Core tests for all SQL formatters
 * @param {String} language
 */
export default function behavesLikeSqlFormatter(language) {
    const format = (query, cfg = {}) => sqlFormatter.format(query, {...cfg, language});

    it("does nothing with empty input", () => {
        const result = format("");

        expect(result).toBe("");
    });

    it("throws error when query argument is not string", () => {
        expect(() => format(undefined)).toThrow("Invalid query argument. Extected string, instead got undefined")
    });

    it("uses given indent config for indention", () => {
        const result = format("SELECT count(*),Column1 FROM Table1;", {
            indent: "    "
        });

        expect(result).toBe(dedent/* sql */ `
      SELECT
          count(*),
          Column1
      FROM
          Table1;
    `);
    });

    it("formats simple SET SCHEMA queries", () => {
        const result = format("SET SCHEMA schema1; SET CURRENT SCHEMA schema2;");
        expect(result).toBe(dedent/* sql */ `
      SET SCHEMA
        schema1;
      SET CURRENT SCHEMA
        schema2;
    `);
    });

    it("formats simple SELECT query", () => {
        const result = format("SELECT count(*),Column1 FROM Table1;");
        expect(result).toBe(dedent/* sql */ `
      SELECT
        count(*),
        Column1
      FROM
        Table1;
    `);
    });

    it("formats complex SELECT", () => {
        const result = format(
            "SELECT DISTINCT name, ROUND(age/7) field1, 18 + 20 AS field2, 'some string' FROM foo;"
        );
        expect(result).toBe(dedent/* sql */ `
      SELECT
        DISTINCT name,
        ROUND(age / 7) field1,
        18 + 20 AS field2,
        'some string'
      FROM
        foo;
    `);
    });

    it("formats SELECT with complex WHERE", () => {
        const result = sqlFormatter.format(`
      SELECT * FROM foo WHERE Column1 = 'testing'
      AND ( (Column2 = Column3 OR Column4 >= NOW()) );
    `);
        expect(result).toBe(dedent/* sql */ `
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

    it("formats SELECT with top level reserved words", () => {
        const result = format(`
      SELECT * FROM foo WHERE name = 'John' GROUP BY some_column
      HAVING column > 10 ORDER BY other_column LIMIT 5;
    `);
        expect(result).toBe(dedent/* sql */ `
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

    it("formats LIMIT with two comma-separated values on single line", () => {
        const result = format("LIMIT 5, 10;");
        expect(result).toBe(dedent/* sql */ `
      LIMIT
        5, 10;
    `);
    });

    it("formats LIMIT of single value followed by another SELECT using commas", () => {
        const result = format("LIMIT 5; SELECT foo, bar;");
        expect(result).toBe(dedent/* sql */ `
      LIMIT
        5;
      SELECT
        foo,
        bar;
    `);
    });

    it("formats LIMIT of single value and OFFSET", () => {
        const result = format("LIMIT 5 OFFSET 8;");
        expect(result).toBe(dedent/* sql */ `
      LIMIT
        5 OFFSET 8;
    `);
    });

    it("recognizes LIMIT in lowercase", () => {
        const result = format("limit 5, 10;");
        expect(result).toBe(dedent/* sql */ `
      limit
        5, 10;
    `);
    });

    it("preserves case of keywords", () => {
        const result = format("select distinct * frOM foo left join bar WHERe a > 1 and b = 3");
        expect(result).toBe(dedent/* sql */ `
      select
        distinct *
      frOM
        foo
        left join bar
      WHERe
        a > 1
        and b = 3
    `);
    });

    it("formats SELECT query with SELECT query inside it", () => {
        const result = format(
            "SELECT *, SUM(*) AS sum FROM (SELECT * FROM Posts LIMIT 30) WHERE a > b"
        );
        expect(result).toBe(dedent/* sql */ `
      SELECT
        *,
        SUM(*) AS sum
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

    it("formats SELECT query with INNER JOIN", () => {
        const result = format(`
      SELECT customer_id.from, COUNT(order_id) AS total FROM customers
      INNER JOIN orders ON customers.customer_id = orders.customer_id;
    `);
        expect(result).toBe(dedent/* sql */ `
      SELECT
        customer_id.from,
        COUNT(order_id) AS total
      FROM
        customers
        INNER JOIN orders ON customers.customer_id = orders.customer_id;
    `);
    });

    it("formats SELECT query with different comments", () => {
        const result = format(dedent/* sql */ `
      SELECT
      /*
       * This is a block comment
       */
      * FROM
      -- This is another comment
      MyTable # One final comment
      WHERE 1 = 2;
    `);
        expect(result).toBe(dedent/* sql */ `
      SELECT
        /*
         * This is a block comment
         */
        *
      FROM
        -- This is another comment
        MyTable # One final comment
      WHERE
        1 = 2;
    `);
    });

    it("maintains block comment indentation", () => {
        const sql = dedent/* sql */ `
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

    // FIXME: should not mix windows and unix line-endings
    it("recognizes line-comments with Windows line-endings", () => {
        const result = format("SELECT * FROM\r\n-- line comment 1\r\nMyTable -- line comment 2\r\n");
        expect(result).toBe("SELECT\n  *\nFROM\n  -- line comment 1\r\n  MyTable -- line comment 2");
    });

    it("formats simple INSERT query", () => {
        const result = format(
            "INSERT INTO Customers (ID, MoneyBalance, Address, City) VALUES (12,-123.4, 'Skagen 2111','Stv');"
        );
        expect(result).toBe(dedent/* sql */ `
      INSERT INTO
        Customers (ID, MoneyBalance, Address, City)
      VALUES
        (12, -123.4, 'Skagen 2111', 'Stv');
    `);
    });

    it("keeps short parenthesized list with nested parenthesis on single line", () => {
        const result = format("SELECT (a + b * (c - NOW()));");
        expect(result).toBe(dedent/* sql */ `
      SELECT
        (a + b * (c - NOW()));
    `);
    });

    it("breaks long parenthesized lists to multiple lines", () => {
        const result = format(`
      INSERT INTO some_table (id_product, id_shop, id_currency, id_country, id_registration) (
      SELECT IF(dq.id_discounter_shopping = 2, dq.value, dq.value / 100),
      IF (dq.id_discounter_shopping = 2, 'amount', 'percentage') FROM foo);
    `);
        expect(result).toBe(dedent/* sql */ `
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

    it("formats simple UPDATE query", () => {
        const result = format(
            "UPDATE Customers SET ContactName='Alfred Schmidt', City='Hamburg' WHERE CustomerName='Alfreds Futterkiste';"
        );
        expect(result).toBe(dedent/* sql */ `
      UPDATE
        Customers
      SET
        ContactName = 'Alfred Schmidt',
        City = 'Hamburg'
      WHERE
        CustomerName = 'Alfreds Futterkiste';
    `);
    });

    it("formats simple DELETE query", () => {
        const result = format(
            "DELETE FROM Customers WHERE CustomerName='Alfred' AND Phone=5002132;"
        );
        expect(result).toBe(dedent/* sql */ `
      DELETE FROM
        Customers
      WHERE
        CustomerName = 'Alfred'
        AND Phone = 5002132;
    `);
    });

    it("formats simple DROP query", () => {
        const result = format("DROP TABLE IF EXISTS admin_role;");
        expect(result).toBe("DROP TABLE IF EXISTS admin_role;");
    });

    it("formats incomplete query", () => {
        const result = format("SELECT count(");
        expect(result).toBe(dedent/* sql */ `
      SELECT
        count(
    `);
    });

    it("formats query that ends with open comment", () => {
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

    it("formats UPDATE query with AS part", () => {
        const result = format(
            "UPDATE customers SET total_orders = order_summary.total  FROM ( SELECT * FROM bank) AS order_summary"
        );
        expect(result).toBe(dedent/* sql */ `
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

    it("formats top-level and newline multi-word reserved words with inconsistent spacing", () => {
        const result = format("SELECT * FROM foo LEFT \t OUTER  \n JOIN bar ORDER \n BY blah");
        expect(result).toBe(dedent/* sql */ `
      SELECT
        *
      FROM
        foo
        LEFT OUTER JOIN bar
      ORDER BY
        blah
    `);
    });

    it("formats long double parenthesized queries to multiple lines", () => {
        const result = format("((foo = '0123456789-0123456789-0123456789-0123456789'))");
        expect(result).toBe(dedent/* sql */ `
      (
        (
          foo = '0123456789-0123456789-0123456789-0123456789'
        )
      )
    `);
    });

    it("formats short double parenthesized queries to one line", () => {
        const result = format("((foo = 'bar'))");
        expect(result).toBe("((foo = 'bar'))");
    });

    it("formats single-char operators", () => {
        expect(format("foo = bar")).toBe("foo = bar");
        expect(format("foo < bar")).toBe("foo < bar");
        expect(format("foo > bar")).toBe("foo > bar");
        expect(format("foo + bar")).toBe("foo + bar");
        expect(format("foo - bar")).toBe("foo - bar");
        expect(format("foo * bar")).toBe("foo * bar");
        expect(format("foo / bar")).toBe("foo / bar");
        expect(format("foo % bar")).toBe("foo % bar");
    });

    it("formats multi-char operators", () => {
        expect(format("foo != bar")).toBe("foo != bar");
        expect(format("foo <> bar")).toBe("foo <> bar");
        expect(format("foo == bar")).toBe("foo == bar"); // N1QL
        expect(format("foo || bar")).toBe("foo || bar"); // Oracle, Postgre, N1QL string concat

        expect(format("foo <= bar")).toBe("foo <= bar");
        expect(format("foo >= bar")).toBe("foo >= bar");

        expect(format("foo !< bar")).toBe("foo !< bar");
        expect(format("foo !> bar")).toBe("foo !> bar");
    });

    it("formats logical operators", () => {
        expect(format("foo ALL bar")).toBe("foo ALL bar");
        expect(format("foo = ANY (1, 2, 3)")).toBe("foo = ANY (1, 2, 3)");
        expect(format("EXISTS bar")).toBe("EXISTS bar");
        expect(format("foo IN (1, 2, 3)")).toBe("foo IN (1, 2, 3)");
        expect(format("foo LIKE 'hello%'")).toBe("foo LIKE 'hello%'");
        expect(format("foo IS NULL")).toBe("foo IS NULL");
        expect(format("UNIQUE foo")).toBe("UNIQUE foo");
    });

    it("formats AND/OR operators", () => {
        expect(format("foo BETWEEN bar AND baz")).toBe("foo BETWEEN bar\nAND baz");
        expect(format("foo AND bar")).toBe("foo\nAND bar");
        expect(format("foo OR bar")).toBe("foo\nOR bar");
    });

    it("recognizes strings", () => {
        expect(format('"foo JOIN bar"')).toBe('"foo JOIN bar"');
        expect(format("'foo JOIN bar'")).toBe("'foo JOIN bar'");
        expect(format("`foo JOIN bar`")).toBe("`foo JOIN bar`");
    });

    it("recognizes escaped strings", () => {
        expect(format('"foo \\" JOIN bar"')).toBe('"foo \\" JOIN bar"');
        expect(format("'foo \\' JOIN bar'")).toBe("'foo \\' JOIN bar'");
        expect(format("`foo `` JOIN bar`")).toBe("`foo `` JOIN bar`");
    });

    it("formats postgre specific operators", () => {
        expect(format("column::int")).toBe("column :: int");
        expect(format("v->2")).toBe("v -> 2");
        expect(format("v->>2")).toBe("v ->> 2");
        expect(format("foo ~~ 'hello'")).toBe("foo ~~ 'hello'");
        expect(format("foo !~ 'hello'")).toBe("foo !~ 'hello'");
        expect(format("foo ~* 'hello'")).toBe("foo ~* 'hello'");
        expect(format("foo ~~* 'hello'")).toBe("foo ~~* 'hello'");
        expect(format("foo !~~ 'hello'")).toBe("foo !~~ 'hello'");
        expect(format("foo !~* 'hello'")).toBe("foo !~* 'hello'");
        expect(format("foo !~~* 'hello'")).toBe("foo !~~* 'hello'");
    });

    it("keeps separation between multiple statements", () => {
        expect(format("foo;bar;")).toBe("foo;\nbar;");
        expect(format("foo\n;bar;")).toBe("foo;\nbar;");
        expect(format("foo\n\n\n;bar;\n\n")).toBe("foo;\nbar;");

        const result = format(`
      SELECT count(*),Column1 FROM Table1;
      SELECT count(*),Column1 FROM Table2;
    `);
        expect(result).toBe(dedent/* sql */ `
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

    it("formats unicode correctly", () => {
        const result = format("SELECT test, тест FROM table;");
        expect(result).toBe(dedent/* sql */ `
      SELECT
        test,
        тест
      FROM
        table;
    `);
    });

    it("converts keywords to uppercase when option passed in", () => {
        const result = format(
            "select distinct * frOM foo left join bar WHERe cola > 1 and colb = 3",
            {
                uppercase: true
            }
        );
        expect(result).toBe(dedent/* sql */ `
      SELECT
        DISTINCT *
      FROM
        foo
        LEFT JOIN bar
      WHERE
        cola > 1
        AND colb = 3
    `);
    });

    it("line breaks between queries change with config", () => {
        const result = format("SELECT * FROM foo; SELECT * FROM bar;", {linesBetweenQueries: 2});
        expect(result).toBe(dedent/* sql */ `
      SELECT
        *
      FROM
        foo;

      SELECT
        *
      FROM
        bar;
    `);
    });

    it("correctly indents create statement after select", () => {
        const result = sqlFormatter.format(`
      SELECT * FROM test;
      CREATE TABLE TEST(id NUMBER NOT NULL, col1 VARCHAR2(20), col2 VARCHAR2(20));
    `);
        expect(result).toBe(dedent/* sql */ `
      SELECT
        *
      FROM
        test;
      CREATE TABLE TEST(
        id NUMBER NOT NULL,
        col1 VARCHAR2(20),
        col2 VARCHAR2(20)
      );
    `);
    });
}
