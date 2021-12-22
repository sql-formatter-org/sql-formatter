# CHANGELOG

## [5.1.0] : 2021-12-21

### Known Issues

- `newline: number` does not work with `[foo]`, `[` and `]` both count as 1 token each so `[foo]` would be 3 items
  - `array[0]` or `map[key]` do still work as they are parsed as WORD
- BigQuery formatter fails a few tests (ALTER TABLE, tricky line comments) due to those tests not including valid BigQuery SQL, those tests are currently skipped

### Added

Source:

- consumed VSCode Extension as subrepo
- added support for Hive language
- added support for BigQuery language
- added keyword dedupe on Formatter classes via Set

VSCode:

- added command `prettier-sql-vscode.format-selection`
  - Formats SQL selections
- added settings to override user/workspace `tabSize` and `insertSpaces` settings
- added error message on format fail
- added setting to override formatting language for `sql` files when SQL flavour does not have a VSCode language ID (Microsoft PostgreSQL and MSSQL Extensions)

Other:

- demo page now deployed as git repo subtree, served from root/ (subtree of static/)

### Updated

- fixed handling of `newline` options
- simplified `NewlineMode` config
- fixed ; indentation when used with `semicolonNewline` and `tenSpace` configs
- Formatter now uses numeric for loop to allow for index manipulation
- updated `linesBetweenQueries` to add an extra newline (0 lines = 1 line break, no space in between)
- renamed Formatter class files to `<flavour>.formatter.ts`
- renamed test files to `<flavour>.test.js`

### Removed

- removed `newline: hybrid` config
  - `newline: number` now acts like `hybrid`

## [5.0.1] : 2021-11-24

### Updated

- fixed bug when using SELECT \* and `denseOperators`
- fixed aliasAs option on demo page
- fixed handling of tokens with `aliasAs` flag
- demo page now prints stack trace in textarea on error

## [5.0.0] : 2021-11-22

### Added

Source:

- added support for ES6 module exports with TypeScript
  - updated webpack with ts-loader for module types
  - added tsc to babel commonjs build command
- added index.ts pass-through export

Other:

- added GH Actions for CI build
- added issue templates

### Updated

Source:

- updated demo page for all new options

Other:

- renamed library to `prettier-sql`

### Fixed

- fixed bugs related to operator tokens

### Removed

- removed Travis CI (replaced by GH Actions)

## [5.0.0-beta] : 2021-11-03

### Added

Source:

- added option `aliasAs` to toggle use of AS in column, table, query aliases
  - modes: always (SELECT and table), select (SELECT only), never
- added option `newline` to specify rules for inserting newlines within SQL Statements
  - modes: \
    always (break before all arguments) \
    lineWidth (break after line exceeds lineWidth) \
    itemCount (break after n items) \
    hybrid (lineWidth OR itemCount) \
    never (place all Statements on one line)
- added flag `denseOperators` to toggle spaces around binary operators (=, +, %, etc.)
- added flag `semicolonNewline` to toggle placing semicolon on newline vs same line
- added flag `tabulateAlias` for alias tabular mode, aligned on longest line, not including AS
- added option `commaPosition` to specify comma placement within listed Statements
  - modes: \
    before(comma goes before column), \
    after(standard), \
    tabular(aligned to longest line)
- added option `keywordPosition` to support vertically aligned keywords
  - modes: \
    standard, \
    tenSpaceLeft(left-aligned within keyword column), \
    tenSpaceRight(right-aligned within keyword column)
- added flag `breakBeforeBooleanOperator` to toggle breaking before or after logical operators like AND and OR
- added options `parenOptions` for misc rules regarding parenthesis position
  - `openParenNewline` - flag for opening paren on newline or same line
  - `closeParenNewline` - flag for closing paren on newline or same line

Other:

- added enums for all typed config options

Files Added:

- test/comma.js (tests for comma position)
- test/alias.js (tests for alias AS and alias position)
- test/keywordPosition.js (tests for keyword position modes)
- test/newline.js (tests for newline modes)
- test/parenthesis.js (tests for paren positions)

### Updated

Source:

- converted repo to Typescript
- overhauled Keyword lists for all languages
- added default options for all configs
- updated CLI to use config file
- renamed Keyword categories to semantic Keyword types
  - reservedTopLevelWord → reservedCommand
  - reservedTopLevelWordNoIndent → reservedBinaryCommand
  - reservedNewline → reservedDependentClause & reservedLogicalOperator
  - reservedWord → reservedKeyword
  - added reservedFunctions
- updated Tokenizer class and token.ts to be more DRY

### Removed

- tokenTypes.ts (token types moved to TokenType enum in token.ts)
- sqlFormatter.d.ts (converted to TypeScript)
