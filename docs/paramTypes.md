# paramTypes

Specifies parameter types to support when parsing SQL prepared statements.

## Motivation

While some SQL dialects have built-in support for prepared statements,
others do not and instead rely on 3rd party libraries to emulate it,
while yet others might have built-in support for prepared statements,
but the syntax depends on the driver used to connect to the database.

By default SQL Formatter supports only the built-in prepared statement
syntax of an SQL dialect as documented in [params option documentation][params].
For example if you're using PostgreSQL you can use the `$nr` syntax:

```ts
format('SELECT * FROM users WHERE name = $1 AND age < $2', { language: 'postgresql' });
```

However if you're connecting to the database using a Java DB connection library,
you might expect to use `:name` placeholders for parameters:

```ts
format('SELECT * FROM users WHERE name = :name AND age < :age', { language: 'postgresql' });
```

This gets by default formatted like so:

```sql
SELECT
  *
FROM
  users
WHERE
  name = : name
  AND age < : age
```

To fix it, you'd need to specify with `paramTypes` config
that you're using `:`-prefixed named placeholders:

```ts
format('SELECT * FROM users WHERE name = :name AND age < :name', {
  language: 'postgresql',
  paramTypes: { named: [':'] },
});
```

After which you'll get the correct result:

```sql
SELECT
  *
FROM
  users
WHERE
  name = :name
  AND age < :age
```

## Option value

An object with the following following optional fields:

- **`positional`**: `boolean`. True to enable `?` placeholders, false to disable them.
- **`numbered`**: `Array<"?" | ":" | "$">`. To allow for `?1`, `:2` and/or `$3` syntax for numbered placholders.
- **`named`**: `Array<":" | "@" | "$">`. To allow for `:name`, `@name` and/or `$name` syntax for named placholders.
- **`quoted`**: `Array<":" | "@" | "$">`. To allow for `:"name"`, `@"name"` and/or `$"name"` syntax for quoted placholders.
  Note that the type of quotes dependes on the quoted identifiers supported by a dialect.
  For example in MySQL using `paramTypes: {quoted: [':']}` would allow you to use `` :`name` `` syntax,
  while in Transact-SQL `:"name"` and `:[name]` would work instead.
  See [identifier syntax wiki page][] for information about differences in support quoted identifiers.

## Parameter value substitution

This config option can be used together with [params][] to substitute the placeholders with actual values.

[params]: ./params.md
[identifier syntax wiki page]: https://github.com/sql-formatter-org/sql-formatter/wiki/identifiers
