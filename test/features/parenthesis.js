import dedent from 'dedent-js';

/**
 * Tests support for all newline options
 * @param {Function} format
 */
export default function supportsParenthesesOptions(format) {
	it('supports opening parenthesis on newline', () => {
		const result = format('SELECT a FROM ( SELECT b FROM c );');
		expect(result).toBe(dedent`
      SELECT
        a
      FROM
      (
        SELECT
          b
        FROM
          c
      );
    `);
	});

	it('supports opening parenthesis on sameline', () => {
		const result = format('SELECT a FROM ( SELECT b FROM c );', {
			parenOptions: { openParenNewline: false },
		});
		expect(result).toBe(dedent`
      SELECT
        a
      FROM (
        SELECT
          b
        FROM
          c
      );
    `);
	});

	it('supports closing parenthesis on newline', () => {
		const result = format('SELECT a FROM ( SELECT b FROM c );');
		expect(result).toBe(dedent`
      SELECT
        a
      FROM
      (
        SELECT
          b
        FROM
          c
      );
    `);
	});

	it('supports closing parenthesis on sameline', () => {
		const result = format('SELECT a FROM ( SELECT b FROM c );', {
			parenOptions: { closeParenNewline: false },
		});
		expect(result).toBe(dedent`
      SELECT
        a
      FROM
      (
        SELECT
          b
        FROM
          c );
    `);
	});
}
