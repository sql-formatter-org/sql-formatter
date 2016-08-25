import standardSqlFormatter from "xr/sqlFormatter/standardSqlFormatter";

describe("sqlFormatter", function() {
    describe("SELECT", function() {
        it("formats simple sentence", function() {
            const result = standardSqlFormatter.format("SELECT count(*),'Column1' FROM `Table1`;");
            expect(result).toBe(
                "SELECT\n" +
                "  COUNT(*),\n" +
                "  'Column1'\n" +
                "FROM\n" +
                "  `Table1`;\n"
            );
        });

        it("formats sentence with where, group/order by and limit part", function() {
            const result = standardSqlFormatter.format(
                "SELECT count(*),'Column1',`Testing`, `Testing Three` FROM `Table1` WHERE Column1 = 'testing' " +
                "AND ( (`Column2` = `Column3` OR Column4 >= NOW()) ) GROUP BY Column1 ORDER BY Column3 DESC LIMIT 5,10;"
            );
            expect(result).toBe(
                "SELECT\n" +
                "  COUNT(*),\n" +
                "  'Column1',\n" +
                "  `Testing`,\n" +
                "  `Testing Three`\n" +
                "FROM\n" +
                "  `Table1`\n" +
                "WHERE\n" +
                "  Column1 = 'testing'\n" +
                "AND\n" +
                "  (\n" +
                "    (\n" +
                "      `Column2` = `Column3`\n" +
                "      OR\n" +
                "        Column4 > = NOW()\n" +
                "    )\n" +
                "  )\n" +
                "GROUP BY\n" +
                "  Column1\n" +
                "ORDER BY\n" +
                "  Column3 DESC\n" +
                "LIMIT\n" +
                "  5, 10;\n"
            );
        });

        it("formats sentence with inner join part", function() {
            const result = standardSqlFormatter.format(
                "SELECT customer_id.from, COUNT(order_id) as total FROM customers " +
                "INNER JOIN orders ON customers.customer_id = orders.customer_id;"
            );
            expect(result).toBe(
                "SELECT\n" +
                "  customer_id.from,\n" +
                "  COUNT(order_id) AS total\n" +
                "FROM\n" +
                "  customers\n" +
                "INNER JOIN\n" +
                "  orders ON customers.customer_id = orders.customer_id;\n"
            );
        });

        it("formats sentence with comments", function() {
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

        it("formats sentence with variable", function() {
            const result = standardSqlFormatter.format(
                "SELECT @variable, @'variable name';"
            );
            expect(result).toBe(
                "SELECT\n" +
                "  @variable,\n" +
                "  @'variable name';\n"
            );
        });
    });

    describe("INSERT", function() {
        it("formats simple sentence", function() {
            const result = standardSqlFormatter.format(
                "INSERT iNtO Customers (ID, MoneyBalance, Address, City) VALUES (12,-123.4, `Skagen 21`,'Stavanger');"
            );
            expect(result).toBe(
                "INSERT INTO Customers (ID, MoneyBalance, Address, City)\n" +
                "VALUES\n" +
                "  (\n" +
                "    12, -123.4, `Skagen 21`, 'Stavanger'\n" +
                "  );\n"
            );
        });
    });

    describe("UPDATE", function() {
        it("formats sentence with where part", function() {
            const result = standardSqlFormatter.format(
                "uPDATE Customers set ContactName='Alfred Schmidt', City='Hamburg' WHERE CustomerName='Alfreds Futterkiste';"
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
    });

    describe("DELETE", function() {
        it("formats simple sentence", function() {
            const result = standardSqlFormatter.format(
                "DELETE FROM Customers WHERE CustomerName='Alfred' AND Phone=5002132;"
            );
            expect(result).toBe(
                "DELETE FROM\n" +
                "  Customers\n" +
                "WHERE\n" +
                "  CustomerName = 'Alfred'\n" +
                "AND\n" +
                "  Phone = 5002132;\n"
            );
        });
    });

    describe("DROP", function() {
        it("formats simple sentence", function() {
            const result = standardSqlFormatter.format(
                "DROP TABLE IF EXISTS `admin_role`;"
            );
            expect(result).toBe(
                "DROP\n" +
                "  TABLE IF EXISTS `admin_role`;\n"
            );
        });
    });
});
