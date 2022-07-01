# INSERT statement

[SQL standard][] specifies the following CREATE TABLE syntax:

    INSERT INTO table_name

All dialects (except Hive) suppurt this syntax, plus a bunch of extra stuff:

[BigQuery][]:

    INSERT INTO table_name

[DB2][]:

    INSERT INTO table_name

[Hive][]:

    INSERT INTO TABLE table_name

[MariaDB][]:

    INSERT [LOW_PRIORITY | DELAYED | HIGH_PRIORITY] [IGNORE] [INTO] table_name

    REPLACE [LOW_PRIORITY | DELAYED] [INTO] table_name

[MySQL][]:

    INSERT [LOW_PRIORITY | DELAYED | HIGH_PRIORITY] [IGNORE] [INTO] table_name

    REPLACE [LOW_PRIORITY | DELAYED] [INTO] table_name

[N1QL][]:

    INSERT INTO table_name

[PL/SQL][]:

    INSERT [hint] [ALL] INTO

[PostgreSQL][]:

    INSERT INTO table_name

[Redshift][]:

    INSERT INTO table_name

[Spark][]:

    INSERT [INTO | OVERWRITE] [TABLE] table_name

[SQLite][]:

    INSERT [OR {ABORT | FAIL | IGNORE | REPLACE | ROLLBACK}] INTO table_name

    REPLACE INTO table_name

[Transact-SQL][]:

    INSERT [TOP ( expression ) [PERCENT]] [INTO] table_name

[sql standard]: https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#insert-statement
[bigquery]: https://cloud.google.com/bigquery/docs/reference/standard-sql/dml-syntax#insert_statement
[db2]: https://www.ibm.com/docs/en/db2/9.7?topic=statements-insert
[hive]: https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DML#LanguageManualDML-InsertingvaluesintotablesfromSQL
[mariadb]: https://mariadb.com/kb/en/insert/
[mysql]: https://dev.mysql.com/doc/refman/8.0/en/insert.html
[n1ql]: https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/insert.html
[pl/sql]: https://docs.oracle.com/en/database/oracle/oracle-database/19/sqlrf/INSERT.html
[postgresql]: https://www.postgresql.org/docs/current/sql-insert.html
[redshift]: https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_TABLE_NEW.html
[spark]: https://spark.apache.org/docs/latest/sql-ref-syntax-dml-insert-table.html
[sqlite]: https://www.sqlite.org/lang_insert.html
[transact-sql]: https://docs.microsoft.com/en-us/sql/t-sql/statements/insert-transact-sql?view=sql-server-ver16
