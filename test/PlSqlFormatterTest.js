import sqlFormatter from "./../src/sqlFormatter";
import behavesLikeSqlFormatter from "./behavesLikeSqlFormatter";

describe("PlSqlFormatter", function() {
    behavesLikeSqlFormatter("pl/sql");

    it("formats FETCH FIRST like LIMIT", function() {
        expect(sqlFormatter.format(
            "SELECT col1 FROM tbl ORDER BY col2 DESC FETCH FIRST 20 ROWS ONLY;",
            {language: "pl/sql"}
        )).toBe(
            "SELECT\n" +
            "  col1\n" +
            "FROM\n" +
            "  tbl\n" +
            "ORDER BY\n" +
            "  col2 DESC\n" +
            "FETCH FIRST\n" +
            "  20 ROWS ONLY;"
        );
    });

    it("formats only -- as a line comment", function() {
        const result = sqlFormatter.format(
            "SELECT col FROM\n" +
            "-- This is a comment\n" +
            "MyTable;\n",
            {language: "pl/sql"}
        );
        expect(result).toBe(
            "SELECT\n" +
            "  col\n" +
            "FROM\n" +
            "  -- This is a comment\n" +
            "  MyTable;"
        );
    });

    it("recognizes _, $, #, . and @ as part of identifiers", function() {
        const result = sqlFormatter.format(
            "SELECT my_col$1#, col.2@ FROM tbl\n",
            {language: "pl/sql"}
        );
        expect(result).toBe(
            "SELECT\n" +
            "  my_col$1#,\n" +
            "  col.2@\n" +
            "FROM\n" +
            "  tbl"
        );
    });

    it("formats short CREATE TABLE", function() {
        expect(sqlFormatter.format(
            "CREATE TABLE items (a INT PRIMARY KEY, b TEXT);"
        )).toBe(
            "CREATE TABLE items (a INT PRIMARY KEY, b TEXT);"
        );
    });

    it("formats long CREATE TABLE", function() {
        expect(sqlFormatter.format(
            "CREATE TABLE items (a INT PRIMARY KEY, b TEXT, c INT NOT NULL, d INT NOT NULL);"
        )).toBe(
            "CREATE TABLE items (\n" +
            "  a INT PRIMARY KEY,\n" +
            "  b TEXT,\n" +
            "  c INT NOT NULL,\n" +
            "  d INT NOT NULL\n" +
            ");"
        );
    });

    it("formats INSERT without INTO", function() {
        const result = sqlFormatter.format(
            "INSERT Customers (ID, MoneyBalance, Address, City) VALUES (12,-123.4, 'Skagen 2111','Stv');"
        );
        expect(result).toBe(
            "INSERT\n" +
            "  Customers (ID, MoneyBalance, Address, City)\n" +
            "VALUES\n" +
            "  (12, -123.4, 'Skagen 2111', 'Stv');"
        );
    });

    it("formats ALTER TABLE ... MODIFY query", function() {
        const result = sqlFormatter.format(
            "ALTER TABLE supplier MODIFY supplier_name char(100) NOT NULL;"
        );
        expect(result).toBe(
            "ALTER TABLE\n" +
            "  supplier\n" +
            "MODIFY\n" +
            "  supplier_name char(100) NOT NULL;"
        );
    });

    it("formats ALTER TABLE ... ALTER COLUMN query", function() {
        const result = sqlFormatter.format(
            "ALTER TABLE supplier ALTER COLUMN supplier_name VARCHAR(100) NOT NULL;"
        );
        expect(result).toBe(
            "ALTER TABLE\n" +
            "  supplier\n" +
            "ALTER COLUMN\n" +
            "  supplier_name VARCHAR(100) NOT NULL;"
        );
    });

    it("recognizes [] strings", function() {
        expect(sqlFormatter.format("[foo JOIN bar]")).toBe("[foo JOIN bar]");
        expect(sqlFormatter.format("[foo ]] JOIN bar]")).toBe("[foo ]] JOIN bar]");
    });

    it("recognizes :variables", function() {
        const result = sqlFormatter.format(
            "SELECT :variable, :a1_2.3$, :'var name', :\"var name\", :`var name`, :[var name];"
        );
        expect(result).toBe(
            "SELECT\n" +
            "  :variable,\n" +
            "  :a1_2.3$,\n" +
            "  :'var name',\n" +
            "  :\"var name\",\n" +
            "  :`var name`,\n" +
            "  :[var name];"
        );
    });

    it("replaces :variables with param values", function() {
        const result = sqlFormatter.format(
            "SELECT :variable, :a1_2.3$, :'var name', :\"var name\", :`var name`," +
            " :[var name], :'escaped \\'var\\'', :\"^*& weird \\\" var   \";",
            {
                params: {
                    "variable": "\"variable value\"",
                    "a1_2.3$": "'weird value'",
                    "var name": "'var value'",
                    "escaped 'var'": "'weirder value'",
                    "^*& weird \" var   ": "'super weird value'"
                }
            }
        );
        expect(result).toBe(
            "SELECT\n" +
            "  \"variable value\",\n" +
            "  'weird value',\n" +
            "  'var value',\n" +
            "  'var value',\n" +
            "  'var value',\n" +
            "  'var value',\n" +
            "  'weirder value',\n" +
            "  'super weird value';"
        );
    });

    it("recognizes ?[0-9]* placeholders", function() {
        const result = sqlFormatter.format("SELECT ?1, ?25, ?;");
        expect(result).toBe(
            "SELECT\n" +
            "  ?1,\n" +
            "  ?25,\n" +
            "  ?;"
        );
    });

    it("replaces ? numbered placeholders with param values", function() {
        const result = sqlFormatter.format("SELECT ?1, ?2, ?0;", {
            params: {
                0: "first",
                1: "second",
                2: "third"
            }
        });
        expect(result).toBe(
            "SELECT\n" +
            "  second,\n" +
            "  third,\n" +
            "  first;"
        );
    });

    it("replaces ? indexed placeholders with param values", function() {
        const result = sqlFormatter.format("SELECT ?, ?, ?;", {
            params: ["first", "second", "third"]
        });
        expect(result).toBe(
            "SELECT\n" +
            "  first,\n" +
            "  second,\n" +
            "  third;"
        );
    });

    it("formats SELECT query with CROSS JOIN", function() {
        const result = sqlFormatter.format("SELECT a, b FROM t CROSS JOIN t2 on t.id = t2.id_t");
        expect(result).toBe(
            "SELECT\n" +
            "  a,\n" +
            "  b\n" +
            "FROM\n" +
            "  t\n" +
            "  CROSS JOIN t2 on t.id = t2.id_t"
        );
    });

    it("formats SELECT query with CROSS APPLY", function() {
        const result = sqlFormatter.format("SELECT a, b FROM t CROSS APPLY fn(t.id)", );
        expect(result).toBe(
            "SELECT\n" +
            "  a,\n" +
            "  b\n" +
            "FROM\n" +
            "  t\n" +
            "  CROSS APPLY fn(t.id)"
        );
    });

    it("formats simple SELECT", function() {
        const result = sqlFormatter.format("SELECT N, M FROM t");
        expect(result).toBe(
            "SELECT\n" +
            "  N,\n" +
            "  M\n" +
            "FROM\n" +
            "  t"
        );
    });

    it("formats simple SELECT with national characters", function() {
        const result = sqlFormatter.format("SELECT N'value'");
        expect(result).toBe(
            "SELECT\n" +
            "  N'value'"
        );
    });

    it("formats SELECT query with OUTER APPLY", function() {
        const result = sqlFormatter.format("SELECT a, b FROM t OUTER APPLY fn(t.id)");
        expect(result).toBe(
            "SELECT\n" +
            "  a,\n" +
            "  b\n" +
            "FROM\n" +
            "  t\n" +
            "  OUTER APPLY fn(t.id)"
        );
    });

    it("formats CASE ... WHEN with a blank expression", function() {
        const result = sqlFormatter.format(
            "CASE WHEN option = 'foo' THEN 1 WHEN option = 'bar' THEN 2 WHEN option = 'baz' THEN 3 ELSE 4 END;"
        );

        expect(result).toBe(
            "CASE\n" +
            "  WHEN option = 'foo' THEN 1\n" +
            "  WHEN option = 'bar' THEN 2\n" +
            "  WHEN option = 'baz' THEN 3\n" +
            "  ELSE 4\n" +
            "END;"
        );
    });

    it("formats CASE ... WHEN inside SELECT", function() {
        const result = sqlFormatter.format(
            "SELECT foo, bar, CASE baz WHEN 'one' THEN 1 WHEN 'two' THEN 2 ELSE 3 END FROM table"
        );

        expect(result).toBe(
            "SELECT\n" +
            "  foo,\n" +
            "  bar,\n" +
            "  CASE\n" +
            "    baz\n" +
            "    WHEN 'one' THEN 1\n" +
            "    WHEN 'two' THEN 2\n" +
            "    ELSE 3\n" +
            "  END\n" +
            "FROM\n" +
            "  table"
        );
    });

    it("formats CASE ... WHEN with an expression", function() {
        const result = sqlFormatter.format(
            "CASE toString(getNumber()) WHEN 'one' THEN 1 WHEN 'two' THEN 2 WHEN 'three' THEN 3 ELSE 4 END;"
        );

        expect(result).toBe(
            "CASE\n" +
            "  toString(getNumber())\n" +
            "  WHEN 'one' THEN 1\n" +
            "  WHEN 'two' THEN 2\n" +
            "  WHEN 'three' THEN 3\n" +
            "  ELSE 4\n" +
            "END;"
        );
    });
});
