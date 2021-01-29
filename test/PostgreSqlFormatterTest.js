import dedent from 'dedent-js';
import * as sqlFormatter from '../src/sqlFormatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';
import supportsAlterTable from './features/alterTable';
import supportsBetween from './features/between';
import supportsCase from './features/case';
import supportsCreateTable from './features/createTable';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';

describe('PostgreSqlFormatter', () => {
  const format = (query, cfg = {}) =>
    sqlFormatter.format(query, { ...cfg, language: 'postgresql' });

  behavesLikeSqlFormatter(format);
  supportsCase(format);
  supportsCreateTable(format);
  supportsAlterTable(format);
  supportsStrings(format, ['""', "''", 'U&""', "U&''", '$$']);
  supportsBetween(format);
  supportsSchema(format);
  supportsOperators(format, [
    '%',
    '^',
    '!',
    '!!',
    '@',
    '!=',
    '&',
    '|',
    '~',
    '#',
    '<<',
    '>>',
    '||/',
    '|/',
    '::',
    '->>',
    '->',
    '~~*',
    '~~',
    '!~~*',
    '!~~',
    '~*',
    '!~*',
    '!~',
  ]);
  supportsJoin(format);

  it('supports $placeholders', () => {
    const result = format('SELECT $1, $2 FROM tbl');
    expect(result).toBe(dedent`
      SELECT
        $1,
        $2
      FROM
        tbl
    `);
  });

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
