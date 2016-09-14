# SQL Formatter

[![Build Status](https://travis-ci.org/zeroturnaround/sql-formatter.svg?branch=master)](https://travis-ci.org/zeroturnaround/sql-formatter)

A whitespace formatter for different query languages.

## Installation

To install the newest version:

```
npm install --save sql-formatter
```

The SQL Formatter source code is written in ES2015 but we precompile both CommonJS and UMD builds to ES5 so they work in any modern browser.

If you don't use a module bundler then you can drop a UMD build as a `<script>` tag on the page, or tell Bower to install it. The UMD builds make SQL Formatter available as a `window.sqlFormatter` global variable.

## Example usage

First we need to import our CommonJS module and then we can use it for formatting
standard SQL query.

```js
import sqlFormatter from "sql-formatter";

const formattedStandardSql = sqlFormatter.format("sql", "SELECT * FROM table1");
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
sqlFormatter.format("sql", "SELECT * FROM table1 WHERE foo = bar");
```

### [N1QL](http://www.couchbase.com/n1ql)

```js
sqlFormatter.format("n1ql", "SELECT fname, email FROM tutorial USE KEYS ['dave', 'ian'];");
```

## Influence

SQL Formatter core logic is influenced by a PHP version of [SQL Formatter by Jeremy Dorn](https://github.com/jdorn/sql-formatter).

## License

[MIT](https://github.com/zeroturnaround/sql-formatter/blob/master/LICENSE)
