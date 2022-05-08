# commaPosition

Defines where to place commas in lists of columns.

## Options

- `"after"` (default) places comma at the end of line.
- `"before"` places comma at the start of line.
- `"tabular"` aligns commas in a column at the end of line.

Caveats:

`"before"` style does not work when tabs are used for indentation.

### after

```
SELECT
  p.first_name AS fname,
  p.last_name AS lname,
  YEAR() - p.birth_year AS age,
  p.occupation AS job
FROM
  persons
GROUP BY
  age,
  fname,
  lname
```

### before

```
SELECT
  p.first_name AS name
, p.last_name AS lname
, YEAR() - p.birth_year AS age
, p.occupation AS job
FROM
  persons
GROUP BY
  age
, fname
, lname
```

### tabular

```
SELECT
  p.first_name name        ,
  p.last_name lname        ,
  YEAR() - p.birth_year age,
  p.occupation AS job
FROM
  persons
GROUP BY
  age  ,
  fname,
  lname
```
