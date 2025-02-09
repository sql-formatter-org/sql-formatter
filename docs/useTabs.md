# useTabs

Uses TAB characters for indentation.

## Options

- `false` (default) use spaces (see `tabWidth` option).
- `true` use tabs.

### Indenting with tabs

Using `useTabs: true`:

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

Imagine that these long sequences of spaces are actually TAB characters :)
