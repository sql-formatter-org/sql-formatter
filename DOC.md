# Prettier-SQL

## Overview:

This formatter generally follows this flow:

- `<sql>.formatter.ts` files are created for each support dialect that defined a mostly exhaustive list of Reserved Keywords\*
- this formatter class is then passed to the lexer, which tokenises the SQL input string and produces a token stream\*\*
- the token stream is then directly formatted sequentially by the `format()` method, without a parsing step\*\*\*

\*some more edge case work needs to be done regarding identifying keywords that are multiple words instead of single words

\*\*this tokenizer is set to be replaced in the v5.2 release (Moo)

\*\*\*a parser is set to be added in the future with the v6 release (Nearley)

## Tokenizer:

The tokenizer consumes the lists of tokens from the formatter class files, joined them into respective regular expressions. \
These regular expressions are then tested in order of priority, allowing Reserved Keywords and Reserved Commands to be matched before common identifiers or operators.

The current priority order is:

- Line Comment (denotes comments across the entire line)
- Block Comment (denotes comments within a block)
- Strings (only specific tokens beginning and ending with the supported string delimiters)
- Block Start tokens (such as Left Parenthesis, Left Bracket, Left Brace, and CASE)
- Block End tokens (such as Right Parenthesis, Right Bracket, Right Brace, and END)
- Placeholder tokens (used for variable substitution)
- Numbers (must match a common numeric format, such as floats or scientific notation)
- Reserved words (denotes words that are reserved in the SQL dialect)

  - Reserved Commands (begins its own clause, such as `SELECT`)
  - Reserved Binary Commands (connect two adjacent clauses, such as joins or set operations)
  - Reserved Dependent Clauses (keywords that are dependent on the previous clause, such as `ON` for joins or `WHEN` and `THEN` for CASE)
  - Reserved Logical Operator (boolean operators such as `AND` and `OR`)
  - Reserved Keywords/Functions (other reserved words)

- Word tokens (aka common identifiers)
- Operators (any supported operators comprised of special characters)
