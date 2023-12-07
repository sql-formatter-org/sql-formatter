# dataTypeCase (experimental)

Converts data types to upper- or lowercase.

## Options

- `"preserve"` (default) preserves the original case.
- `"upper"` converts to uppercase.
- `"lower"` converts to lowercase.

### preserve

```sql
CREATE TABLE user (
  id InTeGeR PRIMARY KEY,
  first_name VarChaR(30) NOT NULL,
  bio teXT,
  is_email_verified BooL,
  created_timestamp timestamP
);
```

### upper

```sql
CREATE TABLE user (
  id INTEGER PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  bio TEXT,
  is_email_verified BOOL,
  created_timestamp TIMESTAMP
);
```

### lower

```sql
CREATE TABLE user (
  id integer PRIMARY KEY,
  first_name varchar(30) NOT NULL,
  bio text,
  is_email_verified bool,
  created_timestamp timestamp
);
```
