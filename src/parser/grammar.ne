@preprocessor typescript
@{%
import LexerAdapter from 'src/parser/LexerAdapter';
import { NodeType, AstNode, CommentNode, KeywordNode } from 'src/parser/ast';
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

const toKeywordNode = (token: Token): KeywordNode => ({
  type: NodeType.keyword,
  tokenType: token.type,
  text: token.text,
  raw: token.raw,
});

const addLeadingComments = (node: AstNode, comments: CommentNode[]): AstNode =>
  comments.length > 0 ? { ...node, leadingComments: comments } : node;

const addTrailingComments = (node: AstNode, comments: CommentNode[]): AstNode =>
  comments.length > 0 ? { ...node, trailingComments: comments } : node;

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

limit_clause -> %LIMIT _ expression_with_comments:+ (%COMMA expression:+):? {%
  ([limitToken, _, exp1, optional]) => {
    if (optional) {
      const [comma, exp2] = optional;
      return {
        type: NodeType.limit_clause,
        name: addTrailingComments(toKeywordNode(limitToken), _),
        offset: exp1,
        count: exp2,
      };
    } else {
      return {
        type: NodeType.limit_clause,
        name: addTrailingComments(toKeywordNode(limitToken), _),
        count: exp1,
      };
    }
  }
%}

select_clause -> %RESERVED_SELECT (all_columns_asterisk expression:* | asteriskless_expression expression:*) {%
  ([nameToken, [exp, expressions]]) => ({
    type: NodeType.clause,
    name: toKeywordNode(nameToken),
    children: [exp, ...expressions],
  })
%}

all_columns_asterisk -> %ASTERISK {%
  () => ({ type: NodeType.all_columns_asterisk })
%}

other_clause -> %RESERVED_COMMAND expression:* {%
  ([nameToken, children]) => ({
    type: NodeType.clause,
    name: toKeywordNode(nameToken),
    children,
  })
%}

set_operation -> %RESERVED_SET_OPERATION expression:* {%
  ([nameToken, children]) => ({
    type: NodeType.set_operation,
    name: toKeywordNode(nameToken),
    children,
  })
%}

expression_with_comments -> simple_expression _ {%
  ([expr, _]) => addTrailingComments(expr, _)
%}

expression -> ( simple_expression | between_predicate | comma | comment ) {% unwrap %}

asteriskless_expression -> ( simple_expression_without_asterisk | between_predicate | comma | comment ) {% unwrap %}

simple_expression -> ( simple_expression_without_asterisk | asterisk ) {% unwrap %}

simple_expression_without_asterisk ->
  ( array_subscript
  | function_call
  | property_access
  | parenthesis
  | curly_braces
  | square_brackets
  | operator
  | identifier
  | parameter
  | literal
  | keyword ) {% unwrap %}

array_subscript -> %ARRAY_IDENTIFIER _ square_brackets {%
  ([arrayToken, _, brackets]) => ({
    type: NodeType.array_subscript,
    array: addTrailingComments({ type: NodeType.identifier, text: arrayToken.text}, _),
    parenthesis: brackets,
  })
%}
array_subscript -> %ARRAY_KEYWORD _ square_brackets {%
  ([arrayToken, _, brackets]) => ({
    type: NodeType.array_subscript,
    array: addTrailingComments(toKeywordNode(arrayToken), _),
    parenthesis: brackets,
  })
%}

function_call -> %RESERVED_FUNCTION_NAME _ parenthesis {%
  ([nameToken, _, parens]) => ({
    type: NodeType.function_call,
    name: addTrailingComments(toKeywordNode(nameToken), _),
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

property_access -> simple_expression _ %DOT _ (identifier | array_subscript | all_columns_asterisk) {%
  // Allowing property to be <array_subscript> is currently a hack.
  // A better way would be to allow <property_access> on the left side of array_subscript,
  // but we currently can't do that because of another hack that requires
  // %ARRAY_IDENTIFIER on the left side of <array_subscript>.
  ([object, _1, dot, _2, [property]]) => {
    return {
      type: NodeType.property_access,
      object: addTrailingComments(object, _1),
      property: addLeadingComments(property, _2),
    };
  }
%}

between_predicate -> %BETWEEN _ simple_expression _ %AND _ simple_expression {%
  ([betweenToken, _1, expr1, _2, andToken, _3, expr2]) => ({
    type: NodeType.between_predicate,
    between: toKeywordNode(betweenToken),
    expr1: [addTrailingComments(addLeadingComments(expr1, _1), _2)],
    and: toKeywordNode(andToken),
    expr2: [addLeadingComments(expr2, _3)],
  })
%}

comma -> ( %COMMA ) {% ([[token]]) => ({ type: NodeType.comma }) %}

asterisk -> ( %ASTERISK ) {% ([[token]]) => ({ type: NodeType.operator, text: token.text }) %}

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
  | %RESERVED_JOIN
  | %CASE
  | %END
  | %WHEN
  | %ELSE
  | %THEN
  | %AND
  | %OR
  | %XOR ) {%
  ([[token]]) => toKeywordNode(token)
%}

_ -> comment:* {% ([comments]) => comments %}

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
