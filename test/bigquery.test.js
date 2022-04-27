import dedent from 'dedent-js';
import * as sqlFormatter from '../src/sqlFormatter';
import BigQueryFormatter from '../src/languages/bigquery.formatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsCase from './features/case';
import supportsCreateTable from './features/createTable';
import supportsAlterTable from './features/alterTable';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';
import supportsBetween from './features/between';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';

describe('BigQueryFormatter', () => {
  const language = 'bigquery';
  const format = (query, cfg = {}) => sqlFormatter.format(query, { ...cfg, language });

  behavesLikeSqlFormatter(language, format);
  supportsCase(language, format);
  supportsCreateTable(language, format);
  supportsAlterTable(language, format);
  supportsStrings(language, format, BigQueryFormatter.stringTypes);
  supportsBetween(language, format);
  supportsSchema(language, format);
  supportsJoin(language, format, { without: ['NATURAL JOIN'] });
  supportsOperators(
    language,
    format,
    BigQueryFormatter.operators,
    BigQueryFormatter.reservedLogicalOperators
  );

  it('supports # line comment', () => {
    const result = format('SELECT alpha # commment\nFROM beta');
    expect(result).toBe(dedent`
      SELECT
        alpha # commment
      FROM
        beta
		`);
  });

  it('supports STRUCT types', () => {
    const result = format(
      'SELECT STRUCT("Alpha" as name, [23.4, 26.3, 26.4, 26.1] as splits) FROM beta'
    );
    expect(result).toBe(dedent`
      SELECT
        STRUCT("Alpha" as name, [23.4, 26.3, 26.4, 26.1] as splits)
      FROM
        beta
		`);
  });

  it('supports parametric ARRAY and STRUCT', () => {
    const result = format('SELECT STRUCT<ARRAY<INT64>>([]), ARRAY<FLOAT>[1] FROM tbl');
    // TODO, v6: ARRAY<FLOAT> [] should be ARRAY<FLOAT>[]
    expect(result).toBe(dedent`
      SELECT
        STRUCT<ARRAY<INT64>>([]),
        ARRAY<FLOAT> [1]
      FROM
        tbl
		`);
  });

  it('supports parameterised types', () => {
    const result = format(
      `
			DECLARE varString STRING(11) '11charswide';
			DECLARE varBytes BYTES(8);
			DECLARE varNumeric NUMERIC(1,1);
			DECLARE varDecimal DECIMAL(1,1);
			DECLARE varBignumeric BIGNUMERIC(1,1);
			DECLARE varBigdecimal BIGDECIMAL(1,1);
		`,
      { linesBetweenQueries: 0 }
    );
    expect(result).toBe(dedent`
      DECLARE
        varString STRING(11) '11charswide';
      DECLARE
        varBytes BYTES(8);
      DECLARE
        varNumeric NUMERIC(1, 1);
      DECLARE
        varDecimal DECIMAL(1, 1);
      DECLARE
        varBignumeric BIGNUMERIC(1, 1);
      DECLARE
        varBigdecimal BIGDECIMAL(1, 1);
		`);
  });
});
