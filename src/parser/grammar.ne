@preprocessor typescript
@{%
import LexerAdapter from './LexerAdapter.js';
import { NodeType, AstNode, CommentNode, KeywordNode } from './ast.js';
import { Token, TokenType } from '../lexer/token.js';

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

interface CommentAttachments {
  leading?: CommentNode[];
  trailing?: CommentNode[];
}

const addComments = (node: AstNode, { leading, trailing }: CommentAttachments): AstNode => {
  if (leading?.length) {
    node = { ...node, leadingComments: leading };
  }
  if (trailing?.length) {
    node = { ...node, trailingComments: trailing };
  }
  return node;
};

const addCommentsToArray = (nodes: AstNode[], { leading, trailing }: CommentAttachments): AstNode[] => {
  if (leading?.length) {
    const [first, ...rest] = nodes;
    nodes = [addComments(first, { leading }), ...rest];
  }
  if (trailing?.length) {
    const lead = nodes.slice(0, -1);
    const last = nodes[nodes.length-1];
    nodes = [...lead, addComments(last, { trailing })];
  }
  return nodes;
};

%}
@lexer lexer

# Conventions:
#
# The _ rule matches optional comments.
#
# Similarly any rule name anding with _ (like "foo_") matches optional comments in the end.

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
expressions_or_clauses -> free_form_sql:* clause:* {%
  ([expressions, clauses]) => [...expressions, ...clauses]
%}

clause ->
  ( limit_clause
  | select_clause
  | other_clause
  | set_operation ) {% unwrap %}

limit_clause -> %LIMIT _ expression_chain_ (%COMMA free_form_sql:+):? {%
  ([limitToken, _, exp1, optional]) => {
    if (optional) {
      const [comma, exp2] = optional;
      return {
        type: NodeType.limit_clause,
        limitKw: addComments(toKeywordNode(limitToken), { trailing: _ }),
        offset: exp1,
        count: exp2,
      };
    } else {
      return {
        type: NodeType.limit_clause,
        limitKw: addComments(toKeywordNode(limitToken), { trailing: _ }),
        count: exp1,
      };
    }
  }
%}

select_clause -> %RESERVED_SELECT (all_columns_asterisk free_form_sql:* | asteriskless_free_form_sql free_form_sql:*) {%
  ([nameToken, [exp, expressions]]) => ({
    type: NodeType.clause,
    nameKw: toKeywordNode(nameToken),
    children: [exp, ...expressions],
  })
%}
select_clause -> %RESERVED_SELECT {%
  ([nameToken]) => ({
    type: NodeType.clause,
    nameKw: toKeywordNode(nameToken),
    children: [],
  })
%}

all_columns_asterisk -> %ASTERISK {%
  () => ({ type: NodeType.all_columns_asterisk })
%}

other_clause -> %RESERVED_CLAUSE free_form_sql:* {%
  ([nameToken, children]) => ({
    type: NodeType.clause,
    nameKw: toKeywordNode(nameToken),
    children,
  })
%}

set_operation -> %RESERVED_SET_OPERATION free_form_sql:* {%
  ([nameToken, children]) => ({
    type: NodeType.set_operation,
    nameKw: toKeywordNode(nameToken),
    children,
  })
%}

expression_chain_ -> expression_with_comments_:+ {% id %}

expression_chain -> expression _expression_with_comments:* {%
  ([expr, chain]) => [expr, ...chain]
%}

andless_expression_chain -> andless_expression _andless_expression_with_comments:* {%
  ([expr, chain]) => [expr, ...chain]
%}

expression_with_comments_ -> expression _ {%
  ([expr, _]) => addComments(expr, { trailing: _ })
%}

_expression_with_comments -> _ expression {%
  ([_, expr]) => addComments(expr, { leading: _ })
%}

_andless_expression_with_comments -> _ andless_expression {%
  ([_, expr]) => addComments(expr, { leading: _ })
%}

free_form_sql -> ( asteriskless_free_form_sql | asterisk ) {% unwrap %}

asteriskless_free_form_sql ->
  ( asteriskless_andless_expression
  | logic_operator
  | comma
  | comment
  | other_keyword ) {% unwrap %}

expression -> ( andless_expression | logic_operator ) {% unwrap %}

andless_expression -> ( asteriskless_andless_expression | asterisk ) {% unwrap %}

