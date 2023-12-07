import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter.js';
import supportsAlterTable from './features/alterTable.js';
import supportsCommentOn from './features/commentOn.js';
import supportsComments from './features/comments.js';
import supportsCreateTable from './features/createTable.js';
import supportsCreateView from './features/createView.js';
import supportsDeleteFrom from './features/deleteFrom.js';
import supportsDropTable from './features/dropTable.js';
import supportsIdentifiers from './features/identifiers.js';
import supportsInsertInto from './features/insertInto.js';
import supportsJoin from './features/join.js';
import supportsLimiting from './features/limiting.js';
import supportsOperators from './features/operators.js';
import supportsSetOperations from './features/setOperations.js';
import supportsStrings from './features/strings.js';
import supportsTruncateTable from './features/truncateTable.js';
import supportsUpdate from './features/update.js';
import supportsParams from './options/param.js';
import supportsDataTypeCase from './options/dataTypeCase.js';

describe('RedshiftFormatter', () => {
  const language = 'redshift';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format);
  supportsCommentOn(format);
  supportsCreateView(format, { orReplace: true, materialized: true });
  supportsCreateTable(format, { ifNotExists: true });
  supportsDropTable(format, { ifExists: true });
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
    renameTo: true,
    renameColumn: true,
  });
  supportsDeleteFrom(format, { withoutFrom: true });
  supportsInsertInto(format);
  supportsUpdate(format);
  supportsTruncateTable(format, { withoutTable: true });
  supportsStrings(format, ["''-qq"]);
  supportsIdentifiers(format, [`""-qq`]);
  // Missing: '#' and '::' operator (tested separately)
  supportsOperators(format, ['^', '%', '@', '|/', '||/', '&', '|', '~', '<<', '>>', '||'], {
    any: true,
  });
  supportsJoin(format);
  supportsSetOperations(format, ['UNION', 'UNION ALL', 'EXCEPT', 'INTERSECT', 'MINUS']);
  supportsParams(format, { numbered: ['$'] });
  supportsLimiting(format, { limit: true, offset: true });
  supportsDataTypeCase(format);

  it('formats type-cast operator without spaces', () => {
    expect(format('SELECT 2 :: numeric AS foo;')).toBe(dedent`
      SELECT
        2::numeric AS foo;
    `);
  });

  it('formats LIMIT', () => {
    expect(format('SELECT col1 FROM tbl ORDER BY col2 DESC LIMIT 10;')).toBe(dedent`
      SELECT
        col1
      FROM
        tbl
      ORDER BY
        col2 DESC
      LIMIT
        10;
    `);
  });

  it('formats only -- as a line comment', () => {
    const result = format(`
      SELECT col FROM
      -- This is a comment
      MyTable;
    `);
    expect(result).toBe(dedent`
      SELECT
        col
      FROM
        -- This is a comment
        MyTable;
    `);
  });

  // Regression test for sql-formatter#358
  it('formats temp table name starting with #', () => {
    expect(format(`CREATE TABLE #tablename AS tbl;`)).toBe(
      dedent`
        CREATE TABLE #tablename AS tbl;
      `
    );
  });

  it('formats DISTKEY and SORTKEY after CREATE TABLE', () => {
    expect(
      format(
        'CREATE TABLE items (a INT PRIMARY KEY, b TEXT, c INT NOT NULL, d INT NOT NULL, e INT NOT NULL) DISTKEY(created_at) SORTKEY(created_at);'
      )
    ).toBe(dedent`
      CREATE TABLE items (
        a INT PRIMARY KEY,
        b TEXT,
        c INT NOT NULL,
        d INT NOT NULL,
        e INT NOT NULL
      ) DISTKEY (created_at) SORTKEY (created_at);
    `);
  });

  // This is far from ideal, but at least the formatter doesn't crash :P
  it('formats COPY', () => {
    expect(
      format(`
        COPY schema.table
        FROM 's3://bucket/file.csv'
        IAM_ROLE 'arn:aws:iam::123456789:role/rolename'
        FORMAT AS CSV DELIMITER ',' QUOTE '"'
        REGION AS 'us-east-1'
      `)
    ).toBe(dedent`
      COPY schema.table
      FROM
        's3://bucket/file.csv' IAM_ROLE 'arn:aws:iam::123456789:role/rolename' FORMAT AS CSV DELIMITER ',' QUOTE '"' REGION AS 'us-east-1'
    `);
  });

  it('formats ALTER TABLE ... ALTER COLUMN', () => {
    expect(
      format(
        `ALTER TABLE t ALTER COLUMN foo TYPE VARCHAR;
         ALTER TABLE t ALTER COLUMN foo ENCODE my_encoding;`
      )
    ).toBe(dedent`
      ALTER TABLE t
      ALTER COLUMN foo
      TYPE VARCHAR;

      ALTER TABLE t
      ALTER COLUMN foo
      ENCODE my_encoding;
    `);
  });
});
