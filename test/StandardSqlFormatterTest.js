import dedent from 'dedent-js';
import * as sqlFormatter from '../src/sqlFormatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';
import supportsCase from './features/case';
import supportsCreateTable from './features/createTable';
import supportsAlterTable from './features/alterTable';
import supportsAlterTableModify from './features/alterTableModify';
import supportsStrings from './features/strings';
import supportsBetween from './features/between';

describe('StandardSqlFormatter', () => {
  const format = (query, cfg = {}) => sqlFormatter.format(query, { ...cfg, language: 'sql' });

  behavesLikeSqlFormatter(format);
  supportsCase(format);
  supportsCreateTable(format);
  supportsAlterTable(format);
  supportsAlterTableModify(format);
  supportsStrings(format, ['""', "''", '``']);
  supportsBetween(format);

  it('formats INSERT without INTO', () => {
    const result = sqlFormatter.format(
      "INSERT Customers (ID, MoneyBalance, Address, City) VALUES (12,-123.4, 'Skagen 2111','Stv');"
    );
    expect(result).toBe(dedent`
      INSERT
        Customers (ID, MoneyBalance, Address, City)
      VALUES
        (12, -123.4, 'Skagen 2111', 'Stv');
    `);
  });

  it('recognizes [] strings', () => {
    expect(format('[foo JOIN bar]')).toBe('[foo JOIN bar]');
    expect(format('[foo ]] JOIN bar]')).toBe('[foo ]] JOIN bar]');
  });

  it('recognizes @variables', () => {
    const result = format(
      'SELECT @variable, @a1_2.3$, @\'var name\', @"var name", @`var name`, @[var name];'
    );
    expect(result).toBe(dedent`
      SELECT
        @variable,
        @a1_2.3$,
        @'var name',
        @"var name",
        @\`var name\`,
        @[var name];
    `);
  });

  it('replaces @variables with param values', () => {
    const result = format(
      "SELECT @variable, @a1_2.3$, @'var name', @\"var name\", @`var name`, @[var name], @'var\\name';",
      {
        params: {
          variable: '"variable value"',
          'a1_2.3$': "'weird value'",
          'var name': "'var value'",
          'var\\name': `'var\\ value'`,
        },
      }
    );
    expect(result).toBe(dedent`
      SELECT
        "variable value",
        'weird value',
        'var value',
        'var value',
        'var value',
        'var value',
        'var\\ value';
    `);
  });

  it('recognizes :variables', () => {
    const result = format(
      'SELECT :variable, :a1_2.3$, :\'var name\', :"var name", :`var name`, :[var name];'
    );
    expect(result).toBe(dedent`
      SELECT
        :variable,
        :a1_2.3$,
        :'var name',
        :"var name",
        :\`var name\`,
        :[var name];
    `);
  });

  it('replaces :variables with param values', () => {
    const result = format(
      'SELECT :variable, :a1_2.3$, :\'var name\', :"var name", :`var name`,' +
        " :[var name], :'escaped \\'var\\'', :\"^*& weird \\\" var   \";",
      {
        params: {
          variable: '"variable value"',
          'a1_2.3$': "'weird value'",
          'var name': "'var value'",
          "escaped 'var'": "'weirder value'",
          '^*& weird " var   ': "'super weird value'",
        },
      }
    );
    expect(result).toBe(dedent`
      SELECT
        "variable value",
        'weird value',
        'var value',
        'var value',
        'var value',
        'var value',
        'weirder value',
        'super weird value';
    `);
  });

  it('recognizes ?[0-9]* placeholders', () => {
    const result = format('SELECT ?1, ?25, ?;');
    expect(result).toBe(dedent`
      SELECT
        ?1,
        ?25,
        ?;
    `);
  });

  it('replaces ? numbered placeholders with param values', () => {
    const result = format('SELECT ?1, ?2, ?0;', {
      params: {
        0: 'first',
        1: 'second',
        2: 'third',
      },
    });
    expect(result).toBe(dedent`
      SELECT
        second,
        third,
        first;
    `);
  });

  it('replaces ? indexed placeholders with param values', () => {
    const result = format('SELECT ?, ?, ?;', {
      params: ['first', 'second', 'third'],
    });
    expect(result).toBe(dedent`
      SELECT
        first,
        second,
        third;
    `);
  });

  it('formats query with GO batch separator', () => {
    const result = format('SELECT 1 GO SELECT 2', {
      params: ['first', 'second', 'third'],
    });
    expect(result).toBe(dedent`
      SELECT
        1
      GO
      SELECT
        2
    `);
  });

  it('formats SELECT query with CROSS JOIN', () => {
    const result = format('SELECT a, b FROM t CROSS JOIN t2 on t.id = t2.id_t');
    expect(result).toBe(dedent`
      SELECT
        a,
        b
      FROM
        t
        CROSS JOIN t2 on t.id = t2.id_t
    `);
  });

  it('formats SELECT query with CROSS APPLY', () => {
    const result = format('SELECT a, b FROM t CROSS APPLY fn(t.id)');
    expect(result).toBe(dedent`
      SELECT
        a,
        b
      FROM
        t
        CROSS APPLY fn(t.id)
    `);
  });

  it('formats simple SELECT with national characters (MSSQL)', () => {
    const result = format("SELECT N'value'");
    expect(result).toBe(dedent`
      SELECT
        N'value'
    `);
  });

  it('formats SELECT query with OUTER APPLY', () => {
    const result = format('SELECT a, b FROM t OUTER APPLY fn(t.id)');
    expect(result).toBe(dedent`
      SELECT
        a,
        b
      FROM
        t
        OUTER APPLY fn(t.id)
    `);
  });

  it('formats FETCH FIRST like LIMIT', () => {
    const result = format('SELECT * FETCH FIRST 2 ROWS ONLY;');
    expect(result).toBe(dedent`
      SELECT
        *
      FETCH FIRST
        2 ROWS ONLY;
    `);
  });

  it('supports # comments', () => {
    expect(format('SELECT a # comment\nFROM b # comment')).toBe(dedent`
      SELECT
        a # comment
      FROM
        b # comment
    `);
  });
});
