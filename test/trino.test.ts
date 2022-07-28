import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from 'src/sqlFormatter';
import TrinoFormatter from 'src/languages/trino/trino.formatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsArrayLiterals from './features/arrayLiterals';
import supportsBetween from './features/between';
import supportsCreateTable from './features/createTable';
import supportsDeleteFrom from './features/deleteFrom';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsStrings from './features/strings';
import supportsArrayAndMapAccessors from './features/arrayAndMapAccessors';
import supportsComments from './features/comments';
import supportsIdentifiers from './features/identifiers';
import supportsParams from './options/param';
import supportsSetOperations from './features/setOperations';

describe('TrinoFormatter', () => {
  const language = 'trino';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format);
  supportsCreateTable(format);
  supportsDeleteFrom(format);
  supportsStrings(format, TrinoFormatter.stringTypes);
  supportsIdentifiers(format, ['""', '``']);
  supportsBetween(format);
  supportsOperators(format, TrinoFormatter.operators, ['AND', 'OR']);
  supportsArrayLiterals(format);
  supportsArrayAndMapAccessors(format);
  supportsJoin(format);
  supportsSetOperations(format);
  supportsParams(format, { positional: true });

  it('formats SET SESSION', () => {
    const result = format('SET SESSION foo = 444;');
    expect(result).toBe(dedent`
      SET SESSION
        foo = 444;
    `);
  });

  it('formats row PATTERN()s', () => {
    const result = format(`
      SELECT * FROM orders MATCH_RECOGNIZE(
        PARTITION BY custkey
        ORDER BY orderdate
        MEASURES
                  A.totalprice AS starting_price,
                  LAST(B.totalprice) AS bottom_price,
                  LAST(U.totalprice) AS top_price
        ONE ROW PER MATCH
        AFTER MATCH SKIP PAST LAST ROW
        PATTERN ((A | B){5} {- C+ D+ -} E+)
        SUBSET U = (C, D)
        DEFINE
                  B AS totalprice < PREV(totalprice),
                  C AS totalprice > PREV(totalprice) AND totalprice <= A.totalprice,
                  D AS totalprice > PREV(totalprice)
        )
    `);
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        orders
      MATCH_RECOGNIZE
        (
          PARTITION BY
            custkey
          ORDER BY
            orderdate
          MEASURES
            A.totalprice AS starting_price,
            LAST(B.totalprice) AS bottom_price,
            LAST(U.totalprice) AS top_price
          ONE ROW PER MATCH
          AFTER MATCH
            SKIP PAST LAST ROW
          PATTERN
            ((A | B) {5} {- C + D + -} E +)
          SUBSET
            U = (C, D)
          DEFINE
            B AS totalprice < PREV(totalprice),
            C AS totalprice > PREV(totalprice)
            AND totalprice <= A.totalprice,
            D AS totalprice > PREV(totalprice)
        )
    `);
  });

  it('formats basic ALTER TABLE statements', () => {
    const result = format(`
      ALTER TABLE people RENAME TO persons;
      ALTER TABLE persons ADD COLUMN location_id INT;
      ALTER TABLE persons RENAME COLUMN location_id TO loc_id;
      ALTER TABLE persons DROP COLUMN loc_id;
    `);
    expect(result).toBe(dedent`
      ALTER TABLE
        people
      RENAME TO
        persons;

      ALTER TABLE
        persons
      ADD COLUMN
        location_id INT;

      ALTER TABLE
        persons
      RENAME COLUMN
        location_id TO loc_id;

      ALTER TABLE
        persons
      DROP COLUMN
        loc_id;
    `);
  });
});
