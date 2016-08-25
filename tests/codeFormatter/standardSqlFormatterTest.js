import standardSqlFormatter from "xr/codeFormatter/standardSqlFormatter";

describe("sqlFormatter", function() {
    it("formats simple SELECT", function() {
        const result = standardSqlFormatter.format("SELECT count(*),'Column1' FROM `Table1`;");
        expect(result).toBe(
            "SELECT\n" +
            "  COUNT(*),\n" +
            "  'Column1'\n" +
            "FROM\n" +
            "  `Table1`;\n"
        );
    });

    it("formats complex SELECT", function() {
        const result = standardSqlFormatter.format(
            "SELECT count(*),'Column1',`Testing`, `Testing Three` FROM `Table1` WHERE Column1 = 'testing' " +
            "AND ( (`Column2` = `Column3` OR Column4 >= NOW()) ) GROUP BY Column1 ORDER BY Column3 DESC LIMIT 5,10;"
        );
        expect(result).toBe(
            "SELECT\n" +
            "  COUNT(*),\n" +
            "  'Column1',\n" +
            "  `Testing`,\n" +
            "  `Testing Three`\n" +
            "FROM\n" +
            "  `Table1`\n" +
            "WHERE\n" +
            "  Column1 = 'testing'\n" +
            "  AND (\n" +
            "    (\n" +
            "      `Column2` = `Column3`\n" +
            "      OR Column4 > = NOW()\n" +
            "    )\n" +
            "  )\n" +
            "GROUP BY\n" +
            "  Column1\n" +
            "ORDER BY\n" +
            "  Column3 DESC\n" +
            "LIMIT\n" +
            "  5,10;\n"
        );
    });
});
