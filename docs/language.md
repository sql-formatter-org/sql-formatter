# language

Specifies the SQL dialect to use.

## Options

- `"sql"` - (default) [Standard SQL][]
- `"bigquery"` - [GCP BigQuery][]
- `"db2"` - [IBM DB2][]
- `"hive"` - [Apache Hive][]
- `"mariadb"` - [MariaDB][]
- `"mysql"` - [MySQL][]
- `"n1ql"` - [Couchbase N1QL][]
- `"plsql"` - [Oracle PL/SQL][]
- `"postgresql"` - [PostgreSQL][]
- `"redshift"` - [Amazon Redshift][]
- `"spark"` - [Spark][]
- `"tsql"` - [SQL Server Transact-SQL][tsql]

The default `"sql"` dialect is meant for cases where you don't know which dialect of SQL you're about to format.
It's not an auto-detection, it just supports a subset of features common enough in many SQL implementations.
This might or might not work for your specific dialect.
Better to always pick something more specific if possible.

[standard sql]: https://en.wikipedia.org/wiki/SQL:2011
[gcp bigquery]: https://cloud.google.com/bigquery
[ibm db2]: https://www.ibm.com/analytics/us/en/technology/db2/
[apache hive]: https://hive.apache.org/
[mariadb]: https://mariadb.com/
[mysql]: https://www.mysql.com/
[couchbase n1ql]: http://www.couchbase.com/n1ql
[oracle pl/sql]: http://www.oracle.com/technetwork/database/features/plsql/index.html
[postgresql]: https://www.postgresql.org/
[amazon redshift]: https://docs.aws.amazon.com/redshift/latest/dg/cm_chap_SQLCommandRef.html
[spark]: https://spark.apache.org/docs/latest/api/sql/index.html
[tsql]: https://docs.microsoft.com/en-us/sql/sql-server/
