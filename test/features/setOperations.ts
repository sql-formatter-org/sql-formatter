import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter';

export const standardSetOperations = [
  'UNION',
  'UNION ALL',
  'UNION DISTINCT',
  'EXCEPT',
  'EXCEPT ALL',
  'EXCEPT DISTINCT',
  'INTERSECT',
  'INTERSECT ALL',
  'INTERSECT DISTINCT',
];

export default function supportsSetOperations(
  format: FormatFn,
  operations: string[] = standardSetOperations
) {
  operations.forEach(op => {
    it(`formats ${op}`, () => {
      expect(format(`SELECT * FROM foo ${op} SELECT * FROM bar;`)).toBe(dedent`
        SELECT
          *
        FROM
          foo
        ${op}
        SELECT
          *
        FROM
          bar;
      `);
    });
  });
}
