import standardSqlFormatter from "xr/sqlFormatter/standardSqlFormatter";
import behavesLikeSqlFormatter from "tests/specs/sqlFormatter/behavesLikeSqlFormatter";

describe("standardSqlFormatter", function() {
    behavesLikeSqlFormatter(standardSqlFormatter);
});
