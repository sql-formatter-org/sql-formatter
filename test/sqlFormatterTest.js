import sqlFormatter from "./../src/sqlFormatter";

import assert from 'assert';

describe("sqlFormatter", function() {
    it("throws error when unsupported language parameter specified", function() {
        assert.throws(() => {
            sqlFormatter.format("SELECT *", {language: "blah"});
        }, "Unsupported SQL dialect: blah");
    });
});
