import Parser from 'src/parser/Parser';
import Tokenizer from 'src/lexer/Tokenizer';

describe('Parser', () => {
  const parse = (sql: string) => {
    const tokens = new Tokenizer({
      reservedCommands: ['SELECT', 'SELECT DISTINCT', 'FROM', 'WHERE', 'LIMIT', 'CREATE TABLE'],
      reservedDependentClauses: ['WHEN', 'ELSE'],
      reservedSetOperations: ['UNION'],
      reservedJoins: ['JOIN'],
      reservedKeywords: ['BETWEEN', 'LIKE', 'ON', 'USING'],
      reservedFunctionNames: ['SQRT', 'OFFSET'],
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
                "col": 0,
                "index": 0,
                "line": 0,
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
                "col": 5,
                "index": 5,
                "line": 0,
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

  it('parses function call', () => {
    expect(parse('SELECT SQRT(2)')).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [
            Object {
              "children": Array [
                Object {
                  "nameToken": Object {
                    "col": 7,
                    "index": 7,
                    "line": 0,
                    "raw": "SQRT",
                    "text": "SQRT",
                    "type": "RESERVED_FUNCTION_NAME",
                  },
                  "parenthesis": Object {
                    "children": Array [
                      Object {
                        "token": Object {
                          "col": 12,
                          "index": 12,
                          "line": 0,
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
                "col": 0,
                "index": 0,
                "line": 0,
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

  it('parses array subscript', () => {
    expect(parse('SELECT my_array[OFFSET(5)]')).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [
            Object {
              "children": Array [
                Object {
                  "arrayToken": Object {
                    "col": 7,
                    "index": 7,
                    "line": 0,
                    "raw": "my_array",
                    "text": "my_array",
                    "type": "IDENTIFIER",
                  },
                  "parenthesis": Object {
                    "children": Array [
                      Object {
                        "nameToken": Object {
                          "col": 16,
                          "index": 16,
                          "line": 0,
                          "raw": "OFFSET",
                          "text": "OFFSET",
                          "type": "RESERVED_FUNCTION_NAME",
                        },
                        "parenthesis": Object {
                          "children": Array [
                            Object {
                              "token": Object {
                                "col": 23,
                                "index": 23,
                                "line": 0,
                                "raw": "5",
                                "text": "5",
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
                    "closeParen": "]",
                    "openParen": "[",
                    "type": "parenthesis",
                  },
                  "type": "array_subscript",
                },
              ],
              "nameToken": Object {
                "col": 0,
                "index": 0,
                "line": 0,
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
                        "col": 8,
                        "index": 8,
                        "line": 0,
                        "raw": "birth_year",
                        "text": "birth_year",
                        "type": "IDENTIFIER",
                      },
                      "type": "token",
                    },
                    Object {
                      "token": Object {
                        "col": 19,
                        "index": 19,
                        "line": 0,
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
                            "col": 22,
                            "index": 22,
                            "line": 0,
                            "raw": "CURRENT_DATE",
                            "text": "CURRENT_DATE",
                            "type": "IDENTIFIER",
                          },
                          "type": "token",
                        },
                        Object {
                          "token": Object {
                            "col": 35,
                            "index": 35,
                            "line": 0,
                            "raw": "+",
                            "text": "+",
                            "type": "OPERATOR",
                          },
                          "type": "token",
                        },
                        Object {
                          "token": Object {
                            "col": 37,
                            "index": 37,
                            "line": 0,
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
                "col": 0,
                "index": 0,
                "line": 0,
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

  it('parses BETWEEN expression', () => {
    expect(parse('WHERE age BETWEEN 10 and 15;')).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [
            Object {
              "children": Array [
                Object {
                  "token": Object {
                    "col": 6,
                    "index": 6,
                    "line": 0,
                    "raw": "age",
                    "text": "age",
                    "type": "IDENTIFIER",
                  },
                  "type": "token",
                },
                Object {
                  "andToken": Object {
                    "col": 21,
                    "index": 21,
                    "line": 0,
                    "raw": "and",
                    "text": "AND",
                    "type": "RESERVED_LOGICAL_OPERATOR",
                  },
                  "betweenToken": Object {
                    "col": 10,
                    "index": 10,
                    "line": 0,
                    "raw": "BETWEEN",
                    "text": "BETWEEN",
                    "type": "RESERVED_KEYWORD",
                  },
                  "expr1": Object {
                    "col": 18,
                    "index": 18,
                    "line": 0,
                    "raw": "10",
                    "text": "10",
                    "type": "NUMBER",
                  },
                  "expr2": Object {
                    "col": 25,
                    "index": 25,
                    "line": 0,
                    "raw": "15",
                    "text": "15",
                    "type": "NUMBER",
                  },
                  "type": "between_predicate",
                },
              ],
              "nameToken": Object {
                "col": 0,
                "index": 0,
                "line": 0,
                "raw": "WHERE",
                "text": "WHERE",
                "type": "RESERVED_COMMAND",
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
              "count": Array [
                Object {
                  "token": Object {
                    "col": 6,
                    "index": 6,
                    "line": 0,
                    "raw": "10",
                    "text": "10",
                    "type": "NUMBER",
                  },
                  "type": "token",
                },
              ],
              "limitToken": Object {
                "col": 0,
                "index": 0,
                "line": 0,
                "raw": "LIMIT",
                "text": "LIMIT",
                "type": "RESERVED_COMMAND",
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
              "count": Array [
                Object {
                  "token": Object {
                    "col": 11,
                    "index": 11,
                    "line": 0,
                    "raw": "10",
                    "text": "10",
                    "type": "NUMBER",
                  },
                  "type": "token",
                },
              ],
              "limitToken": Object {
                "col": 0,
                "index": 0,
                "line": 0,
                "raw": "LIMIT",
                "text": "LIMIT",
                "type": "RESERVED_COMMAND",
              },
              "offset": Array [
                Object {
                  "token": Object {
                    "col": 6,
                    "index": 6,
                    "line": 0,
                    "raw": "200",
                    "text": "200",
                    "type": "NUMBER",
                  },
                  "type": "token",
                },
              ],
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
                "col": 0,
                "index": 0,
                "line": 0,
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

  it('parses SELECT DISTINCT *', () => {
    expect(parse('SELECT DISTINCT *')).toMatchInlineSnapshot(`
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
                "col": 0,
                "index": 0,
                "line": 0,
                "raw": "SELECT DISTINCT",
                "text": "SELECT DISTINCT",
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
