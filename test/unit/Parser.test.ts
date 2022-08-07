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
                "line": 0,
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
                "col": 5,
                "line": 0,
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
                    "line": 0,
                    "raw": "SQRT",
                    "start": 7,
                    "text": "SQRT",
                    "type": "RESERVED_FUNCTION_NAME",
                  },
                  "parenthesis": Object {
                    "children": Array [
                      Object {
                        "token": Object {
                          "col": 12,
                          "line": 0,
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
                "col": 0,
                "line": 0,
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
                    "line": 0,
                    "raw": "my_array",
                    "start": 7,
                    "text": "my_array",
                    "type": "IDENTIFIER",
                  },
                  "parenthesis": Object {
                    "children": Array [
                      Object {
                        "nameToken": Object {
                          "col": 16,
                          "line": 0,
                          "raw": "OFFSET",
                          "start": 16,
                          "text": "OFFSET",
                          "type": "RESERVED_FUNCTION_NAME",
                        },
                        "parenthesis": Object {
                          "children": Array [
                            Object {
                              "token": Object {
                                "col": 23,
                                "line": 0,
                                "raw": "5",
                                "start": 23,
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
                "line": 0,
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
                        "col": 8,
                        "line": 0,
                        "raw": "birth_year",
                        "start": 8,
                        "text": "birth_year",
                        "type": "IDENTIFIER",
                      },
                      "type": "token",
                    },
                    Object {
                      "token": Object {
                        "col": 19,
                        "line": 0,
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
                            "col": 22,
                            "line": 0,
                            "raw": "CURRENT_DATE",
                            "start": 22,
                            "text": "CURRENT_DATE",
                            "type": "IDENTIFIER",
                          },
                          "type": "token",
                        },
                        Object {
                          "token": Object {
                            "col": 35,
                            "line": 0,
                            "raw": "+",
                            "start": 35,
                            "text": "+",
                            "type": "OPERATOR",
                          },
                          "type": "token",
                        },
                        Object {
                          "token": Object {
                            "col": 37,
                            "line": 0,
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
                "col": 0,
                "line": 0,
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
                    "line": 0,
                    "raw": "age",
                    "start": 6,
                    "text": "age",
                    "type": "IDENTIFIER",
                  },
                  "type": "token",
                },
                Object {
                  "andToken": Object {
                    "col": 21,
                    "line": 0,
                    "raw": "and",
                    "start": 21,
                    "text": "AND",
                    "type": "RESERVED_LOGICAL_OPERATOR",
                  },
                  "betweenToken": Object {
                    "col": 10,
                    "line": 0,
                    "raw": "BETWEEN",
                    "start": 10,
                    "text": "BETWEEN",
                    "type": "RESERVED_KEYWORD",
                  },
                  "expr1": Object {
                    "col": 18,
                    "line": 0,
                    "raw": "10",
                    "start": 18,
                    "text": "10",
                    "type": "NUMBER",
                  },
                  "expr2": Object {
                    "col": 25,
                    "line": 0,
                    "raw": "15",
                    "start": 25,
                    "text": "15",
                    "type": "NUMBER",
                  },
                  "type": "between_predicate",
                },
              ],
              "nameToken": Object {
                "col": 0,
                "line": 0,
                "raw": "WHERE",
                "start": 0,
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
                    "line": 0,
                    "raw": "10",
                    "start": 6,
                    "text": "10",
                    "type": "NUMBER",
                  },
                  "type": "token",
                },
              ],
              "limitToken": Object {
                "col": 0,
                "line": 0,
                "raw": "LIMIT",
                "start": 0,
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
                    "line": 0,
                    "raw": "10",
                    "start": 11,
                    "text": "10",
                    "type": "NUMBER",
                  },
                  "type": "token",
                },
              ],
              "limitToken": Object {
                "col": 0,
                "line": 0,
                "raw": "LIMIT",
                "start": 0,
                "text": "LIMIT",
                "type": "RESERVED_COMMAND",
              },
              "offset": Array [
                Object {
                  "token": Object {
                    "col": 6,
                    "line": 0,
                    "raw": "200",
                    "start": 6,
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
                "line": 0,
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
                "line": 0,
                "raw": "SELECT DISTINCT",
                "start": 0,
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
