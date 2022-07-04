# DELETE statement

[SQL standard][] specifies the following DELETE syntax:

    DELETE FROM { table_name | ONLY "(" table_name ")" } [[AS] alias]
      [WHERE condition | WHERE CURRENT OF cursor_name]

This base syntax is pretty well supported (except in Spark):

[BigQuery][]:

    DELETE [FROM] table_name [alias]
      WHERE condition

[DB2][]:

    DELETE FROM { table_name | ONLY "(" table_name ")" | "(" fullselect ")" }
      [[AS] correlation_clause]
      [INCLUDE include_columns]
      [assignment_clause]
      [WHERE condition | WHERE CURRENT OF cursor_name]
      [WITH {RR | RS | CS | UR}]

[Hive][]:

    DELETE FROM table_name
      [WHERE condition]

[MariaDB][]:

    DELETE [LOW_PRIORITY] [QUICK] [IGNORE] FROM table_name
      [PARTITION "(" partition_list ")"]
      [FOR PORTION OF period FROM expr1 TO expr2]
      [FROM from_clause]
      [USING using_clause]
      [WHERE condition]
      [ORDER BY ...]
      [LIMIT row_count]
      [RETURNING returning_clause]

[MySQL][]:

    DELETE [LOW_PRIORITY] [QUICK] [IGNORE] FROM table_name [[AS] alias]
      [PARTITION "(" partition_list ")"]
      [WHERE condition]
      [ORDER BY ...]
      [LIMIT row_count]

[N1QL][]:

    DELETE FROM table_name
      [USE [PRIMARY] KEYS expr]
      [WHERE condition]
      [LIMIT expr]
      [RETURNING returning_clause]

[PL/SQL][]:

    DELETE [hint] FROM { table_name | ONLY "(" table_name ")" } [alias]
      [WHERE condition]
      [[RETURN | RETURNING] returning_clause]
      [LOG ERRORS error_logging_clause]

[PostgreSQL][]:

    [WITH [RECURSIVE] with_clause]
    DELETE FROM [ONLY] table_name [ * ] [[AS] alias]
      [USING from_items]
      [WHERE condition | WHERE CURRENT OF cursor_name]
      [RETURNING returning_clause]

[Redshift][]:

    [WITH [RECURSIVE] with_clause]
    DELETE [FROM] table_name
      [USING from_items]
      [WHERE condition]

[Spark][]:

_No support for DELETE_

[SQLite][]:

    [WITH [RECURSIVE] with_clause]
    DELETE FROM table_name
      [FROM from_clause]
      [WHERE condition]
      [RETURNING returning_clause]

[Transact-SQL][]:

    [WITH with_clause]
    DELETE [TOP ( expression ) [PERCENT]] FROM table_name
      [FROM from_clause]
      [WHERE condition | WHERE CURRENT OF [GLOBAL] cursor_name]
      [OPTION query_hints]

[sql standard]: https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#_14_8_delete_statement_searched
[bigquery]: https://cloud.google.com/bigquery/docs/reference/standard-sql/dml-syntax#delete_statement
[db2]: https://www.ibm.com/docs/en/db2/9.7?topic=statements-delete
[hive]: https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DML#LanguageManualDML-Delete
[mariadb]: https://mariadb.com/kb/en/delete/
[mysql]: https://dev.mysql.com/doc/refman/8.0/en/delete.html
[n1ql]: https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/delete.html
[pl/sql]: https://docs.oracle.com/en/database/oracle/oracle-database/19/sqlrf/DELETE.html
[postgresql]: https://www.postgresql.org/docs/current/sql-delete.html
[redshift]: https://docs.aws.amazon.com/redshift/latest/dg/r_DELETE.html
[spark]: https://spark.apache.org/docs/latest/sql-ref-syntax.html#dml-statements
[sqlite]: https://www.sqlite.org/lang_delete.html
[transact-sql]: https://docs.microsoft.com/en-us/sql/t-sql/statements/delete-transact-sql?view=sql-server-ver16
