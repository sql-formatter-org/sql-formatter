# params

Specifies parameter values to fill in for placeholders inside SQL.

This option is designed to be used through API (though nothing really prevents usage from command line).

## Option value

- `Array` of strings for position placeholders.
- `Object` of name-value pairs for named (and indexed) placeholders.

Note: The escaping of values must be handled by user of the API.

### Positional placeholders

For positional placeholders use array of values:

```js
format('SELECT * FROM persons WHERE fname = ? AND age = ?', {
  params: ["'John'", '27'],
  language: 'sql',
});
```

Results in:

```sql
SELECT
  *
FROM
  persons
WHERE
  fname = 'John'
  AND age = 27
```

### Named placeholders

For named placeholders use object of name-value pairs:

```js
format('SELECT * FROM persons WHERE fname = @name AND age = @age', {
  params: { name: "'John'", age: '27' },
  language: 'tsql',
});
```

Results in:

```sql
SELECT
  *
FROM
  persons
WHERE
  fname = 'John'
  AND age = 27
```

### Numbered placeholders

Treat numbered placeholders the same as named ones and use an object of number-value pairs:

```js
format('SELECT * FROM persons WHERE fname = $1 AND age = $2', {
  params: { 1: "'John'", 2: '27' },
  language: 'postgresql',
});
```

Results in:

```sql
SELECT
  *
FROM
  persons
WHERE
  fname = 'John'
  AND age = 27
```

### Quoted placeholders

Some dialects (BigQuery, Transact SQL) also support quoted names for placeholders:

```js
format('SELECT * FROM persons WHERE fname = @`first name` AND age = @`age`', {
  params: { 'first name': "'John'", 'age': '27' },
  language: 'bigquery',
});
```

Results in:

```sql
SELECT
  *
FROM
  persons
WHERE
  fname = 'John'
  AND age = 27
```

## Available placeholder types

The placeholder types available by default depend on SQL dialect used:

- sql - `?`
- bigquery - `?`, `@name`, `` @`name` ``
- clickhouse - `{name:Type}`
- db2 - `?`, `:name`
- db2i - `?`, `:name`
- hive - _no support_
- mariadb - `?`
- mysql - `?`
- n1ql - `?`, `$1`, `$name`
- plsql - `:1`, `:name`
- postgresql - `$1`
- redshift - `$1`
- snowflake - _no support_
- sqlite - `?`, `?1`, `:name`, `@name`, `$name`
- spark - _no support_
- tidb - `?`
- tsql - `@name`, `@"name"`, `@[name]`
- trino - _no support_

If you need to use a different placeholder syntax than the builtin one,
you can configure the supported placeholder types using the [paramTypes][] config option.

[paramtypes]: ./paramTypes.md
