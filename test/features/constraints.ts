import dedent from 'dedent-js';

import { FormatFn } from 'src/sqlFormatter';

const standardActions = ['CURRENT_TIMESTAMP'];

export default function supportsConstraints(format: FormatFn, actions: string[] = standardActions) {
  actions.forEach(action => {
    it(`treats ON UPDATE & ON DELETE ${action} as distinct keywords from ON`, () => {
      expect(
        format(`
        CREATE TABLE foo (
          update_time datetime ON UPDATE ${action},
          delete_time datetime ON DELETE ${action},
        );
      `)
      ).toBe(dedent`
        CREATE TABLE
          foo (
            update_time datetime ON UPDATE ${action},
            delete_time datetime ON DELETE ${action},
          );
      `);
    });
  });
}
