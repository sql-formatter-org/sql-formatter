import Tokenizer from 'src/core/Tokenizer';
import { Parser, Grammar } from 'nearley';

import grammar from 'src/grammar/grammar';
import LexerAdapter from 'src/grammar/LexerAdapter';

describe('Nearley integration', () => {
  let parser: Parser;

  beforeEach(() => {
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
    parser = new Parser(Grammar.fromCompiled(grammar), { lexer });
  });

  it('parses something', () => {
    expect(parser.feed('SELECT foo, bar').results).toMatchInlineSnapshot(`
      Array [
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
        },
      ]
    `);
  });
});
