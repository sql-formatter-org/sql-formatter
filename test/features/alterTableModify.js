import dedent from 'dedent-js';

/**
 * Tests support for ALTER TABLE ... MODIFY syntax
 * @param {string} language
 * @param {Function} format
 */
export default function supportsAlterTableModify(language, format) {
	it('formats ALTER TABLE ... MODIFY statement', () => {
		const result = format('ALTER TABLE supplier MODIFY supplier_name char(100) NOT NULL;');
		expect(result).toBe(dedent`
      ALTER TABLE
        supplier
      MODIFY
        supplier_name CHAR(100) NOT NULL;
    `);
	});
}
