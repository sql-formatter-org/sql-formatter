# SQL Formatter Plus

A fork of [SQL Formatter](https://github.com/zeroturnaround/sql-formatter) with some extra bug fixes.

## Extra fixes

-   Fixed formatting issue with unicode characters

# SQL Formatter

**SQL Formatter** is a JavaScript library for pretty-printing SQL queries.
It started as a port of a [PHP Library][], but has since considerably diverged.
It supports [Standard SQL][], [Couchbase N1QL][], [IBM DB2][] and [Oracle PL/SQL][] dialects.

&rarr; [Try the demo.](https://zeroturnaround.github.io/sql-formatter/)

## Install

Get the latest version from NPM:

```
npm install sql-formatter
```

## Usage

```js
import sqlFormatter from 'sql-formatter';

console.log(sqlFormatter.format('SELECT * FROM table1'));
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
sqlFormatter.format('SELECT *', {
    language: 'n1ql', // Defaults to "sql"
    indent: '    ' // Defaults to two spaces
});
```

Currently just four SQL dialects are supported:

-   **sql** - [Standard SQL][]
-   **n1ql** - [Couchbase N1QL][]
-   **db2** - [IBM DB2][]
-   **pl/sql** - [Oracle PL/SQL][]

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

[php library]: https://github.com/jdorn/sql-formatter
[standard sql]: https://en.wikipedia.org/wiki/SQL:2011
[couchbase n1ql]: http://www.couchbase.com/n1ql
[ibm db2]: https://www.ibm.com/analytics/us/en/technology/db2/
[oracle pl/sql]: http://www.oracle.com/technetwork/database/features/plsql/index.html
