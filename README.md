# SQL Formatter [![NPM version](https://img.shields.io/npm/v/prettier-sql.svg)](https://npmjs.com/package/prettier-sql) [![Build Status](https://travis-ci.org/inferrinizzard/prettier-sql.svg?branch=master)](https://travis-ci.org/inferrinizzard/prettier-sql) [![Coverage Status](https://coveralls.io/repos/github/inferrinizzard/prettier-sql/badge.svg?branch=master)](https://coveralls.io/github/inferrinizzard/prettier-sql?branch=master)

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

→ [Try the demo.](https://inferrinizzard.github.io/prettier-sql/)

# Table of contents

- [Install](#install)
- [Usage](#usage)
  - [Usage as library](#usage-as-library)
  - [Usage from command line](#usage-from-command-line)
  - [Usage without NPM](#usage-without-npm)
- [Contributing](#contributing)

## Install

Get the latest version from NPM:

```sh
npm install prettier-sql
```

## Usage

### Usage as library

```js
import { format } from 'prettier-sql';

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
format("SELECT * FROM tbl WHERE foo = @foo", {
  params: {foo: "'bar'"}
}));

// Indexed placeholders
format("SELECT * FROM tbl WHERE foo = ?", {
  params: ["'bar'"]
}));
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

The CLI tool will be installed under `prettier-sql`
and may be invoked via `npx prettier-sql`:

```sh
prettier-sql -h
```

```
usage: sqlfmt.js [-h] [-o OUTPUT] \
[-l {db2,mariadb,mysql,n1ql,plsql,postgresql,redshift,spark,sql,tsql}] [-c CONFIG] [--version] [FILE]

SQL Formatter

positional arguments:
  FILE            Input SQL file (defaults to stdin)

optional arguments:
  -h, --help      show this help message and exit
  -o, --output    OUTPUT
                    File to write SQL output (defaults to stdout)
  -l, --language  {db2,mariadb,mysql,n1ql,plsql,postgresql,redshift,spark,sql,tsql}
                    SQL Formatter dialect (defaults to basic sql)
  -c, --config    CONFIG
                    Path to config json file (will use default configs if unspecified)
  --version       show program's version number and exit
```

By default, the tool takes queries from stdin and processes them to stdout but
one can also name an input file name or use the `--output` option.

```sh
echo 'select * from tbl where id = 3' | prettier-sql
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

```json
{
	"indent": string,
	"uppercase": boolean,
	"keywordPosition": "standard" | "tenSpaceLeft" | "tenSpaceRight",
	"newline": {
		"mode": "always" | "itemCount" | "lineWidth" | "hybrid" | "never",
		"itemCount":? number
	},
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

## Contributing

Make sure to run all checks:

```sh
npm run check
```

...and you're ready to poke us with a pull request.

## License

[MIT](https://github.com/inferrinizzard/prettier-sql/blob/master/LICENSE)

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
