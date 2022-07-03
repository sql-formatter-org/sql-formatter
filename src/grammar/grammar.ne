@preprocessor typescript
@{%
import LexerAdapter from 'src/grammar/LexerAdapter';
import Tokenizer from 'src/core/Tokenizer';

const flatten = (arr: any[]) => arr.flat(Infinity);

const tokenizer = new Tokenizer({
  reservedCommands: ['SELECT', 'FROM', 'WHERE', 'LIMIT', 'CREATE TABLE'],
  reservedDependentClauses: ['WHEN', 'ELSE'],
  reservedBinaryCommands: ['UNION'],
  reservedJoins: ['JOIN'],
  reservedJoinConditions: ['ON', 'USING'],
  reservedKeywords: ['BETWEEN', 'LIKE', 'SQRT'],
  openParens: ['(', '['],
  closeParens: [')', ']'],
  stringTypes: ["''"],
  identTypes: ['""'],
});
const lexer = new LexerAdapter(chunk => tokenizer.tokenize(chunk));
%}
@lexer lexer

main -> "SELECT" columns {% ([name, columns]) => ({ type: "clause", nameToken: name, children: columns }) %}

columns -> %IDENT ("," %IDENT):* {% flatten %}
