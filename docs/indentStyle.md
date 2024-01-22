# indentStyle (DEPRECATED!)

Switches between different indentation styles.

## Options

- `"standard"` (default) indents code by the amount specified by `tabWidth` option.
- `"tabularLeft"` indents in tabular style with 10 spaces, aligning keywords to left.
- `"tabularRight"` indents in tabular style with 10 spaces, aligning keywords to right.

Caveats of using `"tabularLeft"` and `"tabularRight"`:

- `tabWidth` option is ignored. Indentation will always be 10 spaces, regardless of what is specified by `tabWidth`.
- The implementation of these styles is more of a bolted-on feature which has never worked quite as well as the `"standard"` style.

### standard

```
SELECT
  COUNT(a.column1),
  MAX(b.column2 + b.column3),
  b.column4 AS four
FROM
  (
    SELECT
      column1,
      column5
    FROM
      table1
  ) a
  JOIN table2 b ON a.column5 = b.column5
WHERE
  column6
  AND column7
GROUP BY column4
```

### tabularLeft

```
SELECT    COUNT(a.column1),
          MAX(b.column2 + b.column3),
          b.column4 AS four
FROM      (
          SELECT    column1,
                    column5
          FROM      table1
          ) a
JOIN      table2 b ON a.column5 = b.column5
WHERE     column6
AND       column7
GROUP BY  column4
```

### tabularRight

```
   SELECT COUNT(a.column1),
          MAX(b.column2 + b.column3),
          b.column4 AS four
     FROM (
             SELECT column1,
                    column5
               FROM table1
          ) a
     JOIN table2 b ON a.column5 = b.column5
    WHERE column6
      AND column7
 GROUP BY column4
```
