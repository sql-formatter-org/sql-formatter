import Parser from 'src/core/Parser';
import Tokenizer from 'src/core/Tokenizer';

describe('Parser', () => {
  const parse = (sql: string) => {
    const tokens = new Tokenizer({
      reservedCommands: ['SELECT', 'FROM', 'WHERE', 'CREATE TABLE'],
      reservedDependentClauses: ['WHEN', 'ELSE'],
      reservedBinaryCommands: ['UNION', 'JOIN'],
      reservedJoinConditions: ['ON', 'USING'],
      reservedKeywords: ['BETWEEN', 'LIKE'],
      stringTypes: ["''"],
      identTypes: ['""'],
    }).tokenize(sql);
    return new Parser(tokens).parse();
  };

  it('parses empty list of tokens', () => {
    expect(parse('')).toEqual([]);
  });

  it('parses multiple statements', () => {
    expect(parse('foo; bar')).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [
            Object {
              "token": Object {
                "text": "foo",
                "type": "IDENT",
                "value": "foo",
                "whitespaceBefore": "",
              },
              "type": "token",
            },
            Object {
              "token": Object {
                "text": ";",
                "type": "OPERATOR",
                "value": ";",
                "whitespaceBefore": "",
              },
              "type": "token",
            },
          ],
          "type": "statement",
        },
        Object {
          "children": Array [
            Object {
              "token": Object {
                "text": "bar",
                "type": "IDENT",
                "value": "bar",
                "whitespaceBefore": " ",
              },
              "type": "token",
            },
          ],
          "type": "statement",
        },
      ]
    `);
  });

  it('parses parenthesized expressions', () => {
    expect(parse('SELECT abs(birth_year - year(CURRENT_DATE))')).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [
            Object {
              "token": Object {
                "text": "SELECT",
                "type": "RESERVED_COMMAND",
                "value": "SELECT",
                "whitespaceBefore": "",
              },
              "type": "token",
            },
            Object {
              "token": Object {
                "text": "abs",
                "type": "IDENT",
                "value": "abs",
                "whitespaceBefore": " ",
              },
              "type": "token",
            },
            Object {
              "children": Array [
                Object {
                  "token": Object {
                    "text": "birth_year",
                    "type": "IDENT",
                    "value": "birth_year",
                    "whitespaceBefore": "",
                  },
                  "type": "token",
                },
                Object {
                  "token": Object {
                    "text": "-",
                    "type": "OPERATOR",
                    "value": "-",
                    "whitespaceBefore": " ",
                  },
                  "type": "token",
                },
                Object {
                  "token": Object {
                    "text": "year",
                    "type": "IDENT",
                    "value": "year",
                    "whitespaceBefore": " ",
                  },
                  "type": "token",
                },
                Object {
                  "children": Array [
                    Object {
                      "token": Object {
                        "text": "CURRENT_DATE",
                        "type": "IDENT",
                        "value": "CURRENT_DATE",
                        "whitespaceBefore": "",
                      },
                      "type": "token",
                    },
                  ],
                  "closeParen": ")",
                  "hasWhitespaceBefore": false,
                  "openParen": "(",
                  "type": "parenthesis",
                },
              ],
              "closeParen": ")",
              "hasWhitespaceBefore": false,
              "openParen": "(",
              "type": "parenthesis",
            },
          ],
          "type": "statement",
        },
      ]
    `);
  });
});
