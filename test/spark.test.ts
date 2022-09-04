import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from 'src/sqlFormatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsAlterTable from './features/alterTable';
import supportsBetween from './features/between';
import supportsCreateTable from './features/createTable';
import supportsDropTable from './features/dropTable';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsStrings from './features/strings';
import supportsArrayAndMapAccessors from './features/arrayAndMapAccessors';
import supportsComments from './features/comments';
import supportsIdentifiers from './features/identifiers';
import supportsSetOperations from './features/setOperations';
import supportsLimiting from './features/limiting';
import supportsInsertInto from './features/insertInto';
import supportsTruncateTable from './features/truncateTable';
import supportsCreateView from './features/createView';

describe('SparkFormatter', () => {
  const language = 'spark';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format);
  supportsCreateView(format, { orReplace: true });
  supportsCreateTable(format, { ifNotExists: true });
  supportsDropTable(format, { ifExists: true });
  supportsAlterTable(format, {
    dropColumn: true,
    renameTo: true,
    renameColumn: true,
  });
  supportsInsertInto(format, { withoutInto: true });
  supportsTruncateTable(format);
  supportsStrings(format, ["''", '""', "X''", 'X""', "R''", 'R""']);
  supportsIdentifiers(format, ['``']);
  supportsBetween(format);
  supportsOperators(
    format,
    ['%', '~', '^', '|', '&', '<=>', '==', '!', '||', '->'],
    ['AND', 'OR', 'XOR']
  );
  supportsArrayAndMapAccessors(format);
  supportsJoin(format, {
    additionally: [
      // non-standard anti-join:
      'ANTI JOIN',
      'LEFT ANTI JOIN',
      'NATURAL ANTI JOIN',
      'NATURAL LEFT ANTI JOIN',
      // non-standard semi-join
      'SEMI JOIN',
      'LEFT SEMI JOIN',
      'NATURAL SEMI JOIN',
      'NATURAL LEFT SEMI JOIN',
    ],
  });
  supportsSetOperations(format);
  supportsLimiting(format, { limit: true });

  it('formats basic WINDOW clause', () => {
    const result = format(`SELECT * FROM tbl WINDOW win1, WINDOW win2, WINDOW win3;`);
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        tbl
      WINDOW
        win1,
      WINDOW
        win2,
      WINDOW
        win3;
    `);
  });

  it('formats window function and end as inline', () => {
    const result = format(
      `SELECT window(time, '1 hour').start AS window_start, window(time, '1 hour').end AS window_end FROM tbl;`
    );
    expect(result).toBe(dedent`
      SELECT
        window(time, '1 hour').start AS window_start,
        window(time, '1 hour').end AS window_end
      FROM
        tbl;
    `);
  });

  // eslint-disable-next-line no-template-curly-in-string
  it('recognizes ${name} substitution variables', () => {
    const result = format(
      // eslint-disable-next-line no-template-curly-in-string
      "SELECT ${var1}, ${ var 2 } FROM ${table_name} WHERE name = '${name}';"
    );
    expect(result).toBe(dedent`
      SELECT
        \${var1},
        \${ var 2 }
      FROM
        \${table_name}
      WHERE
        name = '\${name}';
    `);
  });

  it('supports SORT BY, CLUSTER BY, DISTRIBUTE BY', () => {
    const result = format(
      'SELECT value, count DISTRIBUTE BY count CLUSTER BY value SORT BY value, count;'
    );
    expect(result).toBe(dedent`
      SELECT
        value,
        count
      DISTRIBUTE BY
        count
      CLUSTER BY
        value
      SORT BY
        value,
        count;
    `);
  });

  it('formats ALTER TABLE ... ALTER COLUMN', () => {
    expect(format(`ALTER TABLE StudentInfo ALTER COLUMN FirstName COMMENT "new comment";`))
      .toBe(dedent`
      ALTER TABLE
        StudentInfo
      ALTER COLUMN
        FirstName COMMENT "new comment";
    `);
  });
});