asteriskless_andless_expression ->
  ( atomic_expression | between_predicate | case_expression ) {% unwrap %}

atomic_expression ->
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
    array: addComments({ type: NodeType.identifier, text: arrayToken.text}, { trailing: _ }),
    parenthesis: brackets,
  })
%}
array_subscript -> %ARRAY_KEYWORD _ square_brackets {%
  ([arrayToken, _, brackets]) => ({
    type: NodeType.array_subscript,
    array: addComments(toKeywordNode(arrayToken), { trailing: _ }),
    parenthesis: brackets,
  })
%}

function_call -> %RESERVED_FUNCTION_NAME _ parenthesis {%
  ([nameToken, _, parens]) => ({
    type: NodeType.function_call,
    nameKw: addComments(toKeywordNode(nameToken), { trailing: _ }),
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

curly_braces -> "{" free_form_sql:* "}" {%
  ([open, children, close]) => ({
    type: NodeType.parenthesis,
    children: children,
    openParen: "{",
    closeParen: "}",
  })
%}

square_brackets -> "[" free_form_sql:* "]" {%
  ([open, children, close]) => ({
    type: NodeType.parenthesis,
    children: children,
    openParen: "[",
    closeParen: "]",
  })
%}

property_access -> atomic_expression _ %DOT _ (identifier | array_subscript | all_columns_asterisk | parameter) {%
  // Allowing property to be <array_subscript> is currently a hack.
  // A better way would be to allow <property_access> on the left side of array_subscript,
  // but we currently can't do that because of another hack that requires
  // %ARRAY_IDENTIFIER on the left side of <array_subscript>.
  ([object, _1, dot, _2, [property]]) => {
    return {
      type: NodeType.property_access,
      object: addComments(object, { trailing: _1 }),
      property: addComments(property, { leading: _2 }),
    };
  }
%}

between_predicate -> %BETWEEN _ andless_expression_chain _ %AND _ andless_expression {%
  ([betweenToken, _1, expr1, _2, andToken, _3, expr2]) => ({
    type: NodeType.between_predicate,
    betweenKw: toKeywordNode(betweenToken),
    expr1: addCommentsToArray(expr1, { leading: _1, trailing: _2 }),
    andKw: toKeywordNode(andToken),
    expr2: [addComments(expr2, { leading: _3 })],
  })
%}

case_expression -> %CASE _ expression_chain_:? case_clause:* %END {%
  ([caseToken, _, expr, clauses, endToken]) => ({
    type: NodeType.case_expression,
    caseKw: addComments(toKeywordNode(caseToken), { trailing: _ }),
    endKw: toKeywordNode(endToken),
    expr: expr || [],
    clauses,
  })
%}

case_clause -> %WHEN _ expression_chain_ %THEN _ expression_chain_ {%
  ([whenToken, _1, cond, thenToken, _2, expr]) => ({
    type: NodeType.case_when,
    whenKw: addComments(toKeywordNode(whenToken), { trailing: _1 }),
    thenKw: addComments(toKeywordNode(thenToken), { trailing: _2 }),
    condition: cond,
    result: expr,
  })
%}
case_clause -> %ELSE _ expression_chain_ {%
  ([elseToken, _, expr]) => ({
    type: NodeType.case_else,
    elseKw: addComments(toKeywordNode(elseToken), { trailing: _ }),
    result: expr,
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
  | %POSITIONAL_PARAMETER
  | %CUSTOM_PARAMETER ) {% ([[token]]) => ({ type: NodeType.parameter, key: token.key, text: token.text }) %}

literal ->
  ( %NUMBER
  | %STRING ) {% ([[token]]) => ({ type: NodeType.literal, text: token.text }) %}

keyword ->
  ( %RESERVED_KEYWORD
  | %RESERVED_PHRASE
  | %RESERVED_JOIN ) {%
  ([[token]]) => toKeywordNode(token)
%}

logic_operator ->
  ( %AND
  | %OR
  | %XOR ) {%
  ([[token]]) => toKeywordNode(token)
%}

other_keyword ->
  ( %WHEN
  | %THEN
  | %ELSE
  | %END ) {%
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
  ([token]) => ({
    type: NodeType.block_comment,
    text: token.text,
    precedingWhitespace: token.precedingWhitespace,
  })
%}
