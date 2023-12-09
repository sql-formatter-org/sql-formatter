# keywordCase

Converts reserved keywords to upper- or lowercase.

## Options

- `"preserve"` (default) preserves the original case.
- `"upper"` converts to uppercase.
- `"lower"` converts to lowercase.

### preserve

```
Select
  count(a.column1),
  max(a.column2 + a.column3),
  a.column4 AS myCol
From
  table1 as a
Where
  column6
  and column7
Group by column4
```

### upper

```
SELECT
  COUNT(a.column1),
  MAX(a.column2 + a.column3),
  a.column4 AS myCol
FROM
  table1 AS a
WHERE
  column6
  AND column7
GROUP BY column4
```

### lower

```
select
  count(a.column1),
  max(a.column2 + a.column3),
  a.column4 as myCol
from
  table1 as a
where
  column6
  and column7
group by column4
```
