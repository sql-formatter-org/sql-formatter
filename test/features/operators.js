import dedent from 'dedent-js';

/**
 * Tests support for various operators
 * @param {Function} format
 * @param {String[]} operators
 */
export default function supportsOperators(format, operators = [], logicalOperators = []) {
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

	it('supports breaking before boolean operators', () => {
		const result = format(
			`SELECT a FROM b WHERE TRUE ${logicalOperators.reduce(
				(str, op, i) => str + ` ${op} condition${i + 1}`,
				''
			)};`
		);
		expect(result).toBe(dedent`
      SELECT
        a
      FROM
        b
      WHERE
        TRUE
      ${logicalOperators.map((op, i) => `  ${op} condition${i + 1}`).join('\n')};
		`);
	});

	it('supports breaking after boolean operators', () => {
		const result = format(
			`SELECT a FROM b WHERE TRUE ${logicalOperators.reduce(
				(str, op, i) => str + ` ${op} condition${i + 1}`,
				''
			)};`,
			{ breakBeforeBooleanOperator: false }
		);
		expect(result).toBe(dedent`
      SELECT
        a
      FROM
        b
      WHERE
        TRUE ${logicalOperators.map((op, i) => `${op}\n  condition${i + 1}`).join(' ')};
		`);
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
