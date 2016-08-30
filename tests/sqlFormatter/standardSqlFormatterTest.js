import standardSqlFormatter from "xr/sqlFormatter/standardSqlFormatter";
import behavesLikeSqlFormatter from "tests/specs/sqlFormatter/behavesLikeSqlFormatter";

describe("standardSqlFormatter", function() {
    behavesLikeSqlFormatter(standardSqlFormatter);

    it("breaks long parenthized lists to multiple lines", function() {
        const result = standardSqlFormatter.format(
            "INSERT INTO some_table (id_product, id_shop, id_currency, id_country, id_group, priority, " +
            "price, from_quantity, reduction,   reduction_type, person, name) (" +
            "SELECT IF(dq.id_discounter_shopping = 2, dq.value, dq.value / 100)," +
            "IF (dq.id_discounter_shopping = 2, 'amount', 'percentage') FROM foo);"
        );
        expect(result).toBe(
            "INSERT INTO some_table (\n" +
            "  id_product, id_shop, id_currency, id_country,\n" +
            "  id_group, priority, price, from_quantity,\n" +
            "  reduction, reduction_type, person, name\n" +
            ") (\n" +
            "  SELECT\n" +
            "    IF(\n" +
            "      dq.id_discounter_shopping = 2, dq.value,\n" +
            "      dq.value / 100\n" +
            "    ),\n" +
            "    IF (\n" +
            "      dq.id_discounter_shopping = 2, 'amount',\n" +
            "      'percentage'\n" +
            "    )\n" +
            "  FROM\n" +
            "    foo\n" +
            ");\n"
        );
    });
});
