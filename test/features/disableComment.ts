import dedent from 'dedent-js';

import { FormatFn } from '../../src/sqlFormatter.js';

export default function supportsDisableComment(format: FormatFn) {
  it('does not format text between /* sql-formatter-disable */ and /* sql-formatter-enable */', () => {
    const result = format(dedent`
      SELECT foo FROM bar;
      /* sql-formatter-disable */
      SELECT foo FROM bar;
      /* sql-formatter-enable */
      SELECT foo FROM bar;
    `);

    expect(result).toBe(dedent`
      SELECT
        foo
      FROM
        bar;

      /* sql-formatter-disable */
      SELECT foo FROM bar;
      /* sql-formatter-enable */
      SELECT
        foo
      FROM
        bar;
    `);
  });

  it('does not format text after /* sql-formatter-disable */ until end of file', () => {
    const result = format(dedent`
      SELECT foo FROM bar;
      /* sql-formatter-disable */
      SELECT foo FROM bar;

      SELECT foo FROM bar;
    `);

    expect(result).toBe(dedent`
      SELECT
        foo
      FROM
        bar;

      /* sql-formatter-disable */
      SELECT foo FROM bar;

      SELECT foo FROM bar;
    `);
  });

  it('does not parse code between disable/enable comments', () => {
    const result = format(dedent`
      SELECT /*sql-formatter-disable*/ ?!{}[] /*sql-formatter-enable*/ FROM bar;
    `);

    expect(result).toBe(dedent`
      SELECT
        /*sql-formatter-disable*/ ?!{}[] /*sql-formatter-enable*/
      FROM
        bar;
    `);
  });
}
