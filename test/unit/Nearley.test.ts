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

    const lexer = new LexerAdapter(chunk => tokenizer.tokenize(chunk, {}));
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
                "end": 3,
                "precedingWhitespace": undefined,
                "raw": "foo",
                "start": 0,
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
                "end": 8,
                "precedingWhitespace": " ",
                "raw": "bar",
                "start": 5,
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
                    "end": 15,
                    "precedingWhitespace": " ",
                    "raw": "my_array",
                    "start": 7,
                    "text": "my_array",
                    "type": "IDENTIFIER",
                  },
                  "parenthesis": Object {
                    "children": Array [
                      Object {
                        "token": Object {
                          "end": 17,
                          "precedingWhitespace": undefined,
                          "raw": "5",
                          "start": 16,
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
                "end": 6,
                "precedingWhitespace": undefined,
                "raw": "SELECT",
                "start": 0,
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
                        "end": 18,
                        "precedingWhitespace": undefined,
                        "raw": "birth_year",
                        "start": 8,
                        "text": "birth_year",
                        "type": "IDENTIFIER",
                      },
                      "type": "token",
                    },
                    Object {
                      "token": Object {
                        "end": 20,
                        "precedingWhitespace": " ",
                        "raw": "-",
                        "start": 19,
                        "text": "-",
                        "type": "OPERATOR",
                      },
                      "type": "token",
                    },
                    Object {
                      "children": Array [
                        Object {
                          "token": Object {
                            "end": 34,
                            "precedingWhitespace": undefined,
                            "raw": "CURRENT_DATE",
                            "start": 22,
                            "text": "CURRENT_DATE",
                            "type": "IDENTIFIER",
                          },
                          "type": "token",
                        },
                        Object {
                          "token": Object {
                            "end": 36,
                            "precedingWhitespace": " ",
                            "raw": "+",
                            "start": 35,
                            "text": "+",
                            "type": "OPERATOR",
                          },
                          "type": "token",
                        },
                        Object {
                          "token": Object {
                            "end": 38,
                            "precedingWhitespace": " ",
                            "raw": "1",
                            "start": 37,
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
                "end": 6,
                "precedingWhitespace": undefined,
                "raw": "SELECT",
                "start": 0,
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
                    "end": 11,
                    "precedingWhitespace": " ",
                    "raw": "sqrt",
                    "start": 7,
                    "text": "SQRT",
                    "type": "RESERVED_FUNCTION_NAME",
                  },
                  "parenthesis": Object {
                    "children": Array [
                      Object {
                        "token": Object {
                          "end": 13,
                          "precedingWhitespace": undefined,
                          "raw": "2",
                          "start": 12,
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
                "end": 6,
                "precedingWhitespace": undefined,
                "raw": "SELECT",
                "start": 0,
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

  it('parses LIMIT clause with count', () => {
    expect(parse('LIMIT 15;')).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [
            Object {
              "count": Array [
                Object {
                  "token": Object {
                    "end": 8,
                    "precedingWhitespace": " ",
                    "raw": "15",
                    "start": 6,
                    "text": "15",
                    "type": "NUMBER",
                  },
                  "type": "token",
                },
              ],
              "limitToken": Object {
                "end": 5,
                "precedingWhitespace": undefined,
                "raw": "LIMIT",
                "start": 0,
                "text": "LIMIT",
                "type": "LIMIT",
              },
              "type": "limit_clause",
            },
          ],
          "hasSemicolon": true,
          "type": "statement",
        },
      ]
    `);
  });

  it('parses LIMIT clause with offset and count', () => {
    expect(parse('LIMIT 100, 15;')).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [
            Object {
              "count": Array [
                Object {
                  "token": Object {
                    "end": 13,
                    "precedingWhitespace": " ",
                    "raw": "15",
                    "start": 11,
                    "text": "15",
                    "type": "NUMBER",
                  },
                  "type": "token",
                },
              ],
              "limitToken": Object {
                "end": 5,
                "precedingWhitespace": undefined,
                "raw": "LIMIT",
                "start": 0,
                "text": "LIMIT",
                "type": "LIMIT",
              },
              "offset": Array [
                Object {
                  "token": Object {
                    "end": 9,
                    "precedingWhitespace": " ",
                    "raw": "100",
                    "start": 6,
                    "text": "100",
                    "type": "NUMBER",
                  },
                  "type": "token",
                },
              ],
              "type": "limit_clause",
            },
          ],
          "hasSemicolon": true,
          "type": "statement",
        },
      ]
    `);
  });
});
