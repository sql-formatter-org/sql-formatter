# UPDATE statement

[SQL standard][] specifies the following UPDATE syntax:

    UPDATE { table_name | ONLY "(" table_name ")" } [[AS] alias]
      SET set_clause_list
      [WHERE condition | WHERE CURRENT OF cursor_name]

This base syntax is pretty well supported (except in Spark):

[BigQuery][]:

    UPDATE table_name [[AS] alias]
      SET set_clause_list
      [FROM from_clause]
      WHERE condition

[DB2][]:

    UPDATE { table_name | ONLY "(" table_name ")" | "(" fullselect ")" }
      [correlation_clause] [include_columns]
      SET set_clause_list
      [WHERE condition | WHERE CURRENT OF cursor_name]
      [WITH {RR | RS | CS | UR}]

[Hive][]:

    UPDATE table_name
      SET set_clause_list
      [WHERE condition]

[MariaDB][]:

    UPDATE [LOW_PRIORITY] [IGNORE] table_name
      [PARTITION "(" partition_list ")"]
      [FOR PORTION OF period FROM expr1 TO expr2]
      SET set_clause_list
      [WHERE condition]
      [ORDER BY ...]
      [LIMIT row_count]

[MySQL][]:

    UPDATE [LOW_PRIORITY] [IGNORE] table_name
      SET set_clause_list
      [WHERE condition]
      [ORDER BY ...]
      [LIMIT row_count]

[N1QL][]:

    UPDATE table_name
      [USE [PRIMARY] KEYS expr]
      [SET set_clause_list]
      [UNSET unset_clause_list]
      [WHERE condition]
      [LIMIT expr]
      [RETURNING returning_clause]

[PL/SQL][]:

    UPDATE [hint] { table_name | ONLY "(" table_name ")" } [alias]
      SET set_clause_list
      [WHERE condition]
      [[RETURN | RETURNING] returning_clause]
      [LOG ERRORS error_logging_clause]

[PostgreSQL][]:

    [WITH [RECURSIVE] with_clause]
    UPDATE [ONLY] table_name [ * ] [[AS] alias]
      SET set_clause_list
      [FROM from_clause]
      [WHERE condition | WHERE CURRENT OF cursor_name]
      [RETURNING returning_clause]

[Redshift][]:

    [WITH [RECURSIVE] with_clause]
    UPDATE table_name [[AS] alias]
      SET set_clause_list
      [FROM from_clause]
      [WHERE condition]

[Spark][]:

_No support for UPDATE_

[SQLite][]:

    [WITH [RECURSIVE] with_clause]
    UPDATE [OR action] table_name
      SET set_clause_list
      [FROM from_clause]
      [WHERE condition]
      [RETURNING returning_clause]

    action:
      ABORT | FAIL | IGNORE | REPLACE | ROLLBACK

[Transact-SQL][]:

    [WITH with_clause]
    UPDATE [TOP ( expression ) [PERCENT]] table_name
      SET set_clause_list
      [FROM from_clause]
      [WHERE condition | WHERE CURRENT OF [GLOBAL] cursor_name]
      [OPTION query_hints]

[sql standard]: https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#_14_13_update_statement_searched
[bigquery]: https://cloud.google.com/bigquery/docs/reference/standard-sql/dml-syntax#update_statement
[db2]: https://www.ibm.com/docs/en/db2/9.7?topic=statements-update
[hive]: https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DML#LanguageManualDML-Update
[mariadb]: https://mariadb.com/kb/en/update/
[mysql]: https://dev.mysql.com/doc/refman/8.0/en/update.html
[n1ql]: https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/update.html
[pl/sql]: https://docs.oracle.com/en/database/oracle/oracle-database/19/sqlrf/UPDATE.html
[postgresql]: https://www.postgresql.org/docs/current/sql-update.html
[redshift]: https://docs.aws.amazon.com/redshift/latest/dg/r_UPDATE.html
[spark]: https://spark.apache.org/docs/latest/sql-ref-syntax.html#dml-statements
[sqlite]: https://www.sqlite.org/lang_update.html
[transact-sql]: https://docs.microsoft.com/en-us/sql/t-sql/queries/update-transact-sql?view=sql-server-ver16
