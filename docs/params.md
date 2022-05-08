# params

Specifies parameter values to fill in for placeholders inside SQL.

This option is designed to be used through API (though nothing really prevents usage from command line).

## Option value

- `Array` of strings and/or numbers for position placeholders.
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

## Available placeholder types

The placeholder types available depend on SQL dialect used:

- sql - `?`, `?1`
- bigquery - `?`, `?1`
- db2 - `?`, `?1`, `:name`
- hive - `?`, `?1`
- mariadb - `?`, `?1`
- mysql - `?`, `?1`
- n1ql - `$name`
- plsql - `?`, `?1`, `:name`
- postgresql - `$`, `$1`, `:name`
- redshift - `?`, `?1`, `@name`, `#name`, `$name`
- sparksql - `?`, `?1`, `$name`
- tsql - `@name`
