# dataTypeCase (experimental)

Converts data types to upper- or lowercase.

Caveat: Only supported by languages which export `dataTypes` from their `.keywords.ts` file (eg. `bigquery`, `postgresql` and others)

Note: Casing of function names like `VARCHAR(30)` are not modified - instead rely on the `functionCase` option for this.

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
    first_name VarChaR(30) NOT NULL,
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
    first_name VarChaR(30) NOT NULL,
    bio text,
    is_email_verified bool NOT NULL DEFAULT FALSE,
    created_timestamp timestamptz NOT NULL DEFAULT NOW()
  )
```
