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
                "line": 0,
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
                    "col": 5,
                    "line": 1,
                    "raw": "tbl",
                    "start": 14,
                    "text": "tbl",
                    "type": "IDENTIFIER",
                  },
                  "type": "token",
                },
              ],
              "nameToken": Object {
                "col": 0,
                "line": 1,
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
                    "col": 6,
                    "line": 2,
                    "raw": "id",
                    "start": 24,
                    "text": "id",
                    "type": "IDENTIFIER",
                  },
                  "type": "token",
                },
                Object {
                  "token": Object {
                    "col": 9,
                    "line": 2,
                    "raw": "=",
                    "start": 27,
                    "text": "=",
                    "type": "OPERATOR",
                  },
                  "type": "token",
                },
                Object {
                  "token": Object {
                    "col": 11,
                    "line": 2,
                    "raw": "1",
                    "start": 29,
                    "text": "1",
                    "type": "NUMBER",
                  },
                  "type": "token",
                },
              ],
              "nameToken": Object {
                "col": 0,
                "line": 2,
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
});
