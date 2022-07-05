# Prettier SQL

Formats SQL files using the [`sql-formatter`](https://github.com/sql-formatter-org/sql-formatter) library

## Issues

Please report issues here: https://github.com/sql-formatter-org/sql-formatter/issues

Use the FORMATTING template if it is an issue related the formatting of the SQL, otherwise, please use the VSCODE template for issues with running the VSCode Extension

## Configuration

`Prettier-SQL.SQLFlavourOverride`: Uses custom SQL Flavour to format `sql` files. Use this if you are using the Microsoft PostgreSQL or MSSQL Extensions since they do not provide a new language ID for VSCode.

`Prettier-SQL.ignoreTabSettings`: Whether to ignore VSCode user/workspace settings for `tabSize` and `insertSpaces`

`Prettier-SQL.tabSizeOverride`: Overrides `tabSize` if `Prettier-SQL.ignoreTabSettings` is enabled

`Prettier-SQL.insertSpacesOverride`: Overrides `insertSpaces` if `Prettier-SQL.ignoreTabSettings` is enabled

`Prettier-SQL.uppercaseKeywords`: Whether to print keywords in ALL CAPS or lowercase

`Prettier-SQL.keywordPosition`: Switched between standard keyword positioning vs maintaining a central space column

`Prettier-SQL.breakBeforeBooleanOperator`: Whether to break before or after AND and OR

`Prettier-SQL.aliasAS`: Where to use AS in column or table aliases

`Prettier-SQL.tabulateAlias`: Whether to right-align aliases to the longest line in the SELECT clause

`Prettier-SQL.commaPosition`: Where to place commas for SELECT and GROUP BY clauses

`Prettier-SQL.lineWidth`: Number of characters allowed in each line before breaking

`Prettier-SQL.linesBetweenQueries`: How many newlines to place between each query / statement

`Prettier-SQL.denseOperators`: Whether to strip whitespace around operators such as + or >=

`Prettier-SQL.semicolonNewline`: Whether to place semicolon on its own line or on previous line
