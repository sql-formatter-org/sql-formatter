/**
 * Core tests for all SQL formatters
 * @param  {SqlFormatter} formatter
 */
export default function behavesLikeSqlFormatter(formatter) {
    it("formats simple SELECT query", function() {
        const result = formatter.format("SELECT count(*),Column1 FROM Table1;");
        expect(result).toBe(
            "SELECT\n" +
            "  count(*),\n" +
            "  Column1\n" +
            "FROM\n" +
            "  Table1;\n"
        );
    });

    it("formats complex SELECT", function() {
        const result = formatter.format(
            "SELECT DISTINCT name, ROUND(age/7) field1, 18 + 20 AS field2, 'some string' FROM foo;"
        );
        expect(result).toBe(
            "SELECT\n" +
            "  DISTINCT name,\n" +
            "  ROUND(age / 7) field1,\n" +
            "  18 + 20 AS field2,\n" +
            "  'some string'\n" +
            "FROM\n" +
            "  foo;\n"
        );
    });

    it("formats SELECT with complex WHERE", function() {
        const result = formatter.format(
            "SELECT * FROM foo WHERE Column1 = 'testing' " +
            "AND ( (Column2 = Column3 OR Column4 >= NOW()) );"
        );
        expect(result).toBe(
            "SELECT\n" +
            "  *\n" +
            "FROM\n" +
            "  foo\n" +
            "WHERE\n" +
            "  Column1 = 'testing'\n" +
            "  AND (\n" +
            "    (\n" +
            "      Column2 = Column3\n" +
            "      OR Column4 >= NOW()\n" +
            "    )\n" +
            "  );\n"
        );
    });

    it("formats SELECT with toplevel reserved words", function() {
        const result = formatter.format(
            "SELECT * FROM foo WHERE name = 'John' GROUP BY some_column " +
            "HAVING column > 10 ORDER BY other_column LIMIT 5,10 OFFSET 20;"
        );
        expect(result).toBe(
            "SELECT\n" +
            "  *\n" +
            "FROM\n" +
            "  foo\n" +
            "WHERE\n" +
            "  name = 'John'\n" +
            "GROUP BY\n" +
            "  some_column\n" +
            "HAVING\n" +
            "  column > 10\n" +
            "ORDER BY\n" +
            "  other_column\n" +
            "LIMIT\n" +
            "  5, 10 OFFSET 20;\n"
        );
    });

    it("preserves case of keywords", function() {
        const result = formatter.format(
            "select distinct * frOM foo left join bar WHERe a > 1 and b = 3"
        );
        expect(result).toBe(
            "select\n" +
            "  distinct *\n" +
            "frOM\n" +
            "  foo\n" +
            "  left join bar\n" +
            "WHERe\n" +
            "  a > 1\n" +
            "  and b = 3\n"
        );
    });

    it("formats SELECT query with SELECT query inside it", function() {
        const result = formatter.format(
            "SELECT *, SUM(*) AS sum FROM (SELECT * FROM Posts LIMIT 30) WHERE a > b"
        );
        expect(result).toBe(
            "SELECT\n" +
            "  *,\n" +
            "  SUM(*) AS sum\n" +
            "FROM\n" +
            "  (\n" +
            "    SELECT\n" +
            "      *\n" +
            "    FROM\n" +
            "      Posts\n" +
            "    LIMIT\n" +
            "      30\n" +
            "  )\n" +
            "WHERE\n" +
            "  a > b\n"
        );
    });

    it("formats SELECT query with INNER JOIN", function() {
        const result = formatter.format(
            "SELECT customer_id.from, COUNT(order_id) AS total FROM customers " +
            "INNER JOIN orders ON customers.customer_id = orders.customer_id;"
        );
        expect(result).toBe(
            "SELECT\n" +
            "  customer_id.from,\n" +
            "  COUNT(order_id) AS total\n" +
            "FROM\n" +
            "  customers\n" +
            "  INNER JOIN orders ON customers.customer_id = orders.customer_id;\n"
        );
    });

    it("formats SELECT query with different comments", function() {
        const result = formatter.format(
            "SELECT\n" +
            "/* This is a block comment\n" +
            "*/\n" +
            "* FROM\n" +
            "-- This is another comment\n" +
            "MyTable # One final comment\n" +
            "WHERE 1 = 2;"
        );
        expect(result).toBe(
            "SELECT\n" +
            "  /* This is a block comment\n" +
            "  */\n" +
            "  *\n" +
            "FROM\n" +
            "  -- This is another comment\n" +
            "  MyTable # One final comment\n" +
            "WHERE\n" +
            "  1 = 2;\n"
        );
    });

    it("formats simple INSERT query", function() {
        const result = formatter.format(
            "INSERT INTO Customers (ID, MoneyBalance, Address, City) VALUES (12,-123.4, 'Skagen 2111','Stv');"
        );
        expect(result).toBe(
            "INSERT INTO Customers (ID, MoneyBalance, Address, City)\n" +
            "VALUES\n" +
            "  (12, -123.4, 'Skagen 2111', 'Stv');\n"
        );
    });

    it("breaks long parenthized lists to multiple lines", function() {
        const result = formatter.format(
            "INSERT INTO some_table (id_product, id_shop, id_currency, id_country) (" +
            "SELECT IF(dq.id_discounter_shopping = 2, dq.value, dq.value / 100)," +
            "IF (dq.id_discounter_shopping = 2, 'amount', 'percentage') FROM foo);"
        );
        expect(result).toBe(
            "INSERT INTO some_table (\n" +
            "  id_product,\n" +
            "  id_shop,\n" +
            "  id_currency,\n" +
            "  id_country\n" +
            ") (\n" +
            "  SELECT\n" +
            "    IF(\n" +
            "      dq.id_discounter_shopping = 2,\n" +
            "      dq.value,\n" +
            "      dq.value / 100\n" +
            "    ),\n" +
            "    IF (\n" +
            "      dq.id_discounter_shopping = 2,\n" +
            "      'amount',\n" +
            "      'percentage'\n" +
            "    )\n" +
            "  FROM\n" +
            "    foo\n" +
            ");\n"
        );
    });

    it("formats simple UPDATE query", function() {
        const result = formatter.format(
            "UPDATE Customers SET ContactName='Alfred Schmidt', City='Hamburg' WHERE CustomerName='Alfreds Futterkiste';"
        );
        expect(result).toBe(
            "UPDATE\n" +
            "  Customers\n" +
            "SET\n" +
            "  ContactName = 'Alfred Schmidt',\n" +
            "  City = 'Hamburg'\n" +
            "WHERE\n" +
            "  CustomerName = 'Alfreds Futterkiste';\n"
        );
    });

    it("formats simple DELETE query", function() {
        const result = formatter.format(
            "DELETE FROM Customers WHERE CustomerName='Alfred' AND Phone=5002132;"
        );
        expect(result).toBe(
            "DELETE FROM\n" +
            "  Customers\n" +
            "WHERE\n" +
            "  CustomerName = 'Alfred'\n" +
            "  AND Phone = 5002132;\n"
        );
    });

    it("formats simple DROP query", function() {
        const result = formatter.format(
            "DROP TABLE IF EXISTS admin_role;"
        );
        expect(result).toBe(
            "DROP\n" +
            "  TABLE IF EXISTS admin_role;\n"
        );
    });

    it("formats uncomplete query", function() {
        const result = formatter.format("SELECT count(");
        expect(result).toBe(
            "SELECT\n" +
            "  count(\n"
        );
    });

    it("formats query that ends with open comment", function() {
        const result = formatter.format("SELECT count(*)\n/*Comment");
        expect(result).toBe(
            "SELECT\n" +
            "  count(*)\n" +
            "  /*Comment\n"
        );
    });

    it("formats UPDATE query with AS part", function() {
        const result = formatter.format(
            "UPDATE customers SET totalorders = ordersummary.total  FROM ( SELECT * FROM bank) AS ordersummary"
        );
        expect(result).toBe(
            "UPDATE\n" +
            "  customers\n" +
            "SET\n" +
            "  totalorders = ordersummary.total\n" +
            "FROM\n" +
            "  (\n" +
            "    SELECT\n" +
            "      *\n" +
            "    FROM\n" +
            "      bank\n" +
            "  ) AS ordersummary\n"
        );
    });

    it("formats top-level and newline multi-word reserved words with inconsistent spacing", function() {
        const result = formatter.format("SELECT * FROM foo LEFT \t OUTER  \n JOIN bar ORDER \n BY blah");
        expect(result).toBe(
            "SELECT\n" +
            "  *\n" +
            "FROM\n" +
            "  foo\n" +
            "  LEFT OUTER JOIN bar\n" +
            "ORDER BY\n" +
            "  blah\n"
        );
    });

    it("formats single-char operators", function() {
        expect(formatter.format("foo = bar")).toBe("foo = bar\n");
        expect(formatter.format("foo < bar")).toBe("foo < bar\n");
        expect(formatter.format("foo > bar")).toBe("foo > bar\n");
        expect(formatter.format("foo + bar")).toBe("foo + bar\n");
        expect(formatter.format("foo - bar")).toBe("foo - bar\n");
        expect(formatter.format("foo * bar")).toBe("foo * bar\n");
        expect(formatter.format("foo / bar")).toBe("foo / bar\n");
        expect(formatter.format("foo % bar")).toBe("foo % bar\n");
    });

    it("formats multi-char operators", function() {
        expect(formatter.format("foo != bar")).toBe("foo != bar\n");
        expect(formatter.format("foo <> bar")).toBe("foo <> bar\n");
        expect(formatter.format("foo == bar")).toBe("foo == bar\n"); // N1QL
        expect(formatter.format("foo || bar")).toBe("foo || bar\n"); // Oracle, Postgres, N1QL string concat

        expect(formatter.format("foo <= bar")).toBe("foo <= bar\n");
        expect(formatter.format("foo >= bar")).toBe("foo >= bar\n");

        expect(formatter.format("foo !< bar")).toBe("foo !< bar\n");
        expect(formatter.format("foo !> bar")).toBe("foo !> bar\n");
    });

    it("formats logical operators", function() {
        expect(formatter.format("foo ALL bar")).toBe("foo ALL bar\n");
        expect(formatter.format("foo = ANY (1, 2, 3)")).toBe("foo = ANY (1, 2, 3)\n");
        expect(formatter.format("EXISTS bar")).toBe("EXISTS bar\n");
        expect(formatter.format("foo IN (1, 2, 3)")).toBe("foo IN (1, 2, 3)\n");
        expect(formatter.format("foo LIKE 'hello%'")).toBe("foo LIKE 'hello%'\n");
        expect(formatter.format("foo IS NULL")).toBe("foo IS NULL\n");
        expect(formatter.format("UNIQUE foo")).toBe("UNIQUE foo\n");
    });

    it("formats AND/OR operators", function() {
        expect(formatter.format("foo BETWEEN bar AND baz")).toBe("foo BETWEEN bar\nAND baz\n");
        expect(formatter.format("foo AND bar")).toBe("foo\nAND bar\n");
        expect(formatter.format("foo OR bar")).toBe("foo\nOR bar\n");
    });

    it("recognizes strings", function() {
        expect(formatter.format("\"foo JOIN bar\"")).toBe("\"foo JOIN bar\"\n");
        expect(formatter.format("'foo JOIN bar'")).toBe("'foo JOIN bar'\n");
        expect(formatter.format("`foo JOIN bar`")).toBe("`foo JOIN bar`\n");
    });

    it("recognizes escaped strings", function() {
        expect(formatter.format("\"foo \\\" JOIN bar\"")).toBe("\"foo \\\" JOIN bar\"\n");
        expect(formatter.format("'foo \\' JOIN bar'")).toBe("'foo \\' JOIN bar'\n");
        expect(formatter.format("`foo `` JOIN bar`")).toBe("`foo `` JOIN bar`\n");
    });
}
