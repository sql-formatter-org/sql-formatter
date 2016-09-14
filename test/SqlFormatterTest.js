import SqlFormatter from "../src/SqlFormatter";

describe("formatter", function() {
    beforeEach(function() {
        SqlFormatter.__set__({
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

    afterEach(function() {
        delete this.cfg;
    });

    it("formats N1QL query with custom config", function() {
        const result = new SqlFormatter().format("n1ql", "SELECT *");

        expect(this.cfg).toEqual({});
        expect(result).toBe("SELECT * (formatted as N1QL)");
    });

    it("formats standard SQL query", function() {
        const result = new SqlFormatter().format("sql", "SELECT *");

        expect(this.cfg).toEqual({});
        expect(result).toBe("SELECT * (formatted as standard SQL)");
    });

    it("throws error on other language queries", function() {
        expect(() => new SqlFormatter().format("hql", "SELECT *")).toThrow("Unsupported language");
    });

    describe("when custom config is provided", function() {
        it("passes it to N1QL formatter", function() {
            new SqlFormatter({indent: " "}).format("n1ql", "SELECT *");
            expect(this.cfg).toEqual({indent: " "});
        });

        it("passes it to standard SQL formatter", function() {
            new SqlFormatter({indent: " "}).format("sql", "SELECT *");
            expect(this.cfg).toEqual({indent: " "});
        });
    });
});
