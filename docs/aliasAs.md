# aliasAs

Enforces consistent use of `AS` keywords in alias declarations.

## Options

- `"preserve"` (default) does nothing.
- `"always"` enforces `AS` usage for all aliases.
- `"never"` forbids `AS` usage for all aliases.
- `"select"` enforces `AS` usage in column aliases of `SELECT` and forbids it for table name aliases.

### preserve

```
SELECT
  p.first_name name,
  YEAR() - p.birth_year AS age
FROM
  persons AS p
```

### always

```
SELECT
  p.first_name AS name,
  YEAR() - p.birth_year AS age
FROM
  persons AS p
```

### never

```
SELECT
  p.first_name name,
  YEAR() - p.birth_year age
FROM
  persons p
```

### select

```
SELECT
  p.first_name AS name,
  YEAR() - p.birth_year AS age
FROM
  persons p
```
