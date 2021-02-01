# SQL Formatter [![NPM version](https://img.shields.io/npm/v/sql-formatter.svg)](https://npmjs.com/package/sql-formatter) [![Build Status](https://travis-ci.org/zeroturnaround/sql-formatter.svg?branch=master)](https://travis-ci.org/zeroturnaround/sql-formatter) [![Coverage Status](https://coveralls.io/repos/github/zeroturnaround/sql-formatter/badge.svg?branch=master)](https://coveralls.io/github/zeroturnaround/sql-formatter?branch=master)

**SQL Formatter** is a JavaScript library for pretty-printing SQL queries.
It started as a port of a [PHP Library][], but has since considerably diverged.

SQL formatter supports the following dialects:

- **sql** - [Standard SQL][]
- **mariadb** - [MariaDB][]
- **mysql** - [MySQL][]
- **postgresql** - [PostgreSQL][]
- **db2** - [IBM DB2][]
- **plsql** - [Oracle PL/SQL][]
- **n1ql** - [Couchbase N1QL][]
- **redshift** - [Amazon Redshift][]
- **spark** - [Spark][]
- **tsql** - [SQL Server Transact-SQL][tsql]

It does not support:

- Stored procedures.
- Changing of the delimiter type to something else than `;`.

&rarr; [Try the demo.](https://zeroturnaround.github.io/sql-formatter/)

## Install

Get the latest version from NPM:

```sh
npm install sql-formatter
```

## Usage as library

```js
import { format } from 'sql-formatter';

console.log(format('SELECT * FROM tbl'));
```

This will output:

```sql
SELECT
  *
FROM
  tbl
```

You can also pass in configuration options:

```js
format('SELECT * FROM tbl', {
  language: 'spark', // Defaults to "sql" (see the above list of supported dialects)
  indent: '    ', // Defaults to two spaces
  uppercase: bool, // Defaults to false
  linesBetweenQueries: 2, // Defaults to 1
});
```

### Placeholders replacement

```js
// Named placeholders
format("SELECT * FROM tbl WHERE foo = @foo", {
  params: {foo: "'bar'"}
}));

// Indexed placeholders
format("SELECT * FROM tbl WHERE foo = ?", {
  params: ["'bar'"]
}));
```

Both result in:

```
SELECT
  *
FROM
  tbl
WHERE
  foo = 'bar'
```

## Usage from command line

The CLI tool will be installed under `sql-formatter`
and may be invoked via `npx sql-formatter`:

```sh
sql-formatter -h
```

```
usage: sql-formatter [-h] [-o OUTPUT] [-l {db2,mariadb,mysql,n1ql,plsql,postgresql,redshift,spark,sql,tsql}]
                     [-i N | -t] [-u] [--lines-between-queries N] [--version] [FILE]

SQL Formatter

positional arguments:
  FILE                  Input SQL file (defaults to stdin)

optional arguments:
  -h, --help            show this help message and exit
  -o OUTPUT, --output OUTPUT
                        File to write SQL output (defaults to stdout)
  -l {db2,mariadb,mysql,n1ql,plsql,postgresql,redshift,spark,sql,tsql},
  --language {db2,mariadb,mysql,n1ql,plsql,postgresql,redshift,spark,sql,tsql}
                        SQL Formatter dialect (defaults to basic sql)
  -i N, --indent N      Number of spaces to indent query blocks (defaults to 2)
  -t, --tab-indent      Indent query blocks with tabs instead of spaces
  -u, --uppercase       Capitalize language keywords
  --lines-between-queries N
                        How many newlines to insert between queries (separated by ";")
  --version             show program's version number and exit
```

By default, the tool takes queries from stdin and processes them to stdout but
one can also name an input file name or use the `--output` option.

```sh
echo 'select * from tbl where id = 3' | sql-formatter -u
```

```sql
SELECT
  *
FROM
  tbl
WHERE
  id = 3
```

## Usage without NPM

If you don't use a module bundler, clone the repository, run `npm install` and grab a file from `/dist` directory to use inside a `<script>` tag.
This makes SQL Formatter available as a global variable `window.sqlFormatter`.

## Contributing

Make sure to run all checks:

```sh
npm run check
```

...and you're ready to poke us with a pull request.

## License

[MIT](https://github.com/zeroturnaround/sql-formatter/blob/master/LICENSE)

[php library]: https://github.com/jdorn/sql-formatter
[standard sql]: https://en.wikipedia.org/wiki/SQL:2011
[couchbase n1ql]: http://www.couchbase.com/n1ql
[ibm db2]: https://www.ibm.com/analytics/us/en/technology/db2/
[oracle pl/sql]: http://www.oracle.com/technetwork/database/features/plsql/index.html
[amazon redshift]: https://docs.aws.amazon.com/redshift/latest/dg/cm_chap_SQLCommandRef.html
[spark]: https://spark.apache.org/docs/latest/api/sql/index.html
[postgresql]: https://www.postgresql.org/
[mariadb]: https://mariadb.com/
[mysql]: https://www.mysql.com/
[tsql]: https://docs.microsoft.com/en-us/sql/sql-server/
