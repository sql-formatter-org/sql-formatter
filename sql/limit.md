# LIMIT and OFFSET clauses

[SQL standard][] does not define a LIMIT or OFFSET clause.

Every dialect however supports either `LIMIT OFFSET` or `OFFSET FETCH` syntax.

[BigQuery][]:

    LIMIT count [OFFSET offset]

[DB2][]:

    FETCH FIRST count {ROW | ROWS} ONLY

[Hive][]:

    LIMIT [offset ","] count

[MariaDB][] support three forms:

    LIMIT [offset ","] count

    LIMIT count OFFSET offset [ROWS EXAMINED rows_limit]

    [OFFSET offset { ROW | ROWS }]
    [FETCH { FIRST | NEXT } [count] { ROW | ROWS } { ONLY | WITH TIES }]

[MySQL][] supports two forms:

    LIMIT [offset ","] count

    LIMIT count OFFSET offset

[N1QL][]:

    [LIMIT count]
    [OFFSET offset]

[PL/SQL][]:

    [OFFSET offset {ROW | ROWS}]
    [FETCH { FIRST | NEXT } [count | percent PERCENT] { ROW | ROWS } { ONLY | WITH TIES }]

[PostgreSQL][] supports two forms:

    [LIMIT {count | ALL}]
    [OFFSET offset]

    [OFFSET offset {ROW | ROWS}]
    [FETCH { FIRST | NEXT } [ count ] { ROW | ROWS } { ONLY | WITH TIES }]

[Redshift][]:

    [LIMIT {count | ALL}]
    [OFFSET offset]

[Spark][]:

    LIMIT {count | ALL}

[SQLite][] supports two forms:

    LIMIT [offset ","] count

    LIMIT count OFFSET offset

[Transact-SQL][]:

In older versions the only way is to use `TOP` syntax:

    SELECT TOP count * FROM table

Starting with [SQL Server 2012][], one can use the `OFFSET FETCH` syntax:

    OFFSET offset {ROW | ROWS}
    [FETCH {FIRST | NEXT} count {ROW | ROWS} ONLY]

[sql standard]: https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#query-specification
[bigquery]: https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax#limit_and_offset_clause
[db2]: https://www.ibm.com/docs/en/db2/9.7?topic=queries-subselect#r0000875__fet1st
[hive]: https://cwiki.apache.org/confluence/display/Hive/LanguageManual+Select#LanguageManualSelect-LIMITClause
[mariadb]: https://mariadb.com/kb/en/select/
[mysql]: https://dev.mysql.com/doc/refman/8.0/en/select.html
[n1ql]: https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/select-syntax.html#limit-clause
[pl/sql]: https://docs.oracle.com/database/121/SQLRF/statements_10002.htm#BABBADDD
[postgresql]: https://www.postgresql.org/docs/current/sql-select.html
[redshift]: https://docs.aws.amazon.com/redshift/latest/dg/r_SELECT_synopsis.html
[spark]: https://spark.apache.org/docs/latest/sql-ref-syntax-qry-select.html
[sqlite]: https://www.sqlite.org/lang_select.html
[transact-sql]: https://stackoverflow.com/questions/603724/how-to-implement-limit-with-sql-server
[sql server 2012]: https://docs.microsoft.com/en-us/previous-versions/sql/sql-server-2012/ms188385(v=sql.110)?redirectedfrom=MSDN
