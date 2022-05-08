# newline

Determines when to break lists of items (e.g. columns in `SELECT` clause) to multiple lines.

## Options

- `"always"` (default) always breaks to multiple lines (even when just a single item).
- `"never"` never breaks to multiple lines, regardless of item count or line length.
- `number` breaks to multiple lines when there are more items than the specified number.
- `"lineWidth"` breaks to multiple lines when the line would exceed value of `lineWidth` option.

### always (default)

```
SELECT
  first_name,
  last_name,
  occupation,
  age
FROM
  persons
GROUP BY
  age,
  occupation
```

### never

```
SELECT first_name, last_name, occupation, age
FROM persons
GROUP BY age, occupation
```

### number

Using `newline: 1`:

```
SELECT
  first_name,
  last_name,
  occupation,
  age
FROM persons
GROUP BY
  age,
  occupation
```

Using `newline: 2`:

```
SELECT
  first_name,
  last_name,
  occupation,
  age
FROM persons
GROUP BY age, occupation
```

Using `newline: 4`:

```
SELECT first_name, last_name, occupation, age
FROM persons
GROUP BY age, occupation
```

### lineWidth

Using `newline: "lineWidth", lineWidth: 13`:

```
SELECT
  first_name,
  last_name,
  occupation,
  age
FROM persons
GROUP BY
  age,
  occupation
```

Using `newline: "lineWidth", lineWidth: 15`:

```
SELECT
  first_name,
  last_name,
  occupation,
  age
FROM persons
GROUP BY age, occupation
```

Using `newline: "lineWidth", lineWidth: 50`:

```
SELECT first_name, last_name, occupation, age
FROM persons
GROUP BY age, occupation
```
