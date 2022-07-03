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

main -> "SELECT" columns {% ([name, columns]) => ({ type: "clause", nameToken: name, children: columns }) %}

columns -> %IDENT ("," %IDENT):* {% flatten %}
