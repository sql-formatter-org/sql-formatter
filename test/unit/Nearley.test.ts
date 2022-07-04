import Tokenizer from 'src/core/Tokenizer';
import { Parser, Grammar } from 'nearley';

import grammar from 'src/grammar/grammar';
import LexerAdapter from 'src/grammar/LexerAdapter';

describe('Nearley integration', () => {
  const parse = (sql: string) => {
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
    const parser = new Parser(Grammar.fromCompiled(grammar), { lexer });
    const { results } = parser.feed(sql);

    if (results.length === 1) {
      return results[0];
    } else {
      throw new Error('Ambiguous grammar');
    }
  };

  it('parses something', () => {
    expect(parse('SELECT foo, bar')).toMatchInlineSnapshot(`
      Object {
        "children": Array [
          Object {
            "text": "foo",
            "type": "IDENT",
            "value": "foo",
            "whitespaceBefore": " ",
          },
          Object {
            "text": ",",
            "type": "OPERATOR",
            "value": ",",
            "whitespaceBefore": "",
          },
          Object {
            "text": "bar",
            "type": "IDENT",
            "value": "bar",
            "whitespaceBefore": " ",
          },
        ],
        "nameToken": Object {
          "text": "SELECT",
          "type": "RESERVED_COMMAND",
          "value": "SELECT",
          "whitespaceBefore": "",
        },
        "type": "clause",
      }
    `);
  });
});
