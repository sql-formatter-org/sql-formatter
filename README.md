# SQL Formatter [![NPM version](https://img.shields.io/npm/v/sql-formatter.svg)](https://npmjs.com/package/sql-formatter) [![Build Status](https://travis-ci.org/zeroturnaround/sql-formatter.svg?branch=master)](https://travis-ci.org/zeroturnaround/sql-formatter) [![Coverage Status](https://coveralls.io/repos/github/zeroturnaround/sql-formatter/badge.svg?branch=master)](https://coveralls.io/github/zeroturnaround/sql-formatter?branch=master)

**SQL Formatter** is a JavaScript library for pretty-printing SQL queries.
It started as a port of a [PHP Library][], but has since considerably diverged.
It supports [Standard SQL][], [Couchbase N1QL][], [IBM DB2][] and [Oracle PL/SQL][]  dialects.

&rarr; [Try the demo.](https://zeroturnaround.github.io/sql-formatter/)

## Install

Get the latest version from NPM:

```
npm install sql-formatter
```

## Usage

```js
import sqlFormatter from "sql-formatter";

console.log(sqlFormatter.format("SELECT * FROM table1"));
```

This will output:

```
SELECT
  *
FROM
  table1
```

You can also pass in configuration options:

```js
sqlFormatter.format("SELECT *", {
    language: "n1ql", // Defaults to "sql"
    indent: "    "   // Defaults to two spaces
});
```

Currently just four SQL dialects are supported:

- **sql** - [Standard SQL][]
- **n1ql** - [Couchbase N1QL][]
- **db2** - [IBM DB2][]
- **pl/sql** - [Oracle PL/SQL][]

### Placeholders replacement

```js
// Named placeholders
sqlFormatter.format("SELECT * FROM tbl WHERE foo = @foo", {
    params: {foo: "'bar'"}
}));

// Indexed placeholders
sqlFormatter.format("SELECT * FROM tbl WHERE foo = ?", {
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

[MIT](https://github.com/zeroturnaround/sql-formatter/blob/master/LICENSE)

[PHP library]: https://github.com/jdorn/sql-formatter
[Standard SQL]: https://en.wikipedia.org/wiki/SQL:2011
[Couchbase N1QL]: http://www.couchbase.com/n1ql
[IBM DB2]: https://www.ibm.com/analytics/us/en/technology/db2/
[Oracle PL/SQL]: http://www.oracle.com/technetwork/database/features/plsql/index.html
