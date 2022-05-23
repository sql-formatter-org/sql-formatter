# Parameters

Parameter placeholder markers used in prepared statements.

## Positional parameters

- [BigQuery][]: `?`
- [DB2][]: `?`
- Hive: —
- [MariaDB][]: `?`
- [MySQL][]: `?`
- [N1QL][]: `?`
- PL/SQL: —
- PostgreSQL: —
- Redshift: —
- Spark: —
- [SQLite][]: `?`
- [Transact-SQL][]: `?`

## Numbered parameters

- [MariaDB][]: `:1`, `:2`, ...<sup>1</sup>
- [N1QL][]: `$1`, `$2`, ...
- [PL/SQL][]: `:1`, `:2`, ...
- [PostgreSQL][]: `$1`, `$2`, ...
- [Redshift][]: `$1`, `$2`, ...
- [SQLite][]: `?1`, `?2`, ...

1. When SQL_MODE=ORACLE enabled.

## Named parameters

- [BigQuery][]: `@` followed by [identifier][] (either quoted or unquoted)
- [DB2][]: colon (`:`) followed by name (the name can include letters, numbers, and the symbols `@`, `#`, `$`, and `_`)
- Hive: —
- MariaDB: —
- MySQL: —
- [N1QL][]: `$` followed by unquoted [identifier][]
- [PL/SQL][]: colon (`:`) followed by name (`[a-zA-Z][a-zA-Z0-9_]*`)
- PostgreSQL: —
- Redshift: —
- Spark: —
- [SQLite][]: `$`, `@` or `:` followed by unquoted [identifier][]
- [Transact-SQL][]: `@` or `:` followed by name (see also [identifier][] syntax)

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
