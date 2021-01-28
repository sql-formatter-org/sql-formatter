import dedent from 'dedent-js';
import * as sqlFormatter from '../src/sqlFormatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';
import supportsCase from './features/case';
import supportsCreateTable from './features/createTable';
import supportsAlterTable from './features/alterTable';
import supportsStrings from './features/strings';
import supportsBetween from './features/between';

describe('MariaDbFormatter', () => {
  const format = (query, cfg = {}) => sqlFormatter.format(query, { ...cfg, language: 'mariadb' });

  behavesLikeSqlFormatter(format);
  supportsCase(format);
  supportsCreateTable(format);
  supportsAlterTable(format);
  supportsStrings(format, ['""', "''", '``']);
  supportsBetween(format);

  it('formats MariaDb operators', () => {
    expect(format('foo != bar')).toBe('foo != bar');
    expect(format('foo <= bar')).toBe('foo <= bar');
    expect(format('foo >= bar')).toBe('foo >= bar');
    expect(format('foo <=> bar')).toBe('foo <=> bar');
    expect(format('foo << bar')).toBe('foo << bar');
    expect(format('foo >> bar')).toBe('foo >> bar');
    expect(format('foo && bar')).toBe('foo && bar');
    expect(format('foo || bar')).toBe('foo || bar');
    expect(format('foo := bar')).toBe('foo := bar');
  });

  it('supports # comments', () => {
    expect(format('SELECT a # comment\nFROM b # comment')).toBe(dedent`
      SELECT
        a # comment
      FROM
        b # comment
    `);
  });

  it('supports @variables', () => {
    expect(format('SELECT @foo, @bar')).toBe(dedent`
      SELECT
        @foo,
        @bar
    `);
  });

  it('supports setting variables: @var :=', () => {
    expect(format('SET @foo := (SELECT * FROM tbl);')).toBe(dedent`
      SET
        @foo := (
          SELECT
            *
          FROM
            tbl
        );
    `);
  });
});
