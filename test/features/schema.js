import dedent from 'dedent-js';

/**
 * Tests support for SET SCHEMA syntax
 * @param {string} language
 * @param {Function} format
 */
export default function supportsSchema(language, format) {
  it('formats simple SET SCHEMA statements', () => {
    const result = format('SET SCHEMA schema1;');
    expect(result).toBe(dedent`
      SET SCHEMA
        schema1;
    `);
  });
}
