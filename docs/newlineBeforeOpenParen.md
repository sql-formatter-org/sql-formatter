# newlineBeforeOpenParen

Decides whether to place open-parenthesis `(` of sub-queries on a separate line.

## Options

- `true` (default) adds newline before open-parenthesis.
- `false` no newline.

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

## Caveats

- This option is ignored when `indentStyle: "tabularLeft"` or `"tabularRight"` is used.
- This option is ignored when the parenthized content is smaller than `expressionWidth`.
- This option is ignored for function calls.
