import * as sqlFormatter from '../../src/sqlFormatter';

/**
 * Tests support for various string syntax
 * @param {String} language
 * @param {String[]} stringTypes
 */
export default function supportsStrings(language, stringTypes = []) {
  const format = (query, cfg = {}) => sqlFormatter.format(query, { ...cfg, language });

  if (stringTypes.includes('""')) {
    it('supports double-quoted strings', () => {
      expect(format('"foo JOIN bar"')).toBe('"foo JOIN bar"');
      expect(format('"foo \\" JOIN bar"')).toBe('"foo \\" JOIN bar"');
    });
  }

  if (stringTypes.includes("''")) {
    it('supports single-quoted strings', () => {
      expect(format("'foo JOIN bar'")).toBe("'foo JOIN bar'");
      expect(format("'foo \\' JOIN bar'")).toBe("'foo \\' JOIN bar'");
    });
  }

  if (stringTypes.includes('``')) {
    it('supports backtick-quoted strings', () => {
      expect(format('`foo JOIN bar`')).toBe('`foo JOIN bar`');
      expect(format('`foo `` JOIN bar`')).toBe('`foo `` JOIN bar`');
    });
  }
}
