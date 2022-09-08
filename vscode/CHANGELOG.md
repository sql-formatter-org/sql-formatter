# CHANGELOG

## [1.3.1] - 2022-09-07

- updated `sql-formatter` to v10.6.x

## [1.3.0] - 2022-09-05

- updated `sql-formatter` to v10.x
- updated to Nearley parser
- added `singlestoredb` as new supported dialect

## [1.2.0] - 2022-08-09

- updated `sql-formatter` to v9.x
- removed `aliasAS`
- added `trino` (aka presto) as new supported dialect

## [1.1.1] - 2022-07-05

- updated package metadata to point at `sql-formatter` instead of `prettier-sql`

## [1.1.0] - 2022-07-05

- updated `sql-formatter` to v8.x
- removed `newlineBeforeCloseParen`
- removed `newlineBeforeOpenParen`

## [1.0.0] - 2022-06-02

- switched from `prettier-sql` to `sql-formatter` as base library
- renamed `uppercaseKeywords` to `keywordCase`, changed from boolean to enum
- renamed `keywordPosition` to `indentStyle`
- renamed `breakBeforeBooleanOperator` to `logicalOperatorNewline`
- renamed `closeParenNewline` to `newlineBeforeCloseParen`
- renamed `openParenNewline` to `newlineBeforeOpenParen`
- renamed `lineWidth` to `expressionWidth`
- renamed `semicolonNewline` to `newlineBeforeSemicolon`
- added `'preserve'` option for `aliasAS`
- removed `keywordNewline`
- removed `itemCount`
- added formatProvider support on new languages:
  - sqlite

## [0.3.0] - 2022-04-09

- updated dependencies
- update build and publish flow
- renamed `keywordNewline` to `keywordNewline.newlineMode`, remove integer option
- restored deleted `itemCount` as `keywordNewline.itemCount`

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
