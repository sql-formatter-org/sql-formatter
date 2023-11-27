# datatypeCase (experimental)

Converts datatypes to upper- or lowercase.

This option doesn't yet support all types of data types:

- multi-word data types with non-datatype keywords like `timestamp with time zone` are not fully supported - the `WITH` will be cased as a normal keyword

## Options

- `"preserve"` (default) preserves the original case.
- `"upper"` converts to uppercase.
- `"lower"` converts to lowercase.

### preserve

```sql
CREATE TABLE
  users (
    id InTeGeR PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name VarChaR(30) NOT NULL,
    bio teXT,
    is_email_verified BooL NOT NULL DEFAULT FALSE,
    created_timestamp timestamPtz NOT NULL DEFAULT NOW()
  )
```

### upper

```sql
CREATE TABLE
  users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR(30) NOT NULL,
    bio TEXT,
    is_email_verified BOOL NOT NULL DEFAULT FALSE,
    created_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
```

### lower

```sql
CREATE TABLE
  users (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name varchar(30) NOT NULL,
    bio text,
    is_email_verified bool NOT NULL DEFAULT FALSE,
    created_timestamp timestamptz NOT NULL DEFAULT NOW()
  )
```
