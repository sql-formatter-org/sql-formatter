@preprocessor typescript
@{%
import LexerAdapter from 'src/grammar/LexerAdapter';

// The lexer here is only to provide the has() method,
// that's used inside the generated grammar definition.
// A proper lexer gets passed to Nearley Parser constructor.
const lexer = new LexerAdapter(chunk => []);

const flatten = (arr: any[]) => arr.flat(Infinity);
%}
@lexer lexer

main -> statement (";" statement):* {% (items) => {
  return flatten(items)
    // skip semicolons
    .filter(item => item.type === 'statement')
    // mark all statements except the last as having a semicolon
    .map((statement, i, allStatements) => {
      if (i === allStatements.length - 1) {
        return { ...statement, hasSemicolon: false };
      } else {
        return { ...statement, hasSemicolon: true };
      }
    })
    // throw away last statement if it's empty
    .filter(({children, hasSemicolon}) => hasSemicolon || children.length > 0);
} %}

statement -> statement_token:* {% (tokens) => ({ type: 'statement', children: flatten(tokens) }) %}

statement_token ->
    %IDENT
  | %STRING
  | %VARIABLE
  | %RESERVED_KEYWORD
  | %RESERVED_LOGICAL_OPERATOR
  | %RESERVED_DEPENDENT_CLAUSE
  | %RESERVED_BINARY_COMMAND
  | %RESERVED_COMMAND
  | %RESERVED_JOIN
  | %RESERVED_JOIN_CONDITION
  | %RESERVED_CASE_START
  | %RESERVED_CASE_END
  | %OPEN_PAREN
  | %CLOSE_PAREN
  | %LINE_COMMENT
  | %BLOCK_COMMENT
  | %NUMBER
  | %PARAMETER
  | not_semicolon_op

not_semicolon_op -> %OPERATOR {% ([token], loc, reject) => token.value === ';' ? reject : token %}
