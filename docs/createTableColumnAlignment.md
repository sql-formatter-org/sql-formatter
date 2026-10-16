# createTableColumnAlignment

When `true`, formats `CREATE TABLE` column definitions in a three-column
aligned layout:

- **Column 1** – the column name (`col_name`), left-aligned.
- **Column 2** – the column definition / data type (`column_definition`),
  e.g. `INT`, `VARCHAR(100)`, `DECIMAL(10, 2)`, left-aligned.
- **Column 3** – everything else (`PRIMARY KEY`, `NOT NULL`, `DEFAULT`,
  `COMMENT`, `UNIQUE`, ...), left-aligned.

The width of each column is sized to the widest entry in that column across
all column definitions in the same `CREATE TABLE` statement, so the starts
of columns 2 and 3 line up vertically across rows.

Table-level constraints (`CONSTRAINT name UNIQUE (...)`,
`PRIMARY KEY (...)`, `FOREIGN KEY (...)`, `CHECK (...)`, ...) do not have
the `col_name / column_definition / other` shape, so they are emitted on
their own line without padding.

Defaults to `false` (preserves the legacy single-space layout).

## Options

- `true` – enable three-column alignment for `CREATE TABLE` column lists.
- `false` (default) – use the legacy single-space layout.

## Example

### false (default)

```sql
CREATE TABLE users (
  id INT PRIMARY KEY NOT NULL,
  name VARCHAR(100) NOT NULL,
  age INT,
  email VARCHAR(255) UNIQUE
);
```

### true

```sql
CREATE TABLE users (
  id    INT          PRIMARY KEY NOT NULL,
  name  VARCHAR(100) NOT NULL,
  age   INT,
  email VARCHAR(255) UNIQUE
);
```

## Scope and limitations

- The alignment only applies to the column-list parenthesis that directly
  follows a `CREATE TABLE` clause keyword (e.g. `CREATE TABLE`,
  `CREATE OR REPLACE TABLE`, `CREATE TEMP TABLE`, `CREATE TABLE IF NOT EXISTS`,
  `CREATE EXTERNAL TABLE`, ...). It does **not** apply to nested parentheses
  such as the size list of `VARCHAR(100)` or the column list of a
  `CHECK (...)` constraint.
- A short `CREATE TABLE` whose column list fits on a single line (under
  [`expressionWidth`](./expressionWidth.md)) stays on a single line — the
  alignment only kicks in when the column list is split across multiple
  lines.
- If a particular column entry can't be formatted as a single line (for
  example because it contains a multi-line comment, or because the
  "other" part contains a sub-clause like `ON UPDATE` in dialects that
  reserve `UPDATE` as a clause keyword), the whole `CREATE TABLE`
  column list falls back to the legacy multi-line layout for that
  statement.

## createTableColumnAlignment_breakwidth

Maximum character width of the third column (constraints, comments,
defaults, ...) in a `CREATE TABLE` column definition. When the third
column's content exceeds this width, it is wrapped onto a new continuation
line indented to align with the start of the third column.

Only takes effect when [`createTableColumnAlignment`](#createtablecolumnalignment)
is `true`. Ignored otherwise.

### Options

- a positive number (e.g. `30`) — wrap the "other" part to a new line when
  its length exceeds this many characters.
- `0` — always wrap the "other" part to a new line, even when it's short.
- `Infinity` (default) — never wrap; the "other" part is always kept on the
  same line as the column name and data type, regardless of length.

### Example

Given the following input:

```sql
CREATE TABLE tbl (a INT NOT NULL DEFAULT 1 COMMENT "a very long comment that exceeds the default expression width", b INT NOT NULL DEFAULT 1);
```

#### `createTableColumnAlignment_breakwidth: Infinity` (default)

```sql
CREATE TABLE tbl (
  a INT NOT NULL DEFAULT 1 COMMENT "a very long comment that exceeds the default expression width",
  b INT NOT NULL DEFAULT 1
);
```

#### `createTableColumnAlignment_breakwidth: 30`

The long "other" part of column `a` is wrapped to a continuation line
indented to align with the start of the third column:

```sql
CREATE TABLE tbl (
  a INT
        NOT NULL DEFAULT 1 COMMENT "a very long comment that exceeds the default expression width",
  b INT NOT NULL DEFAULT 1
);
```

#### `createTableColumnAlignment_breakwidth: 0`

Every non-empty "other" part is wrapped to a continuation line:

```sql
CREATE TABLE tbl (
  a INT
        NOT NULL DEFAULT 1,
  b INT
        NOT NULL DEFAULT 1
);
```

