# functionCase (experimental)

Converts functions to upper- or lowercase.

## Options

- `"preserve"` preserves the original case.
- `"upper"` converts to uppercase.
- `"lower"` converts to lowercase.

The default is either `options.keywordCase` (if you have set it) or `"preserve"`.

### preserve

```sql
CREATE TABLE
  users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name VarChaR(30) NOT NULL,
    bio TEXT,
    is_email_verified BOOL NOT NULL DEFAULT FALSE,
    created_timestamp TIMESTAMPTZ NOT NULL DEFAULT NoW()
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
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name varchar(30) NOT NULL,
    bio TEXT,
    is_email_verified BOOL NOT NULL DEFAULT FALSE,
    created_timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
  )
```
