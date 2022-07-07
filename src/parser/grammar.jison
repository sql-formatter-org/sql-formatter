/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
"*"                   return '*'
[0-9]+                return 'NUMBER'
"SELECT"              return 'SELECT'
"FROM"                return 'FROM'
[a-zA-Z_][a-zA-Z_0-9]* return 'IDENTIFIER'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

%start main

%% /* language grammar */

main: select EOF {return $1;};

select: SELECT expr FROM expr {$$ = {type: 'select', cols: $2, from: $4};};

expr
    : '*' {$$ = {type: 'star'};}
    | NUMBER {$$ = {type: 'number', value: yytext}}
    | IDENTIFIER {$$ = {type: 'identifier', value: yytext}};
