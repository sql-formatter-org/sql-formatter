%start main

%% /* language grammar */

main: select EOF {return $1;};

select: 'SELECT' expr 'FROM' expr {$$ = {type: 'select', cols: $2, from: $4};};

expr
    : '*' {$$ = {type: 'star'};}
    | NUMBER {$$ = {type: 'number', value: yytext}}
    | IDENTIFIER {$$ = {type: 'identifier', value: yytext}};
