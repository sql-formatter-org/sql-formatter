import dedent from 'dedent-js';
import { format as originalFormat, FormatFn } from '../src/sqlFormatter';
import PostgreSqlFormatter from '../src/languages/postgresql.formatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsAlterTable from './features/alterTable';
import supportsBetween from './features/between';
import supportsCase from './features/case';
import supportsCreateTable from './features/createTable';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';
import supportsReturning from './features/returning';
import supportsConstraints from './features/constraints';
import supportsDeleteFrom from './features/deleteFrom';

describe('PostgreSqlFormatter', () => {
  const language = 'postgresql';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(language, format);
  supportsCase(language, format);
  supportsCreateTable(language, format);
  supportsConstraints(language, format);
  supportsAlterTable(language, format);
  supportsDeleteFrom(language, format);
  supportsStrings(language, format, PostgreSqlFormatter.stringTypes);
  supportsBetween(language, format);
  supportsSchema(language, format);
  supportsOperators(
    language,
    format,
    PostgreSqlFormatter.operators,
    PostgreSqlFormatter.reservedLogicalOperators
  );
  supportsJoin(language, format);
  supportsReturning(language, format);

  it('supports $n placeholders', () => {
    const result = format('SELECT $1, $2 FROM tbl');
    expect(result).toBe(dedent`
      SELECT
        $1,
        $2
      FROM
        tbl
    `);
  });

  it('replaces $n placeholders with param values', () => {
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

  it('supports :name placeholders', () => {
    expect(format('foo = :bar')).toBe('foo = :bar');
  });

  it('replaces :name placeholders with param values', () => {
    expect(
      format(`foo = :bar AND :"field" = 10 OR col = :'val'`, {
        params: { bar: "'Hello'", field: 'some_col', val: '7' },
      })
    ).toBe(dedent`
      foo = 'Hello'
      AND some_col = 10
      OR col = 7
    `);
  });
});
