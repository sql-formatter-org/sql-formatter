import dedent from 'dedent-js';
import Tokenizer from 'src/lexer/Tokenizer';
import Parser from 'src/parser/Parser';

describe('token positions', () => {
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

  it('tracks line and col position', () => {
    expect(
      parse(dedent`
        SELECT *
        FROM tbl
        WHERE id = 1;
      `)
    ).toMatchInlineSnapshot(`
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
                "col": 1,
                "end": 6,
                "line": 1,
                "raw": "SELECT",
                "start": 0,
                "text": "SELECT",
                "type": "RESERVED_COMMAND",
              },
              "type": "clause",
            },
            Object {
              "children": Array [
                Object {
                  "token": Object {
                    "col": 6,
                    "end": 17,
                    "line": 2,
                    "raw": "tbl",
                    "start": 14,
                    "text": "tbl",
                    "type": "IDENTIFIER",
                  },
                  "type": "token",
                },
              ],
              "nameToken": Object {
                "col": 1,
                "end": 13,
                "line": 2,
                "raw": "FROM",
                "start": 9,
                "text": "FROM",
                "type": "RESERVED_COMMAND",
              },
              "type": "clause",
            },
            Object {
              "children": Array [
                Object {
                  "token": Object {
                    "col": 7,
                    "end": 26,
                    "line": 3,
                    "raw": "id",
                    "start": 24,
                    "text": "id",
                    "type": "IDENTIFIER",
                  },
                  "type": "token",
                },
                Object {
                  "token": Object {
                    "col": 10,
                    "end": 28,
                    "line": 3,
                    "raw": "=",
                    "start": 27,
                    "text": "=",
                    "type": "OPERATOR",
                  },
                  "type": "token",
                },
                Object {
                  "token": Object {
                    "col": 12,
                    "end": 30,
                    "line": 3,
                    "raw": "1",
                    "start": 29,
                    "text": "1",
                    "type": "NUMBER",
                  },
                  "type": "token",
                },
              ],
              "nameToken": Object {
                "col": 1,
                "end": 23,
                "line": 3,
                "raw": "WHERE",
                "start": 18,
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

  it('tracks position for multi-line tokens, like block comments', () => {
    expect(
      parse(dedent`
        SELECT *
        /* TEST
          COMMENT
        */ FROM tbl
        WHERE id = 1;
      `)
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [
            Object {
              "children": Array [
                Object {
                  "type": "all_columns_asterisk",
                },
                Object {
                  "token": Object {
                    "col": 1,
                    "end": 29,
                    "line": 2,
                    "raw": "/* TEST
        COMMENT
      */",
                    "start": 9,
                    "text": "/* TEST
        COMMENT
      */",
                    "type": "BLOCK_COMMENT",
                  },
                  "type": "token",
                },
              ],
              "nameToken": Object {
                "col": 1,
                "end": 6,
                "line": 1,
                "raw": "SELECT",
                "start": 0,
                "text": "SELECT",
                "type": "RESERVED_COMMAND",
              },
              "type": "clause",
            },
            Object {
              "children": Array [
                Object {
                  "token": Object {
                    "col": 9,
                    "end": 38,
                    "line": 4,
                    "raw": "tbl",
                    "start": 35,
                    "text": "tbl",
                    "type": "IDENTIFIER",
                  },
                  "type": "token",
                },
              ],
              "nameToken": Object {
                "col": 4,
                "end": 34,
                "line": 4,
                "raw": "FROM",
                "start": 30,
                "text": "FROM",
                "type": "RESERVED_COMMAND",
              },
              "type": "clause",
            },
            Object {
              "children": Array [
                Object {
                  "token": Object {
                    "col": 7,
                    "end": 47,
                    "line": 5,
                    "raw": "id",
                    "start": 45,
                    "text": "id",
                    "type": "IDENTIFIER",
                  },
                  "type": "token",
                },
                Object {
                  "token": Object {
                    "col": 10,
                    "end": 49,
                    "line": 5,
                    "raw": "=",
                    "start": 48,
                    "text": "=",
                    "type": "OPERATOR",
                  },
                  "type": "token",
                },
                Object {
                  "token": Object {
                    "col": 12,
                    "end": 51,
                    "line": 5,
                    "raw": "1",
                    "start": 50,
                    "text": "1",
                    "type": "NUMBER",
                  },
                  "type": "token",
                },
              ],
              "nameToken": Object {
                "col": 1,
                "end": 44,
                "line": 5,
                "raw": "WHERE",
                "start": 39,
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
});
