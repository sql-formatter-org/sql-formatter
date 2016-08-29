import standardSqlFormatter from "xr/sqlFormatter/standardSqlFormatter";
import behavesLikeSqlFormatter from "tests/specs/sqlFormatter/behavesLikeSqlFormatter";

describe("standardSqlFormatter", function() {
    behavesLikeSqlFormatter(standardSqlFormatter);

    it("formats long INSERT query including SELECT, IF and INNER JOIN parts", function() {
        const result = standardSqlFormatter.format(
            "INSERT INTO `PREFIX_specific_price` (`id_product`, `id_shop`, `id_currency`, `id_country`, `id_group`, `priority`, " +
            "`price`, `from_quantity`, `reduction`,   `reduction_type`, `from`, `to`) (" +
            "SELECT dq.`id_product`, 1, 1,0,1, 0, 0.00, dq.`quantity`, IF(dq.`id_discount_type` = 2, dq.`value`, dq.`value` / 100)," +
            "IF (dq.`id_discount_type` = 2, 'amount', 'percentage'), '0000-00-00 00:00:00', '0000-00-00 00:00:00' " +
            "FROM `PREFIX_discount_quantity` dq INNER JOIN `PREFIX_product` p ON (p.`id_product` = dq.`id_product`));"
        );
        expect(result).toBe(
            "INSERT INTO `PREFIX_specific_price` (\n" +
            "  `id_product`, `id_shop`, `id_currency`,\n" +
            "  `id_country`, `id_group`, `priority`,\n" +
            "  `price`, `from_quantity`, `reduction`,\n" +
            "  `reduction_type`, `from`, `to`\n" +
            ") (\n" +
            "  SELECT\n" +
            "    dq.`id_product`,\n" +
            "    1,\n" +
            "    1,\n" +
            "    0,\n" +
            "    1,\n" +
            "    0,\n" +
            "    0.00,\n" +
            "    dq.`quantity`,\n" +
            "    IF(\n" +
            "      dq.`id_discount_type` = 2, dq.`value`,\n" +
            "      dq.`value` / 100\n" +
            "    ),\n" +
            "    IF (\n" +
            "      dq.`id_discount_type` = 2, 'amount',\n" +
            "      'percentage'\n" +
            "    ),\n" +
            "    '0000-00-00 00:00:00',\n" +
            "    '0000-00-00 00:00:00'\n" +
            "  FROM\n" +
            "    `PREFIX_discount_quantity` dq\n" +
            "    INNER JOIN `PREFIX_product` p ON (p.`id_product` = dq.`id_product`)\n" +
            ");\n"
        );
    });
});
