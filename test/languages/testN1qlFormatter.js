import behavesLikeSqlFormatter from "./behavesLikeSqlFormatter";

export default function testN1qlFormatter(formatter) {
    describe("N1qlFormatter", function() {
        behavesLikeSqlFormatter(formatter, "n1ql");

        it("formats SELECT query with element selection expression", function() {
            const result = formatter.format("SELECT orderlines[0].productId FROM orders;", {language: "n1ql"});
            expect(result).toBe(
                "SELECT\n" +
                "  orderlines[0].productId\n" +
                "FROM\n" +
                "  orders;\n"
            );
        });

        it("formats SELECT query with primary key quering", function() {
            const result = formatter.format(
                "SELECT fname, email FROM tutorial USE KEYS ['dave', 'ian'];",
                {language: "n1ql"}
            );
            expect(result).toBe(
                "SELECT\n" +
                "  fname,\n" +
                "  email\n" +
                "FROM\n" +
                "  tutorial\n" +
                "USE KEYS\n" +
                "  ['dave', 'ian'];\n"
            );
        });

        it("formats INSERT with {} object literal", function() {
            const result = formatter.format(
                "INSERT INTO heroes (KEY, VALUE) VALUES ('123', {'id':1,'type':'Tarzan'});",
                {language: "n1ql"}
            );
            expect(result).toBe(
                "INSERT INTO\n" +
                "  heroes (KEY, VALUE)\n" +
                "VALUES\n" +
                "  ('123', {'id': 1, 'type': 'Tarzan'});\n"
            );
        });

        it("formats INSERT with large object and array literals", function() {
            const result = formatter.format(
                "INSERT INTO heroes (KEY, VALUE) VALUES ('123', {'id': 1, 'type': 'Tarzan', " +
                "'array': [123456789, 123456789, 123456789, 123456789, 123456789], 'hello': 'world'});",
                {language: "n1ql"}
            );
            expect(result).toBe(
                "INSERT INTO\n" +
                "  heroes (KEY, VALUE)\n" +
                "VALUES\n" +
                "  (\n" +
                "    '123',\n" +
                "    {\n" +
                "      'id': 1,\n" +
                "      'type': 'Tarzan',\n" +
                "      'array': [\n" +
                "        123456789,\n" +
                "        123456789,\n" +
                "        123456789,\n" +
                "        123456789,\n" +
                "        123456789\n" +
                "      ],\n" +
                "      'hello': 'world'\n" +
                "    }\n" +
                "  );\n"
            );
        });

        it("formats SELECT query with UNNEST toplevel reserver word", function() {
            const result = formatter.format(
                "SELECT * FROM tutorial UNNEST tutorial.children c;",
                {language: "n1ql"}
            );
            expect(result).toBe(
                "SELECT\n" +
                "  *\n" +
                "FROM\n" +
                "  tutorial\n" +
                "UNNEST\n" +
                "  tutorial.children c;\n"
            );
        });

        it("formats SELECT query with NEST and USE KEYS", function() {
            const result = formatter.format(
                "SELECT * FROM usr " +
                "USE KEYS 'Elinor_33313792' NEST orders_with_users orders " +
                "ON KEYS ARRAY s.order_id FOR s IN usr.shipped_order_history END;",
                {language: "n1ql"}
            );
            expect(result).toBe(
                "SELECT\n" +
                "  *\n" +
                "FROM\n" +
                "  usr\n" +
                "USE KEYS\n" +
                "  'Elinor_33313792'\n" +
                "NEST\n" +
                "  orders_with_users orders ON KEYS ARRAY s.order_id FOR s IN usr.shipped_order_history END;\n"
            );
        });

        it("formats explained DELETE query with USE KEYS and RETURNING", function() {
            const result = formatter.format(
                "EXPLAIN DELETE FROM tutorial t USE KEYS 'baldwin' RETURNING t",
                {language: "n1ql"}
            );
            expect(result).toBe(
                "EXPLAIN DELETE FROM\n" +
                "  tutorial t\n" +
                "USE KEYS\n" +
                "  'baldwin' RETURNING t\n"
            );
        });

        it("formats UPDATE query with USE KEYS and RETURNING", function() {
            const result = formatter.format(
                "UPDATE tutorial USE KEYS 'baldwin' SET type = 'actor' RETURNING tutorial.type",
                {language: "n1ql"}
            );
            expect(result).toBe(
                "UPDATE\n" +
                "  tutorial\n" +
                "USE KEYS\n" +
                "  'baldwin'\n" +
                "SET\n" +
                "  type = 'actor' RETURNING tutorial.type\n"
            );
        });
    });
}
