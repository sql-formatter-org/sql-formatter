import dedent from 'dedent-js';
import * as sqlFormatter from '../src/sqlFormatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';
import supportsAlterTable from './features/alterTable';
import supportsCase from './features/case';
import supportsCreateTable from './features/createTable';
import supportsStrings from './features/strings';

describe('PostgreSqlFormatter', () => {
  behavesLikeSqlFormatter('postgresql');
  supportsCase('postgresql');
  supportsCreateTable('postgresql');
  supportsAlterTable('postgresql');
  supportsStrings('postgresql', ['""', "''", 'U&""', "U&''"]);

  const format = (query, cfg = {}) =>
    sqlFormatter.format(query, { ...cfg, language: 'postgresql' });

  it('replaces $placeholders with param values', () => {
    const result = format('SELECT $1, $2 FROM tbl', {
      params: { 1: '"variable value"', 2: '"blah"' },
    });
    expect(result).toBe(dedent`
      SELECT
        "variable value",
        "blah"
      FROM
        tbl
    `);
  });
});
