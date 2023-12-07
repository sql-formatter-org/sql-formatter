import dedent from 'dedent-js';

import { FormatFn } from '../../src/sqlFormatter.js';

interface CreateViewConfig {
  orReplace?: boolean;
  materialized?: boolean;
  ifNotExists?: boolean;
}

export default function supportsCreateView(
  format: FormatFn,
  { orReplace, materialized, ifNotExists }: CreateViewConfig = {}
) {
  it('formats CREATE VIEW', () => {
    expect(format('CREATE VIEW my_view AS SELECT id, fname, lname FROM tbl;')).toBe(dedent`
      CREATE VIEW
        my_view AS
      SELECT
        id,
        fname,
        lname
      FROM
        tbl;
    `);
  });

  it('formats CREATE VIEW with columns', () => {
    expect(format('CREATE VIEW my_view (id, fname, lname) AS SELECT * FROM tbl;')).toBe(dedent`
      CREATE VIEW
        my_view (id, fname, lname) AS
      SELECT
        *
      FROM
        tbl;
    `);
  });

  if (orReplace) {
    it('formats CREATE OR REPLACE VIEW', () => {
      expect(format('CREATE OR REPLACE VIEW v1 AS SELECT 42;')).toBe(dedent`
        CREATE OR REPLACE VIEW
          v1 AS
        SELECT
          42;
      `);
    });
  }

  if (materialized) {
    it('formats CREATE MATERIALIZED VIEW', () => {
      expect(format('CREATE MATERIALIZED VIEW mat_view AS SELECT 42;')).toBe(dedent`
        CREATE MATERIALIZED VIEW
          mat_view AS
        SELECT
          42;
      `);
    });
  }

  if (ifNotExists) {
    it('formats short CREATE VIEW IF NOT EXISTS', () => {
      expect(format('CREATE VIEW IF NOT EXISTS my_view AS SELECT 42;')).toBe(dedent`
        CREATE VIEW IF NOT EXISTS
          my_view AS
        SELECT
          42;
      `);
    });
  }
}
