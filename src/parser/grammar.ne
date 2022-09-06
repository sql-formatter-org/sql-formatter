@preprocessor typescript
@{%
import LexerAdapter from 'src/parser/LexerAdapter';
import { NodeType, AstNode } from 'src/parser/ast';
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

// Last item in array
const last = <T>(arr: T[]): T => arr[arr.length - 1];

const toKeywordNode = (token: Token) => ({
  type: NodeType.keyword,
  tokenType: token.type,
  text: token.text,
  raw: token.raw,
  loc: token.loc,
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
        name: toKeywordNode(limitToken),
        offset: exp1,
        count: exp2,
        loc: { start: limitToken.loc.start, end: last(exp2 as AstNode[]).loc.end },
      };
    } else {
      return {
        type: NodeType.limit_clause,
        name: toKeywordNode(limitToken),
        count: exp1,
        loc: { start: limitToken.loc.start, end: last(exp1 as AstNode[]).loc.end },
      };
    }
  }
%}

select_clause -> %RESERVED_SELECT (all_columns_asterisk expression:* | asteriskless_expression expression:*) {%
  ([nameToken, [exp, expressions]]) => {
    const children: AstNode[] = [exp, ...expressions];
    return {
      type: NodeType.clause,
      name: toKeywordNode(nameToken),
      children,
      loc: {
        start: nameToken.loc.start,
        end: children.length > 0 ? last(children).loc.end : nameToken.loc.end,
      },
    };
  }
%}

all_columns_asterisk -> %ASTERISK {%
  ([token]) => ({ type: NodeType.all_columns_asterisk, loc: token.loc })
%}

other_clause -> %RESERVED_COMMAND expression:* {%
  ([nameToken, children]) => ({
    type: NodeType.clause,
    name: toKeywordNode(nameToken),
    children,
    loc: {
      start: nameToken.loc.start,
      end: children.length > 0 ? last(children as AstNode[]).loc.end : nameToken.loc.end,
    },
  })
%}

set_operation -> %RESERVED_SET_OPERATION expression:* {%
  ([nameToken, children]) => ({
    type: NodeType.set_operation,
    name: toKeywordNode(nameToken),
    children,
    loc: {
      start: nameToken.loc.start,
      end: children.length > 0 ? last(children as AstNode[]).loc.end : nameToken.loc.end,
    },
  })
%}

expression -> ( simple_expression | between_predicate | asterisk | comma ) {% unwrap %}

asteriskless_expression -> ( simple_expression | between_predicate | comma ) {% unwrap %}

commaless_expression -> ( simple_expression | between_predicate | asterisk ) {% unwrap %}

simple_expression ->
  ( array_subscript
  | function_call
  | property_access
  | parenthesis
  | curly_braces
  | square_brackets
  | expression_token ) {% unwrap %}

array_subscript -> %ARRAY_IDENTIFIER square_brackets {%
  ([arrayToken, brackets]) => ({
    type: NodeType.array_subscript,
    array: { type: NodeType.identifier, text: arrayToken.text, loc: arrayToken.loc },
    parenthesis: brackets,
    loc: { start: arrayToken.loc.start, end: brackets.loc.end },
  })
%}
array_subscript -> %ARRAY_KEYWORD square_brackets {%
  ([arrayToken, brackets]) => ({
    type: NodeType.array_subscript,
    array: toKeywordNode(arrayToken),
    parenthesis: brackets,
    loc: { start: arrayToken.loc.start, end: brackets.loc.end },
  })
%}

function_call -> %RESERVED_FUNCTION_NAME parenthesis {%
  ([nameToken, parens]) => ({
    type: NodeType.function_call,
    name: toKeywordNode(nameToken),
    parenthesis: parens,
    loc: { start: nameToken.loc.start, end: parens.loc.end },
  })
%}

parenthesis -> "(" expressions_or_clauses ")" {%
  ([open, children, close]) => ({
    type: NodeType.parenthesis,
    children: children,
    openParen: "(",
    closeParen: ")",
    loc: { start: open.loc.start, end: close.loc.end },
  })
%}

curly_braces -> "{" expression:* "}" {%
  ([open, children, close]) => ({
    type: NodeType.parenthesis,
    children: children,
    openParen: "{",
    closeParen: "}",
    loc: { start: open.loc.start, end: close.loc.end },
  })
%}

square_brackets -> "[" expression:* "]" {%
  ([open, children, close]) => ({
    type: NodeType.parenthesis,
    children: children,
    openParen: "[",
    closeParen: "]",
    loc: { start: open.loc.start, end: close.loc.end },
  })
%}

property_access -> simple_expression %DOT (identifier | array_subscript | all_columns_asterisk) {%
  // Allowing property to be <array_subscript> is currently a hack.
  // A better way would be to allow <property_access> on the left side of array_subscript,
  // but we currently can't do that because of another hack that requires
  // %ARRAY_IDENTIFIER on the left side of <array_subscript>.
  ([object, dot, [property]]) => {
    return {
      type: NodeType.property_access,
      object,
      property,
      loc: { start: object.loc.start, end: property.loc.end },
    };
  }
%}

between_predicate -> %BETWEEN commaless_expression %AND commaless_expression {%
  ([betweenToken, expr1, andToken, expr2]) => ({
    type: NodeType.between_predicate,
    between: toKeywordNode(betweenToken),
    expr1: [expr1],
    and: toKeywordNode(andToken),
    expr2: [expr2],
    loc: { start: betweenToken.loc.start, end: expr2.loc.end },
  })
%}

comma -> ( %COMMA ) {% ([[token]]) => ({ type: NodeType.comma, loc: token.loc }) %}

asterisk -> ( %ASTERISK ) {% ([[token]]) => ({ type: NodeType.operator, text: token.text, loc: token.loc }) %}

expression_token ->
  ( operator
  | identifier
  | parameter
  | literal
  | keyword
  | comment ) {% unwrap %}

operator -> ( %OPERATOR ) {% ([[token]]) => ({ type: NodeType.operator, text: token.text, loc: token.loc }) %}

identifier ->
  ( %IDENTIFIER
  | %QUOTED_IDENTIFIER
  | %VARIABLE ) {% ([[token]]) => ({ type: NodeType.identifier, text: token.text, loc: token.loc }) %}

parameter ->
  ( %NAMED_PARAMETER
  | %QUOTED_PARAMETER
  | %NUMBERED_PARAMETER
  | %POSITIONAL_PARAMETER ) {%
  ([[token]]) => ({ type: NodeType.parameter, key: token.key, text: token.text, loc: token.loc })
%}

literal ->
  ( %NUMBER
  | %STRING ) {% ([[token]]) => ({ type: NodeType.literal, text: token.text, loc: token.loc }) %}

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
    loc: token.loc,
  })
%}
comment -> %BLOCK_COMMENT {%
  ([token]) => ({ type: NodeType.block_comment, text: token.text, loc: token.loc })
%}
