import { Parser, Grammar } from 'nearley';

import grammar from 'src/grammar/grammar';

describe('Nearley integration', () => {
  let parser: Parser;

  beforeEach(() => {
    parser = new Parser(Grammar.fromCompiled(grammar));
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
