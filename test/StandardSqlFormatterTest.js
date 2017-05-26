import sqlFormatter from "./../src/sqlFormatter";
import behavesLikeSqlFormatter from "./behavesLikeSqlFormatter";

describe("StandardSqlFormatter", function() {
    behavesLikeSqlFormatter();

    it("formats ALTER TABLE ... MODIFY query", function() {
        const result = sqlFormatter.format(
            "ALTER TABLE supplier MODIFY supplier_name char(100) NOT NULL;"
        );
        expect(result).toBe(
            "ALTER TABLE\n" +
            "  supplier\n" +
            "MODIFY\n" +
            "  supplier_name char(100) NOT NULL;\n"
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
            "  supplier_name VARCHAR(100) NOT NULL;\n"
        );
    });

    it("recognizes [] strings", function() {
        expect(sqlFormatter.format("[foo JOIN bar]")).toBe("[foo JOIN bar]\n");
        expect(sqlFormatter.format("[foo ]] JOIN bar]")).toBe("[foo ]] JOIN bar]\n");
    });

    it("recognizes @variables", function() {
        const result = sqlFormatter.format(
            "SELECT @variable, @a1_2.3$, @'var name', @\"var name\", @`var name`, @[var name];"
        );
        expect(result).toBe(
            "SELECT\n" +
            "  @variable,\n" +
            "  @a1_2.3$,\n" +
            "  @'var name',\n" +
            "  @\"var name\",\n" +
            "  @`var name`,\n" +
            "  @[var name];\n"
        );
    });

    it("replaces @variables with param values", function() {
        const result = sqlFormatter.format(
            "SELECT @variable, @a1_2.3$, @'var name', @\"var name\", @`var name`, @[var name], @'var\\name';",
            {
                language: "sql",
                params: {
                    "variable": "\"variable value\"",
                    "a1_2.3$": "'weird value'",
                    "var name": "'var value'",
                    "var\\name": "'var\\ value'"
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
            "  'var\\ value';\n"
        );
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
            "  :[var name];\n"
        );
    });

    it("replaces :variables with param values", function() {
        const result = sqlFormatter.format(
            "SELECT :variable, :a1_2.3$, :'var name', :\"var name\", :`var name`," +
            " :[var name], :'escaped \\'var\\'', :\"^*& weird \\\" var   \";",
            {
                language: "sql",
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
            "  'super weird value';\n"
        );
    });

    it("recognizes ?[0-9]* placeholders", function() {
        const result = sqlFormatter.format("SELECT ?1, ?25, ?;", {
            language: "sql"
        });
        expect(result).toBe(
            "SELECT\n" +
            "  ?1,\n" +
            "  ?25,\n" +
            "  ?;\n"
        );
    });

    it("replaces ? numbered placeholders with param values", function() {
        const result = sqlFormatter.format("SELECT ?1, ?2, ?0;", {
            language: "sql",
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
            "  first;\n"
        );
    });

    it("replaces ? indexed placeholders with param values", function() {
        const result = sqlFormatter.format("SELECT ?, ?, ?;", {
            language: "sql",
            params: ["first", "second", "third"]
        });
        expect(result).toBe(
            "SELECT\n" +
            "  first,\n" +
            "  second,\n" +
            "  third;\n"
        );
    });

    it("formats query with GO batch separator", function() {
        const result = sqlFormatter.format("SELECT 1 GO SELECT 2", {
            language: "sql",
            params: ["first", "second", "third"]
        });
        expect(result).toBe(
            "SELECT\n" +
            "  1\n" +
            "GO\n" +
            "SELECT\n" +
            "  2\n"
        );
    });

    it("formats SELECT query with CROSS JOIN", function() {
        const result = sqlFormatter.format("SELECT a, b FROM t CROSS JOIN t2 on t.id = t2.id_t", {
            language: "sql",
            params: ["first", "second", "third"]
        });
        expect(result).toBe(
            "SELECT\n" +
            "  a,\n" +
            "  b\n" +
            "FROM\n" +
            "  t\n" +
            "  CROSS JOIN t2 on t.id = t2.id_t\n"
        );
    });

    it("formats SELECT query with CROSS APPLY", function() {
        const result = sqlFormatter.format("SELECT a, b FROM t CROSS APPLY fn(t.id)", {
            language: "sql",
            params: ["first", "second", "third"]
        });
        expect(result).toBe(
            "SELECT\n" +
            "  a,\n" +
            "  b\n" +
            "FROM\n" +
            "  t\n" +
            "  CROSS APPLY fn(t.id)\n"
        );
    });

    it("formats simple SELECT", function() {
        const result = sqlFormatter.format("SELECT 'value'", );
        expect(result).toBe(
            "SELECT\n" +
            "  'value'\n"
        );
    });

    it("formats simple SELECT", function() {
        const result = sqlFormatter.format(
            "SELECT N'value';"
        );
        expect(result).toBe(
            "SELECT\n" +
            "  N'value';\n"
        );
    });
    
    it("formats SELECT with complex WHERE", function() {
        const result = sqlFormatter.format(
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

    it("formats SELECT with complex WHERE with national characters (MSSQL)", function() {
        const result = sqlFormatter.format(
            "SELECT * FROM foo WHERE Column1 = N'testing' " +
            "AND ( (Column2 = Column3 OR Column4 >= NOW()) );"
        );
        expect(result).toBe(
            "SELECT\n" +
            "  *\n" +
            "FROM\n" +
            "  foo\n" +
            "WHERE\n" +
            "  Column1 = N'testing'\n" +
            "  AND (\n" +
            "    (\n" +
            "      Column2 = Column3\n" +
            "      OR Column4 >= NOW()\n" +
            "    )\n" +
            "  );\n"
        );
    });

    it("formats SELECT query with OUTER APPLY", function() {
        const result = sqlFormatter.format("SELECT a, b FROM t OUTER APPLY fn(t.id)", {
            language: "sql",
            params: ["first", "second", "third"]
        });
        expect(result).toBe(
            "SELECT\n" +
            "  a,\n" +
            "  b\n" +
            "FROM\n" +
            "  t\n" +
            "  OUTER APPLY fn(t.id)\n"
        );
    });
});
