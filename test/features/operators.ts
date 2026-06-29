import dedent from 'dedent-js';

import { FormatFn } from '../../src/sqlFormatter.js';

export const standardOperators = ['+', '-', '*', '/', '>', '<', '=', '<>', '<=', '>=', '!='];

type OperatorsConfig = {
  logicalOperators?: string[];
  any?: boolean;
};

export default function supportsOperators(
  format: FormatFn,
  operators: string[],
  cfg: OperatorsConfig = {}
) {
  operators.forEach(op => {
    it(`supports ${op} operator`, () => {
      // Would be simpler to test with "foo${op}bar"
      // but this doesn't work with "-" operator in bigQuery,
      // where foo-bar is detected as identifier
      expect(format(`foo${op} bar ${op}zap`)).toBe(`foo ${op} bar ${op} zap`);
    });
  });

  operators.forEach(op => {
    it(`supports ${op} operator in dense mode`, () => {
      expect(format(`foo ${op} bar`, { denseOperators: true })).toBe(`foo${op}bar`);
    });
  });

  if (operators.includes('-')) {
    it('does not glue a "-" in front of another "-" in dense mode', () => {
      // "a - -b" / "1 - -1" must not be densed into "a--b" / "1--1":
      // the "--" would re-parse as a line comment and silently swallow the rest of the line.
      expect(format('SELECT a - -b', { denseOperators: true })).toBe(dedent`
      SELECT
        a- -b
    `);
      expect(format('SELECT 1 - -1', { denseOperators: true })).toBe(dedent`
      SELECT
        1- -1
    `);
    });
  }

  (cfg.logicalOperators || ['AND', 'OR']).forEach(op => {
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
    expect(format('EXISTS bar')).toBe('EXISTS bar');
    expect(format('foo IN (1, 2, 3)')).toBe('foo IN (1, 2, 3)');
    expect(format('foo NOT IN (1, 2, 3)')).toBe('foo NOT IN (1, 2, 3)');
    expect(format("foo LIKE 'hello%'")).toBe("foo LIKE 'hello%'");
    expect(format('foo IS NULL')).toBe('foo IS NULL');
    expect(format('UNIQUE foo')).toBe('UNIQUE foo');
  });

  if (cfg.any) {
    it('supports ANY set-operator', () => {
      expect(format('foo = ANY (1, 2, 3)')).toBe('foo = ANY (1, 2, 3)');
    });
  }
}
