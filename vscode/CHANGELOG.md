# CHANGELOG

## [0.2.0] - 2021-12-21

- added command `prettier-sql-vscode.format-selection`
  - Formats SQL selections
- added settings to override user/workspace `tabSize` and `insertSpaces` settings
- added error message on format fail
- added setting to override formatting language for `sql` files when SQL flavour does not have a VSCode language ID (Microsoft PostgreSQL and MSSQL Extensions)
- added formatProvider support on new languages:
  - bigquery

## [0.1.0] - 2021-11-23

- added wrapper for `prettier-sql`
- added VSCode settings for all configs present in v5 release
- added `prettier-sql` icon
- added formatProvider support on the following file languages:
  - sql
  - plsql
  - mysql
  - postgres
  - hive
