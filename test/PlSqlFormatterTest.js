import sqlFormatter from './../src/sqlFormatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';
import dedent from 'dedent';

describe('PlSqlFormatter', () => {
  behavesLikeSqlFormatter('pl/sql');

  const format = (query, cfg = {}) => sqlFormatter.format(query, { ...cfg, language: 'pl/sql' });

  it('formats FETCH FIRST like LIMIT', () => {
    expect(format('SELECT col1 FROM tbl ORDER BY col2 DESC FETCH FIRST 20 ROWS ONLY;')).toBe(dedent`
      SELECT
        col1
      FROM
        tbl
      ORDER BY
        col2 DESC
      FETCH FIRST
        20 ROWS ONLY;
    `);
  });

  it('formats only -- as a line comment', () => {
    const result = format('SELECT col FROM\n-- This is a comment\nMyTable;\n');
    expect(result).toBe(dedent`
      SELECT
        col
      FROM
        -- This is a comment
        MyTable;
    `);
  });

  it('recognizes _, $, #, . and @ as part of identifiers', () => {
    const result = format('SELECT my_col$1#, col.2@ FROM tbl\n');
    expect(result).toBe(dedent`
      SELECT
        my_col$1#,
        col.2@
      FROM
        tbl
    `);
  });

  it('formats short CREATE TABLE', () => {
    expect(format('CREATE TABLE items (a INT PRIMARY KEY, b TEXT);')).toBe(
      'CREATE TABLE items (a INT PRIMARY KEY, b TEXT);'
    );
  });

  it('formats long CREATE TABLE', () => {
    expect(
      format('CREATE TABLE items (a INT PRIMARY KEY, b TEXT, c INT NOT NULL, d INT NOT NULL);')
    ).toBe(
      'CREATE TABLE items (\n' +
        '  a INT PRIMARY KEY,\n' +
        '  b TEXT,\n' +
        '  c INT NOT NULL,\n' +
        '  d INT NOT NULL\n' +
        ');'
    );
  });

  it('formats INSERT without INTO', () => {
    const result = format(
      "INSERT Customers (ID, MoneyBalance, Address, City) VALUES (12,-123.4, 'Skagen 2111','Stv');"
    );
    expect(result).toBe(
      'INSERT\n' +
        '  Customers (ID, MoneyBalance, Address, City)\n' +
        'VALUES\n' +
        "  (12, -123.4, 'Skagen 2111', 'Stv');"
    );
  });

  it('formats ALTER TABLE ... MODIFY query', () => {
    const result = format('ALTER TABLE supplier MODIFY supplier_name char(100) NOT NULL;');
    expect(result).toBe('ALTER TABLE\n  supplier\nMODIFY\n  supplier_name char(100) NOT NULL;');
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

  it('recognizes ?[0-9]* placeholders', () => {
    const result = format('SELECT ?1, ?25, ?;');
    expect(result).toBe('SELECT\n  ?1,\n  ?25,\n  ?;');
  });

  it('replaces ? numbered placeholders with param values', () => {
    const result = format('SELECT ?1, ?2, ?0;', {
      params: {
        0: 'first',
        1: 'second',
        2: 'third'
      }
    });
    expect(result).toBe('SELECT\n  second,\n  third,\n  first;');
  });

  it('replaces ? indexed placeholders with param values', () => {
    const result = format('SELECT ?, ?, ?;', {
      params: ['first', 'second', 'third']
    });
    expect(result).toBe('SELECT\n  first,\n  second,\n  third;');
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
    expect(result).toBe('SELECT\n  a,\n  b\nFROM\n  t\n  CROSS APPLY fn(t.id)');
  });

  it('formats simple SELECT', () => {
    const result = format('SELECT N, M FROM t');
    expect(result).toBe('SELECT\n  N,\n  M\nFROM\n  t');
  });

  it('formats simple SELECT with national characters', () => {
    const result = format("SELECT N'value'");
    expect(result).toBe("SELECT\n  N'value'");
  });

  it('formats SELECT query with OUTER APPLY', () => {
    const result = format('SELECT a, b FROM t OUTER APPLY fn(t.id)');
    expect(result).toBe('SELECT\n  a,\n  b\nFROM\n  t\n  OUTER APPLY fn(t.id)');
  });

  it('formats CASE ... WHEN with a blank expression', () => {
    const result = format(
      "CASE WHEN option = 'foo' THEN 1 WHEN option = 'bar' THEN 2 WHEN option = 'baz' THEN 3 ELSE 4 END;"
    );

    expect(result).toBe(
      'CASE\n' +
        "  WHEN option = 'foo' THEN 1\n" +
        "  WHEN option = 'bar' THEN 2\n" +
        "  WHEN option = 'baz' THEN 3\n" +
        '  ELSE 4\n' +
        'END;'
    );
  });

  it('formats CASE ... WHEN inside SELECT', () => {
    const result = format(
      "SELECT foo, bar, CASE baz WHEN 'one' THEN 1 WHEN 'two' THEN 2 ELSE 3 END FROM table"
    );

    expect(result).toBe(
      'SELECT\n' +
        '  foo,\n' +
        '  bar,\n' +
        '  CASE\n' +
        '    baz\n' +
        "    WHEN 'one' THEN 1\n" +
        "    WHEN 'two' THEN 2\n" +
        '    ELSE 3\n' +
        '  END\n' +
        'FROM\n' +
        '  table'
    );
  });

  it('formats CASE ... WHEN with an expression', () => {
    const result = format(
      "CASE toString(getNumber()) WHEN 'one' THEN 1 WHEN 'two' THEN 2 WHEN 'three' THEN 3 ELSE 4 END;"
    );

    expect(result).toBe(
      'CASE\n' +
        '  toString(getNumber())\n' +
        "  WHEN 'one' THEN 1\n" +
        "  WHEN 'two' THEN 2\n" +
        "  WHEN 'three' THEN 3\n" +
        '  ELSE 4\n' +
        'END;'
    );
  });
});
