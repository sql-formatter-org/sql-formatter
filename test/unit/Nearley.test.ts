import Tokenizer from 'src/core/Tokenizer';
import { Parser, Grammar } from 'nearley';

import grammar from 'src/grammar/grammar';
import LexerAdapter from 'src/grammar/LexerAdapter';

describe('Nearley integration', () => {
  const parse = (sql: string) => {
    const tokenizer = new Tokenizer({
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
                "text": "foo",
                "type": "IDENT",
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
                "type": "IDENT",
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

  it('parses parenthesized expressions', () => {
    expect(parse('SELECT (birth_year - (CURRENT_DATE + 1))')).toMatchInlineSnapshot(`
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
          "hasSemicolon": false,
          "type": "statement",
        },
      ]
    `);
  });
});
