import sqlFormatter from "./../src/sqlFormatter";
import behavesLikeSqlFormatter from "./behavesLikeSqlFormatter";

import assert from 'assert';

describe("Db2Formatter", function() {
    behavesLikeSqlFormatter("db2");

    it("formats FETCH FIRST like LIMIT", function() {
        assert.equal(sqlFormatter.format(
            "SELECT col1 FROM tbl ORDER BY col2 DESC FETCH FIRST 20 ROWS ONLY;",
            {language: "db2"}
        ),
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
            {language: "db2"}
        );
        assert.equal(result, 
            "SELECT\n" +
            "  col\n" +
            "FROM\n" +
            "  -- This is a comment\n" +
            "  MyTable;"
        );
    });

    it("recognizes @ and # as part of identifiers", function() {
        const result = sqlFormatter.format(
            "SELECT col#1, @col2 FROM tbl\n",
            {language: "db2"}
        );
        assert.equal(result, 
            "SELECT\n" +
            "  col#1,\n" +
            "  @col2\n" +
            "FROM\n" +
            "  tbl"
        );
    });

    it("recognizes :variables", function() {
        assert.equal(sqlFormatter.format("SELECT :variable;", {language: "db2"}),
            "SELECT\n" +
            "  :variable;"
        );
    });

    it("replaces :variables with param values", function() {
        const result = sqlFormatter.format(
            "SELECT :variable",
            {language: "db2", params: {"variable": "\"variable value\""}}
        );
        assert.equal(result, 
            "SELECT\n" +
            "  \"variable value\""
        );
    });
});
