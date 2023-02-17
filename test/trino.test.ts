import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter.js';

import supportsArrayLiterals from './features/arrayLiterals.js';
import supportsBetween from './features/between.js';
import supportsCreateTable from './features/createTable.js';
import supportsDropTable from './features/dropTable.js';
import supportsDeleteFrom from './features/deleteFrom.js';
import supportsJoin from './features/join.js';
import supportsOperators from './features/operators.js';
import supportsStrings from './features/strings.js';
import supportsArrayAndMapAccessors from './features/arrayAndMapAccessors.js';
import supportsComments from './features/comments.js';
import supportsIdentifiers from './features/identifiers.js';
import supportsParams from './options/param.js';
import supportsSetOperations from './features/setOperations.js';
import supportsWindow from './features/window.js';
import supportsLimiting from './features/limiting.js';
import supportsInsertInto from './features/insertInto.js';
import supportsUpdate from './features/update.js';
import supportsTruncateTable from './features/truncateTable.js';
import supportsCreateView from './features/createView.js';
import supportsAlterTable from './features/alterTable.js';
import supportsIsDistinctFrom from './features/isDistinctFrom.js';

describe('TrinoFormatter', () => {
  const language = 'trino';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format);
  supportsCreateView(format, { orReplace: true, materialized: true });
  supportsCreateTable(format, { ifNotExists: true });
  supportsDropTable(format, { ifExists: true });
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
    renameTo: true,
    renameColumn: true,
  });
  supportsDeleteFrom(format);
  supportsInsertInto(format);
  supportsUpdate(format);
  supportsTruncateTable(format);
  supportsStrings(format, ["''-qq", "X''", "U&''"]);
  supportsIdentifiers(format, [`""-qq`]);
  supportsBetween(format);
  // Missing: '?' operator (for row patterns)
  supportsOperators(format, ['%', '->', '=>', '||', '|', '^', '$'], ['AND', 'OR']);
  supportsIsDistinctFrom(format);
  supportsArrayLiterals(format);
  supportsArrayAndMapAccessors(format);
  supportsJoin(format);
  supportsSetOperations(format);
  supportsParams(format, { positional: true });
  supportsWindow(format);
  supportsLimiting(format, { limit: true, offset: true, fetchFirst: true, fetchNext: true });

  it('formats SET SESSION', () => {
    const result = format('SET SESSION foo = 444;');
    expect(result).toBe(dedent`
      SET SESSION foo = 444;
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
});
