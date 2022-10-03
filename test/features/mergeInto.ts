import dedent from 'dedent-js';

import { FormatFn } from '../../src/sqlFormatter.js';

export default function supportsMergeInto(format: FormatFn) {
  it('formats MERGE INTO', () => {
    const result = format(
      `MERGE INTO DetailedInventory AS t
      USING Inventory AS i
      ON t.product = i.product
      WHEN MATCHED THEN
        UPDATE SET quantity = t.quantity + i.quantity
      WHEN NOT MATCHED THEN
        INSERT (product, quantity) VALUES ('Horse saddle', 12);`
    );
    // The indentation here is not ideal, but at least it's not a complete crap
    expect(result).toBe(dedent`
      MERGE INTO
        DetailedInventory AS t USING Inventory AS i ON t.product = i.product
      WHEN MATCHED THEN
      UPDATE SET
        quantity = t.quantity + i.quantity
      WHEN NOT MATCHED THEN
      INSERT
        (product, quantity)
      VALUES
        ('Horse saddle', 12);
    `);
  });
}
