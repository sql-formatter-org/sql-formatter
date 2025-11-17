import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter.js';

import supportsCreateTable from './features/createTable.js';
import supportsDropTable from './features/dropTable.js';
import supportsStrings from './features/strings.js';
import supportsArrayLiterals from './features/arrayLiterals.js';
import supportsArrayAndMapAccessors from './features/arrayAndMapAccessors.js';
import supportsBetween from './features/between.js';
import supportsJoin from './features/join.js';
import supportsOperators from './features/operators.js';
import supportsDeleteFrom from './features/deleteFrom.js';
import supportsComments from './features/comments.js';
import supportsIdentifiers from './features/identifiers.js';
import supportsWindow from './features/window.js';
import supportsSetOperations from './features/setOperations.js';
import supportsLimiting from './features/limiting.js';
import supportsInsertInto from './features/insertInto.js';
import supportsUpdate from './features/update.js';
import supportsTruncateTable from './features/truncateTable.js';
import supportsCreateView from './features/createView.js';
import supportsAlterTable from './features/alterTable.js';
import supportsDataTypeCase from './options/dataTypeCase.js';
import supportsNumbers from './features/numbers.js';

describe('ClickhouseFormatter', () => {
  const language = 'clickhouse';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsNumbers(format);
  supportsComments(format, { hashComments: true });
  supportsCreateView(format, { orReplace: true, materialized: true, ifNotExists: true });
  supportsCreateTable(format, {
    orReplace: true,
    ifNotExists: true,
    columnComment: true,
    tableComment: true,
  });
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
  supportsStrings(format, ["''-qq-bs"]);
  supportsIdentifiers(format, ['""-qq-bs', '``']);
  supportsArrayLiterals(format, { withoutArrayPrefix: true });
  supportsBetween(format);
  supportsJoin(format, {
    without: ['NATURAL'],
    additionally: [
      'GLOBAL LEFT OUTER JOIN',
      'GLOBAL RIGHT OUTER JOIN',
      'GLOBAL FULL OUTER JOIN',
      'GLOBAL CROSS OUTER JOIN',

      'GLOBAL INNER SEMI JOIN',
      'GLOBAL LEFT SEMI JOIN',
      'GLOBAL RIGHT SEMI JOIN',
      'GLOBAL FULL SEMI JOIN',
      'GLOBAL CROSS SEMI JOIN',

      'GLOBAL INNER ANTI JOIN',
      'GLOBAL LEFT ANTI JOIN',
      'GLOBAL RIGHT ANTI JOIN',
      'GLOBAL FULL ANTI JOIN',
      'GLOBAL CROSS ANTI JOIN',

      'GLOBAL INNER ANY JOIN',
      'GLOBAL LEFT ANY JOIN',
      'GLOBAL RIGHT ANY JOIN',
      'GLOBAL FULL ANY JOIN',
      'GLOBAL CROSS ANY JOIN',

      'GLOBAL INNER ALL JOIN',
      'GLOBAL LEFT ALL JOIN',
      'GLOBAL RIGHT ALL JOIN',
      'GLOBAL FULL ALL JOIN',
      'GLOBAL CROSS ALL JOIN',

      'GLOBAL INNER ASOF JOIN',
      'GLOBAL LEFT ASOF JOIN',
      'GLOBAL RIGHT ASOF JOIN',
      'GLOBAL FULL ASOF JOIN',
      'GLOBAL CROSS ASOF JOIN',

      'GLOBAL INNER JOIN',
      'GLOBAL LEFT JOIN',
      'GLOBAL RIGHT JOIN',
      'GLOBAL FULL JOIN',
      'GLOBAL CROSS JOIN',

      'CROSS OUTER JOIN',

      'INNER SEMI JOIN',
      'LEFT SEMI JOIN',
      'RIGHT SEMI JOIN',
      'FULL SEMI JOIN',
      'CROSS SEMI JOIN',

      'INNER ANTI JOIN',
      'LEFT ANTI JOIN',
      'RIGHT ANTI JOIN',
      'FULL ANTI JOIN',
      'CROSS ANTI JOIN',

      'INNER ANY JOIN',
      'LEFT ANY JOIN',
      'RIGHT ANY JOIN',
      'FULL ANY JOIN',
      'CROSS ANY JOIN',

      'INNER ALL JOIN',
      'LEFT ALL JOIN',
      'RIGHT ALL JOIN',
      'FULL ALL JOIN',
      'CROSS ALL JOIN',

      'INNER ASOF JOIN',
      'LEFT ASOF JOIN',
      'RIGHT ASOF JOIN',
      'FULL ASOF JOIN',
      'CROSS ASOF JOIN',

      'GLOBAL OUTER JOIN',
      'GLOBAL SEMI JOIN',
      'GLOBAL ANTI JOIN',
      'GLOBAL ANY JOIN',
      'GLOBAL ALL JOIN',
      'GLOBAL ASOF JOIN',

      'GLOBAL JOIN',

      'OUTER JOIN',
      'SEMI JOIN',
      'ANTI JOIN',
      'ANY JOIN',
      'ALL JOIN',
      'ASOF JOIN',
    ],
  });
  supportsSetOperations(format, ['UNION', 'UNION ALL', 'UNION DISTINCT', 'PARALLEL WITH']);
  supportsOperators(format, ['%'], { any: true });
  supportsWindow(format);
  supportsLimiting(format, { limit: true, offset: false });
  supportsArrayAndMapAccessors(format);
  supportsDataTypeCase(format);

  // Should support the ternary operator
  it('supports the ternary operator', () => {
    // NOTE: Ternary operators have a missing space because
    // ExpressionFormatter's `formatOperator` method special-cases `:`.
    expect(format('SELECT foo?bar: baz;')).toBe('SELECT\n  foo ? bar: baz;');
  });

  // Should support the lambda creation operator
  it('supports the lambda creation operator', () => {
    expect(format('SELECT arrayMap(x->2*x, [1,2,3,4]) AS result;')).toBe(
      'SELECT\n  arrayMap(x -> 2 * x, [1, 2, 3, 4]) AS result;'
    );
  });

  describe('in/any set operators', () => {
    it('should respect the IN operator as a keyword when used as an operator', () => {
      expect(format('SELECT 1 in foo;')).toBe('SELECT\n  1 IN foo;');

      expect(format('SELECT foo in (1,2,3);')).toBe('SELECT\n  foo IN (1, 2, 3);');
      expect(format('SELECT "foo" in (1,2,3);')).toBe('SELECT\n  "foo" IN (1, 2, 3);');
      expect(format('SELECT 1 in (1,2,3);')).toBe('SELECT\n  1 IN (1, 2, 3);');
    });
    it('should respect the ANY operator as a keyword when used as an operator', () => {
      expect(format('SELECT 1 = any foo;')).toBe('SELECT\n  1 = ANY foo;');

      expect(format('SELECT foo = any (1,2,3);')).toBe('SELECT\n  foo = ANY (1, 2, 3);');
      expect(format('SELECT "foo" = any (1,2,3);')).toBe('SELECT\n  "foo" = ANY (1, 2, 3);');
      expect(format('SELECT 1 = any (1,2,3);')).toBe('SELECT\n  1 = ANY (1, 2, 3);');
    });

    it('should respect the IN operator as a keyword when used as a function', () => {
      expect(format('SELECT in(foo, [1,2,3]);')).toBe('SELECT\n  in(foo, [1, 2, 3]);');
      expect(format('SELECT in("foo", "bar");')).toBe('SELECT\n  in("foo", "bar");');
    });
    it('should respect the ANY operator as a keyword when used as a function', () => {
      expect(format('SELECT any(foo);')).toBe('SELECT\n  any(foo);');
      expect(format('SELECT any("foo");')).toBe('SELECT\n  any("foo");');
    });
  });

  it('should support parameters', () => {
    expect(format('SELECT {foo:Uint64};', { params: { foo: "'123'" } })).toBe("SELECT\n  '123';");
    expect(format('SELECT {foo:Map(String, String)};', { params: { foo: "{'bar': 'baz'}" } })).toBe(
      "SELECT\n  {'bar': 'baz'};"
    );
  });
});
