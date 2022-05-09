import dedent from 'dedent-js';
import { FormatFn, SqlLanguage } from '../../src/sqlFormatter';

export default function supportsTabulateAlias(language: SqlLanguage, format: FormatFn) {
  it('tabulates aliases which use AS keyword', () => {
    const result = format(
      'SELECT alpha AS alp, MAX(beta), epsilon AS E FROM ( SELECT mu AS m, iota AS io FROM gamma );',
      {
        tabulateAlias: true,
      }
    );
    expect(result).toBe(dedent`
      SELECT
        alpha     AS alp,
        MAX(beta),
        epsilon   AS E
      FROM
        (
          SELECT
            mu   AS m,
            iota AS io
          FROM
            gamma
        );
    `);
  });

  it('tabulates alias which do not use AS keyword', () => {
    const result = format(
      'SELECT alpha alp, MAX(beta), epsilon E FROM ( SELECT mu m, iota io FROM gamma );',
      {
        tabulateAlias: true,
      }
    );

    expect(result).toBe(dedent`
      SELECT
        alpha     alp,
        MAX(beta),
        epsilon   E
      FROM
        (
          SELECT
            mu   m,
            iota io
          FROM
            gamma
        );
    `);
  });

  it('tabulates aliases that sometimes use AS keyword', () => {
    const result = format(
      'SELECT alpha AS alp, MAX(beta), epsilon E FROM ( SELECT mu m, iota AS io FROM gamma );',
      {
        tabulateAlias: true,
      }
    );
    expect(result).toBe(dedent`
      SELECT
        alpha     AS alp,
        MAX(beta),
        epsilon   E
      FROM
        (
          SELECT
            mu   m,
            iota AS io
          FROM
            gamma
        );
    `);
  });

  it('does not tabulate table name aliases', () => {
    const result = format(
      'SELECT * FROM person_names AS names JOIN person_age_data AS ages JOIN (SELECT * FROM foo) AS f;',
      {
        tabulateAlias: true,
      }
    );
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        person_names AS names
        JOIN person_age_data AS ages
        JOIN (
          SELECT
            *
          FROM
            foo
        ) AS f;
    `);
  });

  it('does not tabulate aliases when multilineLists:never used', () => {
    const result = format(
      'SELECT alpha AS alp, MAX(beta), epsilon AS E FROM ( SELECT mu AS m, iota AS io FROM gamma );',
      { multilineLists: 'never', tabulateAlias: true }
    );

    expect(result).toBe(dedent`
      SELECT alpha AS alp, MAX(beta), epsilon AS E
      FROM (
          SELECT mu AS m, iota AS io
          FROM gamma
        );
    `);
  });

  it('works together with indentStyle:tabularLeft', () => {
    const result = format(
      dedent`SELECT alpha AS alp, MAX(beta), epsilon AS E FROM ( SELECT mu AS m, iota AS io FROM gamma );`,
      { indentStyle: 'tabularLeft', tabulateAlias: true }
    );

    expect(result).toBe(dedent`
      SELECT    alpha     AS alp,
                MAX(beta),
                epsilon   AS E
      FROM      (
                SELECT    mu   AS m,
                          iota AS io
                FROM      gamma
                );
    `);
  });

  it('works together with indentStyle:tabularRight', () => {
    const result = format(
      dedent`SELECT alpha AS alp, MAX(beta), epsilon AS E FROM ( SELECT mu AS m, iota AS io FROM gamma );`,
      { indentStyle: 'tabularRight', tabulateAlias: true }
    );

    expect(result).toBe(
      [
        '   SELECT alpha     AS alp,',
        '          MAX(beta),',
        '          epsilon   AS E',
        '     FROM (',
        '             SELECT mu   AS m,',
        '                    iota AS io',
        '               FROM gamma',
        '          );',
      ].join('\n')
    );
  });
}
