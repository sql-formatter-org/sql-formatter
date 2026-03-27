import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';

import supportsCreateTable from './features/createTable.js';
import supportsDropTable from './features/dropTable.js';
import supportsJoin from './features/join.js';
import supportsOperators from './features/operators.js';
import supportsSchema from './features/schema.js';
import supportsStrings from './features/strings.js';
import supportsConstraints from './features/constraints.js';
import supportsIdentifiers from './features/identifiers.js';
import supportsParams from './options/param.js';
import supportsSetOperations from './features/setOperations.js';
import supportsLimiting from './features/limiting.js';
import supportsUpdate from './features/update.js';
import supportsTruncateTable from './features/truncateTable.js';
import supportsCreateView from './features/createView.js';
import supportsIsDistinctFrom from './features/isDistinctFrom.js';
import supportsArrayLiterals from './features/arrayLiterals.js';
import supportsDataTypeCase from './options/dataTypeCase.js';
import behavesLikePostgresqlFormatter from './behavesLikePostgresqlFormatter.js';

describe('PostgreSqlFormatter', () => {
  const language = 'postgresql';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikePostgresqlFormatter(format);
  supportsCreateView(format, { orReplace: true, materialized: true, ifNotExists: true });
  supportsCreateTable(format, { ifNotExists: true });
  supportsDropTable(format, { ifExists: true });
  supportsConstraints(format, ['NO ACTION', 'RESTRICT', 'CASCADE', 'SET NULL', 'SET DEFAULT']);
  supportsArrayLiterals(format, { withArrayPrefix: true });
  supportsUpdate(format, { whereCurrentOf: true });
  supportsTruncateTable(format, { withoutTable: true });
  supportsStrings(format, ["''-qq", "U&''", "X''", "B''", "E''", '$$']);
  supportsIdentifiers(format, [`""-qq`, 'U&""']);
  supportsSchema(format);
  // Missing: '::' type cast (tested separately)
  supportsOperators(
    format,
    [
      // Arithmetic
      '%',
      '^',
      '|/',
      '||/',
      '@',
      // Assignment
      ':=',
      // Bitwise
      '&',
      '|',
      '#',
      '~',
      '<<',
      '>>',
      // Byte comparison
      '~>~',
      '~<~',
      '~>=~',
      '~<=~',
      // Geometric
      '@-@',
      '@@',
      '##',
      '<->',
      '&&',
      '&&&',
      '&<',
      '&>',
      '<<|',
      '&<|',
      '|>>',
      '|&>',
      '<^',
      '>^',
      '?#',
      '?-',
      '?|',
      '?-|',
      '?||',
      '@>',
      '<@',
      '<@>',
      '~=',
      // PostGIS
      '|=|',
      // JSON
      '?',
      '@?',
      '?&',
      '->',
      '->>',
      '#>',
      '#>>',
      '#-',
      // Named function params
      '=>',
      // Network address
      '>>=',
      '<<=',
      // Pattern matching
      '~~',
      '~~*',
      '!~~',
      '!~~*',
      // POSIX RegExp
      '~',
      '~*',
      '!~',
      '!~*',
      // Range/multirange
      '-|-',
      // String concatenation
      '||',
      // Text search
      '@@@',
      '!!',
      '^@',
      // Trigram/trigraph
      '<%',
      '<<%',
      '%>',
      '%>>',
      '<<->',
      '<->>',
      '<<<->',
      '<->>>',
      // Cube
      '~>',
      // Hstore
      '#=',
      // Custom operators: from pgvector extension
      '<#>',
      '<=>',
      '<+>',
      '<~>',
      '<%>',
    ],
    { any: true }
  );
  supportsIsDistinctFrom(format);
  supportsJoin(format);
  supportsSetOperations(format);
  supportsParams(format, { numbered: ['$'] });
  supportsLimiting(format, { limit: true, offset: true, fetchFirst: true, fetchNext: true });
  supportsDataTypeCase(format);

  // Regression test for issue #624
  it('supports array slice operator', () => {
    expect(format('SELECT foo[:5], bar[1:], baz[1:5], zap[:];')).toBe(dedent`
      SELECT
        foo[:5],
        bar[1:],
        baz[1:5],
        zap[:];
    `);
  });

  // Regression test for issue #447
  it('formats empty SELECT', () => {
    expect(format('SELECT;')).toBe(dedent`
      SELECT;
    `);
  });

  // Regression test for issues #391 and #618
  // PostgreSQL-specific variations of WITH TIME ZONE syntax
  it('formats TIMESTAMP WITH TIME ZONE syntax', () => {
    expect(
      format(
        `create table time_table (id int,
          created_at timestamp without time zone,
          deleted_at time with time zone,
          modified_at timestamp(0) with time zone);`,
        { dataTypeCase: 'upper' }
      )
    ).toBe(dedent`
      create table time_table (
        id INT,
        created_at TIMESTAMP WITHOUT TIME ZONE,
        deleted_at TIME WITH TIME ZONE,
        modified_at TIMESTAMP(0) WITH TIME ZONE
      );
    `);
  });

  it('formats FOR UPDATE clause', () => {
    expect(
      format(`
        SELECT * FROM tbl FOR UPDATE;
        SELECT * FROM tbl FOR UPDATE OF tbl.salary;
      `)
    ).toBe(dedent`
      SELECT
        *
      FROM
        tbl
      FOR UPDATE;

      SELECT
        *
      FROM
        tbl
      FOR UPDATE OF
        tbl.salary;
    `);
  });

  // Issue #711
  it('supports OPERATOR() syntax', () => {
    expect(format(`SELECT foo OPERATOR(public.===) bar;`)).toBe(dedent`
      SELECT
        foo OPERATOR(public.===) bar;
    `);
    expect(format(`SELECT foo operator ( !== ) bar;`)).toBe(dedent`
      SELECT
        foo operator ( !== ) bar;
    `);
  });

  // Issue #813
  it('supports OR REPLACE in CREATE FUNCTION', () => {
    expect(format(`CREATE OR REPLACE FUNCTION foo ();`)).toBe(dedent`
      CREATE OR REPLACE FUNCTION foo ();
    `);
  });

  it('formats JSON and JSONB data types', () => {
    expect(
      format(`CREATE TABLE foo (bar json, baz jsonb);`, {
        dataTypeCase: 'upper',
      })
    ).toBe('CREATE TABLE foo (bar JSON, baz JSONB);');
  });

  // Issue #850
  it('supports OR REPLACE in CREATE PROCEDURE', () => {
    expect(format(`CREATE OR REPLACE PROCEDURE foo () LANGUAGE sql AS $$ BEGIN END $$;`)).toBe(
      dedent`CREATE OR REPLACE PROCEDURE foo () LANGUAGE sql AS $$ BEGIN END $$;`
    );
  });

  // Issue #876
  it('supports UUID type and functions', () => {
    expect(
      format(`CREATE TABLE foo (id uuid DEFAULT Gen_Random_Uuid());`, {
        dataTypeCase: 'upper',
        functionCase: 'lower',
      })
    ).toBe(dedent`CREATE TABLE foo (id UUID DEFAULT gen_random_uuid());`);
  });

  // Issue #924
  it('formats keywords in COMMENT ON', () => {
    expect(format(`comment on table foo is 'Hello my table';`, { keywordCase: 'upper' })).toBe(
      dedent`COMMENT ON TABLE foo IS 'Hello my table';`
    );
  });

  // Tests for PostgreSQL containment and full-text search operators
  describe('containment and search operators', () => {
    it('formats @> (contains) operator in WHERE clause', () => {
      expect(format(`SELECT * FROM foo WHERE bar @> '{1,2}';`)).toBe(dedent`
        SELECT
          *
        FROM
          foo
        WHERE
          bar @> '{1,2}';
      `);
    });

    it('formats <@ (contained by) operator in WHERE clause', () => {
      expect(format(`SELECT * FROM foo WHERE bar <@ '{1,2,3}';`)).toBe(dedent`
        SELECT
          *
        FROM
          foo
        WHERE
          bar <@ '{1,2,3}';
      `);
    });

    // https://www.postgresql.org/docs/current/earthdistance.html
    it('formats <@> (distance) operator in ORDER BY clause', () => {
      expect(format(`SELECT * FROM foo ORDER BY bar <@> point(1,2);`)).toBe(dedent`
        SELECT
          *
        FROM
          foo
        ORDER BY
          bar <@> point(1, 2);
      `);
    });

    it('formats @> operator with JSONB data', () => {
      expect(format(`SELECT * FROM foo WHERE data @> '{"key": "value"}';`)).toBe(dedent`
        SELECT
          *
        FROM
          foo
        WHERE
          data @> '{"key": "value"}';
      `);
    });

    it('formats <@ operator with JSONB data', () => {
      expect(format(`SELECT * FROM foo WHERE data <@ '{"key": "value", "other": 1}';`)).toBe(dedent`
        SELECT
          *
        FROM
          foo
        WHERE
          data <@ '{"key": "value", "other": 1}';
      `);
    });
  });

  // Tests for PostGIS operators
  describe('PostGIS operators', () => {
    // https://postgis.net/docs/geometry_overlaps_nd.html
    it('formats &&& (3D bounding box overlap) operator', () => {
      expect(format(`SELECT * FROM foo WHERE geom_a &&& geom_b;`)).toBe(dedent`
        SELECT
          *
        FROM
          foo
        WHERE
          geom_a &&& geom_b;
      `);
    });

    // https://postgis.net/docs/geometry_distance_cpa.html
    it('formats |=| (closest point of approach distance) operator', () => {
      expect(format(`SELECT * FROM foo ORDER BY traj_a |=| traj_b;`)).toBe(dedent`
        SELECT
          *
        FROM
          foo
        ORDER BY
          traj_a |=| traj_b;
      `);
    });
  });

  // https://www.postgresql.org/docs/current/functions-geometry.html
  // Note: the formatter defines ^> but PostgreSQL docs say the operator is >^
  describe('geometric operator correctness', () => {
    it('formats >^ (is above) operator', () => {
      expect(format(`SELECT * FROM foo WHERE point(1,2) >^ point(3,4);`)).toBe(dedent`
        SELECT
          *
        FROM
          foo
        WHERE
          point(1, 2) >^ point(3, 4);
      `);
    });
  });

  // Tests for extension operators (hstore, cube, ltree)
  describe('extension operators', () => {
    // https://www.postgresql.org/docs/current/cube.html
    it('formats ~> (cube coordinate extraction) operator', () => {
      expect(format(`SELECT c ~> 1 FROM foo;`)).toBe(dedent`
        SELECT
          c ~> 1
        FROM
          foo;
      `);
    });

    // https://www.postgresql.org/docs/current/hstore.html
    it('formats #= (hstore replace fields) operator', () => {
      expect(format(`SELECT row #= hstore_data FROM foo;`)).toBe(dedent`
        SELECT
          row #= hstore_data
        FROM
          foo;
      `);
    });
  });
});
