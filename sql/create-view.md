# CREATE VIEW statement

[SQL standard][] specifies the following CREATE VIEW syntax:

    CREATE [RECURSIVE] VIEW

Dialects have considerable variation:

[BigQuery][]:

    CREATE [OR REPLACE] VIEW [IF NOT EXISTS]

[DB2][]:

    CREATE [OR REPLACE] VIEW

[Hive][]:

    CREATE VIEW [IF NOT EXISTS]

[MariaDB][]:

    CREATE
      [OR REPLACE]
      [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]
      [DEFINER = { user | CURRENT_USER | role | CURRENT_ROLE }]
      [SQL SECURITY { DEFINER | INVOKER }]
      VIEW [IF NOT EXISTS]

[MySQL][]:

    CREATE
      [OR REPLACE]
      [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]
      [DEFINER = user]
      [SQL SECURITY { DEFINER | INVOKER }]
      VIEW

[N1QL][]:

_No support for CREATE VIEW._

[PL/SQL][]:

    CREATE [OR REPLACE] [[NO] FORCE] [EDITIONING | EDITIONABLE [EDITIONING] | NONEDITIONABLE] VIEW

[PostgreSQL][]:

    CREATE [OR REPLACE] [TEMP | TEMPORARY] [RECURSIVE] VIEW

[Redshift][]:

    CREATE [OR REPLACE] VIEW

[Spark][]:

    CREATE [OR REPLACE] [[GLOBAL] TEMPORARY] VIEW [IF NOT EXISTS]

[SQLite][]:

    CREATE [TEMPORARY | TEMP] VIEW [IF NOT EXISTS]

[Transact-SQL][]:

    CREATE [OR ALTER] VIEW

[sql standard]: https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#_11_22_view_definition
[bigquery]: https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language#create_view_statement
[db2]: https://www.ibm.com/docs/en/db2/9.7?topic=statements-create-view
[hive]: https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL#LanguageManualDDL-Create/Drop/AlterView
[mariadb]: https://mariadb.com/kb/en/create-view/
[mysql]: https://dev.mysql.com/doc/refman/8.0/en/create-view.html
[n1ql]: https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/createscope.html
[pl/sql]: https://docs.oracle.com/en/database/oracle/oracle-database/19/sqlrf/CREATE-VIEW.html
[postgresql]: https://www.postgresql.org/docs/current/sql-createview.html
[redshift]: https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_VIEW.html
[spark]: https://spark.apache.org/docs/latest/sql-ref-syntax-ddl-create-view.html
[sqlite]: https://www.sqlite.org/lang_createview.html
[transact-sql]: https://docs.microsoft.com/en-us/sql/t-sql/statements/create-view-transact-sql?view=sql-server-ver15
