/**
 * Checks if custom configuration is working
 * @param  {SqlFormatter} Formatter
 */
export default function respectsCustomCfg(Formatter) {
    it("uses given indent value for indention", function() {
        const formatter = new Formatter({indent: "    "});
        const result = formatter.format("SELECT count(*),Column1 FROM Table1;");

        expect(result).toBe(
            "SELECT\n" +
            "    count(*),\n" +
            "    Column1\n" +
            "FROM\n" +
            "    Table1;\n"
        );
    });
}
