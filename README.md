<a href='https://github.com/zeroturnaround/sql-formatter'><img src="static/prettier-sql-clean.svg" width="128"/></a>

# SQL Formatter [![NPM version](https://img.shields.io/npm/v/sql-formatter.svg)](https://npmjs.com/package/sql-formatter) [![Build Status](https://travis-ci.org/zeroturnaround/sql-formatter.svg?branch=sql-formatter-6)](https://travis-ci.org/zeroturnaround/sql-formatter) [![Coverage Status](https://coveralls.io/repos/github/zeroturnaround/sql-formatter/badge.svg?branch=sql-formatter-6)](https://coveralls.io/github/zeroturnaround/sql-formatter?branch=master) [![VSCode](https://img.shields.io/visual-studio-marketplace/v/inferrinizzard.prettier-sql-vscode?label=vscode)](https://marketplace.visualstudio.com/items?itemName=inferrinizzard.prettier-sql-vscode)

**SQL Formatter** is a JavaScript library for pretty-printing SQL queries.

It started as a port of a [PHP Library][], but has since considerably diverged.

SQL Formatter supports the following dialects:

- **sql** - [Standard SQL][]
- **bigquery** - [GCP BigQuery][]
- **db2** - [IBM DB2][]
- **hive** - [Apache Hive][]
- **mariadb** - [MariaDB][]
- **mysql** - [MySQL][]
- **n1ql** - [Couchbase N1QL][]
- **plsql** - [Oracle PL/SQL][]
- **postgresql** - [PostgreSQL][]
- **redshift** - [Amazon Redshift][]
- **spark** - [Spark][]
- **tsql** - [SQL Server Transact-SQL][tsql]

It does not support:

- Stored procedures.
- Changing of the delimiter type to something else than `;`.

→ [Try the demo.](https://zeroturnaround.github.io/sql-formatter)

# Table of contents

- [Install](#install)
- [Documentation](#documentation)
- [Usage](#usage)
  - [Usage as library](#usage-as-library)
  - [Usage from command line](#usage-from-command-line)
  - [Usage without NPM](#usage-without-npm)
  - [Usage with VSCode](#usage-with-vscode)
- [Contributing](#contributing)

## Install

Get the latest version from NPM:

```sh
npm install sql-formatter
```

Also available with yarn:

```sh
yarn add sql-formatter
```

## Documentation

You can read more about how the library works in [DOC.md](DOC.md)

## Usage

### Usage as library

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
	indent: '  ', // Defaults to two spaces
	uppercase: false, // Defaults to true
	linesBetweenQueries: 2, // Defaults to 1
});
```

### Placeholders replacement

```js
// Named placeholders
format('SELECT * FROM tbl WHERE foo = @foo', {
	params: { foo: "'bar'" },
});

// Indexed placeholders
format('SELECT * FROM tbl WHERE foo = ?', {
	params: ["'bar'"],
});
```

Both result in:

```sql
SELECT
  *
FROM
  tbl
WHERE
  foo = 'bar'
```

### Usage from command line

The CLI tool will be installed under `sql-formatter`
and may be invoked via `npx sql-formatter`:

```sh
sql-formatter -h
```

```
usage: sqlfmt.js [-h] [-o OUTPUT] \
[-l {bigquery,db2,hive,mariadb,mysql,n1ql,plsql,postgresql,redshift,spark,sql,tsql}] [-c CONFIG] [--version] [FILE]

SQL Formatter

positional arguments:
  FILE            Input SQL file (defaults to stdin)

optional arguments:
  -h, --help      show this help message and exit
  -o, --output    OUTPUT
                    File to write SQL output (defaults to stdout)
  -l, --language  {bigquery,db2,hive,mariadb,mysql,n1ql,plsql,postgresql,redshift,spark,sql,tsql}
                    SQL dialect (defaults to standard sql)
  -c, --config    CONFIG
                    Path to config json file (will use default configs if unspecified)
  --version       show program's version number and exit
```

By default, the tool takes queries from stdin and processes them to stdout but
one can also name an input file name or use the `--output` option.

```sh
echo 'select * from tbl where id = 3' | sql-formatter
```

```sql
SELECT
  *
FROM
  tbl
WHERE
  id = 3
```

The tool also accepts a JSON config file with the `--config` option that takes this form: \
All fields are optional and all fields that are not specified will be filled with their default values

```ts
{
	"indent": string,
	"uppercase": boolean,
	"keywordPosition": "standard" | "tenSpaceLeft" | "tenSpaceRight",
	"newline": "always" | "lineWidth" | "never" | number,
	"breakBeforeBooleanOperator": boolean,
	"aliasAs": "always" | "select" | "never",
	"tabulateAlias": boolean,
	"commaPosition": "before" | "after" | "tabular",
	"parenOptions": {
		"openParenNewline": boolean,
		"closeParenNewline": boolean
	},
	"lineWidth": number,
	"linesBetweenQueries": number,
	"denseOperators": boolean,
	"semicolonNewline": boolean,
}
```

### Usage without NPM

If you don't use a module bundler, clone the repository, run `npm install` and grab a file from `/dist` directory to use inside a `<script>` tag.
This makes SQL Formatter available as a global variable `window.sqlFormatter`.

### Usage with VSCode

SQL Formatter is also available as a VSCode extension here: \
https://marketplace.visualstudio.com/items?itemName=inferrinizzard.prettier-sql-vscode

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md)

## License

[MIT](LICENSE)

[php library]: https://github.com/jdorn/sql-formatter
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
