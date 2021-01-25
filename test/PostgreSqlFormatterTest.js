import dedent from 'dedent-js';
import * as sqlFormatter from '../src/sqlFormatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';
import supportsAlterTable from './features/alterTable';
import supportsCase from './features/case';
import supportsCreateTable from './features/createTable';
import supportsStrings from './features/strings';

describe('PostgreSqlFormatter', () => {
  const format = (query, cfg = {}) =>
    sqlFormatter.format(query, { ...cfg, language: 'postgresql' });

  behavesLikeSqlFormatter(format);
  supportsCase(format);
  supportsCreateTable(format);
  supportsAlterTable(format);
  supportsStrings(format, ['""', "''", 'U&""', "U&''", '$$']);

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

  it('formats PostgreSQL specific operators', () => {
    expect(format('column::int')).toBe('column :: int');
    expect(format('v->2')).toBe('v -> 2');
    expect(format('v->>2')).toBe('v ->> 2');
    expect(format("foo ~~ 'hello'")).toBe("foo ~~ 'hello'");
    expect(format("foo !~ 'hello'")).toBe("foo !~ 'hello'");
    expect(format("foo ~* 'hello'")).toBe("foo ~* 'hello'");
    expect(format("foo ~~* 'hello'")).toBe("foo ~~* 'hello'");
    expect(format("foo !~~ 'hello'")).toBe("foo !~~ 'hello'");
    expect(format("foo !~* 'hello'")).toBe("foo !~* 'hello'");
    expect(format("foo !~~* 'hello'")).toBe("foo !~~* 'hello'");
    expect(format('@ foo')).toBe('@ foo');
    expect(format('foo << 2')).toBe('foo << 2');
    expect(format('foo >> 2')).toBe('foo >> 2');
    expect(format('|/ foo')).toBe('|/ foo');
    expect(format('||/ foo')).toBe('||/ foo');
  });
});
