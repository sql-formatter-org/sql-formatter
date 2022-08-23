@preprocessor typescript
@{%
import LexerAdapter from 'src/parser/LexerAdapter';
import { NodeType } from 'src/parser/ast';
import { Token, TokenType } from 'src/lexer/token';

// The lexer here is only to provide the has() method,
// that's used inside the generated grammar definition.
// A proper lexer gets passed to Nearley Parser constructor.
const lexer = new LexerAdapter(chunk => []);

// Used for unwrapping grammar rules like:
//
//   rule -> ( foo | bar | baz )
//
// which otherwise produce single element nested inside two arrays
const unwrap = <T>([[el]]: T[][]): T => el;

const toKeywordNode = (token: Token) => ({
  type: NodeType.keyword,
  tokenType: token.type,
  text: token.text,
  raw: token.raw,
});
%}
@lexer lexer

main -> statement:* {%
  ([statements]) => {
    const last = statements[statements.length - 1];
    if (last && !last.hasSemicolon) {
      // we have fully parsed the whole file
      // discard the last statement when it's empty
      return last.children.length > 0 ? statements : statements.slice(0, -1);
    } else {
      // parsing still in progress, do nothing
      return statements;
    }
  }
%}

statement -> expressions_or_clauses (%DELIMITER | %EOF) {%
  ([children, [delimiter]]) => ({
    type: NodeType.statement,
    children,
    hasSemicolon: delimiter.type === TokenType.DELIMITER,
  })
%}

# To avoid ambiguity, plain expressions can only come before clauses
expressions_or_clauses -> expression:* clause:* {%
  ([expressions, clauses]) => [...expressions, ...clauses]
%}

clause ->
  ( limit_clause
  | select_clause
  | other_clause
  | set_operation ) {% unwrap %}

limit_clause -> %LIMIT commaless_expression:+ (%COMMA expression:+):? {%
  ([limitToken, exp1, optional]) => {
    if (optional) {
      const [comma, exp2] = optional;
      return {
        type: NodeType.limit_clause,
        limitToken,
        offset: exp1,
        count: exp2,
      };
    } else {
      return {
        type: NodeType.limit_clause,
        limitToken,
        count: exp1,
      };
    }
  }
%}

select_clause -> %RESERVED_SELECT (all_columns_asterisk expression:* | asteriskless_expression expression:*) {%
  ([nameToken, [exp, expressions]]) => ({
    type: NodeType.clause,
    nameToken,
    children: [exp, ...expressions],
  })
%}

all_columns_asterisk -> %ASTERISK {%
  () => ({ type: NodeType.all_columns_asterisk })
%}

other_clause -> %RESERVED_COMMAND expression:* {%
  ([nameToken, children]) => ({
    type: NodeType.clause,
    nameToken,
    children,
  })
%}

set_operation -> %RESERVED_SET_OPERATION expression:* {%
  ([nameToken, children]) => ({
    type: NodeType.set_operation,
    nameToken,
    children,
  })
%}

expression -> ( simple_expression | asterisk | comma ) {% unwrap %}

asteriskless_expression -> ( simple_expression | comma ) {% unwrap %}

commaless_expression -> ( simple_expression | asterisk ) {% unwrap %}

simple_expression ->
  ( array_subscript
  | function_call
  | parenthesis
  | curly_braces
  | square_brackets
  | between_predicate
  | expression_token ) {% unwrap %}

array_subscript -> (%ARRAY_IDENTIFIER | %ARRAY_KEYWORD) square_brackets {%
  ([[arrayToken], brackets]) => ({
    type: NodeType.array_subscript,
    arrayToken,
    parenthesis: brackets,
  })
%}

function_call -> %RESERVED_FUNCTION_NAME parenthesis {%
  ([name, parens]) => ({
    type: NodeType.function_call,
    nameToken: name,
    parenthesis: parens,
  })
%}

parenthesis -> "(" expressions_or_clauses ")" {%
  ([open, children, close]) => ({
    type: NodeType.parenthesis,
    children: children,
    openParen: "(",
    closeParen: ")",
  })
%}

curly_braces -> "{" expression:* "}" {%
  ([open, children, close]) => ({
    type: NodeType.parenthesis,
    children: children,
    openParen: "{",
    closeParen: "}",
  })
%}

square_brackets -> "[" expression:* "]" {%
  ([open, children, close]) => ({
    type: NodeType.parenthesis,
    children: children,
    openParen: "[",
    closeParen: "]",
  })
%}

between_predicate -> %BETWEEN commaless_expression %AND commaless_expression {%
  ([betweenToken, expr1, andToken, expr2]) => ({
    type: NodeType.between_predicate,
    betweenToken,
    expr1: [expr1],
    andToken,
    expr2: [expr2],
  })
%}

comma -> ( %COMMA ) {% ([[token]]) => ({ type: NodeType.comma }) %}

asterisk -> ( %ASTERISK ) {% ([[token]]) => ({ type: NodeType.operator, text: token.text }) %}

expression_token ->
  ( operator
  | identifier
  | parameter
  | literal
  | keyword
  | comment ) {% unwrap %}

operator -> ( %OPERATOR ) {% ([[token]]) => ({ type: NodeType.operator, text: token.text }) %}

identifier ->
  ( %IDENTIFIER
  | %QUOTED_IDENTIFIER
  | %VARIABLE ) {% ([[token]]) => ({ type: NodeType.identifier, text: token.text }) %}

parameter ->
  ( %NAMED_PARAMETER
  | %QUOTED_PARAMETER
  | %NUMBERED_PARAMETER
  | %POSITIONAL_PARAMETER ) {% ([[token]]) => ({ type: NodeType.parameter, key: token.key, text: token.text }) %}

literal ->
  ( %NUMBER
  | %STRING ) {% ([[token]]) => ({ type: NodeType.literal, text: token.text }) %}

keyword ->
  ( %RESERVED_KEYWORD
  | %RESERVED_PHRASE
  | %RESERVED_DEPENDENT_CLAUSE
  | %RESERVED_JOIN
  | %CASE
  | %END
  | %AND
  | %OR
  | %XOR ) {%
  ([[token]]) => toKeywordNode(token)
%}

comment -> %LINE_COMMENT {%
  ([token]) => ({
    type: NodeType.line_comment,
    text: token.text,
    precedingWhitespace: token.precedingWhitespace,
  })
%}
comment -> %BLOCK_COMMENT {%
  ([token]) => ({ type: NodeType.block_comment, text: token.text })
%}
