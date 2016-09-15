import sqlFormatter from "../src/SqlFormatter";

describe("sqlFormatter", function() {
    beforeEach(function() {
        sqlFormatter.__set__({
            N1qlFormatter: (cfg) => {
                this.cfg = cfg;

                return {
                    format: query => query + " (formatted as N1QL)"
                };
            },
            StandardSqlFormatter: (cfg) => {
                this.cfg = cfg;

                return {
                    format: query => query + " (formatted as standard SQL)"
                };
            }
        });
    });

    it("formats N1QL query with custom config", function() {
        const result = sqlFormatter.format("SELECT *", {language: "n1ql"});

        expect(result).toBe("SELECT * (formatted as N1QL)");
    });

    it("formats standard SQL query as default", function() {
        const result = sqlFormatter.format("SELECT *");

        expect(result).toBe("SELECT * (formatted as standard SQL)");
    });

    it("passes on indent cfg", function() {
        sqlFormatter.format("SELECT *", {indent: "   "});
        expect(this.cfg).toEqual({indent: "   "});
    });
});
