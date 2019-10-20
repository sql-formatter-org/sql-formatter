import sqlFormatter from './../src/sqlFormatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

describe('N1qlFormatter', () => {
  behavesLikeSqlFormatter('n1ql');

  it('formats SELECT query with element selection expression', () => {
    const result = sqlFormatter.format('SELECT orderlines[0].productId FROM orders;', {
      language: 'n1ql'
    });
    expect(result).toBe('SELECT\n  orderlines[0].productId\nFROM\n  orders;');
  });

  it('formats SELECT query with primary key quering', () => {
    const result = sqlFormatter.format(
      "SELECT fname, email FROM tutorial USE KEYS ['dave', 'ian'];",
      { language: 'n1ql' }
    );
    expect(result).toBe(
      'SELECT\n' +
        '  fname,\n' +
        '  email\n' +
        'FROM\n' +
        '  tutorial\n' +
        'USE KEYS\n' +
        "  ['dave', 'ian'];"
    );
  });

  it('formats INSERT with {} object literal', () => {
    const result = sqlFormatter.format(
      "INSERT INTO heroes (KEY, VALUE) VALUES ('123', {'id':1,'type':'Tarzan'});",
      { language: 'n1ql' }
    );
    expect(result).toBe(
      'INSERT INTO\n' +
        '  heroes (KEY, VALUE)\n' +
        'VALUES\n' +
        "  ('123', {'id': 1, 'type': 'Tarzan'});"
    );
  });

  it('formats INSERT with large object and array literals', () => {
    const result = sqlFormatter.format(
      "INSERT INTO heroes (KEY, VALUE) VALUES ('123', {'id': 1, 'type': 'Tarzan', " +
        "'array': [123456789, 123456789, 123456789, 123456789, 123456789], 'hello': 'world'});",
      { language: 'n1ql' }
    );
    expect(result).toBe(
      'INSERT INTO\n' +
        '  heroes (KEY, VALUE)\n' +
        'VALUES\n' +
        '  (\n' +
        "    '123',\n" +
        '    {\n' +
        "      'id': 1,\n" +
        "      'type': 'Tarzan',\n" +
        "      'array': [\n" +
        '        123456789,\n' +
        '        123456789,\n' +
        '        123456789,\n' +
        '        123456789,\n' +
        '        123456789\n' +
        '      ],\n' +
        "      'hello': 'world'\n" +
        '    }\n' +
        '  );'
    );
  });

  it('formats SELECT query with UNNEST toplevel reserver word', () => {
    const result = sqlFormatter.format('SELECT * FROM tutorial UNNEST tutorial.children c;', {
      language: 'n1ql'
    });
    expect(result).toBe('SELECT\n  *\nFROM\n  tutorial\nUNNEST\n  tutorial.children c;');
  });

  it('formats SELECT query with NEST and USE KEYS', () => {
    const result = sqlFormatter.format(
      'SELECT * FROM usr ' +
        "USE KEYS 'Elinor_33313792' NEST orders_with_users orders " +
        'ON KEYS ARRAY s.order_id FOR s IN usr.shipped_order_history END;',
      { language: 'n1ql' }
    );
    expect(result).toBe(
      'SELECT\n' +
        '  *\n' +
        'FROM\n' +
        '  usr\n' +
        'USE KEYS\n' +
        "  'Elinor_33313792'\n" +
        'NEST\n' +
        '  orders_with_users orders ON KEYS ARRAY s.order_id FOR s IN usr.shipped_order_history END;'
    );
  });

  it('formats explained DELETE query with USE KEYS and RETURNING', () => {
    const result = sqlFormatter.format(
      "EXPLAIN DELETE FROM tutorial t USE KEYS 'baldwin' RETURNING t",
      { language: 'n1ql' }
    );
    expect(result).toBe("EXPLAIN DELETE FROM\n  tutorial t\nUSE KEYS\n  'baldwin' RETURNING t");
  });

  it('formats UPDATE query with USE KEYS and RETURNING', () => {
    const result = sqlFormatter.format(
      "UPDATE tutorial USE KEYS 'baldwin' SET type = 'actor' RETURNING tutorial.type",
      { language: 'n1ql' }
    );
    expect(result).toBe(
      'UPDATE\n' +
        '  tutorial\n' +
        'USE KEYS\n' +
        "  'baldwin'\n" +
        'SET\n' +
        "  type = 'actor' RETURNING tutorial.type"
    );
  });

  it('recognizes $variables', () => {
    const result = sqlFormatter.format(
      'SELECT $variable, $\'var name\', $"var name", $`var name`;',
      { language: 'n1ql' }
    );
    expect(result).toEqualMultiline(`
      SELECT
        $variable,
        $'var name',
        $"var name",
        $\`var name\`;
    `);
  });

  it('replaces $variables with param values', () => {
    const result = sqlFormatter.format(
      'SELECT $variable, $\'var name\', $"var name", $`var name`;',
      {
        language: 'n1ql',
        params: {
          variable: '"variable value"',
          'var name': "'var value'"
        }
      }
    );
    expect(result).toBe(
      'SELECT\n' +
        '  "variable value",\n' +
        "  'var value',\n" +
        "  'var value',\n" +
        "  'var value';"
    );
  });

  it('replaces $ numbered placeholders with param values', () => {
    const result = sqlFormatter.format('SELECT $1, $2, $0;', {
      language: 'n1ql',
      params: {
        0: 'first',
        1: 'second',
        2: 'third'
      }
    });
    expect(result).toBe('SELECT\n  second,\n  third,\n  first;');
  });
});
