<a href='https://github.com/zeroturnaround/sql-formatter'><img src="static/prettier-sql-clean.svg" width="128"/></a>

# SQL Formatter [![NPM version](https://img.shields.io/npm/v/sql-formatter.svg)](https://npmjs.com/package/sql-formatter) ![Build status](https://img.shields.io/github/workflow/status/zeroturnaround/sql-formatter/coveralls/master?label=Build&logo=Github) ![Coverage status](https://img.shields.io/coveralls/github/zeroturnaround/sql-formatter?branch=master&label=Coverage&logo=coveralls&style=plastic) [![VSCode](https://img.shields.io/visual-studio-marketplace/v/inferrinizzard.prettier-sql-vscode?label=vscode)](https://marketplace.visualstudio.com/items?itemName=inferrinizzard.prettier-sql-vscode)

**SQL Formatter** is a JavaScript library for pretty-printing SQL queries.

**Note.** The docs here are for the latest dev version.
For the latest release, see [v4.0.2](https://github.com/zeroturnaround/sql-formatter/tree/v4.0.2).

It started as a port of a [PHP Library][], but has since considerably diverged.

It supports various SQL dialects:
GCP BigQuery, IBM DB2, Apache Hive, MariaDB, MySQL, Couchbase N1QL, Oracle PL/SQL, PostgreSQL, Amazon Redshift, Spark, SQL Server Transact-SQL.
See [language option docs](docs/language.md) for more details.

It does not support:

- Stored procedures.
- Changing of the delimiter type to something else than `;`.

→ [Try the demo.](https://zeroturnaround.github.io/sql-formatter)

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
  language: 'spark',
  indent: '  ',
  keywordCase: 'upper',
  linesBetweenQueries: 2,
});
```

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
select
  *
from
  tbl
where
  id = 3
```

The tool also accepts a JSON config file with the `--config` option that takes this form:

```ts
{
  "language": "spark",
  "indent": "  ",
  "keywordCase": "upper",
  "linesBetweenQueries": 2,
}
```

All fields are optional and all fields that are not specified will be filled with their default values.

### Configuration options

- [**`language`**](docs/language.md) the SQL dialect to use.
- [**`indent`**](docs/indent.md) amount of indentation to use (and whether to use tabs).
- [**`keywordCase`**](docs/keywordCase.md) uppercases or lowercases keywords.
- [**`indentStyle`**](docs/indentStyle.md) defines overall indentation style.
- [**`multilineLists`**](docs/multilineLists.md) determines when to break lists of items to multiple lines.
- [**`logicalOperatorNewline`**](docs/logicalOperatorNewline.md) newline before or after boolean operator (AND, OR, XOR).
- [**`aliasAs`**](docs/aliasAs.md) enforces or forbids use of AS keyword for aliases.
- [**`tabulateAlias`**](docs/tabulateAlias.md) aligns column aliases vertically.
- [**`commaPosition`**](docs/commaPosition.md) where to place the comma in column lists.
- [**`newlineBeforeOpenParen`**](docs/newlineBeforeOpenParen.md) placement of opening parenthesis.
- [**`newlineBeforeCloseParen`**](docs/newlineBeforeCloseParen.md) placement of closing parenthesis.
- [**`expressionWidth`**](docs/expressionWidth.md) maximum number of characters in parenthesized expressions to be kept on single line.
- [**`linesBetweenQueries`**](docs/linesBetweenQueries.md) how many newlines to insert between queries.
- [**`denseOperators`**](docs/denseOperators.md) packs operators densely without spaces.
- [**`newlineBeforeSemicolon`**](docs/newlineBeforeSemicolon.md) places semicolon on separate line.
- [**`params`**](docs/params.md) collection of values for placeholder replacement.

### Usage without NPM

If you don't use a module bundler, clone the repository, run `npm install` and grab a file from `/dist` directory to use inside a `<script>` tag.
This makes SQL Formatter available as a global variable `window.sqlFormatter`.

### Usage in editors

- [VSCode extension](https://marketplace.visualstudio.com/items?itemName=inferrinizzard.prettier-sql-vscode)
- [Vim extension](https://github.com/fannheyward/coc-sql/)

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md)

You can read more about how the library works in [DOC.md](DOC.md)

## License

[MIT](LICENSE)

[php library]: https://github.com/jdorn/sql-formatter
