import standardSqlFormatter from "xr/sqlFormatter/standardSqlFormatter";

describe("standardSqlFormatter", function() {
    it("formats simple SELECT query", function() {
        const result = standardSqlFormatter.format("SELECT count(*),Column1 FROM Table1;");
        expect(result).toBe(
            "SELECT\n" +
            "  count(*),\n" +
            "  Column1\n" +
            "FROM\n" +
            "  Table1;\n"
        );
    });

    it("formats SELECT query with complex WHERE", function() {
        const result = standardSqlFormatter.format(
            "SELECT count(*),'Column1','Testing', 'Testing Three' FROM Table1 WHERE Column1 = 'testing' " +
            "AND ( (Column2 = Column3 OR Column4 >= NOW()) );"
        );
        expect(result).toBe(
            "SELECT\n" +
            "  count(*),\n" +
            "  'Column1',\n" +
            "  'Testing',\n" +
            "  'Testing Three'\n" +
            "FROM\n" +
            "  Table1\n" +
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
        const result = standardSqlFormatter.format(
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

    it("formats SELECT query with SELECT query inside it", function() {
        const result = standardSqlFormatter.format(
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
        const result = standardSqlFormatter.format(
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
        const result = standardSqlFormatter.format(
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

    it("formats SELECT query with different variable types", function() {
        const result = standardSqlFormatter.format(
            "SELECT @variable, @'variable name';"
        );
        expect(result).toBe(
            "SELECT\n" +
            "  @variable,\n" +
            "  @'variable name';\n"
        );
    });

    it("formats simple INSERT query", function() {
        const result = standardSqlFormatter.format(
            "INSERT INTO Customers (ID, MoneyBalance, Address, City) VALUES (12,-123.4, 'Skagen 2111','Stavanger');"
        );
        expect(result).toBe(
            "INSERT INTO Customers (ID, MoneyBalance, Address, City)\n" +
            "VALUES\n" +
            "  (\n" +
            "    12, -123.4, 'Skagen 2111', 'Stavanger'\n" +
            "  );\n"
        );
    });

    it("formats long INSERT query including SELECT, IF and INNER JOIN parts", function() {
        const result = standardSqlFormatter.format(
            "INSERT INTO `PREFIX_specific_price` (`id_product`, `id_shop`, `id_currency`, `id_country`, `id_group`, `priority`, " +
            "`price`, `from_quantity`, `reduction`,   `reduction_type`, `from`, `to`) (" +
            "SELECT dq.`id_product`, 1, 1,0,1, 0, 0.00, dq.`quantity`, IF(dq.`id_discount_type` = 2, dq.`value`, dq.`value` / 100)," +
            "IF (dq.`id_discount_type` = 2, 'amount', 'percentage'), '0000-00-00 00:00:00', '0000-00-00 00:00:00' " +
            "FROM `PREFIX_discount_quantity` dq INNER JOIN `PREFIX_product` p ON (p.`id_product` = dq.`id_product`));"
        );
        expect(result).toBe(
            "INSERT INTO `PREFIX_specific_price` (\n" +
            "  `id_product`, `id_shop`, `id_currency`,\n" +
            "  `id_country`, `id_group`, `priority`,\n" +
            "  `price`, `from_quantity`, `reduction`,\n" +
            "  `reduction_type`, `from`, `to`\n" +
            ") (\n" +
            "  SELECT\n" +
            "    dq.`id_product`,\n" +
            "    1,\n" +
            "    1,\n" +
            "    0,\n" +
            "    1,\n" +
            "    0,\n" +
            "    0.00,\n" +
            "    dq.`quantity`,\n" +
            "    IF(\n" +
            "      dq.`id_discount_type` = 2, dq.`value`,\n" +
            "      dq.`value` / 100\n" +
            "    ),\n" +
            "    IF (\n" +
            "      dq.`id_discount_type` = 2, 'amount',\n" +
            "      'percentage'\n" +
            "    ),\n" +
            "    '0000-00-00 00:00:00',\n" +
            "    '0000-00-00 00:00:00'\n" +
            "  FROM\n" +
            "    `PREFIX_discount_quantity` dq\n" +
            "    INNER JOIN `PREFIX_product` p ON (p.`id_product` = dq.`id_product`)\n" +
            ");\n"
        );
    });

    it("formats simple UPDATE query", function() {
        const result = standardSqlFormatter.format(
            "uPDATE Customers set ContactName='Alfred Schmidt', City='Hamburg' WHERE CustomerName='Alfreds Futterkiste';"
        );
        expect(result).toBe(
            "uPDATE\n" +
            "  Customers\n" +
            "set\n" +
            "  ContactName = 'Alfred Schmidt',\n" +
            "  City = 'Hamburg'\n" +
            "WHERE\n" +
            "  CustomerName = 'Alfreds Futterkiste';\n"
        );
    });

    it("formats simple DELETE query", function() {
        const result = standardSqlFormatter.format(
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
        const result = standardSqlFormatter.format(
            "DROP TABLE IF EXISTS admin_role;"
        );
        expect(result).toBe(
            "DROP\n" +
            "  TABLE IF EXISTS admin_role;\n"
        );
    });

    it("formats uncomplete query", function() {
        const result = standardSqlFormatter.format("SELECT count(");
        expect(result).toBe(
            "SELECT\n" +
            "  count(\n"
        );
    });

    it("formats query that ends with open comment", function() {
        const result = standardSqlFormatter.format("SELECT count(*)\n/*Comment");
        expect(result).toBe(
            "SELECT\n" +
            "  count(*)\n" +
            "  /*Comment\n"
        );
    });

    it("formats UPDATE query with AS part", function() {
        const result = standardSqlFormatter.format(
            "UPDATE customers SET totalorders = ordersummary.total  FROM ( SELECT * FROM bank) As ordersummary"
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
            "  ) As ordersummary\n"
        );
    });

    it("formats top-level and newline multi-word reserved words with inconsistent spacing", function() {
        const result = standardSqlFormatter.format("SELECT * FROM foo LEFT \t OUTER  \n JOIN bar ORDER \n BY blah");
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
        expect(standardSqlFormatter.format("foo = bar")).toBe("foo = bar\n");
        expect(standardSqlFormatter.format("foo < bar")).toBe("foo < bar\n");
        expect(standardSqlFormatter.format("foo > bar")).toBe("foo > bar\n");
        expect(standardSqlFormatter.format("foo + bar")).toBe("foo + bar\n");
        expect(standardSqlFormatter.format("foo - bar")).toBe("foo - bar\n");
        expect(standardSqlFormatter.format("foo * bar")).toBe("foo * bar\n");
        expect(standardSqlFormatter.format("foo / bar")).toBe("foo / bar\n");
        expect(standardSqlFormatter.format("foo % bar")).toBe("foo % bar\n");
    });

    it("formats multi-char operators", function() {
        expect(standardSqlFormatter.format("foo != bar")).toBe("foo != bar\n");
        expect(standardSqlFormatter.format("foo <> bar")).toBe("foo <> bar\n");
        expect(standardSqlFormatter.format("foo == bar")).toBe("foo == bar\n"); // N1QL
        expect(standardSqlFormatter.format("foo || bar")).toBe("foo || bar\n"); // Oracle, Postgres, N1QL string concat

        expect(standardSqlFormatter.format("foo <= bar")).toBe("foo <= bar\n");
        expect(standardSqlFormatter.format("foo >= bar")).toBe("foo >= bar\n");

        expect(standardSqlFormatter.format("foo !< bar")).toBe("foo !< bar\n");
        expect(standardSqlFormatter.format("foo !> bar")).toBe("foo !> bar\n");
    });

    it("formats logical operators", function() {
        expect(standardSqlFormatter.format("foo ALL bar")).toBe("foo ALL bar\n");
        expect(standardSqlFormatter.format("foo = ANY (1, 2, 3)")).toBe("foo = ANY (1, 2, 3)\n");
        expect(standardSqlFormatter.format("EXISTS bar")).toBe("EXISTS bar\n");
        expect(standardSqlFormatter.format("foo IN (1, 2, 3)")).toBe("foo IN (1, 2, 3)\n");
        expect(standardSqlFormatter.format("foo LIKE 'hello%'")).toBe("foo LIKE 'hello%'\n");
        expect(standardSqlFormatter.format("foo IS NULL")).toBe("foo IS NULL\n");
        expect(standardSqlFormatter.format("UNIQUE foo")).toBe("UNIQUE foo\n");
    });

    it("formats AND/OR operators", function() {
        expect(standardSqlFormatter.format("foo BETWEEN bar AND baz")).toBe("foo BETWEEN bar\nAND baz\n");
        expect(standardSqlFormatter.format("foo AND bar")).toBe("foo\nAND bar\n");
        expect(standardSqlFormatter.format("foo OR bar")).toBe("foo\nOR bar\n");
    });

    it("recognizes strings", function() {
        expect(standardSqlFormatter.format("\"foo JOIN bar\"")).toBe("\"foo JOIN bar\"\n");
        expect(standardSqlFormatter.format("'foo JOIN bar'")).toBe("'foo JOIN bar'\n");
        expect(standardSqlFormatter.format("`foo JOIN bar`")).toBe("`foo JOIN bar`\n");
        expect(standardSqlFormatter.format("[foo JOIN bar]")).toBe("[foo JOIN bar]\n");
    });

    it("recognizes escaped strings", function() {
        expect(standardSqlFormatter.format("\"foo \\\" JOIN bar\"")).toBe("\"foo \\\" JOIN bar\"\n");
        expect(standardSqlFormatter.format("'foo \\' JOIN bar'")).toBe("'foo \\' JOIN bar'\n");
        expect(standardSqlFormatter.format("`foo `` JOIN bar`")).toBe("`foo `` JOIN bar`\n");
        expect(standardSqlFormatter.format("[foo ]] JOIN bar]")).toBe("[foo ]] JOIN bar]\n");
    });
});
