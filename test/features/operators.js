/**
 * Tests support for various operators
 * @param {Function} format
 * @param {String[]} operators
 */
export default function supportsOperators(format, operators = []) {
  operators.forEach((op) => {
    it(`supports ${op} operator`, () => {
      expect(format(`foo${op}bar`)).toBe(`foo ${op} bar`);
    });
  });
}
