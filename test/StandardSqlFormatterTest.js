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
            "  @[var name];"
        );
    });

    it("replaces @variables with param values", function() {
        const result = sqlFormatter.format(
            "SELECT @variable, @a1_2.3$, @'var name', @\"var name\", @`var name`, @[var name], @'var\\name';",
            {
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
            "  'var\\ value';"
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

    it("formats query with GO batch separator", function() {
        const result = sqlFormatter.format("SELECT 1 GO SELECT 2", {
            params: ["first", "second", "third"]
        });
        expect(result).toBe(
            "SELECT\n" +
            "  1\n" +
            "GO\n" +
            "SELECT\n" +
            "  2"
        );
    });

    it("formats SELECT query with CROSS JOIN", function() {
        const result = sqlFormatter.format("SELECT a, b FROM t CROSS JOIN t2 on t.id = t2.id_t", {
            params: ["first", "second", "third"]
        });
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
        const result = sqlFormatter.format("SELECT a, b FROM t CROSS APPLY fn(t.id)", {
            params: ["first", "second", "third"]
        });
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

    it("formats simple SELECT with national characters (MSSQL)", function() {
        const result = sqlFormatter.format("SELECT N'value'");
        expect(result).toBe(
            "SELECT\n" +
            "  N'value'"
        );
    });

    it("formats SELECT query with OUTER APPLY", function() {
        const result = sqlFormatter.format("SELECT a, b FROM t OUTER APPLY fn(t.id)", {
            params: ["first", "second", "third"]
        });
        expect(result).toBe(
            "SELECT\n" +
            "  a,\n" +
            "  b\n" +
            "FROM\n" +
            "  t\n" +
            "  OUTER APPLY fn(t.id)"
        );
    });

    it("formats tricky line comments", function() {
        expect(sqlFormatter.format("SELECT a#comment, here\nFROM b--comment")).toBe(
            "SELECT\n" +
            "  a #comment, here\n" +
            "FROM\n" +
            "  b --comment"
        );
    });

    it("formats double curly brackets", function() {
        expect(sqlFormatter.format("SELECT * FROM {{b}}")).toBe(
          "SELECT\n" +
          "  *\n" +
          "FROM\n" +
          "  {{ b }}"
        );
    });

    it("formats triple curly brackets", function() {
        expect(sqlFormatter.format("SELECT * FROM {{{b}}}")).toBe(
          "SELECT\n" +
          "  *\n" +
          "FROM\n" +
          "  {{{ b }}}"
        );
    });

    it("formats query template correctly", function() {
        expect(sqlFormatter.format("SELECT * FROM {{@b}}")).toBe(
          "SELECT\n" +
          "  *\n" +
          "FROM\n" +
          "  {{ @b }}"
        );
    });
});
