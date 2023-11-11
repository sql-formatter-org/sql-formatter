# identifierCase

Converts identifiers to upper or lowercase.

## Options

- `"preserve"` (default) preserves the original case.
- `"upper"` converts to uppercase.
- `"lower"` converts to lowercase.

### preserve

```
select
  count(a.Column1),
  max(a.Column2 + a.Column3),
  a.Column4 AS myCol
from
  Table1 as a
where
  Column6
  and Column7
group by Column4
```

### upper

```
select
  count(a.COLUMN1),
  max(a.COLUMN2 + a.COLUMN3),
  a.COLUMN4 AS MYCOL
from
  TABLE1 as a
where
  COLUMN6
  and COLUMN7
group by COLUMN4
```

### lower

```
select
  count(a.column1),
  max(a.column2 + a.column3),
  a.column4 AS mycol
from
  table1 as a
where
  column6
  and column7
group by column4
```
