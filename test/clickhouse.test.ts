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
    renameColumn: false,
  });
  // We disable `renameColumn` above because we handle TO
  // differently than the default.
  it('formats ALTER TABLE ... RENAME COLUMN statement', () => {
    const result = format('ALTER TABLE supplier RENAME COLUMN supplier_id TO id;');
    expect(result).toBe(dedent`
      ALTER TABLE supplier
      RENAME COLUMN supplier_id
      TO id;
    `);
  });

  supportsDeleteFrom(format);
  supportsInsertInto(format);
  supportsUpdate(format);
  supportsTruncateTable(format);
  supportsStrings(format, ["''-qq", "''-bs"]);
  supportsIdentifiers(format, ['""-qq', '""-bs', '``']);
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

      'ARRAY JOIN',
      'LEFT ARRAY JOIN',
    ],
  });
  supportsSetOperations(format, ['UNION', 'UNION ALL', 'UNION DISTINCT', 'PARALLEL WITH']);
  supportsOperators(format, ['%'], { any: false });
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

  describe('IN set operator vs function', () => {
    it('should respect the IN operator as a keyword when used as an operator', () => {
      expect(format('SELECT 1 in foo;')).toBe(dedent`
        SELECT
          1 in foo;
      `);

      expect(format('SELECT foo in (1,2,3);')).toBe(dedent`
        SELECT
          foo in (1, 2, 3);
      `);
      expect(format('SELECT "foo" in (1,2,3);')).toBe(dedent`
        SELECT
          "foo" in (1, 2, 3);
      `);
      expect(format('SELECT 1 in (1,2,3);')).toBe(dedent`
        SELECT
          1 in (1, 2, 3);
      `);
    });

    it('should respect the IN operator as a keyword when used as a function', () => {
      expect(format('SELECT in(foo, [1,2,3]);')).toBe(dedent`
        SELECT
          in(foo, [1, 2, 3]);
      `);
      expect(format('SELECT in("foo", "bar");')).toBe(dedent`
        SELECT
          in("foo", "bar");
      `);
    });
  });

  it('should support parameters', () => {
    expect(format('SELECT {foo:Uint64};', { params: { foo: "'123'" } })).toBe("SELECT\n  '123';");
    expect(format('SELECT {foo:Map(String, String)};', { params: { foo: "{'bar': 'baz'}" } })).toBe(
      dedent`
        SELECT
          {'bar': 'baz'};
      `
    );
  });

  // https://clickhouse.com/docs/sql-reference/statements/select
  describe('SELECT statements', () => {
    it('formats SELECT with COLUMNS expression', () => {
      expect(format("SELECT COLUMNS('a') FROM col_names")).toBe(dedent`
        SELECT
          COLUMNS ('a')
        FROM
          col_names
      `);
    });

    it('formats SELECT with multiple COLUMNS and functions', () => {
      expect(
        format("SELECT COLUMNS('a'), COLUMNS('c'), toTypeName(COLUMNS('c')) FROM col_names")
      ).toBe(
        dedent`
          SELECT
            COLUMNS ('a'),
            COLUMNS ('c'),
            toTypeName(COLUMNS ('c'))
          FROM
            col_names
        `
      );
    });

    it('formats SELECT with COLUMNS arithmetic', () => {
      expect(format("SELECT COLUMNS('a') + COLUMNS('c') FROM col_names")).toBe(dedent`
        SELECT
          COLUMNS ('a') + COLUMNS ('c')
        FROM
          col_names
      `);
    });

    it('formats SELECT with COLUMNS and APPLY modifier', () => {
      expect(
        format(
          "SELECT COLUMNS('[jk]') APPLY(toString) APPLY(length) APPLY(max) FROM columns_transformers;"
        )
      ).toBe(dedent`
        SELECT
          COLUMNS ('[jk]') APPLY (toString) APPLY (length) APPLY (max)
        FROM
          columns_transformers;
      `);
    });

    it('formats SELECT with REPLACE, EXCEPT, and APPLY modifiers', () => {
      expect(
        format('SELECT * REPLACE(i + 1 AS i) EXCEPT (j) APPLY(sum) from columns_transformers;')
      ).toBe(
        dedent`
          SELECT
            * REPLACE(i + 1 AS i) EXCEPT (j) APPLY (sum)
          from
            columns_transformers;
        `
      );
    });

    it('formats SELECT with SETTINGS clause', () => {
      expect(
        format('SELECT * FROM some_table SETTINGS optimize_read_in_order=1, cast_keep_nullable=1;')
      ).toBe(
        dedent`
          SELECT
            *
          FROM
            some_table
          SETTINGS
            optimize_read_in_order = 1,
            cast_keep_nullable = 1;
        `
      );
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/insert-into
  describe('INSERT INTO statements', () => {
    it('formats INSERT INTO with asterisk', () => {
      expect(format("INSERT INTO insert_select_testtable (*) VALUES (1, 'a', 1) ;")).toBe(dedent`
        INSERT INTO
          insert_select_testtable (*)
        VALUES
          (1, 'a', 1);
      `);
    });

    it('formats INSERT INTO with EXCEPT modifier', () => {
      expect(format('INSERT INTO insert_select_testtable (* EXCEPT(b)) VALUES (2, 2);'))
        .toBe(dedent`
          INSERT INTO
            insert_select_testtable (* EXCEPT (b))
          VALUES
            (2, 2);
        `);
    });

    it('formats INSERT INTO with DEFAULT', () => {
      expect(format('INSERT INTO insert_select_testtable VALUES (1, DEFAULT, 1) ;')).toBe(dedent`
        INSERT INTO
          insert_select_testtable
        VALUES
          (1, DEFAULT, 1);
      `);
    });

    it('formats INSERT INTO with WITH clause after INSERT', () => {
      expect(format('INSERT INTO x WITH y AS (SELECT * FROM numbers(10)) SELECT * FROM y;'))
        .toBe(dedent`
        INSERT INTO
          x
        WITH
          y AS (
            SELECT
              *
            FROM
              numbers(10)
          )
        SELECT
          *
        FROM
          y;
      `);
    });

    it('formats WITH clause before INSERT INTO', () => {
      expect(format('WITH y AS (SELECT * FROM numbers(10)) INSERT INTO x SELECT * FROM y;'))
        .toBe(dedent`
        WITH
          y AS (
            SELECT
              *
            FROM
              numbers(10)
          )
        INSERT INTO
          x
        SELECT
          *
        FROM
          y;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/update
  describe('UPDATE statements', () => {
    it('formats UPDATE with WHERE clause', () => {
      expect(format("UPDATE hits SET Title = 'Updated Title' WHERE EventDate = today();"))
        .toBe(dedent`
        UPDATE hits
        SET
          Title = 'Updated Title'
        WHERE
          EventDate = today();
      `);
    });

    it('formats UPDATE with multiple SET assignments', () => {
      expect(
        format("UPDATE wikistat SET hits = hits + 1, time = now() WHERE path = 'ClickHouse';")
      ).toBe(
        dedent`
          UPDATE wikistat
          SET
            hits = hits + 1,
            time = now()
          WHERE
            path = 'ClickHouse';
        `
      );
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/delete
  describe('DELETE statements', () => {
    it('formats DELETE FROM with ON CLUSTER and IN PARTITION', () => {
      expect(
        format("DELETE FROM db.table ON CLUSTER foo IN PARTITION '2025-01-01' WHERE x = 1;")
      ).toBe(
        dedent`
          DELETE FROM db.table
          ON CLUSTER foo
          IN PARTITION '2025-01-01'
          WHERE
            x = 1;
        `
      );
    });
  });

  // https://clickhouse.com/docs/sql-reference/window-functions
  describe('Window functions', () => {
    it('formats SELECT with window function', () => {
      expect(
        format(
          'SELECT part_key, value, order, groupArray(value) OVER (PARTITION BY part_key) AS frame_values FROM wf_partition ORDER BY part_key ASC, value ASC;'
        )
      ).toBe(dedent`
        SELECT
          part_key,
          value,
          order,
          groupArray(value) OVER (
            PARTITION BY
              part_key
          ) AS frame_values
        FROM
          wf_partition
        ORDER BY
          part_key ASC,
          value ASC;
      `);
    });

    it('formats SELECT with window function and ROWS BETWEEN', () => {
      // NOTE: This is a little ugly, but we have `{ROWS | RANGE} BETWEEN`
      // as a reserved keyword phrase instead of a reserved clause so
      // that we satisfy the window function feature tests.
      expect(
        format(
          'SELECT part_key, value, order, groupArray(value) OVER (PARTITION BY part_key ORDER BY order ASC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS frame_values FROM wf_frame ORDER BY part_key ASC, value ASC;'
        )
      ).toBe(dedent`
        SELECT
          part_key,
          value,
          order,
          groupArray(value) OVER (
            PARTITION BY
              part_key
            ORDER BY
              order ASC ROWS BETWEEN UNBOUNDED PRECEDING
              AND UNBOUNDED FOLLOWING
          ) AS frame_values
        FROM
          wf_frame
        ORDER BY
          part_key ASC,
          value ASC;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/create
  describe('CREATE statements', () => {
    it('formats CREATE TABLE with PROJECTION', () => {
      expect(
        format(
          'CREATE TABLE visits (user_id UInt64, user_name String, pages_visited Nullable(Float64), user_agent String, PROJECTION projection_visits_by_user (SELECT user_agent, sum(pages_visited) GROUP BY user_id, user_agent)) ENGINE = MergeTree() ORDER BY user_agent;'
        )
      ).toBe(dedent`
        CREATE TABLE visits (
          user_id UInt64,
          user_name String,
          pages_visited Nullable(Float64),
          user_agent String,
          PROJECTION projection_visits_by_user (
            SELECT
              user_agent,
              sum(pages_visited)
            GROUP BY
              user_id,
              user_agent
          )
        ) ENGINE = MergeTree()
        ORDER BY
          user_agent;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/alter/user
  describe('ALTER USER statements', () => {
    it('formats ALTER USER IF EXISTS user1 RENAME TO user1_new, user2 RENAME TO user2_new DROP ALL SETTINGS', () => {
      expect(
        format(
          'ALTER USER IF EXISTS user1 RENAME TO user1_new, user2 RENAME TO user2_new DROP ALL SETTINGS;'
        )
      ).toBe(dedent`
        ALTER USER IF EXISTS
          user1
        RENAME TO user1_new,
        user2
        RENAME TO user2_new
        DROP ALL SETTINGS;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/alter/column
  describe('ALTER COLUMN statements', () => {
    it('formats ALTER TABLE DROP COLUMN', () => {
      expect(format('ALTER TABLE visits DROP COLUMN browser;')).toBe(dedent`
        ALTER TABLE visits
        DROP COLUMN browser;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/alter/partition
  describe('ALTER PARTITION statements', () => {
    it('formats ALTER TABLE DROP PARTITION', () => {
      expect(format("ALTER TABLE posts DROP PARTITION '2008';")).toBe(dedent`
        ALTER TABLE posts
        DROP PARTITION '2008';
      `);
    });

    it('formats ALTER TABLE DROP PART', () => {
      expect(format("ALTER TABLE mt DROP PART 'all_4_4_0';")).toBe(dedent`
        ALTER TABLE mt
        DROP PART 'all_4_4_0';
      `);
    });

    it('formats ALTER TABLE DROP DETACHED PARTITION', () => {
      expect(format("ALTER TABLE mt DROP DETACHED PARTITION '2020-01-01';")).toBe(dedent`
        ALTER TABLE mt
        DROP DETACHED PARTITION '2020-01-01';
      `);
    });

    it('formats ALTER TABLE DROP DETACHED PARTITION ALL', () => {
      expect(format('ALTER TABLE mt DROP DETACHED PARTITION ALL;')).toBe(dedent`
        ALTER TABLE mt
        DROP DETACHED PARTITION ALL;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/alter/setting
  describe('ALTER SETTING statements', () => {
    it('formats ALTER TABLE MODIFY SETTING', () => {
      expect(
        format(
          'ALTER TABLE example_table MODIFY SETTING max_part_loading_threads=8, max_parts_in_total=50000;'
        )
      ).toBe(dedent`
        ALTER TABLE example_table
        MODIFY SETTING max_part_loading_threads = 8,
        max_parts_in_total = 50000;
      `);
    });

    it('formats ALTER TABLE RESET SETTING', () => {
      expect(format('ALTER TABLE example_table RESET SETTING max_part_loading_threads;')).toBe(
        dedent`
          ALTER TABLE example_table
          RESET SETTING max_part_loading_threads;
        `
      );
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/alter/delete
  describe('ALTER DELETE statements', () => {
    it('formats ALTER TABLE DELETE WHERE', () => {
      expect(
        format(
          'ALTER TABLE db.events ON CLUSTER prod DELETE WHERE timestamp < now() - INTERVAL 30 DAY;'
        )
      ).toBe(dedent`
        ALTER TABLE db.events
        ON CLUSTER prod
        DELETE WHERE timestamp < now() - INTERVAL 30 DAY;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/alter/order-by
  describe('ALTER ORDER BY statements', () => {
    it('formats ALTER TABLE MODIFY ORDER BY', () => {
      expect(
        format('ALTER TABLE db.events ON CLUSTER prod MODIFY ORDER BY (user_id, timestamp);')
      ).toBe(dedent`
        ALTER TABLE db.events
        ON CLUSTER prod
        MODIFY ORDER BY (user_id, timestamp);
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/alter/sample-by
  describe('ALTER SAMPLE BY statements', () => {
    it('formats ALTER TABLE MODIFY SAMPLE BY', () => {
      expect(format('ALTER TABLE db.events ON CLUSTER prod MODIFY SAMPLE BY user_id;')).toBe(dedent`
        ALTER TABLE db.events
        ON CLUSTER prod
        MODIFY SAMPLE BY user_id;
      `);
    });

    it('formats ALTER TABLE REMOVE SAMPLE BY', () => {
      expect(format('ALTER TABLE db.events ON CLUSTER prod REMOVE SAMPLE BY;')).toBe(dedent`
        ALTER TABLE db.events
        ON CLUSTER prod
        REMOVE SAMPLE BY;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/alter/skipping-index
  describe('ALTER INDEX statements', () => {
    it('formats ALTER TABLE ADD INDEX', () => {
      expect(
        format(
          "ALTER TABLE db.table_name ON CLUSTER 'my_cluster' ADD INDEX IF NOT EXISTS my_index (column1 + column2) TYPE set(100) GRANULARITY 2 AFTER another_column;"
        )
      ).toBe(dedent`
        ALTER TABLE db.table_name
        ON CLUSTER 'my_cluster'
        ADD INDEX IF NOT EXISTS my_index (column1 + column2)
        TYPE
          set(100)
        GRANULARITY 2
        AFTER another_column;
      `);
      expect(
        format(
          'ALTER TABLE db.table_name ADD INDEX my_index column1 TYPE minmax GRANULARITY 1 FIRST;'
        )
      ).toBe(dedent`
        ALTER TABLE db.table_name
        ADD INDEX my_index column1
        TYPE
          minmax
        GRANULARITY 1
        FIRST;
      `);
    });
    it('formats ALTER TABLE DROP INDEX', () => {
      expect(
        format("ALTER TABLE db.table_name ON CLUSTER 'my_cluster' DROP INDEX IF EXISTS my_index;")
      ).toBe(dedent`
        ALTER TABLE db.table_name
        ON CLUSTER 'my_cluster'
        DROP INDEX IF EXISTS my_index;
      `);
    });

    it('formats ALTER TABLE MATERIALIZE INDEX', () => {
      expect(
        format(
          "ALTER TABLE db.table_name ON CLUSTER 'my_cluster' MATERIALIZE INDEX IF EXISTS my_index IN PARTITION '202301';"
        )
      ).toBe(dedent`
        ALTER TABLE db.table_name
        ON CLUSTER 'my_cluster'
        MATERIALIZE INDEX IF EXISTS my_index
        IN PARTITION '202301';
      `);
    });

    it('formats ALTER TABLE CLEAR INDEX', () => {
      expect(
        format(
          "ALTER TABLE db.table_name ON CLUSTER 'my_cluster' CLEAR INDEX IF EXISTS my_index IN PARTITION '202301';"
        )
      ).toBe(dedent`
        ALTER TABLE db.table_name
        ON CLUSTER 'my_cluster'
        CLEAR INDEX IF EXISTS my_index
        IN PARTITION '202301';
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/alter/constraint
  describe('ALTER CONSTRAINT statements', () => {
    it('formats ALTER TABLE ADD CONSTRAINT', () => {
      expect(format('ALTER TABLE t1 ADD CONSTRAINT IF NOT EXISTS c1 CHECK (a > 0);')).toBe(dedent`
        ALTER TABLE t1
        ADD CONSTRAINT IF NOT EXISTS c1 CHECK (a > 0);
      `);
    });

    it('formats ALTER TABLE DROP CONSTRAINT', () => {
      expect(format('ALTER TABLE t1 DROP CONSTRAINT IF EXISTS c1;')).toBe(dedent`
        ALTER TABLE t1
        DROP CONSTRAINT IF EXISTS c1;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/alter/ttl
  describe('ALTER TTL statements', () => {
    it('formats ALTER TABLE REMOVE TTL', () => {
      expect(format('ALTER TABLE t1 REMOVE TTL;')).toBe(dedent`
        ALTER TABLE t1
        REMOVE TTL;
      `);
    });

    it('formats ALTER TABLE MODIFY TTL', () => {
      expect(format('ALTER TABLE t1 MODIFY TTL 1 year;')).toBe(dedent`
        ALTER TABLE t1
        MODIFY TTL 1 year;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/alter/statistics
  describe('ALTER STATISTICS statements', () => {
    it('formats ALTER TABLE MODIFY STATISTICS', () => {
      expect(format('ALTER TABLE t1 MODIFY STATISTICS c, d TYPE TDigest, Uniq;')).toBe(dedent`
        ALTER TABLE t1
        MODIFY STATISTICS
          c,
          d
        TYPE
          TDigest,
          Uniq;
      `);
    });

    it('formats ALTER TABLE ADD STATISTICS', () => {
      expect(format('ALTER TABLE t1 ADD STATISTICS (c, d) TYPE TDigest, Uniq;')).toBe(dedent`
        ALTER TABLE t1
        ADD STATISTICS (c, d)
        TYPE
          TDigest,
          Uniq;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/alter/quota
  describe('ALTER QUOTA statements', () => {
    it('formats ALTER QUOTA IF EXISTS qA FOR INTERVAL 15 month MAX queries = 123 TO CURRENT_USER;', () => {
      expect(
        format('ALTER QUOTA IF EXISTS qA FOR INTERVAL 15 month MAX queries = 123 TO CURRENT_USER;')
      ).toBe(dedent`
        ALTER QUOTA IF EXISTS qA
        FOR INTERVAL 15 month MAX queries = 123
        TO CURRENT_USER;
      `);
    });

    it('formats ALTER QUOTA IF EXISTS qB FOR INTERVAL 30 minute MAX execution_time = 0.5, FOR INTERVAL 5 quarter MAX queries = 321, errors = 10 TO default;', () => {
      expect(
        format(
          'ALTER QUOTA IF EXISTS qB RENAME TO qC NOT KEYED FOR INTERVAL 30 minute MAX execution_time = 0.5 FOR INTERVAL 5 quarter MAX queries = 321, errors = 10 TO default;'
        )
      ).toBe(dedent`
        ALTER QUOTA IF EXISTS qB
        RENAME TO qC
        NOT KEYED
        FOR INTERVAL 30 minute MAX execution_time = 0.5
        FOR INTERVAL 5 quarter MAX queries = 321,
        errors = 10
        TO default;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/alter/row-policy
  describe('ALTER ROW POLICY statements', () => {
    it('formats ALTER ROW POLICY', () => {
      expect(
        format(
          'ALTER ROW POLICY IF EXISTS policy1 ON CLUSTER cluster_name1 ON database1.table1 RENAME TO new_name1;'
        )
      ).toBe(dedent`
        ALTER ROW POLICY IF EXISTS
          policy1
        ON CLUSTER cluster_name1 ON database1.table1
        RENAME TO new_name1;
      `);
    });

    it('formats ALTER ROW POLICY with multiple policies', () => {
      expect(
        format(
          'ALTER ROW POLICY IF EXISTS policy1 ON CLUSTER cluster_name1 ON database1.table1 RENAME TO new_name1, policy2 ON CLUSTER cluster_name2 ON database2.table2 RENAME TO new_name2;'
        )
      ).toBe(dedent`
        ALTER ROW POLICY IF EXISTS
          policy1
        ON CLUSTER cluster_name1 ON database1.table1
        RENAME TO new_name1,
        policy2
        ON CLUSTER cluster_name2 ON database2.table2
        RENAME TO new_name2;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/alter/projection
  describe('ALTER PROJECTION statements', () => {
    it('formats ALTER TABLE ADD PROJECTION', () => {
      expect(
        format(
          'ALTER TABLE visits_order ADD PROJECTION user_name_projection (SELECT * ORDER BY user_name);'
        )
      ).toBe(dedent`
        ALTER TABLE visits_order
        ADD PROJECTION user_name_projection (
          SELECT
            *
          ORDER BY
            user_name
        );
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/alter/view
  describe('ALTER VIEW statements', () => {
    it('formats ALTER TABLE MODIFY QUERY', () => {
      expect(format('ALTER TABLE mv MODIFY QUERY SELECT a * 2 as a FROM src_table;')).toBe(dedent`
        ALTER TABLE mv
        MODIFY QUERY SELECT
          a * 2 as a
        FROM
          src_table;
      `);
    });

    it('formats ALTER TABLE MODIFY QUERY with GROUP BY', () => {
      expect(
        format(
          'ALTER TABLE mv MODIFY QUERY SELECT toStartOfDay(ts) ts, event_type, browser, count() events_cnt, sum(cost) cost FROM events GROUP BY ts, event_type, browser;'
        )
      ).toBe(dedent`
        ALTER TABLE mv
        MODIFY QUERY SELECT
          toStartOfDay(ts) ts,
          event_type,
          browser,
          count() events_cnt,
          sum(cost) cost
        FROM
          events
        GROUP BY
          ts,
          event_type,
          browser;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/alter/apply-deleted-mask
  describe('ALTER APPLY DELETED MASK statements', () => {
    it('formats ALTER TABLE APPLY DELETED MASK with ON CLUSTER and IN PARTITION', () => {
      expect(
        format("ALTER TABLE visits ON CLUSTER prod APPLY DELETED MASK IN PARTITION '2025-01-01';")
      ).toBe(dedent`
        ALTER TABLE visits
        ON CLUSTER prod
        APPLY DELETED MASK
        IN PARTITION '2025-01-01';
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/drop
  describe('DROP statements', () => {
    it('formats DROP DATABASE', () => {
      expect(format('DROP DATABASE db;')).toBe(dedent`
        DROP DATABASE db;
      `);
    });

    it('formats DROP DATABASE IF EXISTS with ON CLUSTER and SYNC', () => {
      expect(format('DROP DATABASE IF EXISTS db ON CLUSTER my_cluster SYNC;')).toBe(dedent`
        DROP DATABASE IF EXISTS db
        ON CLUSTER my_cluster
        SYNC;
      `);
    });

    it('formats DROP TEMPORARY TABLE', () => {
      expect(format('DROP TEMPORARY TABLE temp_table;')).toBe(dedent`
        DROP TEMPORARY TABLE temp_table;
      `);
    });

    it('formats DROP TABLE IF EMPTY', () => {
      expect(format('DROP TABLE IF EMPTY mydb.my_table;')).toBe(dedent`
        DROP TABLE IF EMPTY mydb.my_table;
      `);
    });

    it('formats DROP multiple tables', () => {
      expect(format('DROP TABLE mydb.tab1, mydb.tab2;')).toBe(dedent`
        DROP TABLE mydb.tab1,
        mydb.tab2;
      `);
    });

    it('formats DROP DICTIONARY with various options', () => {
      expect(format('DROP DICTIONARY IF EXISTS mydb.my_dict SYNC;')).toBe(dedent`
        DROP DICTIONARY IF EXISTS mydb.my_dict
        SYNC;
      `);
    });

    it('formats DROP USER single and multiple', () => {
      expect(format('DROP USER IF EXISTS user1, user2 ON CLUSTER my_cluster;')).toBe(dedent`
        DROP USER IF EXISTS
          user1,
          user2
        ON CLUSTER my_cluster;
      `);
    });

    it('formats DROP ROLE', () => {
      expect(format('DROP ROLE IF EXISTS role1, role2 ON CLUSTER my_cluster;')).toBe(dedent`
        DROP ROLE IF EXISTS
          role1,
          role2
        ON CLUSTER my_cluster;
      `);
    });

    it('formats DROP ROW POLICY', () => {
      expect(format('DROP ROW POLICY IF EXISTS policy1, policy2 ON db1.table1;')).toBe(dedent`
        DROP ROW POLICY IF EXISTS
          policy1,
          policy2 ON db1.table1;
      `);
    });

    it('formats DROP POLICY short form', () => {
      expect(format('DROP POLICY IF EXISTS policy1, policy2 ON db1.table1;')).toBe(dedent`
        DROP POLICY IF EXISTS
          policy1,
          policy2 ON db1.table1;
      `);
    });

    it('formats DROP QUOTA', () => {
      expect(format('DROP QUOTA IF EXISTS quota1, quota2 ON CLUSTER my_cluster;')).toBe(dedent`
        DROP QUOTA IF EXISTS
          quota1,
          quota2
        ON CLUSTER my_cluster;
      `);
    });

    it('formats DROP SETTINGS PROFILE', () => {
      expect(format('DROP SETTINGS PROFILE IF EXISTS profile1, profile2 ON CLUSTER my_cluster;')).toBe(dedent`
        DROP SETTINGS PROFILE IF EXISTS
          profile1,
          profile2
        ON CLUSTER my_cluster;
      `);
    });

    it('formats DROP PROFILE short form', () => {
      expect(format('DROP PROFILE IF EXISTS profile1;')).toBe(dedent`
        DROP PROFILE IF EXISTS profile1;
      `);
    });

    it('formats DROP VIEW with SYNC', () => {
      expect(format('DROP VIEW IF EXISTS mydb.my_view ON CLUSTER my_cluster SYNC;')).toBe(dedent`
        DROP VIEW IF EXISTS mydb.my_view
        ON CLUSTER my_cluster
        SYNC;
      `);
    });

    it('formats DROP FUNCTION', () => {
      expect(format('DROP FUNCTION IF EXISTS my_function ON CLUSTER my_cluster;')).toBe(dedent`
        DROP FUNCTION IF EXISTS my_function
        ON CLUSTER my_cluster;
      `);
    });

    it('formats DROP NAMED COLLECTION', () => {
      expect(format('DROP NAMED COLLECTION IF EXISTS my_collection ON CLUSTER my_cluster;'))
        .toBe(dedent`
        DROP NAMED COLLECTION IF EXISTS my_collection
        ON CLUSTER my_cluster;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/truncate
  describe('TRUNCATE statements', () => {
    it('formats TRUNCATE TABLE IF EXISTS with ON CLUSTER and SYNC', () => {
      expect(format('TRUNCATE TABLE IF EXISTS db.table ON CLUSTER prod SYNC;')).toBe(dedent`
        TRUNCATE TABLE IF EXISTS db.table
        ON CLUSTER prod
        SYNC;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/system
  describe('SYSTEM statements', () => {
    it('formats SYSTEM STOP MERGES on cluster', () => {
      expect(format('SYSTEM STOP MERGES ON CLUSTER prod;')).toBe(dedent`
        SYSTEM STOP MERGES
        ON CLUSTER prod;
      `);
    });

    it('formats SYSTEM START TTL MERGES on table', () => {
      expect(format('SYSTEM START TTL MERGES db.my_table;')).toBe(dedent`
        SYSTEM START TTL MERGES db.my_table;
      `);
    });

    it('formats SYSTEM UNFREEZE with backup name', () => {
      expect(format('SYSTEM UNFREEZE WITH NAME backup_20250101;')).toBe(dedent`
        SYSTEM UNFREEZE
        WITH NAME backup_20250101;
      `);
    });

    it('formats SYSTEM WAIT LOADING PARTS', () => {
      expect(format('SYSTEM WAIT LOADING PARTS db.events;')).toBe(dedent`
        SYSTEM WAIT LOADING PARTS db.events;
      `);
    });

    it('formats SYSTEM STOP FETCHES on replicated table', () => {
      expect(format('SYSTEM STOP FETCHES ON CLUSTER prod db.replicated_table;')).toBe(dedent`
        SYSTEM STOP FETCHES
        ON CLUSTER prod db.replicated_table;
      `);
    });

    it('formats SYSTEM START REPLICATION QUEUES', () => {
      expect(format('SYSTEM START REPLICATION QUEUES db.replicated_table;')).toBe(dedent`
        SYSTEM START REPLICATION QUEUES db.replicated_table;
      `);
    });

    it('formats SYSTEM FLUSH DISTRIBUTED on cluster', () => {
      expect(format('SYSTEM FLUSH DISTRIBUTED db.dist_table ON CLUSTER prod;')).toBe(dedent`
        SYSTEM FLUSH DISTRIBUTED db.dist_table
        ON CLUSTER prod;
      `);
    });

    it('formats SYSTEM STOP LISTEN with protocol', () => {
      expect(format('SYSTEM STOP LISTEN ON CLUSTER prod TCP SECURE;')).toBe(dedent`
        SYSTEM STOP LISTEN
        ON CLUSTER prod TCP SECURE;
      `);
    });

    it('formats SYSTEM REFRESH VIEW', () => {
      expect(format('SYSTEM REFRESH VIEW db.mv_hourly;')).toBe(dedent`
        SYSTEM REFRESH VIEW db.mv_hourly;
      `);
    });

    it('formats SYSTEM STOP VIEWS', () => {
      expect(format('SYSTEM STOP VIEWS;')).toBe(dedent`
        SYSTEM STOP VIEWS;
      `);
    });

    it('formats SYSTEM DROP REPLICA from table', () => {
      expect(format("SYSTEM DROP REPLICA 'replica1' FROM TABLE mydb.my_replicated_table;"))
        .toBe(dedent`
        SYSTEM DROP REPLICA 'replica1'
        FROM
          TABLE mydb.my_replicated_table;
      `);
    });

    it('formats SYSTEM DROP REPLICA from database', () => {
      expect(format("SYSTEM DROP REPLICA 'replica1' FROM DATABASE mydb;")).toBe(dedent`
        SYSTEM DROP REPLICA 'replica1'
        FROM
          DATABASE mydb;
      `);
    });

    it('formats SYSTEM DROP REPLICA on local server', () => {
      expect(format("SYSTEM DROP REPLICA 'replica1';")).toBe(dedent`
        SYSTEM DROP REPLICA 'replica1';
      `);
    });

    it('formats SYSTEM DROP REPLICA from ZooKeeper path', () => {
      expect(
        format(
          "SYSTEM DROP REPLICA 'replica1' FROM ZKPATH '/clickhouse/tables/01/mydb/my_replicated_table';"
        )
      ).toBe(dedent`
        SYSTEM DROP REPLICA 'replica1'
        FROM
          ZKPATH '/clickhouse/tables/01/mydb/my_replicated_table';
      `);
    });

    it('formats SYSTEM DROP DATABASE REPLICA', () => {
      expect(format("SYSTEM DROP DATABASE REPLICA 'replica1' FROM DATABASE mydb;")).toBe(dedent`
        SYSTEM DROP DATABASE REPLICA 'replica1'
        FROM
          DATABASE mydb;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/show
  describe('SHOW statements', () => {
    it('formats SHOW CREATE TABLE with INTO OUTFILE and FORMAT', () => {
      expect(format("SHOW CREATE TABLE db.table INTO OUTFILE 'file.txt' FORMAT CSV;")).toBe(dedent`
        SHOW CREATE TABLE db.table
        INTO OUTFILE
          'file.txt'
        FORMAT
          CSV;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/explain
  describe('EXPLAIN statements', () => {
    it('formats EXPLAIN SELECT with UNION ALL and ORDER BY', () => {
      expect(
        format(
          'EXPLAIN AST SELECT sum(number) FROM numbers(10) UNION ALL SELECT sum(number) FROM numbers(10) ORDER BY sum(number) ASC FORMAT TSV;'
        )
      ).toBe(dedent`
        EXPLAIN AST SELECT sum(number)
        FROM
          numbers(10)
        UNION ALL
        SELECT
          sum(number)
        FROM
          numbers(10)
        ORDER BY
          sum(number) ASC
        FORMAT
          TSV;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/attach
  describe('ATTACH statements', () => {
    it('formats ATTACH DATABASE with ON CLUSTER and SYNC', () => {
      expect(format('ATTACH DATABASE IF NOT EXISTS test_db ON CLUSTER prod;')).toBe(dedent`
        ATTACH DATABASE IF NOT EXISTS test_db
        ON CLUSTER prod;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/detach
  describe('DETACH statements', () => {
    it('formats DETACH DATABASE with ON CLUSTER and SYNC', () => {
      expect(format('DETACH DATABASE test_db ON CLUSTER prod PERMANENTLY SYNC;')).toBe(dedent`
        DETACH DATABASE test_db
        ON CLUSTER prod
        PERMANENTLY
        SYNC;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/exists
  describe('EXISTS statements', () => {
    it('formats EXISTS TEMPORARY TABLE', () => {
      expect(format('EXISTS TEMPORARY TABLE temp_data;')).toBe(dedent`
        EXISTS TEMPORARY TABLE temp_data;
      `);
    });

    it('formats EXISTS with FORMAT', () => {
      expect(format('EXISTS TABLE events FORMAT TabSeparated;')).toBe(dedent`
        EXISTS TABLE events
        FORMAT
          TabSeparated;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/kill
  describe('KILL statements', () => {
    it('formats KILL QUERY with SYNC', () => {
      expect(format("KILL QUERY WHERE user = 'john' SYNC;")).toBe(dedent`
        KILL QUERY
        WHERE
          user = 'john'
        SYNC;
      `);
    });

    it('formats KILL QUERY with ON CLUSTER and FORMAT', () => {
      expect(format('KILL QUERY ON CLUSTER prod WHERE elapsed > 300 FORMAT JSON;')).toBe(dedent`
        KILL QUERY
        ON CLUSTER prod
        WHERE
          elapsed > 300
        FORMAT
          JSON;
      `);
    });

    it('formats KILL QUERY with TEST', () => {
      expect(format('KILL QUERY WHERE query_duration_ms > 60000 TEST;')).toBe(dedent`
        KILL QUERY
        WHERE
          query_duration_ms > 60000 TEST;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/optimize
  describe('OPTIMIZE statements', () => {
    it('formats OPTIMIZE TABLE with FINAL', () => {
      expect(format('OPTIMIZE TABLE my_table FINAL;')).toBe(dedent`
        OPTIMIZE TABLE my_table FINAL;
      `);
    });

    it('formats OPTIMIZE TABLE with PARTITION and DEDUPLICATE', () => {
      expect(format('OPTIMIZE TABLE events PARTITION 202501 DEDUPLICATE;')).toBe(dedent`
        OPTIMIZE TABLE events PARTITION 202501 DEDUPLICATE;
      `);
    });

    it('formats OPTIMIZE TABLE with ON CLUSTER and DEDUPLICATE BY', () => {
      expect(format('OPTIMIZE TABLE logs ON CLUSTER prod DEDUPLICATE BY user_id, timestamp;'))
        .toBe(dedent`
          OPTIMIZE TABLE logs
          ON CLUSTER prod
          DEDUPLICATE BY
            user_id,
            timestamp;
        `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/rename
  describe('RENAME statements', () => {
    it('formats RENAME TABLE', () => {
      expect(format('RENAME DATABASE atomic_database1 TO atomic_database2 ON CLUSTER production;'))
        .toBe(dedent`
          RENAME DATABASE atomic_database1
          TO atomic_database2
          ON CLUSTER production;
        `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/exchange
  describe('EXCHANGE statements', () => {
    it('formats EXCHANGE TABLES', () => {
      expect(format('EXCHANGE TABLES table1 AND table2;')).toBe(dedent`
        EXCHANGE TABLES table1
        AND table2;
      `);
    });

    it('formats EXCHANGE DICTIONARIES', () => {
      expect(format('EXCHANGE DICTIONARIES dict1 AND dict2;')).toBe(dedent`
        EXCHANGE DICTIONARIES dict1
        AND dict2;
      `);
    });

    it('formats EXCHANGE DICTIONARIES with databases and cluster', () => {
      expect(format('EXCHANGE DICTIONARIES db1.dict_A AND db2.dict_B ON CLUSTER prod;'))
        .toBe(dedent`
          EXCHANGE DICTIONARIES db1.dict_A
          AND db2.dict_B
          ON CLUSTER prod;
        `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/set-role
  describe('SET ROLE statements', () => {
    it('formats SET ROLE with multiple roles', () => {
      expect(format('SET ROLE admin, developer, analyst;')).toBe(dedent`
        SET ROLE
          admin,
          developer,
          analyst;
      `);
    });

    it('formats SET ROLE ALL', () => {
      expect(format('SET ROLE ALL;')).toBe(dedent`
        SET ROLE ALL;
      `);
    });

    it('formats SET ROLE ALL EXCEPT', () => {
      expect(format('SET ROLE ALL EXCEPT guest, readonly;')).toBe(dedent`
        SET ROLE ALL EXCEPT
          guest,
          readonly;
      `);
    });

    it('formats SET DEFAULT ROLE NONE', () => {
      expect(format('SET DEFAULT ROLE NONE TO john;')).toBe(dedent`
        SET DEFAULT ROLE NONE
        TO john;
      `);
    });

    it('formats SET DEFAULT ROLE with single role to multiple users', () => {
      expect(format('SET DEFAULT ROLE admin TO john, alice;')).toBe(dedent`
        SET DEFAULT ROLE
          admin
        TO john,
        alice;
      `);
    });

    it('formats SET DEFAULT ROLE with multiple roles', () => {
      expect(format('SET DEFAULT ROLE admin, developer TO john;')).toBe(dedent`
        SET DEFAULT ROLE
          admin,
          developer
        TO john;
      `);
    });

    it('formats SET DEFAULT ROLE ALL to CURRENT_USER', () => {
      expect(format('SET DEFAULT ROLE ALL TO CURRENT_USER;')).toBe(dedent`
        SET DEFAULT ROLE ALL
        TO CURRENT_USER;
      `);
    });

    it('formats SET DEFAULT ROLE ALL EXCEPT', () => {
      expect(format('SET DEFAULT ROLE ALL EXCEPT guest TO john, alice;')).toBe(dedent`
        SET DEFAULT ROLE ALL EXCEPT
          guest
        TO john,
        alice;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/execute_as
  describe('EXECUTE AS statements', () => {
    it('formats EXECUTE AS with SELECT', () => {
      expect(format('EXECUTE AS james SELECT currentUser(), authenticatedUser();')).toBe(dedent`
        EXECUTE AS james
        SELECT
          currentUser(),
          authenticatedUser();
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/move
  describe('MOVE statements', () => {
    it('formats MOVE USER', () => {
      expect(format('MOVE USER john, alice TO disk_storage;')).toBe(dedent`
        MOVE USER
          john,
          alice
        TO disk_storage;
      `);
    });

    it('formats MOVE ROLE', () => {
      expect(format('MOVE ROLE admin, developer TO local_directory;')).toBe(dedent`
        MOVE ROLE
          admin,
          developer
        TO local_directory;
      `);
    });

    it('formats MOVE QUOTA', () => {
      expect(format('MOVE QUOTA user_quota TO replicated_storage;')).toBe(dedent`
        MOVE QUOTA
          user_quota
        TO replicated_storage;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/check-grant
  describe('CHECK GRANT statements', () => {
    it('formats CHECK GRANT with simple privilege', () => {
      expect(format('CHECK GRANT SELECT ON db.table')).toBe(dedent`
        CHECK GRANT
          SELECT ON db.table
      `);
    });

    it('formats CHECK GRANT with column list', () => {
      expect(format('CHECK GRANT SELECT(id, name) ON db.table')).toBe(dedent`
        CHECK GRANT
          SELECT (id, name) ON db.table
      `);
    });

    // This one is unfortunately ugly because SELECT is a
    // tabular one-line clause, and we can't make it not one.
    it('formats CHECK GRANT with multiple privileges', () => {
      expect(format('CHECK GRANT SELECT, INSERT ON db.table')).toBe(dedent`
        CHECK GRANT
          SELECT,
          INSERT ON db.table
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/undrop
  describe('UNDROP statements', () => {
    it('formats simple UNDROP TABLE', () => {
      expect(format('UNDROP TABLE my_table;')).toBe(dedent`
        UNDROP TABLE my_table;
      `);
    });

    it('formats UNDROP TABLE with UUID', () => {
      expect(format("UNDROP TABLE my_table UUID '550e8400-e29b-41d4-a716-446655440000';"))
        .toBe(dedent`
        UNDROP TABLE my_table UUID '550e8400-e29b-41d4-a716-446655440000';
      `);
    });

    it('formats UNDROP TABLE with database and ON CLUSTER', () => {
      expect(format('UNDROP TABLE db.my_table ON CLUSTER production;')).toBe(dedent`
        UNDROP TABLE db.my_table
        ON CLUSTER production;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/create/table#replace-table
  describe('REPLACE TABLE statements', () => {
    it('formats REPLACE TABLE with ENGINE, ORDER BY, and SELECT', () => {
      expect(
        format(
          'REPLACE TABLE myOldTable ENGINE = MergeTree() ORDER BY CounterID AS SELECT * FROM myOldTable WHERE CounterID <12345;'
        )
      ).toBe(dedent`
        REPLACE TABLE myOldTable ENGINE = MergeTree()
        ORDER BY
          CounterID AS
        SELECT
          *
        FROM
          myOldTable
        WHERE
          CounterID < 12345;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/create/view#refreshable-materialized-view
  describe('Refreshable materialized view statements', () => {
    it('formats CREATE MATERIALIZED VIEW with REFRESH EVERY', () => {
      expect(
        format('CREATE MATERIALIZED VIEW mv1 REFRESH EVERY 1 HOUR AS SELECT * FROM source_table;')
      ).toBe(
        dedent`
          CREATE MATERIALIZED VIEW mv1
          REFRESH EVERY 1 HOUR AS
          SELECT
            *
          FROM
            source_table;
        `
      );
    });

    it('formats CREATE MATERIALIZED VIEW with REFRESH AFTER and OFFSET', () => {
      expect(
        format(
          'CREATE MATERIALIZED VIEW mv2 REFRESH AFTER 30 MINUTE OFFSET 5 MINUTE AS SELECT count() FROM events;'
        )
      ).toBe(dedent`
        CREATE MATERIALIZED VIEW mv2
        REFRESH AFTER 30 MINUTE OFFSET 5 MINUTE AS
        SELECT
          count()
        FROM
          events;
      `);
    });

    it('formats CREATE MATERIALIZED VIEW with RANDOMIZE FOR', () => {
      expect(
        format(
          'CREATE MATERIALIZED VIEW mv3 REFRESH EVERY 1 DAY RANDOMIZE FOR 2 HOUR AS SELECT * FROM logs;'
        )
      ).toBe(dedent`
        CREATE MATERIALIZED VIEW mv3
        REFRESH EVERY 1 DAY
        RANDOMIZE FOR 2 HOUR AS
        SELECT
          *
        FROM
          logs;
      `);
    });

    it('formats CREATE MATERIALIZED VIEW with DEPENDS ON', () => {
      expect(
        format(
          'CREATE MATERIALIZED VIEW mv4 REFRESH EVERY 1 HOUR DEPENDS ON table1, table2 AS SELECT * FROM combined;'
        )
      ).toBe(dedent`
        CREATE MATERIALIZED VIEW mv4
        REFRESH EVERY 1 HOUR
        DEPENDS ON
          table1,
          table2 AS
        SELECT
          *
        FROM
          combined;
      `);
    });

    it('formats CREATE MATERIALIZED VIEW with APPEND TO', () => {
      expect(
        format(
          'CREATE MATERIALIZED VIEW mv5 REFRESH EVERY 1 HOUR APPEND TO target_table AS SELECT * FROM source;'
        )
      ).toBe(dedent`
        CREATE MATERIALIZED VIEW mv5
        REFRESH EVERY 1 HOUR
        APPEND TO target_table AS
        SELECT
          *
        FROM
          source;
      `);
    });

    it('formats complex refreshable materialized view with multiple clauses', () => {
      expect(
        format(
          "CREATE MATERIALIZED VIEW IF NOT EXISTS mv6 ON CLUSTER prod REFRESH EVERY 1 HOUR RANDOMIZE FOR 30 MINUTE DEPENDS ON table1 APPEND SETTINGS max_threads = 4 AS SELECT date, count() as cnt FROM events GROUP BY date COMMENT 'Hourly aggregation';"
        )
      ).toBe(dedent`
        CREATE MATERIALIZED VIEW IF NOT EXISTS mv6
        ON CLUSTER prod
        REFRESH EVERY 1 HOUR
        RANDOMIZE FOR 30 MINUTE
        DEPENDS ON
          table1
        APPEND
        SETTINGS
          max_threads = 4 AS
        SELECT
          date,
          count() as cnt
        FROM
          events
        GROUP BY
          date COMMENT 'Hourly aggregation';
      `);
    });
  });

  describe('CREATE FUNCTION statements', () => {
    it('formats CREATE FUNCTION with simple function', () => {
      expect(format('CREATE FUNCTION my_function AS (x) -> x + 1;')).toBe(dedent`
        CREATE FUNCTION my_function AS (x) -> x + 1;
      `);
    });

    it('formats CREATE FUNCTION with extra syntax', () => {
      expect(format('CREATE FUNCTION linear_equation AS (x, k, b) -> k*x + b;')).toBe(dedent`
        CREATE FUNCTION linear_equation AS (x, k, b) -> k * x + b;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/grant
  describe('GRANT statements', () => {
    it('formats GRANT SELECT with column list and WITH GRANT OPTION', () => {
      expect(format('GRANT SELECT(x,y) ON db.table TO john WITH GRANT OPTION')).toBe(dedent`
        GRANT
          SELECT (x, y) ON db.table
        TO john
        WITH GRANT OPTION
      `);
    });

    it('formats GRANT ALTER MATERIALIZE STATISTICS', () => {
      expect(format('GRANT ALTER MATERIALIZE STATISTICS on db.table TO john WITH GRANT OPTION'))
        .toBe(dedent`
        GRANT
          ALTER MATERIALIZE STATISTICS on db.table
        TO john
        WITH GRANT OPTION
      `);
    });

    it('formats GRANT SELECT with column list', () => {
      expect(format('GRANT SELECT(x,y) ON db.table TO john')).toBe(dedent`
        GRANT
          SELECT (x, y) ON db.table
        TO john
      `);
    });

    it('formats GRANT READ ON S3 with complex regex pattern', () => {
      expect(format("GRANT READ ON S3('s3://mybucket/data/2024/.*\\.parquet') TO analyst"))
        .toBe(dedent`
          GRANT
            READ ON S3 ('s3://mybucket/data/2024/.*\\.parquet')
          TO analyst
        `);
    });

    it('formats GRANT CURRENT GRANTS', () => {
      expect(format('GRANT CURRENT GRANTS(READ ON S3) TO alice')).toBe(dedent`
        GRANT CURRENT GRANTS (READ ON S3)
        TO alice
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/revoke
  describe('REVOKE statements', () => {
    // These are a little ugly, because `ON` should be treated as a
    // tabular one-line clause in this statement. But if we make it
    // one, it'll make JOINs ugly (along with a bunch of other things).

    it('formats REVOKE SELECT with wildcard', () => {
      expect(format('REVOKE SELECT ON accounts.* FROM john;')).toBe(dedent`
        REVOKE
          SELECT ON accounts.*
        FROM
          john;
      `);
    });

    it('formats REVOKE SELECT with column list', () => {
      expect(format('REVOKE SELECT(wage), SELECT(id) ON accounts.staff FROM mira;')).toBe(dedent`
        REVOKE
          SELECT (wage),
          SELECT (id) ON accounts.staff
        FROM
          mira;
      `);
    });

    it('formats REVOKE with ON CLUSTER and ADMIN OPTION', () => {
      expect(format('REVOKE ON CLUSTER foo role FROM john;')).toBe(dedent`
        REVOKE ON CLUSTER foo role
        FROM
          john;
      `);
      expect(format('REVOKE ON CLUSTER foo ADMIN OPTION FOR role FROM john;')).toBe(dedent`
        REVOKE ON CLUSTER foo
        ADMIN OPTION FOR role
        FROM
          john;
      `);
    });

    it('formats REVOKE with ALL EXCEPT', () => {
      expect(format('REVOKE ON CLUSTER foo ADMIN OPTION FOR role FROM john, matt ALL EXCEPT foo;'))
        .toBe(dedent`
        REVOKE ON CLUSTER foo
        ADMIN OPTION FOR role
        FROM
          john,
          matt
        ALL EXCEPT foo;
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/check-table
  describe('CHECK TABLE statements', () => {
    it('formats simple CHECK TABLE', () => {
      expect(format('CHECK TABLE test_table;')).toBe(dedent`
        CHECK TABLE test_table;
      `);
    });

    it('formats CHECK TABLE with PARTITION, FORMAT, and SETTINGS', () => {
      expect(
        format(
          "CHECK TABLE t0 PARTITION ID '201003' FORMAT PrettyCompactMonoBlock SETTINGS check_query_single_value_result = 0"
        )
      ).toBe(dedent`
        CHECK TABLE t0
        PARTITION ID '201003'
        FORMAT
          PrettyCompactMonoBlock
        SETTINGS
          check_query_single_value_result = 0
      `);
    });

    it('formats CHECK TABLE with PART', () => {
      expect(format("CHECK TABLE t0 PART '201003_111_222_0'")).toBe(dedent`
        CHECK TABLE t0 PART '201003_111_222_0'
      `);
    });
  });

  // https://clickhouse.com/docs/sql-reference/statements/describe-table
  describe('DESCRIBE TABLE statements', () => {
    expect(format('DESCRIBE TABLE table1;')).toBe(dedent`
      DESCRIBE TABLE table1;
    `);
    expect(format('DESC TABLE table1;')).toBe(dedent`
      DESC TABLE table1;
    `);
  });

  // https://clickhouse.com/docs/sql-reference/statements/parallel_with
  describe('PARALLEL WITH statements', () => {
    expect(
      format(`
        CREATE TABLE table1(x Int32) ENGINE = MergeTree ORDER BY tuple()
        PARALLEL WITH
        CREATE TABLE table2(y String) ENGINE = MergeTree ORDER BY tuple();
      `)
    ).toBe(dedent`
      CREATE TABLE table1 (x Int32) ENGINE = MergeTree
      ORDER BY
        tuple()
      PARALLEL WITH
      CREATE TABLE table2 (y String) ENGINE = MergeTree
      ORDER BY
        tuple();
    `);
  });
});
