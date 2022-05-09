# multilineLists

Determines when to break lists of items (e.g. columns in `SELECT` clause) to multiple lines.

## Options

- `"always"` (default) always breaks to multiple lines (even when just a single item).
- `"never"` never breaks to multiple lines, regardless of item count or line length.
- `number` breaks to multiple lines when there are more items than the specified number.
- `"expressionWidth"` breaks to multiple lines when the line would exceed value of `expressionWidth` option.

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

Using `multilineLists: 1`:

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

Using `multilineLists: 2`:

```
SELECT
  first_name,
  last_name,
  occupation,
  age
FROM persons
GROUP BY age, occupation
```

Using `multilineLists: 4`:

```
SELECT first_name, last_name, occupation, age
FROM persons
GROUP BY age, occupation
```

### expressionWidth

Using `multilineLists: "expressionWidth", expressionWidth: 13`:

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

Using `multilineLists: "expressionWidth", expressionWidth: 15`:

```
SELECT
  first_name,
  last_name,
  occupation,
  age
FROM persons
GROUP BY age, occupation
```

Using `multilineLists: "expressionWidth", expressionWidth: 50`:

```
SELECT first_name, last_name, occupation, age
FROM persons
GROUP BY age, occupation
```
