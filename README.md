# SQL Formatter [![NPM version](https://img.shields.io/npm/v/@gwax/sql-formatter.svg)](https://npmjs.com/package/@gwax/sql-formatter) [![Build Status](https://travis-ci.com/gwax/sql-formatter.svg?branch=master)](https://travis-ci.com/gwax/sql-formatter) [![Coverage Status](https://coveralls.io/repos/github/gwax/sql-formatter/badge.svg?branch=master)](https://coveralls.io/github/gwax/sql-formatter?branch=master)

**SQL Formatter** is a JavaScript library for pretty-printing SQL queries.
It started as a Javascript port of a [PHP Library][], but has diverged
considerably, and been forked/joined multiple times in the past. The current
formatter (@gwax/sql-formatter) forked from [zeroturnaround/sql-formatter](https://github.com/zeroturnaround/sql-formatter)
with code consolidated from [kufii/sql-formatter-plus](https://github.com/kufii/sql-formatter-plus)
and a number of other forks scattered around GitHub.

SQL Formatter supports [Standard SQL][], [Couchbase N1QL][], [IBM DB2][],
[Oracle PL/SQL][], [Amazon Redshift][], and [Spark][] dialects.

&rarr; [Try the demo.](https://gwax.github.io/sql-formatter/)

## Install

Get the latest version from NPM:

```
npm install sql-formatter
```

## Usage

```js
import sqlFormatter from '@gwax/sql-formatter';

console.log(sqlFormatter.format('SELECT * FROM table1'));
```

This will output:

```sql
SELECT
  *
FROM
  table1
```

You can also pass in configuration options:

```js
sqlFormatter.format('SELECT *', {
  language: 'n1ql', // Defaults to "sql"
  indent: '    ', // Defaults to two spaces
});
```

Currently just six SQL dialects are supported:

- **sql** - [Standard SQL][]
- **n1ql** - [Couchbase N1QL][]
- **db2** - [IBM DB2][]
- **pl/sql** - [Oracle PL/SQL][]
- **redshift** - [Amazon Redshift][]
- **spark** - [Spark][]

### Placeholders replacement

```js
// Named placeholders
sqlFormatter.format('SELECT * FROM tbl WHERE foo = @foo', {
  params: { foo: "'bar'" },
});

// Indexed placeholders
sqlFormatter.format('SELECT * FROM tbl WHERE foo = ?', {
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

## Usage without NPM

If you don't use a module bundler, clone the repository, run `npm install` and grab a file from `/dist` directory to use inside a `<script>` tag.
This makes SQL Formatter available as a global variable `window.sqlFormatter`.

## Contributing

```bash
# run linter and tests
$ npm run check
```

...and you're ready to poke us with a pull request.

## License

[MIT](https://github.com/gwax/sql-formatter/blob/master/LICENSE)

[php library]: https://github.com/jdorn/sql-formatter
[standard sql]: https://en.wikipedia.org/wiki/SQL:2011
[couchbase n1ql]: http://www.couchbase.com/n1ql
[ibm db2]: https://www.ibm.com/analytics/us/en/technology/db2/
[oracle pl/sql]: http://www.oracle.com/technetwork/database/features/plsql/index.html
[amazon redshift]: https://docs.aws.amazon.com/redshift/latest/dg/cm_chap_SQLCommandRef.html
[spark]: https://spark.apache.org/docs/latest/api/sql/index.html
