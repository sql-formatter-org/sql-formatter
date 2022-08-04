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

  it('trackes line and col position', () => {
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
                "col": 0,
                "index": 0,
                "line": 0,
                "raw": "SELECT",
                "text": "SELECT",
                "type": "RESERVED_COMMAND",
              },
              "type": "clause",
            },
            Object {
              "children": Array [
                Object {
                  "token": Object {
                    "col": 5,
                    "index": 14,
                    "line": 1,
                    "raw": "tbl",
                    "text": "tbl",
                    "type": "IDENTIFIER",
                  },
                  "type": "token",
                },
              ],
              "nameToken": Object {
                "col": 0,
                "index": 9,
                "line": 1,
                "raw": "FROM",
                "text": "FROM",
                "type": "RESERVED_COMMAND",
              },
              "type": "clause",
            },
            Object {
              "children": Array [
                Object {
                  "token": Object {
                    "col": 6,
                    "index": 24,
                    "line": 2,
                    "raw": "id",
                    "text": "id",
                    "type": "IDENTIFIER",
                  },
                  "type": "token",
                },
                Object {
                  "token": Object {
                    "col": 9,
                    "index": 27,
                    "line": 2,
                    "raw": "=",
                    "text": "=",
                    "type": "OPERATOR",
                  },
                  "type": "token",
                },
                Object {
                  "token": Object {
                    "col": 11,
                    "index": 29,
                    "line": 2,
                    "raw": "1",
                    "text": "1",
                    "type": "NUMBER",
                  },
                  "type": "token",
                },
              ],
              "nameToken": Object {
                "col": 0,
                "index": 18,
                "line": 2,
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
});
