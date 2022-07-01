# tabulateAlias

Aligns column aliases into a single column.
Does not effect table name aliases.

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
