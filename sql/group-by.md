# GROUP BY clause

[SQL standard][] defines the following syntax for GROUP BY clause:

    GROUP BY [ALL | DISTINCT] expr ["," ...]

There's a considerable variation is dialects:

[BigQuery][]:

    GROUP BY { expr ["," ...] | ROLLUP { expr ["," ...] } }

[DB2][]:

    GROUP BY { expr | GROUPING SETS grouping_sets | super_groups } ["," ...]

    grouping_sets:
      "(" { expr | super_groups | grouping_sets } ["," ...] ")"

    super_groups:
      [ROLLUP | CUBE] "(" expr ["," ...] ")"

[Hive][]:

    GROUP BY expr ["," ...] [GROUPING SETS "(" expr ["," ...] ")"] [WITH ROLLUP | WITH CUBE]

[MariaDB][]:

    GROUP BY expr [ASC | DESC] ["," ...] [WITH ROLLUP]

[MySQL][]:

    GROUP BY expr ["," ...] [WITH ROLLUP]

[N1QL][] additionally supports LETTING clause (which can follow or replace GROUP BY):

    GROUP BY expr ["," ...]

    LETTING alias "=" expr ["," ...]

[PL/SQL][]:

    GROUP BY {expr | rollup_cube | grouping | "()"} ["," ...]

    rollup_cube:
      [ROLLUP | CUBE] "(" expr ["," ...] ")"

    grouping_sets:
      GROUPING SETS "(" {rollup_cube | expr} ["," ...] ")"

[PostgreSQL][]:

    GROUP BY [ ALL | DISTINCT ] expr ["," ...]

[Redshift][]:

    GROUP BY expr ["," ...]

[Spark][]:

    GROUP BY expr ["," ...] [WITH ROLLUP | WITH CUBE]

    GROUP BY {expr | {ROLLUP | CUBE | GROUPING SETS} "(" expr ["," ...] ")"} ["," ...]

[SQLite][]:

    GROUP BY expr ["," ...]

[Transact-SQL][]:

    GROUP BY {expr | {ROLLUP group_expr | CUBE group_expr | GROUPING SETS grouping_set | "()" } ["," ...]

    GROUP BY [ALL] expr ["," ...] [WITH CUBE | WITH ROLLUP]

    GROUP BY expr [WITH "(" DISTRIBUTED_AGG ")"] ["," ...]

    group_expr:
        expr
      | "(" expr ["," ...] ")"

    grouping_set:
        group_expr
      | ROLLUP "(" group_expr ["," ...] ")"
      | CUBE "(" group_expr ["," ...] ")"

[Trino][]:

    GROUP BY [ALL | DISTINCT] {grp_set | rollup_cube | grouping_sets} ["," ...]

    rollup_cube:
      [ROLLUP | CUBE] "(" expr ["," ...] ")"

    grouping_sets:
      GROUPING SETS "(" grp_set ["," ...] ")"

    grp_set:
        expr
      | "(" expr ["," ...] ")"

[sql standard]: https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#query-specification
[bigquery]: https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax#group_by_clause
[db2]: https://www.ibm.com/docs/en/db2/9.7?topic=queries-subselect#r0000875__grpby
[hive]: https://cwiki.apache.org/confluence/display/Hive/Enhanced+Aggregation%2C+Cube%2C+Grouping+and+Rollup
[mariadb]: https://mariadb.com/kb/en/select/
[mysql]: https://dev.mysql.com/doc/refman/8.0/en/select.html
[n1ql]: https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/select-syntax.html#group-by-clause
[pl/sql]: https://docs.oracle.com/database/121/SQLRF/statements_10002.htm#i2065777
[postgresql]: https://www.postgresql.org/docs/current/sql-select.html
[redshift]: https://docs.aws.amazon.com/redshift/latest/dg/r_SELECT_synopsis.html
[spark]: https://spark.apache.org/docs/latest/sql-ref-syntax-qry-select.html
[sqlite]: https://www.sqlite.org/lang_select.html
[transact-sql]: https://docs.microsoft.com/en-US/sql/t-sql/queries/select-group-by-transact-sql?view=sql-server-ver15
[trino]: https://github.com/trinodb/trino/blob/c7b26825218d5d11e9469984977dee6856f362ff/core/trino-parser/src/main/antlr4/io/trino/sql/parser/SqlBase.g4#L257
