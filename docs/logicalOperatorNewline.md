# logicalOperatorNewline

Decides newline placement before or after logical operators (AND, OR, XOR).

## Options

- `"before"` (default) adds newline before the operator.
- `"after"` adds newline after the operator.

### before

```sql
SELECT
  *
FROM
  persons
WHERE
  age > 10
  AND height < 150
  OR occupation IS NULL
```

### after

```sql
SELECT
  *
FROM
  persons
WHERE
  age > 10 AND
  height < 150 OR
  occupation IS NULL
```
