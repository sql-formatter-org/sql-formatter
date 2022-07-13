# ORDER BY clause

[SQL standard][] defines the following syntax for ordering:

    ORDER BY {expr [ASC | DESC] [NULLS FIRST | NULLS LAST]} ["," ...]

This exact syntax is supported by:

- [BigQuery][]
- [N1QL][]
- [Redshift][]
- [Spark][]

Other dialects have some variations:

[DB2][]:

    ORDER BY INPUT SEQUENCE

    ORDER BY sort_specification [ {"," sort_specification}... ]

    sort_specification:
        ORDER OF table_name
      | expr [ASC | DESC] [NULLS FIRST | NULLS LAST]

[Hive][] provides ORDER BY, SORT BY, CLUSTER BY, DISTRIBUTE BY:

    ORDER BY {column [ASC | DESC] [NULLS FIRST | NULLS LAST]} ["," ...]

    SORT BY  {column [ASC | DESC] [NULLS FIRST | NULLS LAST]} ["," ...]

    CLUSTER BY column [ {"," column}... ]

    DISTRIBUTE BY column [ {"," column}... ]

[MariaDB][]:

    ORDER BY {expr [ASC | DESC]} ["," ...]

[MySQL][]:

    ORDER BY {expr [ASC | DESC]} ["," ...] [WITH ROLLUP]

[PL/SQL][]:

    ORDER [SIBLINGS] BY {expr [ASC | DESC] [NULLS FIRST | NULLS LAST]} ["," ...]

[PostgreSQL][]:

    ORDER BY {expr [ASC | DESC | USING operator] [NULLS FIRST | NULLS LAST]} ["," ...]

[SQLite][]:

    ORDER BY {expr [COLLATE collation] [ASC | DESC] [NULLS FIRST | NULLS LAST]} ["," ...]

[Transact-SQL][]:

    ORDER BY {expr [COLLATE collation] [ASC | DESC]} ["," ...]

[sql standard]: https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#order-by-clause
[bigquery]: https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax#order_by_clause
[db2]: https://www.ibm.com/docs/en/db2/9.7?topic=queries-subselect#r0000875__orderby
[hive]: https://cwiki.apache.org/confluence/display/Hive/LanguageManual+SortBy
[mariadb]: https://mariadb.com/kb/en/select/
[mysql]: https://dev.mysql.com/doc/refman/8.0/en/select.html
[n1ql]: https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/select-syntax.html#order-by-clause
[pl/sql]: https://docs.oracle.com/database/121/SQLRF/statements_10002.htm#i2168299
[postgresql]: https://www.postgresql.org/docs/current/sql-select.html
[redshift]: https://docs.aws.amazon.com/redshift/latest/dg/r_ORDER_BY_clause.html
[spark]: https://spark.apache.org/docs/latest/sql-ref-syntax-qry-select.html
[sqlite]: https://www.sqlite.org/lang_select.html
[transact-sql]: https://docs.microsoft.com/en-US/sql/t-sql/queries/select-order-by-clause-transact-sql?view=sql-server-ver15
