import dedent from 'dedent-js';

/**
 * Tests support for various operators
 * @param {Function} format
 * @param {String[]} operators
 */
export default function supportsOperators(format, operators = []) {
	operators.forEach(op => {
		it(`supports ${op} operator`, () => {
			expect(format(`foo${op}bar`)).toBe(`foo ${op} bar`);
		});
	});

	it('supports semicolon on same line', () => {
		const result = format(`SELECT a FROM b;`);
		expect(result).toBe(dedent`
      SELECT
        a
      FROM
        b;
		`);
	});

	it('supports semicolon on new line', () => {
		const result = format(`SELECT a FROM b;`, { semicolonNewline: true });
		expect(result).toBe(dedent`
      SELECT
        a
      FROM
        b
      ;
		`);
	});
}
