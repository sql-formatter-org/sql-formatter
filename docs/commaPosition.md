# commaPosition

Decides comma position of commas between multiple columns/tables.

## Options

- `"trailing"` (default) comma appears at the end of line.
- `"leading"` comma appears at the start of the line.
- `"leadingWithSpace"`: comma appears at the start of the line followed by a space.

### trailing

```sql
SELECT
  name,
  age,
  height
FROM
  persons
WHERE
  age > 10
  AND height < 150
  OR occupation IS NULL;
```

### leading

```sql
SELECT
  name
  ,age
  ,height
FROM
  persons
WHERE
  age > 10 AND
  height < 150 OR
  occupation IS NULL;
```

### leadingWithSpace

```sql
SELECT
  name
  , age
  , height
FROM
  persons
WHERE
  age > 10 AND
  height < 150 OR
  occupation IS NULL;
```

### Other examples

```sql
-- No effect on INSERT Statements
INSERT INTO
  Customers (CustomerName, City, Country)
VALUES
  ('Cardinal', 'Stavanger', 'Norway');

-- leading comma on UPDATE Statements
UPDATE Customers
SET
  ContactName = 'Alfred Schmidt'
  ,City = 'Frankfurt'
WHERE
  CustomerID = 1;

-- leading comma on Statements with comments
SELECT
  a -- comment 1, comma part of comment
  ,b -- comment 2
  /* block comment */
  ,c
FROM
  tableA;
```
