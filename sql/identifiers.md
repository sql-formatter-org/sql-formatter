# Identifiers

## Normal identifiers

Most dialects support `[a-zA-Z_]` as first character and `[a-zA-Z0-9_]` as rest of the characters.
The differences from this are listed below:

- [BigQuery][]: single dashes (`-`) can be used, but not at the beginning or end.
- [DB2][]: first char can only be a (uppercase) letter (a lowercase letter gets converted to uppercase).
- [Hive][]: _(no differences)_
- [MariaDB][]: no first-letter restrictions. The characters `[a-zA-Z0-9_$]` and unicode letters are allowed everywhere. Can begin with digit, but can't only contain digits.
- [MySQL][]: same as MariaDB.
- [N1QL][]: _(no differences)_
- [PL/SQL][]: can't start with `_`. Allows `$`, `#` in rest of the identifier.
- [PostgreSQL][]: additionally `$` after first char. Also unicode letters are allowed.
- [Redshift][]: also unicode letters are allowed.
- [Spark][]: _Seems like the usual syntax is allowed. But the docs are confusing._
- [SQLite][sqlite-syntax-pdf]: _(no differences)_
- [Transact-SQL][]: `@` and `#` are allowed as first chars plus `$` in the rest. Also unicode letters are allowed.
  Though the beginning `@` signifies a local variable or parameter and `#` a temporary table or procedure.

## Delimited identifiers

SQL standard specifies double-quotes `".."` for delimited identifiers.
There is a considerable variation in implementations:

- `` `..` `` [BigQuery][]
- `".."` [DB2][]
- `` `..` `` [Hive][]
- `` `..` ``, `".."`<sup>1</sup>, `[..]`<sup>2</sup> [MariaDB][]
- `` `..` ``, `".."`<sup>1</sup> [MySQL][]
- `` `..` `` [N1QL][]
- `".."` [PL/SQL][]
- `".."`, `U&".."` [PostgreSQL][]
- `".."` [Redshift][]
- `` `..` `` [Spark][]
- `".."`, `` `..` ``, `[..]` [SQLite][sqlite-keywords]
- `".."`, `[..]` [Transact-SQL][]

Notes:

1. when ANSI_QUOTES mode enabled
2. when MSSQL mode enabled

[bigquery]: https://cloud.google.com/bigquery/docs/reference/standard-sql/lexical
[db2]: https://www.ibm.com/docs/en/db2/9.7?topic=elements-identifiers
[hive]: https://cwiki.apache.org/confluence/pages/viewpage.action?pageId=27362034#LanguageManualDDL-AlterColumn
[mariadb]: https://mariadb.com/kb/en/identifier-names/
[mysql]: https://dev.mysql.com/doc/refman/8.0/en/identifiers.html
[n1ql]: https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/identifiers.html
[pl/sql]: https://docs.oracle.com/database/121/LNPLS/fundamentals.htm#LNPLS99973
[postgresql]: https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS
[redshift]: https://docs.aws.amazon.com/redshift/latest/dg/r_names.html
[spark]: https://spark.apache.org/docs/latest/sql-ref-identifier.html
[sqlite-keywords]: https://www.sqlite.org/lang_keywords.html
[sqlite-syntax-pdf]: https://www.pearsonhighered.com/assets/samplechapter/0/6/7/2/067232685X.pdf
[transact-sql]: https://docs.microsoft.com/en-us/sql/relational-databases/databases/database-identifiers?view=sql-server-ver15
