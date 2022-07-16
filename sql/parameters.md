# Parameters

Parameter placeholder markers used in prepared statements.

**Note:** Apache Hive and Spark don't support prepared statements.

## Positional parameters

These come in the form of single question mark (`?`), supported by:

- [BigQuery][]
- [DB2][]
- [MariaDB][]
- [MySQL][]
- [N1QL][]
- [SQLite][]
- [Transact-SQL][]<sup>1</sup>
- [Trino][]

## Numbered parameters

- [MariaDB][]: `:1`, `:2`, ...<sup>2</sup>
- [N1QL][]: `$1`, `$2`, ...
- [PL/SQL][]: `:1`, `:2`, ...
- [PostgreSQL][]: `$1`, `$2`, ...
- [Redshift][]: `$1`, `$2`, ...
- [SQLite][]: `?1`, `?2`, ...

## Named parameters

- [BigQuery][]: `@` followed by [identifier][] (either quoted or unquoted)
- [DB2][]: colon (`:`) followed by name (the name can include letters, numbers, and the symbols `@`, `#`, `$`, and `_`)
- [N1QL][]: `$` followed by unquoted [identifier][]
- [PL/SQL][]: colon (`:`) followed by name (`[a-zA-Z][a-zA-Z0-9_]*`)
- [SQLite][]: `$`, `@` or `:` followed by unquoted [identifier][]
- [Transact-SQL][]: `@` or `:`<sup>3</sup> followed by [identifier][] (either quoted or unquoted)

### Notes:

1. When using ODBC or OLE DB driver
2. When SQL_MODE=ORACLE enabled.
3. When using Oracle driver.

[identifier]: ./identifiers.md
[bigquery]: https://cloud.google.com/bigquery/docs/reference/standard-sql/lexical#query_parameters
[db2]: https://www.ibm.com/docs/en/db2/9.7?topic=statements-prepare#r0000975__l975
[mariadb]: https://mariadb.com/kb/en/prepare-statement/
[mysql]: https://dev.mysql.com/doc/refman/8.0/en/prepare.html
[n1ql]: https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/prepare.html#parameters
[pl/sql]: https://docs.oracle.com/en/database/oracle/oracle-database/21/lnoci/using-sql_statements-in-oci.html#GUID-8D6FD01B-5B8A-49A2-BFD8-71B404529F07
[postgresql]: https://www.postgresql.org/docs/14/sql-prepare.html
[redshift]: https://docs.aws.amazon.com/redshift/latest/dg/r_PREPARE.html
[sqlite]: https://sqlite.org/c3ref/bind_blob.html
[transact-sql]: https://docs.microsoft.com/en-us/dotnet/framework/data/adonet/configuring-parameters-and-parameter-data-types
[trino]: https://trino.io/docs/current/sql/prepare.html
