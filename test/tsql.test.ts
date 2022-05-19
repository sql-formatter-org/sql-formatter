import dedent from 'dedent-js';
import { format as originalFormat, FormatFn } from '../src/sqlFormatter';
import TSqlFormatter from '../src/languages/tsql.formatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsCreateTable from './features/createTable';
import supportsAlterTable from './features/alterTable';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';
import supportsBetween from './features/between';
import supportsOperators from './features/operators';
import supportsJoin from './features/join';
import supportsConstraints from './features/constraints';
import supportsDeleteFrom from './features/deleteFrom';
import supportsParams from './options/param';
import supportsComments from './features/comments';

describe('TSqlFormatter', () => {
  const language = 'tsql';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(language, format);
  supportsCreateTable(format);
  supportsConstraints(format);
  supportsAlterTable(format);
  supportsDeleteFrom(format);
  supportsStrings(format, TSqlFormatter.stringTypes);
  supportsBetween(format);
  supportsSchema(format);
  supportsOperators(format, TSqlFormatter.operators);
  supportsJoin(format, { without: ['NATURAL'] });
  supportsParams(format, { named: ['@', '@""', '@[]'] });

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
