import sqlFormatter from './../src/sqlFormatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

describe('Db2Formatter', () => {
  behavesLikeSqlFormatter('db2');

  it('formats FETCH FIRST like LIMIT', () => {
    expect(
      sqlFormatter.format('SELECT col1 FROM tbl ORDER BY col2 DESC FETCH FIRST 20 ROWS ONLY;', {
        language: 'db2'
      })
    ).toBe(
      'SELECT\n' +
        '  col1\n' +
        'FROM\n' +
        '  tbl\n' +
        'ORDER BY\n' +
        '  col2 DESC\n' +
        'FETCH FIRST\n' +
        '  20 ROWS ONLY;'
    );
  });

  it('formats only -- as a line comment', () => {
    const result = sqlFormatter.format('SELECT col FROM\n-- This is a comment\nMyTable;\n', {
      language: 'db2'
    });
    expect(result).toBe('SELECT\n  col\nFROM\n  -- This is a comment\n  MyTable;');
  });

  it('recognizes @ and # as part of identifiers', () => {
    const result = sqlFormatter.format('SELECT col#1, @col2 FROM tbl\n', { language: 'db2' });
    expect(result).toBe('SELECT\n  col#1,\n  @col2\nFROM\n  tbl');
  });

  it('recognizes :variables', () => {
    expect(sqlFormatter.format('SELECT :variable;', { language: 'db2' })).toBe(
      'SELECT\n  :variable;'
    );
  });

  it('replaces :variables with param values', () => {
    const result = sqlFormatter.format('SELECT :variable', {
      language: 'db2',
      params: { variable: '"variable value"' }
    });
    expect(result).toBe('SELECT\n  "variable value"');
  });
});
