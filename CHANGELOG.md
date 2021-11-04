# CHANGELOG

## NEXT [5.0.0] : 2021-11-03

### Added

New Features:

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

### Removed

Files Removed:

- tokenTypes.ts (token types moved to TokenType enum in token.ts)
- sqlFormatter.d.ts (converted to TypeScript)

### Updated

Major changes:

- converted repo to Typescript
- overhauled Keyword lists for all languages

Other:

- added default options for all configs
- updated CLI to use config file
- renamed Keyword categories to semantic Keyword types
  - reservedTopLevelWord → reservedCommand
  - reservedTopLevelWordNoIndent → reservedBinaryCommand
  - reservedNewline → reservedDependentClause & reservedLogicalOperator
  - reservedWord → reservedKeyword
  - added reservedFunctions
- updated Tokenizer class and token.ts to be more DRY
