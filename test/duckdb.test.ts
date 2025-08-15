import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';

import behavesLikePostgresqlFormatter from './behavesLikePostgresqlFormatter.js';
import supportsCreateTable from './features/createTable.js';
import supportsDropTable from './features/dropTable.js';
import supportsJoin from './features/join.js';
import supportsOperators from './features/operators.js';
import supportsStrings from './features/strings.js';
import supportsIdentifiers from './features/identifiers.js';
import supportsParams from './options/param.js';
import supportsSetOperations from './features/setOperations.js';
import supportsLimiting from './features/limiting.js';
import supportsUpdate from './features/update.js';
import supportsCreateView from './features/createView.js';
import supportsArrayLiterals from './features/arrayLiterals.js';
import supportsTruncateTable from './features/truncateTable.js';

describe('DuckDBFormatter', () => {
  const language = 'duckdb';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikePostgresqlFormatter(format);
  supportsCreateView(format, { orReplace: true, ifNotExists: true });
  supportsCreateTable(format, { orReplace: true, ifNotExists: true });
  supportsDropTable(format, { ifExists: true });
  supportsArrayLiterals(format, { withoutArrayPrefix: true });
  supportsUpdate(format);
  supportsTruncateTable(format, { withTable: false, withoutTable: true });
  supportsStrings(format, ["''-qq", "X''", "B''", "E''", '$$']);
  supportsIdentifiers(format, [`""-qq`]);
  // Missing: '::' type cast (tested separately)
  supportsOperators(
    format,
    [
      // Arithmetic:
      '//',
      '%',
      '**',
      '^',
      '!',
      // Bitwise:
      '&',
      '|',
      '~',
      '<<',
      '>>',
      // Comparison:
      '==',
      // Lambda:
      '->',
      // JSON:
      '->>',
      // Named function params:
      ':=',
      '=>',
      // Pattern matching:
      '~~',
      '!~~',
      '~~*',
      '!~~*',
      '~~~',
      // Regular expressions:
      '~',
      '!~',
      '~*',
      '!~*',
      // String:
      '^@',
      '||',
      // INET extension:
      '>>=',
      '<<=',
    ],
    { logicalOperators: ['AND', 'OR', 'XOR'], any: true }
  );
  supportsJoin(format, {
    additionally: [
      'ASOF JOIN',
      'ASOF INNER JOIN',
      'ASOF LEFT JOIN',
      'ASOF LEFT OUTER JOIN',
      'ASOF RIGHT JOIN',
      'ASOF RIGHT OUTER JOIN',
      'ASOF FULL JOIN',
      'ASOF FULL OUTER JOIN',
      'POSITIONAL JOIN',
      'SEMI JOIN',
      'ANTI JOIN',
    ],
  });
  supportsSetOperations(format, [
    'UNION',
    'UNION ALL',
    'UNION BY NAME',
    'EXCEPT',
    'EXCEPT ALL',
    'INTERSECT',
    'INTERSECT ALL',
  ]);
  // TODO: named params $foo currently conflict with $$-quoted strings
  supportsParams(format, { positional: true, numbered: ['$'], quoted: ['$""'] });
  supportsLimiting(format, { limit: true, offset: true });

  it('formats prefix aliases', () => {
    expect(format("SELECT foo:10, bar:'hello';")).toBe(dedent`
      SELECT
        foo: 10,
        bar: 'hello';
    `);
  });

  it('formats {} struct literal (string keys)', () => {
    expect(format("SELECT {'id':1,'type':'Tarzan'} AS obj;")).toBe(dedent`
      SELECT
        {'id': 1, 'type': 'Tarzan'} AS obj;
    `);
  });

  it('formats {} struct literal (identifier keys)', () => {
    expect(format("SELECT {id:1,type:'Tarzan'} AS obj;")).toBe(dedent`
      SELECT
        {id: 1, type: 'Tarzan'} AS obj;
    `);
  });

  it('formats {} struct literal (quoted identifier keys)', () => {
    expect(format(`SELECT {"id":1,"type":'Tarzan'} AS obj;`)).toBe(dedent`
      SELECT
        {"id": 1, "type": 'Tarzan'} AS obj;
    `);
  });

  it('formats large struct and list literals', () => {
    const result = format(`
      INSERT INTO heroes (KEY, VALUE) VALUES ('123', {'id': 1, 'type': 'Tarzan',
      'array': [123456789, 123456789, 123456789, 123456789, 123456789], 'hello': 'world'});
    `);
    expect(result).toBe(dedent`
      INSERT INTO
        heroes (KEY, VALUE)
      VALUES
        (
          '123',
          {
            'id': 1,
            'type': 'Tarzan',
            'array': [
              123456789,
              123456789,
              123456789,
              123456789,
              123456789
            ],
            'hello': 'world'
          }
        );
    `);
  });

  // TODO: This currently conflicts with ":"-operator in struct literals
  it.skip('supports array slice operator', () => {
    expect(format('SELECT foo[:5], bar[1:], baz[1:5], zap[:];')).toBe(dedent`
      SELECT
        foo[:5],
        bar[1:],
        baz[1:5],
        zap[:];
    `);
  });

  // TODO: This currently conflicts with the modulo operator
  it.skip('formats percentage value in LIMIT clause', () => {
    expect(format('SELECT * FROM foo LIMIT 10%;')).toBe(dedent`
      SELECT
        *
      FROM
        foo
      LIMIT
        10%;
    `);
  });

  it('formats TIMESTAMP WITH TIME ZONE syntax', () => {
    expect(
      format(`
        CREATE TABLE time_table (id INT PRIMARY KEY NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE);`)
    ).toBe(dedent`
      CREATE TABLE time_table (
        id INT PRIMARY KEY NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE
      );
    `);
  });

  it('formats JSON data type', () => {
    expect(
      format(`CREATE TABLE foo (bar json, baz json);`, {
        dataTypeCase: 'upper',
      })
    ).toBe('CREATE TABLE foo (bar JSON, baz JSON);');
  });

  // Issue #872
  it('capitalizes IS NOT NULL', () => {
    expect(
      format(`SELECT 1 is not null;`, {
        keywordCase: 'upper',
      })
    ).toBe(dedent`
      SELECT
        1 IS NOT NULL;
    `);
  });

  it('supports underscore separators in numeric literals', () => {
    expect(format('SELECT 1_000_000, 3.14_159, 0x1A_2B_3C, 0b1010_0001, 1.5e+1_0;')).toBe(dedent`
      SELECT
        1_000_000,
        3.14_159,
        0x1A_2B_3C,
        0b1010_0001,
        1.5e+1_0;
    `);
  });
});
