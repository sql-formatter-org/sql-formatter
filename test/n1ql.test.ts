import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from 'src/sqlFormatter';
import N1qlFormatter from 'src/languages/n1ql.formatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsBetween from './features/between';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';
import supportsReturning from './features/returning';
import supportsDeleteFrom from './features/deleteFrom';
import supportsArray from './features/array';
import supportsComments from './features/comments';
import supportsIdentifiers from './features/identifiers';
import supportsParams from './options/param';

describe('N1qlFormatter', () => {
  const language = 'n1ql';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format, { hashComments: true });
  supportsDeleteFrom(format);
  supportsStrings(format, [`""`]);
  supportsIdentifiers(format, ['``']);
  supportsBetween(format);
  supportsSchema(format);
  supportsOperators(format, N1qlFormatter.operators, ['AND', 'OR', 'XOR']);
  supportsArray(format);
  supportsJoin(format, { without: ['FULL', 'CROSS', 'NATURAL'] });
  supportsReturning(format);
  supportsParams(format, { positional: true, numbered: ['$'], named: ['$'] });

  it('formats SELECT query with primary key querying', () => {
    const result = format("SELECT fname, email FROM tutorial USE KEYS ['dave', 'ian'];");
    expect(result).toBe(dedent`
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
    expect(result).toBe(dedent`
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

  it('formats SELECT query with UNNEST top level reserver word', () => {
    const result = format('SELECT * FROM tutorial UNNEST tutorial.children c;');
    expect(result).toBe(dedent`
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
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        usr
      USE KEYS
        'Elinor_33313792'
      NEST
        orders_with_users orders ON KEYS ARRAY s.order_id FOR s IN usr.shipped_order_history
      END;
    `);
  });

  it('formats explained DELETE query with USE KEYS', () => {
    const result = format("EXPLAIN DELETE FROM tutorial t USE KEYS 'baldwin'");
    expect(result).toBe(dedent`
      EXPLAIN
      DELETE FROM
        tutorial t
      USE KEYS
        'baldwin'
    `);
  });

  it('formats UPDATE query with USE KEYS', () => {
    const result = format("UPDATE tutorial USE KEYS 'baldwin' SET type = 'actor'");
    expect(result).toBe(dedent`
      UPDATE
        tutorial
      USE KEYS
        'baldwin'
      SET
        type = 'actor'
    `);
  });
});
