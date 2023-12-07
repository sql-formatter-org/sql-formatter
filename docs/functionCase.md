# functionCase

Converts function names to upper- or lowercase.

## Options

- `"preserve"` (default) preserves the original case.
- `"upper"` converts to uppercase.
- `"lower"` converts to lowercase.

### preserve

```sql
SELECT
  Concat(Trim(first_name), ' ', Trim(last_name)) AS name,
  Max(salary) AS max_pay,
  Cast(ssid AS INT)
FROM
  employee
WHERE
  expires_at > Now()
```

### upper

```sql
SELECT
  CONCAT(TRIM(first_name), ' ', TRIM(last_name)) AS name,
  MAX(salary) AS max_pay,
  CAST(ssid AS INT)
FROM
  employee
WHERE
  expires_at > NOW()
```

### lower

```sql
SELECT
  concat(trim(first_name), ' ', trim(last_name)) AS name,
  max(salary) AS max_pay,
  cast(ssid AS INT)
FROM
  employee
WHERE
  expires_at > now()
```
