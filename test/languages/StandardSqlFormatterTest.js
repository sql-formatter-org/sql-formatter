import StandardSqlFormatter from "../../src/languages/StandardSqlFormatter";
import behavesLikeSqlFormatter from "./behavesLikeSqlFormatter";
import respectsCustomCfg from "./respectsCustomCfg";

describe("StandardSqlFormatter", function() {
    behavesLikeSqlFormatter(new StandardSqlFormatter());
    respectsCustomCfg(StandardSqlFormatter);

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
