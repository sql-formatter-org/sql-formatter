import dedent from 'dedent-js';

export default function supportsAlterTableModify(language, format) {
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
