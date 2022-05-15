import { Token } from './token';

export type Statement = {
  type: 'statement';
  tokens: Token[];
};

/**
 * A rudimentary parser that slices token stream into list of SQL statements.
 */
export default class Parser {
  parse(tokens: Token[]): Statement[] {
    let currentStatement: Statement = {
      type: 'statement',
      tokens: [],
    };
    const statements = [currentStatement];

    for (const token of tokens) {
      currentStatement.tokens.push(token);

      if (token.value === ';') {
        currentStatement = {
          type: 'statement',
          tokens: [],
        };
        statements.push(currentStatement);
      }
    }

    return statements;
  }
}
