# tabWidth

Specifies amount of spaces to be used for indentation.

## Option value

A string containing the characters of one indentation step.
Defaults to two spaces (`" \ "`).

This option is ignored when `useTabs` option is enabled.

### Indenting by 2 spaces (default)

```
SELECT
  *,
FROM
  (
    SELECT
      column1,
      column5
    FROM
      table1
  ) a
  JOIN table2
WHERE
  column6
  AND column7
GROUP BY column4
```

### Indenting by 4 spaces

Using `indent: 4`:

```
SELECT
    *,
FROM
    (
        SELECT
            column1,
            column5
        FROM
            table1
    ) a
    JOIN table2
WHERE
    column6
    AND column7
GROUP BY column4
```

### Indenting with tabs

Using `indent: "\t"`:

```
SELECT
        *,
FROM
        (
                SELECT
                        column1,
                        column5
                FROM
                        table1
        ) a
        JOIN table2
WHERE
        column6
        AND column7
GROUP BY column4
```

Imagine that these long sequences of spaces are actually TAB characters :)
