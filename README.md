<a href='https://github.com/sql-formatter-org/sql-formatter'><img src="static/prettier-sql-clean.svg" width="128"/></a>

# SQL Formatter [![NPM version](https://img.shields.io/npm/v/sql-formatter.svg)](https://npmjs.com/package/sql-formatter) ![Build status](https://img.shields.io/github/actions/workflow/status/sql-formatter-org/sql-formatter/coveralls.yaml) [![Coverage Status](https://coveralls.io/repos/github/sql-formatter-org/sql-formatter/badge.svg?branch=master)](https://coveralls.io/github/sql-formatter-org/sql-formatter?branch=master)

**SQL Formatter** is a JavaScript library for pretty-printing SQL queries.

It started as a port of a [PHP Library][], but has since considerably diverged.

It supports various SQL dialects:
GCP BigQuery, IBM DB2, Apache Hive, MariaDB, MySQL, TiDB, Couchbase N1QL, Oracle PL/SQL, PostgreSQL, Amazon Redshift, SingleStoreDB, Snowflake, Spark, SQL Server Transact-SQL, Trino (and Presto).
See [language option docs](docs/language.md) for more details.

It does not support:

- Stored procedures.
- Changing of the delimiter type to something else than `;`.

→ [Try the demo.](https://sql-formatter-org.github.io/sql-formatter)

## Install

Get the latest version from NPM:

```sh
npm install sql-formatter
```

Also available with yarn:

```sh
yarn add sql-formatter
```

## Usage

### Usage as library

```js
import { format } from 'sql-formatter';

console.log(format('SELECT * FROM tbl', { language: 'mysql' }));
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
  language: 'spark',
  tabWidth: 2,
  keywordCase: 'upper',
  linesBetweenQueries: 2,
});
```

### Disabling the formatter

You can disable the formatter for a section of SQL by surrounding it with disable/enable comments:

```sql
/* sql-formatter-disable */
SELECT * FROM tbl1;
/* sql-formatter-enable */
SELECT * FROM tbl2;
```

which produces:

```sql
/* sql-formatter-disable */
SELECT * FROM tbl1;
/* sql-formatter-enable */
SELECT
  *
FROM
  tbl2;
```

The formatter doesn't even parse the code between these comments.
So in case there's some SQL that happens to crash SQL Formatter,
you can at comment the culprit out (at least until the issue gets
fixed in SQL Formatter).

### Placeholders replacement

In addition to formatting, this library can also perform placeholder replacement in prepared SQL statements:

```js
format('SELECT * FROM tbl WHERE foo = ?', {
  params: ["'bar'"],
});
```

Results in:

```sql
SELECT
  *
FROM
  tbl
WHERE
  foo = 'bar'
```

For more details see [docs of params option.](docs/params.md)

### Usage from command line

The CLI tool will be installed under `sql-formatter`
and may be invoked via `npx sql-formatter`:

```sh
sql-formatter -h
```

```
usage: sql-formatter [-h] [-o OUTPUT] \
[-l {bigquery,db2,db2i,hive,mariadb,mysql,n1ql,plsql,postgresql,redshift,singlestoredb,snowflake,spark,sql,sqlite,tidb,transactsql,trino,tsql}] [-c CONFIG] [--version] [FILE]

SQL Formatter

positional arguments:
  FILE            Input SQL file (defaults to stdin)

optional arguments:
  -h, --help      show this help message and exit
  -o, --output    OUTPUT
                    File to write SQL output (defaults to stdout)
  --fix           Update the file in-place
  -l, --language  {bigquery,db2,db2i,hive,mariadb,mysql,n1ql,plsql,postgresql,redshift,singlestoredb,snowflake,spark,sql,sqlite,tidb,trino,tsql}
                    SQL dialect (defaults to basic sql)
  -c, --config    CONFIG
                    Path to config JSON file or json string (will find a file named '.sql-formatter.json' or use default configs if unspecified)
  --version       show program's version number and exit
```

By default, the tool takes queries from stdin and processes them to stdout but
one can also name an input file name or use the `--output` option.

```sh
echo 'select * from tbl where id = 3' | sql-formatter
```

```sql
select
  *
from
  tbl
where
  id = 3
```

The tool also accepts a JSON config file named .sql-formatter.json in the current or any parent directory, or with the `--config` option that takes this form:

```json
{
  "language": "spark",
  "tabWidth": 2,
  "keywordCase": "upper",
  "linesBetweenQueries": 2
}
```

All fields are optional and all fields that are not specified will be filled with their default values.

### Configuration options

- [**`language`**](docs/language.md) the SQL dialect to use (when using `format()`).
- [**`dialect`**](docs/dialect.md) the SQL dialect to use (when using `formatDialect()` since version 12).
- [**`tabWidth`**](docs/tabWidth.md) amount of indentation to use.
- [**`useTabs`**](docs/useTabs.md) to use tabs for indentation.
- [**`keywordCase`**](docs/keywordCase.md) uppercases or lowercases keywords.
- [**`dataTypeCase`**](docs/dataTypeCase.md) uppercases or lowercases data types.
- [**`functionCase`**](docs/functionCase.md) uppercases or lowercases function names.
- [**`identifierCase`**](docs/identifierCase.md) uppercases or lowercases identifiers. (**experimental!**)
- [**`indentStyle`**](docs/indentStyle.md) defines overall indentation style. (**deprecated!**)
- [**`logicalOperatorNewline`**](docs/logicalOperatorNewline.md) newline before or after boolean operator (AND, OR, XOR).
- [**`expressionWidth`**](docs/expressionWidth.md) maximum number of characters in parenthesized expressions to be kept on single line.
- [**`linesBetweenQueries`**](docs/linesBetweenQueries.md) how many newlines to insert between queries.
- [**`denseOperators`**](docs/denseOperators.md) packs operators densely without spaces.
- [**`newlineBeforeSemicolon`**](docs/newlineBeforeSemicolon.md) places semicolon on separate line.
- [**`params`**](docs/params.md) collection of values for placeholder replacement.
- [**`paramTypes`**](docs/paramTypes.md) specifies parameter placeholders types to support.

### Usage without NPM

If you don't use a module bundler, clone the repository, run `npm install` and grab a file from `/dist` directory to use inside a `<script>` tag.
This makes SQL Formatter available as a global variable `window.sqlFormatter`.

### Usage in editors

- [VSCode extension](https://marketplace.visualstudio.com/items?itemName=ReneSaarsoo.sql-formatter-vsc)
  - [Repo](https://github.com/sql-formatter-org/sql-formatter-vscode)
- [Vim extension](https://github.com/fannheyward/coc-sql/)
- [Prettier plugin](https://github.com/un-ts/prettier/tree/master/packages/sql)

## Frequently Asked Questions

### Parse error: Unexpected ... at line ...

The most common cause is that you haven't specified an SQL dialect.
Instead of calling the library simply:

```js
format('select [col] from tbl');
// Throws: Parse error: Unexpected "[col] from" at line 1 column 8
```

pick the proper dialect, like:

```js
format('select [col] from tbl', { language: 'transactsql' });
```

Or when using the VSCode extension: Settings -> SQL-Formatter-VSCode: SQLFlavourOverride.

### Module parse failed: Unexpected token

This typically happens when bundling an appication with Webpack.
The cause is that Babel (through `babel-loader`) is not configured
to support class properties syntax:

```
    | export default class ExpressionFormatter {
    >   inline = false;
```

This syntax is widely supported in all major browsers (except old IE)
and support for it is included to the default `@babel/preset-env`.

Possible fixes:

- Update to newer Babel / Webpack
- Switch to `@babel/preset-env`
- Include plugin `@babel/plugin-proposal-class-properties`

### I'm having a problem with Prettier SQL VSCode extension

The [Prettier SQL VSCode](https://marketplace.visualstudio.com/items?itemName=inferrinizzard.prettier-sql-vscode)
extension is no more maintained by its author.

Please use the official [SQL Formatter VSCode](https://marketplace.visualstudio.com/items?itemName=ReneSaarsoo.sql-formatter-vsc)
extension to get the latest fixes from SQL Formatter library.

### My SQL contains templating syntax which SQL Formatter fails to parse

For example, you might have an SQL like:

```sql
SELECT {col1}, {col2} FROM {tablename}
```

While templating is not directly supported by SQL Formatter, the workaround
is to use [paramTypes](docs/paramTypes.md) config option to treat these
occurances of templating constructs as prepared-statement parameter-placeholders:

```js
format('SELECT {col1}, {col2} FROM {tablename};', {
  paramTypes: { custom: [{ regex: String.raw`\{\w+\}` }] },
});
```

This won't work for all possible templating constructs,
but should solve the most common use cases.

## The future

The development of this formatter is currently in maintenance mode.
Bugs will get fixed if feasible, but new features will likely not be added.

I have started a new SQL formatting tool: [prettier-plugin-sql-cst][].

- It solves several problems which can't be fixed in SQL Formatter because
  of fundamental problems in its arhictecture.
- It makes use of the Prettier layout algorithm,
  doing a better job of splitting long expressions to multiple lines.
- It takes much more opinionated approach to SQL formatting,
  giving only a very limited set of options to adjust the code style.
- It already has full support for SQLite and BigQuery syntax.
  It should work for the most common SQL code in various other dialects.

Give it a try if you'd like to take your SQL auto-formatting to the next level.

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md)

## License

[MIT](LICENSE)

[php library]: https://github.com/jdorn/sql-formatter
[prettier-plugin-sql-cst]: https://github.com/nene/prettier-plugin-sql-cst
