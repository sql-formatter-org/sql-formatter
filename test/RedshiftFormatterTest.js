import dedent from 'dedent-js';
import * as sqlFormatter from '../src/sqlFormatter';
import RedshiftFormatter from '../src/languages/RedshiftFormatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsAlterTable from './features/alterTable';
import supportsAlterTableModify from './features/alterTableModify';
import supportsCreateTable from './features/createTable';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';

describe('RedshiftFormatter', () => {
	const format = (query, cfg = {}) => sqlFormatter.format(query, { ...cfg, language: 'redshift' });

	behavesLikeSqlFormatter(format);
	supportsCreateTable(format);
	supportsAlterTable(format);
	supportsAlterTableModify(format);
	supportsStrings(format, RedshiftFormatter.stringTypes);
	supportsSchema(format);
	supportsOperators(
		format,
		RedshiftFormatter.operators,
		RedshiftFormatter.reservedLogicalOperators
	);
	supportsJoin(format);

	it('formats LIMIT', () => {
		expect(format('SELECT col1 FROM tbl ORDER BY col2 DESC LIMIT 10;')).toBe(dedent`
      SELECT
        col1
      FROM
        tbl
      ORDER BY
        col2 DESC
      LIMIT
        10;
    `);
	});

	it('formats only -- as a line comment', () => {
		const result = format(
			`
      SELECT col FROM
      -- This is a comment
      MyTable;
      `
		);
		expect(result).toBe(dedent`
      SELECT
        col
      FROM
        -- This is a comment
        MyTable;
    `);
	});

	it('recognizes @ as part of identifiers', () => {
		const result = format('SELECT @col1 FROM tbl', {
			language: 'redshift',
		});
		expect(result).toBe(dedent`
      SELECT
        @col1
      FROM
        tbl
    `);
	});

	it.skip('formats DISTKEY and SORTKEY after CREATE TABLE', () => {
		expect(
			format(
				'CREATE TABLE items (a INT PRIMARY KEY, b TEXT, c INT NOT NULL, d INT NOT NULL) DISTKEY(created_at) SORTKEY(created_at);'
			)
		).toBe(dedent`
      CREATE TABLE items (
        a INT PRIMARY KEY,
        b TEXT,
        c INT NOT NULL,
        d INT NOT NULL
      )
      DISTKEY(created_at)
      SORTKEY(created_at);
    `);
	});

	it.skip('formats COPY', () => {
		expect(
			format(
				`
        COPY schema.table
        FROM 's3://bucket/file.csv'
        IAM_ROLE 'arn:aws:iam::123456789:role/rolename'
        FORMAT AS CSV DELIMITER ',' QUOTE '"'
        REGION AS 'us-east-1'
        `
			)
		).toBe(dedent`
      COPY
        schema.table
      FROM
        's3://bucket/file.csv'
      IAM_ROLE
        'arn:aws:iam::123456789:role/rolename'
      FORMAT
        AS CSV
      DELIMITER
        ',' QUOTE '"'
      REGION
        AS 'us-east-1'
    `);
	});
});
