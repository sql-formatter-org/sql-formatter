# language

Specifies the SQL dialect to use.

## Usage

```ts
import { format } from 'sql-formatter';

const result = format('SELECT * FROM tbl', { language: 'sqlite' });
```

## Options

- `"sql"` - (default) [Standard SQL][]
- `"bigquery"` - [GCP BigQuery][]
- `"clickhouse"` - [Clickhouse][]
- `"db2"` - [IBM DB2][]
- `"db2i"` - [IBM DB2i][] (experimental)
- `"duckdb"` - [DuckDB][]
- `"hive"` - [Apache Hive][]
- `"mariadb"` - [MariaDB][]
- `"mysql"` - [MySQL][]
- `"tidb"` - [TiDB][]
- `"n1ql"` - [Couchbase N1QL][]
- `"plsql"` - [Oracle PL/SQL][]
- `"postgresql"` - [PostgreSQL][]
- `"redshift"` - [Amazon Redshift][]
- `"singlestoredb"` - [SingleStoreDB][]
- `"snowflake"` - [Snowflake][]
- `"spark"` - [Spark][]
- `"sqlite"` - [SQLite][sqlite]
- `"transactsql"` or `"tsql"` - [SQL Server Transact-SQL][tsql]
- `"trino"` - [Trino][] (should also work for [Presto][], which is very similar dialect, though technically different)

The default `"sql"` dialect is meant for cases where you don't know which dialect of SQL you're about to format.
It's not an auto-detection, it just supports a subset of features common enough in many SQL implementations.
This might or might not work for your specific dialect.
Better to always pick something more specific if possible.

## Impact on bundle size

Using the `language` option has the downside that the used dialects are determined at runtime
and therefore they all have to be bundled when e.g. building a bundle with Webpack.
This can result in significant overhead when you only need to format one or two dialects.

To solve this problem, version 12 of SQL Formatter introduces a new API,
that allows explicitly importing the dialects.
See docs for [dialect][] option.

[standard sql]: https://en.wikipedia.org/wiki/SQL:2011
[gcp bigquery]: https://cloud.google.com/bigquery
[clickhouse]: https://clickhouse.com/
[ibm db2]: https://www.ibm.com/analytics/us/en/technology/db2/
[ibm db2i]: https://www.ibm.com/docs/en/i/7.5?topic=overview-db2-i
[duckdb]: https://duckdb.org/
[apache hive]: https://hive.apache.org/
[mariadb]: https://mariadb.com/
[mysql]: https://www.mysql.com/
[tidb]: https://github.com/pingcap/tidb/
[couchbase n1ql]: http://www.couchbase.com/n1ql
[oracle pl/sql]: http://www.oracle.com/technetwork/database/features/plsql/index.html
[postgresql]: https://www.postgresql.org/
[presto]: https://prestodb.io/docs/current/
[amazon redshift]: https://docs.aws.amazon.com/redshift/latest/dg/cm_chap_SQLCommandRef.html
[singlestoredb]: https://docs.singlestore.com/managed-service/en/reference.html
[snowflake]: https://docs.snowflake.com/en/index.html
[spark]: https://spark.apache.org/docs/latest/api/sql/index.html
[sqlite]: https://sqlite.org/index.html
[trino]: https://trino.io/docs/current/
[tsql]: https://docs.microsoft.com/en-us/sql/sql-server/
[dialect]: ./dialect.md
