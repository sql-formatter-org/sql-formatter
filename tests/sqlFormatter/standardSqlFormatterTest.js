import standardSqlFormatter from "xr/sqlFormatter/standardSqlFormatter";
import behavesLikeSqlFormatter from "tests/specs/sqlFormatter/behavesLikeSqlFormatter";

describe("standardSqlFormatter", function() {
    behavesLikeSqlFormatter(standardSqlFormatter);

    it("recognizes [] strings", function() {
        expect(standardSqlFormatter.format("[foo JOIN bar]")).toBe("[foo JOIN bar]\n");
        expect(standardSqlFormatter.format("[foo ]] JOIN bar]")).toBe("[foo ]] JOIN bar]\n");
    });
});
