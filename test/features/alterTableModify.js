import dedent from 'dedent-js';

/**
 * Tests support for ALTER TABLE ... MODIFY syntax
 * @param {Function} format
 */
export default function supportsAlterTableModify(format) {
  it('formats ALTER TABLE ... MODIFY statement', () => {
    const result = format('ALTER TABLE supplier MODIFY supplier_name char(100) NOT NULL;');
    expect(result).toBe(dedent`
      ALTER TABLE
        supplier
      MODIFY
        supplier_name char(100) NOT NULL;
    `);
  });
}
