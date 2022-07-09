# WITH clause

[SQL standard][] defines the following syntax for WITH clause:

    WITH [RECURSIVE] common_table_expression ["," ...]

    common_table_expression:
      identifier ["(" column_name_list ")"] AS "(" query_expression ")"
        [search_clause]
        [cycle_clause]

    search_clause:
      SEARCH {DEPTH | BREATH} FIRST BY column_name_list SET identifier

    cycle_clause:
      CYCLE column_name_list
        SET identifier TO expr
        DEFAULT expr USING identifier

    column_name_list:
      identifier ["," ...]

No dialect fully supports the standard:

[BigQuery][]:

    WITH [RECURSIVE] common_table_expression ["," ...]

    common_table_expression:
      identifier AS "(" query_expression ")"

[DB2][]:

    WITH common_table_expression ["," ...]

    common_table_expression:
      identifier ["(" column_name_list ")"] AS "(" query_expression ")"

[Hive][]:

    WITH common_table_expression ["," ...]

    common_table_expression:
      identifier AS "(" query_expression ")"

[MariaDB][] supports just a single `common_table_expression`:

    WITH [RECURSIVE] common_table_expression

    common_table_expression:
      identifier ["(" column_name_list ")"] AS "(" query_expression ")"
      [CYCLE column_name_list RESTRICT]

[MySQL][]:

    WITH [RECURSIVE] common_table_expression ["," ...]

    common_table_expression:
      identifier ["(" column_name_list ")"] AS "(" query_expression ")"

[N1QL][]:

    WITH common_table_expression ["," ...]

    common_table_expression:
      identifier AS "(" query_expression ")"

[PL/SQL][]:

    WITH [plsql_declarations] [common_table_expression ["," ...]]

    plsql_declarations:
      function_declaration | procedure_declaration

    common_table_expression:
      identifier ["(" column_name_list ")"] AS "(" query_expression ")"
      [search_clause]
      [cycle_clause]

    search_clause:
      SEARCH {DEPTH | BREATH} FIRST BY {column_alias ["," ...]} SET identifier

    column_alias:
      identifier [ASC | DESC] [NULLS FIRST | NULLS LAST]

    cycle_clause:
      CYCLE column_name_list
        SET identifier TO expr
        DEFAULT expr

[PostgreSQL][]:

    WITH [RECURSIVE] common_table_expression ["," ...]

    common_table_expression:
      identifier ["(" column_name_list ")"] AS [[NOT] MATERIALIZED] "(" query_expression ")"
        [search_clause]
        [cycle_clause]

    search_clause:
      SEARCH {DEPTH | BREATH} FIRST BY column_name_list SET identifier

    cycle_clause:
      CYCLE column_name_list SET identifier USING identifier

[Redshift][]:

    WITH [RECURSIVE] common_table_expression ["," ...]

    common_table_expression:
      identifier ["(" column_name_list ")"] AS "(" query_expression ")"

[Spark][]:

    WITH common_table_expression ["," ...]

    common_table_expression:
      identifier ["(" column_name_list ")"] AS "(" query_expression ")"

[SQLite][]:

    WITH [RECURSIVE] common_table_expression ["," ...]

    common_table_expression:
      identifier ["(" column_name_list ")"] AS [[NOT] MATERIALIZED] "(" query_expression ")"

[Transact-SQL][]:

    WITH common_table_expression ["," ...]

    common_table_expression:
      identifier ["(" column_name_list ")"] AS "(" query_expression ")"

[sql standard]: https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#with-clause
[bigquery]: https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax#with_clause
[db2]: https://www.ibm.com/docs/en/db2-for-zos/12?topic=queries-select-statement
[hive]: https://cwiki.apache.org/confluence/display/Hive/Common+Table+Expression
[mariadb]: https://mariadb.com/kb/en/with/
[mysql]: https://dev.mysql.com/doc/refman/8.0/en/with.html
[n1ql]: https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/with.html
[pl/sql]: https://docs.oracle.com/database/121/SQLRF/statements_10002.htm#BABFAFID
[postgresql]: https://www.postgresql.org/docs/current/queries-with.html
[redshift]: https://docs.aws.amazon.com/redshift/latest/dg/r_WITH_clause.html
[spark]: https://spark.apache.org/docs/latest/sql-ref-syntax-qry-select-cte.html
[sqlite]: https://www.sqlite.org/syntax/common-table-expression.html
[transact-sql]: https://docs.microsoft.com/en-us/sql/t-sql/queries/with-common-table-expression-transact-sql?view=sql-server-ver16
