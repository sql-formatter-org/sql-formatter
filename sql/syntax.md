# SQL syntax

Reference of SQL syntax variations.

## Identifiers

SQL standard specifies double-quotes `".."` for delimited identifiers.
There is a considerable variation in implementations:

- `` `..` `` [BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/lexical)
- `".."` [DB2](https://www.ibm.com/docs/en/db2/9.7?topic=elements-identifiers)
- `` `..` `` [Hive](https://cwiki.apache.org/confluence/pages/viewpage.action?pageId=27362034#LanguageManualDDL-AlterColumn)
- `` `..` ``, `".."`<sup>1</sup>, `[..]`<sup>2</sup> [MariaDB](https://mariadb.com/kb/en/identifier-names/)
- `` `..` ``, `".."`<sup>1</sup> [MySQL](https://dev.mysql.com/doc/refman/8.0/en/identifiers.html)
- `` `..` `` [N1QL](https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/identifiers.html)
- `".."` [PL/SQL](https://docs.oracle.com/database/121/LNPLS/fundamentals.htm#LNPLS99973)
- `".."`, `U&".."` [PostgreSQL](https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS)
- `".."` [Redshift](https://docs.aws.amazon.com/redshift/latest/dg/r_names.html)
- `` `..` `` [Spark](https://spark.apache.org/docs/latest/sql-ref-identifier.html)
- `".."`, `` `..` ``, `[..]` [SQLite](https://www.sqlite.org/lang_keywords.html)
- `".."`, `[..]` [Transact-SQL](https://docs.microsoft.com/en-us/sql/relational-databases/databases/database-identifiers?view=sql-server-ver15)

Notes:

1. when ANSI_QUOTES mode enabled
2. when MSSQL mode enabled
