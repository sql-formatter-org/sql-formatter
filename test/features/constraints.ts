import dedent from 'dedent-js';
import { SqlLanguage, FormatFn } from '../../src/sqlFormatter';

export default function supportsConstraints(language: SqlLanguage, format: FormatFn) {
  it('treats ON UPDATE & ON DELETE as distinct keywords from ON', () => {
    expect(
      format(`
      CREATE TABLE foo (
        update_time datetime ON UPDATE CURRENT_TIMESTAMP,
        other_table_id int NOT NULL ON DELETE CASCADE
      );
    `)
    ).toBe(dedent`
      CREATE TABLE
        foo (
          update_time datetime ON UPDATE CURRENT_TIMESTAMP,
          other_table_id int NOT NULL ON DELETE CASCADE
        );
    `);
  });
}
