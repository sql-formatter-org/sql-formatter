# tabWidth

Specifies amount of spaces to be used for indentation.

## Option value

A number specifying the number of spaces per indentation level.

This option is ignored when `useTabs` option is enabled.

### Indenting by 2 spaces (default)

```sql
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

Using `tabWidth: 4`:

```sql
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

See [`useTabs` option](useTabs.md).
