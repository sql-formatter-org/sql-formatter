import sqlFormatter from "./../src/sqlFormatter";
import behavesLikeSqlFormatter from "./behavesLikeSqlFormatter";

describe("RedshiftFormatter", function() {
    behavesLikeSqlFormatter("redshift");

    it("formats LIMIT", function() {
        expect(
            sqlFormatter.format(
                "SELECT col1 FROM tbl ORDER BY col2 DESC LIMIT 10;",
                { language: "pl/sql" }
            )
        ).toBe(
            "SELECT\n" +
                "  col1\n" +
                "FROM\n" +
                "  tbl\n" +
                "ORDER BY\n" +
                "  col2 DESC\n" +
                "LIMIT\n" +
                "  10;"
        );
    });

    it("formats only -- as a line comment", function() {
        const result = sqlFormatter.format(
            "SELECT col FROM\n" + "-- This is a comment\n" + "MyTable;\n",
            { language: "redshift" }
        );
        expect(result).toBe(
            "SELECT\n" +
                "  col\n" +
                "FROM\n" +
                "  -- This is a comment\n" +
                "  MyTable;"
        );
    });

    it("recognizes @ as part of identifiers", function() {
        const result = sqlFormatter.format("SELECT @col1 FROM tbl\n", {
            language: "pl/sql"
        });
        expect(result).toBe("SELECT\n" + "  @col1\n" + "FROM\n" + "  tbl");
    });

    it("formats short CREATE TABLE", function() {
        expect(sqlFormatter.format("CREATE TABLE items (a INT, b TEXT);")).toBe(
            "CREATE TABLE items (a INT, b TEXT);"
        );
    });

    it("formats long CREATE TABLE", function() {
        expect(
            sqlFormatter.format(
                "CREATE TABLE items (a INT PRIMARY KEY, b TEXT, c INT NOT NULL, d INT NOT NULL) DISTKEY(created_at) SORTKEY(created_at);",
                { language: "redshift" }
            )
        ).toBe(
            "CREATE TABLE items (\n" +
                "  a INT PRIMARY KEY,\n" +
                "  b TEXT,\n" +
                "  c INT NOT NULL,\n" +
                "  d INT NOT NULL\n" +
                ")\n" +
                "DISTKEY(created_at)\n" +
                "SORTKEY(created_at);"
        );
    });

    it("formats COPY", function() {
        expect(
            sqlFormatter.format(
                "COPY schema.table " +
                    "FROM 's3://bucket/file.csv' " +
                    "IAM_ROLE 'arn:aws:iam::123456789:role/rolename'" +
                    "FORMAT AS CSV DELIMITER ',' QUOTE '\"' " +
                    "REGION AS 'us-east-1'",
                { language: "redshift" }
            )
        ).toBe(
            "COPY\n" +
                "  schema.table\n" +
                "FROM\n" +
                "  's3://bucket/file.csv'\n" +
                "IAM_ROLE\n" +
                "  'arn:aws:iam::123456789:role/rolename'\n" +
                "FORMAT\n" +
                "  AS CSV\n" +
                "DELIMITER\n" +
                "  ',' QUOTE '\"'\n" +
                "REGION\n" +
                "  AS 'us-east-1'"
        );
    });
});
