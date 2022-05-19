import dedent from 'dedent-js';
import { SqlLanguage, FormatFn } from '../../src/sqlFormatter';

interface ParamsTypes {
  indexed: ('?' | '$')[];
}

export default function supportsParams(
  language: SqlLanguage,
  format: FormatFn,
  params: ParamsTypes
) {
  describe('supports params', () => {
    if (params.indexed.includes('?')) {
      it('leaves ? indexed placeholders as is when no params config provided', () => {
        const result = format('SELECT ?, ?, ?;');
        expect(result).toBe(dedent`
          SELECT
            ?,
            ?,
            ?;
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

      it('recognizes ?[0-9]* placeholders', () => {
        const result = format('SELECT ?1, ?25, ?;');
        expect(result).toBe(dedent`
          SELECT
            ?1,
            ?25,
            ?;
        `);
      });

      it('replaces ? numbered placeholders with param values', () => {
        const result = format('SELECT ?1, ?2, ?0;', {
          params: {
            0: 'first',
            1: 'second',
            2: 'third',
          },
        });
        expect(result).toBe(dedent`
          SELECT
            second,
            third,
            first;
        `);
      });
    }

    if (params.indexed.includes('$')) {
      it('recognizes $n placeholders', () => {
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
    }
  });
}
