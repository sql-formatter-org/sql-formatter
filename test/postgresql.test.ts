import dedent from 'dedent-js';
import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';
import behavesLikePostgresqlFormatter from './behavesLikePostgresqlFormatter.js';
import supportsArrayLiterals from './features/arrayLiterals.js';
import supportsConstraints from './features/constraints.js';
import supportsCreateTable from './features/createTable.js';
import supportsCreateView from './features/createView.js';
import supportsDropTable from './features/dropTable.js';
import supportsIdentifiers from './features/identifiers.js';
import supportsIsDistinctFrom from './features/isDistinctFrom.js';
import supportsJoin from './features/join.js';
import supportsLimiting from './features/limiting.js';
import supportsOperators from './features/operators.js';
import supportsSchema from './features/schema.js';
import supportsSetOperations from './features/setOperations.js';
import supportsStrings from './features/strings.js';
import supportsTruncateTable from './features/truncateTable.js';
import supportsUpdate from './features/update.js';
import supportsDataTypeCase from './options/dataTypeCase.js';
import supportsParams from './options/param.js';

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
      // Custom operators: from PostGIS extension
      '&&&',
      '|=|',
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

  it('formats keywords in CREATE CONSTRAINT TRIGGER', () => {
    expect(
      format(
        `create constraint trigger Example_Trigger
        after insert
        or
        update of Column_A,
        Column_B on Example_Table
        deferrable initially deferred for each row
        execute procedure Example_Function ();`,
        { keywordCase: 'upper', identifierCase: 'lower' }
      )
    ).toBe(dedent`
      CREATE CONSTRAINT TRIGGER example_trigger
      AFTER INSERT
      OR
      UPDATE OF column_a,
      column_b ON example_table
      DEFERRABLE INITIALLY DEFERRED FOR EACH ROW
      EXECUTE PROCEDURE example_function ();
    `);
  });
});
