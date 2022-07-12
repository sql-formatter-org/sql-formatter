import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter';

export default function supportsOperators(
  format: FormatFn,
  operators: string[],
  logicalOperators: string[] = ['AND', 'OR']
) {
  operators.forEach(op => {
    it(`supports ${op} operator`, () => {
      expect(format(`foo${op}bar`)).toBe(`foo ${op} bar`);
    });
  });

  operators.forEach(op => {
    it(`supports ${op} operator in dense mode`, () => {
      expect(format(`foo ${op} bar`, { denseOperators: true })).toBe(`foo${op}bar`);
    });
  });

  logicalOperators.forEach(op => {
    it(`supports ${op} operator`, () => {
      const result = format(`SELECT true ${op} false AS foo;`);
      expect(result).toBe(dedent`
        SELECT
          true
          ${op} false AS foo;
      `);
    });
  });

  it('supports set operators', () => {
    expect(format('foo ALL bar')).toBe('foo ALL bar');
    expect(format('foo = ANY (1, 2, 3)')).toBe('foo = ANY(1, 2, 3)'); // TODO: should not format as function
    expect(format('EXISTS bar')).toBe('EXISTS bar');
    expect(format('foo IN (1, 2, 3)')).toBe('foo IN (1, 2, 3)');
    expect(format("foo LIKE 'hello%'")).toBe("foo LIKE 'hello%'");
    expect(format('foo IS NULL')).toBe('foo IS NULL');
    expect(format('UNIQUE foo')).toBe('UNIQUE foo');
  });
}
