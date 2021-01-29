import dedent from 'dedent-js';
import * as sqlFormatter from '../src/sqlFormatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';
import supportsCase from './features/case';
import supportsCreateTable from './features/createTable';
import supportsAlterTable from './features/alterTable';
import supportsAlterTableModify from './features/alterTableModify';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';
import supportsBetween from './features/between';
import supportsJoin from './features/join';

describe('StandardSqlFormatter', () => {
  const format = (query, cfg = {}) => sqlFormatter.format(query, { ...cfg, language: 'sql' });

  behavesLikeSqlFormatter(format);
  supportsCase(format);
  supportsCreateTable(format);
  supportsAlterTable(format);
  supportsAlterTableModify(format);
  supportsStrings(format, ['""', "''"]);
  supportsBetween(format);
  supportsSchema(format);
  supportsJoin(format);

  it('formats INSERT without INTO', () => {
    const result = sqlFormatter.format(
      "INSERT Customers (ID, MoneyBalance, Address, City) VALUES (12,-123.4, 'Skagen 2111','Stv');"
    );
    expect(result).toBe(dedent`
      INSERT
        Customers (ID, MoneyBalance, Address, City)
      VALUES
        (12, -123.4, 'Skagen 2111', 'Stv');
    `);
  });

  it('replaces ? indexed placeholders with param values', () => {
    const result = format('SELECT ?, ?, ?;', {
      params: ['first', 'second', 'third'],
    });
    expect(result).toBe(dedent`
      SELECT
        first,
        second,
        third;
    `);
  });

  it('formats query with GO batch separator', () => {
    const result = format('SELECT 1 GO SELECT 2', {
      params: ['first', 'second', 'third'],
    });
    expect(result).toBe(dedent`
      SELECT
        1
      GO
      SELECT
        2
    `);
  });

  it('formats FETCH FIRST like LIMIT', () => {
    const result = format('SELECT * FETCH FIRST 2 ROWS ONLY;');
    expect(result).toBe(dedent`
      SELECT
        *
      FETCH FIRST
        2 ROWS ONLY;
    `);
  });
});
