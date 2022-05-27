import dedent from 'dedent-js';
import { format as originalFormat, FormatFn } from '../src/sqlFormatter';
import PlSqlFormatter from '../src/languages/plsql.formatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsAlterTable from './features/alterTable';
import supportsAlterTableModify from './features/alterTableModify';
import supportsBetween from './features/between';
import supportsCreateTable from './features/createTable';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';
import supportsReturning from './features/returning';
import supportsConstraints from './features/constraints';
import supportsDeleteFrom from './features/deleteFrom';
import supportsParams from './options/param';
import supportsComments from './features/comments';
import supportsIdentifiers from './features/identifiers';

describe('PlSqlFormatter', () => {
  const language = 'plsql';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format);
  supportsCreateTable(format);
  supportsConstraints(format);
  supportsAlterTable(format);
  supportsAlterTableModify(format);
  supportsDeleteFrom(format);
  supportsStrings(format, ["''", "N''"]);
  supportsIdentifiers(format, [`""`]);
  supportsBetween(format);
  supportsSchema(format);
  supportsOperators(format, PlSqlFormatter.operators, ['AND', 'OR', 'XOR']);
  supportsJoin(format);
  supportsReturning(format);
  supportsParams(format, { indexed: [':'], named: [':'] });

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

  it('recognizes _, $, # as part of identifiers', () => {
    const result = format('SELECT my_col$1#, col.a$, type#, procedure$, user# FROM tbl;');
    expect(result).toBe(dedent`
      SELECT
        my_col$1#,
        col.a$,
        type#,
        procedure$,
        user#
      FROM
        tbl;
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

  it('formats SELECT query with CROSS APPLY', () => {
    const result = format('SELECT a, b FROM t CROSS APPLY fn(t.id)');
    expect(result).toBe(dedent`
      SELECT
        a,
        b
      FROM
        t
      CROSS APPLY
      fn(t.id)
    `);
  });

  it('formats simple SELECT with national characters', () => {
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
      OUTER APPLY
      fn(t.id)
    `);
  });

  it('formats Oracle recursive sub queries', () => {
    const result = format(`
      WITH t1(id, parent_id) AS (
        -- Anchor member.
        SELECT
          id,
          parent_id
        FROM
          tab1
        WHERE
          parent_id IS NULL
        MINUS
          -- Recursive member.
        SELECT
          t2.id,
          t2.parent_id
        FROM
          tab1 t2,
          t1
        WHERE
          t2.parent_id = t1.id
      ) SEARCH BREADTH FIRST BY id SET order1,
      another AS (SELECT * FROM dual)
      SELECT id, parent_id FROM t1 ORDER BY order1;
    `);
    expect(result).toBe(dedent`
      WITH
        t1(id, parent_id) AS (
          -- Anchor member.
          SELECT
            id,
            parent_id
          FROM
            tab1
          WHERE
            parent_id IS NULL
          MINUS
          -- Recursive member.
          SELECT
            t2.id,
            t2.parent_id
          FROM
            tab1 t2,
            t1
          WHERE
            t2.parent_id = t1.id
        ) SEARCH BREADTH FIRST BY id SET order1,
        another AS (
          SELECT
            *
          FROM
            dual
        )
      SELECT
        id,
        parent_id
      FROM
        t1
      ORDER BY
        order1;
    `);
  });

  it('formats Oracle recursive sub queries regardless of capitalization', () => {
    const result = format(/* sql */ `
      WITH t1(id, parent_id) AS (
        -- Anchor member.
        SELECT
          id,
          parent_id
        FROM
          tab1
        WHERE
          parent_id IS NULL
        MINUS
          -- Recursive member.
        SELECT
          t2.id,
          t2.parent_id
        FROM
          tab1 t2,
          t1
        WHERE
          t2.parent_id = t1.id
      ) SEARCH BREADTH FIRST by id set order1,
      another AS (SELECT * FROM dual)
      SELECT id, parent_id FROM t1 ORDER BY order1;
    `);
    expect(result).toBe(dedent/* sql */ `
      WITH
        t1(id, parent_id) AS (
          -- Anchor member.
          SELECT
            id,
            parent_id
          FROM
            tab1
          WHERE
            parent_id IS NULL
          MINUS
          -- Recursive member.
          SELECT
            t2.id,
            t2.parent_id
          FROM
            tab1 t2,
            t1
          WHERE
            t2.parent_id = t1.id
        ) SEARCH BREADTH FIRST by id set order1,
        another AS (
          SELECT
            *
          FROM
            dual
        )
      SELECT
        id,
        parent_id
      FROM
        t1
      ORDER BY
        order1;
    `);
  });
});
