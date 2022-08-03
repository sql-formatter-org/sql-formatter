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
                "raw": "foo",
                "type": "IDENTIFIER",
                "value": "foo",
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
                "type": "IDENTIFIER",
                "value": "bar",
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
                    "raw": "SQRT",
                    "type": "RESERVED_FUNCTION_NAME",
                    "value": "SQRT",
                  },
                  "parenthesis": Object {
                    "children": Array [
                      Object {
                        "token": Object {
                          "raw": "2",
                          "type": "NUMBER",
                          "value": "2",
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
                "type": "RESERVED_COMMAND",
                "value": "SELECT",
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
                    "raw": "my_array",
                    "type": "IDENTIFIER",
                    "value": "my_array",
                  },
                  "parenthesis": Object {
                    "children": Array [
                      Object {
                        "nameToken": Object {
                          "raw": "OFFSET",
                          "type": "RESERVED_FUNCTION_NAME",
                          "value": "OFFSET",
                        },
                        "parenthesis": Object {
                          "children": Array [
                            Object {
                              "token": Object {
                                "raw": "5",
                                "type": "NUMBER",
                                "value": "5",
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
                "raw": "SELECT",
                "type": "RESERVED_COMMAND",
                "value": "SELECT",
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
                        "type": "IDENTIFIER",
                        "value": "birth_year",
                      },
                      "type": "token",
                    },
                    Object {
                      "token": Object {
                        "raw": "-",
                        "type": "OPERATOR",
                        "value": "-",
                      },
                      "type": "token",
                    },
                    Object {
                      "children": Array [
                        Object {
                          "token": Object {
                            "raw": "CURRENT_DATE",
                            "type": "IDENTIFIER",
                            "value": "CURRENT_DATE",
                          },
                          "type": "token",
                        },
                        Object {
                          "token": Object {
                            "raw": "+",
                            "type": "OPERATOR",
                            "value": "+",
                          },
                          "type": "token",
                        },
                        Object {
                          "token": Object {
                            "raw": "1",
                            "type": "NUMBER",
                            "value": "1",
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
                "type": "RESERVED_COMMAND",
                "value": "SELECT",
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
                    "raw": "age",
                    "type": "IDENTIFIER",
                    "value": "age",
                  },
                  "type": "token",
                },
                Object {
                  "andToken": Object {
                    "raw": "and",
                    "type": "RESERVED_LOGICAL_OPERATOR",
                    "value": "AND",
                  },
                  "betweenToken": Object {
                    "raw": "BETWEEN",
                    "type": "RESERVED_KEYWORD",
                    "value": "BETWEEN",
                  },
                  "expr1": Object {
                    "raw": "10",
                    "type": "NUMBER",
                    "value": "10",
                  },
                  "expr2": Object {
                    "raw": "15",
                    "type": "NUMBER",
                    "value": "15",
                  },
                  "type": "between_predicate",
                },
              ],
              "nameToken": Object {
                "raw": "WHERE",
                "type": "RESERVED_COMMAND",
                "value": "WHERE",
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
                    "raw": "10",
                    "type": "NUMBER",
                    "value": "10",
                  },
                  "type": "token",
                },
              ],
              "limitToken": Object {
                "raw": "LIMIT",
                "type": "RESERVED_COMMAND",
                "value": "LIMIT",
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
                    "raw": "10",
                    "type": "NUMBER",
                    "value": "10",
                  },
                  "type": "token",
                },
              ],
              "limitToken": Object {
                "raw": "LIMIT",
                "type": "RESERVED_COMMAND",
                "value": "LIMIT",
              },
              "offset": Array [
                Object {
                  "token": Object {
                    "raw": "200",
                    "type": "NUMBER",
                    "value": "200",
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
                "raw": "SELECT",
                "type": "RESERVED_COMMAND",
                "value": "SELECT",
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
                "raw": "SELECT DISTINCT",
                "type": "RESERVED_COMMAND",
                "value": "SELECT DISTINCT",
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
