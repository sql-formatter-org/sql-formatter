import { expect } from '@jest/globals';
import dedent from 'dedent-js';
import { IndentStyle } from '../../src/types';
import { FormatFn, SqlLanguage } from '../../src/sqlFormatter';

export default function supportsNewlineBeforeParen(language: SqlLanguage, format: FormatFn) {
  it('defaults to newline before opening and closing parenthesis', () => {
    const result = format('SELECT a FROM ( SELECT b FROM c );');
    expect(result).toBe(dedent`
      SELECT
        a
      FROM
        (
          SELECT
            b
          FROM
            c
        );
    `);
  });

  it('supports opening parenthesis on same line', () => {
    const result = format('SELECT a FROM ( SELECT b FROM c );', {
      newlineBeforeOpenParen: false,
    });
    expect(result).toBe(dedent`
      SELECT
        a
      FROM (
          SELECT
            b
          FROM
            c
        );
    `);
  });

  it('supports closing parenthesis on same line', () => {
    const result = format('SELECT a FROM ( SELECT b FROM c );', {
      newlineBeforeCloseParen: false,
    });
    expect(result).toBe(dedent`
      SELECT
        a
      FROM
        (
          SELECT
            b
          FROM
            c );
    `);
  });

  it('supports both opening and closing parenthesis on same line', () => {
    const result = format('SELECT a FROM ( SELECT b FROM c );', {
      newlineBeforeOpenParen: false,
      newlineBeforeCloseParen: false,
    });
    expect(result).toBe(dedent`
      SELECT
        a
      FROM (
          SELECT
            b
          FROM
            c );
    `);
  });

  it('does not effect function parenthesis', () => {
    const withNewlineOn = format(
      "SELECT COUNT(col1), REGEXP_REPLACE(col2, '(_+)(X_+)?', '<space>') FROM tbl;",
      {
        newlineBeforeOpenParen: true,
        newlineBeforeCloseParen: true,
      }
    );
    const withNewlineOff = format(
      "SELECT COUNT(col1), REGEXP_REPLACE(col2, '(_+)(X_+)?', '<space>') FROM tbl;",
      {
        newlineBeforeOpenParen: false,
        newlineBeforeCloseParen: false,
      }
    );
    expect(withNewlineOn).toBe(withNewlineOff);
    expect(withNewlineOn).toBe(dedent`
      SELECT
        COUNT(col1),
        REGEXP_REPLACE(col2, '(_+)(X_+)?', '<space>')
      FROM
        tbl;
    `);
  });

  // TODO: I think this is not as intended.
  it('has no effect when used together with indentStyle:tenSpaceLeft', () => {
    const withNewlineOn = format('SELECT a FROM ( SELECT b FROM c );', {
      newlineBeforeOpenParen: true,
      newlineBeforeCloseParen: true,
      indentStyle: IndentStyle.tenSpaceLeft,
    });
    const withNewlineOff = format('SELECT a FROM ( SELECT b FROM c );', {
      newlineBeforeOpenParen: false,
      newlineBeforeCloseParen: false,
      indentStyle: IndentStyle.tenSpaceLeft,
    });

    expect(withNewlineOn).toBe(withNewlineOff);
    expect(withNewlineOn).toBe(dedent`
    SELECT    a
    FROM      (
              SELECT    b
              FROM      c
              );
    `);
  });
}
