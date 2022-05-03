import dedent from 'dedent-js';
import { KeywordMode, NewlineMode } from '../../src/types';

export default function supportsTabulateAlias(language, format) {
  it('tabulates aliases which use AS keyword', () => {
    const result = format(
      'SELECT alpha AS A, MAX(beta), epsilon AS E FROM ( SELECT mu AS m, iota AS i FROM gamma );',
      {
        tabulateAlias: true,
      }
    );
    expect(result).toBe(dedent`
      SELECT
        alpha     AS A,
        MAX(beta),
        epsilon   AS E
      FROM
      (
        SELECT
          mu   AS m,
          iota AS i
        FROM
          gamma
      );
    `);
  });

  it('tabulates alias which do not use AS keyword', () => {
    const result = format(
      'SELECT alpha A, MAX(beta), epsilon E FROM ( SELECT mu m, iota i FROM gamma );',
      {
        tabulateAlias: true,
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

  it('does not tabulate aliases when newline:never used', () => {
    const result = format(
      'SELECT alpha AS A, MAX(beta), epsilon AS E FROM ( SELECT mu AS m, iota AS i FROM gamma );',
      { newline: NewlineMode.never, tabulateAlias: true }
    );

    expect(result).toBe(dedent`
      SELECT alpha AS A, MAX(beta), epsilon AS E
      FROM (
        SELECT mu AS m, iota AS i
        FROM gamma
      );
    `);
  });

  it('works together with keywordPosition:tenSpaceLeft', () => {
    const result = format(
      dedent`SELECT alpha AS A, MAX(beta), epsilon AS E FROM ( SELECT mu AS m, iota AS i FROM gamma );`,
      { keywordPosition: KeywordMode.tenSpaceLeft, tabulateAlias: true }
    );

    expect(result).toBe(dedent`
      SELECT    alpha     AS A,
                MAX(beta),
                epsilon   AS E
      FROM      (
                SELECT    mu   AS m,
                          iota AS i
                FROM      gamma
                );
    `);
  });

  it('works together with keywordPosition:tenSpaceRight', () => {
    const result = format(
      dedent`SELECT alpha AS A, MAX(beta), epsilon AS E FROM ( SELECT mu AS m, iota AS i FROM gamma );`,
      { keywordPosition: KeywordMode.tenSpaceRight, tabulateAlias: true }
    );

    expect(result).toBe(
      [
        '   SELECT alpha     AS A,',
        '          MAX(beta),',
        '          epsilon   AS E',
        '     FROM (',
        '             SELECT mu   AS m,',
        '                    iota AS i',
        '               FROM gamma',
        '          );',
      ].join('\n')
    );
  });
}
