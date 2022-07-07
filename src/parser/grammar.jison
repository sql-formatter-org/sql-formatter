%start main
%ebnf

%% /* language grammar */

main: list_of_statements EOF {return $1;};

list_of_statements: statement (another_statement)* {$$ = [$1, ...$2]};

another_statement: ';' statement {$$ = $2};

statement: plain_statement;

plain_statement: (expr)* {$$ = {type: 'statement', children: $1}};

expr
    : '*' {$$ = {type: 'star'}}
    | NUMBER {$$ = {type: 'number', value: yytext}}
    | IDENTIFIER {$$ = {type: 'identifier', value: yytext}}
    | SELECT {$$ = {type: 'keyword', value: yytext}}
    | FROM {$$ = {type: 'keyword', value: yytext}}
    | CREATE {$$ = {type: 'keyword', value: yytext}}
    | TABLE {$$ = {type: 'keyword', value: yytext}};
