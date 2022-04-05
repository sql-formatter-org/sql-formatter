/**
 * Tests support for BETWEEN _ AND _ syntax
 * @param {string} language
 * @param {Function} format
 */
export default function supportsBetween(language, format) {
	it('formats BETWEEN _ AND _ on single line', () => {
		expect(format('foo BETWEEN bar AND baz')).toBe('foo BETWEEN bar AND baz');
	});
}
