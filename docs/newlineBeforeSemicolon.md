# newlineBeforeSemicolon

Whether to place query separator (`;`) on a separate line.

## Options

- `false` (default) no empty line before semicolon.
- `true` places semicolon on a separate line.

### newlineBeforeSemicolon: false (default)

```
SELECT
  *
FROM
  foo;
```

### newlineBeforeSemicolon: true

```
SELECT
  *
FROM
  foo
;
```
