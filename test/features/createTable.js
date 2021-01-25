import dedent from 'dedent-js';
import * as sqlFormatter from '../../src/sqlFormatter';

/**
 * Tests support for CREATE TABLE syntax
 * @param {String} language
 */
export default function supportsCreateTable(language) {
  const format = (query, cfg = {}) => sqlFormatter.format(query, { ...cfg, language });

  it('formats short CREATE TABLE', () => {
    expect(format('CREATE TABLE items (a INT PRIMARY KEY, b TEXT);')).toBe(
      'CREATE TABLE items (a INT PRIMARY KEY, b TEXT);'
    );
  });

  // The decision to place it to multiple lines is made based on the length of text inside braces
  // ignoring the whitespace. (Which is not quite right :P)
  it('formats long CREATE TABLE', () => {
    expect(
      format('CREATE TABLE items (a INT PRIMARY KEY, b TEXT, c INT NOT NULL, doggie INT NOT NULL);')
    ).toBe(dedent`
      CREATE TABLE items (
        a INT PRIMARY KEY,
        b TEXT,
        c INT NOT NULL,
        doggie INT NOT NULL
      );
    `);
  });
}
