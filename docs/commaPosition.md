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
-- No effect on INSERT Statements of shorter length
INSERT INTO
  Customers (CustomerName, City, Country)
VALUES
  ('Cardinal', 'Stavanger', 'Norway');

-- Multiple Row INSERT Statements of Shorter length with leading comma
INSERT INTO
  Customers (CustomerName, City, Country)
VALUES
  ('Cardinal', 'Stavanger', 'Norway')
  ,('Cardinal', 'Stavanger', 'Norway');

-- Longer INSERT Statements with leading comma
INSERT INTO
  employees (
    employee_id
    ,first_name
    ,last_name
    ,email
    ,phone
    ,hire_date
    ,department
    ,job_title
    ,salary
    ,is_active
  )
VALUES
  (
    1001
    ,'John'
    ,'Smith'
    ,'john.smith@company.com'
    ,'555-123-4567'
    ,'2024-03-15'
    ,'Engineering'
    ,'Software Developer'
    ,85000.00
    ,TRUE
  );


-- leading comma on UPDATE Statements
UPDATE Customers
SET
  ContactName = 'Alfred Schmidt'
  ,City = 'Frankfurt'
WHERE
  CustomerID = 1;

-- leading comma on Statements with comments
SELECT
  a -- comment 1
  ,b -- comment 2
  ,c
FROM
  tableA;

-- Converting from leading comma to trailing comma with block comments
/*INPUT*/
SELECT
  id -- comment 1
  , first_name
  /* block comment */
  , last_name
  , email
FROM
  users;

/*OUTPUT*/
SELECT
  id, -- comment 1
  first_name
  /* block comment */,
  last_name,
  email
FROM
  users;
-- NOTE: THIS IS HOW BLOCK COMMENTS ARE HANDLED FOR TRAILING COMMA CONVERSION
```
