# indentStyle

Switches between different indentation styles.

## Options

- `"standard"` (default) indents code by the amount specified by `indent` option.
- `"tenSpaceLeft"` indents in tabular style with 10 spaces, aligning keywords to left.
- `"tenSpaceRight"` indents in tabular style with 10 spaces, aligning keywords to right.

Caveats of using `"tenSpaceLeft"` and `"tenSpaceRight"`:

- `indent` option is ignored. Indentation will always be 10 spaces, regardless of what is specified by `indent`.
- `newlineBeforeOpenParen` option is ignored.
- `newlineBeforeCloseParen` option is ignored.

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

### tenSpaceLeft

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

### tenSpaceRight

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
