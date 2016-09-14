# SQL Formatter

[![Build Status](https://travis-ci.org/zeroturnaround/sql-formatter.svg?branch=master)](https://travis-ci.org/zeroturnaround/sql-formatter)
[![Coverage Status](https://coveralls.io/repos/github/zeroturnaround/sql-formatter/badge.svg?branch=master)](https://coveralls.io/github/zeroturnaround/sql-formatter?branch=master)

**SQL Formatter** is a whitespace formatter for different query languages.

[See the demo](https://zeroturnaround.github.io/sql-formatter/).

## Installation

To install the newest version from NPM:

```
npm install --save sql-formatter
```

The SQL Formatter source code is written in ES2015 but we precompile both CommonJS and UMD builds to ES5 so they work in any modern browser.

If you don't use a module bundler then you can drop a file from `/dist` directory as a `<script>` tag on the page. This makes SQL Formatter available as a `window.SqlFormatter` global variable.

## Example usage

First we need to import our CommonJS module and then we can use it for formatting
standard SQL query.

```js
import SqlFormatter from "sql-formatter";

const formattedStandardSql = new SqlFormatter().format("sql", "SELECT * FROM table1");
```

The value of `formattedStandardSql` will look like this:

```sql
SELECT
  *
FROM
  table1
```

## Supported languages

### [Standard SQL](https://en.wikipedia.org/wiki/SQL:2011)

```js
new SqlFormatter().format("sql", "SELECT * FROM table1 WHERE foo = bar");
```

### [N1QL](http://www.couchbase.com/n1ql)

```js
new SqlFormatter().format("n1ql", "SELECT fname, email FROM tutorial USE KEYS ['dave', 'ian'];");
```

## Custom configuration

```js
new SqlFormatter({
    indent: "  " // Value that is used for creating indentation levels
});
```

## Contribute

> TODO

## Influence

SQL Formatter core logic is influenced by a PHP version of [SQL Formatter by Jeremy Dorn](https://github.com/jdorn/sql-formatter).

## License

[MIT](https://github.com/zeroturnaround/sql-formatter/blob/master/LICENSE)
