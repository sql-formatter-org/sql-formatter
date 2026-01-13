# commaNewline

Decides newline placement before or after commas seperating columns/tables.

## Options

- `"after"` (default) adds newline after the comma.
- `"before"` adds newline before the comma with a following space.

### after

```sql
SELECT
  name,
  age,
  height
FROM
  persons
WHERE
  age > 10
  AND height < 150
  OR occupation IS NULL
```

### before

```sql
SELECT
  name
  , age
  , height
FROM
  persons
WHERE
  age > 10 AND
  height < 150 OR
  occupation IS NULL
```
