import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter.js';

interface LimitingTypes {
  limit?: boolean;
  offset?: boolean;
  fetchFirst?: boolean;
  fetchNext?: boolean;
}

export default function supportsLimiting(format: FormatFn, types: LimitingTypes) {
  if (types.limit) {
    it('formats LIMIT with two comma-separated values on single line', () => {
      const result = format('SELECT * FROM tbl LIMIT 5, 10;');
      expect(result).toBe(dedent`
        SELECT
          *
        FROM
          tbl
        LIMIT
          5, 10;
      `);
    });

    // Regression test for #303
    it('formats LIMIT with complex expressions', () => {
      const result = format('SELECT * FROM tbl LIMIT abs(-5) - 1, (2 + 3) * 5;');
      expect(result).toBe(dedent`
        SELECT
          *
        FROM
          tbl
        LIMIT
          abs(-5) - 1, (2 + 3) * 5;
      `);
    });

    // Regression test for #301
    it('formats LIMIT with comments', () => {
      const result = format('SELECT * FROM tbl LIMIT --comment\n 5,--comment\n6;');
      expect(result).toBe(dedent`
          SELECT
            *
          FROM
            tbl
          LIMIT --comment
            5, --comment
            6;
      `);
    });

    // Regression test for #412
    it('formats LIMIT in tabular style', () => {
      const result = format('SELECT * FROM tbl LIMIT 5, 6;', { indentStyle: 'tabularLeft' });
      expect(result).toBe(dedent`
        SELECT    *
        FROM      tbl
        LIMIT     5, 6;
      `);
    });
  }

  if (types.limit && types.offset) {
    it('formats LIMIT of single value and OFFSET', () => {
      const result = format('SELECT * FROM tbl LIMIT 5 OFFSET 8;');
      expect(result).toBe(dedent`
        SELECT
          *
        FROM
          tbl
        LIMIT
          5
        OFFSET
          8;
      `);
    });
  }

  if (types.fetchFirst) {
    it('formats FETCH FIRST', () => {
      const result = format('SELECT * FROM tbl FETCH FIRST 10 ROWS ONLY;');
      expect(result).toBe(dedent`
        SELECT
          *
        FROM
          tbl
        FETCH FIRST
          10 ROWS ONLY;
      `);
    });
  }

  if (types.fetchNext) {
    it('formats FETCH NEXT', () => {
      const result = format('SELECT * FROM tbl FETCH NEXT 1 ROW ONLY;');
      expect(result).toBe(dedent`
        SELECT
          *
        FROM
          tbl
        FETCH NEXT
          1 ROW ONLY;
      `);
    });
  }

  if (types.fetchFirst && types.offset) {
    it('formats OFFSET ... FETCH FIRST', () => {
      const result = format('SELECT * FROM tbl OFFSET 250 ROWS FETCH FIRST 5 ROWS ONLY;');
      expect(result).toBe(dedent`
        SELECT
          *
        FROM
          tbl
        OFFSET
          250 ROWS
        FETCH FIRST
          5 ROWS ONLY;
      `);
    });
  }
}
