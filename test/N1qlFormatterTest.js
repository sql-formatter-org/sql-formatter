import sqlFormatter from './../src/sqlFormatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';
import dedent from 'dedent-js';

describe('N1qlFormatter', () => {
    behavesLikeSqlFormatter('n1ql');

    const format = (query, cfg = {}) => sqlFormatter.format(query, { ...cfg, language: 'n1ql' });

    it('formats SELECT query with element selection expression', () => {
        const result = format('SELECT order_lines[0].productId FROM orders;');
        expect(result).toBe(dedent/* sql */ `
      SELECT
        order_lines[0].productId
      FROM
        orders;
    `);
    });

    it('formats SELECT query with primary key querying', () => {
        const result = format("SELECT fname, email FROM tutorial USE KEYS ['dave', 'ian'];");
        expect(result).toBe(dedent/* sql */ `
      SELECT
        fname,
        email
      FROM
        tutorial
      USE KEYS
        ['dave', 'ian'];
    `);
    });

    it('formats INSERT with {} object literal', () => {
        const result = format(
            "INSERT INTO heroes (KEY, VALUE) VALUES ('123', {'id':1,'type':'Tarzan'});"
        );
        expect(result).toBe(dedent/* sql */ `
      INSERT INTO
        heroes (KEY, VALUE)
      VALUES
        ('123', {'id': 1, 'type': 'Tarzan'});
    `);
    });

    it('formats INSERT with large object and array literals', () => {
        const result = format(`
      INSERT INTO heroes (KEY, VALUE) VALUES ('123', {'id': 1, 'type': 'Tarzan',
      'array': [123456789, 123456789, 123456789, 123456789, 123456789], 'hello': 'world'});
    `);
        expect(result).toBe(dedent/* sql */ `
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

    it('formats SELECT query with UNNEST top level reserver word', () => {
        const result = format('SELECT * FROM tutorial UNNEST tutorial.children c;');
        expect(result).toBe(dedent/* sql */ `
      SELECT
        *
      FROM
        tutorial
      UNNEST
        tutorial.children c;
    `);
    });

    it('formats SELECT query with NEST and USE KEYS', () => {
        const result = format(`
      SELECT * FROM usr
      USE KEYS 'Elinor_33313792' NEST orders_with_users orders
      ON KEYS ARRAY s.order_id FOR s IN usr.shipped_order_history END;
    `);
        expect(result).toBe(dedent/* sql */ `
      SELECT
        *
      FROM
        usr
      USE KEYS
        'Elinor_33313792'
      NEST
        orders_with_users orders ON KEYS ARRAY s.order_id FOR s IN usr.shipped_order_history END;
    `);
    });

    it('formats explained DELETE query with USE KEYS and RETURNING', () => {
        const result = format("EXPLAIN DELETE FROM tutorial t USE KEYS 'baldwin' RETURNING t");
        expect(result).toBe(dedent/* sql */ `
      EXPLAIN DELETE FROM
        tutorial t
      USE KEYS
        'baldwin' RETURNING t
    `);
    });

    it('formats UPDATE query with USE KEYS and RETURNING', () => {
        const result = format(
            "UPDATE tutorial USE KEYS 'baldwin' SET type = 'actor' RETURNING tutorial.type"
        );
        expect(result).toBe(dedent/* sql */ `
      UPDATE
        tutorial
      USE KEYS
        'baldwin'
      SET
        type = 'actor' RETURNING tutorial.type
    `);
    });

    it('recognizes $variables', () => {
        const result = format('SELECT $variable, $\'var name\', $"var name", $`var name`;');
        expect(result).toBe(dedent/* sql */ `
      SELECT
        $variable,
        $'var name',
        $"var name",
        $\`var name\`;
    `);
    });

    it('replaces $variables with param values', () => {
        const result = format('SELECT $variable, $\'var name\', $"var name", $`var name`;', {
            params: {
                variable: '"variable value"',
                'var name': "'var value'"
            }
        });
        expect(result).toBe(dedent/* sql */ `
      SELECT
        "variable value",
        'var value',
        'var value',
        'var value';
    `);
    });

    it('replaces $ numbered placeholders with param values', () => {
        const result = format('SELECT $1, $2, $0;', {
            params: {
                0: 'first',
                1: 'second',
                2: 'third'
            }
        });
        expect(result).toBe(dedent/* sql */ `
      SELECT
        second,
        third,
        first;
    `);
    });
});
