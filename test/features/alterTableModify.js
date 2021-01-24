import dedent from 'dedent-js';
import * as sqlFormatter from '../../src/sqlFormatter';

/**
 * Tests support for ALTER TABLE ... MODIFY syntax
 * @param {String} language
 */
export default function supportsAlterTableModify(language) {
  const format = (query, cfg = {}) => sqlFormatter.format(query, { ...cfg, language });

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
