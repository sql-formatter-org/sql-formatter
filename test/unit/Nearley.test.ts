import Tokenizer from 'src/lexer/Tokenizer';
import { Parser, Grammar } from 'nearley';

import grammar from 'src/grammar/grammar';
import LexerAdapter from 'src/grammar/LexerAdapter';

describe('Nearley integration', () => {
  const parse = (sql: string) => {
    const tokenizer = new Tokenizer({
      reservedCommands: ['SELECT', 'FROM', 'WHERE', 'LIMIT', 'CREATE TABLE'],
      reservedDependentClauses: ['WHEN', 'ELSE'],
      reservedSetOperations: ['UNION'],
      reservedJoins: ['JOIN'],
      reservedFunctionNames: ['SQRT'],
      reservedKeywords: ['BETWEEN', 'LIKE', 'ON', 'USING'],
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

  it('parses empty list of tokens', () => {
    expect(parse('')).toEqual([]);
  });

  it('parses list of statements', () => {
    expect(parse('foo; bar')).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [
            Object {
              "token": Object {
                "raw": "foo",
                "text": "foo",
                "type": "IDENTIFIER",
              },
              "type": "token",
            },
          ],
          "hasSemicolon": true,
          "type": "statement",
        },
        Object {
          "children": Array [
            Object {
              "token": Object {
                "raw": "bar",
                "text": "bar",
                "type": "IDENTIFIER",
              },
              "type": "token",
            },
          ],
          "hasSemicolon": false,
          "type": "statement",
        },
      ]
    `);
  });

  it('parses array subscript', () => {
    expect(parse('SELECT my_array[5]')).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [
            Object {
              "children": Array [
                Object {
                  "arrayToken": Object {
                    "raw": "my_array",
                    "text": "my_array",
                    "type": "IDENTIFIER",
                  },
                  "parenthesis": Object {
                    "children": Array [
                      Object {
                        "token": Object {
                          "raw": "5",
                          "text": "5",
                          "type": "NUMBER",
                        },
                        "type": "token",
                      },
                    ],
                    "closeParen": "]",
                    "openParen": "[",
                    "type": "parenthesis",
                  },
                  "type": "array_subscript",
                },
              ],
              "nameToken": Object {
                "raw": "SELECT",
                "text": "SELECT",
                "type": "RESERVED_COMMAND",
              },
              "type": "clause",
            },
          ],
          "hasSemicolon": false,
          "type": "statement",
        },
      ]
    `);
  });

  it('parses parenthesized expressions', () => {
    expect(parse('SELECT (birth_year - (CURRENT_DATE + 1))')).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [
            Object {
              "children": Array [
                Object {
                  "children": Array [
                    Object {
                      "token": Object {
                        "raw": "birth_year",
                        "text": "birth_year",
                        "type": "IDENTIFIER",
                      },
                      "type": "token",
                    },
                    Object {
                      "token": Object {
                        "raw": "-",
                        "text": "-",
                        "type": "OPERATOR",
                      },
                      "type": "token",
                    },
                    Object {
                      "children": Array [
                        Object {
                          "token": Object {
                            "raw": "CURRENT_DATE",
                            "text": "CURRENT_DATE",
                            "type": "IDENTIFIER",
                          },
                          "type": "token",
                        },
                        Object {
                          "token": Object {
                            "raw": "+",
                            "text": "+",
                            "type": "OPERATOR",
                          },
                          "type": "token",
                        },
                        Object {
                          "token": Object {
                            "raw": "1",
                            "text": "1",
                            "type": "NUMBER",
                          },
                          "type": "token",
                        },
                      ],
                      "closeParen": ")",
                      "openParen": "(",
                      "type": "parenthesis",
                    },
                  ],
                  "closeParen": ")",
                  "openParen": "(",
                  "type": "parenthesis",
                },
              ],
              "nameToken": Object {
                "raw": "SELECT",
                "text": "SELECT",
                "type": "RESERVED_COMMAND",
              },
              "type": "clause",
            },
          ],
          "hasSemicolon": false,
          "type": "statement",
        },
      ]
    `);
  });

  it('parses function call', () => {
    expect(parse('SELECT sqrt(2)')).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [
            Object {
              "children": Array [
                Object {
                  "nameToken": Object {
                    "raw": "sqrt",
                    "text": "SQRT",
                    "type": "RESERVED_FUNCTION_NAME",
                  },
                  "parenthesis": Object {
                    "children": Array [
                      Object {
                        "token": Object {
                          "raw": "2",
                          "text": "2",
                          "type": "NUMBER",
                        },
                        "type": "token",
                      },
                    ],
                    "closeParen": ")",
                    "openParen": "(",
                    "type": "parenthesis",
                  },
                  "type": "function_call",
                },
              ],
              "nameToken": Object {
                "raw": "SELECT",
                "text": "SELECT",
                "type": "RESERVED_COMMAND",
              },
              "type": "clause",
            },
          ],
          "hasSemicolon": false,
          "type": "statement",
        },
      ]
    `);
  });
});
