# tabulateAlias (deprected)

Aligns column aliases into a single column.
Does not effect table name aliases.

**Warning:** This feature is known to be buggy. Use at your own risk. See [#236][bug].
It will be removed in the next major version.

## Options

- `false` (default) does nothing.
- `true` aligns column aliases into single column.

### tabulateAlias: false

```
SELECT
  p.first_name AS fname,
  p.last_name AS lname,
  YEAR() - p.birth_year AS age
FROM
  persons
```

### tabulateAlias: true

```
SELECT
  p.first_name          AS name,
  p.last_name           AS lname,
  YEAR() - p.birth_year AS age
FROM
  persons
```

Also works without `AS` keyword:

```
SELECT
  p.first_name          name,
  p.last_name           lname,
  YEAR() - p.birth_year age
FROM
  persons
```

[bug]: https://github.com/sql-formatter-org/sql-formatter/issues/236
