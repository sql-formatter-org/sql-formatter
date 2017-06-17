import sqlFormatter from "./../src/sqlFormatter";
import behavesLikeSqlFormatter from "./behavesLikeSqlFormatter";

describe("Db2Formatter", function() {
    behavesLikeSqlFormatter("db2");

    it("formats FETCH FIRST query", function() {
        expect(sqlFormatter.format(
            "SELECT col1 FROM tbl ORDER BY col2 DESC FETCH FIRST 20 ROWS ONLY;",
            {language: "db2"}
        )).toBe(
            "SELECT\n" +
            "  col1\n" +
            "FROM\n" +
            "  tbl\n" +
            "ORDER BY\n" +
            "  col2 DESC\n" +
            "FETCH FIRST\n" +
            "  20 ROWS ONLY;\n"
        );
    });

    it("recognizes :variables", function() {
        expect(sqlFormatter.format("SELECT :variable;", {language: "db2"})).toBe(
            "SELECT\n" +
            "  :variable;\n"
        );
    });

    it("replaces :variables with param values", function() {
        const result = sqlFormatter.format(
            "SELECT :variable",
            {language: "db2", params: {"variable": "\"variable value\""}}
        );
        expect(result).toBe(
            "SELECT\n" +
            "  \"variable value\"\n"
        );
    });
});
