import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter';

interface AlterTableConfig {
  addColumn?: boolean;
  dropColumn?: boolean;
  modify?: boolean;
  renameTo?: boolean;
  renameColumn?: boolean;
}

export default function supportsAlterTable(format: FormatFn, cfg: AlterTableConfig = {}) {
  if (cfg.addColumn) {
    it('formats ALTER TABLE ... ADD COLUMN query', () => {
      const result = format('ALTER TABLE supplier ADD COLUMN unit_price DECIMAL NOT NULL;');
      expect(result).toBe(dedent`
        ALTER TABLE
          supplier
        ADD COLUMN
          unit_price DECIMAL NOT NULL;
      `);
    });
  }

  if (cfg.dropColumn) {
    it('formats ALTER TABLE ... DROP COLUMN query', () => {
      const result = format('ALTER TABLE supplier DROP COLUMN unit_price;');
      expect(result).toBe(dedent`
        ALTER TABLE
          supplier
        DROP COLUMN
          unit_price;
      `);
    });
  }

  if (cfg.modify) {
    it('formats ALTER TABLE ... MODIFY statement', () => {
      const result = format('ALTER TABLE supplier MODIFY supplier_id DECIMAL NULL;');
      expect(result).toBe(dedent`
        ALTER TABLE
          supplier
        MODIFY
          supplier_id DECIMAL NULL;
      `);
    });
  }

  if (cfg.renameTo) {
    it('formats ALTER TABLE ... RENAME TO statement', () => {
      const result = format('ALTER TABLE supplier RENAME TO the_one_who_supplies;');
      expect(result).toBe(dedent`
        ALTER TABLE
          supplier
        RENAME TO
          the_one_who_supplies;
      `);
    });
  }

  if (cfg.renameColumn) {
    it('formats ALTER TABLE ... RENAME COLUMN statement', () => {
      const result = format('ALTER TABLE supplier RENAME COLUMN supplier_id TO id;');
      expect(result).toBe(dedent`
        ALTER TABLE
          supplier
        RENAME COLUMN
          supplier_id TO id;
      `);
    });
  }
}
