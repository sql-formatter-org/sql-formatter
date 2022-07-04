import Parser from 'src/core/Parser';
import Tokenizer from 'src/lexer/Tokenizer';

describe('Parser', () => {
  const parse = (sql: string) => {
    const tokens = new Tokenizer({
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
                "type": "IDENTIFIER",
                "value": "foo",
                "whitespaceBefore": "",
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
                "text": "bar",
                "type": "IDENTIFIER",
                "value": "bar",
                "whitespaceBefore": " ",
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

  it('parses function call', () => {
    expect(parse('SELECT SQRT(2)')).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [
            Object {
              "children": Array [
                Object {
                  "nameToken": Object {
                    "text": "SQRT",
                    "type": "RESERVED_KEYWORD",
                    "value": "SQRT",
                    "whitespaceBefore": " ",
                  },
                  "parenthesis": Object {
                    "children": Array [
                      Object {
                        "token": Object {
                          "text": "2",
                          "type": "NUMBER",
                          "value": "2",
                          "whitespaceBefore": "",
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
                "text": "SELECT",
                "type": "RESERVED_COMMAND",
                "value": "SELECT",
                "whitespaceBefore": "",
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

  it('parses array subscript', () => {
    expect(parse('SELECT my_array[OFFSET(5)]')).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [
            Object {
              "children": Array [
                Object {
                  "arrayToken": Object {
                    "text": "my_array",
                    "type": "IDENTIFIER",
                    "value": "my_array",
                    "whitespaceBefore": " ",
                  },
                  "parenthesis": Object {
                    "children": Array [
                      Object {
                        "nameToken": Object {
                          "text": "OFFSET",
                          "type": "IDENTIFIER",
                          "value": "OFFSET",
                          "whitespaceBefore": "",
                        },
                        "parenthesis": Object {
                          "children": Array [
                            Object {
                              "token": Object {
                                "text": "5",
                                "type": "NUMBER",
                                "value": "5",
                                "whitespaceBefore": "",
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
                    "closeParen": "]",
                    "openParen": "[",
                    "type": "parenthesis",
                  },
                  "type": "array_subscript",
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
                        "text": "birth_year",
                        "type": "IDENTIFIER",
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
                      "children": Array [
                        Object {
                          "token": Object {
                            "text": "CURRENT_DATE",
                            "type": "IDENTIFIER",
                            "value": "CURRENT_DATE",
                            "whitespaceBefore": "",
                          },
                          "type": "token",
                        },
                        Object {
                          "token": Object {
                            "text": "+",
                            "type": "OPERATOR",
                            "value": "+",
                            "whitespaceBefore": " ",
                          },
                          "type": "token",
                        },
                        Object {
                          "token": Object {
                            "text": "1",
                            "type": "NUMBER",
                            "value": "1",
                            "whitespaceBefore": " ",
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
                "text": "SELECT",
                "type": "RESERVED_COMMAND",
                "value": "SELECT",
                "whitespaceBefore": "",
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

  it('parses BETWEEN expression', () => {
    expect(parse('WHERE age BETWEEN 10 and 15;')).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [
            Object {
              "children": Array [
                Object {
                  "token": Object {
                    "text": "age",
                    "type": "IDENTIFIER",
                    "value": "age",
                    "whitespaceBefore": " ",
                  },
                  "type": "token",
                },
                Object {
                  "andToken": Object {
                    "text": "and",
                    "type": "RESERVED_LOGICAL_OPERATOR",
                    "value": "AND",
                    "whitespaceBefore": " ",
                  },
                  "betweenToken": Object {
                    "text": "BETWEEN",
                    "type": "RESERVED_KEYWORD",
                    "value": "BETWEEN",
                    "whitespaceBefore": " ",
                  },
                  "expr1": Object {
                    "text": "10",
                    "type": "NUMBER",
                    "value": "10",
                    "whitespaceBefore": " ",
                  },
                  "expr2": Object {
                    "text": "15",
                    "type": "NUMBER",
                    "value": "15",
                    "whitespaceBefore": " ",
                  },
                  "type": "between_predicate",
                },
              ],
              "nameToken": Object {
                "text": "WHERE",
                "type": "RESERVED_COMMAND",
                "value": "WHERE",
                "whitespaceBefore": "",
              },
              "type": "clause",
            },
          ],
          "hasSemicolon": true,
          "type": "statement",
        },
      ]
    `);
  });

  it('parses LIMIT clause', () => {
    expect(parse('LIMIT 10')).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [
            Object {
              "countToken": Object {
                "text": "10",
                "type": "NUMBER",
                "value": "10",
                "whitespaceBefore": " ",
              },
              "limitToken": Object {
                "text": "LIMIT",
                "type": "RESERVED_COMMAND",
                "value": "LIMIT",
                "whitespaceBefore": "",
              },
              "type": "limit_clause",
            },
          ],
          "hasSemicolon": false,
          "type": "statement",
        },
      ]
    `);
  });

  it('parses LIMIT clause with offset', () => {
    expect(parse('LIMIT 200, 10')).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [
            Object {
              "countToken": Object {
                "text": "10",
                "type": "NUMBER",
                "value": "10",
                "whitespaceBefore": " ",
              },
              "limitToken": Object {
                "text": "LIMIT",
                "type": "RESERVED_COMMAND",
                "value": "LIMIT",
                "whitespaceBefore": "",
              },
              "offsetToken": Object {
                "text": "200",
                "type": "NUMBER",
                "value": "200",
                "whitespaceBefore": " ",
              },
              "type": "limit_clause",
            },
          ],
          "hasSemicolon": false,
          "type": "statement",
        },
      ]
    `);
  });

  it('parses SELECT *', () => {
    expect(parse('SELECT *')).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [
            Object {
              "children": Array [
                Object {
                  "type": "all_columns_asterisk",
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
          ],
          "hasSemicolon": false,
          "type": "statement",
        },
      ]
    `);
  });
});
