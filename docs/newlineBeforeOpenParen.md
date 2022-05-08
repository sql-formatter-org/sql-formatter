# newlineBeforeOpenParen

Decides whether to place open-parenthesis `(` of sub-queries on a separate line.

## Options

- `true` (default) adds newline before open-parenthesis.
- `false` no newline.

Caveats:

This option is ignored when `indentStyle: "tenSpaceLeft"` or `"tenSpaceRight"` is used.

### newlineBeforeOpenParen: true

```
SELECT
  *
FROM
  (
    SELECT
      *
    FROM
      my_table
  );
```

### newlineBeforeOpenParen: false

```
SELECT
  *
FROM (
    SELECT
      *
    FROM
      my_table
  );
```
