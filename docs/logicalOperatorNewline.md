# logicalOperatorNewline

Decides newline placement before or after logical operators (AND, OR, XOR).

## Options

- `"before"` (default) adds newline before the operator.
- `"after"` adds newline after the operator.

### before

```
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

```
SELECT
  *
FROM
  persons
WHERE
  age > 10 AND
  height < 150 OR
  occupation IS NULL
```
