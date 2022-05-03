import { expect } from '@jest/globals';
import dedent from 'dedent-js';
import { KeywordMode } from '../../src/types';

export default function supportsNewlineBeforeParen(language, format) {
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

  // TODO: I think this is not as intended.
  it('has no effect when used together with keywordPosition:tenSpaceLeft', () => {
    const withNewlineOn = format('SELECT a FROM ( SELECT b FROM c );', {
      newlineBeforeOpenParen: true,
      newlineBeforeCloseParen: true,
      keywordPosition: KeywordMode.tenSpaceLeft,
    });
    const withNewlineOff = format('SELECT a FROM ( SELECT b FROM c );', {
      newlineBeforeOpenParen: false,
      newlineBeforeCloseParen: false,
      keywordPosition: KeywordMode.tenSpaceLeft,
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
