import dedent from 'dedent-js';
import { format as originalFormat, FormatFn } from '../src/sqlFormatter';
import TSqlFormatter from '../src/languages/tsql.formatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsCase from './features/case';
import supportsCreateTable from './features/createTable';
import supportsAlterTable from './features/alterTable';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';
import supportsBetween from './features/between';
import supportsOperators from './features/operators';
import supportsJoin from './features/join';

describe('TSqlFormatter', () => {
  const language = 'tsql';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(language, format);
  supportsCase(language, format);
  supportsCreateTable(language, format);
  supportsAlterTable(language, format);
  supportsStrings(language, format, TSqlFormatter.stringTypes);
  supportsBetween(language, format);
  supportsSchema(language, format);
  supportsOperators(
    language,
    format,
    TSqlFormatter.operators,
    TSqlFormatter.reservedLogicalOperators
  );
  supportsJoin(language, format, { without: ['NATURAL'] });

  // TODO: The following are duplicated from StandardSQLFormatter test

  it('formats INSERT without INTO', () => {
    const result = format(
      "INSERT Customers (ID, MoneyBalance, Address, City) VALUES (12,-123.4, 'Skagen 2111','Stv');"
    );
    expect(result).toBe(dedent`
      INSERT
        Customers (ID, MoneyBalance, Address, City)
      VALUES
        (12, -123.4, 'Skagen 2111', 'Stv');
    `);
  });

  it('recognizes @variables', () => {
    const result = format('SELECT @variable, @"var name", @[var name];');
    expect(result).toBe(dedent`
      SELECT
        @variable,
        @"var name",
        @[var name];
    `);
  });

  it('replaces @variables with param values', () => {
    const result = format('SELECT @variable, @"var name1", @[var name2];', {
      params: {
        'variable': "'var value'",
        'var name1': "'var value1'",
        'var name2': "'var value2'",
      },
    });
    expect(result).toBe(dedent`
      SELECT
        'var value',
        'var value1',
        'var value2';
    `);
  });

  it('formats SELECT query with CROSS JOIN', () => {
    const result = format('SELECT a, b FROM t CROSS JOIN t2 on t.id = t2.id_t');
    expect(result).toBe(dedent`
      SELECT
        a,
        b
      FROM
        t
        CROSS JOIN t2 on t.id = t2.id_t
    `);
  });
});
