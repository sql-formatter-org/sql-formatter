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
            "SELECT @variable, @a1_2.3$, @'var name', @\"var name\", @`var name`, @[var name];",
            {
                language: "sql",
                params: {
                    "variable": "\"variable value\"",
                    "a1_2.3$": "'weird value'",
                    "var name": "'var value'"
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
            "  'var value';\n"
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
            "SELECT :variable, :a1_2.3$, :'var name', :\"var name\", :`var name`, :[var name];",
            {
                language: "sql",
                params: {
                    "variable": "\"variable value\"",
                    "a1_2.3$": "'weird value'",
                    "var name": "'var value'"
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
            "  'var value';\n"
        );
    });

    it("recognizes ?variables", function() {
        const result = sqlFormatter.format(
            "SELECT ?variable, ?a1_2.3$, ?'var name', ?\"var name\", ?`var name`, ?[var name];"
        );
        expect(result).toBe(
            "SELECT\n" +
            "  ?variable,\n" +
            "  ?a1_2.3$,\n" +
            "  ?'var name',\n" +
            "  ?\"var name\",\n" +
            "  ?`var name`,\n" +
            "  ?[var name];\n"
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
});
