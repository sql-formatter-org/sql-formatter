# SELECT statement

[SQL standard][] defines the following syntax for the start of a query:

    SELECT [ALL | DISTINCT]

All dialects support that, but also quite a bit extra stuff:

[BigQuery][]:

    SELECT [ALL | DISTINCT] [AS {STRUCT | VALUE}]

[DB2][]:

    SELECT [ALL | DISTINCT]

[Hive][]:

    SELECT [ALL | DISTINCT]

[MariaDB][]:

    SELECT
      [ALL | DISTINCT | DISTINCTROW]
      [HIGH_PRIORITY]
      [STRAIGHT_JOIN]
      [SQL_SMALL_RESULT] [SQL_BIG_RESULT] [SQL_BUFFER_RESULT]
      [SQL_CACHE | SQL_NO_CACHE] [SQL_CALC_FOUND_ROWS]

[MySQL][]:

    SELECT
      [ALL | DISTINCT | DISTINCTROW]
      [HIGH_PRIORITY]
      [STRAIGHT_JOIN]
      [SQL_SMALL_RESULT] [SQL_BIG_RESULT] [SQL_BUFFER_RESULT]
      [SQL_NO_CACHE] [SQL_CALC_FOUND_ROWS]

[N1QL][]:

    SELECT [hint_comment] [ALL | DISTINCT]

[PL/SQL][]:

    SELECT [hint] [ALL | DISTINCT | UNIQUE]

[PostgreSQL][]:

    SELECT [ALL | DISTINCT [ON ( expression [, ...] )]]

[Redshift][]:

    SELECT [TOP number | [ALL | DISTINCT]]

[Spark][]:

    SELECT [hints, ...] [ALL | DISTINCT]

[SQLite][]:

    SELECT [ALL | DISTINCT]

[Transact-SQL][]:

    SELECT
      [ALL | DISTINCT]
      [TOP ( expression ) [PERCENT] [WITH TIES]]

[Trino][]:

    SELECT [ALL | DISTINCT]

[sql standard]: https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#query-specification
[bigquery]: https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax
[db2]: https://www.ibm.com/docs/en/db2/9.7?topic=queries-subselect
[hive]: https://cwiki.apache.org/confluence/display/Hive/LanguageManual+Select
[mariadb]: https://mariadb.com/kb/en/select/
[mysql]: https://dev.mysql.com/doc/refman/8.0/en/select.html
[n1ql]: https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/select-syntax.html
[pl/sql]: https://docs.oracle.com/database/121/SQLRF/queries001.htm#SQLRF52327
[postgresql]: https://www.postgresql.org/docs/current/sql-select.html
[redshift]: https://docs.aws.amazon.com/redshift/latest/dg/r_SELECT_synopsis.html
[spark]: https://spark.apache.org/docs/latest/sql-ref-syntax-qry-select.html
[sqlite]: https://www.sqlite.org/lang_select.html
[transact-sql]: https://docs.microsoft.com/en-US/sql/t-sql/queries/select-transact-sql?view=sql-server-ver15
[trino]: https://trino.io/docs/current/sql/select.html
