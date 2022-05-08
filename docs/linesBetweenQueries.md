# linesBetweenQueries

Decides how many empty lines to leave between SQL statements.

## Option value

A number of empty lines. Defaults to `1`. Must be positive.

- `1` (default) adds newline before open-parenthesis.
- `false` no newline.

### linesBetweenQueries: 1 (default)

```
SELECT
  *
FROM
  foo;

SELECT
  *
FROM
  bar;
```

### linesBetweenQueries: 0

```
SELECT
  *
FROM
  foo;
SELECT
  *
FROM
  bar;
```

### linesBetweenQueries: 2

```
SELECT
  *
FROM
  foo;


SELECT
  *
FROM
  bar;
```
