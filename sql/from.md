# FROM clause

Here's a simplified syntax of FROM clause from [SQL standard][]:

    FROM table_reference ["," ...]

    table_reference:
      table_factor | joined_table

    joined_table:
        table_reference CROSS JOIN table_reference [join_specification]
      | table_reference [join_type] JOIN table_reference [join_specification]
      | table_reference NATURAL [join_type] JOIN table_reference

    join_type:
        INNER
      | {LEFT | RIGHT | FULL} [OUTER]

    join_specification:
        ON expr
      | USING "(" identifier ["," ...] ")"

Dialects mainly differ in what sort of joins they support:

[BigQuery][]:

Does not support `NATURAL JOIN`.

[DB2][]:

Does not support `NATURAL JOIN` and `USING` specification.

[Hive][]:

Does not support `NATURAL JOIN` and `USING` specification.

Additionally supports `LEFT SEMI JOIN`.

[MariaDB][]:

Does not support `FULL` keyword in joins (like `FULL OUTER JOIN` or `NATURAL FULL JOIN`).

Does not support `NATURAL INNER JOIN`.

Additionally supports `STRAIGHT_JOIN`.

[MySQL][]:

Does not support `FULL` keyword in joins (like `FULL OUTER JOIN` or `NATURAL FULL JOIN`).

Additionally supports `STRAIGHT_JOIN`.

[N1QL][]:

Does not support `FULL` keyword in joins.

Does not support `NATURAL JOIN` and `CROSS JOIN`.

Does not support `USING` specification, instead supports:

    join_specification:
        ON expr
      | ON [PRIMARY] KEY expr [FOR identifier]

[PL/SQL][]:

Support the full standard plus apply-joins:

- `CROSS APPLY`
- `OUTER APPLY`

[PostgreSQL][]:

Supports the full standard.

[Redshift][]:

Supports the full standard.

[Spark][]:

Supports the full standard plus:

- `[LEFT] SEMI JOIN`
- `[LEFT] ANTI JOIN`

[SQLite][]:

Supports the full standard.

[Transact-SQL][]:

Does not support `NATURAL JOIN`.

Additionally supports apply-joins:

- `CROSS APPLY`
- `OUTER APPLY`

[sql standard]: https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#_7_5_from_clause
[bigquery]: https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax#join_types
[db2]: https://www.ibm.com/docs/en/db2-for-zos/12?topic=clause-joined-table
[hive]: https://cwiki.apache.org/confluence/display/Hive/LanguageManual+Joins
[mariadb]: https://mariadb.com/kb/en/join-syntax/
[mysql]: https://dev.mysql.com/doc/refman/8.0/en/join.html
[n1ql]: https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/join.html
[pl/sql]: https://docs.oracle.com/database/121/SQLRF/statements_10002.htm#CHDIJFDJ
[postgresql]: https://www.postgresql.org/docs/current/sql-select.html
[redshift]: https://docs.aws.amazon.com/redshift/latest/dg/r_FROM_clause30.html
[spark]: https://spark.apache.org/docs/latest/sql-ref-syntax-qry-select-join.html
[sqlite]: https://www.sqlite.org/syntax/join-clause.html
[transact-sql]: https://docs.microsoft.com/en-us/sql/t-sql/queries/from-transact-sql?view=sql-server-ver16
