# dialect

Specifies the SQL dialect to use.

## Usage

```ts
import { formatDialect, sqlite } from 'sql-formatter';

const result = formatDialect('SELECT * FROM tbl', { dialect: sqlite });
```

**Note:** This is part of new API, introduced in version 12.
It can only be used together with the new `formatDialect()` function,
not with the old `format()` function.
It also can't be used in config file of the command line tool -
for that, use the [language][] option.

## Options

The following dialects can be imported from `"sql-formatter"` module:

- `sql` - [Standard SQL][]
- `bigquery` - [GCP BigQuery][]
- `db2` - [IBM DB2][]
- `db2i` - [IBM DB2i][] (experimental)
- `hive` - [Apache Hive][]
- `mariadb` - [MariaDB][]
- `mysql` - [MySQL][]
- `tidb` - [TiDB][]
- `n1ql` - [Couchbase N1QL][]
- `plsql` - [Oracle PL/SQL][]
- `postgresql` - [PostgreSQL][]
- `redshift` - [Amazon Redshift][]
- `singlestoredb` - [SingleStoreDB][]
- `snowflake` - [Snowflake][]
- `spark` - [Spark][]
- `sqlite` - [SQLite][]
- `transactsql` - [SQL Server Transact-SQL][tsql]
- `trino` - [Trino][] / [Presto][]

The `sql` dialect is meant for cases where you don't know which dialect of SQL you're about to format.
It's not an auto-detection, it just supports a subset of features common enough in many SQL implementations.
This might or might not work for your specific dialect.
Better to always pick something more specific if possible.

## Custom dialect configuration (experimental)

The `dialect` parameter can also be used to specify a custom SQL dialect configuration:

```ts
import { formatDialect, DialectOptions } from 'sql-formatter';

const myDialect: DialectOptions {
  name: 'my_dialect',
  tokenizerOptions: {
    // See source code for examples of tokenizer config options
    // For example: src/languages/sqlite/sqlite.formatter.ts
  },
  formatOptions: {
    // ...
  },
};

const result = formatDialect('SELECT * FROM tbl', { dialect: myDialect });
```

**NB!** This functionality is experimental and there are no stability guarantees for this API.
The `DialectOptions` interface can (and likely will) change in non-major releases.
You likely only want to use this if your other alternative is to fork SQL Formatter.

[standard sql]: https://en.wikipedia.org/wiki/SQL:2011
[gcp bigquery]: https://cloud.google.com/bigquery
[ibm db2]: https://www.ibm.com/analytics/us/en/technology/db2/
[ibm db2i]: https://www.ibm.com/docs/en/i/7.5?topic=overview-db2-i
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
[language]: ./language.md
