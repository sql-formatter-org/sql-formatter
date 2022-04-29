import dedent from 'dedent-js';

/**
 * Tests for all the config options
 * @param {string} language
 * @param {Function} format
 */
export default function supportsConfigOptions(language, format) {
  it('supports indent option', () => {
    const result = format('SELECT count(*),Column1 FROM Table1;', {
      indent: '    ',
    });

    expect(result).toBe(dedent`
      SELECT
          count(*),
          Column1
      FROM
          Table1;
    `);
  });

  it('supports linesBetweenQueries option', () => {
    const result = format('SELECT * FROM foo; SELECT * FROM bar;', { linesBetweenQueries: 2 });
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        foo;


      SELECT
        *
      FROM
        bar;
    `);
  });
}
