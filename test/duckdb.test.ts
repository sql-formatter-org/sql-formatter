import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';

import behavesLikeSqlFormatter from './behavesLikeSqlFormatter.js';
import behavesLikePostgresqlFormatter from './behavesLikePostgresqlFormatter.js';
import supportsAlterTable from './features/alterTable.js';
import supportsBetween from './features/between.js';
import supportsCreateTable from './features/createTable.js';
import supportsDropTable from './features/dropTable.js';
import supportsJoin from './features/join.js';
import supportsOperators from './features/operators.js';
import supportsStrings from './features/strings.js';
import supportsReturning from './features/returning.js';
import supportsDeleteFrom from './features/deleteFrom.js';
import supportsComments from './features/comments.js';
import supportsCommentOn from './features/commentOn.js';
import supportsIdentifiers from './features/identifiers.js';
import supportsParams from './options/param.js';
import supportsArrayAndMapAccessors from './features/arrayAndMapAccessors.js';
import supportsWindow from './features/window.js';
import supportsSetOperations from './features/setOperations.js';
import supportsLimiting from './features/limiting.js';
import supportsInsertInto from './features/insertInto.js';
import supportsUpdate from './features/update.js';
import supportsCreateView from './features/createView.js';
import supportsOnConflict from './features/onConflict.js';
import supportsIsDistinctFrom from './features/isDistinctFrom.js';
import supportsArrayLiterals from './features/arrayLiterals.js';
import supportsDataTypeCase from './options/dataTypeCase.js';
import supportsTruncateTable from './features/truncateTable.js';

describe('DuckDBFormatter', () => {
  const language = 'duckdb';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  behavesLikePostgresqlFormatter(format);
  supportsComments(format, { nestedBlockComments: true });
  supportsCommentOn(format);
  supportsCreateView(format, { orReplace: true, ifNotExists: true });
  supportsCreateTable(format, { orReplace: true, ifNotExists: true });
  supportsDropTable(format, { ifExists: true });
  supportsArrayLiterals(format, { withoutArrayPrefix: true });
  supportsArrayAndMapAccessors(format);
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
  supportsTruncateTable(format, { withTable: false, withoutTable: true });
  supportsStrings(format, ["''-qq", "X''", "B''", "E''", '$$']);
  supportsIdentifiers(format, [`""-qq`]);
  supportsBetween(format);
  // Missing: '::' type cast (tested separately)
  supportsOperators(
    format,
    [
      // Arithmetic:
      '//',
      '%',
      '**',
      '^',
      '!',
      // Bitwise:
      '&',
      '|',
      '~',
      '<<',
      '>>',
      // Comparison:
      '==',
      // Lambda:
      '->',
      // Named function params:
      ':=',
      '=>',
      // Pattern matching:
      '~~',
      '!~~',
      '~~*',
      '!~~*',
      '~~~',
      // Regular expressions:
      '~',
      '!~',
      '~*',
      '!~*',
      // String:
      '^@',
      '||',
      // INET extension:
      '>>=',
      '<<=',
    ],
    { any: true }
  );
  supportsIsDistinctFrom(format);
  supportsJoin(format, {
    additionally: [
      'ASOF JOIN',
      'ASOF INNER JOIN',
      'ASOF LEFT JOIN',
      'ASOF LEFT OUTER JOIN',
      'ASOF RIGHT JOIN',
      'ASOF RIGHT OUTER JOIN',
      'ASOF FULL JOIN',
      'ASOF FULL OUTER JOIN',
      'POSITIONAL JOIN',
      'SEMI JOIN',
      'ANTI JOIN',
    ],
  });
  supportsSetOperations(format, [
    'UNION',
    'UNION ALL',
    'UNION BY NAME',
    'EXCEPT',
    'EXCEPT ALL',
    'INTERSECT',
    'INTERSECT ALL',
  ]);
  supportsReturning(format);
  // TODO: named params $foo currently conflict with $$-quoted strings
  supportsParams(format, { positional: true, numbered: ['$'], quoted: ['$""'] });
  supportsWindow(format);
  supportsLimiting(format, { limit: true, offset: true });
  supportsDataTypeCase(format);

  it('formats TIMESTAMP WITH TIME ZONE syntax', () => {
    expect(
      format(`
        CREATE TABLE time_table (id INT PRIMARY KEY NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE);`)
    ).toBe(dedent`
      CREATE TABLE time_table (
        id INT PRIMARY KEY NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE
      );
    `);
  });

  it('formats JSON data type', () => {
    expect(
      format(`CREATE TABLE foo (bar json, baz json);`, {
        dataTypeCase: 'upper',
      })
    ).toBe('CREATE TABLE foo (bar JSON, baz JSON);');
  });
});
