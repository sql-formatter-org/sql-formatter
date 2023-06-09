import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter.js';

import supportsCreateTable from './features/createTable.js';
import supportsDropTable from './features/dropTable.js';
import supportsAlterTable from './features/alterTable.js';
import supportsStrings from './features/strings.js';
import supportsBetween from './features/between.js';
import supportsOperators from './features/operators.js';
import supportsJoin from './features/join.js';
import supportsConstraints from './features/constraints.js';
import supportsDeleteFrom from './features/deleteFrom.js';
import supportsComments from './features/comments.js';
import supportsIdentifiers from './features/identifiers.js';
import supportsParams from './options/param.js';
import supportsWindow from './features/window.js';
import supportsSetOperations from './features/setOperations.js';
import supportsLimiting from './features/limiting.js';
import supportsInsertInto from './features/insertInto.js';
import supportsUpdate from './features/update.js';
import supportsTruncateTable from './features/truncateTable.js';
import supportsMergeInto from './features/mergeInto.js';
import supportsCreateView from './features/createView.js';

describe('TransactSqlFormatter', () => {
  const language = 'transactsql';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format, { nestedBlockComments: true });
  supportsCreateView(format, { materialized: true });
  supportsCreateTable(format);
  supportsDropTable(format, { ifExists: true });
  supportsConstraints(format, ['SET NULL', 'SET DEFAULT', 'CASCADE', 'NO ACTION']);
  supportsAlterTable(format, {
    dropColumn: true,
  });
  supportsDeleteFrom(format);
  supportsInsertInto(format, { withoutInto: true });
  supportsUpdate(format, { whereCurrentOf: true });
  supportsTruncateTable(format);
  supportsMergeInto(format);
  supportsStrings(format, ["N''", "''-qq"]);
  supportsIdentifiers(format, [`""-qq`, '[]']);
  supportsBetween(format);
  // Missing: `::` scope resolution operator (tested separately)
  supportsOperators(format, [
    '%',
    '&',
    '|',
    '^',
    '~',
    '!<',
    '!>',
    '+=',
    '-=',
    '*=',
    '/=',
    '%=',
    '|=',
    '&=',
    '^=',
  ]);
  supportsJoin(format, { without: ['NATURAL'], supportsUsing: false, supportsApply: true });
  supportsSetOperations(format, ['UNION', 'UNION ALL', 'EXCEPT', 'INTERSECT']);
  supportsParams(format, { named: ['@'], quoted: ['@""', '@[]'] });
  supportsWindow(format);
  supportsLimiting(format, { offset: true, fetchFirst: true, fetchNext: true });

  it('supports language:tsql alias', () => {
    const result = originalFormat('SELECT [my column] FROM [my table];', { language: 'tsql' });
    expect(result).toBe(dedent`
      SELECT
        [my column]
      FROM
        [my table];
    `);
  });

  it('recognizes @, $, # as part of identifiers', () => {
    const result = format('SELECT from@bar, where#to, join$me FROM tbl;');
    expect(result).toBe(dedent`
      SELECT
        from@bar,
        where#to,
        join$me
      FROM
        tbl;
    `);
  });

  it('allows @ and # at the start of identifiers', () => {
    const result = format('SELECT @bar, #baz, @@some, ##flam FROM tbl;');
    expect(result).toBe(dedent`
      SELECT
        @bar,
        #baz,
        @@some,
        ##flam
      FROM
        tbl;
    `);
  });

  it('formats scope resolution operator without spaces', () => {
    expect(format('SELECT hierarchyid :: GetRoot();')).toBe(dedent`
      SELECT
        hierarchyid::GetRoot ();
    `);
  });

  it('formats ALTER TABLE ... ALTER COLUMN', () => {
    expect(format(`ALTER TABLE t ALTER COLUMN foo INT NOT NULL DEFAULT 5;`)).toBe(dedent`
      ALTER TABLE t
      ALTER COLUMN foo INT NOT NULL DEFAULT 5;
    `);
  });

  it('formats SET NOCOUNT ON; GO CREATE OR ALTER PROCEDURE', () => {
    const result = format('SET NOCOUNT ON; GO CREATE OR ALTER PROCEDURE p');
    expect(result).toBe(dedent`
    SET
    NOCOUNT ON;

    GO
    CREATE OR ALTER PROCEDURE
      p
    `);
  });

  it('formats SELECT ... INTO clause', () => {
    const result = format('SELECT col INTO #temp FROM tbl');
    expect(result).toBe(dedent`
    SELECT
      col
    INTO
      #temp
    FROM
      tbl
    `);
  });

  it('formats INSERT INTO', () => {
    const result = format("INSERT INTO tbl(firstName, lastName) VALUES('George', 'Orwell')");
    expect(result).toBe(dedent`
    INSERT INTO
      tbl (firstName, lastName)
    VALUES
      ('George', 'Orwell')
    `);
  });
});
