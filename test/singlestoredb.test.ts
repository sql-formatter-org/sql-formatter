import dedent from 'dedent-js';
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
    [':=', '&', '|', '^', '~', '<<', '>>', '<=>', '&&', '||', ':>', '!:>'],
    ['AND', 'OR']
  );
  supportsLimiting(format, { limit: true, offset: true });
  supportsCreateTable(format, { ifNotExists: true, columnComment: true, tableComment: true });
  supportsCreateView(format);
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
    modify: true,
    renameTo: true,
  });

  describe(`formats traversal of semi structured data`, () => {
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

  it('uppercases only reserved keywords', () => {
    expect(
      format(
        `create table account (id int comment 'the most important column');
        select * from mysql.user;
        insert into user (id, name) values (1, 'Blah');`,
        { keywordCase: 'upper' }
      )
    ).toBe(dedent`
      CREATE TABLE
        account (id INT comment 'the most important column');

      SELECT
        *
      FROM
        mysql.user;

      INSERT INTO
        user (id, name)
      VALUES
        (1, 'Blah');
    `);
  });
});
