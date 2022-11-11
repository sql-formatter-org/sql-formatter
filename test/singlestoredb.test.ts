import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';
import behavesLikeMariaDbFormatter from './behavesLikeMariaDbFormatter.js';

import supportsJoin from './features/join.js';
import supportsOperators from './features/operators.js';
import supportsSetOperations from './features/setOperations.js';
import supportsLimiting from './features/limiting.js';
import supportsCreateTable from './features/createTable.js';
import supportsCreateView from './features/createView.js';
import supportsAlterTable from './features/alterTable.js';
import supportsStrings from './features/strings.js';
import dedent from 'dedent-js';

describe('SingleStoreDbFormatter', () => {
  const language = 'singlestoredb';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeMariaDbFormatter(format);

  // in addition to string types listed in behavesLikeMariaDbFormatter
  supportsStrings(format, ["B''"]);

  supportsJoin(format, {
    without: ['NATURAL INNER JOIN', 'NATURAL FULL', 'NATURAL JOIN'],
    additionally: ['STRAIGHT_JOIN'],
  });
  supportsSetOperations(format, [
    'UNION',
    'UNION ALL',
    'UNION DISTINCT',
    'EXCEPT',
    'INTERSECT',
    'MINUS',
  ]);
  supportsOperators(
    format,
    [':=', '&', '|', '^', '~', '<<', '>>', '<=>', '&&', '||'],
    ['AND', 'OR']
  );
  supportsLimiting(format, { limit: true, offset: true });
  supportsCreateTable(format, { ifNotExists: true });
  supportsCreateView(format);
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
    modify: true,
    renameTo: true,
  });
  // it('allows operations in BETWEEN ranges', () => {
  //   expect(format('SELECT SUM(extendedprice * discount) AS revenue FROM item WHERE discount BETWEEN 0.06 - 0.01 AND 0.06 + 0.01')).toBe(dedent`
  //   SELECT
  //     SUM(extendedprice * discount) AS revenue
  //   FROM
  //     item
  //   WHERE
  //     discount BETWEEN 0.06 - 0.01 AND 0.06  + 0.01
  //   `);
  // });
  describe(`formats traversal of semi structured data`, () => {
    it(`formats '.' path-operator without spaces`, () => {
      expect(format(`SELECT TO_JSON(foo.*) AS foo_json FROM foo`)).toBe(dedent`
        SELECT
          TO_JSON(foo.*) AS foo_json
        FROM
          foo
      `);
    });
    it(`formats '::' path-operator without spaces`, () => {
      expect(format(`SELECT * FROM foo WHERE json_foo::bar = 'foobar'`)).toBe(dedent`
        SELECT
          *
        FROM
          foo
        WHERE
          json_foo::bar = 'foobar'
      `);
    });
    it(`formats '::$' conversion path-operator without spaces`, () => {
      expect(format(`SELECT * FROM foo WHERE json_foo::$bar = 'foobar'`)).toBe(dedent`
        SELECT
          *
        FROM
          foo
        WHERE
          json_foo::$bar = 'foobar'
      `);
    });
    it(`formats '::%' conversion path-operator without spaces`, () => {
      expect(format(`SELECT * FROM foo WHERE json_foo::%bar = 'foobar'`)).toBe(dedent`
        SELECT
          *
        FROM
          foo
        WHERE
          json_foo::%bar = 'foobar'
      `);
    });
  });
  describe(`formats custom type-cast operators`, () => {
    it(`formats ':>' type-cast operator`, () => {
      expect(format(`SELECT 1 :> DOUBLE AS foo`)).toBe(dedent`
        SELECT
          1 :> DOUBLE AS foo
      `);
      expect(format(`SELECT 1 !:> DOUBLE AS foo`)).toBe(dedent`
        SELECT
          1 !:> DOUBLE AS foo
      `);
    });
  });

});
