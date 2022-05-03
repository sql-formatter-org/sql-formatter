import dedent from 'dedent-js';
import { AliasMode, KeywordMode, NewlineMode } from '../../src/types';

export default function supportsTabulateAlias(language, format) {
  it('tabulates alias with aliasAs on', () => {
    const result = format(
      'SELECT alpha AS A, MAX(beta), epsilon E FROM ( SELECT mu AS m, iota i FROM gamma );',
      {
        aliasAs: AliasMode.always,
        tabulateAlias: true,
      }
    );
    expect(result).toBe(dedent`
      SELECT
        alpha     AS A,
        MAX(beta),
        epsilon   as E
      FROM
      (
        SELECT
          mu   AS m,
          iota as i
        FROM
          gamma
      );
    `);
  });

  it('tabulates alias with aliasAs off', () => {
    const result = format(
      'SELECT alpha AS A, MAX(beta), epsilon E FROM ( SELECT mu AS m, iota i FROM gamma );',
      {
        tabulateAlias: true,
        aliasAs: AliasMode.never,
      }
    );

    expect(result).toBe(dedent`
      SELECT
        alpha     A,
        MAX(beta),
        epsilon   E
      FROM
      (
        SELECT
          mu   m,
          iota i
        FROM
          gamma
      );
    `);
  });

  it('handles edge case of newline.never', () => {
    const result = format(
      dedent`SELECT alpha AS A, MAX(beta), epsilon E FROM ( SELECT mu AS m, iota i FROM gamma );`,
      { newline: NewlineMode.never, aliasAs: AliasMode.always, tabulateAlias: true }
    );

    expect(result).toBe(dedent`
      SELECT alpha AS A, MAX(beta), epsilon as E
      FROM (
        SELECT mu AS m, iota as i
        FROM gamma
      );
    `);
  });

  it('handles edge case of tenSpaceLeft', () => {
    const result = format(
      dedent`SELECT alpha AS A, MAX(beta), epsilon E FROM ( SELECT mu AS m, iota i FROM gamma );`,
      { keywordPosition: KeywordMode.tenSpaceLeft, aliasAs: AliasMode.always, tabulateAlias: true }
    );

    expect(result).toBe(dedent`
      SELECT    alpha     AS A,
                MAX(beta),
                epsilon   as E
      FROM      (
                SELECT    mu   AS m,
                          iota as i
                FROM      gamma
                );
    `);
  });

  it('handles edge case of tenSpaceRight', () => {
    const result = format(
      dedent`SELECT alpha AS A, MAX(beta), epsilon E FROM ( SELECT mu AS m, iota i FROM gamma );`,
      { keywordPosition: KeywordMode.tenSpaceRight, aliasAs: AliasMode.always, tabulateAlias: true }
    );

    expect(result).toBe(
      [
        '   SELECT alpha     AS A,',
        '          MAX(beta),',
        '          epsilon   as E',
        '     FROM (',
        '             SELECT mu   AS m,',
        '                    iota as i',
        '               FROM gamma',
        '          );',
      ].join('\n')
    );
  });
}
