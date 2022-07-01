# multilineLists (DEPRECATED)

Determines when to break lists of items (e.g. columns in `SELECT` clause) to multiple lines.

## Options

- `"always"` (default) always breaks to multiple lines (even when just a single item).
- `"avoid"` avoids breaking to multiple lines, regardless of item count or line length.
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

### avoid

```
SELECT first_name, last_name, occupation, age
FROM persons
GROUP BY age, occupation
```

But switches to multiple lines when CASE expression is seen:

```
SELECT
  first_name,
  CASE sex
    WHEN 'F' THEN 'ms'
    WHEN 'M' THEN 'mr'
  END AS title
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

## Caveats

This option has problematic behavior when dealing with comma-separated items within parenthesis.

For example, with `multilineLists: "always"` you'd get this result:

```
INSERT INTO
  records (25, 'John', 'Lennon', 1971, 'Imagine');

INSERT INTO
  records (
    26,
    'Michael',
    'Jackson',
    1997,
    'Blood on the Dance Floor'
  );
```

Which is not really always.

And with `multilineLists: "avoid"` you'd get:

```
INSERT INTO records (25, 'John', 'Lennon', 1971, 'Imagine');

INSERT INTO records (
    26, 'Michael', 'Jackson', 1997, 'Blood on the Dance Floor'
  );
```

Which still breaks things to multiple lines, but with incorrect indentation.
