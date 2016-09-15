import StandardSqlFormatter from "../../src/languages/StandardSqlFormatter";
import behavesLikeSqlFormatter from "./behavesLikeSqlFormatter";
import respectsCustomCfg from "./respectsCustomCfg";

describe("StandardSqlFormatter", function() {
    behavesLikeSqlFormatter(new StandardSqlFormatter());
    respectsCustomCfg(StandardSqlFormatter);

    it("formats ALTER TABLE ... MODIFY query", function() {
        const result = new StandardSqlFormatter().format(
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
        const result = new StandardSqlFormatter().format(
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
        expect(new StandardSqlFormatter().format("[foo JOIN bar]")).toBe("[foo JOIN bar]\n");
        expect(new StandardSqlFormatter().format("[foo ]] JOIN bar]")).toBe("[foo ]] JOIN bar]\n");
    });

    it("recognizes @variables", function() {
        const result = new StandardSqlFormatter().format(
            "SELECT @variable, @'var name', @\"var name\", @`var name`, @[var name];"
        );
        expect(result).toBe(
            "SELECT\n" +
            "  @variable,\n" +
            "  @'var name',\n" +
            "  @\"var name\",\n" +
            "  @`var name`,\n" +
            "  @[var name];\n"
        );
    });

    it("recognizes :variables", function() {
        const result = new StandardSqlFormatter().format(
            "SELECT :variable, :'var name', :\"var name\", :`var name`, :[var name];"
        );
        expect(result).toBe(
            "SELECT\n" +
            "  :variable,\n" +
            "  :'var name',\n" +
            "  :\"var name\",\n" +
            "  :`var name`,\n" +
            "  :[var name];\n"
        );
    });
});
