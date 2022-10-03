import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter.js';

import supportsBetween from './features/between.js';
import supportsJoin from './features/join.js';
import supportsOperators from './features/operators.js';
import supportsSchema from './features/schema.js';
import supportsStrings from './features/strings.js';
import supportsReturning from './features/returning.js';
import supportsDeleteFrom from './features/deleteFrom.js';
import supportsArrayAndMapAccessors from './features/arrayAndMapAccessors.js';
import supportsArrayLiterals from './features/arrayLiterals.js';
import supportsComments from './features/comments.js';
import supportsIdentifiers from './features/identifiers.js';
import supportsParams from './options/param.js';
import supportsWindow from './features/window.js';
import supportsSetOperations from './features/setOperations.js';
import supportsLimiting from './features/limiting.js';
import supportsInsertInto from './features/insertInto.js';
import supportsUpdate from './features/update.js';
import supportsMergeInto from './features/mergeInto.js';

describe('N1qlFormatter', () => {
  const language = 'n1ql';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format, { hashComments: true });
  supportsDeleteFrom(format);
  supportsStrings(format, [`""-bs`]);
  supportsIdentifiers(format, ['``']);
  supportsBetween(format);
  supportsSchema(format);
  supportsOperators(format, ['%', '==', '||'], ['AND', 'OR', 'XOR']);
  supportsArrayAndMapAccessors(format);
  supportsArrayLiterals(format);
  supportsJoin(format, { without: ['FULL', 'CROSS', 'NATURAL'], supportsUsing: false });
  supportsSetOperations(format, [
    'UNION',
    'UNION ALL',
    'EXCEPT',
    'EXCEPT ALL',
    'INTERSECT',
    'INTERSECT ALL',
  ]);
  supportsReturning(format);
  supportsParams(format, { positional: true, numbered: ['$'], named: ['$'] });
  supportsWindow(format);
  supportsLimiting(format, { limit: true, offset: true });
  supportsInsertInto(format);
  supportsUpdate(format);
  supportsMergeInto(format);

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
        orders_with_users orders ON KEYS ARRAY s.order_id FOR s IN usr.shipped_order_history END;
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
