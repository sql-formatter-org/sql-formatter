## Keyword Position Styles

#### Base Query

```
SELECT COUNT(a.column1), MAX(b.column2 + b.column3), b.column4 AS four
FROM ( SELECT column1, column5 FROM table1 ) a
JOIN table2 b ON a.column5 = b.column5
WHERE column6 AND column7
GROUP BY column4
```

This query would be output in the following formats using the different Keyword Position Styles (all other options are default):

### Standard (standard)

```
SELECT
	COUNT(a.column1),
	MAX(b.column2 + b.column3),
	b.column4 AS four
FROM (
	SELECT
		column1,
		column5
	FROM
		table1
) a
JOIN table2 b
ON a.column5 = b.column5
WHERE
	column6
	AND column7
GROUP BY column4
```

### 10-Space Left-aligned (tenSpaceLeft)

```
SELECT    COUNT(a.column1),
          MAX(b.column2 + b.column3),
          b.column4 AS four
FROM      (
          SELECT    column1,
                    column5
          FROM      table1
          ) a
JOIN      table2 b
ON        a.column5 = b.column5
WHERE     column6
AND       column7
GROUP BY  column4
```

### 10-Space Right-aligned (tenSpaceRight)

```
   SELECT COUNT(a.column1),
          MAX(b.column2 + b.column3),
          b.column4 AS four
     FROM (
             SELECT column1,
                    column5
               FROM table1
          ) a
     JOIN table2 b
       ON a.column5 = b.column5
    WHERE column6
      AND column7
 GROUP BY column4
```
