%start main
%ebnf

%% /* language grammar */

main: statement EOF {return $1;};

statement: (expr)* {$$ = {type: 'statement', children: $1}};

expr
    : '*' {$$ = {type: 'star'};}
    | NUMBER {$$ = {type: 'number', value: yytext}}
    | IDENTIFIER {$$ = {type: 'identifier', value: yytext}}
    | SELECT {$$ = {type: 'keyword', value: yytext}}
    | FROM {$$ = {type: 'keyword', value: yytext}};
