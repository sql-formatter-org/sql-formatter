import dedent from 'dedent-js';
import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter.js';

import supportsCreateTable from './features/createTable.js';
import supportsDropTable from './features/dropTable.js';
import supportsAlterTable from './features/alterTable.js';
import supportsSchema from './features/schema.js';
import supportsStrings from './features/strings.js';
import supportsBetween from './features/between.js';
import supportsJoin from './features/join.js';
import supportsOperators from './features/operators.js';
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
import supportsCreateView from './features/createView.js';
import supportsOnConflict from './features/onConflict.js';
import supportsDataTypeCase from './options/dataTypeCase.js';

describe('SqliteFormatter', () => {
  const language = 'sqlite';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format);
  supportsCreateView(format, { ifNotExists: true });
  supportsCreateTable(format, { ifNotExists: true });
  supportsDropTable(format, { ifExists: true });
  supportsConstraints(format, ['SET NULL', 'SET DEFAULT', 'CASCADE', 'RESTRICT', 'NO ACTION']);
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
    renameTo: true,
    renameColumn: true,
  });
  supportsDeleteFrom(format);
  supportsInsertInto(format);
  supportsOnConflict(format);
  supportsUpdate(format);
  supportsStrings(format, ["''-qq", "X''"]);
  supportsIdentifiers(format, [`""-qq`, '``', '[]']);
  supportsBetween(format);
  supportsSchema(format);
  supportsJoin(format);
  supportsSetOperations(format, ['UNION', 'UNION ALL', 'EXCEPT', 'INTERSECT']);
  supportsOperators(format, ['%', '~', '&', '|', '<<', '>>', '==', '->', '->>', '||']);
  supportsParams(format, { positional: true, numbered: ['?'], named: [':', '$', '@'] });
  supportsWindow(format);
  supportsLimiting(format, { limit: true, offset: true });
  supportsDataTypeCase(format);

  it('supports REPLACE INTO syntax', () => {
    expect(format(`REPLACE INTO tbl VALUES (1,'Leopard'),(2,'Dog');`)).toBe(dedent`
      REPLACE INTO
        tbl
      VALUES
        (1, 'Leopard'),
        (2, 'Dog');
    `);
  });

  it('supports ON CONFLICT .. DO UPDATE syntax', () => {
    expect(format(`INSERT INTO tbl VALUES (1,'Leopard') ON CONFLICT DO UPDATE SET foo=1;`))
      .toBe(dedent`
      INSERT INTO
        tbl
      VALUES
        (1, 'Leopard')
      ON CONFLICT DO UPDATE
      SET
        foo = 1;
    `);
  });
});
