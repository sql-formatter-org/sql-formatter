import sqlFormatter from './../src/sqlFormatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';
import dedent from 'dedent-js';

describe('StandardSqlFormatter', () => {
  behavesLikeSqlFormatter();

  const format = (query, cfg = {}) => sqlFormatter.format(query, { ...cfg, language: 'sql' });

  it('formats short CREATE TABLE', () => {
    expect(format('CREATE TABLE items (a INT PRIMARY KEY, b TEXT);')).toBe(
      'CREATE TABLE items (a INT PRIMARY KEY, b TEXT);'
    );
  });

  it('formats long CREATE TABLE', () => {
    expect(
      format('CREATE TABLE items (a INT PRIMARY KEY, b TEXT, c INT NOT NULL, d INT NOT NULL);')
    ).toBe(dedent`
      CREATE TABLE items (
        a INT PRIMARY KEY,
        b TEXT,
        c INT NOT NULL,
        d INT NOT NULL
      );
    `);
  });

  it('formats INSERT without INTO', () => {
    const result = format(
      "INSERT Customers (ID, MoneyBalance, Address, City) VALUES (12,-123.4, 'Skagen 2111','Stv');"
    );
    expect(result).toBe(dedent`
      INSERT
        Customers (ID, MoneyBalance, Address, City)
      VALUES
        (12, -123.4, 'Skagen 2111', 'Stv');
    `);
  });

  it('formats ALTER TABLE ... MODIFY query', () => {
    const result = format('ALTER TABLE supplier MODIFY supplier_name char(100) NOT NULL;');
    expect(result).toBe(dedent`
      ALTER TABLE
        supplier
      MODIFY
        supplier_name char(100) NOT NULL;
    `);
  });

  it('formats ALTER TABLE ... ALTER COLUMN query', () => {
    const result = format('ALTER TABLE supplier ALTER COLUMN supplier_name VARCHAR(100) NOT NULL;');
    expect(result).toBe(dedent`
      ALTER TABLE
        supplier
      ALTER COLUMN
        supplier_name VARCHAR(100) NOT NULL;
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
          'var\\name': `'var\\ value'`
        }
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
          '^*& weird " var   ': "'super weird value'"
        }
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
        2: 'third'
      }
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
      params: ['first', 'second', 'third']
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
      params: ['first', 'second', 'third']
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

  it('formats simple SELECT', () => {
    const result = format('SELECT N, M FROM t');
    expect(result).toBe(dedent`
      SELECT
        N,
        M
      FROM
        t
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

  it('formats CASE ... WHEN with a blank expression', () => {
    const result = format(
      "CASE WHEN option = 'foo' THEN 1 WHEN option = 'bar' THEN 2 WHEN option = 'baz' THEN 3 ELSE 4 END;"
    );

    expect(result).toBe(dedent`
      CASE
        WHEN option = 'foo' THEN 1
        WHEN option = 'bar' THEN 2
        WHEN option = 'baz' THEN 3
        ELSE 4
      END;
    `);
  });

  it('formats CASE ... WHEN inside SELECT', () => {
    const result = format(
      "SELECT foo, bar, CASE baz WHEN 'one' THEN 1 WHEN 'two' THEN 2 ELSE 3 END FROM table"
    );

    expect(result).toBe(dedent`
      SELECT
        foo,
        bar,
        CASE
          baz
          WHEN 'one' THEN 1
          WHEN 'two' THEN 2
          ELSE 3
        END
      FROM
        table
    `);
  });

  it('formats CASE ... WHEN with an expression', () => {
    const result = format(
      "CASE toString(getNumber()) WHEN 'one' THEN 1 WHEN 'two' THEN 2 WHEN 'three' THEN 3 ELSE 4 END;"
    );

    expect(result).toBe(dedent`
      CASE
        toString(getNumber())
        WHEN 'one' THEN 1
        WHEN 'two' THEN 2
        WHEN 'three' THEN 3
        ELSE 4
      END;
    `);
  });

  it('recognizes lowercase CASE ... END', () => {
    const result = format("case when option = 'foo' then 1 else 2 end;");

    expect(result).toBe(dedent`
      case
        when option = 'foo' then 1
        else 2
      end;
    `);
  });

  // Regression test for issue #43
  it('ignores words CASE and END inside other strings', () => {
    const result = format('SELECT CASEDATE, ENDDATE FROM table1;');

    expect(result).toBe(dedent`
      SELECT
        CASEDATE,
        ENDDATE
      FROM
        table1;
    `);
  });

  it('formats tricky line comments', () => {
    expect(format('SELECT a#comment, here\nFROM b--comment')).toBe(dedent`
      SELECT
        a #comment, here
      FROM
        b --comment
    `);
  });

  it('formats line comments followed by semicolon', () => {
    expect(
      format(`
      SELECT a FROM b
      --comment
      ;
    `)
    ).toBe(dedent`
      SELECT
        a
      FROM
        b --comment
      ;
    `);
  });

  it('formats line comments followed by comma', () => {
    expect(
      format(dedent`
      SELECT a --comment
      , b
    `)
    ).toBe(dedent`
      SELECT
        a --comment
      ,
        b
    `);
  });

  it('formats line comments followed by close-paren', () => {
    expect(format('SELECT ( a --comment\n )')).toBe(dedent`
      SELECT
        (a --comment
      )
    `);
  });

  it('formats line comments followed by open-paren', () => {
    expect(format('SELECT a --comment\n()')).toBe(dedent`
      SELECT
        a --comment
        ()
    `);
  });

  it('formats lonely semicolon', () => {
    expect(format(';')).toBe(';');
  });
});
