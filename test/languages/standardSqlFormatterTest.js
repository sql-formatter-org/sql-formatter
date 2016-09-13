import standardSqlFormatter from "xr/sqlFormatter/standardSqlFormatter";
import behavesLikeSqlFormatter from "tests/specs/sqlFormatter/behavesLikeSqlFormatter";

describe("standardSqlFormatter", function() {
    behavesLikeSqlFormatter(standardSqlFormatter);

    it("recognizes [] strings", function() {
        expect(standardSqlFormatter.format("[foo JOIN bar]")).toBe("[foo JOIN bar]\n");
        expect(standardSqlFormatter.format("[foo ]] JOIN bar]")).toBe("[foo ]] JOIN bar]\n");
    });

    it("recognizes @variables", function() {
        const result = standardSqlFormatter.format(
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
        const result = standardSqlFormatter.format(
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
