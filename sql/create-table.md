# CREATE TABLE statement

[SQL standard][] specifies the following CREATE TABLE syntax:

    CREATE [{GLOBAL | LOCAL} TEMPORARY] TABLE

Dialects have considerable variation:

[BigQuery][]:

    CREATE [OR REPLACE] [TEMP | TEMPORARY] TABLE [IF NOT EXISTS]

[DB2][]:

    CREATE [GLOBAL TEMPORARY] TABLE

[Hive][]:

    CREATE [TEMPORARY] [EXTERNAL] TABLE [IF NOT EXISTS]

[MariaDB][]:

    CREATE [OR REPLACE] [TEMPORARY] TABLE [IF NOT EXISTS]

[MySQL][]:

    CREATE [TEMPORARY] TABLE [IF NOT EXISTS]

[N1QL][]:

_No support for CREATE TABLE._

[PL/SQL][]:

    CREATE [table_type] TABLE

    table_type:
        {GLOBAL | PRIVATE} TEMPORARY
      | SHARDED
      | DUPLICATED
      | [IMMUTABLE] BLOCKCHAIN
      | IMMUTABLE

[PostgreSQL][]:

    CREATE [[GLOBAL | LOCAL] {TEMPORARY | TEMP} | UNLOGGED] TABLE [IF NOT EXISTS]

[Redshift][]:

    CREATE [[LOCAL] {TEMPORARY | TEMP}] TABLE [IF NOT EXISTS]

[Spark][]:

    CREATE [EXTERNAL] TABLE [IF NOT EXISTS]

[SQLite][]:

    CREATE [TEMPORARY | TEMP] TABLE [IF NOT EXISTS]

[Transact-SQL][]:

    CREATE TABLE

[Trino][]:

    CREATE TABLE [IF NOT EXISTS]

[sql standard]: https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#_11_3_table_definition
[bigquery]: https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language#create_table_statement
[db2]: https://www.ibm.com/docs/en/db2/9.7?topic=statements-create-table
[hive]: https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL#LanguageManualDDL-CreateTableCreate/Drop/TruncateTable
[mariadb]: https://mariadb.com/kb/en/create-table/
[mysql]: https://dev.mysql.com/doc/refman/8.0/en/create-table.html
[n1ql]: https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/createscope.html
[pl/sql]: https://docs.oracle.com/en/database/oracle/oracle-database/19/sqlrf/CREATE-TABLE.html
[postgresql]: https://www.postgresql.org/docs/current/sql-createtable.html
[redshift]: https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_TABLE_NEW.html
[spark]: https://spark.apache.org/docs/latest/sql-ref-syntax-ddl-create-table.html
[sqlite]: https://www.sqlite.org/lang_createtable.html
[transact-sql]: https://docs.microsoft.com/en-us/sql/t-sql/statements/create-table-transact-sql?view=sql-server-ver15
[trino]: https://trino.io/docs/current/sql/create-table.html
